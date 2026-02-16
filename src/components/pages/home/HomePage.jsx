import { useEffect, useState } from "react";
import HomeComponent from "./HomeComponent";
import useHome from "./hook_home/useHome";

const STORAGE_KEY_DARK = "pdf-chat-dark-mode";

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_DARK) ?? "false");
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem(STORAGE_KEY_DARK, JSON.stringify(isDarkMode));
    } catch {}
  }, [isDarkMode]);

  const {
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
  } = useHome();

  return (
    <HomeComponent
      isDarkMode={isDarkMode}
      onSetDarkMode={setIsDarkMode}
      archivoPdf={archivoPdf}
      onSeleccionarArchivoPdf={onSeleccionarArchivoPdf}
      onIntercambiarPaneles={onIntercambiarPaneles}
      refSplit={refSplit}
      estiloGridDesktop={estiloGridDesktop}
      onIniciarResize={onIniciarResize}
      onResetResize={onResetResize}
      panelIzquierda={panelIzquierda}
      panelDerecha={panelDerecha}
      estadoPdfBackend={estadoPdfBackend}
      onPermitirDrop={onPermitirDrop}
      onDropEnIzquierda={onDropEnIzquierda}
      onDropEnDerecha={onDropEnDerecha}
    />
  );
}

