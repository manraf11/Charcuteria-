export default class Cl_mUsuario {
    static validar(datos) {
        if (!datos.email?.trim())
            throw new Error("El email es obligatorio");
        if (!datos.password?.trim())
            throw new Error("La contraseña es obligatoria");
        if (!datos.nombre?.trim())
            throw new Error("El nombre es obligatorio");
        if (!datos.rol)
            throw new Error("El rol es obligatorio");
        if (datos.password.length < 6)
            throw new Error("La contraseña debe tener al menos 6 caracteres");
        if (!["admin", "vendedor"].includes(datos.rol))
            throw new Error("Rol inválido");
    }
    static prepararParaTabla(u) {
        return {
            id: u.id,
            nombre: u.nombre,
            email: u.email,
            rol: u.rol,
            activo: u.activo,
            estadoTexto: u.activo ? "Activo" : "Inactivo",
            estadoClase: u.activo ? "bg-success" : "bg-secondary",
            accionTexto: u.activo ? "Desactivar" : "Activar",
        };
    }
}
//# sourceMappingURL=Cl_mUsuario.js.map