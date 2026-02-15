import ChatComponent from "./chat/ChatComponent";
import PdfComponent from "./pdf/PdfComponent";
import PanelSwapHandle from "./PanelSwapHandle";

export default function HomeComponent({
  archivoPdf,
  onSeleccionarArchivoPdf,
  onIntercambiarPaneles,
  refSplit,
  estiloGridDesktop,
  onIniciarResize,
  onResetResize,
  panelIzquierda,
  panelDerecha,
  estadoPdfBackend,
  onPermitirDrop,
  onDropEnIzquierda,
  onDropEnDerecha,
}) {
  return (
    <div className="h-dvh w-full overflow-hidden bg-slate-50">
      <main
        ref={refSplit}
        className="h-full w-full overflow-hidden flex flex-col md:grid md:grid-rows-1"
        style={estiloGridDesktop}
      >
        <section
          className="relative flex-1 min-h-0 min-w-0 bg-white border-b md:border-b-0 md:border-r border-slate-200 overflow-hidden"
          onDragOver={onPermitirDrop}
          onDrop={onDropEnIzquierda}
        >
          <PanelSwapHandle
            tipoPanel={panelIzquierda}
            etiqueta={panelIzquierda === "chat" ? "Chat" : "PDF"}
          />

          {panelIzquierda === "chat" ? (
            <ChatComponent estadoPdfBackend={estadoPdfBackend} />
          ) : (
            <PdfComponent
              archivoPdf={archivoPdf}
              onSeleccionarArchivoPdf={onSeleccionarArchivoPdf}
            />
          )}
        </section>

        <div
          className="hidden md:flex w-2 shrink-0 items-center justify-center bg-slate-100 hover:bg-slate-200 active:bg-slate-300 cursor-col-resize"
          onPointerDown={onIniciarResize}
          onDoubleClick={onResetResize}
          title="Arrastrar para cambiar tamaños (doble click para reset)"
          aria-label="Divisor para cambiar tamaños"
          role="separator"
          aria-orientation="vertical"
        >
          <button
            type="button"
            className="absolute z-30 inline-flex items-center justify-center h-8 w-8 rounded-full border bg-white/95 backdrop-blur text-slate-700 shadow-sm hover:bg-white active:bg-slate-50"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onIntercambiarPaneles();
            }}
            onPointerDown={(e) => {
              // evita que el click dispare el resize
              e.stopPropagation();
            }}
            aria-label="Intercambiar paneles"
            title="Intercambiar paneles"
          >
            ⇄
          </button>
          <div className="h-10 w-0.5 bg-slate-400/70 rounded" />
        </div>

        <section
          className="relative flex-1 min-h-0 min-w-0 bg-white overflow-hidden"
          onDragOver={onPermitirDrop}
          onDrop={onDropEnDerecha}
        >
          <PanelSwapHandle
            tipoPanel={panelDerecha}
            etiqueta={panelDerecha === "chat" ? "Chat" : "PDF"}
          />

          {panelDerecha === "chat" ? (
            <ChatComponent estadoPdfBackend={estadoPdfBackend} />
          ) : (
            <PdfComponent
              archivoPdf={archivoPdf}
              onSeleccionarArchivoPdf={onSeleccionarArchivoPdf}
            />
          )}
        </section>
      </main>
    </div>
  );
}