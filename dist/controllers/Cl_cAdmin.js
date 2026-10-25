import sPedido from "../services/Cl_sPedido.js";
import sProducto from "../services/Cl_sProducto.js";
import sCategoria from "../services/Cl_sCategoria.js";
import sUsuario from "../services/Cl_sUsuario.js";
import Cl_mPedido from "../models/Cl_mPedido.js";
import Cl_mProducto from "../models/Cl_mProducto.js";
import Cl_mCategoria from "../models/Cl_mCategoria.js";
import Cl_mUsuario from "../models/Cl_mUsuario.js";
import Cl_sDolar from "../services/Cl_sDolar.js";
import { fechaHoyVE, horaAhoraVE } from "../utils/fechaVE.js";
export default class Cl_cAdmin {
    vista;
    pedidos = [];
    productos = [];
    categorias = [];
    usuarios = [];
    tasaBCV = 1;
    filtros = { estado: "Todos", metodoPago: "Todos", fecha: "", producto: "Todos" };
    filtroNombreProducto = "";
    filtroPorCodigo = "";
    filtroCategoria = "Todas";
    filtroCedula = "";
    constructor(vista) {
        this.vista = vista;
        this.vista.onCobrarFiado((id, metodo, monto, ref) => this.procesarPedido(id, metodo, monto, ref));
        this.vista.onCancelarPedido((id) => this.cancelarPedido(id));
        this.vista.onEliminarPedido((id) => this.eliminarPedido(id));
        this.vista.onFiltrarPedidos((f) => { this.filtros = f; this.vista.mostrarPedidos(this.obtenerPedidosPreparados()); });
        this.vista.onBuscarCedula((ced) => this.buscarPorCedula(ced));
        this.vista.onBuscarProducto((t) => {
            this.filtroNombreProducto = t.trim().toLowerCase();
            this.vista.mostrarProductos(this.obtenerProductosPreparados());
        });
        this.vista.onBuscarPorCodigo((c) => {
            this.filtroPorCodigo = c.trim().toLowerCase();
            this.vista.mostrarProductos(this.obtenerProductosPreparados());
        });
        this.vista.onFiltrarCategoria((c) => {
            this.filtroCategoria = c;
            this.vista.mostrarProductos(this.obtenerProductosPreparados());
        });
        this.vista.onGuardarProducto(async (p) => await this.guardarProducto(p));
        this.vista.onEliminarProducto(async (id, accion) => await this.eliminarProducto(id, accion));
        this.vista.onGuardarCategoria(async (cat) => await this.guardarCategoria(cat));
        this.vista.onEliminarCategoria(async (id) => await this.eliminarCategoria(id));
        this.vista.onCambiarActivaCategoria(async (id, activa) => await this.cambiarActivaCategoria(id, activa));
        this.vista.onGuardarUsuario(async (u) => await this.guardarUsuario(u));
        this.vista.onCambiarActivoUsuario(async (id, activo) => await this.cambiarActivoUsuario(id, activo));
        this.vista.onCambiarRolUsuario(async (id, rol) => await this.cambiarRolUsuario(id, rol));
        this.vista.onCambiarMesCierre((mes) => this.mostrarCierreMensual(mes));
        this.vista.onCambiarFechaCierreHistorial((fecha) => this.mostrarCierreHistorial(fecha));
        this.inicializar();
        setInterval(() => this.recargarTodo(), 15000);
    }
    async inicializar() {
        try {
            this.tasaBCV = await Cl_sDolar.obtenerTasa();
        }
        catch {
            this.tasaBCV = 1;
        }
        this.vista.mostrarTasaBCV(this.tasaBCV);
        await this.recargarTodo();
    }
    async recargarTodo() {
        try {
            const nueva = await Cl_sDolar.obtenerTasa();
            if (nueva && nueva > 0) {
                this.tasaBCV = nueva;
                this.vista.mostrarTasaBCV(this.tasaBCV);
            }
        }
        catch { }
        await Promise.all([
            this.cargarCategorias(),
            this.cargarProductos(),
            this.cargarPedidos(),
            this.cargarUsuarios(),
        ]);
    }
    async cargarCategorias() {
        const res = await sCategoria.obtenerTodas();
        if (res.ok) {
            this.categorias = res.data.filter((c) => c.activa !== false);
            this.vista.mostrarCategorias(res.data.map(Cl_mCategoria.prepararParaTabla));
            this.vista.poblarSelectCategorias(this.categorias);
            this.vista.poblarFiltroCategorias(this.categorias);
        }
    }
    async guardarCategoria(cat) {
        try {
            Cl_mCategoria.validar(cat);
        }
        catch (e) {
            this.vista.mostrarModal("warning", e.message);
            return;
        }
        let res;
        if (cat.id)
            res = await sCategoria.actualizar(cat.id, cat.nombre, cat.descripcion || "");
        else
            res = await sCategoria.agregar(cat.nombre, cat.descripcion || "");
        this.vista.mostrarModal(res.ok ? "success" : "danger", res.mensaje);
        if (res.ok)
            await this.cargarCategorias();
    }
    async eliminarCategoria(id) {
        const res = await sCategoria.eliminar(id);
        this.vista.mostrarModal(res.ok ? "success" : "danger", res.mensaje);
        if (res.ok)
            await Promise.all([this.cargarCategorias(), this.cargarProductos()]);
    }
    async cambiarActivaCategoria(id, activa) {
        const res = await sCategoria.cambiarActiva(id, activa);
        this.vista.mostrarModal(res.ok ? "success" : "danger", res.mensaje);
        if (res.ok)
            await this.cargarCategorias();
    }
    async cargarProductos() {
        const res = await sProducto.obtenerTodos();
        if (!res.ok)
            return;
        this.productos = res.data.map((p) => Cl_mProducto.normalizarDesdeDB(p));
        this.vista.mostrarProductos(this.obtenerProductosPreparados());
        const proximoCodigo = Cl_mProducto.generarSiguienteCodigo(this.productos);
        this.vista.actualizarProximoCodigo(proximoCodigo);
        const resNombres = await sProducto.obtenerNombresUnicos();
        if (resNombres.ok)
            this.vista.poblarFiltroProductos(resNombres.nombres);
    }
    obtenerProductosPreparados() {
        let f = this.productos;
        if (this.filtroNombreProducto)
            f = f.filter(p => p.nombre.toLowerCase().includes(this.filtroNombreProducto));
        if (this.filtroPorCodigo)
            f = f.filter(p => p.codigo.toLowerCase().includes(this.filtroPorCodigo));
        if (this.filtroCategoria !== "Todas")
            f = f.filter(p => p.categoria === this.filtroCategoria);
        const conStats = Cl_mProducto.calcularEstadisticas(f, this.pedidos, this.tasaBCV);
        return conStats.map(p => {
            const tabla = Cl_mProducto.prepararParaTabla(p, this.tasaBCV);
            return {
                ...tabla,
                stockOriginal: p.stock,
                precioCompraOriginal: p.precioCompra,
                precioVentaOriginal: p.precioVenta,
                tipoVentaOriginal: p.tipoVenta
            };
        });
    }
    async guardarProducto(producto) {
        try {
            Cl_mProducto.validar(producto);
        }
        catch (e) {
            this.vista.mostrarModal("warning", e.message);
            return;
        }
        let res;
        if (producto.id)
            res = await sProducto.actualizar(producto.id, producto);
        else
            res = await sProducto.agregar(producto);
        this.vista.mostrarModal(res.ok ? "success" : "danger", res.mensaje);
        if (res.ok)
            await this.cargarProductos();
    }
    async eliminarProducto(id, accion) {
        const p = this.productos.find((x) => x.id === id);
        if (!p)
            return this.vista.mostrarModal("danger", "No encontrado");
        if (accion === "disable" || accion === "enable") {
            const disponible = accion === "enable";
            const res = await sProducto.actualizar(id, { ...p, disponible });
            this.vista.mostrarModal(res.ok ? "success" : "danger", res.mensaje);
            if (res.ok)
                await this.cargarProductos();
            return;
        }
        const res = await sProducto.eliminar(id);
        this.vista.mostrarModal(res.ok ? "success" : "danger", res.mensaje);
        if (res.ok)
            await this.cargarProductos();
    }
    async cargarPedidos() {
        const res = await sPedido.obtenerTodos();
        if (!res.ok)
            return;
        this.pedidos = res.data.map((p) => new Cl_mPedido({
            id: p.id, nomCliente: p.NomCliente, cedula: p.Cedula, items: p.Items,
            metodoPago: p.MetodoPago, detallesPago: p.DetallesPago,
            fecha: p.Fecha, hora: p.Hora, estado: p.estado,
            tasaBCV: p.TasaBCV, modificada: p.modificada,
        }));
        this.vista.mostrarPedidos(this.obtenerPedidosPreparados());
        this.actualizarCierreCaja();
    }
    obtenerPedidosPreparados() {
        let f = Cl_mPedido.filtrar(this.pedidos, this.filtros);
        const c = this.filtroCedula.trim().toLowerCase();
        if (c)
            f = f.filter(p => p.cedula.toLowerCase().includes(c));
        return f.map(Cl_mPedido.prepararParaTabla);
    }
    buscarPorCedula(cedula) {
        this.filtroCedula = cedula;
        this.vista.mostrarPedidos(this.obtenerPedidosPreparados());
        const usd = Cl_mPedido.totalPorCedula(this.pedidos, cedula);
        this.vista.mostrarTotalPagadoCliente(usd, usd * this.tasaBCV);
    }
    actualizarCierreCaja() {
        const data = Cl_mPedido.calcularCierreDiario(this.pedidos, this.productos);
        const stockBajoPrep = data.stockBajo.map(Cl_mPedido.prepararFilaStockBajo);
        const sinStockPrep = data.sinStock.map(Cl_mPedido.prepararFilaStockBajo);
        const detallePrep = [];
        data.detalleVentas.forEach((v) => {
            v.items.forEach((item) => {
                detallePrep.push(Cl_mPedido.prepararFilaDetalleCierre(v, item));
            });
        });
        const hoy = fechaHoyVE();
        const ventasValidasHoy = this.pedidos.filter(p => p.fecha === hoy && p.estado !== "Cancelada");
        const masVendido = Cl_mProducto.obtenerProductoMasVendido(this.productos, ventasValidasHoy);
        let masVendidoPrep = { nombre: "—", detalle: "Sin datos" };
        if (masVendido && masVendido.producto) {
            masVendidoPrep = {
                nombre: masVendido.producto.nombre,
                detalle: masVendido.producto.tipoVenta === "gramos"
                    ? `${masVendido.unidades} g vendidas`
                    : `${masVendido.unidades} u vendidas`,
            };
        }
        const resumenPorMetodo = Cl_mPedido.resumenPorMetodoPago(this.pedidos, hoy);
        this.vista.mostrarCierreCaja({
            totalBs: data.totalBs,
            totalUSD: data.totalUSD,
            gananciaBs: data.gananciaBs,
            gananciaUSD: data.gananciaUSD,
            fiadoBs: data.fiadoBs,
            fiadoUSD: data.fiadoUSD,
            masVendido: masVendidoPrep,
            stockBajo: stockBajoPrep,
            sinStock: sinStockPrep,
            detalleVentas: detallePrep,
            resumenPorMetodo,
        });
        this.actualizarResumenMes();
    }
    actualizarResumenMes() {
        const mes = fechaHoyVE().slice(0, 7);
        const data = Cl_mPedido.calcularCierreMensual(this.pedidos, this.productos, mes);
        this.vista.mostrarResumenMes({
            totalBs: data.totalBs,
            totalUSD: data.totalUSD,
            gananciaBs: data.gananciaBs,
            gananciaUSD: data.gananciaUSD,
        });
    }
    mostrarCierreMensual(mes) {
        if (!mes)
            return;
        const data = Cl_mPedido.calcularCierreMensual(this.pedidos, this.productos, mes);
        const masVendido = Cl_mProducto.obtenerProductoMasVendido(this.productos, this.pedidos.filter(p => p.fecha.startsWith(mes) && p.estado !== "Cancelada"));
        const masVendidoPrep = masVendido ? {
            nombre: masVendido.producto.nombre,
            detalle: masVendido.producto.tipoVenta === "gramos"
                ? `${masVendido.unidades} g vendidas`
                : `${masVendido.unidades} u vendidas`,
        } : { nombre: "—", detalle: "Sin datos" };
        this.vista.mostrarCierreMensual({
            totalBs: data.totalBs,
            totalUSD: data.totalUSD,
            gananciaBs: data.gananciaBs,
            gananciaUSD: data.gananciaUSD,
            fiadoBs: data.fiadoBs,
            fiadoUSD: data.fiadoUSD,
            cantidadVentas: data.cantidadVentas,
            promedioVentaBs: data.promedioVentaBs,
            promedioVentaUSD: data.promedioVentaUSD,
            masVendido: masVendidoPrep,
            detallePorDia: data.detallePorDia.map(Cl_mPedido.prepararFilaCierreMensual),
        });
    }
    mostrarCierreHistorial(fecha) {
        if (!fecha)
            return;
        const data = Cl_mPedido.calcularCierreHistorial(this.pedidos, fecha);
        const ventasDelDia = this.pedidos.filter(p => p.fecha === fecha && p.estado !== "Cancelada");
        const masVendido = Cl_mProducto.obtenerProductoMasVendido(this.productos, ventasDelDia);
        let masVendidoPrep = { nombre: "—", detalle: "Sin datos" };
        if (masVendido && masVendido.producto) {
            masVendidoPrep = {
                nombre: masVendido.producto.nombre,
                detalle: masVendido.producto.tipoVenta === "gramos"
                    ? `${masVendido.unidades} g vendidas`
                    : `${masVendido.unidades} u vendidas`,
            };
        }
        const resumenPorMetodo = Cl_mPedido.resumenPorMetodoPago(this.pedidos, fecha);
        const detallePrep = [];
        data.detalleVentas.forEach((v) => {
            v.items.forEach((item) => {
                detallePrep.push(Cl_mPedido.prepararFilaDetalleCierre(v, item));
            });
        });
        this.vista.mostrarCierreHistorial({
            totalBs: data.totalBs,
            totalUSD: data.totalUSD,
            gananciaBs: data.gananciaBs,
            gananciaUSD: data.gananciaUSD,
            fiadoBs: data.fiadoBs,
            fiadoUSD: data.fiadoUSD,
            masVendido: masVendidoPrep,
            resumenPorMetodo,
            detalleVentas: detallePrep,
        });
    }
    async procesarPedido(id, metodoPago, montoRecibido, referencia) {
        const p = this.pedidos.find(x => x.id === id);
        if (!p) {
            return this.vista.mostrarModal("danger", "Venta no encontrada");
        }
        if (p.estado !== "Fiada") {
            return this.vista.mostrarModal("warning", "Solo se pueden cobrar ventas fiadas");
        }
        try {
            const tasaHoy = await Cl_sDolar.obtenerTasa();
            const nuevoTotalBs = p.totalUSD() * tasaHoy;
            const fechaHoy = fechaHoyVE();
            const horaHoy = horaAhoraVE();
            let detalles = "";
            switch (metodoPago) {
                case "Efectivo Bs.":
                    detalles = `Entregó: Bs. ${montoRecibido || nuevoTotalBs.toFixed(2)}`;
                    break;
                case "Divisa ($)":
                    detalles = `Divisa: $${montoRecibido || p.totalUSD().toFixed(2)}`;
                    break;
                case "Pago Móvil":
                    detalles = `Ref: ${referencia || "—"} | Monto: Bs. ${montoRecibido || nuevoTotalBs.toFixed(2)}`;
                    break;
                case "Punto de Venta":
                    detalles = `Punto de Venta`;
                    break;
            }
            const dataActualizada = {
                ...p.toJSON(),
                estado: "Pagada",
                MetodoPago: metodoPago,
                DetallesPago: detalles,
                TasaBCV: tasaHoy,
                TotalBs: nuevoTotalBs,
                Fecha: fechaHoy,
                Hora: horaHoy,
            };
            const res = await sPedido.actualizar(id, dataActualizada);
            if (res.ok) {
                this.vista.mostrarModal("success", `Fiado cobrado (${metodoPago}). Total Bs. ${nuevoTotalBs.toFixed(2)} (Tasa: ${tasaHoy.toFixed(2)})`);
                await this.cargarPedidos();
            }
            else {
                this.vista.mostrarModal("danger", res.mensaje);
            }
        }
        catch (e) {
            this.vista.mostrarModal("danger", "Error al cobrar fiado: " + e.message);
        }
    }
    async cancelarPedido(id) {
        const p = this.pedidos.find(x => x.id === id);
        if (!p)
            return;
        if (p.estado === "Cancelada")
            return this.vista.mostrarModal("warning", "Ya está cancelada");
        const res = await sPedido.actualizarEstado(id, "Cancelada");
        this.vista.mostrarModal(res.ok ? "success" : "danger", res.ok ? "Venta cancelada" : res.mensaje);
        if (res.ok)
            await this.recargarTodo();
    }
    async eliminarPedido(id) {
        const p = this.pedidos.find(x => x.id === id);
        if (!p) {
            return this.vista.mostrarModal("danger", "Venta no encontrada");
        }
        try {
            if (p.estado !== "Cancelada") {
                for (const item of p.items) {
                    await sProducto.devolverStock(item.codigo, item.cantidad);
                }
            }
            const res = await sPedido.eliminar(id);
            if (res.ok) {
                this.vista.mostrarModal("success", "Venta eliminada y stock devuelto");
                await this.recargarTodo();
            }
            else {
                this.vista.mostrarModal("danger", res.mensaje);
            }
        }
        catch (e) {
            console.error("[Admin] eliminarPedido:", e);
            this.vista.mostrarModal("danger", e.message || "Error al eliminar la venta");
        }
    }
    async cargarUsuarios() {
        const res = await sUsuario.obtenerTodos();
        if (res.ok) {
            this.usuarios = res.data;
            this.vista.mostrarUsuarios(this.usuarios.map(Cl_mUsuario.prepararParaTabla));
        }
    }
    async guardarUsuario(u) {
        try {
            Cl_mUsuario.validar(u);
        }
        catch (e) {
            this.vista.mostrarModal("warning", e.message);
            return;
        }
        const res = await sUsuario.crear(u.email, u.password, u.nombre, u.rol);
        this.vista.mostrarModal(res.ok ? "success" : "danger", res.mensaje);
        if (res.ok)
            await this.cargarUsuarios();
    }
    async cambiarActivoUsuario(id, activo) {
        const res = await sUsuario.cambiarActivo(id, activo);
        this.vista.mostrarModal(res.ok ? "success" : "danger", res.mensaje);
        if (res.ok)
            await this.cargarUsuarios();
    }
    async cambiarRolUsuario(id, rol) {
        const res = await sUsuario.cambiarRol(id, rol);
        this.vista.mostrarModal(res.ok ? "success" : "danger", res.mensaje);
        if (res.ok)
            await this.cargarUsuarios();
    }
}
//# sourceMappingURL=Cl_cAdmin.js.map