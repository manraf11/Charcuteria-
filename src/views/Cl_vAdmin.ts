import I_vAdmin from "../interfaces/I_vAdmin.js";
import { mesActualVE } from "../utils/fechaVE.js";

export default class Cl_vAdmin implements I_vAdmin {
    private tablaPedidos: HTMLTableSectionElement | null;
    private filtroEstado: HTMLSelectElement | null;
    private filtroMetodoPago: HTMLSelectElement | null;
    private filtroFecha: HTMLInputElement | null;
    private filtroProducto: HTMLSelectElement | null;
    private tablaProductos: HTMLTableSectionElement | null;
    private inputBuscarProducto: HTMLInputElement | null;
    private inputBuscarCedula: HTMLInputElement | null;
    private inputBuscarPorCodigo: HTMLInputElement | null;
    private filtroCategoria: HTMLSelectElement | null;
    private spanTotalPagadoCliente: HTMLElement | null;
    private spTotalPagadoClienteBs: HTMLElement | null;
    private tasaBadge: HTMLElement | null;

    private productoEditandoId: string | null = null;
    private categoriaEditandoId: string | null = null;
    private modalInstance: any = null;
    private modalConfirmInstance: any = null;
    private productoModalInstance: any = null;
    private categoriaModalInstance: any = null;
    private usuarioModalInstance: any = null;

    private productoModal: HTMLElement | null;
    private productoModalLabel: HTMLElement | null;
    private prodCodigoInput: HTMLInputElement | null;
    private prodNombreInput: HTMLInputElement | null;
    private prodCategoriaInput: HTMLSelectElement | null;
    private prodTipoVentaInput: HTMLSelectElement | null;
    private prodPrecioCompraInput: HTMLInputElement | null;
    private prodPrecioVentaInput: HTMLInputElement | null;
    private prodStockInput: HTMLInputElement | null;
    private prodImagenInputModal: HTMLInputElement | null;
    private prodImagenPreview: HTMLImageElement | null;
    private btnGuardarProductoModal: HTMLButtonElement | null;
    private btnAgregarProducto: HTMLButtonElement | null;

    private categoriaModal: HTMLElement | null;
    private categoriaModalLabel: HTMLElement | null;
    private catNombreInput: HTMLInputElement | null;
    private catDescripcionInput: HTMLInputElement | null;
    private btnGuardarCategoriaModal: HTMLButtonElement | null;
    private btnAgregarCategoria: HTMLButtonElement | null;
    private tablaCategorias: HTMLTableSectionElement | null;

    private tablaUsuarios: HTMLTableSectionElement | null;
    private btnAgregarUsuario: HTMLButtonElement | null;
    private usuarioModal: HTMLElement | null;
    private userEmailInput: HTMLInputElement | null;
    private userPasswordInput: HTMLInputElement | null;
    private userNombreInput: HTMLInputElement | null;
    private userRolSelect: HTMLSelectElement | null;
    private btnGuardarUsuarioModal: HTMLButtonElement | null;

    private cierreTotalBs: HTMLElement | null;
    private cierreTotalUSD: HTMLElement | null;
    private cierreGananciaBs: HTMLElement | null;
    private cierreGananciaUSD: HTMLElement | null;
    private cierreFiadoBs: HTMLElement | null;
    private cierreFiadoUSD: HTMLElement | null;
    private cierreMasVendido: HTMLElement | null;
    private cierreMasVendidoDetalle: HTMLElement | null;
    private tablaDetalleCierre: HTMLTableSectionElement | null;
    private tablaResumenMetodoPago: HTMLTableSectionElement | null = null;

    private cierreMesTotalBs: HTMLElement | null = null;
    private cierreMesTotalUSD: HTMLElement | null = null;
    private cierreMesGananciaBs: HTMLElement | null = null;
    private cierreMesGananciaUSD: HTMLElement | null = null;

    private mesCierreInput: HTMLInputElement | null = null;
    private btnAplicarMesCierre: HTMLButtonElement | null = null;
    private cierreMensualContenedor: HTMLElement | null = null;
    private cierreMesTotalBsDetalle: HTMLElement | null = null;
    private cierreMesTotalUSDDetalle: HTMLElement | null = null;
    private cierreMesGananciaBsDetalle: HTMLElement | null = null;
    private cierreMesGananciaUSDDetalle: HTMLElement | null = null;
    private cierreMesFiadoBs: HTMLElement | null = null;
    private cierreMesFiadoUSD: HTMLElement | null = null;
    private cierreMesMasVendido: HTMLElement | null = null;
    private cierreMesMasVendidoDetalle: HTMLElement | null = null;
    private cierreMesCantidadVentas: HTMLElement | null = null;
    private cierreMesPromedioUSD: HTMLElement | null = null;
    private tablaCierreMensualDias: HTMLTableSectionElement | null = null;

    private fechaCierreHistorial: HTMLInputElement | null = null;
    private btnAplicarFechaCierre: HTMLButtonElement | null = null;
    private cierreHistorialContenedor: HTMLElement | null = null;
    private histTotalBs: HTMLElement | null = null;
    private histTotalUSD: HTMLElement | null = null;
    private histGananciaBs: HTMLElement | null = null;
    private histGananciaUSD: HTMLElement | null = null;
    private histFiadoBs: HTMLElement | null = null;
    private histFiadoUSD: HTMLElement | null = null;
    private histMasVendido: HTMLElement | null = null;
    private histMasVendidoDetalle: HTMLElement | null = null;
    private tablaResumenMetodoHistorial: HTMLTableSectionElement | null = null;
    private tablaDetalleHistorial: HTMLTableSectionElement | null = null;

    private proximoCodigo: string = "001";

