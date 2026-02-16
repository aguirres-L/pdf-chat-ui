import { useEffect, useRef, useState } from "react";
import useChat from "./useChat";
import videoDormido from "./sleepy-robot.mp4";

function formatearDuracion(segundos) {
  const s = Math.max(0, Number(segundos) || 0);
  const min = Math.floor(s / 60);
  const sec = s % 60;
  if (min <= 0) return `${sec}s`;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export default function ChatComponent({ estadoPdfBackend }) {
  const isPdfCargado = Boolean(estadoPdfBackend?.isCargado);
  const isPdfSubiendo = Boolean(estadoPdfBackend?.isSubiendo);
  const errorPdf = estadoPdfBackend?.error || null;
  const urlVideoRobotDormido =
    import.meta.env.VITE_SLEEPY_ROBOT_VIDEO_URL || videoDormido;
  const refTextarea = useRef(null);
  const [usarIaAdicional, setUsarIaAdicional] = useState(false);
  const [idMensajeCopiado, setIdMensajeCopiado] = useState(null);

  const {
    mensajes,
    textoEntrada,
    isEnviando,
    isEsperaLarga,
    segundosEsperando,
    isBloqueado,
    errorChat,
    onCambiarTextoEntrada,
    onEnviar,
  } = useChat({ isPdfCargado, isPdfSubiendo });

  const textoEstado = isPdfSubiendo
    ? "Analizando PDF…"
    : isEnviando
      ? "La IA está pensando…"
      : isPdfCargado
        ? "Conectado"
        : "Listo";

  const placeholderEntrada = isPdfSubiendo
    ? "Analizando PDF…"
    : !isPdfCargado
      ? "Primero cargá un PDF…"
      : "Escribí tu mensaje…";

  useEffect(() => {
    const el = refTextarea.current;
    if (!el) return;

    // Autosize estilo "GPT": crece hasta un max, luego scroll interno.
    el.style.height = "0px";
    const maxPx = 160; // ~8-9 líneas aprox según font/line-height
    const siguiente = Math.min(el.scrollHeight, maxPx);
    el.style.height = `${siguiente}px`;
    el.style.overflowY = el.scrollHeight > maxPx ? "auto" : "hidden";
  }, [textoEntrada]);

  async function onCopiarTexto(idMensaje, texto) {
    const valor = (texto || "").toString();
    if (!valor.trim()) return;

    try {
      await navigator.clipboard.writeText(valor);
      setIdMensajeCopiado(idMensaje);
      window.setTimeout(() => {
        setIdMensajeCopiado((prev) => (prev === idMensaje ? null : prev));
      }, 1200);
    } catch {
      // En algunos contextos (http, permisos), clipboard puede fallar.
      // No interrumpimos el flujo del chat.
    }
  }

  return (
    <div className="h-full min-h-0 flex flex-col overflow-hidden">
      <div className="h-12 shrink-0 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Chat</h2>
        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          {(isPdfSubiendo || isEnviando) && (
            <span
              className="inline-block h-3 w-3 rounded-full border-2 border-slate-300 dark:border-slate-500 border-t-slate-700 dark:border-t-slate-300 animate-spin"
              aria-hidden="true"
            />
          )}
          <span>{textoEstado}</span>
        </span>
      </div>

      {(errorPdf || errorChat) && (
        <div className="px-4 pt-3">
          <div className="rounded-md border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 px-3 py-2 text-xs text-red-800 dark:text-red-200">
            {errorPdf || errorChat}
          </div>
        </div>
      )}

      {!isPdfCargado && !isPdfSubiendo && (
        <div className="px-4 pt-3">
          <div className="rounded-md border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 px-3 py-2 text-xs text-slate-700 dark:text-slate-300">
            Cargá un PDF para empezar a preguntar.
          </div>
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-auto p-4 space-y-3">
        {mensajes.length === 0 ? (
          isPdfSubiendo ? (
            <div className="mr-auto max-w-[92%] rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-2">
                <div
                  className="h-4 w-4 rounded-full border-2 border-slate-300 dark:border-slate-500 border-t-slate-700 dark:border-t-slate-300 animate-spin"
                  aria-hidden="true"
                />
                <span>Analizando PDF…</span>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-40 rounded bg-slate-200 dark:bg-slate-600 animate-pulse" />
                <div className="h-2 w-56 rounded bg-slate-200 dark:bg-slate-600 animate-pulse" />
                <div className="h-2 w-32 rounded bg-slate-200 dark:bg-slate-600 animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-200 dark:border-slate-600 p-4 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50">
              Escribí una pregunta sobre el PDF y presioná “Enviar”.
            </div>
          )
        ) : (
          mensajes.map((m) => (
            <div
              key={m.id}
              className={`group relative max-w-[92%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap break-words ${
                m.rol === "user"
                  ? "ml-auto bg-slate-900 dark:bg-slate-600 text-white"
                  : "mr-auto bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100"
              }`}
            >
              {m.rol === "ai" && (
                <div className="pointer-events-none absolute -top-2 right-2 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  {m.modelo && (
                    <span className="pointer-events-none select-none rounded-md border border-slate-200 dark:border-slate-600 bg-white/95 dark:bg-slate-800/95 px-2 py-1 text-[10px] text-slate-600 dark:text-slate-300 shadow-sm">
                      Modelo: {m.modelo}
                    </span>
                  )}
                </div>
              )}

              {m.rol === "ai" && (
                <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => onCopiarTexto(m.id, m.texto)}
                    className="rounded-md border border-slate-200 dark:border-slate-600 bg-white/90 dark:bg-slate-800/90 px-2 py-1 text-[11px] text-slate-700 dark:text-slate-200 shadow-sm hover:bg-white dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-500"
                    aria-label="Copiar respuesta"
                    title="Copiar"
                  >
                    {idMensajeCopiado === m.id ? "Copiado" : "Copiar"}
                  </button>
                </div>
              )}
              {m.texto}
            </div>
          ))
        )}

        {isPdfSubiendo && mensajes.length > 0 && (
          <div className="mr-auto max-w-[92%] rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <div
                className="h-4 w-4 rounded-full border-2 border-slate-300 border-t-slate-700 animate-spin"
                aria-hidden="true"
              />
              <span>Analizando PDF…</span>
            </div>
          </div>
        )}

        {isEnviando && !isEsperaLarga && !isPdfSubiendo && (
          <div className="mr-auto max-w-[92%] rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <div
                className="h-4 w-4 rounded-full border-2 border-slate-300 border-t-slate-700 animate-spin"
                aria-hidden="true"
              />
              <span>La IA está pensando…</span>
            </div>
          </div>
        )}

        {isEnviando && isEsperaLarga && (
          <div className="mr-auto max-w-[52%] rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100">
            <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">
              Despertando al robot…{" "}
              <span className="tabular-nums">
                ({formatearDuracion(segundosEsperando)})
              </span>
            </div>
            <div className="rounded-md overflow-hidden ">
              <video
                src={urlVideoRobotDormido}
                className="w-full max-w-[100px] h-auto  rounded-lg "
                autoPlay
                loop
                muted
                playsInline
                controls={false}
                onError={(e) => {
                  // fallback silencioso si el video no existe aún
                  e.currentTarget.style.display = "none";
                }}
              />
            
            </div>
          </div>
        )}
      </div>

      <form
        className="shrink-0 p-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
        onSubmit={(e) => {
          e.preventDefault();
          if (isBloqueado) return;
          onEnviar(usarIaAdicional);
        }}
      >
        {isPdfCargado && (
          <div className="mb-2" role="group" aria-label="Modo de respuesta">
            <span id="modo-ia-desc" className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              {usarIaAdicional
                ? "Respuestas potenciadas. En alta demanda podemos usar solo tu PDF."
                : "Respuesta rápida y siempre disponible, 100% basada en tu documento."}
            </span>
            <div
              className="inline-flex rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 p-0.5"
              aria-describedby="modo-ia-desc"
            >
              <button
                type="button"
                onClick={() => setUsarIaAdicional(false)}
                disabled={isBloqueado}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed ${
                  !usarIaAdicional
                    ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                Solo PDF como contexto
              </button>
              <button
                type="button"
                onClick={() => setUsarIaAdicional(true)}
                disabled={isBloqueado}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed ${
                  usarIaAdicional
                    ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                Usar IA adicional
              </button>
            </div>
          </div>
        )}
        <div className="flex items-end gap-2">
          <textarea
            ref={refTextarea}
            value={textoEntrada}
            onChange={(e) => onCambiarTextoEntrada(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              if (e.shiftKey) return; // Shift+Enter => nueva línea
              e.preventDefault(); // Enter => enviar
              if (isBloqueado) return;
              if (!textoEntrada.trim()) return;
              onEnviar(usarIaAdicional);
            }}
            rows={1}
            className="flex-1 rounded-md border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-500 dark:disabled:text-slate-400 resize-none leading-5 min-h-[40px] max-h-[160px]"
            placeholder={placeholderEntrada}
            disabled={isBloqueado}
          />
          <button
            type="submit"
            className="rounded-md bg-slate-900 dark:bg-slate-600 text-white px-3 py-2 text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-500 active:bg-slate-950 dark:active:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed h-[40px]"
            disabled={isBloqueado || !textoEntrada.trim()}
          >
            {isEnviando ? "Enviando…" : "Enviar"}
          </button>
        </div>
      </form>
    </div>
  );
}