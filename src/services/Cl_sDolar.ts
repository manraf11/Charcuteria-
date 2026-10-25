export default class Cl_sDolar {
    private static CACHE_KEY = "dolar_rate_cache_v2";
    private static CACHE_EXPIRY = 60 * 60 * 1000; // 1 hora
    private static DEFAULT_RATE = 526.86; // Tasa de respaldo (según la doc de dolarvzla)

    // URL del nuevo endpoint estático sin API Key
    private static API_URL = "https://rates.dolarvzla.com/bcv/current.json";

    static async obtenerTasa(): Promise<number> {
        // 1) Intentar usar caché reciente (menos de 1 hora)
        try {
            const cached = localStorage.getItem(this.CACHE_KEY);
            if (cached) {
                const { rate, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < this.CACHE_EXPIRY && rate > 0) {
                    console.log("[Dolar] Usando caché reciente:", rate);
                    return rate;
                }
            }
        } catch (_) {}

        // 2) Consultar la nueva API
        try {
            console.log("[Dolar] Consultando API dolarvzla...");
            const respuesta = await fetch(this.API_URL);
            
            if (!respuesta.ok) {
                throw new Error(`API respondió con status: ${respuesta.status}`);
            }
            
            const data = await respuesta.json();
            
            // Validar la estructura de la respuesta
            // Según la doc: { current: { usd: 526.8694, eur: ... , date: "2026-05-22" }, ... }
            let rate = 0;
            if (data?.current?.usd) {
                rate = Number(data.current.usd);
            } else if (data?.usd) {
                rate = Number(data.usd); // Por si acaso devuelven el objeto plano
            }

            if (rate > 0) {
                console.log(`[Dolar] Tasa obtenida (Fecha BCV: ${data.current?.date || 'N/A'}):`, rate);
                
                // Guardar en caché para futuras peticiones
                try {
                    localStorage.setItem(this.CACHE_KEY, JSON.stringify({ rate, timestamp: Date.now() }));
                } catch (_) {}
                
                return rate;
            } else {
                throw new Error("No se encontró una tasa válida en la respuesta");
            }
        } catch (error) {
            console.error("[Dolar] Error al consultar la nueva API:", error);
            
            // 3) Si falla, intentar usar caché antigua (aunque esté caducada)
            try {
                const cached = localStorage.getItem(this.CACHE_KEY);
                if (cached) {
                    const { rate } = JSON.parse(cached);
                    if (typeof rate === "number" && rate > 0) {
                        console.warn("[Dolar] Usando tasa de caché antigua:", rate);
                        return rate;
                    }
                }
            } catch (_) {}
            
            // 4) Último recurso: tasa por defecto
            console.warn("[Dolar] Usando tasa por defecto:", this.DEFAULT_RATE);
            return this.DEFAULT_RATE;
        }
    }
}