export function clamp(valor, minimo, maximo) {
  return Math.min(maximo, Math.max(minimo, valor));
}

export function redondear1Decimal(valor) {
  return Math.round(valor * 10) / 10;
}

export function calcularPorcentajesDesdeProporcion(proporcionIzquierda) {
  const porcentajeIzquierda = redondear1Decimal(proporcionIzquierda * 100);
  const porcentajeDerecha = redondear1Decimal((1 - proporcionIzquierda) * 100);
  return { porcentajeIzquierda, porcentajeDerecha };
}

export function crearEstiloGridDesktop({
  proporcionIzquierda,
  divisorPx = 8,
}) {
  const medioDivisorPx = divisorPx / 2;
  const { porcentajeIzquierda, porcentajeDerecha } =
    calcularPorcentajesDesdeProporcion(proporcionIzquierda);

  // Evita scroll horizontal: el divisor ocupa ancho, entonces se descuenta.
  return {
    gridTemplateColumns: `calc(${porcentajeIzquierda}% - ${medioDivisorPx}px) ${divisorPx}px calc(${porcentajeDerecha}% - ${medioDivisorPx}px)`,
  };
}

export function obtenerPaneles(isChatLeft) {
  const panelIzquierda = isChatLeft ? "chat" : "pdf";
  const panelDerecha = isChatLeft ? "pdf" : "chat";
  return { panelIzquierda, panelDerecha };
}

export function esTipoPanelValido(tipoPanel) {
  return tipoPanel === "chat" || tipoPanel === "pdf";
}

