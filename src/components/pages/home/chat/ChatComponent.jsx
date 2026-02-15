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

  return (
    <div className="h-full min-h-0 flex flex-col overflow-hidden">
      <div className="h-12 shrink-0 px-4 flex items-center justify-between border-b">
        <h2 className="text-sm font-semibold">Chat</h2>
        <span className="text-xs text-slate-500 flex items-center gap-2">
          {(isPdfSubiendo || isEnviando) && (
            <span
              className="inline-block h-3 w-3 rounded-full border-2 border-slate-300 border-t-slate-700 animate-spin"
              aria-hidden="true"
            />
          )}
          <span>{textoEstado}</span>
        </span>
      </div>

      {(errorPdf || errorChat) && (
        <div className="px-4 pt-3">
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
            {errorPdf || errorChat}
          </div>
        </div>
      )}

      {!isPdfCargado && !isPdfSubiendo && (
        <div className="px-4 pt-3">
          <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
            Cargá un PDF para empezar a preguntar.
          </div>
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-auto p-4 space-y-3">
        {mensajes.length === 0 ? (
          isPdfSubiendo ? (
            <div className="mr-auto max-w-[92%] rounded-lg px-3 py-2 text-sm bg-white border text-slate-900">
              <div className="flex items-center gap-2 text-xs text-slate-600 mb-2">
                <div
                  className="h-4 w-4 rounded-full border-2 border-slate-300 border-t-slate-700 animate-spin"
                  aria-hidden="true"
                />
                <span>Analizando PDF…</span>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-40 rounded bg-slate-200 animate-pulse" />
                <div className="h-2 w-56 rounded bg-slate-200 animate-pulse" />
                <div className="h-2 w-32 rounded bg-slate-200 animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-4 text-sm text-slate-600 bg-slate-50">
              Escribí una pregunta sobre el PDF y presioná “Enviar”.
            </div>
          )
        ) : (
          mensajes.map((m) => (
            <div
              key={m.id}
              className={`max-w-[92%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap break-words ${
                m.rol === "user"
                  ? "ml-auto bg-slate-900 text-white"
                  : "mr-auto bg-white border text-slate-900"
              }`}
            >
              {m.texto}
            </div>
          ))
        )}

        {isPdfSubiendo && mensajes.length > 0 && (
          <div className="mr-auto max-w-[92%] rounded-lg px-3 py-2 text-sm bg-white border text-slate-900">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div
                className="h-4 w-4 rounded-full border-2 border-slate-300 border-t-slate-700 animate-spin"
                aria-hidden="true"
              />
              <span>Analizando PDF…</span>
            </div>
          </div>
        )}

        {isEnviando && !isEsperaLarga && !isPdfSubiendo && (
          <div className="mr-auto max-w-[92%] rounded-lg px-3 py-2 text-sm bg-white border text-slate-900">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div
                className="h-4 w-4 rounded-full border-2 border-slate-300 border-t-slate-700 animate-spin"
                aria-hidden="true"
              />
              <span>La IA está pensando…</span>
            </div>
          </div>
        )}

        {isEnviando && isEsperaLarga && (
          <div className="mr-auto max-w-[52%] rounded-lg px-3 py-2 text-sm bg-white  text-slate-900">
            <div className="text-xs text-slate-600 mb-2">
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
        className="shrink-0 p-3 border-t bg-white"
        onSubmit={(e) => {
          e.preventDefault();
          if (isBloqueado) return;
          onEnviar();
        }}
      >
        <div className="flex items-center gap-2">
          <input
            value={textoEntrada}
            onChange={(e) => onCambiarTextoEntrada(e.target.value)}
            className="flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
            placeholder={placeholderEntrada}
            disabled={isBloqueado}
          />
          <button
            type="submit"
            className="rounded-md bg-slate-900 text-white px-3 py-2 text-sm font-medium hover:bg-slate-800 active:bg-slate-950 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isBloqueado || !textoEntrada.trim()}
          >
            {isEnviando ? "Enviando…" : "Enviar"}
          </button>
        </div>
      </form>
    </div>
  );
}