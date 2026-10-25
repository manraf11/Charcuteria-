import { mesActualVE } from "../utils/fechaVE.js";
export default class Cl_vAdmin {
    tablaPedidos;
    filtroEstado;
    filtroMetodoPago;
    filtroFecha;
    filtroProducto;
    tablaProductos;
    inputBuscarProducto;
    inputBuscarCedula;
    inputBuscarPorCodigo;
    filtroCategoria;
    spanTotalPagadoCliente;
    spTotalPagadoClienteBs;
    tasaBadge;
    productoEditandoId = null;
    categoriaEditandoId = null;
    modalInstance = null;
    modalConfirmInstance = null;
    productoModalInstance = null;
    categoriaModalInstance = null;
    usuarioModalInstance = null;
    productoModal;
    productoModalLabel;
    prodCodigoInput;
    prodNombreInput;
    prodCategoriaInput;
    prodTipoVentaInput;
    prodPrecioCompraInput;
    prodPrecioVentaInput;
    prodStockInput;
    prodImagenInputModal;
    prodImagenPreview;
    btnGuardarProductoModal;
    btnAgregarProducto;
    categoriaModal;
    categoriaModalLabel;
    catNombreInput;
    catDescripcionInput;
    btnGuardarCategoriaModal;
    btnAgregarCategoria;
    tablaCategorias;
    tablaUsuarios;
    btnAgregarUsuario;
    usuarioModal;
    userEmailInput;
    userPasswordInput;
    userNombreInput;
    userRolSelect;
    btnGuardarUsuarioModal;
    cierreTotalBs;
    cierreTotalUSD;
    cierreGananciaBs;
    cierreGananciaUSD;
    cierreFiadoBs;
    cierreFiadoUSD;
    cierreMasVendido;
    cierreMasVendidoDetalle;
    tablaDetalleCierre;
    tablaResumenMetodoPago = null;
    cierreMesTotalBs = null;
    cierreMesTotalUSD = null;
    cierreMesGananciaBs = null;
    cierreMesGananciaUSD = null;
    mesCierreInput = null;
    btnAplicarMesCierre = null;
    cierreMensualContenedor = null;
    cierreMesTotalBsDetalle = null;
    cierreMesTotalUSDDetalle = null;
    cierreMesGananciaBsDetalle = null;
    cierreMesGananciaUSDDetalle = null;
    cierreMesFiadoBs = null;
    cierreMesFiadoUSD = null;
    cierreMesMasVendido = null;
    cierreMesMasVendidoDetalle = null;
    cierreMesCantidadVentas = null;
    cierreMesPromedioUSD = null;
    tablaCierreMensualDias = null;
    fechaCierreHistorial = null;
    btnAplicarFechaCierre = null;
    cierreHistorialContenedor = null;
    histTotalBs = null;
    histTotalUSD = null;
    histGananciaBs = null;
    histGananciaUSD = null;
    histFiadoBs = null;
    histFiadoUSD = null;
    histMasVendido = null;
    histMasVendidoDetalle = null;
    tablaResumenMetodoHistorial = null;
    tablaDetalleHistorial = null;
    proximoCodigo = "001";
    tplFilaProducto = null;
    tplFilaCategoria = null;
    tplFilaPedido = null;
    tplFilaUsuario = null;
    tplFilaStockBajo = null;
    tplFilaDetalleCierre = null;
    tplFilaCierreMes = null;
    tplFilaResumenMetodo = null;
    tplFilaResumenMetodoHistorial = null;
    tplFilaDetalleHistorial = null;
    cobrarFiadoModal = null;
    cobrarFiadoModalInstance = null;
    cobrarFiadoInfo = null;
    cobrarFiadoMetodo = null;
    cobrarFiadoMonto = null;
    cobrarFiadoRef = null;
    cobrarFiadoDivMonto = null;
    cobrarFiadoDivRef = null;
    cobrarFiadoId = null;
    cobrarFiadoCallback;
    cancelarCallback;
    eliminarPedidoCallback;
    filtrarCallback;
    buscarProductoCallback;
    buscarPorCodigoCallback;
    buscarCedulaCallback;
    filtrarCategoriaCallback;
    guardarProductoCallback;
    eliminarProductoCallback;
    guardarCategoriaCallback;
    eliminarCategoriaCallback;
    cambiarActivaCategoriaCallback;
    guardarUsuarioCallback;
    cambiarActivoUsuarioCallback;
    cambiarRolUsuarioCallback;
    cambiarMesCierreCallback;
    cambiarFechaCierreHistorialCallback;
    productoAEliminarId = null;
    constructor() {
        const $ = (id) => document.getElementById(id);
        this.tablaPedidos = $("tablaPedidos");
        this.filtroEstado = $("inFiltroEstado");
        this.filtroMetodoPago = $("inFiltroMetodoPago");
        this.filtroFecha = $("inFiltroFecha");
        this.filtroProducto = $("inFiltroProducto");
        this.inputBuscarCedula = $("inCedulaBuscar");
        this.spanTotalPagadoCliente = $("spTotalPagadoCliente");
        this.spTotalPagadoClienteBs = $("spTotalPagadoClienteBs");
        this.tablaProductos = $("tablaProductos");
        this.inputBuscarProducto = $("inBuscarProducto");
        this.inputBuscarPorCodigo = $("inBuscarPorCodigo");
        this.filtroCategoria = $("inFiltroCategoriaAdmin");
        this.btnAgregarProducto = $("btnAgregarProducto");
        this.tasaBadge = $("tasaBadgeAdmin");
        this.productoModal = $("productoModal");
        this.productoModalLabel = $("productoModalLabel");
        this.prodCodigoInput = $("prodCodigoModal");
        this.prodNombreInput = $("prodNombreModal");
        this.prodCategoriaInput = $("prodCategoriaModal");
        this.prodTipoVentaInput = $("prodTipoVentaModal");
        this.prodPrecioCompraInput = $("prodPrecioCompraModal");
        this.prodPrecioVentaInput = $("prodPrecioVentaModal");
        this.prodStockInput = $("prodStockModal");
        this.prodImagenInputModal = $("prodImagenInputModal");
        this.prodImagenPreview = $("prodImagenModal");
        this.btnGuardarProductoModal = $("btnGuardarProductoModal");
        this.categoriaModal = $("categoriaModal");
        this.categoriaModalLabel = $("categoriaModalLabel");
        this.catNombreInput = $("catNombreModal");
        this.catDescripcionInput = $("catDescripcionModal");
        this.btnGuardarCategoriaModal = $("btnGuardarCategoriaModal");
        this.btnAgregarCategoria = $("btnAgregarCategoria");
        this.tablaCategorias = $("tablaCategorias");
        this.tablaUsuarios = $("tablaUsuarios");
        this.btnAgregarUsuario = $("btnAgregarUsuario");
        this.usuarioModal = $("usuarioModal");
        this.userEmailInput = $("userEmailModal");
        this.userPasswordInput = $("userPasswordModal");
        this.userNombreInput = $("userNombreModal");
        this.userRolSelect = $("userRolModal");
        this.btnGuardarUsuarioModal = $("btnGuardarUsuarioModal");
        this.cierreTotalBs = $("cierreTotalBs");
        this.cierreTotalUSD = $("cierreTotalUSD");
        this.cierreGananciaBs = $("cierreGananciaBs");
        this.cierreGananciaUSD = $("cierreGananciaUSD");
        this.cierreFiadoBs = $("cierreFiadoBs");
        this.cierreFiadoUSD = $("cierreFiadoUSD");
        this.cierreMasVendido = $("cierreMasVendido");
        this.cierreMasVendidoDetalle = $("cierreMasVendidoDetalle");
        this.tablaDetalleCierre = $("tablaDetalleCierre");
        this.tablaResumenMetodoPago = $("tablaResumenMetodoPago");
        this.cierreMesTotalBs = $("cierreMesTotalBs");
        this.cierreMesTotalUSD = $("cierreMesTotalUSD");
        this.cierreMesGananciaBs = $("cierreMesGananciaBs");
        this.cierreMesGananciaUSD = $("cierreMesGananciaUSD");
        this.mesCierreInput = $("mesCierreInput");
        this.btnAplicarMesCierre = $("btnAplicarMesCierre");
        this.cierreMensualContenedor = $("cierreMensualContenedor");
        this.cierreMesTotalBsDetalle = $("cierreMesTotalBsDetalle");
        this.cierreMesTotalUSDDetalle = $("cierreMesTotalUSDDetalle");
        this.cierreMesGananciaBsDetalle = $("cierreMesGananciaBsDetalle");
        this.cierreMesGananciaUSDDetalle = $("cierreMesGananciaUSDDetalle");
        this.cierreMesFiadoBs = $("cierreMesFiadoBs");
        this.cierreMesFiadoUSD = $("cierreMesFiadoUSD");
        this.cierreMesMasVendido = $("cierreMesMasVendido");
        this.cierreMesMasVendidoDetalle = $("cierreMesMasVendidoDetalle");
        this.cierreMesCantidadVentas = $("cierreMesCantidadVentas");
        this.cierreMesPromedioUSD = $("cierreMesPromedioUSD");
        this.tablaCierreMensualDias = $("tablaCierreMensualDias");
        this.fechaCierreHistorial = $("fechaCierreHistorial");
        this.btnAplicarFechaCierre = $("btnAplicarFechaCierre");
        this.cierreHistorialContenedor = $("cierreHistorialContenedor");
        this.histTotalBs = $("histTotalBs");
        this.histTotalUSD = $("histTotalUSD");
        this.histGananciaBs = $("histGananciaBs");
        this.histGananciaUSD = $("histGananciaUSD");
        this.histFiadoBs = $("histFiadoBs");
        this.histFiadoUSD = $("histFiadoUSD");
        this.histMasVendido = $("histMasVendido");
        this.histMasVendidoDetalle = $("histMasVendidoDetalle");
        this.tablaResumenMetodoHistorial = $("tablaResumenMetodoHistorial");
        this.tablaDetalleHistorial = $("tablaDetalleHistorial");
        this.tplFilaProducto = $("tplFilaProducto");
        this.tplFilaCategoria = $("tplFilaCategoria");
        this.tplFilaPedido = $("tplFilaPedido");
        this.tplFilaUsuario = $("tplFilaUsuario");
        this.tplFilaStockBajo = $("tplFilaStockBajo");
        this.tplFilaDetalleCierre = $("tplFilaDetalleCierre");
        this.tplFilaCierreMes = $("tplFilaCierreMes");
        this.tplFilaResumenMetodo = $("tplFilaResumenMetodo");
        this.tplFilaResumenMetodoHistorial = $("tplFilaResumenMetodoHistorial");
        this.tplFilaDetalleHistorial = $("tplFilaDetalleHistorial");
        this.cobrarFiadoModal = $("cobrarFiadoModal");
        this.cobrarFiadoInfo = $("cobrarFiadoInfo");
        this.cobrarFiadoMetodo = $("cobrarFiadoMetodo");
        this.cobrarFiadoMonto = $("cobrarFiadoMonto");
        this.cobrarFiadoRef = $("cobrarFiadoRef");
        this.cobrarFiadoDivMonto = $("cobrarFiadoDivMonto");
        this.cobrarFiadoDivRef = $("cobrarFiadoDivRef");
        this.inicializarModales();
        this.conectarEventos();
        if (this.mesCierreInput) {
            this.mesCierreInput.value = mesActualVE();
        }
    }
    inicializarModales() {
        const intentar = (intentos = 50) => {
            const bs = window.bootstrap;
            if (bs) {
                const alertEl = document.getElementById("adminAlertModal");
                const confirmEl = document.getElementById("adminConfirmModal");
                if (alertEl && !this.modalInstance)
                    this.modalInstance = new bs.Modal(alertEl);
                if (confirmEl && !this.modalConfirmInstance)
                    this.modalConfirmInstance = new bs.Modal(confirmEl);
                if (this.productoModal && !this.productoModalInstance)
                    this.productoModalInstance = new bs.Modal(this.productoModal);
                if (this.categoriaModal && !this.categoriaModalInstance)
                    this.categoriaModalInstance = new bs.Modal(this.categoriaModal);
                if (this.usuarioModal && !this.usuarioModalInstance)
                    this.usuarioModalInstance = new bs.Modal(this.usuarioModal);
                if (this.cobrarFiadoModal && !this.cobrarFiadoModalInstance)
                    this.cobrarFiadoModalInstance = new bs.Modal(this.cobrarFiadoModal);
                return;
            }
            if (intentos > 0)
                setTimeout(() => intentar(intentos - 1), 100);
        };
        intentar();
    }
    conectarEventos() {
        const emitirFiltros = () => this.filtrarCallback?.({
            estado: this.filtroEstado?.value ?? "Todos",
            metodoPago: this.filtroMetodoPago?.value ?? "Todos",
            fecha: this.filtroFecha?.value ?? "",
            producto: this.filtroProducto?.value ?? "Todos",
        });
        if (this.filtroEstado)
            this.filtroEstado.onchange = emitirFiltros;
        if (this.filtroMetodoPago)
            this.filtroMetodoPago.onchange = emitirFiltros;
        if (this.filtroFecha)
            this.filtroFecha.onchange = emitirFiltros;
        if (this.filtroProducto)
            this.filtroProducto.onchange = emitirFiltros;
        if (this.inputBuscarProducto)
            this.inputBuscarProducto.oninput = () => this.buscarProductoCallback?.(this.inputBuscarProducto.value);
        if (this.inputBuscarPorCodigo)
            this.inputBuscarPorCodigo.oninput = () => this.buscarPorCodigoCallback?.(this.inputBuscarPorCodigo.value);
        if (this.inputBuscarCedula)
            this.inputBuscarCedula.oninput = () => this.buscarCedulaCallback?.(this.inputBuscarCedula.value);
        if (this.filtroCategoria)
            this.filtroCategoria.onchange = () => this.filtrarCategoriaCallback?.(this.filtroCategoria.value);
        if (this.btnAgregarProducto)
            this.btnAgregarProducto.onclick = () => this.abrirModalProducto();
        if (this.btnGuardarProductoModal)
            this.btnGuardarProductoModal.onclick = () => this.guardarProductoDesdeModal();
        if (this.btnAgregarCategoria)
            this.btnAgregarCategoria.onclick = () => this.abrirModalCategoria();
        if (this.btnGuardarCategoriaModal)
            this.btnGuardarCategoriaModal.onclick = () => this.guardarCategoriaDesdeModal();
        if (this.btnAgregarUsuario)
            this.btnAgregarUsuario.onclick = () => this.abrirModalUsuario();
        if (this.btnGuardarUsuarioModal)
            this.btnGuardarUsuarioModal.onclick = () => this.guardarUsuarioDesdeModal();
        if (this.btnAplicarMesCierre) {
            this.btnAplicarMesCierre.onclick = () => {
                const mes = this.mesCierreInput?.value ?? "";
                if (mes)
                    this.cambiarMesCierreCallback?.(mes);
            };
        }
        if (this.btnAplicarFechaCierre) {
            this.btnAplicarFechaCierre.onclick = () => {
                const fecha = this.fechaCierreHistorial?.value ?? "";
                if (fecha)
                    this.cambiarFechaCierreHistorialCallback?.(fecha);
            };
        }
        if (this.prodImagenInputModal && this.prodImagenPreview) {
            this.prodImagenInputModal.addEventListener("change", (e) => {
                const file = e.target.files?.[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        this.prodImagenPreview.src = ev.target?.result;
                        this.prodImagenPreview.style.display = "block";
                    };
                    reader.readAsDataURL(file);
                }
                else {
                    this.prodImagenPreview.src = "";
                    this.prodImagenPreview.style.display = "none";
                }
            });
        }
        document.getElementById("adminConfirmDeleteBtn")?.addEventListener("click", () => {
            if (this.productoAEliminarId)
                this.eliminarProductoCallback?.(this.productoAEliminarId, "delete");
            this.modalConfirmInstance?.hide();
        });
        if (this.cobrarFiadoMetodo) {
            this.cobrarFiadoMetodo.onchange = () => {
                const v = this.cobrarFiadoMetodo.value;
                if (this.cobrarFiadoDivMonto)
                    this.cobrarFiadoDivMonto.style.display =
                        (v === "Efectivo Bs." || v === "Divisa ($)" || v === "Pago Móvil") ? "block" : "none";
                if (this.cobrarFiadoDivRef)
                    this.cobrarFiadoDivRef.style.display =
                        (v === "Pago Móvil" || v === "Punto de Venta") ? "block" : "none";
            };
        }
        document.getElementById("btnConfirmarCobrarFiado")?.addEventListener("click", () => {
            if (!this.cobrarFiadoId)
                return;
            const metodo = this.cobrarFiadoMetodo?.value || "";
            const monto = this.cobrarFiadoMonto?.value || "";
            const ref = this.cobrarFiadoRef?.value || "";
            if (!metodo) {
                alert("Seleccione método de pago");
                return;
            }
            this.cobrarFiadoCallback?.(this.cobrarFiadoId, metodo, monto, ref);
            this.cobrarFiadoModalInstance?.hide();
        });
        if (this.productoModal)
            this.productoModal.addEventListener("hidden.bs.modal", () => this.limpiarFormularioProducto());
        if (this.categoriaModal)
            this.categoriaModal.addEventListener("hidden.bs.modal", () => this.limpiarFormularioCategoria());
        if (this.usuarioModal)
            this.usuarioModal.addEventListener("hidden.bs.modal", () => this.limpiarFormularioUsuario());
    }
    llenarFila(clone, data) {
        Object.keys(data).forEach(key => {
            const el = clone.querySelector(`[data-field="${key}"]`);
            if (!el)
                return;
            if (el instanceof HTMLImageElement)
                el.src = data[key];
            else if (el instanceof HTMLSelectElement)
                el.value = data[key];
            else
                el.textContent = data[key];
        });
    }
    mostrarTasaBCV(tasa) {
        if (this.tasaBadge)
            this.tasaBadge.textContent = `Tasa BCV: Bs. ${tasa.toFixed(2)}`;
    }
    mostrarPedidos(pedidos) {
        if (!this.tablaPedidos || !this.tplFilaPedido)
            return;
        this.tablaPedidos.innerHTML = "";
        pedidos.forEach(p => {
            const clone = this.tplFilaPedido.content.cloneNode(true);
            this.llenarFila(clone, p);
            const btnCobrar = clone.querySelector(".btn-procesar");
            if (btnCobrar) {
                btnCobrar.disabled = !p.puedeCobrar;
                btnCobrar.onclick = () => this.abrirModalCobrarFiado(p);
            }
            const btnCancelar = clone.querySelector(".btn-cancelar");
            if (btnCancelar) {
                btnCancelar.disabled = !p.puedeCancelar;
                btnCancelar.onclick = () => this.cancelarCallback?.(p.id);
            }
            const btnEliminar = clone.querySelector(".btn-eliminar-pedido");
            if (btnEliminar) {
                btnEliminar.onclick = () => {
                    const confirmar = confirm(`¿Eliminar definitivamente la venta #${p.id}?\n\n` +
                        `Esto devolverá el stock de los productos vendidos y borrará la venta de la base de datos.\n\n` +
                        `Esta acción no se puede deshacer.`);
                    if (confirmar)
                        this.eliminarPedidoCallback?.(p.id);
                };
            }
            this.tablaPedidos.appendChild(clone);
        });
    }
    abrirModalCobrarFiado(p) {
        if (!this.cobrarFiadoModalInstance)
            return;
        this.cobrarFiadoId = p.id;
        if (this.cobrarFiadoInfo) {
            this.cobrarFiadoInfo.textContent = `${p.nomCliente} — ${p.totalUSD} / ${p.totalBs}`;
        }
        if (this.cobrarFiadoMetodo)
            this.cobrarFiadoMetodo.value = "";
        if (this.cobrarFiadoMonto)
            this.cobrarFiadoMonto.value = "";
        if (this.cobrarFiadoRef)
            this.cobrarFiadoRef.value = "";
        if (this.cobrarFiadoDivMonto)
            this.cobrarFiadoDivMonto.style.display = "none";
        if (this.cobrarFiadoDivRef)
            this.cobrarFiadoDivRef.style.display = "none";
        this.cobrarFiadoModalInstance.show();
    }
    mostrarTotalPagadoCliente(totalUSD, totalBs) {
        if (this.spanTotalPagadoCliente)
            this.spanTotalPagadoCliente.textContent = `$ ${totalUSD.toFixed(2)}`;
        if (this.spTotalPagadoClienteBs)
            this.spTotalPagadoClienteBs.textContent = `Bs. ${totalBs.toFixed(2)}`;
    }
    poblarFiltroProductos(nombres) {
        if (!this.filtroProducto)
            return;
        while (this.filtroProducto.options.length > 1)
            this.filtroProducto.remove(1);
        nombres.forEach(nombre => {
            const option = document.createElement("option");
            option.value = nombre;
            option.textContent = nombre;
            this.filtroProducto.appendChild(option);
        });
    }
    mostrarProductos(productos) {
        if (!this.tablaProductos || !this.tplFilaProducto)
            return;
        this.tablaProductos.innerHTML = "";
        productos.forEach(p => {
            const clone = this.tplFilaProducto.content.cloneNode(true);
            this.llenarFila(clone, p);
            const btnEditar = clone.querySelector(".btn-editar");
            if (btnEditar)
                btnEditar.onclick = () => this.abrirModalProducto(p);
            const btnEliminar = clone.querySelector(".btn-eliminar");
            if (btnEliminar)
                btnEliminar.onclick = () => this.confirmarEliminarProducto(p.id, p.nombre);
            const fila = clone.querySelector("tr");
            if (fila && p.claseStock)
                fila.className = p.claseStock;
            this.tablaProductos.appendChild(clone);
        });
    }
    actualizarProximoCodigo(codigo) {
        this.proximoCodigo = codigo;
    }
    mostrarCategorias(categorias) {
        if (!this.tablaCategorias || !this.tplFilaCategoria)
            return;
        this.tablaCategorias.innerHTML = "";
        categorias.forEach(c => {
            const clone = this.tplFilaCategoria.content.cloneNode(true);
            this.llenarFila(clone, c);
            const badge = clone.querySelector("[data-field='estadoBadge']");
            if (badge)
                badge.className = `badge ${c.estadoClase}`;
            const btnEditar = clone.querySelector(".btn-editar-cat");
            if (btnEditar)
                btnEditar.onclick = () => this.abrirModalCategoria(c);
            const btnToggle = clone.querySelector(".btn-toggle-cat");
            if (btnToggle) {
                btnToggle.textContent = c.accionTexto;
                btnToggle.onclick = () => this.cambiarActivaCategoriaCallback?.(c.id, !c.activa);
            }
            const btnEliminar = clone.querySelector(".btn-eliminar-cat");
            if (btnEliminar)
                btnEliminar.onclick = () => {
                    if (confirm(`¿Eliminar la categoría "${c.nombre}"?`))
                        this.eliminarCategoriaCallback?.(c.id);
                };
            this.tablaCategorias.appendChild(clone);
        });
    }
    poblarSelectCategorias(categorias) {
        if (!this.prodCategoriaInput)
            return;
        const valorActual = this.prodCategoriaInput.value;
        this.prodCategoriaInput.innerHTML = '<option value="">Seleccione</option>';
        categorias.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.nombre;
            option.textContent = cat.nombre;
            this.prodCategoriaInput.appendChild(option);
        });
        if (valorActual)
            this.prodCategoriaInput.value = valorActual;
    }
    poblarFiltroCategorias(categorias) {
        if (!this.filtroCategoria)
            return;
        const valorActual = this.filtroCategoria.value;
        this.filtroCategoria.innerHTML = '<option value="Todas">Todas</option>';
        categorias.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.nombre;
            option.textContent = cat.nombre;
            this.filtroCategoria.appendChild(option);
        });
        if (valorActual)
            this.filtroCategoria.value = valorActual;
    }
    abrirModalCategoria(datos) {
        if (!this.categoriaModal || !this.categoriaModalInstance)
            return;
        if (datos) {
            if (this.categoriaModalLabel)
                this.categoriaModalLabel.textContent = "Editar Categoría";
            if (this.catNombreInput)
                this.catNombreInput.value = datos.nombre || "";
            if (this.catDescripcionInput)
                this.catDescripcionInput.value = datos.descripcion || "";
            this.categoriaEditandoId = datos.id || null;
        }
        else {
            if (this.categoriaModalLabel)
                this.categoriaModalLabel.textContent = "Agregar Categoría";
            this.limpiarFormularioCategoria();
            this.categoriaEditandoId = null;
        }
        this.categoriaModalInstance.show();
    }
    limpiarFormularioCategoria() {
        if (this.catNombreInput)
            this.catNombreInput.value = "";
        if (this.catDescripcionInput)
            this.catDescripcionInput.value = "";
    }
    guardarCategoriaDesdeModal() {
        const nombre = this.catNombreInput?.value.trim() ?? "";
        const descripcion = this.catDescripcionInput?.value.trim() ?? "";
        this.guardarCategoriaCallback?.({ id: this.categoriaEditandoId, nombre, descripcion });
        this.categoriaModalInstance?.hide();
    }
    mostrarUsuarios(usuarios) {
        if (!this.tablaUsuarios || !this.tplFilaUsuario)
            return;
        this.tablaUsuarios.innerHTML = "";
        usuarios.forEach(u => {
            const clone = this.tplFilaUsuario.content.cloneNode(true);
            this.llenarFila(clone, u);
            const badge = clone.querySelector("[data-field='estadoBadge']");
            if (badge)
                badge.className = `badge ${u.estadoClase}`;
            const sel = clone.querySelector(".sel-rol");
            if (sel) {
                sel.value = u.rol;
                sel.onchange = () => this.cambiarRolUsuarioCallback?.(u.id, sel.value);
            }
            const btn = clone.querySelector(".btn-toggle-user");
            if (btn) {
                btn.textContent = u.accionTexto;
                btn.onclick = () => this.cambiarActivoUsuarioCallback?.(u.id, !u.activo);
            }
            this.tablaUsuarios.appendChild(clone);
        });
    }
    abrirModalUsuario() {
        if (!this.usuarioModal || !this.usuarioModalInstance)
            return;
        this.limpiarFormularioUsuario();
        this.usuarioModalInstance.show();
    }
    limpiarFormularioUsuario() {
        if (this.userEmailInput)
            this.userEmailInput.value = "";
        if (this.userPasswordInput)
            this.userPasswordInput.value = "";
        if (this.userNombreInput)
            this.userNombreInput.value = "";
        if (this.userRolSelect)
            this.userRolSelect.value = "vendedor";
    }
    guardarUsuarioDesdeModal() {
        const email = this.userEmailInput?.value.trim() ?? "";
        const password = this.userPasswordInput?.value.trim() ?? "";
        const nombre = this.userNombreInput?.value.trim() ?? "";
        const rol = (this.userRolSelect?.value ?? "vendedor");
        this.guardarUsuarioCallback?.({ email, password, nombre, rol });
        this.usuarioModalInstance?.hide();
    }
    mostrarCierreCaja(data) {
        if (this.cierreTotalBs)
            this.cierreTotalBs.textContent = `Bs. ${data.totalBs.toFixed(2)}`;
        if (this.cierreTotalUSD)
            this.cierreTotalUSD.textContent = `$${data.totalUSD.toFixed(2)}`;
        if (this.cierreGananciaBs)
            this.cierreGananciaBs.textContent = `Bs. ${data.gananciaBs.toFixed(2)}`;
        if (this.cierreGananciaUSD)
            this.cierreGananciaUSD.textContent = `$${data.gananciaUSD.toFixed(2)}`;
        if (this.cierreFiadoBs)
            this.cierreFiadoBs.textContent = `Bs. ${data.fiadoBs.toFixed(2)}`;
        if (this.cierreFiadoUSD)
            this.cierreFiadoUSD.textContent = `$${data.fiadoUSD.toFixed(2)}`;
        if (this.cierreMasVendido)
            this.cierreMasVendido.textContent = data.masVendido.nombre;
        if (this.cierreMasVendidoDetalle)
            this.cierreMasVendidoDetalle.textContent = data.masVendido.detalle;
        if (this.tablaDetalleCierre && this.tplFilaDetalleCierre) {
            this.tablaDetalleCierre.innerHTML = "";
            if (data.detalleVentas.length === 0) {
                const fila = this.tablaDetalleCierre.insertRow();
                fila.innerHTML = `<td colspan="6" class="text-center text-muted">No hay ventas registradas hoy</td>`;
            }
            else {
                data.detalleVentas.forEach((fila) => {
                    const clone = this.tplFilaDetalleCierre.content.cloneNode(true);
                    this.llenarFila(clone, fila);
                    this.tablaDetalleCierre.appendChild(clone);
                });
            }
        }
        if (data.resumenPorMetodo) {
            this.mostrarResumenPorMetodoPago(data.resumenPorMetodo);
        }
    }
    mostrarResumenPorMetodoPago(resumen) {
        if (!this.tablaResumenMetodoPago || !this.tplFilaResumenMetodo)
            return;
        this.tablaResumenMetodoPago.innerHTML = "";
        if (!resumen || resumen.length === 0) {
            const fila = this.tablaResumenMetodoPago.insertRow();
            fila.innerHTML = `<td colspan="4" class="text-center text-muted">Sin ventas registradas hoy</td>`;
            return;
        }
        resumen.forEach(item => {
            const clone = this.tplFilaResumenMetodo.content.cloneNode(true);
            this.llenarFila(clone, {
                metodo: item.metodo,
                totalBs: `Bs. ${Number(item.totalBs || 0).toFixed(2)}`,
                totalUSD: `$${Number(item.totalUSD || 0).toFixed(2)}`,
                cantidad: String(item.cantidad ?? 0),
            });
            const fila = clone.querySelector("tr");
            if (fila && item.esTotal)
                fila.className = "table-success fw-bold";
            this.tablaResumenMetodoPago.appendChild(clone);
        });
    }
    mostrarResumenMes(data) {
        if (this.cierreMesTotalBs)
            this.cierreMesTotalBs.textContent = `Bs. ${data.totalBs.toFixed(2)}`;
        if (this.cierreMesTotalUSD)
            this.cierreMesTotalUSD.textContent = `$${data.totalUSD.toFixed(2)}`;
        if (this.cierreMesGananciaBs)
            this.cierreMesGananciaBs.textContent = `Bs. ${data.gananciaBs.toFixed(2)}`;
        if (this.cierreMesGananciaUSD)
            this.cierreMesGananciaUSD.textContent = `$${data.gananciaUSD.toFixed(2)}`;
    }
    mostrarCierreMensual(data) {
        if (this.cierreMesTotalBsDetalle)
            this.cierreMesTotalBsDetalle.textContent = `Bs. ${data.totalBs.toFixed(2)}`;
        if (this.cierreMesTotalUSDDetalle)
            this.cierreMesTotalUSDDetalle.textContent = `$${data.totalUSD.toFixed(2)}`;
        if (this.cierreMesGananciaBsDetalle)
            this.cierreMesGananciaBsDetalle.textContent = `Bs. ${data.gananciaBs.toFixed(2)}`;
        if (this.cierreMesGananciaUSDDetalle)
            this.cierreMesGananciaUSDDetalle.textContent = `$${data.gananciaUSD.toFixed(2)}`;
        if (this.cierreMesFiadoBs)
            this.cierreMesFiadoBs.textContent = `Bs. ${data.fiadoBs.toFixed(2)}`;
        if (this.cierreMesFiadoUSD)
            this.cierreMesFiadoUSD.textContent = `$${data.fiadoUSD.toFixed(2)}`;
        if (this.cierreMesMasVendido)
            this.cierreMesMasVendido.textContent = data.masVendido.nombre;
        if (this.cierreMesMasVendidoDetalle)
            this.cierreMesMasVendidoDetalle.textContent = data.masVendido.detalle;
        if (this.cierreMesCantidadVentas)
            this.cierreMesCantidadVentas.textContent = String(data.cantidadVentas);
        if (this.cierreMesPromedioUSD) {
            this.cierreMesPromedioUSD.textContent = `Bs. ${data.promedioVentaBs.toFixed(2)} / $${data.promedioVentaUSD.toFixed(2)}`;
        }
        if (this.tablaCierreMensualDias && this.tplFilaCierreMes) {
            this.tablaCierreMensualDias.innerHTML = "";
            if (data.detallePorDia.length === 0) {
                const fila = this.tablaCierreMensualDias.insertRow();
                fila.innerHTML = `<td colspan="6" class="text-center text-muted">Sin ventas registradas en este mes</td>`;
            }
            else {
                data.detallePorDia.forEach((d) => {
                    const clone = this.tplFilaCierreMes.content.cloneNode(true);
                    this.llenarFila(clone, d);
                    this.tablaCierreMensualDias.appendChild(clone);
                });
            }
        }
        if (this.cierreMensualContenedor)
            this.cierreMensualContenedor.style.display = "block";
    }
    mostrarCierreHistorial(data) {
        if (this.histTotalBs)
            this.histTotalBs.textContent = `Bs. ${data.totalBs.toFixed(2)}`;
        if (this.histTotalUSD)
            this.histTotalUSD.textContent = `$${data.totalUSD.toFixed(2)}`;
        if (this.histGananciaBs)
            this.histGananciaBs.textContent = `Bs. ${data.gananciaBs.toFixed(2)}`;
        if (this.histGananciaUSD)
            this.histGananciaUSD.textContent = `$${data.gananciaUSD.toFixed(2)}`;
        if (this.histFiadoBs)
            this.histFiadoBs.textContent = `Bs. ${data.fiadoBs.toFixed(2)}`;
        if (this.histFiadoUSD)
            this.histFiadoUSD.textContent = `$${data.fiadoUSD.toFixed(2)}`;
        if (this.histMasVendido)
            this.histMasVendido.textContent = data.masVendido.nombre;
        if (this.histMasVendidoDetalle)
            this.histMasVendidoDetalle.textContent = data.masVendido.detalle;
        if (this.tablaResumenMetodoHistorial && this.tplFilaResumenMetodoHistorial) {
            this.tablaResumenMetodoHistorial.innerHTML = "";
            const resumen = data.resumenPorMetodo || [];
            if (resumen.length === 0) {
                const fila = this.tablaResumenMetodoHistorial.insertRow();
                fila.innerHTML = `<td colspan="4" class="text-center text-muted">Sin ventas registradas este día</td>`;
            }
            else {
                resumen.forEach((item) => {
                    const clone = this.tplFilaResumenMetodoHistorial.content.cloneNode(true);
                    this.llenarFila(clone, {
                        metodo: item.metodo,
                        totalBs: `Bs. ${Number(item.totalBs || 0).toFixed(2)}`,
                        totalUSD: `$${Number(item.totalUSD || 0).toFixed(2)}`,
                        cantidad: String(item.cantidad ?? 0),
                    });
                    const fila = clone.querySelector("tr");
                    if (fila && item.esTotal)
                        fila.className = "table-success fw-bold";
                    this.tablaResumenMetodoHistorial.appendChild(clone);
                });
            }
        }
        if (this.tablaDetalleHistorial && this.tplFilaDetalleHistorial) {
            this.tablaDetalleHistorial.innerHTML = "";
            const detalle = data.detalleVentas || [];
            if (detalle.length === 0) {
                const fila = this.tablaDetalleHistorial.insertRow();
                fila.innerHTML = `<td colspan="6" class="text-center text-muted">No hay ventas registradas este día</td>`;
            }
            else {
                detalle.forEach((fila) => {
                    const clone = this.tplFilaDetalleHistorial.content.cloneNode(true);
                    this.llenarFila(clone, fila);
                    this.tablaDetalleHistorial.appendChild(clone);
                });
            }
        }
        if (this.cierreHistorialContenedor)
            this.cierreHistorialContenedor.style.display = "block";
    }
    abrirModalProducto(datos) {
        if (!this.productoModal || !this.productoModalInstance)
            return;
        if (datos) {
            if (this.productoModalLabel)
                this.productoModalLabel.textContent = "Editar Producto";
            if (this.prodCodigoInput)
                this.prodCodigoInput.value = datos.codigo || "";
            if (this.prodNombreInput)
                this.prodNombreInput.value = datos.nombre || "";
            if (this.prodCategoriaInput)
                this.prodCategoriaInput.value = datos.categoria || "";
            if (this.prodTipoVentaInput)
                this.prodTipoVentaInput.value = datos.tipoVentaOriginal || "gramos";
            if (this.prodPrecioCompraInput) {
                this.prodPrecioCompraInput.value = String(datos.precioCompraOriginal ?? "").replace(/[^0-9.]/g, "");
            }
            if (this.prodPrecioVentaInput) {
                this.prodPrecioVentaInput.value = String(datos.precioVentaOriginal ?? "").replace(/[^0-9.]/g, "");
            }
            if (this.prodStockInput) {
                this.prodStockInput.value = datos.stockOriginal ?? "";
            }
            this.productoEditandoId = datos.id || null;
            if (this.prodImagenPreview && datos.imagen) {
                this.prodImagenPreview.src = `./resources/img/${datos.imagen}`;
                this.prodImagenPreview.style.display = "block";
            }
            if (this.prodImagenInputModal)
                this.prodImagenInputModal.value = "";
        }
        else {
            if (this.productoModalLabel)
                this.productoModalLabel.textContent = "Agregar Producto";
            this.limpiarFormularioProducto();
            this.productoEditandoId = null;
            if (this.prodImagenPreview) {
                this.prodImagenPreview.src = "";
                this.prodImagenPreview.style.display = "none";
            }
            if (this.prodCodigoInput) {
                this.prodCodigoInput.value = this.proximoCodigo;
            }
        }
        this.productoModalInstance.show();
    }
    limpiarFormularioProducto() {
        if (this.prodCodigoInput)
            this.prodCodigoInput.value = "";
        if (this.prodNombreInput)
            this.prodNombreInput.value = "";
        if (this.prodCategoriaInput)
            this.prodCategoriaInput.value = "";
        if (this.prodTipoVentaInput)
            this.prodTipoVentaInput.value = "gramos";
        if (this.prodPrecioCompraInput)
            this.prodPrecioCompraInput.value = "";
        if (this.prodPrecioVentaInput)
            this.prodPrecioVentaInput.value = "";
        if (this.prodStockInput)
            this.prodStockInput.value = "";
    }
    guardarProductoDesdeModal() {
        const codigo = this.prodCodigoInput?.value.trim() ?? "";
        const nombre = this.prodNombreInput?.value.trim() ?? "";
        const categoria = this.prodCategoriaInput?.value.trim() ?? "";
        const tipoVenta = (this.prodTipoVentaInput?.value ?? "gramos");
        const precioCompra = parseFloat(this.prodPrecioCompraInput?.value ?? "");
        const precioVenta = parseFloat(this.prodPrecioVentaInput?.value ?? "");
        const stock = parseFloat(this.prodStockInput?.value ?? "");
        let nombreImagen = "";
        const file = this.prodImagenInputModal?.files?.[0];
        if (file)
            nombreImagen = file.name;
        this.guardarProductoCallback?.({
            id: this.productoEditandoId,
            codigo, nombre, categoria, tipoVenta,
            precioCompra, precioVenta, stock,
            imagen: nombreImagen,
        });
        this.productoModalInstance?.hide();
    }
    mostrarModal(tipo, mensaje) {
        if (!this.modalInstance) {
            console.log(`[${tipo}] ${mensaje}`);
            return;
        }
        const body = document.getElementById("adminAlertModalBody");
        if (body)
            body.innerHTML = `<div class="text-${tipo}">${mensaje}</div>`;
        this.modalInstance.show();
        setTimeout(() => this.modalInstance.hide(), 2000);
    }
    confirmarEliminarProducto(id, nombre) {
        this.productoAEliminarId = id;
        const body = document.getElementById("adminConfirmModalBody");
        if (!body || !this.modalConfirmInstance)
            return;
        body.innerHTML = `¿Qué desea hacer con "<strong>${nombre}</strong>"?`;
        this.modalConfirmInstance.show();
    }
    onCobrarFiado(cb) {
        this.cobrarFiadoCallback = cb;
    }
    onCancelarPedido(cb) { this.cancelarCallback = cb; }
    onEliminarPedido(cb) { this.eliminarPedidoCallback = cb; }
    onFiltrarPedidos(cb) { this.filtrarCallback = cb; }
    onBuscarProducto(cb) { this.buscarProductoCallback = cb; }
    onBuscarPorCodigo(cb) { this.buscarPorCodigoCallback = cb; }
    onBuscarCedula(cb) { this.buscarCedulaCallback = cb; }
    onFiltrarCategoria(cb) { this.filtrarCategoriaCallback = cb; }
    onGuardarProducto(cb) { this.guardarProductoCallback = cb; }
    onEliminarProducto(cb) {
        this.eliminarProductoCallback = cb;
    }
    onGuardarCategoria(cb) { this.guardarCategoriaCallback = cb; }
    onEliminarCategoria(cb) { this.eliminarCategoriaCallback = cb; }
    onCambiarActivaCategoria(cb) {
        this.cambiarActivaCategoriaCallback = cb;
    }
    onGuardarUsuario(cb) { this.guardarUsuarioCallback = cb; }
    onCambiarActivoUsuario(cb) {
        this.cambiarActivoUsuarioCallback = cb;
    }
    onCambiarRolUsuario(cb) {
        this.cambiarRolUsuarioCallback = cb;
    }
    onCambiarMesCierre(cb) { this.cambiarMesCierreCallback = cb; }
    onCambiarFechaCierreHistorial(cb) {
        this.cambiarFechaCierreHistorialCallback = cb;
    }
    mostrar() { document.body.removeAttribute("hidden"); }
    ocultar() { document.body.setAttribute("hidden", "true"); }
}
//# sourceMappingURL=Cl_vAdmin.js.map