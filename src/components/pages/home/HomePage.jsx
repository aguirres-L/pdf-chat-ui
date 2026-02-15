import HomeComponent from "./HomeComponent";
import useHome from "./hook_home/useHome";

export default function HomePage() {
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

