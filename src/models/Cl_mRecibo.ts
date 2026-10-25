import { EMPRESA } from "../config/empresa.js";
import Cl_mPedido from "./Cl_mPedido.js";

export default class Cl_mRecibo {
    static generarHTML(pedido: Cl_mPedido, tasaBCV: number): string {
        const numero = pedido.id ? String(pedido.id).slice(0, 8).toUpperCase() : "—";
        const fecha = pedido.fecha || "";
        const hora = pedido.hora || "";

        const filasProductos = pedido.items.map(item => {
            const cantTxt = item.tipoVenta === "gramos"
                ? `${item.cantidad} g`
                : `${item.cantidad} u`;
            const precioUnitBs = item.precioUSD * tasaBCV;
            const precioUnitTxt = item.tipoVenta === "gramos"
                ? `Bs. ${precioUnitBs.toFixed(2)}/Kg ($${item.precioUSD.toFixed(2)})`
                : `Bs. ${precioUnitBs.toFixed(2)}/u ($${item.precioUSD.toFixed(2)})`;
            const subtotalBs = item.subtotalBs;
            const subtotalUSD = item.subtotalUSD;

            return `
                <tr>
                    <td class="col-prod">
                        <div class="prod-nombre">${this._escapar(item.nombre)}</div>
                        <div class="prod-detalle">${cantTxt} × ${precioUnitTxt}</div>
                    </td>
                    <td class="col-sub">
                        <div>Bs. ${subtotalBs.toFixed(2)}</div>
                        <div class="prod-detalle">$${subtotalUSD.toFixed(2)}</div>
                    </td>
                </tr>
            `;
        }).join("");

        const totalBs = pedido.totalBs();
        const totalUSD = pedido.totalUSD();
        const metodoPago = this._escapar(pedido.metodoPago);

        return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Recibo ${numero}</title>
<style>
    @page {
        size: 80mm auto;
        margin: 0;
    }
    * { box-sizing: border-box; }
    html, body {
        margin: 0;
        padding: 0;
        font-family: "Courier New", Courier, monospace;
        color: #000;
        background: #fff;
        font-size: 12px;
        line-height: 1.35;
    }
    body {
        width: 80mm;
        padding: 4mm 3mm;
        margin: 0 auto;
    }
    .center { text-align: center; }
    .right { text-align: right; }
    .bold { font-weight: bold; }
    .empresa-nombre {
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 0.5px;
        margin-bottom: 2px;
    }
    .empresa-detalle {
        font-size: 10px;
        line-height: 1.3;
    }
    .empresa-slogan {
        font-size: 9px;
        font-style: italic;
        margin-top: 2px;
    }
    .separador {
        border-top: 1px dashed #000;
        margin: 6px 0;
    }
    .fila-dato {
        font-size: 11px;
        padding: 1px 0;
    }
    .encabezado-tabla {
        display: flex;
        justify-content: space-between;
        font-weight: bold;
        font-size: 11px;
        padding-bottom: 3px;
        border-bottom: 1px solid #000;
    }
    table.productos {
        width: 100%;
        border-collapse: collapse;
        margin: 4px 0;
    }
    table.productos td {
        vertical-align: top;
        padding: 2px 0;
        font-size: 11px;
    }
    table.productos .col-prod {
        width: 68%;
        padding-right: 4px;
    }
    table.productos .col-sub {
        width: 32%;
        text-align: right;
        white-space: nowrap;
    }
    .prod-nombre {
        font-weight: bold;
        font-size: 11px;
    }
    .prod-detalle {
        font-size: 10px;
        color: #333;
    }
    .totales {
        margin-top: 4px;
    }
    .totales .fila {
        display: flex;
        justify-content: space-between;
        padding: 1px 0;
        font-size: 12px;
    }
    .totales .fila.total-final {
        font-size: 14px;
        font-weight: bold;
        border-top: 1px solid #000;
        border-bottom: 1px solid #000;
        padding: 4px 0;
        margin-top: 3px;
    }
    .totales .fila.total-usd {
        font-size: 12px;
        font-weight: bold;
    }
    .info-pago {
        margin-top: 6px;
        font-size: 11px;
    }
    .pie {
        margin-top: 8px;
        font-size: 10px;
        text-align: center;
    }
    .gracias {
        margin-top: 6px;
        font-size: 11px;
        font-weight: bold;
        text-align: center;
    }
</style>
</head>
<body>

    <div class="center">
        <div class="empresa-nombre">${this._escapar(EMPRESA.nombre)}</div>
        <div class="empresa-detalle">RIF: ${this._escapar(EMPRESA.rif)}</div>
        <div class="empresa-detalle">${this._escapar(EMPRESA.telefono)}</div>
        <div class="empresa-detalle">${this._escapar(EMPRESA.direccion)}</div>
        <div class="empresa-slogan">${this._escapar(EMPRESA.slogan)}</div>
    </div>

    <div class="separador"></div>

    <div class="fila-dato"><span class="bold">RECIBO N°:</span> ${numero}</div>
    <div class="fila-dato"><span class="bold">FECHA:</span> ${fecha}</div>
    <div class="fila-dato"><span class="bold">HORA:</span> ${hora}</div>
    <div class="fila-dato"><span class="bold">CLIENTE:</span> ${this._escapar(pedido.nomCliente || "Consumidor Final")}</div>
    <div class="fila-dato"><span class="bold">CÉDULA:</span> ${this._escapar(pedido.cedula || "—")}</div>

    <div class="separador"></div>

    <div class="encabezado-tabla">
        <span>PRODUCTO / CANTIDAD</span>
        <span>SUBTOTAL</span>
    </div>

    <table class="productos">
        <tbody>
            ${filasProductos}
        </tbody>
    </table>

    <div class="separador"></div>

    <div class="totales">
        <div class="fila total-final">
            <span>TOTAL Bs.:</span>
            <span>Bs. ${totalBs.toFixed(2)}</span>
        </div>
        <div class="fila total-usd">
            <span>TOTAL USD:</span>
            <span>$${totalUSD.toFixed(2)}</span>
        </div>
        <div class="fila" style="font-size: 9px; color: #555; margin-top: 2px;">
            <span>Tasa BCV:</span>
            <span>Bs. ${tasaBCV.toFixed(2)} / $</span>
        </div>
    </div>

    <div class="info-pago">
        <div class="bold">TIPO DE PAGO:</div>
        <div>${metodoPago}</div>
    </div>

    <div class="separador"></div>

    <div class="gracias">¡GRACIAS POR SU COMPRA!</div>
    <div class="pie">Conserve este recibo</div>
    <div class="pie">${new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" })}</div>

    <script>
        window.addEventListener("load", () => {
            setTimeout(() => { window.print(); }, 200);
        });
    </script>
</body>
</html>`;
    }

    private static _escapar(s: string): string {
        if (!s) return "";
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
}