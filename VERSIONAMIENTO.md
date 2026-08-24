# Guía de Versionamiento — Cortex Quant Trader

> **Repositorio:** GitHub  
> **Remoto:** `github-origin`  
> **Rama principal:** `main`  
> **Equipo:** camilopimor + colaboradores

---

## ⚠️ IMPORTANTE: Identificación del Repositorio

Este repositorio está en **GitHub** (no en AWS CodeCommit). Para evitar confusiones:

| Entorno | Remoto | Plataforma |
|---------|--------|------------|
| **Este proyecto** | `github-origin` | GitHub |
| **Producción** | `origin` | AWS CodeCommit |

**NUNCA** uses `origin` para este repositorio. Siempre usa `github-origin`.

---

## Configuración Inicial (Nuevos Colaboradores)

### 1. Clonar el repositorio
```bash
git clone https://github.com/p1mor/cortex_program_quant_traders.git
cd cortex_program_quant_traders
```

### 2. Verificar remoto
```bash
git remote -v
# Debe mostrar:
# github-origin  https://github.com/p1mor/cortex_program_quant_traders.git (fetch)
# github-origin  https://github.com/p1mor/cortex_program_quant_traders.git (push)
```

### 3. Si el remoto aparece como `origin`, renombrarlo
```bash
git remote rename origin github-origin
```

### 4. Configurar usuario (si es necesario)
```bash
git config user.name "Tu Nombre"
git config user.email "tu@email.com"
```

---

## Flujo de Trabajo Diario

### Antes de empezar a trabajar
```bash
# 1. Asegurar estar en main
git checkout main

# 2. Descargar últimos cambios
git pull github-origin main

# 3. Verificar que todo está limpio
git status
```

### Durante el trabajo
```bash
# 1. Ver qué archivos cambiaron
git status

# 2. Ver los cambios específicos
git diff

# 3. Agregar cambios al staging
git add -A                    # Todos los archivos
# o
git add archivo.html          # Archivo específico

# 4. Verificar qué se va a commitear
git status
```

### Al terminar el trabajo
```bash
# 1. Commit con mensaje descriptivo
git commit -m "Descripción clara del cambio"

# 2. Push al repositorio
git push github-origin main
```

---

## Convención de Commits

### Formato
```
<tipo>: <descripción corta>

<descripción opcional más detallada>
```

### Tipos permitidos

| Tipo | Uso | Ejemplo |
|------|-----|---------|
| `feat` | Nueva funcionalidad | `feat: agregar slide de Monte Carlo` |
| `fix` | Corrección de bug | `fix: corregir navegación en módulo 3` |
| `style` | Cambios de estilo CSS | `style: ajustar colores del tema dark` |
| `refactor` | Refactorización | `refactor: optimizar loader de slides` |
| `docs` | Documentación | `docs: actualizar README con instrucciones` |
| `security` | Corrección de seguridad | `security: mitigar XSS en viewer` |
| `chore` | Mantenimiento | `chore: limpiar archivos temporales` |

### Ejemplos de commits correctos
```bash
git commit -m "feat: agregar lección 19 sobre protocolo integral"
git commit -m "fix: corregir scroll en slides de módulo 2"
git commit -m "security: implementar SRI en scripts CDN"
git commit -m "docs: crear guía de versionamiento"
```

### Ejemplos de commits incorrectos
```bash
# ❌ Muy vago
git commit -m "cambios"
git commit -m "update"
git commit -m "fix"

# ❌ Sin tipo
git commit -m "arreglé el slide"
```

---

## Estructura de Archivos

### Archivos que SÍ se versionan
- `*.html` — Slides y páginas
- `*.css` — Estilos
- `*.js` — Scripts de navegación y carga
- `*.png`, `*.jpg` — Imágenes del programa
- `*.md` — Documentación
- `.gitignore` — Exclusiones

### Archivos que NO se versionan
- `.DS_Store` — macOS
- `Thumbs.db` — Windows
- `*.tmp`, `*.log` — Temporales
- `.env` — Variables de entorno
- `node_modules/` — Dependencias
- Archivos personales del IDE

---

## Casos Especiales

### Agregar nueva lección a un módulo

1. Crear el archivo HTML en el módulo correspondiente:
   ```
   slides/modules/m1/14-nueva-leccion.html
   ```

2. Agregar la entrada en `js/loader.js`:
   ```javascript
   { id: '14-nueva-leccion', title: 'Nueva Lección' },
   ```

3. Verificar que el `lesson-tag` y `concept-code` son correctos

4. Commit:
   ```bash
   git add -A
   git commit -m "feat: agregar lección 14 - Nueva Lección"
   git push github-origin main
   ```

### Modificar un slide existente

1. Editar el archivo HTML correspondiente

2. Verificar que no se rompió la navegación

3. Commit:
   ```bash
   git add -A
   git commit -m "fix: corregir formato en slide L05-Precio"
   git push github-origin main
   ```

### Agregar nueva imagen

1. Colocar la imagen en `slides/assets/images/`

2. Referenciarla en el HTML:
   ```html
   <img src="../../assets/images/nueva-imagen.png" alt="Descripción" />
   ```

3. Commit:
   ```bash
   git add -A
   git commit -m "feat: agregar diagrama de microestructura"
   git push github-origin main
   ```

---

## Resolución de Conflictos

Si hay conflictos al hacer pull:

```bash
# 1. Descargar cambios
git pull github-origin main

# 2. Si hay conflictos, editar los archivos marcados
# Buscar <<<<<<< HEAD y resolver manualmente

# 3. Agregar archivos resueltos
git add -A

# 4. Completar el merge
git commit -m "merge: resolver conflictos con remoto"

# 5. Push
git push github-origin main
```

---

## Comandos Rápidos

### Ver estado
```bash
git status
```

### Ver historial
```bash
git log --oneline -10
```

### Ver cambios sin commitear
```bash
git diff
```

### Deshacer cambios en un archivo
```bash
git checkout -- archivo.html
```

### Ver quién modificó qué
```bash
git blame archivo.html
```

---

## Checklist Antes de Push

- [ ] ¿Los slides se ven correctamente en el navegador?
- [ ] ¿La navegación funciona (flechas, teclas, swipe)?
- [ ] ¿Las fórmulas matemáticas se renderizan (KaTeX)?
- [ ] ¿Las imágenes se cargan correctamente?
- [ ] ¿No hay archivos innecesarios (.DS_Store, .tmp)?
- [ ] ¿El mensaje de commit es descriptivo?

---

## Contacto y Soporte

- **Responsable:** camilopimor
- **Email:** camilopimor@gmail.com
- **GitHub:** [@p1mor](https://github.com/p1mor)

Para dudas sobre el versionamiento, consultar este archivo o contactar al responsable.

---

## Actualización de esta Guía

Esta guía debe actualizarse cuando:
- Cambie el flujo de trabajo
- Se agreguen nuevos tipos de commit
- Cambien las convenciones del equipo
- Se modifique la estructura del proyecto

**Última actualización:** Agosto 2026
