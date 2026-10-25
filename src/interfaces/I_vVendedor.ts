export default interface I_vVendedor {
    // Getters de inputs
    get nomCliente(): string;
    get cedulaCliente(): string;
    get modoPago(): string;
    get metodoPago(): string;
    get referenciaPago(): string;
    get montoPagoMovil(): string;
    get referenciaPuntoVenta(): string;
    get montoEfectivo(): string;
    get montoDivisa(): string;
    get vueltoDivisa(): string;
    get notaFiado(): string;
    get metodoPago2(): string;
    get referenciaPago2(): string;
    get montoPagoMovil2(): string;
    get referenciaPuntoVenta2(): string;
    get montoEfectivo2(): string;

    // Setters para edición
    setNombreCliente(n: string): void;
    setCedula(c: string): void;
    setMetodoPago(m: string): void;

    // Mostrar
    mostrarTasaBCV(t: number): void;
    mostrarProductos(productosPreparados: any[]): void;
    mostrarCarrito(itemsPreparados: any[]): void;
    mostrarTotal(totalBs: number, totalUSD: number): void;
    mostrarVentasDia(ventasPreparadas: any[]): void;
    mostrarBadgeEdicion(id: string): void;
    ocultarBadgeEdicion(): void;
    mostrarAlerta(tipo: string, msg: string): void;
    poblarFiltroCategorias(categorias: any[]): void;

    // Bloqueo de botón para evitar doble registro
    bloquearBotonVenta(): void;
    desbloquearBotonVenta(): void;

    // 🖨️ Imprimir recibo profesional
    imprimirRecibo(pedido: any, tasaBCV: number): void;

    // Callbacks
    onAgregarProducto(cb: (c: string, n: number, precioMayor?: number | null) => void): void;
    onEliminarProducto(cb: (c: string) => void): void;
    onBuscarProducto(cb: (t: string) => void): void;
    onBuscarPorCategoria(cb: (c: string) => void): void;
    onCedulaChange(cb: (c: string) => void): void;
    onEnviar(cb: () => void): void;
    onEditarVenta(cb: (id: string) => void): void;
    onEliminarVenta(cb: (id: string) => void): void;
    onCancelarEdicion(cb: () => void): void;

    limpiar(): void;
    mostrar(): void;
    ocultar(): void;
}