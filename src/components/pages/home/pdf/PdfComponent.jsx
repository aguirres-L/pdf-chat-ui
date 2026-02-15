import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export default function PdfComponent({ archivoPdf, onSeleccionarArchivoPdf }) {
  const [cantidadPaginas, setCantidadPaginas] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [isArrastrando, setIsArrastrando] = useState(false);

  const refContenedor = useRef(null);
  const [anchoContenedor, setAnchoContenedor] = useState(600);

  useEffect(() => {
    if (!refContenedor.current) return;

    const observer = new ResizeObserver((entradas) => {
      const entrada = entradas[0];
      if (!entrada) return;
      setAnchoContenedor(Math.floor(entrada.contentRect.width));
    });

    observer.observe(refContenedor.current);
    return () => observer.disconnect();
  }, []);

  const urlPdf = useMemo(() => {
    if (!archivoPdf) return null;
    return URL.createObjectURL(archivoPdf);
  }, [archivoPdf]);

  useEffect(() => {
    return () => {
      if (urlPdf) URL.revokeObjectURL(urlPdf);
    };
  }, [urlPdf]);

  const nombreArchivo = useMemo(() => {
    if (!archivoPdf) return null;
    return archivoPdf.name || "archivo.pdf";
  }, [archivoPdf]);

  const isPuedeAnterior = paginaActual > 1;
  const isPuedeSiguiente =
    typeof cantidadPaginas === "number" ? paginaActual < cantidadPaginas : false;

  function onArchivoDesdeInput(e) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    if (archivo.type !== "application/pdf") {
      // silencioso por ahora: después podemos mostrar toast
      return;
    }

    setCantidadPaginas(null);
    setPaginaActual(1);
    onSeleccionarArchivoPdf?.(archivo);
    e.target.value = "";
  }

  function onValidarDrop(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function onDropArchivo(e) {
    onValidarDrop(e);
    setIsArrastrando(false);

    const archivo = e.dataTransfer.files?.[0];
    if (!archivo) return;
    if (archivo.type !== "application/pdf") return;

    setCantidadPaginas(null);
    setPaginaActual(1);
    onSeleccionarArchivoPdf?.(archivo);
  }

  return (
    <div className="h-full min-h-0 relative overflow-hidden">
      {!urlPdf ? (
        <div className="h-full p-4">
          <div
            className={`h-full rounded-lg border-2 border-dashed p-6 flex flex-col items-center justify-center text-center transition-colors ${
              isArrastrando ? "border-slate-900 bg-slate-50" : "border-slate-200"
            }`}
            onDragEnter={(e) => {
              onValidarDrop(e);
              setIsArrastrando(true);
            }}
            onDragOver={onValidarDrop}
            onDragLeave={(e) => {
              onValidarDrop(e);
              setIsArrastrando(false);
            }}
            onDrop={onDropArchivo}
          >
            <div className="text-sm font-medium">Arrastrá y soltá un PDF</div>
            <div className="mt-1 text-xs text-slate-600">
              o usá el botón de abajo.
            </div>

            <label className="mt-4 inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm font-medium bg-white hover:bg-slate-50 active:bg-slate-100 cursor-pointer">
              Cargar PDF
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={onArchivoDesdeInput}
              />
            </label>
          </div>
        </div>
      ) : (
        <>
          <div className="absolute top-2 left-2 right-2 z-20 flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="inline-flex max-w-full items-center gap-2 rounded-md border bg-white/90 backdrop-blur px-2 py-1 text-xs text-slate-700">
                <span className="truncate">{nombreArchivo}</span>
              </div>
            </div>

            <div className="shrink-0 inline-flex items-center gap-1 rounded-md border bg-white/90 backdrop-blur px-1 py-1">
              <button
                type="button"
                className="rounded-md border px-2 py-1 text-xs disabled:opacity-50 bg-white hover:bg-slate-50"
                onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                disabled={!isPuedeAnterior}
                aria-label="Página anterior"
                title="Página anterior"
              >
                ←
              </button>
              <span className="text-xs text-slate-600 tabular-nums min-w-[72px] text-center select-none">
                {cantidadPaginas ? `${paginaActual}/${cantidadPaginas}` : "—"}
              </span>
              <button
                type="button"
                className="rounded-md border px-2 py-1 text-xs disabled:opacity-50 bg-white hover:bg-slate-50"
                onClick={() =>
                  setPaginaActual((p) =>
                    cantidadPaginas ? Math.min(cantidadPaginas, p + 1) : p,
                  )
                }
                disabled={!isPuedeSiguiente}
                aria-label="Página siguiente"
                title="Página siguiente"
              >
                →
              </button>

              <label className="ml-1 inline-flex items-center justify-center rounded-md border px-2 py-1 text-xs font-medium bg-white hover:bg-slate-50 active:bg-slate-100 cursor-pointer">
                Cambiar
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={onArchivoDesdeInput}
                />
              </label>
            </div>
          </div>

          <div className="h-full overflow-auto">
            <div
              ref={refContenedor}
              className="min-h-full pt-12 p-4 flex justify-center bg-slate-100"
            >
              <Document
                file={urlPdf}
                onLoadSuccess={({ numPages }) => setCantidadPaginas(numPages)}
                loading={
                  <div className="text-sm text-slate-600">Cargando PDF…</div>
                }
                error={
                  <div className="text-sm text-red-700">
                    No se pudo cargar el PDF.
                  </div>
                }
              >
                <Page
                  pageNumber={paginaActual}
                  width={Math.min(1100, Math.max(320, anchoContenedor - 32))}
                  renderTextLayer
                  renderAnnotationLayer
                />
              </Document>
            </div>
          </div>
        </>
      )}
    </div>
  );
}