    private tplFilaProducto: HTMLTemplateElement | null = null;
    private tplFilaCategoria: HTMLTemplateElement | null = null;
    private tplFilaPedido: HTMLTemplateElement | null = null;
    private tplFilaUsuario: HTMLTemplateElement | null = null;
    private tplFilaStockBajo: HTMLTemplateElement | null = null;
    private tplFilaDetalleCierre: HTMLTemplateElement | null = null;
    private tplFilaCierreMes: HTMLTemplateElement | null = null;
    private tplFilaResumenMetodo: HTMLTemplateElement | null = null;
    private tplFilaResumenMetodoHistorial: HTMLTemplateElement | null = null;
    private tplFilaDetalleHistorial: HTMLTemplateElement | null = null;

    private cobrarFiadoModal: HTMLElement | null = null;
    private cobrarFiadoModalInstance: any = null;
    private cobrarFiadoInfo: HTMLElement | null = null;
    private cobrarFiadoMetodo: HTMLSelectElement | null = null;
    private cobrarFiadoMonto: HTMLInputElement | null = null;
    private cobrarFiadoRef: HTMLInputElement | null = null;
    private cobrarFiadoDivMonto: HTMLElement | null = null;
    private cobrarFiadoDivRef: HTMLElement | null = null;
    private cobrarFiadoId: string | null = null;

    private cobrarFiadoCallback?: (id: string, metodoPago: string, montoRecibido: string, referencia: string) => void;
    private cancelarCallback?: (id: string) => void;
    private eliminarPedidoCallback?: (id: string) => void;
    private filtrarCallback?: (filtros: any) => void;
    private buscarProductoCallback?: (texto: string) => void;
    private buscarPorCodigoCallback?: (codigo: string) => void;
    private buscarCedulaCallback?: (cedula: string) => void;
    private filtrarCategoriaCallback?: (categoria: string) => void;
    private guardarProductoCallback?: (producto: any) => void;
    private eliminarProductoCallback?: (id: string, accion: "delete" | "disable" | "enable") => void;
    private guardarCategoriaCallback?: (cat: any) => void;
    private eliminarCategoriaCallback?: (id: string) => void;
    private cambiarActivaCategoriaCallback?: (id: string, activa: boolean) => void;
    private guardarUsuarioCallback?: (u: any) => void;
    private cambiarActivoUsuarioCallback?: (id: string, activo: boolean) => void;
    private cambiarRolUsuarioCallback?: (id: string, rol: "admin" | "vendedor") => void;
    private cambiarMesCierreCallback?: (mes: string) => void;
    private cambiarFechaCierreHistorialCallback?: (fecha: string) => void;

    private productoAEliminarId: string | null = null;

