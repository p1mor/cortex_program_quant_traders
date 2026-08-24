# Guía de Versionamiento — Cortex Quant Trader

> **Repositorio:** GitHub  
> **Remoto:** `github-origin`  
> **Rama principal:** `github-main` (producción)  
> **Rama desarrollo:** `github-sebastian`  
> **Equipo:** camilopimor (propietario) + Sebastian (desarrollador)

---

## ⚠️ IMPORTANTE: Identificación del Repositorio

Este repositorio está en **GitHub** (no en AWS CodeCommit). Para evitar confusiones:

| Entorno | Remoto | Plataforma |
|---------|--------|------------|
| **Este proyecto** | `github-origin` | GitHub |
| **Producción** | `origin` | AWS CodeCommit |

**NUNCA** uses `origin` para este repositorio. Siempre usa `github-origin`.

---

## 🌿 Estructura de Ramas

| Rama | Propósito | Quién trabaja | Quién mergea |
|------|-----------|---------------|--------------|
| `github-main` | Producción (versión estable) | Nadie directamente | camilopimor |
| `github-sebastian` | Desarrollo de Sebastian | Sebastian | Sebastian (push) → camilopimor (merge a main) |

### Flujo de Trabajo

```
┌─────────────────────┐
│  github-sebastian   │  ← Sebastian trabaja aquí
│  (desarrollo)       │
└──────────┬──────────┘
           │
           │  git push github-origin github-sebastian
           │
           ▼
┌─────────────────────┐
│  Pull Request       │  ← Sebastian crea PR en GitHub
│  (GitHub)           │
└──────────┬──────────┘
           │
           │  camilopimor revisa y aprueba
           │
           ▼
┌─────────────────────┐
│  github-main        │  ← Producción (versión estable)
│  (producción)       │
└─────────────────────┘
```

---

## 👤 GUÍA PARA SEBASTIAN (Desarrollador)

### Configuración Inicial

#### 1. Clonar el repositorio
```bash
git clone https://github.com/p1mor/cortex_program_quant_traders.git
cd cortex_program_quant_traders
```

#### 2. Verificar remoto
```bash
git remote -v
# Debe mostrar:
# github-origin  https://github.com/p1mor/cortex_program_quant_traders.git (fetch)
# github-origin  https://github.com/p1mor/cortex_program_quant_traders.git (push)
```

#### 3. Si el remoto aparece como `origin`, renombrarlo
```bash
git remote rename origin github-origin
```

#### 4. Configurar usuario
```bash
git config user.name "Sebastian"
git config user.email "sebastian@email.com"
```

#### 5. Cambiar a tu rama de desarrollo
```bash
git checkout github-sebastian
```

#### 6. Verificar que estás en la rama correcta
```bash
git branch -vv
# Debe mostrar:
# * github-sebastian  xxxxxxx [github-origin/github-sebastian] ...
```

---

### Flujo de Trabajo Diario (Sebastian)

#### Antes de empezar a trabajar
```bash
# 1. Asegurar estar en tu rama
git checkout github-sebastian

# 2. Descargar últimos cambios de tu rama remota
git pull github-origin github-sebastian

# 3. Opcionalmente, sincronizar con los últimos cambios de main
git fetch github-origin
git merge github-origin/github-main

# 4. Verificar que todo está limpio
git status
```

#### Durante el trabajo
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

#### Al terminar el trabajo
```bash
# 1. Commit con mensaje descriptivo
git commit -m "feat: descripción del cambio"

# 2. Push a TU rama (NO a main)
git push github-origin github-sebastian
```

#### Crear Pull Request (para merge a main)
```bash
# 1. Asegurar que todos los cambios están en tu rama remota
git push github-origin github-sebastian

# 2. Ir a GitHub y crear Pull Request:
#    - Desde: github-sebastian
#    - Hacia: github-main
#    - Describir los cambios realizados

# 3. Esperar a que camilopimor revise y apruebe
```

---

### ⚠️ REGLAS IMPORTANTES PARA SEBASTIAN

