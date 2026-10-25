import Cl_mPedido from "./Cl_mPedido.js";

export default class Cl_mProducto {
    private _id?: string;
    private _codigo: string = "";
    private _nombre: string = "";
    private _categoria: string = "";
    private _tipoVenta: "gramos" | "unidad" = "gramos";
    private _precioCompra: number = 0;
    private _precioVenta: number = 0;
    private _stock: number = 0;
    private _imagen: string = "";
    private _disponible: boolean = true;

    constructor({
        id, codigo, nombre, categoria, tipoVenta = "gramos",
        precioCompra, precioVenta, stock, imagen = "", disponible = true,
    }: any) {
        this._id = id;
        this._codigo = codigo;
        this._nombre = nombre;
        this._categoria = categoria;
        this._tipoVenta = tipoVenta;
        this._precioCompra = precioCompra;
        this._precioVenta = precioVenta;
        this._stock = stock;
        this._imagen = imagen;
        this._disponible = disponible;
    }

    get id() { return this._id; }
    get codigo() { return this._codigo; }
    get nombre() { return this._nombre; }
    get categoria() { return this._categoria; }
    get tipoVenta() { return this._tipoVenta; }
    get precioCompra() { return this._precioCompra; }
    get precioVenta() { return this._precioVenta; }
    get stock() { return this._stock; }
    get imagen() { return this._imagen; }
    get disponible() { return this._disponible; }

    calcularPrecioUSD(cantidad: number): number {
        return this._tipoVenta === "gramos"
            ? (cantidad / 1000) * this._precioVenta
            : cantidad * this._precioVenta;
    }

    calcularCostoUSD(cantidad: number): number {
        return this._tipoVenta === "gramos"
            ? (cantidad / 1000) * this._precioCompra
            : cantidad * this._precioCompra;
    }

    static validar(datos: any): void {
        if (!datos.codigo?.trim()) throw new Error("El código es obligatorio");
        if (!datos.nombre?.trim()) throw new Error("El nombre es obligatorio");
        if (!datos.categoria?.trim()) throw new Error("La categoría es obligatoria");
        const pc = Number(datos.precioCompra);
        const pv = Number(datos.precioVenta);
        const st = Number(datos.stock);
        if (isNaN(pc) || pc <= 0) throw new Error("Precio de compra inválido");
        if (isNaN(pv) || pv <= 0) throw new Error("Precio de venta inválido");
        if (pv < pc) throw new Error("El precio de venta no puede ser menor al de compra");
        if (isNaN(st) || st < 0) throw new Error("El stock no puede ser negativo");
    }

    static generarSiguienteCodigo(productos: any[]): string {
        if (!productos || productos.length === 0) return "001";
        let maxCodigo = 0;
        productos.forEach(p => {
            if (!p.codigo) return;
            const soloNumeros = p.codigo.replace(/\D/g, "");
            if (soloNumeros) {
                const num = parseInt(soloNumeros, 10);
                if (!isNaN(num) && num > maxCodigo) maxCodigo = num;
            }
        });
        return (maxCodigo + 1).toString().padStart(3, "0");
    }

    static normalizarDesdeDB(p: any): any {
        return {
            id: p.id,
            codigo: p.codigo || "",
            nombre: p.nombre || "",
            categoria: p.categorias?.nombre || p.categoria || "Otros",
            categoriaId: p.categoria_id || p.categoriaId || null,
            tipoVenta: (p.tipo_venta || p.tipoVenta) === "unidad" ? "unidad" : "gramos",
            precioCompra: Number(p.precio_compra ?? p.precioCompra) || 0,
            precioVenta: Number(p.precio_venta ?? p.precioVenta) || 0,
            stock: Number(p.stock) || 0,
            stockMinimo: Number(p.stock_minimo ?? p.stockMinimo) || 0,
            imagen: p.imagen || "",
            disponible: p.disponible !== false,
        };
    }

