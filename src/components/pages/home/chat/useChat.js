import { useCallback, useEffect, useMemo, useState } from "react";

import { consultarPdf } from "../../../../services/pdfChatApi";

function crearId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function useChat({ isPdfCargado, isPdfSubiendo }) {
  const [mensajes, setMensajes] = useState([]);
  const [textoEntrada, setTextoEntrada] = useState("");
  const [isEnviando, setIsEnviando] = useState(false);
  const [isEsperaLarga, setIsEsperaLarga] = useState(false);
  const [segundosEsperando, setSegundosEsperando] = useState(0);
  const [errorChat, setErrorChat] = useState(null);

  const isBloqueado = useMemo(() => {
    return isPdfSubiendo || !isPdfCargado || isEnviando;
  }, [isEnviando, isPdfCargado, isPdfSubiendo]);

  useEffect(() => {
    if (!isEnviando) {
      setIsEsperaLarga(false);
      setSegundosEsperando(0);
      return;
    }

    // Si el backend/modelo está "frío", la primera respuesta puede tardar bastante.
    // Mostramos UI especial solo si pasa un umbral para evitar "parpadeos" en respuestas rápidas.
    const timeout = window.setTimeout(() => {
      setIsEsperaLarga(true);
    }, 1500);

    const inicio = Date.now();
    const interval = window.setInterval(() => {
      setSegundosEsperando(Math.floor((Date.now() - inicio) / 1000));
    }, 1000);

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [isEnviando]);

  const onCambiarTextoEntrada = useCallback((valor) => {
    setTextoEntrada(valor);
  }, []);

  const onEnviar = useCallback(async () => {
    const pregunta = (textoEntrada || "").trim();
    if (!pregunta) return;

    if (!isPdfCargado) {
      setErrorChat("Primero cargá un PDF para poder consultar.");
      return;
    }

    setErrorChat(null);
    setIsEnviando(true);

    const mensajeUsuario = { id: crearId(), rol: "user", texto: pregunta };
    setMensajes((prev) => [...prev, mensajeUsuario]);
    setTextoEntrada("");

    try {
      const data = await consultarPdf(pregunta);
      const respuesta = (data?.respuesta || "").toString().trim();
      const mensajeAi = {
        id: crearId(),
        rol: "ai",
        texto: respuesta || "No recibí respuesta del modelo.",
      };
      setMensajes((prev) => [...prev, mensajeAi]);
    } catch (err) {
      setErrorChat(err?.message || "No se pudo consultar al backend.");
    } finally {
      setIsEnviando(false);
    }
  }, [isPdfCargado, textoEntrada]);

  return {
    mensajes,
    textoEntrada,
    isEnviando,
    isEsperaLarga,
    segundosEsperando,
    isBloqueado,
    errorChat,
    onCambiarTextoEntrada,
    onEnviar,
  };
}

