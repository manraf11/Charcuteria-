import sPedido from "../services/Cl_sPedido.js";
import sProducto from "../services/Cl_sProducto.js";
import sCategoria from "../services/Cl_sCategoria.js";
import Cl_mCarrito from "../models/Cl_mCarrito.js";
import Cl_mPedido from "../models/Cl_mPedido.js";
import Cl_mProducto from "../models/Cl_mProducto.js";
import Cl_sDolar from "../services/Cl_sDolar.js";
import { fechaHoyVE } from "../utils/fechaVE.js";
export default class Cl_cVendedor {
    vista;
    productos = [];
    categorias = [];
    carrito;
    clientesPorCedula = new Map();
    filtroNombre = "";
    filtroCategoria = "Todas";
    tasaBCV = 1;
    ventaEditandoId = null;
    enviando = false;
    constructor(vista) {
        this.vista = vista;
        this.carrito = new Cl_mCarrito();
        this.vista.onAgregarProducto((c, cant, precioMayor) => this.agregarAlCarrito(c, cant, precioMayor));
        this.vista.onEliminarProducto((nombre) => this.eliminarDelCarrito(nombre));
        this.vista.onBuscarProducto((t) => {
            this.filtroNombre = t.trim().toLowerCase();
            this.mostrarProductosFiltrados();
        });
        this.vista.onBuscarPorCategoria((cat) => {
            this.filtroCategoria = cat;
            this.mostrarProductosFiltrados();
        });
        this.vista.onCedulaChange((ced) => this.buscarClientePorCedula(ced));
        this.vista.onEnviar(() => this.registrarVenta());
        this.vista.onEditarVenta((id) => this.editarVenta(id));
        this.vista.onEliminarVenta((id) => this.eliminarVenta(id));
        this.vista.onCancelarEdicion(() => this.cancelarEdicion());
        this.inicializar();
        setInterval(() => this.refrescarVentas(), 10000);
    }
    async inicializar() {
        this.tasaBCV = await Cl_sDolar.obtenerTasa();
        this.vista.mostrarTasaBCV(this.tasaBCV);
        await Promise.all([
            this.cargarProductos(),
            this.cargarCategorias(),
            this.cargarClientes(),
            this.refrescarVentas(),
        ]);
    }
    async cargarProductos() {
        const r = await sProducto.obtenerTodos();
        if (r.ok) {
            this.productos = r.data.map((p) => Cl_mProducto.normalizarDesdeDB(p));
            this.mostrarProductosFiltrados();
        }
        else {
            this.vista.mostrarAlerta("danger", "Error al cargar productos");
        }
    }
    async cargarCategorias() {
        const r = await sCategoria.obtenerTodas();
        if (r.ok) {
            this.categorias = r.data.filter((c) => c.activa !== false);
            this.vista.poblarFiltroCategorias(this.categorias);
        }
    }
    async cargarClientes() {
        const r = await sPedido.obtenerTodos();
        if (r.ok) {
            this.clientesPorCedula.clear();
            r.data.forEach((p) => {
                const c = p.Cedula?.trim().toLowerCase();
                if (c && p.NomCliente && !this.clientesPorCedula.has(c)) {
                    this.clientesPorCedula.set(c, p.NomCliente);
                }
            });
        }
    }
    buscarClientePorCedula(cedula) {
        const k = cedula.trim().toLowerCase();
        if (!k)
            return;
        const nombre = this.clientesPorCedula.get(k);
        if (nombre && !this.vista.nomCliente.trim())
            this.vista.setNombreCliente(nombre);
    }
    mostrarProductosFiltrados() {
        const f = this.productos
            .filter(p => p.disponible !== false && p.stock > 0)
            .filter(p => !this.filtroNombre || p.nombre.toLowerCase().includes(this.filtroNombre))
            .filter(p => this.filtroCategoria === "Todas" || p.categoria === this.filtroCategoria);
        const preparados = f.map(p => Cl_mProducto.prepararParaCard(p, this.tasaBCV));
        this.vista.mostrarProductos(preparados);
    }
    agregarAlCarrito(codigo, cantidad, precioMayor) {
        const prod = this.productos.find(p => p.codigo === codigo);
        if (!prod) {
            this.vista.mostrarAlerta("danger", "Producto no encontrado");
            return;
        }
        if (prod.stock < cantidad) {
            this.vista.mostrarAlerta("warning", `Stock insuficiente. Disponible: ${prod.stock}`);
            return;
        }
        this.carrito.agregar(prod, cantidad, this.tasaBCV, precioMayor ?? null);
        this.actualizarVistaCarrito();
    }
    eliminarDelCarrito(nombre) {
        this.carrito.eliminar(nombre);
        this.actualizarVistaCarrito();
    }
    actualizarVistaCarrito() {
        this.vista.mostrarCarrito(this.carrito.prepararParaTabla());
        this.vista.mostrarTotal(this.carrito.calcularTotalBs(), this.carrito.calcularTotalUSD());
    }
    async registrarVenta() {
        // 🔒 Guardia contra doble clic
        if (this.enviando)
            return;
        if (this.carrito.estaVacio()) {
            this.vista.mostrarAlerta("warning", "Agregue al menos un producto");
            return;
        }
        this.enviando = true;
        this.vista.bloquearBotonVenta();
        try {
            const datos = {
                nomCliente: this.vista.nomCliente,
                cedula: this.vista.cedulaCliente,
                modoPago: this.vista.modoPago,
                metodoPago: this.vista.metodoPago,
                referenciaPago: this.vista.referenciaPago,
                montoPagoMovil: this.vista.montoPagoMovil,
                referenciaPuntoVenta: this.vista.referenciaPuntoVenta,
                montoEfectivo: this.vista.montoEfectivo,
                montoDivisa: this.vista.montoDivisa,
                vueltoDivisa: this.vista.vueltoDivisa,
                notaFiado: this.vista.notaFiado,
                metodoPago2: this.vista.metodoPago2,
                referenciaPago2: this.vista.referenciaPago2,
                montoPagoMovil2: this.vista.montoPagoMovil2,
                referenciaPuntoVenta2: this.vista.referenciaPuntoVenta2,
                montoEfectivo2: this.vista.montoEfectivo2,
                items: this.carrito.getItems(),
                tasaBCV: this.tasaBCV,
            };
            const pedido = Cl_mPedido.prepararVenta(datos, this.ventaEditandoId || undefined);
            const esEdicion = !!this.ventaEditandoId;
            let r;
            if (esEdicion) {
                r = await sPedido.actualizar(this.ventaEditandoId, pedido.toJSON());
            }
            else {
                r = await sPedido.agregar(pedido.toJSON());
            }
            if (r.ok) {
                this.vista.mostrarAlerta("success", esEdicion ? "Venta actualizada" : "Venta registrada");
                // 🖨️ Impresión desactivada temporalmente (no hay impresora aún).
                // Para reactivar: descomentar el bloque y listo.
                /*
                if (!esEdicion) {
                    try {
                        const idGenerado = (r as any).ventaId;
                        const pedidoParaRecibo = new Cl_mPedido({
                            id: idGenerado,
                            nomCliente: pedido.nomCliente,
                            cedula: pedido.cedula,
                            items: pedido.items,
                            metodoPago: pedido.metodoPago,
                            detallesPago: pedido.detallesPago,
                            fecha: pedido.fecha,
                            hora: pedido.hora,
                            estado: pedido.estado,
                            tasaBCV: this.tasaBCV,
                        });
                        this.vista.imprimirRecibo(pedidoParaRecibo, this.tasaBCV);
                    } catch (e) {
                        console.error("[Vendedor] Error al preparar recibo:", e);
                    }
                }
                */
                this.carrito.vaciar();
                this.ventaEditandoId = null;
                this.vista.limpiar();
                this.vista.ocultarBadgeEdicion();
                this.actualizarVistaCarrito();
                await Promise.all([this.cargarProductos(), this.refrescarVentas()]);
            }
            else {
                this.vista.mostrarAlerta("danger", r.mensaje);
            }
        }
        catch (e) {
            this.vista.mostrarAlerta("danger", e.message);
        }
        finally {
            this.enviando = false;
            this.vista.desbloquearBotonVenta();
        }
    }
    async editarVenta(id) {
        const r = await sPedido.obtenerTodos();
        if (!r.ok)
            return;
        const data = r.data.find((p) => String(p.id) === String(id));
        if (!data)
            return this.vista.mostrarAlerta("danger", "Venta no encontrada");
        if (data.estado === "Cancelada")
            return this.vista.mostrarAlerta("warning", "No se puede editar cancelada");
        const pedido = new Cl_mPedido({
            id: data.id,
            nomCliente: data.NomCliente,
            cedula: data.Cedula,
            items: data.Items,
            metodoPago: data.MetodoPago,
            detallesPago: data.DetallesPago,
            fecha: data.Fecha,
            hora: data.Hora,
            estado: data.estado,
            tasaBCV: data.TasaBCV,
        });
        this.carrito.cargarDesdeVenta(pedido.items);
        this.ventaEditandoId = pedido.id;
        this.vista.setNombreCliente(pedido.nomCliente);
        this.vista.setCedula(pedido.cedula);
        this.vista.setMetodoPago(pedido.metodoPago);
        this.vista.mostrarBadgeEdicion(pedido.id);
        this.actualizarVistaCarrito();
        this.vista.mostrarAlerta("warning", "Editando venta. Modifique y guarde.");
    }
    async eliminarVenta(id) {
        try {
            const r = await sPedido.obtenerTodos();
            if (!r.ok) {
                this.vista.mostrarAlerta("danger", "No se pudo cargar la venta");
                return;
            }
            const data = r.data.find((p) => String(p.id) === String(id));
            if (!data) {
                this.vista.mostrarAlerta("danger", "Venta no encontrada");
                return;
            }
            if (data.estado !== "Cancelada") {
                for (const item of data.Items) {
                    await sProducto.devolverStock(item.codigo, item.cantidad);
                }
            }
            const res = await sPedido.eliminar(id);
            if (res.ok) {
                this.vista.mostrarAlerta("success", "Venta eliminada y stock devuelto");
                await Promise.all([this.cargarProductos(), this.refrescarVentas()]);
            }
            else {
                this.vista.mostrarAlerta("danger", res.mensaje);
            }
        }
        catch (e) {
            console.error("[Vendedor] eliminarVenta:", e);
            this.vista.mostrarAlerta("danger", e.message || "Error al eliminar la venta");
        }
    }
    cancelarEdicion() {
        this.ventaEditandoId = null;
        this.carrito.vaciar();
        this.vista.limpiar();
        this.vista.ocultarBadgeEdicion();
        this.actualizarVistaCarrito();
    }
    async refrescarVentas() {
        const r = await sPedido.obtenerTodos();
        if (r.ok) {
            const hoy = fechaHoyVE();
            const ventas = r.data
                .filter((p) => p.Fecha === hoy)
                .map((p) => new Cl_mPedido({
                id: p.id,
                nomCliente: p.NomCliente,
                cedula: p.Cedula,
                items: p.Items,
                metodoPago: p.MetodoPago,
                detallesPago: p.DetallesPago,
                fecha: p.Fecha,
                hora: p.Hora,
                estado: p.estado,
                tasaBCV: p.TasaBCV,
            }));
            this.vista.mostrarVentasDia(ventas.map(Cl_mPedido.prepararParaTablaVendedor));
        }
    }
}
//# sourceMappingURL=Cl_cVendedor.js.map