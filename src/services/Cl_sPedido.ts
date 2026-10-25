import Cl_sSupabase from "./Cl_sSupabase.js";
import { ItemVenta } from "../models/Cl_mPedido.js";
import { fechaHoyVE, horaAhoraVE } from "../utils/fechaVE.js";

export default class Cl_sPedido {
    private static enVuelo = new Map<string, number>();
    private static VENTANA_MS = 2500;

    static async agregar(pedido: any): Promise<{ ok: boolean; mensaje: string; ventaId?: string }> {
        if (!pedido.Items?.length) return { ok: false, mensaje: "Debe tener al menos un producto" };
        if (!pedido.MetodoPago) return { ok: false, mensaje: "Seleccione método de pago" };

        const firma = [
            (pedido.Cedula || "").trim().toLowerCase(),
            Number(pedido.TotalUSD || 0).toFixed(2),
            (pedido.Items as ItemVenta[]).map(i => `${i.codigo}:${i.cantidad}`).join("|"),
        ].join("::");

        const ahora = Date.now();
        const previo = this.enVuelo.get(firma);

        if (previo && (ahora - previo) < this.VENTANA_MS) {
            console.warn("[Pedido] Venta duplicada ignorada (ventana de idempotencia):", firma);
            return { ok: false, mensaje: "Venta duplicada detectada. Espere un momento." };
        }

        this.enVuelo.set(firma, ahora);

        try {
            const clienteId = await this.upsertCliente(pedido.Cedula, pedido.NomCliente);
            const usuario = await Cl_sSupabase.getUsuarioActual();

            const { data: venta, error: errVenta } = await Cl_sSupabase.client
                .from("ventas")
                .insert({
                    cliente_id: clienteId,
                    cedula: (pedido.Cedula || "").trim(),
                    nom_cliente: (pedido.NomCliente || "Consumidor Final").trim(),
                    vendedor_id: usuario?.id || null,
                    metodo_pago: pedido.MetodoPago,
                    detalles_pago: pedido.DetallesPago || null,
                    estado: pedido.estado || "Pagada",
                    tasa_bcv: Number(pedido.TasaBCV) || 1,
                    fecha: pedido.Fecha || fechaHoyVE(),
                    hora: pedido.Hora || horaAhoraVE(),
                })
                .select("id")
                .single();

            if (errVenta || !venta) {
                return { ok: false, mensaje: errVenta?.message || "Error al crear venta" };
            }

            const items = (pedido.Items as ItemVenta[]).map(i => ({
                venta_id: venta.id,
                producto_id: null,
                codigo: i.codigo,
                nombre: i.nombre,
                tipo_venta: i.tipoVenta,
                cantidad: i.cantidad,
                precio_usd: i.precioUSD,
                precio_bs: i.precioBs,
                subtotal_usd: i.subtotalUSD,
                subtotal_bs: i.subtotalBs,
                costo_usd: i.costoUSD,
            }));

            const { error: errItems } = await Cl_sSupabase.client
                .from("venta_items")
                .insert(items);

            if (errItems) {
                await Cl_sSupabase.client.from("ventas").delete().eq("id", venta.id);
                return { ok: false, mensaje: errItems.message };
            }

            return { ok: true, mensaje: "Venta registrada", ventaId: venta.id };
        } finally {
            setTimeout(() => {
                const t = this.enVuelo.get(firma);
                if (t === ahora) this.enVuelo.delete(firma);
            }, this.VENTANA_MS + 500);
        }
    }

    static async obtenerTodos(): Promise<{ ok: boolean; data: any[] }> {
        const { data, error } = await Cl_sSupabase.client
            .from("ventas")
            .select(`
                id, numero, cedula, nom_cliente, metodo_pago, detalles_pago,
                estado, tasa_bcv, total_usd, total_bs, costo_total_usd,
                ganancia_usd, ganancia_bs, modificada, fecha, hora, created_at,
                venta_items (
                    codigo, nombre, tipo_venta, cantidad,
                    precio_usd, precio_bs, subtotal_usd, subtotal_bs, costo_usd
                )
            `)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("[Pedidos] obtenerTodos:", error);
            return { ok: false, data: [] };
        }

