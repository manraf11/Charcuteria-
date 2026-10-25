import { ItemVenta } from "./Cl_mPedido.js";

export default class Cl_mCarrito {
    private items: ItemVenta[] = [];

    getItems(): ItemVenta[] { return [...this.items]; }
    estaVacio(): boolean { return this.items.length === 0; }
    calcularTotalBs(): number { return this.items.reduce((s, i) => s + i.subtotalBs, 0); }
    calcularTotalUSD(): number { return this.items.reduce((s, i) => s + i.subtotalUSD, 0); }

    /**
     * Agrega al carrito.
     * @param producto Producto (con su precio de venta normal de BD)
     * @param cantidad Gramos o unidades
     * @param tasaBCV Tasa del día
     * @param precioMayorReferencial Si el vendedor marcó "venta al mayor",
     *        aquí viene el precio referencial en $ que él escribió.
     *        Si es null/undefined/0, se usa el precio normal del producto.
     */
    agregar(
        producto: any,
        cantidad: number,
        tasaBCV: number,
        precioMayorReferencial?: number | null
    ): void {
        if (cantidad <= 0) return;

        const tipoVenta = producto.tipoVenta === "unidad" ? "unidad" : "gramos";
        const precioNormal = Number(producto.precioVenta) || 0;
        const precioMayor = Number(precioMayorReferencial) || 0;

        // 🔥 Si el vendedor escribió un precio mayor > 0, se usa ese. Si no, el normal.
        const esMayor = precioMayor > 0;
        const precioVenta = esMayor ? precioMayor : precioNormal;

        const precioCompra = Number(producto.precioCompra) || 0;

        const subtotalUSD = tipoVenta === "gramos"
            ? (cantidad / 1000) * precioVenta
            : cantidad * precioVenta;

        const costoUSD = tipoVenta === "gramos"
            ? (cantidad / 1000) * precioCompra
            : cantidad * precioCompra;

        // 🔥 Nombre con sufijo para distinguir líneas normal vs mayor del mismo producto
        const nombreItem = esMayor ? `${producto.nombre} (Mayor)` : producto.nombre;

        // 🔥 Se agrupa por nombre, así normal y mayor del mismo producto no se mezclan
        const existente = this.items.find(i => i.nombre === nombreItem);

        if (existente) {
            existente.cantidad += cantidad;
            existente.subtotalUSD += subtotalUSD;
            existente.subtotalBs += subtotalUSD * tasaBCV;
            existente.costoUSD += costoUSD;
        } else {
            this.items.push({
                codigo: producto.codigo,
                nombre: nombreItem,
                tipoVenta,
                cantidad,
                precioUSD: precioVenta,
                precioBs: precioVenta * tasaBCV,
                subtotalUSD,
                subtotalBs: subtotalUSD * tasaBCV,
                costoUSD,
            });
        }
    }

    /** Elimina por nombre (para distinguir normal vs mayor del mismo código) */
    eliminar(nombre: string): void {
        this.items = this.items.filter(i => i.nombre !== nombre);
    }

    vaciar(): void { this.items = []; }

    cargarDesdeVenta(items: ItemVenta[]): void {
        this.items = items.map(i => ({ ...i }));
    }

    prepararParaTabla(): any[] {
        return this.items.map(i => ({
            // 🔥 El nombre único es la clave para eliminar (puede llevar "(Mayor)")
            nombre: i.nombre,
            cantidad: i.tipoVenta === "gramos" ? `${i.cantidad} g` : `${i.cantidad} u`,
            subtotal: `Bs. ${i.subtotalBs.toFixed(2)}`,
        }));
    }
}