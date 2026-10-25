import Cl_sSupabase from "./Cl_sSupabase.js";

export default class Cl_sUsuario {
    /** Lista todos los perfiles (solo admin puede ver todos) */
    static async obtenerTodos(): Promise<{ ok: boolean; data: any[] }> {
        const { data, error } = await Cl_sSupabase.client
            .from("perfiles")
            .select("id, email, nombre, rol, activo, created_at")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("[Usuarios] error:", error);
            return { ok: false, data: [] };
        }
        return { ok: true, data: data || [] };
    }

    /** Crea un usuario llamando al RPC de Supabase */
    static async crear(
        email: string,
        password: string,
        nombre: string,
        rol: "admin" | "vendedor"
    ): Promise<{ ok: boolean; mensaje: string }> {
        const { data, error } = await Cl_sSupabase.client.rpc("crear_usuario", {
            p_email: email,
            p_password: password,
            p_nombre: nombre,
            p_rol: rol,
        });

        if (error) {
            console.error("[Usuarios] rpc error:", error);
            return { ok: false, mensaje: error.message };
        }

        const res = data as any;
        if (!res?.ok) {
            return { ok: false, mensaje: res?.error || "Error al crear usuario" };
        }
        return { ok: true, mensaje: res.mensaje || "Usuario creado" };
    }

    /** Activa o desactiva un usuario */
    static async cambiarActivo(id: string, activo: boolean): Promise<{ ok: boolean; mensaje: string }> {
        const { error } = await Cl_sSupabase.client
            .from("perfiles")
            .update({ activo })
            .eq("id", id);

        if (error) return { ok: false, mensaje: error.message };
        return { ok: true, mensaje: activo ? "Usuario activado" : "Usuario desactivado" };
    }

    /** Cambia el rol de un usuario */
    static async cambiarRol(id: string, rol: "admin" | "vendedor"): Promise<{ ok: boolean; mensaje: string }> {
        const { error } = await Cl_sSupabase.client
            .from("perfiles")
            .update({ rol })
            .eq("id", id);

        if (error) return { ok: false, mensaje: error.message };
        return { ok: true, mensaje: "Rol actualizado" };
    }
}