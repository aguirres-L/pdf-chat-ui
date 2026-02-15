import { escribirPanelEnDragEvent } from "./panel-dnd";

export default function PanelSwapHandle({ tipoPanel, etiqueta }) {
  return (
 <>
 {/* 
    <button
      type="button"
      draggable
      onDragStart={(e) => {
        escribirPanelEnDragEvent(e, tipoPanel);
      }}
      className="absolute top-2 right-2 z-20 rounded-md border bg-white/90 backdrop-blur px-2 py-1 text-xs text-slate-700 hover:bg-white active:bg-slate-50"
      aria-label={`Arrastrar para mover ${etiqueta}`}
      title={`Arrastrar para mover ${etiqueta}`}
    >
      ⠿ {etiqueta}
    </button>
 */}
 </>
  );
}
