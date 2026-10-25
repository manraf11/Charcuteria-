import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const SUPABASE_URL = "";
const SUPABASE_KEY = "";
export default class Cl_sSupabase {
    static _client = null;
    static get client() {
        if (!this._client) {
            this._client = createClient(SUPABASE_URL, SUPABASE_KEY, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    storageKey: "charcuteria-auth",
                },
            });
        }
        return this._client;
    }
    static async login(email, password) {
        const { data, error } = await this.client.auth.signInWithPassword({ email, password });
        if (error)
            return { ok: false, mensaje: error.message };
        return { ok: true, user: data.user, session: data.session };
    }
    static async logout() {
        await this.client.auth.signOut();
        try {
            localStorage.removeItem("charcuteria-auth");
            sessionStorage.clear();
        }
        catch (_) { }
    }
    static async getUsuarioActual() {
        const { data: { user } } = await this.client.auth.getUser();
        if (!user)
            return null;
        const { data: perfil } = await this.client
            .from("perfiles")
            .select("*")
            .eq("id", user.id)
            .single();
        return perfil;
    }
    static async sinSesion() {
        const { data: { session } } = await this.client.auth.getSession();
        return !session?.user;
    }
    static async verificarSesion(rolEsperado) {
        try {
            const perfil = await this.getUsuarioActual();
            if (!perfil) {
                window.location.replace("index.html");
                return false;
            }
            if (rolEsperado === "admin" && perfil.rol !== "admin") {
                window.location.replace("index.html");
                return false;
            }
            if (rolEsperado === "vendedor" && perfil.rol !== "vendedor" && perfil.rol !== "admin") {
                window.location.replace("index.html");
                return false;
            }
            return true;
        }
        catch (_) {
            window.location.replace("index.html");
            return false;
        }
    }
    static onAuthChange(callback) {
        return this.client.auth.onAuthStateChange((_event, session) => {
            callback(session);
        });
    }
}
//# sourceMappingURL=Cl_sSupabase.js.map