import Cl_sSupabase from "./Cl_sSupabase.js";
export default class Cl_sProducto {
    static async obtenerTodos() {
        const { data, error } = await Cl_sSupabase.client
            .from("productos")
            .select(`
                id, codigo, nombre, tipo_venta, precio_compra, precio_venta,
                stock, stock_minimo, imagen, disponible,
                categoria_id,
                categorias:categoria_id ( id, nombre )
            `)
            .order("nombre");
        if (error) {
            console.error("[Productos] obtenerTodos:", error);
            return { ok: false, data: [] };
        }
        const normalizados = (data || []).map((p) => ({
            id: p.id,
            codigo: p.codigo,
            nombre: p.nombre,
            categoria: p.categorias?.nombre || "Otros",
            categoriaId: p.categoria_id,
            tipoVenta: p.tipo_venta,
            precioCompra: Number(p.precio_compra),
            precioVenta: Number(p.precio_venta),
            stock: Number(p.stock),
            stockMinimo: Number(p.stock_minimo),
            imagen: p.imagen || "",
            disponible: p.disponible,
        }));
        return { ok: true, data: normalizados };
    }
    static async obtenerNombresUnicos() {
        const res = await this.obtenerTodos();
        if (!res.ok)
            return { ok: false, nombres: [] };
        const nombres = [...new Set(res.data.map(p => p.nombre))].sort();
        return { ok: true, nombres };
    }
    static async agregar(producto) {
        if (!producto.codigo?.trim())
            return { ok: false, mensaje: "El código es obligatorio" };
        if (!producto.nombre?.trim())
            return { ok: false, mensaje: "El nombre es obligatorio" };
        if (!producto.categoria?.trim())
            return { ok: false, mensaje: "La categoría es obligatoria" };
        if (!producto.precioCompra || producto.precioCompra <= 0)
            return { ok: false, mensaje: "Precio de compra inválido" };
        if (!producto.precioVenta || producto.precioVenta <= 0)
            return { ok: false, mensaje: "Precio de venta inválido" };
        if (producto.precioVenta < producto.precioCompra)
            return { ok: false, mensaje: "El precio de venta no puede ser menor al de compra" };
        const { data: cat } = await Cl_sSupabase.client
            .from("categorias")
            .select("id")
            .eq("nombre", producto.categoria)
            .maybeSingle();
        const registro = {
            codigo: producto.codigo.trim(),
            nombre: producto.nombre.trim(),
            categoria_id: cat?.id || null,
            tipo_venta: producto.tipoVenta || "gramos",
            precio_compra: Number(producto.precioCompra),
            precio_venta: Number(producto.precioVenta),
            stock: Number(producto.stock) || 0,
            stock_minimo: Number(producto.stockMinimo) || (producto.tipoVenta === "gramos" ? 500 : 3),
            imagen: producto.imagen || null,
            disponible: producto.disponible !== false,
        };
        const { error } = await Cl_sSupabase.client.from("productos").insert(registro);
        if (error) {
            if (error.code === "23505")
                return { ok: false, mensaje: "Ya existe un producto con ese código" };
            return { ok: false, mensaje: error.message };
        }
        return { ok: true, mensaje: "Producto agregado" };
    }
    static async actualizar(id, producto) {
        if (!id)
            return { ok: false, mensaje: "ID inválido" };
        const cambios = {};
        if (producto.codigo !== undefined)
            cambios.codigo = producto.codigo.trim();
        if (producto.nombre !== undefined)
            cambios.nombre = producto.nombre.trim();
        if (producto.tipoVenta !== undefined)
            cambios.tipo_venta = producto.tipoVenta;
        if (producto.precioCompra !== undefined)
            cambios.precio_compra = Number(producto.precioCompra);
        if (producto.precioVenta !== undefined)
            cambios.precio_venta = Number(producto.precioVenta);
        if (producto.stock !== undefined)
            cambios.stock = Number(producto.stock);
        if (producto.stockMinimo !== undefined)
            cambios.stock_minimo = Number(producto.stockMinimo);
        if (producto.imagen !== undefined)
            cambios.imagen = producto.imagen || null;
        if (producto.disponible !== undefined)
            cambios.disponible = producto.disponible;
        if (producto.categoria !== undefined) {
            const { data: cat } = await Cl_sSupabase.client
                .from("categorias")
                .select("id")
                .eq("nombre", producto.categoria)
                .maybeSingle();
            cambios.categoria_id = cat?.id || null;
        }
        const { error } = await Cl_sSupabase.client
            .from("productos")
            .update(cambios)
            .eq("id", id);
        if (error)
            return { ok: false, mensaje: error.message };
        return { ok: true, mensaje: "Producto actualizado" };
    }
    static async eliminar(id) {
        if (!id)
            return { ok: false, mensaje: "ID inválido" };
        const { error } = await Cl_sSupabase.client.from("productos").delete().eq("id", id);
        if (error)
            return { ok: false, mensaje: error.message };
        return { ok: true, mensaje: "Producto eliminado" };
    }
    static async descontarStock(codigo, cantidad) {
        if (!codigo)
            return { ok: false, mensaje: "Código inválido" };
        const { data, error: errLeer } = await Cl_sSupabase.client
            .from("productos")
            .select("id, stock")
            .eq("codigo", codigo)
            .maybeSingle();
        if (errLeer || !data) {
            console.error("[Producto] descontarStock: no encontrado", codigo, errLeer);
            return { ok: false, mensaje: "Producto no encontrado" };
        }
        const nuevoStock = Math.max(0, Number(data.stock) - Number(cantidad));
        const { error } = await Cl_sSupabase.client
            .from("productos")
            .update({ stock: nuevoStock })
            .eq("id", data.id);
        if (error) {
            console.error("[Producto] descontarStock:", error);
            return { ok: false, mensaje: error.message };
        }
        return { ok: true, mensaje: "Stock descontado" };
    }
    static async devolverStock(codigo, cantidad) {
        if (!codigo)
            return { ok: false, mensaje: "Código inválido" };
        const { data, error: errLeer } = await Cl_sSupabase.client
            .from("productos")
            .select("id, stock")
            .eq("codigo", codigo)
            .maybeSingle();
        if (errLeer || !data) {
            console.error("[Producto] devolverStock: no encontrado", codigo, errLeer);
            return { ok: false, mensaje: "Producto no encontrado" };
        }
        const nuevoStock = Number(data.stock) + Number(cantidad);
        const { error } = await Cl_sSupabase.client
            .from("productos")
            .update({ stock: nuevoStock })
            .eq("id", data.id);
        if (error) {
            console.error("[Producto] devolverStock:", error);
            return { ok: false, mensaje: error.message };
        }
        return { ok: true, mensaje: "Stock devuelto" };
    }
}
//# sourceMappingURL=Cl_sProducto.js.map