1. **NUNCA** hagas push directamente a `github-main`
2. **SIEMPRE** trabaja en `github-sebastian`
3. **SIEMPRE** crea Pull Request para merge a `github-main`
4. **ANTES** de empezar a trabajar, sincroniza con `github-main`
5. **USA** mensajes de commit descriptivos (ver convención abajo)

---

## 👤 GUÍA PARA CAMILOPIMOR (Propietario)

### Revisar y Aprobar Cambios de Sebastian

#### 1. Ver los Pull Requests pendientes
```bash
# En GitHub, ir a la pestaña "Pull Requests"
# O usar GitHub CLI:
gh pr list
```

#### 2. Revisar los cambios
```bash
# Descargar la rama de Sebastian
git fetch github-origin
git checkout github-sebastian

# Revisar los cambios
git log --oneline github-main..github-sebastian
git diff github-main..github-sebastian

# Probar localmente si es necesario
```

#### 3. Aprobar y mergear
```bash
# Opción A: Merge en GitHub (recomendado)
# - Ir al Pull Request en GitHub
# - Click en "Merge pull request"
# - Confirmar el merge

# Opción B: Merge local
git checkout github-main
git pull github-origin github-main
git merge github-sebastian
git push github-origin github-main
```

#### 4. Después del merge
```bash
# Actualizar la rama de Sebastian con los últimos cambios de main
git checkout github-sebastian
git merge github-main
git push github-origin github-sebastian
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

4. Commit (en tu rama):
   ```bash
   git add -A
   git commit -m "feat: agregar lección 14 - Nueva Lección"
   git push github-origin github-sebastian
   ```

5. Crear Pull Request en GitHub

### Modificar un slide existente

1. Editar el archivo HTML correspondiente

2. Verificar que no se rompió la navegación

3. Commit (en tu rama):
   ```bash
   git add -A
   git commit -m "fix: corregir formato en slide L05-Precio"
   git push github-origin github-sebastian
   ```

4. Crear Pull Request en GitHub

### Agregar nueva imagen

1. Colocar la imagen en `slides/assets/images/`

2. Referenciarla en el HTML:
   ```html
   <img src="../../assets/images/nueva-imagen.png" alt="Descripción" />
   ```

3. Commit (en tu rama):
   ```bash
   git add -A
   git commit -m "feat: agregar diagrama de microestructura"
   git push github-origin github-sebastian
   ```

4. Crear Pull Request en GitHub

---

## Resolución de Conflictos

Si hay conflictos al hacer merge:

```bash
# 1. Asegurar estar en tu rama
git checkout github-sebastian

# 2. Descargar cambios de main
git fetch github-origin
git merge github-origin/github-main

# 3. Si hay conflictos, editar los archivos marcados
# Buscar <<<<<<< HEAD y resolver manualmente

# 4. Agregar archivos resueltos
git add -A

# 5. Completar el merge
git commit -m "merge: resolver conflictos con github-main"

# 6. Push
git push github-origin github-sebastian
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

### Ver todas las ramas
```bash
git branch -a
```

### Cambiar de rama
```bash
git checkout github-sebastian
```

---

## Checklist Antes de Push

- [ ] ¿Estás en tu rama (`github-sebastian`)?
- [ ] ¿Los slides se ven correctamente en el navegador?
- [ ] ¿La navegación funciona (flechas, teclas, swipe)?
- [ ] ¿Las fórmulas matemáticas se renderizan (KaTeX)?
- [ ] ¿Las imágenes se cargan correctamente?
- [ ] ¿No hay archivos innecesarios (.DS_Store, .tmp)?
- [ ] ¿El mensaje de commit es descriptivo?

---

## Contacto y Soporte

- **Propietario:** camilopimor
- **Email:** camilopimor@gmail.com
- **GitHub:** [@p1mor](https://github.com/p1mor)

Para dudas sobre el versionamiento, consultar este archivo o contactar al propietario.

---

## Actualización de esta Guía

Esta guía debe actualizarse cuando:
- Cambie el flujo de trabajo
- Se agreguen nuevos tipos de commit
- Cambien las convenciones del equipo
- Se modifique la estructura del proyecto
- Se agreguen nuevos desarrolladores

**Última actualización:** Agosto 2026
