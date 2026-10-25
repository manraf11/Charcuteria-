/**
 * Vista que abre una ventana nueva con el HTML del recibo
 * y dispara la impresión del navegador.
 */
export default class Cl_vRecibo {
    static abrir(html) {
        const ventana = window.open("", "_blank", "width=420,height=700,scrollbars=yes");
        if (!ventana) {
            alert("Por favor, permita las ventanas emergentes para imprimir el recibo.");
            return;
        }
        ventana.document.open();
        ventana.document.write(html);
        ventana.document.close();
        try {
            ventana.focus();
        }
        catch (_) { }
    }
}
//# sourceMappingURL=Cl_vRecibo.js.map