        const normalizados = (data || []).map((v: any) => ({
            id: v.id,
            Numero: v.numero,
            NomCliente: v.nom_cliente,
            Cedula: v.cedula,
            MetodoPago: v.metodo_pago,
            DetallesPago: v.detalles_pago,
            estado: v.estado,
            TasaBCV: Number(v.tasa_bcv),
            TotalUSD: Number(v.total_usd),
            TotalBs: Number(v.total_bs),
            Fecha: v.fecha,
            Hora: v.hora,
            createdAt: v.created_at,
            modificada: v.modificada,
            Items: (v.venta_items || []).map((i: any) => ({
                codigo: i.codigo,
                nombre: i.nombre,
                tipoVenta: i.tipo_venta,
                cantidad: Number(i.cantidad),
                precioUSD: Number(i.precio_usd),
                precioBs: Number(i.precio_bs),
                subtotalUSD: Number(i.subtotal_usd),
                subtotalBs: Number(i.subtotal_bs),
                costoUSD: Number(i.costo_usd),
            })),
        }));

        return { ok: true, data: normalizados };
    }

    static async actualizarEstado(id: string, nuevoEstado: string): Promise<{ ok: boolean; mensaje: string }> {
        if (!id) return { ok: false, mensaje: "ID inválido" };
        const permitidos = ["Pagada", "Fiada", "Cancelada"];
        if (!permitidos.includes(nuevoEstado)) return { ok: false, mensaje: "Estado no permitido" };

        const { error } = await Cl_sSupabase.client
            .from("ventas")
            .update({ estado: nuevoEstado })
            .eq("id", id);

        if (error) return { ok: false, mensaje: error.message };
        return { ok: true, mensaje: "Estado actualizado" };
    }

    static async actualizar(id: string, data: any): Promise<{ ok: boolean; mensaje: string }> {
        if (!id) return { ok: false, mensaje: "ID inválido" };

        const { error: errDel } = await Cl_sSupabase.client
            .from("venta_items")
            .delete()
            .eq("venta_id", id);

        if (errDel) return { ok: false, mensaje: errDel.message };

        const { error: errVenta } = await Cl_sSupabase.client
            .from("ventas")
            .update({
                nom_cliente: data.NomCliente || "Consumidor Final",
                cedula: data.Cedula || "",
                metodo_pago: data.MetodoPago,
                detalles_pago: data.DetallesPago,
                estado: data.estado,
                tasa_bcv: Number(data.TasaBCV),
                modificada: true,
            })
            .eq("id", id);

        if (errVenta) return { ok: false, mensaje: errVenta.message };

        const items = (data.Items as ItemVenta[]).map(i => ({
            venta_id: id,
            producto_id: null,
            codigo: i.codigo,
            nombre: i.nombre,
            tipo_venta: i.tipoVenta,
            cantidad: i.cantidad,
            precio_usd: i.precioUSD,
            precio_bs: i.precioBs,
            subtotal_usd: i.subtotalUSD,
            subtotal_bs: i.subtotalBs,
            costo_usd: i.costoUSD,
        }));

        const { error: errItems } = await Cl_sSupabase.client
            .from("venta_items")
            .insert(items);

        if (errItems) return { ok: false, mensaje: errItems.message };
        return { ok: true, mensaje: "Venta actualizada" };
    }

    private static async upsertCliente(cedula: string, nombre: string): Promise<string | null> {
        const ced = (cedula || "").trim();
        if (!ced) return null;

        const { data: existente } = await Cl_sSupabase.client
            .from("clientes")
            .select("id")
            .eq("cedula", ced)
            .maybeSingle();

        if (existente) return existente.id;

        const { data, error } = await Cl_sSupabase.client
            .from("clientes")
            .insert({ cedula: ced, nombre: (nombre || "Consumidor Final").trim() })
            .select("id")
            .single();

        if (error) {
            console.warn("[Clientes] upsert:", error.message);
            return null;
        }
        return data?.id || null;
    }

    static async eliminar(id: string): Promise<{ ok: boolean; mensaje: string }> {
        if (!id) return { ok: false, mensaje: "ID inválido" };

        const { error: errItems } = await Cl_sSupabase.client
            .from("venta_items")
            .delete()
            .eq("venta_id", id);

        if (errItems) {
            console.error("[Pedido] eliminar items:", errItems);
            return { ok: false, mensaje: errItems.message };
        }

        const { error: errVenta } = await Cl_sSupabase.client
            .from("ventas")
            .delete()
            .eq("id", id);

        if (errVenta) {
            console.error("[Pedido] eliminar venta:", errVenta);
            return { ok: false, mensaje: errVenta.message };
        }

        return { ok: true, mensaje: "Venta eliminada" };
    }
}