    constructor() {
        const $ = <T extends HTMLElement = HTMLElement>(id: string): T | null =>
            document.getElementById(id) as T | null;

        this.tablaPedidos = $<HTMLTableSectionElement>("tablaPedidos");
        this.filtroEstado = $<HTMLSelectElement>("inFiltroEstado");
        this.filtroMetodoPago = $<HTMLSelectElement>("inFiltroMetodoPago");
        this.filtroFecha = $<HTMLInputElement>("inFiltroFecha");
        this.filtroProducto = $<HTMLSelectElement>("inFiltroProducto");
        this.inputBuscarCedula = $<HTMLInputElement>("inCedulaBuscar");
        this.spanTotalPagadoCliente = $("spTotalPagadoCliente");
        this.spTotalPagadoClienteBs = $("spTotalPagadoClienteBs");

        this.tablaProductos = $<HTMLTableSectionElement>("tablaProductos");
        this.inputBuscarProducto = $<HTMLInputElement>("inBuscarProducto");
        this.inputBuscarPorCodigo = $<HTMLInputElement>("inBuscarPorCodigo");
        this.filtroCategoria = $<HTMLSelectElement>("inFiltroCategoriaAdmin");
        this.btnAgregarProducto = $<HTMLButtonElement>("btnAgregarProducto");

        this.tasaBadge = $("tasaBadgeAdmin");

        this.productoModal = $("productoModal");
        this.productoModalLabel = $("productoModalLabel");
        this.prodCodigoInput = $<HTMLInputElement>("prodCodigoModal");
        this.prodNombreInput = $<HTMLInputElement>("prodNombreModal");
        this.prodCategoriaInput = $<HTMLSelectElement>("prodCategoriaModal");
        this.prodTipoVentaInput = $<HTMLSelectElement>("prodTipoVentaModal");
        this.prodPrecioCompraInput = $<HTMLInputElement>("prodPrecioCompraModal");
        this.prodPrecioVentaInput = $<HTMLInputElement>("prodPrecioVentaModal");
        this.prodStockInput = $<HTMLInputElement>("prodStockModal");
        this.prodImagenInputModal = $<HTMLInputElement>("prodImagenInputModal");
        this.prodImagenPreview = $<HTMLImageElement>("prodImagenModal");
        this.btnGuardarProductoModal = $<HTMLButtonElement>("btnGuardarProductoModal");

        this.categoriaModal = $("categoriaModal");
        this.categoriaModalLabel = $("categoriaModalLabel");
        this.catNombreInput = $<HTMLInputElement>("catNombreModal");
        this.catDescripcionInput = $<HTMLInputElement>("catDescripcionModal");
        this.btnGuardarCategoriaModal = $<HTMLButtonElement>("btnGuardarCategoriaModal");
        this.btnAgregarCategoria = $<HTMLButtonElement>("btnAgregarCategoria");
        this.tablaCategorias = $<HTMLTableSectionElement>("tablaCategorias");

        this.tablaUsuarios = $<HTMLTableSectionElement>("tablaUsuarios");
        this.btnAgregarUsuario = $<HTMLButtonElement>("btnAgregarUsuario");
        this.usuarioModal = $("usuarioModal");
        this.userEmailInput = $<HTMLInputElement>("userEmailModal");
        this.userPasswordInput = $<HTMLInputElement>("userPasswordModal");
        this.userNombreInput = $<HTMLInputElement>("userNombreModal");
        this.userRolSelect = $<HTMLSelectElement>("userRolModal");
        this.btnGuardarUsuarioModal = $<HTMLButtonElement>("btnGuardarUsuarioModal");

        this.cierreTotalBs = $("cierreTotalBs");
        this.cierreTotalUSD = $("cierreTotalUSD");
        this.cierreGananciaBs = $("cierreGananciaBs");
        this.cierreGananciaUSD = $("cierreGananciaUSD");
        this.cierreFiadoBs = $("cierreFiadoBs");
        this.cierreFiadoUSD = $("cierreFiadoUSD");
        this.cierreMasVendido = $("cierreMasVendido");
        this.cierreMasVendidoDetalle = $("cierreMasVendidoDetalle");
        this.tablaDetalleCierre = $<HTMLTableSectionElement>("tablaDetalleCierre");
        this.tablaResumenMetodoPago = $<HTMLTableSectionElement>("tablaResumenMetodoPago");

        this.cierreMesTotalBs = $("cierreMesTotalBs");
        this.cierreMesTotalUSD = $("cierreMesTotalUSD");
        this.cierreMesGananciaBs = $("cierreMesGananciaBs");
        this.cierreMesGananciaUSD = $("cierreMesGananciaUSD");

        this.mesCierreInput = $<HTMLInputElement>("mesCierreInput");
        this.btnAplicarMesCierre = $<HTMLButtonElement>("btnAplicarMesCierre");
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
        this.tablaCierreMensualDias = $<HTMLTableSectionElement>("tablaCierreMensualDias");

        this.fechaCierreHistorial = $<HTMLInputElement>("fechaCierreHistorial");
        this.btnAplicarFechaCierre = $<HTMLButtonElement>("btnAplicarFechaCierre");
        this.cierreHistorialContenedor = $("cierreHistorialContenedor");
        this.histTotalBs = $("histTotalBs");
        this.histTotalUSD = $("histTotalUSD");
        this.histGananciaBs = $("histGananciaBs");
        this.histGananciaUSD = $("histGananciaUSD");
        this.histFiadoBs = $("histFiadoBs");
        this.histFiadoUSD = $("histFiadoUSD");
        this.histMasVendido = $("histMasVendido");
        this.histMasVendidoDetalle = $("histMasVendidoDetalle");
        this.tablaResumenMetodoHistorial = $<HTMLTableSectionElement>("tablaResumenMetodoHistorial");
        this.tablaDetalleHistorial = $<HTMLTableSectionElement>("tablaDetalleHistorial");

        this.tplFilaProducto = $<HTMLTemplateElement>("tplFilaProducto");
        this.tplFilaCategoria = $<HTMLTemplateElement>("tplFilaCategoria");
        this.tplFilaPedido = $<HTMLTemplateElement>("tplFilaPedido");
        this.tplFilaUsuario = $<HTMLTemplateElement>("tplFilaUsuario");
        this.tplFilaStockBajo = $<HTMLTemplateElement>("tplFilaStockBajo");
        this.tplFilaDetalleCierre = $<HTMLTemplateElement>("tplFilaDetalleCierre");
        this.tplFilaCierreMes = $<HTMLTemplateElement>("tplFilaCierreMes");
        this.tplFilaResumenMetodo = $<HTMLTemplateElement>("tplFilaResumenMetodo");
        this.tplFilaResumenMetodoHistorial = $<HTMLTemplateElement>("tplFilaResumenMetodoHistorial");
        this.tplFilaDetalleHistorial = $<HTMLTemplateElement>("tplFilaDetalleHistorial");

        this.cobrarFiadoModal = $("cobrarFiadoModal");
        this.cobrarFiadoInfo = $("cobrarFiadoInfo");
        this.cobrarFiadoMetodo = $<HTMLSelectElement>("cobrarFiadoMetodo");
        this.cobrarFiadoMonto = $<HTMLInputElement>("cobrarFiadoMonto");
        this.cobrarFiadoRef = $<HTMLInputElement>("cobrarFiadoRef");
        this.cobrarFiadoDivMonto = $("cobrarFiadoDivMonto");
        this.cobrarFiadoDivRef = $("cobrarFiadoDivRef");

        this.inicializarModales();
        this.conectarEventos();

        if (this.mesCierreInput) {
            this.mesCierreInput.value = mesActualVE();
        }
    }

    private inicializarModales(): void {
        const intentar = (intentos = 50) => {
            const bs = (window as any).bootstrap;
            if (bs) {
                const alertEl = document.getElementById("adminAlertModal");
                const confirmEl = document.getElementById("adminConfirmModal");
                if (alertEl && !this.modalInstance) this.modalInstance = new bs.Modal(alertEl);
                if (confirmEl && !this.modalConfirmInstance) this.modalConfirmInstance = new bs.Modal(confirmEl);
                if (this.productoModal && !this.productoModalInstance) this.productoModalInstance = new bs.Modal(this.productoModal);
                if (this.categoriaModal && !this.categoriaModalInstance) this.categoriaModalInstance = new bs.Modal(this.categoriaModal);
                if (this.usuarioModal && !this.usuarioModalInstance) this.usuarioModalInstance = new bs.Modal(this.usuarioModal);
                if (this.cobrarFiadoModal && !this.cobrarFiadoModalInstance) this.cobrarFiadoModalInstance = new bs.Modal(this.cobrarFiadoModal);
                return;
            }
            if (intentos > 0) setTimeout(() => intentar(intentos - 1), 100);
        };
        intentar();
    }