    static prepararParaTabla(p: any, tasaBCV: number): any {
        const tipoVenta = p.tipoVenta === "unidad" ? "unidad" : "gramos";
        const precioVenta = Number(p.precioVenta) || 0;
        const precioCompra = Number(p.precioCompra) || 0;
        const stock = Number(p.stock) || 0;

        const stockTxt = tipoVenta === "gramos" ? `${stock} g` : `${stock} u`;
        const precioVentaBs = (precioVenta * tasaBCV).toFixed(2);
        const gananciaUSD = precioVenta - precioCompra;

        let claseStock = "";
        const min = tipoVenta === "gramos" ? 500 : 3;
        if (stock <= 0) claseStock = "stock-cero";
        else if (stock <= min) claseStock = "stock-bajo";

        return {
            id: p.id,
            codigo: p.codigo,
            nombre: p.nombre,
            categoria: p.categoria,
            tipo: tipoVenta === "gramos" ? "Gramos" : "Unidad",
            stock: stockTxt,
            precioCompra: `$${precioCompra.toFixed(2)}`,
            precioVenta: `$${precioVenta.toFixed(2)}`,
            precioVentaBs: `Bs. ${precioVentaBs}`,
            ganancia: `$${gananciaUSD.toFixed(2)}`,
            claseStock,
            puedeEditar: true,
        };
    }

    static prepararParaCard(p: any, tasaBCV: number): any {
        const precioVenta = Number(p.precioVenta) || 0;
        const precioCompra = Number(p.precioCompra) || 0;
        const stock = Number(p.stock) || 0;
        const tipoVenta = p.tipoVenta === "unidad" ? "unidad" : "gramos";

        const precioBs = tipoVenta === "gramos"
            ? `Bs. ${(precioVenta * tasaBCV).toFixed(2)} / Kg`
            : `Bs. ${(precioVenta * tasaBCV).toFixed(2)} / u`;
        const stockTxt = tipoVenta === "gramos" ? `${stock} g` : `${stock} u`;

        return {
            codigo: p.codigo,
            nombre: p.nombre,
            categoriaStock: `${p.categoria} · Stock: ${stockTxt}`,
            precio: precioBs,
            tipoVenta,
            precioVenta,
            precioCompra,
            stock,
        };
    }

    static obtenerEstadisticasPorCodigo(codigo: string, pedidos: Cl_mPedido[]) {
        let unidades = 0, ingresoUSD = 0, costoUSD = 0;
        for (const pedido of pedidos) {
            if (pedido.estado === "Cancelada") continue;
            for (const item of pedido.items) {
                if (item.codigo === codigo) {
                    unidades += item.cantidad;
                    ingresoUSD += item.subtotalUSD;
                    costoUSD += item.costoUSD;
                }
            }
        }
        return unidades === 0 ? null : { unidades, ingresoUSD, costoUSD };
    }

    static obtenerProductoMasVendido(productos: any[], pedidos: Cl_mPedido[]) {
        if (pedidos.length === 0 || productos.length === 0) return null;
        let maxUnidades = 0, prod: any = null;
        for (const p of productos) {
            const stats = this.obtenerEstadisticasPorCodigo(p.codigo, pedidos);
            if (stats && stats.unidades > maxUnidades) {
                maxUnidades = stats.unidades;
                prod = p;
            }
        }
        return prod ? { producto: prod, unidades: maxUnidades } : null;
    }

    static calcularEstadisticas(productos: any[], pedidos: Cl_mPedido[], tasaBCV: number = 1): any[] {
        const totalUnidades = pedidos
            .filter(p => p.estado !== "Cancelada")
            .reduce((s, p) => s + p.cantidadTotal(), 0);

        return productos.map(producto => {
            const stats = this.obtenerEstadisticasPorCodigo(producto.codigo, pedidos);
            const unidades = stats ? stats.unidades : 0;
            const ingresoUSD = stats ? stats.ingresoUSD : 0;
            const costoUSD = stats ? stats.costoUSD : 0;
            const gananciaUSD = ingresoUSD - costoUSD;

            return {
                ...producto,
                cantidadSolicitada: unidades,
                porcentajeSolicitado: totalUnidades > 0 ? (unidades / totalUnidades) * 100 : 0,
                ingresoUSD,
                ingresoBs: ingresoUSD * tasaBCV,
                costoUSD,
                gananciaUSD,
                gananciaBs: gananciaUSD * tasaBCV,
                precioVentaBs: (Number(producto.precioVenta) || 0) * tasaBCV,
                precioCompraBs: (Number(producto.precioCompra) || 0) * tasaBCV,
            };
        });
    }
}