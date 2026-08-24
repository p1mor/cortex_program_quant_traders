# Cortex Quant Trader — Programa Formativo

> **Repositorio:** GitHub (`github-origin`)  
> **Rama principal:** `github-main`  
> **Rama desarrollo:** `github-sebastian`  
> **Última actualización:** Agosto 2026

---

## Descripción

Presentación interactiva del programa formativo **Cortex Quant Trader** desarrollado por TechPulse Consulting. Contiene 47 slides organizados en 4 módulos educativos sobre trading cuantitativo y microestructura de mercados.

---

## Estructura del Proyecto

```
cortex_program_quant_traders/
├── README.md                          # Este archivo
├── VERSIONAMIENTO.md                  # Guía de versionamiento
├── .gitignore                         # Exclusiones de seguridad
└── cortex_program_quant_traders/
    └── slides/
        ├── index.html                 # Punto de entrada principal
        ├── viewer.html                # Visor individual de slides
        ├── css/slides.css             # Estilos globales
        ├── js/
        │   ├── loader.js              # Cargador de módulos
        │   └── navigation.js          # Motor de navegación
        ├── assets/images/             # Imágenes del programa (12 archivos)
        └── modules/
            ├── m0/                    # Programa Formativo (2 slides)
            ├── m1/                    # Módulo I — Fundamentos (14 lecciones)
            ├── m2/                    # Módulo II — Quant Trading (11 lecciones)
            └── m3/                    # Módulo III — Cortex-Dendrita (20 lecciones)
```

---

## Módulos Educativos

| Módulo | Nombre | Lecciones | Color |
|--------|--------|-----------|-------|
| **M0** | Programa Formativo | 2 | Gris |
| **M1** | Fundamentos y Microestructura | 14 | Azul |
| **M2** | Quant Trading | 11 | Púrpura |
| **M3** | Cortex-Dendrita | 20 | Cyan |

**Total: 47 slides / 42 lecciones curriculares**

---

## Ejecución Local

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor local HTTP (no funciona con `file://`)

### Opción 1: Python
```bash
cd cortex_program_quant_traders/slides
python3 -m http.server 8000
```
Abrir: `http://localhost:8000`

### Opción 2: Node.js
```bash
npx serve cortex_program_quant_traders/slides
```

### Opción 3: VS Code
Instalar extensión **Live Server** y abrir `index.html`

---

## Navegación

| Acción | Teclado | Touch |
|--------|---------|-------|
| Siguiente slide | `→` `↓` `Space` `PgDn` | Swipe izquierda |
| Slide anterior | `←` `↑` `PgUp` | Swipe derecha |
| Ir al inicio | `Home` | — |
| Ir al final | `End` | — |
| Módulo 0 | `0` | — |
| Módulo 1 | `1` | — |
| Módulo 2 | `2` | — |
| Módulo 3 | `3` | — |
| Índice | `I` | — |

---

## Tecnologías

- **HTML5** — Estructura de slides
- **CSS3** — Estilos y animaciones
- **JavaScript ES6+** — Navegación y carga dinámica
- **KaTeX 0.16.11** — Renderizado de fórmulas matemáticas
- **Google Fonts** — Inter + JetBrains Mono

---

## Seguridad

- ✅ XSS mitigado (innerHTML sanitizado)
- ✅ SRI implementado en scripts CDN
- ✅ .gitignore con exclusiones de secretos
- ✅ Sin dependencias de npm/pip (zero vulnerabilities)

---

## Repositorio

| Propiedad | Valor |
|-----------|-------|
| **Plataforma** | GitHub |
| **Remoto** | `github-origin` |
| **URL** | `https://github.com/p1mor/cortex_program_quant_traders.git` |
| **Rama principal** | `github-main` |
| **Rama desarrollo** | `github-sebastian` |
| **Usuario** | `camilopimor` |

> ⚠️ **IMPORTANTE:** Este repositorio usa `github-origin` como remoto para diferenciarlo de los repositorios AWS CodeCommit del entorno productivo.

### Ramas del Repositorio

| Rama | Propósito | Responsable |
|------|-----------|-------------|
| `github-main` | Rama principal (producción) | camilopimor (propietario) |
| `github-sebastian` | Rama de desarrollo | Sebastian (desarrollador) |

### Flujo de Trabajo

```
github-sebastian (desarrollo)
        ↓
    Pull Request
        ↓
    Validación (camilopimor)
        ↓
    github-main (producción)
```

---

## Licencia

Propiedad de TechPulse Consulting. Uso interno del programa formativo.

---

## Contacto

- **Autor:** camilopimor
- **Email:** camilopimor@gmail.com
- **GitHub:** [@p1mor](https://github.com/p1mor)
