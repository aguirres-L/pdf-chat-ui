export const MIME_PANEL = "application/x-pdf-chat-panel";

export function escribirPanelEnDragEvent(e, tipoPanel) {
  e.dataTransfer.setData(MIME_PANEL, tipoPanel);
  e.dataTransfer.effectAllowed = "move";
}

export function leerPanelDesdeDropEvent(e) {
  try {
    return e.dataTransfer.getData(MIME_PANEL) || null;
  } catch {
    return null;
  }
}

