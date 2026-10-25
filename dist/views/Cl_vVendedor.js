import Cl_mRecibo from "../models/Cl_mRecibo.js";
import Cl_vRecibo from "./Cl_vRecibo.js";
export default class Cl_vVendedor {
    listaProductos;
    tablaCarrito;
    spTotalBs;
    spTotalUSD;
    inCedula;
    inNom;
    selectMetodo;
    divPagoMovil;
    divPuntoVenta;
    divEfectivo;
    divDivisa;
    divFiado;
    inRefPago;
    inMontoPagoMovil;
    inMontoEfectivo;
    inMontoDivisa;
    inVueltoDivisa;
    inNotaFiado;
    radioModoSimple;
    radioModoMixto;
    bloqueMetodo2;
    selectMetodo2;
    divPagoMovil2;
    divPuntoVenta2;
    divEfectivo2;
    inRefPago2;
    inMontoPagoMovil2;
    inMontoEfectivo2;
    resumenTotalBs;
    resumenMetodo1;
    resumenMetodo2;
    resumenFalta;
    btEnviar;
    btCancelarEdicion;
    badgeEdicion;
    alertContainer;
    tablaVentasDia;
    tasaBadge;
    selectCategoria;
    tplCardProducto = null;
    tplFilaCarrito = null;
    tplFilaVentaDia = null;
    agregarCb;
    eliminarCb;
    buscarProdCb;
    buscarCatCb;
    cedulaCb;
    enviarCb;
    editarCb;
    eliminarVentaCb;
    cancelarEditCb;
    cantidadModal;
    alertModal;
    productoSeleccionado = null;
    tasaActual = 1;
    textoOriginalBoton = "💾 Registrar Venta";
    constructor() {
        this.listaProductos = document.getElementById("listaProductos");
        this.tablaCarrito = document.getElementById("tablaCarrito");
        this.spTotalBs = document.getElementById("spTotalPedido");
        this.spTotalUSD = document.getElementById("spTotalPedidoUSD");
        this.inCedula = document.getElementById("inCedulaCliente");
        this.inNom = document.getElementById("inNomCliente");
        this.radioModoSimple = document.getElementById("modoPagoSimple");
        this.radioModoMixto = document.getElementById("modoPagoMixto");
        this.bloqueMetodo2 = document.getElementById("bloqueMetodo2");
        this.selectMetodo = document.getElementById("metodoPago");
        this.divPagoMovil = document.getElementById("divPagoMovil");
        this.divPuntoVenta = document.getElementById("divPuntoVenta");
        this.divEfectivo = document.getElementById("divEfectivo");
        this.divDivisa = document.getElementById("divDivisa");
        this.divFiado = document.getElementById("divFiado");
        this.inRefPago = document.getElementById("refPagoMovil");
        this.inMontoPagoMovil = document.getElementById("montoPagoMovil");
        this.inMontoEfectivo = document.getElementById("montoEfectivo");
        this.inMontoDivisa = document.getElementById("montoDivisa");
        this.inVueltoDivisa = document.getElementById("vueltoDivisa");
        this.inNotaFiado = document.getElementById("notaFiado");
        this.selectMetodo2 = document.getElementById("metodoPago2");
        this.divPagoMovil2 = document.getElementById("divPagoMovil2");
        this.divPuntoVenta2 = document.getElementById("divPuntoVenta2");
        this.divEfectivo2 = document.getElementById("divEfectivo2");
        this.inRefPago2 = document.getElementById("refPagoMovil2");
        this.inMontoPagoMovil2 = document.getElementById("montoPagoMovil2");
        this.inMontoEfectivo2 = document.getElementById("montoEfectivo2");
        this.resumenTotalBs = document.getElementById("resumenTotalBs");
        this.resumenMetodo1 = document.getElementById("resumenMetodo1");
        this.resumenMetodo2 = document.getElementById("resumenMetodo2");
        this.resumenFalta = document.getElementById("resumenFalta");
        this.btEnviar = document.getElementById("btEnviar");
        this.btCancelarEdicion = document.getElementById("btCancelarEdicion");
        this.badgeEdicion = document.getElementById("ventaEditandoBadge");
        this.alertContainer = document.getElementById("vendedorAlertContainer");
        this.tablaVentasDia = document.getElementById("tablaVentasDia");
        this.tasaBadge = document.getElementById("tasaBadge");
        this.selectCategoria = document.getElementById("selectCategoria");
        this.tplCardProducto = document.getElementById("tplCardProducto");
        this.tplFilaCarrito = document.getElementById("tplFilaCarrito");
        this.tplFilaVentaDia = document.getElementById("tplFilaVentaDia");
        if (this.btEnviar?.textContent) {
            this.textoOriginalBoton = this.btEnviar.textContent.trim() || this.textoOriginalBoton;
        }
        const bs = window.bootstrap;
        if (bs) {
            this.cantidadModal = new bs.Modal(document.getElementById("cantidadModal"));
            this.alertModal = new bs.Modal(document.getElementById("vendedorAlertModal"));
        }
        document.getElementById("inBuscarProductoVendedor").addEventListener("input", (e) => this.buscarProdCb?.(e.target.value));
        this.selectCategoria.addEventListener("change", () => this.buscarCatCb?.(this.selectCategoria.value));
        this.inCedula.addEventListener("input", () => this.cedulaCb?.(this.inCedula.value));
        this.btEnviar.addEventListener("click", () => this.enviarCb?.());
        this.btCancelarEdicion.addEventListener("click", () => this.cancelarEditCb?.());
        document.getElementById("btnRefrescarVentas").addEventListener("click", () => location.reload());
        document.getElementById("btnConfirmarCantidad").addEventListener("click", () => this.confirmarCantidad());
        this.radioModoSimple.addEventListener("change", () => this.cambiarModoPago());
        this.radioModoMixto.addEventListener("change", () => this.cambiarModoPago());
        this.selectMetodo.addEventListener("change", () => {
            this.cambiarMetodoPago();
            this.recalcularResumenMixto();
        });
        this.inMontoEfectivo.addEventListener("input", () => this.recalcularResumenMixto());
        this.inMontoPagoMovil.addEventListener("input", () => this.recalcularResumenMixto());
        this.inMontoDivisa.addEventListener("input", () => {
            this.calcularVueltoDivisa();
            this.recalcularResumenMixto();
        });
        this.selectMetodo2.addEventListener("change", () => {
            this.cambiarMetodoPago2();
            this.recalcularResumenMixto();
        });
        this.inMontoEfectivo2.addEventListener("input", () => this.recalcularResumenMixto());
        this.inMontoPagoMovil2.addEventListener("input", () => this.recalcularResumenMixto());
        this.cambiarModoPago();
        this.cambiarMetodoPago();
        this.cambiarMetodoPago2();
    }
    cambiarModoPago() {
        const esMixto = this.radioModoMixto.checked;
        this.bloqueMetodo2.style.display = esMixto ? "block" : "none";
        if (!esMixto)
            this.autocompletarEfectivoSimple();
        this.recalcularResumenMixto();
    }
    cambiarMetodoPago() {
        const v = this.selectMetodo.value;
        this.divPagoMovil.style.display = v === "Pago Móvil" ? "block" : "none";
        this.divPuntoVenta.style.display = v === "Punto de Venta" ? "block" : "none";
        this.divEfectivo.style.display = v === "Efectivo Bs." ? "block" : "none";
        this.divDivisa.style.display = v === "Divisa ($)" ? "block" : "none";
        this.divFiado.style.display = v === "Fiado" ? "block" : "none";
        this.autocompletarEfectivoSimple();
        this.autocompletarPagoMovil();
        this.autocompletarDivisa();
        this.calcularVueltoDivisa();
    }
    cambiarMetodoPago2() {
        const v = this.selectMetodo2.value;
        this.divPagoMovil2.style.display = v === "Pago Móvil" ? "block" : "none";
        this.divPuntoVenta2.style.display = v === "Punto de Venta" ? "block" : "none";
        this.divEfectivo2.style.display = v === "Efectivo Bs." ? "block" : "none";
    }
    autocompletarEfectivoSimple() {
        if (this.radioModoMixto.checked)
            return;
        if (this.selectMetodo.value !== "Efectivo Bs.")
            return;
        const totalBsTexto = this.spTotalBs.textContent || "Bs. 0.00";
        const totalBs = parseFloat(totalBsTexto.replace("Bs.", "").trim()) || 0;
        if (totalBs > 0)
            this.inMontoEfectivo.value = totalBs.toFixed(2);
    }
    autocompletarPagoMovil() {
        if (this.radioModoMixto.checked)
            return;
        if (this.selectMetodo.value !== "Pago Móvil")
            return;
        const totalBsTexto = this.spTotalBs.textContent || "Bs. 0.00";
        const totalBs = parseFloat(totalBsTexto.replace("Bs.", "").trim()) || 0;
        if (totalBs > 0)
            this.inMontoPagoMovil.value = totalBs.toFixed(2);
    }
    autocompletarDivisa() {
        if (this.radioModoMixto.checked)
            return;
        if (this.selectMetodo.value !== "Divisa ($)")
            return;
        const totalUSDTexto = this.spTotalUSD.textContent || "$0.00";
        const totalUSD = parseFloat(totalUSDTexto.replace("$", "").trim()) || 0;
        if (totalUSD > 0)
            this.inMontoDivisa.value = totalUSD.toFixed(2);
        this.calcularVueltoDivisa();
    }
    calcularVueltoDivisa() {
        if (this.selectMetodo.value !== "Divisa ($)")
            return;
        const totalUSDTexto = this.spTotalUSD.textContent || "$0.00";
        const totalUSD = parseFloat(totalUSDTexto.replace("$", "").trim()) || 0;
        const entregado = parseFloat(this.inMontoDivisa.value) || 0;
        const vuelto = Math.max(0, entregado - totalUSD);
        this.inVueltoDivisa.value = vuelto > 0 ? `$${vuelto.toFixed(2)}` : "";
    }
    recalcularResumenMixto() {
        if (!this.radioModoMixto.checked)
            return;
        const totalBsTexto = this.spTotalBs.textContent || "Bs. 0.00";
        const totalBs = parseFloat(totalBsTexto.replace("Bs.", "").trim()) || 0;
        const tasa = this.tasaActual || 1;
        let montoMetodo1 = 0;
        if (this.selectMetodo.value === "Efectivo Bs.") {
            montoMetodo1 = parseFloat(this.inMontoEfectivo.value) || 0;
        }
        else if (this.selectMetodo.value === "Pago Móvil") {
            montoMetodo1 = parseFloat(this.inMontoPagoMovil.value) || 0;
        }
        else if (this.selectMetodo.value === "Divisa ($)") {
            montoMetodo1 = (parseFloat(this.inMontoDivisa.value) || 0) * tasa;
        }
        let montoMetodo2 = 0;
        if (this.selectMetodo2.value === "Efectivo Bs.") {
            montoMetodo2 = parseFloat(this.inMontoEfectivo2.value) || 0;
        }
        else if (this.selectMetodo2.value === "Pago Móvil") {
            montoMetodo2 = parseFloat(this.inMontoPagoMovil2.value) || 0;
        }
        this.resumenTotalBs.textContent = `Bs. ${totalBs.toFixed(2)}`;
        this.resumenMetodo1.textContent = montoMetodo1 > 0 ? `Bs. ${montoMetodo1.toFixed(2)}` : "—";
        this.resumenMetodo2.textContent = montoMetodo2 > 0 ? `Bs. ${montoMetodo2.toFixed(2)}` : "—";
        const cubierto = montoMetodo1 + montoMetodo2;
        const falta = Math.max(0, totalBs - cubierto);
        this.resumenFalta.textContent = `Bs. ${falta.toFixed(2)}`;
        this.resumenFalta.className = falta > 0 ? "text-danger" : "text-success";
    }
    get nomCliente() { return this.inNom.value; }
    get cedulaCliente() { return this.inCedula.value; }
    get modoPago() { return this.radioModoMixto.checked ? "mixto" : "simple"; }
    get metodoPago() { return this.selectMetodo.value; }
    get referenciaPago() { return this.inRefPago.value; }
    get montoPagoMovil() { return this.inMontoPagoMovil.value; }
    get referenciaPuntoVenta() { return ""; }
    get montoEfectivo() { return this.inMontoEfectivo.value; }
    get montoDivisa() { return this.inMontoDivisa.value; }
    get vueltoDivisa() { return this.inVueltoDivisa.value; }
    get notaFiado() { return this.inNotaFiado.value; }
    get metodoPago2() { return this.selectMetodo2.value; }
    get referenciaPago2() { return this.inRefPago2.value; }
    get montoPagoMovil2() { return this.inMontoPagoMovil2.value; }
    get referenciaPuntoVenta2() { return ""; }
    get montoEfectivo2() { return this.inMontoEfectivo2.value; }
    setNombreCliente(n) { this.inNom.value = n; }
    setCedula(c) { this.inCedula.value = c; }
    setMetodoPago(m) { this.selectMetodo.value = m; this.cambiarMetodoPago(); }
    mostrarTasaBCV(tasa) {
        const t = Number(tasa) || 0;
        this.tasaActual = t;
        this.tasaBadge.textContent = `Tasa BCV: Bs. ${t.toFixed(2)}`;
    }
    poblarFiltroCategorias(categorias) {
        const valorActual = this.selectCategoria.value;
        this.selectCategoria.innerHTML = '<option value="Todas">Todas las categorías</option>';
        categorias.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.nombre;
            option.textContent = cat.nombre;
            this.selectCategoria.appendChild(option);
        });
        if (valorActual)
            this.selectCategoria.value = valorActual;
    }
    mostrarProductos(productos) {
        if (!this.tplCardProducto)
            return;
        this.listaProductos.innerHTML = "";
        productos.forEach(p => {
            const clone = this.tplCardProducto.content.cloneNode(true);
            this.llenarFila(clone, p);
            const btn = clone.querySelector(".btn-agregar");
            if (btn) {
                btn.onclick = () => {
                    this.productoSeleccionado = p;
                    this.abrirModalCantidad(p);
                };
            }
            this.listaProductos.appendChild(clone);
        });
    }
    llenarFila(clone, data) {
        Object.keys(data).forEach(key => {
            const el = clone.querySelector(`[data-field="${key}"]`);
            if (!el)
                return;
            if (el instanceof HTMLImageElement)
                el.src = data[key];
            else
                el.textContent = String(data[key] ?? "");
        });
    }
    abrirModalCantidad(prod) {
        const tipoVenta = prod.tipoVenta === "unidad" ? "unidad" : "gramos";
        const precioNormal = Number(prod.precioVenta) || 0;
        const stock = Number(prod.stock) || 0;
        const tasa = this.tasaActual || 1;
        document.getElementById("cantidadModalLabel").textContent = `Agregar ${prod.nombre}`;
        document.getElementById("cantidadProdNombre").textContent =
            `${prod.nombre} (Stock: ${stock}${tipoVenta === "gramos" ? " g" : " u"})`;
        const checkMayor = document.getElementById("inVentaMayor");
        const divPrecioMayor = document.getElementById("divPrecioMayor");
        const inPrecioMayor = document.getElementById("inPrecioMayor");
        checkMayor.checked = false;
        divPrecioMayor.style.display = "none";
        inPrecioMayor.value = "";
        inPrecioMayor.placeholder = precioNormal > 0 ? precioNormal.toFixed(2) : "0.00";
        const divG = document.getElementById("cantidadTipoGramos");
        const divU = document.getElementById("cantidadTipoUnidad");
        const inGramos = document.getElementById("inCantidadGramos");
        const inUnidades = document.getElementById("inCantidadUnidades");
        const spanSubtotal = document.getElementById("subtotalEstimado");
        const calcularSubtotalEstimado = () => {
            const usarMayor = checkMayor.checked;
            const precioMayorVal = parseFloat(inPrecioMayor.value) || 0;
            const precioAplicado = usarMayor && precioMayorVal > 0 ? precioMayorVal : precioNormal;
            const cant = tipoVenta === "gramos"
                ? parseFloat(inGramos.value) || 0
                : parseFloat(inUnidades.value) || 0;
            const subtotalUSD = tipoVenta === "gramos"
                ? (cant / 1000) * precioAplicado
                : cant * precioAplicado;
            const subtotalBs = subtotalUSD * tasa;
            spanSubtotal.textContent = `Bs. ${subtotalBs.toFixed(2)} ($${subtotalUSD.toFixed(2)})`;
        };
        checkMayor.onchange = () => {
            divPrecioMayor.style.display = checkMayor.checked ? "block" : "none";
            if (checkMayor.checked && !inPrecioMayor.value) {
                if (precioNormal > 0)
                    inPrecioMayor.value = precioNormal.toFixed(2);
            }
            calcularSubtotalEstimado();
        };
        inPrecioMayor.oninput = calcularSubtotalEstimado;
        if (tipoVenta === "gramos") {
            divG.style.display = "block";
            divU.style.display = "none";
            document.getElementById("precioKgDisplay").textContent = `$${precioNormal.toFixed(2)} / Kg`;
            inGramos.value = "";
            inGramos.oninput = calcularSubtotalEstimado;
            inUnidades.oninput = null;
        }
        else {
            divG.style.display = "none";
            divU.style.display = "block";
            document.getElementById("precioUnidadDisplay").textContent = `$${precioNormal.toFixed(2)} / u`;
            inUnidades.value = "1";
            inUnidades.oninput = calcularSubtotalEstimado;
            inGramos.oninput = null;
        }
        calcularSubtotalEstimado();
        this.cantidadModal?.show();
    }
    confirmarCantidad() {
        if (!this.productoSeleccionado)
            return;
        const p = this.productoSeleccionado;
        const cant = p.tipoVenta === "gramos"
            ? parseFloat(document.getElementById("inCantidadGramos").value) || 0
            : parseFloat(document.getElementById("inCantidadUnidades").value) || 0;
        if (cant <= 0) {
            this.mostrarAlerta("warning", "Ingrese una cantidad válida");
            return;
        }
        if (cant > p.stock) {
            this.mostrarAlerta("warning", `Stock insuficiente. Disponible: ${p.stock}`);
            return;
        }
        const checkMayor = document.getElementById("inVentaMayor");
        const inPrecioMayor = document.getElementById("inPrecioMayor");
        let precioMayor = null;
        if (checkMayor.checked) {
            const val = parseFloat(inPrecioMayor.value);
            if (!isNaN(val) && val > 0) {
                precioMayor = val;
            }
            else {
                this.mostrarAlerta("warning", "Ingrese un precio al mayor válido (mayor a 0) o desmarque la opción");
                return;
            }
        }
        this.agregarCb?.(p.codigo, cant, precioMayor);
        this.cantidadModal?.hide();
        this.productoSeleccionado = null;
    }
    mostrarCarrito(items) {
        if (!this.tplFilaCarrito)
            return;
        this.tablaCarrito.innerHTML = "";
        items.forEach(i => {
            const clone = this.tplFilaCarrito.content.cloneNode(true);
            this.llenarFila(clone, i);
            const btn = clone.querySelector(".btn-eliminar");
            if (btn)
                btn.onclick = () => this.eliminarCb?.(i.nombre);
            this.tablaCarrito.appendChild(clone);
        });
    }
    mostrarTotal(totalBs, totalUSD) {
        const bs = Number(totalBs) || 0;
        const usd = Number(totalUSD) || 0;
        this.spTotalBs.textContent = `Bs. ${bs.toFixed(2)}`;
        this.spTotalUSD.textContent = `$${usd.toFixed(2)}`;
        this.recalcularResumenMixto();
        this.autocompletarEfectivoSimple();
        this.autocompletarPagoMovil();
        this.autocompletarDivisa();
        this.calcularVueltoDivisa();
    }
    mostrarVentasDia(ventas) {
        if (!this.tplFilaVentaDia)
            return;
        this.tablaVentasDia.innerHTML = "";
        ventas.forEach(v => {
            const clone = this.tplFilaVentaDia.content.cloneNode(true);
            this.llenarFila(clone, v);
            const btnEditar = clone.querySelector(".btn-editar");
            if (btnEditar)
                btnEditar.onclick = () => this.editarCb?.(v.id);
            const btnEliminar = clone.querySelector(".btn-eliminar-venta");
            if (btnEliminar) {
                btnEliminar.onclick = () => {
                    const confirmar = confirm(`¿Eliminar la venta #${v.id}?\n\nSe devolverá el stock de los productos vendidos.`);
                    if (confirmar)
                        this.eliminarVentaCb?.(v.id);
                };
            }
            this.tablaVentasDia.appendChild(clone);
        });
    }
    mostrarBadgeEdicion(id) {
        this.badgeEdicion.style.display = "inline-block";
        this.badgeEdicion.textContent = `Editando venta #${id}`;
        this.btCancelarEdicion.style.display = "block";
    }
    ocultarBadgeEdicion() {
        this.badgeEdicion.style.display = "none";
        this.btCancelarEdicion.style.display = "none";
    }
    mostrarAlerta(tipo, msg) {
        const div = document.createElement("div");
        div.className = `alert alert-${tipo} alert-dismissible fade show`;
        div.innerHTML = `${msg}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
        this.alertContainer.appendChild(div);
        setTimeout(() => div.remove(), 4000);
    }
    imprimirRecibo(pedido, tasaBCV) {
        try {
            const html = Cl_mRecibo.generarHTML(pedido, tasaBCV);
            Cl_vRecibo.abrir(html);
        }
        catch (e) {
            console.error("[Recibo] Error al imprimir:", e);
        }
    }
    bloquearBotonVenta() {
        if (!this.btEnviar)
            return;
        this.btEnviar.disabled = true;
        this.btEnviar.dataset.originalText = this.btEnviar.textContent || this.textoOriginalBoton;
        this.btEnviar.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Registrando...
        `;
    }
    desbloquearBotonVenta() {
        if (!this.btEnviar)
            return;
        this.btEnviar.disabled = false;
        this.btEnviar.textContent = this.btEnviar.dataset.originalText || this.textoOriginalBoton;
    }
    limpiar() {
        this.inNom.value = "";
        this.inCedula.value = "";
        this.selectMetodo.value = "";
        this.inRefPago.value = "";
        this.inMontoPagoMovil.value = "";
        this.inMontoEfectivo.value = "";
        this.inMontoDivisa.value = "";
        this.inVueltoDivisa.value = "";
        this.inNotaFiado.value = "";
        this.selectMetodo2.value = "";
        this.inRefPago2.value = "";
        this.inMontoPagoMovil2.value = "";
        this.inMontoEfectivo2.value = "";
        this.radioModoSimple.checked = true;
        this.cambiarModoPago();
        this.cambiarMetodoPago();
        this.cambiarMetodoPago2();
        this.desbloquearBotonVenta();
    }
    onAgregarProducto(cb) { this.agregarCb = cb; }
    onEliminarProducto(cb) { this.eliminarCb = cb; }
    onBuscarProducto(cb) { this.buscarProdCb = cb; }
    onBuscarPorCategoria(cb) { this.buscarCatCb = cb; }
    onCedulaChange(cb) { this.cedulaCb = cb; }
    onEnviar(cb) { this.enviarCb = cb; }
    onEditarVenta(cb) { this.editarCb = cb; }
    onEliminarVenta(cb) { this.eliminarVentaCb = cb; }
    onCancelarEdicion(cb) { this.cancelarEditCb = cb; }
    mostrar() { }
    ocultar() { }
}
//# sourceMappingURL=Cl_vVendedor.js.map