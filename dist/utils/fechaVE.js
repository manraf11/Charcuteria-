/**
 * Utilidades de fecha/hora en zona horaria de Venezuela (America/Caracas).
 * Evita el bug de usar toISOString() que devuelve UTC y adelanta el día
 * a partir de las 8:00 PM hora local.
 */
const TZ = "America/Caracas";
/** Devuelve la fecha de HOY en Venezuela como "YYYY-MM-DD" */
export function fechaHoyVE() {
    const partes = new Intl.DateTimeFormat("en-CA", {
        timeZone: TZ,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());
    const y = partes.find(p => p.type === "year")?.value ?? "0000";
    const m = partes.find(p => p.type === "month")?.value ?? "00";
    const d = partes.find(p => p.type === "day")?.value ?? "00";
    return `${y}-${m}-${d}`;
}
/** Devuelve la hora actual en Venezuela como "HH:MM:SS" (24h) */
export function horaAhoraVE() {
    const partes = new Intl.DateTimeFormat("en-GB", {
        timeZone: TZ,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    }).formatToParts(new Date());
    const h = partes.find(p => p.type === "hour")?.value ?? "00";
    const m = partes.find(p => p.type === "minute")?.value ?? "00";
    const s = partes.find(p => p.type === "second")?.value ?? "00";
    return `${h}:${m}:${s}`;
}
/** Devuelve la fecha en Venezuela de un Date arbitrario, como "YYYY-MM-DD" */
export function fechaVE(date) {
    const partes = new Intl.DateTimeFormat("en-CA", {
        timeZone: TZ,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(date);
    const y = partes.find(p => p.type === "year")?.value ?? "0000";
    const m = partes.find(p => p.type === "month")?.value ?? "00";
    const d = partes.find(p => p.type === "day")?.value ?? "00";
    return `${y}-${m}-${d}`;
}
/** Devuelve el mes actual en Venezuela como "YYYY-MM" */
export function mesActualVE() {
    return fechaHoyVE().slice(0, 7);
}
//# sourceMappingURL=fechaVE.js.map