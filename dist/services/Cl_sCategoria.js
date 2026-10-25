import Cl_sSupabase from "./Cl_sSupabase.js";
export default class Cl_sCategoria {
    /** Devuelve todas las categorías activas */
    static async obtenerTodas() {
        const { data, error } = await Cl_sSupabase.client
            .from("categorias")
            .select("id, nombre, descripcion, activa")
            .order("nombre");
        if (error) {
            console.error("[Categorias] obtenerTodas:", error);
            return { ok: false, data: [] };
        }
        return { ok: true, data: data || [] };
    }
    /** Crea una categoría nueva */
    static async agregar(nombre, descripcion = "") {
        if (!nombre?.trim())
            return { ok: false, mensaje: "El nombre es obligatorio" };
        const { data, error } = await Cl_sSupabase.client
            .from("categorias")
            .insert({ nombre: nombre.trim(), descripcion: descripcion.trim() || null })
            .select()
            .single();
        if (error) {
            if (error.code === "23505")
                return { ok: false, mensaje: "Ya existe una categoría con ese nombre" };
            return { ok: false, mensaje: error.message };
        }
        return { ok: true, mensaje: "Categoría creada", data };
    }
    /** Actualiza nombre/descripción */
    static async actualizar(id, nombre, descripcion = "") {
        if (!id)
            return { ok: false, mensaje: "ID inválido" };
        if (!nombre?.trim())
            return { ok: false, mensaje: "El nombre es obligatorio" };
        const { error } = await Cl_sSupabase.client
            .from("categorias")
            .update({ nombre: nombre.trim(), descripcion: descripcion.trim() || null })
            .eq("id", id);
        if (error) {
            if (error.code === "23505")
                return { ok: false, mensaje: "Ya existe otra categoría con ese nombre" };
            return { ok: false, mensaje: error.message };
        }
        return { ok: true, mensaje: "Categoría actualizada" };
    }
    /** Activa/desactiva categoría (soft delete) */
    static async cambiarActiva(id, activa) {
        if (!id)
            return { ok: false, mensaje: "ID inválido" };
        const { error } = await Cl_sSupabase.client
            .from("categorias")
            .update({ activa })
            .eq("id", id);
        if (error)
            return { ok: false, mensaje: error.message };
        return { ok: true, mensaje: activa ? "Categoría activada" : "Categoría desactivada" };
    }
    /** Elimina una categoría (los productos quedan con categoria_id null) */
    static async eliminar(id) {
        if (!id)
            return { ok: false, mensaje: "ID inválido" };
        const { error } = await Cl_sSupabase.client.from("categorias").delete().eq("id", id);
        if (error)
            return { ok: false, mensaje: error.message };
        return { ok: true, mensaje: "Categoría eliminada" };
    }
}
//# sourceMappingURL=Cl_sCategoria.js.map