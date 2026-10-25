export default interface I_vAdmin {
    // Mostrar datos
    mostrarTasaBCV(tasa: number): void;
    mostrarPedidos(pedidosPreparados: any[]): void;
    mostrarProductos(productosPreparados: any[]): void;
    mostrarCategorias(categoriasPreparadas: any[]): void;
    mostrarUsuarios(usuariosPreparados: any[]): void;
    mostrarCierreCaja(data: any): void;
    mostrarCierreMensual(data: any): void;
    mostrarCierreHistorial(data: any): void;
    mostrarResumenPorMetodoPago(resumen: any[]): void;
    mostrarResumenMes(data: any): void;
    mostrarTotalPagadoCliente(totalUSD: number, totalBs: number): void;
    actualizarProximoCodigo(codigo: string): void;

    // Selects / filtros
    poblarFiltroProductos(nombres: string[]): void;
    poblarSelectCategorias(categorias: any[]): void;
    poblarFiltroCategorias(categorias: any[]): void;

    // Modales
    mostrarModal(tipo: "success" | "danger" | "warning", mensaje: string): void;

    // Callbacks
    onCobrarFiado(cb: (id: string, metodoPago: string, montoRecibido: string, referencia: string) => void): void;
    onCancelarPedido(cb: (id: string) => void): void;
    onEliminarPedido(cb: (id: string) => void): void;
    onFiltrarPedidos(cb: (filtros: any) => void): void;
    onBuscarCedula(cb: (cedula: string) => void): void;
    onBuscarProducto(cb: (texto: string) => void): void;
    onBuscarPorCodigo(cb: (codigo: string) => void): void;
    onFiltrarCategoria(cb: (categoria: string) => void): void;

    onGuardarProducto(cb: (producto: any) => void): void;
    onEliminarProducto(cb: (id: string, accion: "delete" | "disable" | "enable") => void): void;

    onGuardarCategoria(cb: (cat: any) => void): void;
    onEliminarCategoria(cb: (id: string) => void): void;
    onCambiarActivaCategoria(cb: (id: string, activa: boolean) => void): void;

    onGuardarUsuario(cb: (u: any) => void): void;
    onCambiarActivoUsuario(cb: (id: string, activo: boolean) => void): void;
    onCambiarRolUsuario(cb: (id: string, rol: "admin" | "vendedor") => void): void;

    onCambiarMesCierre(cb: (mes: string) => void): void;
    onCambiarFechaCierreHistorial(cb: (fecha: string) => void): void;

    mostrar(): void;
    ocultar(): void;
}