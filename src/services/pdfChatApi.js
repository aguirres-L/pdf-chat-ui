const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://pdf-chat-7pko.onrender.com";

async function requestJson(url, opciones) {
  const res = await fetch(url, opciones);

  let data = null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => null);
  } else {
    data = await res.text().catch(() => "");
  }

  if (!res.ok) {
    const detalle =
      (data && typeof data === "object" && (data.detail || data.message)) ||
      (typeof data === "string" && data) ||
      `Request falló (${res.status})`;
    throw new Error(detalle);
  }

  return data;
}

export async function subirPdf(archivoPdf) {
  const formData = new FormData();
  formData.append("file", archivoPdf);

  return await requestJson(`${API_BASE_URL}/api/pdf`, {
    method: "POST",
    body: formData,
  });
}

export async function consultarPdf(pregunta, opciones = {}) {
  const { usarIaAdicional = false } = opciones;
  return await requestJson(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pregunta, usar_ia_adicional: usarIaAdicional }),
  });
}

