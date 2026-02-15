import Aos from "aos"
import "aos/dist/aos.css"
import { useEffect } from "react"

/**
 * ¿Por qué / para qué existe este archivo?
 * - AOS funciona leyendo atributos HTML `data-aos` y `data-aos-*` en tus elementos.
 * - Para que sea fácil y consistente, usamos:
 *   1) `AosInit`: inicializa AOS 1 sola vez (y carga el CSS).
 *   2) `AosAnimate`: wrapper que aplica los `data-*` para elegir animación + parámetros.
 *
 * Nota importante (React 18/19 + StrictMode en dev):
 * - Los efectos pueden ejecutarse 2 veces. Por eso usamos un guard para no reinicializar AOS.
 */

let isAosInicializado = false

/**
 * Animaciones (valor para el prop `animacion` / atributo `data-aos`)
 *
 * Fades (desvanecer):
 * - "fade", "fade-up", "fade-down", "fade-left", "fade-right"
 * - "fade-up-right", "fade-up-left", "fade-down-right", "fade-down-left"
 *
 * Flips (giro):
 * - "flip-up", "flip-down", "flip-left", "flip-right"
 *
 * Slides (deslizar):
 * - "slide-up", "slide-down", "slide-left", "slide-right"
 *
 * Zoom:
 * - "zoom-in", "zoom-in-up", "zoom-in-down", "zoom-in-left", "zoom-in-right"
 * - "zoom-out", "zoom-out-up", "zoom-out-down", "zoom-out-left", "zoom-out-right"
 *
 * Tip:
 * - AOS soporta más combinaciones según versión. Si sabés el nombre, pasalo como string en `animacion`.
 */

/**
 * @typedef {Object} AosInitProps
 * @property {import("aos").AosOptions=} configuracion - Config global para AOS (ej: { once: true, duration: 600 }).
 */

/**
 * Montalo 1 vez (ideal en `App.jsx` o `main.jsx`) para inicializar AOS.
 * @param {AosInitProps} props
 */
export function AosInit({ configuracion } = {}) {
  useEffect(() => {
    if (!isAosInicializado) {
      Aos.init(configuracion)
      isAosInicializado = true
      return
    }

    // Si AOS ya estaba inicializado, solo refrescamos (útil si cambia el DOM por navegación o renders).
    Aos.refresh()
  }, [configuracion])

  return null
}

/**
 * @typedef {Object} AosAnimateProps
 * @property {React.ReactNode} children - Contenido a animar.
 * @property {keyof JSX.IntrinsicElements=} as - Tag HTML a renderizar (por default "div").
 *
 * @property {string=} animacion - Nombre AOS (ej: "fade-right", "slide-left", "zoom-in-up").
 *
 * Parámetros AOS (se traducen a `data-aos-*`):
 * @property {number=} offsetPx - `data-aos-offset`: px antes de activar la animación.
 * @property {number=} duracionMs - `data-aos-duration`: duración en ms.
 * @property {number=} retrasoMs - `data-aos-delay`: delay en ms.
 * @property {string=} easing - `data-aos-easing`: easing (ej: "ease", "ease-in-out", "linear").
 * @property {string=} anchor - `data-aos-anchor`: selector del anchor (ej: "#hero").
 * @property {("top-bottom"|"top-center"|"top-top"|"center-bottom"|"center-center"|"center-top"|"bottom-bottom"|"bottom-center"|"bottom-top")=} anchorPlacement
 *  - `data-aos-anchor-placement`: desde dónde se calcula el disparo.
 * @property {boolean=} once - `data-aos-once`: si anima una sola vez (true) o cada vez que entra al viewport (false).
 * @property {boolean=} mirror - `data-aos-mirror`: si anima al scrollear hacia atrás (true).
 *
 * Props comunes del elemento:
 * @property {string=} className
 * @property {string=} id
 * @property {React.CSSProperties=} style
 */

/**
 * Wrapper para animar cualquier bloque con AOS sin repetir `data-*` en todos lados.
 * @param {AosAnimateProps & Record<string, any>} props
 */
export default function AosAnimate({
  children,
  as = "div",
  animacion = "fade-up",
  offsetPx,
  duracionMs,
  retrasoMs,
  easing,
  anchor,
  anchorPlacement,
  once,
  mirror,
  ...propsRestantes
}) {
  const Tag = as
  return (
    <Tag
      data-aos={animacion}
      data-aos-offset={offsetPx}
      data-aos-duration={duracionMs}
      data-aos-delay={retrasoMs}
      data-aos-easing={easing}
      data-aos-anchor={anchor}
      data-aos-anchor-placement={anchorPlacement}
      data-aos-once={once}
      data-aos-mirror={mirror}
      {...propsRestantes}
    >
      {children}
    </Tag>
  )
}