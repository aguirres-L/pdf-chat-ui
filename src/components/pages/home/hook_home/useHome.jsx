import { useCallback, useMemo, useRef, useState } from "react";

import { leerPanelDesdeDropEvent } from "../panel-dnd";
import { subirPdf } from "../../../../services/pdfChatApi";
import {
  clamp,
  crearEstiloGridDesktop,
  esTipoPanelValido,
  obtenerPaneles,
} from "../utils/homeUtils";

export default function useHome() {
  const [isChatLeft, setIsChatLeft] = useState(true);
  const [archivoPdf, setArchivoPdf] = useState(null);
  const [proporcionIzquierda, setProporcionIzquierda] = useState(0.5);
  const [estadoPdfBackend, setEstadoPdfBackend] = useState({
    isSubiendo: false,
    error: null,
    meta: null,
    isCargado: false,
  });

  const refSplit = useRef(null);

  const limites = useMemo(() => {
    return {
      minimoPx: 320,
      maximoPx: 320,
    };
  }, []);

  const onSeleccionarArchivoPdf = useCallback((archivo) => {
    setArchivoPdf(archivo ?? null);

    if (!archivo) {
      setEstadoPdfBackend({
        isSubiendo: false,
        error: null,
        meta: null,
        isCargado: false,
      });
      return;
    }

    setEstadoPdfBackend({
      isSubiendo: true,
      error: null,
      meta: null,
      isCargado: false,
    });

    subirPdf(archivo)
      .then((meta) => {
        setEstadoPdfBackend({
          isSubiendo: false,
          error: null,
          meta,
          isCargado: true,
        });
      })
      .catch((err) => {
        setEstadoPdfBackend({
          isSubiendo: false,
          error: err?.message || "No se pudo subir el PDF al backend.",
          meta: null,
          isCargado: false,
        });
      });
  }, []);

  const onIntercambiarPaneles = useCallback(() => {
    setIsChatLeft((valorPrevio) => !valorPrevio);
  }, []);

  const onIniciarResize = useCallback(
    (e) => {
      if (e.button !== 0) return;
      if (!refSplit.current) return;

      e.preventDefault();
      e.stopPropagation();

      const rect = refSplit.current.getBoundingClientRect();
      const ancho = rect.width || 1;

      const minimoRatio = Math.min(0.45, limites.minimoPx / ancho);
      const maximoRatio = Math.max(0.55, 1 - limites.maximoPx / ancho);

      const onMove = (ev) => {
        const x = ev.clientX - rect.left;
        setProporcionIzquierda(clamp(x / ancho, minimoRatio, maximoRatio));
      };

      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [limites.maximoPx, limites.minimoPx],
  );

  const onResetResize = useCallback(() => {
    setProporcionIzquierda(0.5);
  }, []);

  const onSoltarPanelEnIzquierda = useCallback((tipoPanel) => {
    if (!esTipoPanelValido(tipoPanel)) return;
    setIsChatLeft(tipoPanel === "chat");
  }, []);

  const onSoltarPanelEnDerecha = useCallback((tipoPanel) => {
    if (!esTipoPanelValido(tipoPanel)) return;
    setIsChatLeft(tipoPanel === "pdf");
  }, []);

  const onPermitirDrop = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDropEnIzquierda = useCallback(
    (e) => {
      e.preventDefault();
      const tipoPanel = leerPanelDesdeDropEvent(e);
      onSoltarPanelEnIzquierda(tipoPanel);
    },
    [onSoltarPanelEnIzquierda],
  );

  const onDropEnDerecha = useCallback(
    (e) => {
      e.preventDefault();
      const tipoPanel = leerPanelDesdeDropEvent(e);
      onSoltarPanelEnDerecha(tipoPanel);
    },
    [onSoltarPanelEnDerecha],
  );

  const { panelIzquierda, panelDerecha } = useMemo(() => {
    return obtenerPaneles(isChatLeft);
  }, [isChatLeft]);

  const estiloGridDesktop = useMemo(() => {
    return crearEstiloGridDesktop({ proporcionIzquierda, divisorPx: 8 });
  }, [proporcionIzquierda]);

  return {
    // estado
    isChatLeft,
    archivoPdf,
    proporcionIzquierda,
    panelIzquierda,
    panelDerecha,
    estadoPdfBackend,

    // refs + estilos derivados
    refSplit,
    estiloGridDesktop,

    // handlers
    onSeleccionarArchivoPdf,
    onIntercambiarPaneles,
    onIniciarResize,
    onResetResize,
    onPermitirDrop,
    onDropEnIzquierda,
    onDropEnDerecha,
  };
}

