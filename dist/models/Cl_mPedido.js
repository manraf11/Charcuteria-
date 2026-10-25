import { fechaHoyVE, horaAhoraVE } from "../utils/fechaVE.js";
export default class Cl_mPedido {
    _id;
    _nomCliente = "";
    _cedula = "";
    _items = [];
    _metodoPago = "";
    _detallesPago = "";
    _fecha = "";
    _hora = "";
    _estado = "Pagada";
    _tasaBCV = 0;
    _modificada = false;
    constructor(data) {
        this._id = data.id;
        this._nomCliente = data.nomCliente || "";
        this._cedula = data.cedula || "";
        this._items = data.items ?? [];
        this._metodoPago = data.metodoPago || "";
        this._detallesPago = data.detallesPago || "";
        this._fecha = data.fecha || fechaHoyVE();
        this._hora = data.hora || horaAhoraVE();
        this._estado = data.estado || "Pagada";
        this._tasaBCV = data.tasaBCV || 1;
        this._modificada = data.modificada || false;
    }
    get id() { return this._id; }
    get nomCliente() { return this._nomCliente; }
    get cedula() { return this._cedula; }
    get items() { return this._items; }
    get metodoPago() { return this._metodoPago; }
    get detallesPago() { return this._detallesPago; }
    get fecha() { return this._fecha; }
    get hora() { return this._hora; }
    get estado() { return this._estado; }
    get tasaBCV() { return this._tasaBCV; }
    get modificada() { return this._modificada; }
    totalBs() { return this._items.reduce((s, i) => s + i.subtotalBs, 0); }
    totalUSD() { return this._items.reduce((s, i) => s + i.subtotalUSD, 0); }
    costoTotalUSD() { return this._items.reduce((s, i) => s + i.costoUSD, 0); }
    gananciaUSD() { return this.totalUSD() - this.costoTotalUSD(); }
    gananciaBs() { return this.totalBs() - this.costoTotalUSD() * this._tasaBCV; }
    cantidadTotal() { return this._items.reduce((s, i) => s + i.cantidad, 0); }
    toJSON() {
        return {
            NomCliente: this._nomCliente || "Consumidor Final",
            Cedula: this._cedula || "",
            Items: this._items,
            TotalBs: this.totalBs(),
            TotalUSD: this.totalUSD(),
            CostoTotalUSD: this.costoTotalUSD(),
            GananciaUSD: this.gananciaUSD(),
            GananciaBs: this.gananciaBs(),
            TasaBCV: this._tasaBCV,
            MetodoPago: this._metodoPago,
            DetallesPago: this._detallesPago,
            Fecha: this._fecha,
            Hora: this._hora,
            estado: this._estado,
            modificada: this._modificada,
        };
    }
    static prepararVenta(datos, id) {
        if (!datos.items || datos.items.length === 0)
            throw new Error("Agregue al menos un producto");
        if (!datos.metodoPago)
            throw new Error("Seleccione método de pago");
        let detalles = "";
        let estado = "Pagada";
        const esMixto = datos.modoPago === "mixto" && !!datos.metodoPago2;
        if (!esMixto) {
            switch (datos.metodoPago) {
                case "Pago Móvil":
                    if (!datos.referenciaPago?.trim())
                        throw new Error("Ingrese referencia de Pago Móvil");
                    const mPM = parseFloat(datos.montoPagoMovil || "");
                    if (isNaN(mPM) || mPM <= 0)
                        throw new Error("Ingrese monto pagado por Pago Móvil");
                    detalles = `Ref: ${datos.referenciaPago.trim()} | Monto: Bs. ${mPM.toFixed(2)}`;
                    break;
                case "Punto de Venta":
                    detalles = `Punto de Venta`;
                    break;
                case "Efectivo Bs.":
                    const m = parseFloat(datos.montoEfectivo || "");
                    if (isNaN(m) || m <= 0)
                        throw new Error("Ingrese monto entregado");
                    detalles = `Entregó: Bs. ${m.toFixed(2)}`;
                    break;
                case "Divisa ($)":
                    const mDiv = parseFloat(datos.montoDivisa || "");
                    if (isNaN(mDiv) || mDiv <= 0)
                        throw new Error("Ingrese monto entregado en divisa");
                    const vuelto = datos.vueltoDivisa?.trim() || "";
                    detalles = `Divisa: $${mDiv.toFixed(2)}${vuelto ? ` | Vuelto: ${vuelto}` : ""}`;
                    break;
                case "Fiado":
                    estado = "Fiada";
                    detalles = datos.notaFiado?.trim() || "Sin nota";
                    break;
                default:
                    throw new Error("Método de pago no reconocido");
            }
        }
        else {
            if (datos.metodoPago === datos.metodoPago2) {
                throw new Error("Los dos métodos de pago deben ser diferentes");
            }
            if (datos.metodoPago2 === "Fiado") {
                throw new Error("El segundo método no puede ser Fiado");
            }
            const partes = [];
            switch (datos.metodoPago) {
                case "Pago Móvil":
                    if (!datos.referenciaPago?.trim())
                        throw new Error("Ingrese referencia del método 1");
                    const m1PM = parseFloat(datos.montoPagoMovil || "");
                    if (isNaN(m1PM) || m1PM <= 0)
                        throw new Error("Ingrese monto pagado por Pago Móvil del método 1");
                    partes.push(`1) Pago Móvil Ref: ${datos.referenciaPago.trim()} - Bs. ${m1PM.toFixed(2)}`);
                    break;
                case "Punto de Venta":
                    partes.push(`1) Punto de Venta`);
                    break;
                case "Efectivo Bs.":
                    const m1 = parseFloat(datos.montoEfectivo || "");
                    if (isNaN(m1) || m1 <= 0)
                        throw new Error("Ingrese monto en efectivo del método 1");
                    partes.push(`1) Efectivo Bs. ${m1.toFixed(2)}`);
                    break;
                case "Divisa ($)":
                    const m1Div = parseFloat(datos.montoDivisa || "");
                    if (isNaN(m1Div) || m1Div <= 0)
                        throw new Error("Ingrese monto en divisa del método 1");
                    partes.push(`1) Divisa: $${m1Div.toFixed(2)}`);
                    break;
                default:
                    throw new Error("Método 1 no reconocido");
            }
            switch (datos.metodoPago2) {
                case "Pago Móvil":
                    if (!datos.referenciaPago2?.trim())
                        throw new Error("Ingrese referencia del método 2");
                    const m2PM = parseFloat(datos.montoPagoMovil2 || "");
                    if (isNaN(m2PM) || m2PM <= 0)
                        throw new Error("Ingrese monto pagado por Pago Móvil del método 2");
                    partes.push(`2) Pago Móvil Ref: ${datos.referenciaPago2.trim()} - Bs. ${m2PM.toFixed(2)}`);
                    break;
                case "Punto de Venta":
                    partes.push(`2) Punto de Venta`);
                    break;
                case "Efectivo Bs.":
                    const m2 = parseFloat(datos.montoEfectivo2 || "");
                    if (isNaN(m2) || m2 <= 0)
                        throw new Error("Ingrese monto en efectivo del método 2");
                    partes.push(`2) Efectivo Bs. ${m2.toFixed(2)}`);
                    break;
                default:
                    throw new Error("Método 2 no reconocido");
            }
            detalles = partes.join(" | ");
        }
        const metodoPagoFinal = esMixto
            ? `${datos.metodoPago} + ${datos.metodoPago2}`
            : datos.metodoPago;
        return new Cl_mPedido({
            id,
            nomCliente: datos.nomCliente?.trim() || "Consumidor Final",
            cedula: datos.cedula?.trim() || "",
            items: datos.items,
            metodoPago: metodoPagoFinal,
            detallesPago: detalles,
            estado,
            tasaBCV: datos.tasaBCV,
            modificada: !!id,
        });
    }
    static filtrar(pedidos, filtros) {
        return pedidos.filter(p => {
            const e = filtros.estado === "Todos" || p.estado === filtros.estado;
            const m = filtros.metodoPago === "Todos" || p.metodoPago === filtros.metodoPago;
            const f = !filtros.fecha || p.fecha === filtros.fecha;
            const pr = filtros.producto === "Todos" || p.items.some(i => i.nombre === filtros.producto);
            return e && m && f && pr;
        });
    }
    static totalPorCedula(pedidos, cedula) {
        const c = cedula.trim().toLowerCase();
        if (!c)
            return 0;
        return pedidos
            .filter(p => p.cedula.trim().toLowerCase() === c)
            .reduce((s, p) => s + p.totalUSD(), 0);
    }
    // ==================== CIERRE DIARIO ====================
    static calcularCierreDiario(pedidos, productos) {
        const hoy = fechaHoyVE();
        const ventasHoy = pedidos.filter(p => p.fecha === hoy && p.estado !== "Cancelada");
        const ventasPagadas = ventasHoy.filter(p => p.estado === "Pagada");
        const totalBs = ventasPagadas.reduce((s, p) => s + p.totalBs(), 0);
        const totalUSD = ventasPagadas.reduce((s, p) => s + p.totalUSD(), 0);
        const gananciaUSD = ventasPagadas.reduce((s, p) => s + p.gananciaUSD(), 0);
        const gananciaBs = ventasPagadas.reduce((s, p) => s + p.gananciaBs(), 0);
        const ventasFiadas = ventasHoy.filter(p => p.estado === "Fiada");
        const fiadoBs = ventasFiadas.reduce((s, p) => s + p.totalBs(), 0);
        const fiadoUSD = ventasFiadas.reduce((s, p) => s + p.totalUSD(), 0);
        const stockBajo = productos.filter((p) => {
            const min = p.tipoVenta === "gramos" ? 500 : 3;
            return p.disponible !== false && p.stock > 0 && p.stock <= min;
        });
        const sinStock = productos.filter((p) => p.disponible !== false && p.stock <= 0);
        const detalleVentas = ventasPagadas.map(p => ({
            hora: p.hora,
            cliente: p.nomCliente,
            cedula: p.cedula,
            items: p.items,
            metodoPago: p.metodoPago,
        }));
        return { totalBs, totalUSD, gananciaBs, gananciaUSD, fiadoBs, fiadoUSD, stockBajo, sinStock, detalleVentas };
    }
    // ==================== CIERRE HISTORIAL (DÍA ESPECÍFICO) ====================
    static calcularCierreHistorial(pedidos, fecha) {
        const ventasDia = pedidos.filter(p => p.fecha === fecha && p.estado !== "Cancelada");
        const ventasPagadas = ventasDia.filter(p => p.estado === "Pagada");
        const totalBs = ventasPagadas.reduce((s, p) => s + p.totalBs(), 0);
        const totalUSD = ventasPagadas.reduce((s, p) => s + p.totalUSD(), 0);
        const gananciaUSD = ventasPagadas.reduce((s, p) => s + p.gananciaUSD(), 0);
        const gananciaBs = ventasPagadas.reduce((s, p) => s + p.gananciaBs(), 0);
        const ventasFiadas = ventasDia.filter(p => p.estado === "Fiada");
        const fiadoBs = ventasFiadas.reduce((s, p) => s + p.totalBs(), 0);
        const fiadoUSD = ventasFiadas.reduce((s, p) => s + p.totalUSD(), 0);
        const detalleVentas = ventasPagadas.map(p => ({
            hora: p.hora,
            cliente: p.nomCliente,
            cedula: p.cedula,
            items: p.items,
            metodoPago: p.metodoPago,
        }));
        return { totalBs, totalUSD, gananciaBs, gananciaUSD, fiadoBs, fiadoUSD, detalleVentas };
    }
    // ==================== CIERRE MENSUAL ====================
    static calcularCierreMensual(pedidos, productos, mes) {
        const ventasMes = pedidos.filter(p => {
            if (p.estado !== "Pagada")
                return false;
            if (!p.fecha)
                return false;
            return p.fecha.startsWith(mes);
        });
        const fiadosMes = pedidos.filter(p => {
            if (p.estado !== "Fiada")
                return false;
            if (!p.fecha)
                return false;
            return p.fecha.startsWith(mes);
        });
        const totalBs = ventasMes.reduce((s, p) => s + p.totalBs(), 0);
        const totalUSD = ventasMes.reduce((s, p) => s + p.totalUSD(), 0);
        const gananciaUSD = ventasMes.reduce((s, p) => s + p.gananciaUSD(), 0);
        const gananciaBs = ventasMes.reduce((s, p) => s + p.gananciaBs(), 0);
        const fiadoBs = fiadosMes.reduce((s, p) => s + p.totalBs(), 0);
        const fiadoUSD = fiadosMes.reduce((s, p) => s + p.totalUSD(), 0);
        const porDia = {};
        ventasMes.forEach(p => {
            if (!p.fecha)
                return;
            if (!porDia[p.fecha]) {
                porDia[p.fecha] = { totalBs: 0, totalUSD: 0, gananciaBs: 0, gananciaUSD: 0, cantidad: 0 };
            }
            porDia[p.fecha].totalBs += p.totalBs();
            porDia[p.fecha].totalUSD += p.totalUSD();
            porDia[p.fecha].gananciaBs += p.gananciaBs();
            porDia[p.fecha].gananciaUSD += p.gananciaUSD();
            porDia[p.fecha].cantidad += 1;
        });
        const detallePorDia = Object.keys(porDia).sort().map(fecha => ({ fecha, ...porDia[fecha] }));
        const cantidadVentas = ventasMes.length;
        const promedioVentaUSD = cantidadVentas > 0 ? totalUSD / cantidadVentas : 0;
        const promedioVentaBs = cantidadVentas > 0 ? totalBs / cantidadVentas : 0;
        return {
            mes, totalBs, totalUSD, gananciaBs, gananciaUSD,
            fiadoBs, fiadoUSD, detallePorDia,
            cantidadVentas, promedioVentaUSD, promedioVentaBs,
        };
    }
    // ==================== RESUMEN POR MÉTODO DE PAGO ====================
    static resumenPorMetodoPago(pedidos, fecha) {
        const metodosBase = [
            "Efectivo Bs.",
            "Divisa ($)",
            "Pago Móvil",
            "Punto de Venta",
            "Fiado",
        ];
        const acc = {};
        metodosBase.forEach(m => {
            acc[m] = { totalBs: 0, totalUSD: 0, cantidad: 0 };
        });
        const ventasDia = pedidos.filter(p => p.fecha === fecha && p.estado !== "Cancelada");
        ventasDia.forEach(p => {
            const metodos = this._separarMetodos(p.metodoPago);
            if (metodos.length === 1) {
                const m = metodos[0];
                if (!acc[m])
                    acc[m] = { totalBs: 0, totalUSD: 0, cantidad: 0 };
                acc[m].totalBs += p.totalBs();
                acc[m].totalUSD += p.totalUSD();
                acc[m].cantidad += 1;
            }
            else {
                const reparto = this._repartirMixto(p);
                metodos.forEach(m => {
                    if (!acc[m])
                        acc[m] = { totalBs: 0, totalUSD: 0, cantidad: 0 };
                    const r = reparto[m] || { totalBs: 0, totalUSD: 0 };
                    acc[m].totalBs += r.totalBs;
                    acc[m].totalUSD += r.totalUSD;
                    acc[m].cantidad += 1;
                });
            }
        });
        const todos = Object.keys(acc).sort((a, b) => {
            const ia = metodosBase.indexOf(a);
            const ib = metodosBase.indexOf(b);
            if (ia >= 0 && ib >= 0)
                return ia - ib;
            if (ia >= 0)
                return -1;
            if (ib >= 0)
                return 1;
            return a.localeCompare(b);
        });
        const filas = todos.map(m => ({
            metodo: m,
            totalBs: acc[m].totalBs,
            totalUSD: acc[m].totalUSD,
            cantidad: acc[m].cantidad,
        }));
        // El Total NO incluye la fila "Fiado"
        const filasSinFiado = filas.filter(f => f.metodo !== "Fiado");
        const totalGeneralBs = filasSinFiado.reduce((s, f) => s + f.totalBs, 0);
        const totalGeneralUSD = filasSinFiado.reduce((s, f) => s + f.totalUSD, 0);
        const totalGeneralCant = filasSinFiado.reduce((s, f) => s + f.cantidad, 0);
        return [...filas, {
                metodo: "Total",
                totalBs: totalGeneralBs,
                totalUSD: totalGeneralUSD,
                cantidad: totalGeneralCant,
                esTotal: true,
            }];
    }
    static _separarMetodos(metodoPago) {
        if (!metodoPago)
            return [];
        return metodoPago.split(" + ").map(s => s.trim()).filter(Boolean);
    }
    static _repartirMixto(p) {
        const metodos = this._separarMetodos(p.metodoPago);
        const resultado = {};
        const totalBs = p.totalBs();
        const totalUSD = p.totalUSD();
        const detalles = p.detallesPago || "";
        const montos = {};
        const regexPM = /(\d+\)\s*Pago Móvil[^-]*-?\s*Bs\.\s*([0-9]+(?:\.[0-9]+)?))/g;
        let match;
        while ((match = regexPM.exec(detalles)) !== null) {
            const monto = parseFloat(match[2]);
            if (!isNaN(monto))
                montos["Pago Móvil"] = (montos["Pago Móvil"] || 0) + monto;
        }
        const regexEf = /Efectivo Bs\.\s*([0-9]+(?:\.[0-9]+)?)/g;
        while ((match = regexEf.exec(detalles)) !== null) {
            const monto = parseFloat(match[1]);
            if (!isNaN(monto))
                montos["Efectivo Bs."] = (montos["Efectivo Bs."] || 0) + monto;
        }
        const regexDiv = /Divisa:\s*\$([0-9]+(?:\.[0-9]+)?)/g;
        while ((match = regexDiv.exec(detalles)) !== null) {
            const monto = parseFloat(match[1]);
            if (!isNaN(monto)) {
                montos["Divisa ($)"] = (montos["Divisa ($)"] || 0) + monto * p.tasaBCV;
            }
        }
        const metodosConMonto = Object.keys(montos).filter(m => metodos.includes(m));
        const metodosSinMonto = metodos.filter(m => !metodosConMonto.includes(m));
        metodos.forEach(m => {
            if (montos[m] !== undefined) {
                const bs = montos[m];
                resultado[m] = {
                    totalBs: bs,
                    totalUSD: p.tasaBCV > 0 ? bs / p.tasaBCV : 0,
                };
            }
            else {
                resultado[m] = { totalBs: 0, totalUSD: 0 };
            }
        });
        const sumaAsignada = metodosConMonto.reduce((s, m) => s + (montos[m] || 0), 0);
        const faltante = Math.max(0, totalBs - sumaAsignada);
        if (metodosSinMonto.length > 0) {
            const cuota = faltante / metodosSinMonto.length;
            metodosSinMonto.forEach(m => {
                resultado[m] = {
                    totalBs: cuota,
                    totalUSD: p.tasaBCV > 0 ? cuota / p.tasaBCV : 0,
                };
            });
        }
        else if (metodos.length > 0) {
            const cuota = totalBs / metodos.length;
            metodos.forEach(m => {
                resultado[m] = {
                    totalBs: cuota,
                    totalUSD: totalUSD / metodos.length,
                };
            });
        }
        return resultado;
    }
    // ==================== PREPARACIÓN PARA VISTA ====================
    static prepararParaTabla(p) {
        const productosTexto = p.items.map(i => {
            const cant = i.tipoVenta === "gramos" ? `${i.cantidad}g` : `${i.cantidad}u`;
            return `${i.nombre} (${cant})`;
        }).join(" · ");
        return {
            id: p.id,
            nomCliente: p.nomCliente || "Consumidor Final",
            cedula: p.cedula || "—",
            productos: productosTexto,
            totalBs: `Bs. ${p.totalBs().toFixed(2)}`,
            totalUSD: `$${p.totalUSD().toFixed(2)}`,
            metodoPago: p.metodoPago,
            detallesPago: p.detallesPago || "—",
            fecha: p.fecha || "—",
            estado: p.estado,
            puedeCobrar: p.estado === "Fiada",
            puedeCancelar: p.estado !== "Cancelada",
        };
    }
    static prepararParaTablaVendedor(p) {
        const productosTexto = p.items.map(i => {
            const cant = i.tipoVenta === "gramos" ? `${i.cantidad}g` : `${i.cantidad}u`;
            return `${i.nombre} (${cant})`;
        }).join(", ");
        return {
            id: p.id,
            nomCliente: p.nomCliente || "Consumidor Final",
            cedula: p.cedula || "—",
            productos: productosTexto,
            totalBs: `Bs. ${p.totalBs().toFixed(2)}`,
            totalUSD: `$${p.totalUSD().toFixed(2)}`,
            metodoPago: p.metodoPago,
            estado: p.estado,
        };
    }
    static prepararFilaDetalleCierre(venta, item) {
        const cantTxt = item.tipoVenta === "gramos" ? `${item.cantidad} g` : `${item.cantidad} u`;
        return {
            hora: venta.hora || "—",
            cliente: venta.cliente,
            producto: item.nombre,
            cantidad: cantTxt,
            totalBs: `Bs. ${item.subtotalBs.toFixed(2)}`,
            metodoPago: venta.metodoPago,
        };
    }
    static prepararFilaStockBajo(p) {
        return {
            codigo: p.codigo,
            nombre: p.nombre,
            stock: p.tipoVenta === "gramos" ? `${p.stock} g` : `${p.stock} u`,
            tipo: p.tipoVenta === "gramos" ? "Gramos" : "Unidad",
            claseStock: p.stock <= 0 ? "stock-cero" : "stock-bajo",
        };
    }
    static prepararFilaCierreMensual(d) {
        return {
            fecha: d.fecha,
            cantidad: d.cantidad,
            totalBs: `Bs. ${d.totalBs.toFixed(2)}`,
            totalUSD: `$${d.totalUSD.toFixed(2)}`,
            gananciaBs: `Bs. ${d.gananciaBs.toFixed(2)}`,
            gananciaUSD: `$${d.gananciaUSD.toFixed(2)}`,
        };
    }
}
//# sourceMappingURL=Cl_mPedido.js.map