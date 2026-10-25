export default class Cl_mCategoria {
    static validar(datos: any): void {
        if (!datos.nombre?.trim()) throw new Error("El nombre es obligatorio");
    }

    static prepararParaTabla(c: any): any {
        return {
            id: c.id,
            nombre: c.nombre,
            descripcion: c.descripcion || "—",
            activa: c.activa,
            estadoTexto: c.activa ? "Activa" : "Inactiva",
            estadoClase: c.activa ? "bg-success" : "bg-secondary",
            accionTexto: c.activa ? "Desactivar" : "Activar",
        };
    }
}