    private conectarEventos(): void {
        const emitirFiltros = () => this.filtrarCallback?.({
            estado: this.filtroEstado?.value ?? "Todos",
            metodoPago: this.filtroMetodoPago?.value ?? "Todos",
            fecha: this.filtroFecha?.value ?? "",
            producto: this.filtroProducto?.value ?? "Todos",
        });
        if (this.filtroEstado) this.filtroEstado.onchange = emitirFiltros;
        if (this.filtroMetodoPago) this.filtroMetodoPago.onchange = emitirFiltros;
        if (this.filtroFecha) this.filtroFecha.onchange = emitirFiltros;
        if (this.filtroProducto) this.filtroProducto.onchange = emitirFiltros;

        if (this.inputBuscarProducto) this.inputBuscarProducto.oninput = () => this.buscarProductoCallback?.(this.inputBuscarProducto!.value);
        if (this.inputBuscarPorCodigo) this.inputBuscarPorCodigo.oninput = () => this.buscarPorCodigoCallback?.(this.inputBuscarPorCodigo!.value);
        if (this.inputBuscarCedula) this.inputBuscarCedula.oninput = () => this.buscarCedulaCallback?.(this.inputBuscarCedula!.value);
        if (this.filtroCategoria) this.filtroCategoria.onchange = () => this.filtrarCategoriaCallback?.(this.filtroCategoria!.value);

        if (this.btnAgregarProducto) this.btnAgregarProducto.onclick = () => this.abrirModalProducto();
        if (this.btnGuardarProductoModal) this.btnGuardarProductoModal.onclick = () => this.guardarProductoDesdeModal();
        if (this.btnAgregarCategoria) this.btnAgregarCategoria.onclick = () => this.abrirModalCategoria();
        if (this.btnGuardarCategoriaModal) this.btnGuardarCategoriaModal.onclick = () => this.guardarCategoriaDesdeModal();
        if (this.btnAgregarUsuario) this.btnAgregarUsuario.onclick = () => this.abrirModalUsuario();
        if (this.btnGuardarUsuarioModal) this.btnGuardarUsuarioModal.onclick = () => this.guardarUsuarioDesdeModal();

        if (this.btnAplicarMesCierre) {
            this.btnAplicarMesCierre.onclick = () => {
                const mes = this.mesCierreInput?.value ?? "";
                if (mes) this.cambiarMesCierreCallback?.(mes);
            };
        }

        if (this.btnAplicarFechaCierre) {
            this.btnAplicarFechaCierre.onclick = () => {
                const fecha = this.fechaCierreHistorial?.value ?? "";
                if (fecha) this.cambiarFechaCierreHistorialCallback?.(fecha);
            };
        }

        if (this.prodImagenInputModal && this.prodImagenPreview) {
            this.prodImagenInputModal.addEventListener("change", (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        this.prodImagenPreview!.src = ev.target?.result as string;
                        this.prodImagenPreview!.style.display = "block";
                    };
                    reader.readAsDataURL(file);
                } else {
                    this.prodImagenPreview!.src = "";
                    this.prodImagenPreview!.style.display = "none";
                }
            });
        }

        document.getElementById("adminConfirmDeleteBtn")?.addEventListener("click", () => {
            if (this.productoAEliminarId) this.eliminarProductoCallback?.(this.productoAEliminarId, "delete");
            this.modalConfirmInstance?.hide();
        });

        if (this.cobrarFiadoMetodo) {
            this.cobrarFiadoMetodo.onchange = () => {
                const v = this.cobrarFiadoMetodo!.value;
                if (this.cobrarFiadoDivMonto) this.cobrarFiadoDivMonto.style.display =
                    (v === "Efectivo Bs." || v === "Divisa ($)" || v === "Pago Móvil") ? "block" : "none";
                if (this.cobrarFiadoDivRef) this.cobrarFiadoDivRef.style.display =
                    (v === "Pago Móvil" || v === "Punto de Venta") ? "block" : "none";
            };
        }

        document.getElementById("btnConfirmarCobrarFiado")?.addEventListener("click", () => {
            if (!this.cobrarFiadoId) return;
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

        if (this.productoModal) this.productoModal.addEventListener("hidden.bs.modal", () => this.limpiarFormularioProducto());
        if (this.categoriaModal) this.categoriaModal.addEventListener("hidden.bs.modal", () => this.limpiarFormularioCategoria());
        if (this.usuarioModal) this.usuarioModal.addEventListener("hidden.bs.modal", () => this.limpiarFormularioUsuario());
    }

    private llenarFila(clone: DocumentFragment, data: any): void {
        Object.keys(data).forEach(key => {
            const el = clone.querySelector(`[data-field="${key}"]`) as HTMLElement | null;
            if (!el) return;
            if (el instanceof HTMLImageElement) el.src = data[key];
            else if (el instanceof HTMLSelectElement) el.value = data[key];
            else el.textContent = data[key];
        });
    }

    mostrarTasaBCV(tasa: number): void {
        if (this.tasaBadge) this.tasaBadge.textContent = `Tasa BCV: Bs. ${tasa.toFixed(2)}`;
    }

    mostrarPedidos(pedidos: any[]): void {
        if (!this.tablaPedidos || !this.tplFilaPedido) return;
        this.tablaPedidos.innerHTML = "";
        pedidos.forEach(p => {
            const clone = this.tplFilaPedido!.content.cloneNode(true) as DocumentFragment;
            this.llenarFila(clone, p);

            const btnCobrar = clone.querySelector(".btn-procesar") as HTMLButtonElement;
            if (btnCobrar) {
                btnCobrar.disabled = !p.puedeCobrar;
                btnCobrar.onclick = () => this.abrirModalCobrarFiado(p);
            }
            const btnCancelar = clone.querySelector(".btn-cancelar") as HTMLButtonElement;
            if (btnCancelar) {
                btnCancelar.disabled = !p.puedeCancelar;
                btnCancelar.onclick = () => this.cancelarCallback?.(p.id);
            }
            const btnEliminar = clone.querySelector(".btn-eliminar-pedido") as HTMLButtonElement;
            if (btnEliminar) {
                btnEliminar.onclick = () => {
                    const confirmar = confirm(
                        `¿Eliminar definitivamente la venta #${p.id}?\n\n` +
                        `Esto devolverá el stock de los productos vendidos y borrará la venta de la base de datos.\n\n` +
                        `Esta acción no se puede deshacer.`
                    );
                    if (confirmar) this.eliminarPedidoCallback?.(p.id);
                };
            }

            this.tablaPedidos!.appendChild(clone);
        });
    }

    private abrirModalCobrarFiado(p: any): void {
        if (!this.cobrarFiadoModalInstance) return;
        this.cobrarFiadoId = p.id;
        if (this.cobrarFiadoInfo) {
            this.cobrarFiadoInfo.textContent = `${p.nomCliente} — ${p.totalUSD} / ${p.totalBs}`;
        }
        if (this.cobrarFiadoMetodo) this.cobrarFiadoMetodo.value = "";
        if (this.cobrarFiadoMonto) this.cobrarFiadoMonto.value = "";
        if (this.cobrarFiadoRef) this.cobrarFiadoRef.value = "";
        if (this.cobrarFiadoDivMonto) this.cobrarFiadoDivMonto.style.display = "none";
        if (this.cobrarFiadoDivRef) this.cobrarFiadoDivRef.style.display = "none";
        this.cobrarFiadoModalInstance.show();
    }

    mostrarTotalPagadoCliente(totalUSD: number, totalBs: number): void {
        if (this.spanTotalPagadoCliente) this.spanTotalPagadoCliente.textContent = `$ ${totalUSD.toFixed(2)}`;
        if (this.spTotalPagadoClienteBs) this.spTotalPagadoClienteBs.textContent = `Bs. ${totalBs.toFixed(2)}`;
    }

    poblarFiltroProductos(nombres: string[]): void {
        if (!this.filtroProducto) return;
        while (this.filtroProducto.options.length > 1) this.filtroProducto.remove(1);
        nombres.forEach(nombre => {
            const option = document.createElement("option");
            option.value = nombre;
            option.textContent = nombre;
            this.filtroProducto!.appendChild(option);
        });
    }

    mostrarProductos(productos: any[]): void {
        if (!this.tablaProductos || !this.tplFilaProducto) return;
        this.tablaProductos.innerHTML = "";
        productos.forEach(p => {
            const clone = this.tplFilaProducto!.content.cloneNode(true) as DocumentFragment;
            this.llenarFila(clone, p);

            const btnEditar = clone.querySelector(".btn-editar") as HTMLButtonElement;
            if (btnEditar) btnEditar.onclick = () => this.abrirModalProducto(p);
            const btnEliminar = clone.querySelector(".btn-eliminar") as HTMLButtonElement;
            if (btnEliminar) btnEliminar.onclick = () => this.confirmarEliminarProducto(p.id, p.nombre);

            const fila = clone.querySelector("tr");
            if (fila && p.claseStock) fila.className = p.claseStock;

            this.tablaProductos!.appendChild(clone);
        });
    }

    actualizarProximoCodigo(codigo: string): void {
        this.proximoCodigo = codigo;
    }

    mostrarCategorias(categorias: any[]): void {
        if (!this.tablaCategorias || !this.tplFilaCategoria) return;
        this.tablaCategorias.innerHTML = "";
        categorias.forEach(c => {
            const clone = this.tplFilaCategoria!.content.cloneNode(true) as DocumentFragment;
            this.llenarFila(clone, c);

            const badge = clone.querySelector("[data-field='estadoBadge']") as HTMLElement;
            if (badge) badge.className = `badge ${c.estadoClase}`;

            const btnEditar = clone.querySelector(".btn-editar-cat") as HTMLButtonElement;
            if (btnEditar) btnEditar.onclick = () => this.abrirModalCategoria(c);
            const btnToggle = clone.querySelector(".btn-toggle-cat") as HTMLButtonElement;
            if (btnToggle) {
                btnToggle.textContent = c.accionTexto;
                btnToggle.onclick = () => this.cambiarActivaCategoriaCallback?.(c.id, !c.activa);
            }
            const btnEliminar = clone.querySelector(".btn-eliminar-cat") as HTMLButtonElement;
            if (btnEliminar) btnEliminar.onclick = () => {
                if (confirm(`¿Eliminar la categoría "${c.nombre}"?`)) this.eliminarCategoriaCallback?.(c.id);
            };

            this.tablaCategorias!.appendChild(clone);
        });
    }

    poblarSelectCategorias(categorias: any[]): void {
        if (!this.prodCategoriaInput) return;
        const valorActual = this.prodCategoriaInput.value;
        this.prodCategoriaInput.innerHTML = '<option value="">Seleccione</option>';
        categorias.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.nombre;
            option.textContent = cat.nombre;
            this.prodCategoriaInput!.appendChild(option);
        });
        if (valorActual) this.prodCategoriaInput.value = valorActual;
    }

    poblarFiltroCategorias(categorias: any[]): void {
        if (!this.filtroCategoria) return;
        const valorActual = this.filtroCategoria.value;
        this.filtroCategoria.innerHTML = '<option value="Todas">Todas</option>';
        categorias.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.nombre;
            option.textContent = cat.nombre;
            this.filtroCategoria!.appendChild(option);
        });
        if (valorActual) this.filtroCategoria.value = valorActual;
    }

    private abrirModalCategoria(datos?: any): void {
        if (!this.categoriaModal || !this.categoriaModalInstance) return;
        if (datos) {
            if (this.categoriaModalLabel) this.categoriaModalLabel.textContent = "Editar Categoría";
            if (this.catNombreInput) this.catNombreInput.value = datos.nombre || "";
            if (this.catDescripcionInput) this.catDescripcionInput.value = datos.descripcion || "";
            this.categoriaEditandoId = datos.id || null;
        } else {
            if (this.categoriaModalLabel) this.categoriaModalLabel.textContent = "Agregar Categoría";
            this.limpiarFormularioCategoria();
            this.categoriaEditandoId = null;
        }
        this.categoriaModalInstance.show();
    }

    private limpiarFormularioCategoria(): void {
        if (this.catNombreInput) this.catNombreInput.value = "";
        if (this.catDescripcionInput) this.catDescripcionInput.value = "";
    }

    private guardarCategoriaDesdeModal(): void {
        const nombre = this.catNombreInput?.value.trim() ?? "";
        const descripcion = this.catDescripcionInput?.value.trim() ?? "";
        this.guardarCategoriaCallback?.({ id: this.categoriaEditandoId, nombre, descripcion });
        this.categoriaModalInstance?.hide();
    }

    mostrarUsuarios(usuarios: any[]): void {
        if (!this.tablaUsuarios || !this.tplFilaUsuario) return;
        this.tablaUsuarios.innerHTML = "";
        usuarios.forEach(u => {
            const clone = this.tplFilaUsuario!.content.cloneNode(true) as DocumentFragment;
            this.llenarFila(clone, u);

            const badge = clone.querySelector("[data-field='estadoBadge']") as HTMLElement;
            if (badge) badge.className = `badge ${u.estadoClase}`;

            const sel = clone.querySelector(".sel-rol") as HTMLSelectElement;
            if (sel) {
                sel.value = u.rol;
                sel.onchange = () => this.cambiarRolUsuarioCallback?.(u.id, sel.value as "admin" | "vendedor");
            }

            const btn = clone.querySelector(".btn-toggle-user") as HTMLButtonElement;
            if (btn) {
                btn.textContent = u.accionTexto;
                btn.onclick = () => this.cambiarActivoUsuarioCallback?.(u.id, !u.activo);
            }

            this.tablaUsuarios!.appendChild(clone);
        });
    }

    private abrirModalUsuario(): void {
        if (!this.usuarioModal || !this.usuarioModalInstance) return;
        this.limpiarFormularioUsuario();
        this.usuarioModalInstance.show();
    }

    private limpiarFormularioUsuario(): void {
        if (this.userEmailInput) this.userEmailInput.value = "";
        if (this.userPasswordInput) this.userPasswordInput.value = "";
        if (this.userNombreInput) this.userNombreInput.value = "";
        if (this.userRolSelect) this.userRolSelect.value = "vendedor";
    }

    private guardarUsuarioDesdeModal(): void {
        const email = this.userEmailInput?.value.trim() ?? "";
        const password = this.userPasswordInput?.value.trim() ?? "";
        const nombre = this.userNombreInput?.value.trim() ?? "";
        const rol = (this.userRolSelect?.value ?? "vendedor") as "admin" | "vendedor";
        this.guardarUsuarioCallback?.({ email, password, nombre, rol });
        this.usuarioModalInstance?.hide();
    }

    mostrarCierreCaja(data: any): void {
        if (this.cierreTotalBs) this.cierreTotalBs.textContent = `Bs. ${data.totalBs.toFixed(2)}`;
        if (this.cierreTotalUSD) this.cierreTotalUSD.textContent = `$${data.totalUSD.toFixed(2)}`;
        if (this.cierreGananciaBs) this.cierreGananciaBs.textContent = `Bs. ${data.gananciaBs.toFixed(2)}`;
        if (this.cierreGananciaUSD) this.cierreGananciaUSD.textContent = `$${data.gananciaUSD.toFixed(2)}`;
        if (this.cierreFiadoBs) this.cierreFiadoBs.textContent = `Bs. ${data.fiadoBs.toFixed(2)}`;
        if (this.cierreFiadoUSD) this.cierreFiadoUSD.textContent = `$${data.fiadoUSD.toFixed(2)}`;
        if (this.cierreMasVendido) this.cierreMasVendido.textContent = data.masVendido.nombre;
        if (this.cierreMasVendidoDetalle) this.cierreMasVendidoDetalle.textContent = data.masVendido.detalle;

        if (this.tablaDetalleCierre && this.tplFilaDetalleCierre) {
            this.tablaDetalleCierre.innerHTML = "";
            if (data.detalleVentas.length === 0) {
                const fila = this.tablaDetalleCierre.insertRow();
                fila.innerHTML = `<td colspan="6" class="text-center text-muted">No hay ventas registradas hoy</td>`;
            } else {
                data.detalleVentas.forEach((fila: any) => {
                    const clone = this.tplFilaDetalleCierre!.content.cloneNode(true) as DocumentFragment;
                    this.llenarFila(clone, fila);
                    this.tablaDetalleCierre!.appendChild(clone);
                });
            }
        }

        if (data.resumenPorMetodo) {
            this.mostrarResumenPorMetodoPago(data.resumenPorMetodo);
        }
    }

    mostrarResumenPorMetodoPago(resumen: any[]): void {
        if (!this.tablaResumenMetodoPago || !this.tplFilaResumenMetodo) return;
        this.tablaResumenMetodoPago.innerHTML = "";

        if (!resumen || resumen.length === 0) {
            const fila = this.tablaResumenMetodoPago.insertRow();
            fila.innerHTML = `<td colspan="4" class="text-center text-muted">Sin ventas registradas hoy</td>`;
            return;
        }

        resumen.forEach(item => {
            const clone = this.tplFilaResumenMetodo!.content.cloneNode(true) as DocumentFragment;
            this.llenarFila(clone, {
                metodo: item.metodo,
                totalBs: `Bs. ${Number(item.totalBs || 0).toFixed(2)}`,
                totalUSD: `$${Number(item.totalUSD || 0).toFixed(2)}`,
                cantidad: String(item.cantidad ?? 0),
            });
            const fila = clone.querySelector("tr");
            if (fila && item.esTotal) fila.className = "table-success fw-bold";
            this.tablaResumenMetodoPago!.appendChild(clone);
        });
    }

    mostrarResumenMes(data: any): void {
        if (this.cierreMesTotalBs) this.cierreMesTotalBs.textContent = `Bs. ${data.totalBs.toFixed(2)}`;
        if (this.cierreMesTotalUSD) this.cierreMesTotalUSD.textContent = `$${data.totalUSD.toFixed(2)}`;
        if (this.cierreMesGananciaBs) this.cierreMesGananciaBs.textContent = `Bs. ${data.gananciaBs.toFixed(2)}`;
        if (this.cierreMesGananciaUSD) this.cierreMesGananciaUSD.textContent = `$${data.gananciaUSD.toFixed(2)}`;
    }

    mostrarCierreMensual(data: any): void {
        if (this.cierreMesTotalBsDetalle) this.cierreMesTotalBsDetalle.textContent = `Bs. ${data.totalBs.toFixed(2)}`;
        if (this.cierreMesTotalUSDDetalle) this.cierreMesTotalUSDDetalle.textContent = `$${data.totalUSD.toFixed(2)}`;
        if (this.cierreMesGananciaBsDetalle) this.cierreMesGananciaBsDetalle.textContent = `Bs. ${data.gananciaBs.toFixed(2)}`;
        if (this.cierreMesGananciaUSDDetalle) this.cierreMesGananciaUSDDetalle.textContent = `$${data.gananciaUSD.toFixed(2)}`;

        if (this.cierreMesFiadoBs) this.cierreMesFiadoBs.textContent = `Bs. ${data.fiadoBs.toFixed(2)}`;
        if (this.cierreMesFiadoUSD) this.cierreMesFiadoUSD.textContent = `$${data.fiadoUSD.toFixed(2)}`;
        if (this.cierreMesMasVendido) this.cierreMesMasVendido.textContent = data.masVendido.nombre;
        if (this.cierreMesMasVendidoDetalle) this.cierreMesMasVendidoDetalle.textContent = data.masVendido.detalle;
        if (this.cierreMesCantidadVentas) this.cierreMesCantidadVentas.textContent = String(data.cantidadVentas);
        if (this.cierreMesPromedioUSD) {
            this.cierreMesPromedioUSD.textContent = `Bs. ${data.promedioVentaBs.toFixed(2)} / $${data.promedioVentaUSD.toFixed(2)}`;
        }

        if (this.tablaCierreMensualDias && this.tplFilaCierreMes) {
            this.tablaCierreMensualDias.innerHTML = "";
            if (data.detallePorDia.length === 0) {
                const fila = this.tablaCierreMensualDias.insertRow();
                fila.innerHTML = `<td colspan="6" class="text-center text-muted">Sin ventas registradas en este mes</td>`;
            } else {
                data.detallePorDia.forEach((d: any) => {
                    const clone = this.tplFilaCierreMes!.content.cloneNode(true) as DocumentFragment;
                    this.llenarFila(clone, d);
                    this.tablaCierreMensualDias!.appendChild(clone);
                });
            }
        }

        if (this.cierreMensualContenedor) this.cierreMensualContenedor.style.display = "block";
    }

    mostrarCierreHistorial(data: any): void {
        if (this.histTotalBs) this.histTotalBs.textContent = `Bs. ${data.totalBs.toFixed(2)}`;
        if (this.histTotalUSD) this.histTotalUSD.textContent = `$${data.totalUSD.toFixed(2)}`;
        if (this.histGananciaBs) this.histGananciaBs.textContent = `Bs. ${data.gananciaBs.toFixed(2)}`;
        if (this.histGananciaUSD) this.histGananciaUSD.textContent = `$${data.gananciaUSD.toFixed(2)}`;
        if (this.histFiadoBs) this.histFiadoBs.textContent = `Bs. ${data.fiadoBs.toFixed(2)}`;
        if (this.histFiadoUSD) this.histFiadoUSD.textContent = `$${data.fiadoUSD.toFixed(2)}`;
        
        if (this.histMasVendido) this.histMasVendido.textContent = data.masVendido.nombre;
        if (this.histMasVendidoDetalle) this.histMasVendidoDetalle.textContent = data.masVendido.detalle;

        if (this.tablaResumenMetodoHistorial && this.tplFilaResumenMetodoHistorial) {
            this.tablaResumenMetodoHistorial.innerHTML = "";
            const resumen = data.resumenPorMetodo || [];
            if (resumen.length === 0) {
                const fila = this.tablaResumenMetodoHistorial.insertRow();
                fila.innerHTML = `<td colspan="4" class="text-center text-muted">Sin ventas registradas este día</td>`;
            } else {
                resumen.forEach((item: any) => {
                    const clone = this.tplFilaResumenMetodoHistorial!.content.cloneNode(true) as DocumentFragment;
                    this.llenarFila(clone, {
                        metodo: item.metodo,
                        totalBs: `Bs. ${Number(item.totalBs || 0).toFixed(2)}`,
                        totalUSD: `$${Number(item.totalUSD || 0).toFixed(2)}`,
                        cantidad: String(item.cantidad ?? 0),
                    });
                    const fila = clone.querySelector("tr");
                    if (fila && item.esTotal) fila.className = "table-success fw-bold";
                    this.tablaResumenMetodoHistorial!.appendChild(clone);
                });
            }
        }

        if (this.tablaDetalleHistorial && this.tplFilaDetalleHistorial) {
            this.tablaDetalleHistorial.innerHTML = "";
            const detalle = data.detalleVentas || [];
            if (detalle.length === 0) {
                const fila = this.tablaDetalleHistorial.insertRow();
                fila.innerHTML = `<td colspan="6" class="text-center text-muted">No hay ventas registradas este día</td>`;
            } else {
                detalle.forEach((fila: any) => {
                    const clone = this.tplFilaDetalleHistorial!.content.cloneNode(true) as DocumentFragment;
                    this.llenarFila(clone, fila);
                    this.tablaDetalleHistorial!.appendChild(clone);
                });
            }
        }

        if (this.cierreHistorialContenedor) this.cierreHistorialContenedor.style.display = "block";
    }

    private abrirModalProducto(datos?: any): void {
        if (!this.productoModal || !this.productoModalInstance) return;
        
        if (datos) {
            if (this.productoModalLabel) this.productoModalLabel.textContent = "Editar Producto";
            if (this.prodCodigoInput) this.prodCodigoInput.value = datos.codigo || "";
            if (this.prodNombreInput) this.prodNombreInput.value = datos.nombre || "";
            if (this.prodCategoriaInput) this.prodCategoriaInput.value = datos.categoria || "";
            if (this.prodTipoVentaInput) this.prodTipoVentaInput.value = datos.tipoVentaOriginal || "gramos";
            
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
            if (this.prodImagenInputModal) this.prodImagenInputModal.value = "";
        } else {
            if (this.productoModalLabel) this.productoModalLabel.textContent = "Agregar Producto";
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

    private limpiarFormularioProducto(): void {
        if (this.prodCodigoInput) this.prodCodigoInput.value = "";
        if (this.prodNombreInput) this.prodNombreInput.value = "";
        if (this.prodCategoriaInput) this.prodCategoriaInput.value = "";
        if (this.prodTipoVentaInput) this.prodTipoVentaInput.value = "gramos";
        if (this.prodPrecioCompraInput) this.prodPrecioCompraInput.value = "";
        if (this.prodPrecioVentaInput) this.prodPrecioVentaInput.value = "";
        if (this.prodStockInput) this.prodStockInput.value = "";
    }

    private guardarProductoDesdeModal(): void {
        const codigo = this.prodCodigoInput?.value.trim() ?? "";
        const nombre = this.prodNombreInput?.value.trim() ?? "";
        const categoria = this.prodCategoriaInput?.value.trim() ?? "";
        const tipoVenta = (this.prodTipoVentaInput?.value ?? "gramos") as "gramos" | "unidad";
        const precioCompra = parseFloat(this.prodPrecioCompraInput?.value ?? "");
        const precioVenta = parseFloat(this.prodPrecioVentaInput?.value ?? "");
        const stock = parseFloat(this.prodStockInput?.value ?? "");
        let nombreImagen = "";
        const file = this.prodImagenInputModal?.files?.[0];
        if (file) nombreImagen = file.name;

        this.guardarProductoCallback?.({
            id: this.productoEditandoId,
            codigo, nombre, categoria, tipoVenta,
            precioCompra, precioVenta, stock,
            imagen: nombreImagen,
        });
        this.productoModalInstance?.hide();
    }

    mostrarModal(tipo: "success" | "danger" | "warning", mensaje: string): void {
        if (!this.modalInstance) {
            console.log(`[${tipo}] ${mensaje}`);
            return;
        }
        const body = document.getElementById("adminAlertModalBody");
        if (body) body.innerHTML = `<div class="text-${tipo}">${mensaje}</div>`;
        this.modalInstance.show();
        setTimeout(() => this.modalInstance.hide(), 2000);
    }

    private confirmarEliminarProducto(id: string, nombre: string): void {
        this.productoAEliminarId = id;
        const body = document.getElementById("adminConfirmModalBody");
        if (!body || !this.modalConfirmInstance) return;
        body.innerHTML = `¿Qué desea hacer con "<strong>${nombre}</strong>"?`;
        this.modalConfirmInstance.show();
    }

    onCobrarFiado(cb: (id: string, metodoPago: string, montoRecibido: string, referencia: string) => void): void {
        this.cobrarFiadoCallback = cb;
    }
    onCancelarPedido(cb: (id: string) => void): void { this.cancelarCallback = cb; }
    onEliminarPedido(cb: (id: string) => void): void { this.eliminarPedidoCallback = cb; }
    onFiltrarPedidos(cb: (filtros: any) => void): void { this.filtrarCallback = cb; }
    onBuscarProducto(cb: (texto: string) => void): void { this.buscarProductoCallback = cb; }
    onBuscarPorCodigo(cb: (codigo: string) => void): void { this.buscarPorCodigoCallback = cb; }
    onBuscarCedula(cb: (cedula: string) => void): void { this.buscarCedulaCallback = cb; }
    onFiltrarCategoria(cb: (categoria: string) => void): void { this.filtrarCategoriaCallback = cb; }
    onGuardarProducto(cb: (producto: any) => void): void { this.guardarProductoCallback = cb; }
    onEliminarProducto(cb: (id: string, accion: "delete" | "disable" | "enable") => void): void {
        this.eliminarProductoCallback = cb;
    }
    onGuardarCategoria(cb: (cat: any) => void): void { this.guardarCategoriaCallback = cb; }
    onEliminarCategoria(cb: (id: string) => void): void { this.eliminarCategoriaCallback = cb; }
    onCambiarActivaCategoria(cb: (id: string, activa: boolean) => void): void {
        this.cambiarActivaCategoriaCallback = cb;
    }
    onGuardarUsuario(cb: (u: any) => void): void { this.guardarUsuarioCallback = cb; }
    onCambiarActivoUsuario(cb: (id: string, activo: boolean) => void): void {
        this.cambiarActivoUsuarioCallback = cb;
    }
    onCambiarRolUsuario(cb: (id: string, rol: "admin" | "vendedor") => void): void {
        this.cambiarRolUsuarioCallback = cb;
    }
    onCambiarMesCierre(cb: (mes: string) => void): void { this.cambiarMesCierreCallback = cb; }
    onCambiarFechaCierreHistorial(cb: (fecha: string) => void): void {
        this.cambiarFechaCierreHistorialCallback = cb;
    }

    mostrar(): void { document.body.removeAttribute("hidden"); }
    ocultar(): void { document.body.setAttribute("hidden", "true"); }
}