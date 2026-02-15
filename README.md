    # PDF Chat AI 🤖📄

Aplicación Fullstack que permite a los usuarios cargar archivos PDF y chatear con su contenido utilizando inteligencia artificial generativa.

## 🚀 Tecnologías utilizadas
- **IA:** [Google Gemini 1.5 Flash](https://ai.google.dev).
- **Backend:** Python con [FastAPI](https://fastapi.tiangolo.com) (o Flask) para el procesamiento de archivos y lógica de IA.
- **Frontend:** React para una interfaz de usuario dinámica y fluida.
- **Manejo de PDF:** PyPDF2 o PDFPlumber.

## ✨ Características
- **Gran Contexto:** Soporta documentos extensos gracias al millón de tokens de Gemini.
- **Respuestas Precisas:** Consultas sobre cláusulas, fechas, montos y datos específicos.
- **Seguridad:** Configuración mediante variables de entorno (`.env`).

## 🛠️ Instalación
1. Clonar el repo.
2. Instalar dependencias: `pip install -r requirements.txt`.
3. Configurar tu `API_KEY` en el archivo `.env`.
4. Ejecutar `python main.py`.
