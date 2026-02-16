import ChatComponent from "./chat/ChatComponent";
import PdfComponent from "./pdf/PdfComponent";
import PanelSwapHandle from "./PanelSwapHandle";
import SunSvg from "./svg/SunSvg";
import MoonSvg from "./svg/MoonSv";

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
  isDarkMode,
  onSetDarkMode,
}) {
  return (
    <div className="h-dvh w-full overflow-hidden bg-slate-50 dark:bg-slate-900">
      <main
        ref={refSplit}
        className="h-full w-full overflow-hidden flex flex-col md:grid md:grid-rows-1"
        style={estiloGridDesktop}
      >
        <section
          className="relative flex-1 min-h-0 min-w-0 bg-white dark:bg-slate-800 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 overflow-hidden"
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
          className="hidden md:flex w-2 shrink-0 relative items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300 dark:active:bg-slate-600 cursor-col-resize"
          onPointerDown={onIniciarResize}
          onDoubleClick={onResetResize}
          title="Arrastrar para cambiar tamaños (doble click para reset)"
          aria-label="Divisor para cambiar tamaños"
          role="separator"
          aria-orientation="vertical"
        >
          <div
            className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-600 dark:bg-slate-700 shadow-md overflow-hidden"
            role="group"
            aria-label="Modo claro u oscuro"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSetDarkMode?.(false);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className={`flex h-8 w-8 items-center justify-center text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-600 ${
                !isDarkMode ? "bg-white dark:bg-amber-900/40 text-amber-600 dark:text-amber-400" : "text-slate-900 dark:text-slate-400"
              }`}
              aria-label="Modo claro"
              title="Modo claro"
            >
              <SunSvg />
            </button>
            <span className="h-px w-full bg-slate-100 dark:bg-slate-600" aria-hidden />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSetDarkMode?.(true);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className={`flex h-8 w-8 items-center justify-center text-sm transition-colors hover:bg-slate-300 dark:hover:bg-slate-600 ${
                isDarkMode ? "bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-200" : "text-slate-900 dark:text-slate-400"
              }`}
              aria-label="Modo oscuro"
              title="Modo oscuro"
            >
              <MoonSvg />
            </button>
          </div>
          <div className="h-10 w-0.5 bg-slate-400/70 dark:bg-slate-500/70 rounded pointer-events-none" aria-hidden />
        </div>

        <section
          className="relative flex-1 min-h-0 min-w-0 bg-white dark:bg-slate-800 overflow-hidden"
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