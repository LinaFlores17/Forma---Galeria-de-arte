import { colors, deleteArtwork, listArtworks, makeArt, saveArtwork, updateArtwork, type Artwork } from '../models/artwork'
import { artSvg, escapeHtml } from '../views/art'

let draft = makeArt()
let selectedColor = colors[Math.floor(Math.random() * colors.length)].name
let activeColor = ''
let authorFilter = ''

const colorOptions = (value = '') => `<option value="">Todos los colores</option>${colors.map((color) => `<option value="${color.name}" ${value === color.name ? 'selected' : ''}>${color.name}</option>`).join('')}`

export function renderPage(): string {
  return `<header class="topbar"><a class="brand" href="#top"><span class="brand-mark">f.</span> forma</a><a class="top-link" href="#galeria">Explorar el museo <span>↗</span></a></header>
  <main id="top"><section class="hero"><div class="hero-copy"><p class="eyebrow"><span class="live-dot"></span> UN MUSEO HECHO POR TODOS</p><h1>El arte de<br><em>dejarse llevar.</em></h1><p class="intro">Pequeñas obras, infinitas posibilidades. Juega con formas y color, crea la tuya y déjala vivir en nuestra galería.</p><a class="text-link" href="#crear">Empieza a crear <span>↓</span></a></div><div class="hero-art" id="hero-art">${artSvg(draft, 'Composición abstracta generada', 'hero-svg')}<span class="art-note">COMPOSICIÓN N.º 001<br>HECHA AL AZAR</span><span class="orbit orbit-one"></span><span class="orbit orbit-two"></span></div></section>
  <section class="studio section-wrap" id="crear"><div class="section-heading"><div><p class="eyebrow">01 — TU ESTUDIO</p><h2>Haz algo <em>inesperado.</em></h2></div><span class="step-note">No hay forma incorrecta de crear.</span></div><div class="studio-panel"><div class="preview-frame" id="draft-preview">${artSvg(draft, 'Tu obra en proceso')}</div><form class="create-form" id="create-form"><label class="field-label">PRIMERO, JUEGA CON EL COLOR</label><div class="swatches">${colors.map((color) => `<button class="swatch ${selectedColor === color.name ? 'selected' : ''}" type="button" data-color="${color.name}" style="--swatch:${color.hex}" aria-label="Elegir ${color.name}" title="${color.name}"></button>`).join('')}</div><button type="button" class="shuffle-button" id="shuffle">✳ &nbsp; Sorpréndeme con nuevas formas</button><div class="form-divider"></div><label class="field-label" for="title">PONLE UN NOMBRE</label><input id="title" name="title" maxlength="48" placeholder="Ej. Domingo en Saturno" required /><label class="field-label" for="author">¿QUIÉN LO CREÓ?</label><input id="author" name="author" maxlength="32" placeholder="Tu nombre o alias" required /><button class="save-button" type="submit">Guardar en el museo <span>↗</span></button><p class="form-footnote">Tu obra quedará guardada en este dispositivo.</p></form></div></section>
  <section class="gallery section-wrap" id="galeria"><div class="section-heading gallery-heading"><div><p class="eyebrow">02 — COLECCIÓN ABIERTA</p><h2>El museo <em>de todos.</em></h2></div><span class="art-count" id="art-count">0 obras</span></div><div class="filters"><label class="filter-search"><span>⌕</span><input id="author-filter" placeholder="Buscar por artista…" aria-label="Buscar por artista" /></label><select id="color-filter" aria-label="Filtrar por color">${colorOptions()}</select><button type="button" class="clear-filters" id="clear-filters">Limpiar filtros</button></div><div id="art-grid" class="art-grid"></div></section></main><footer><span>forma <span class="footer-dot">✳</span> un museo en constante transformación.</span><a href="#top">Volver arriba ↑</a></footer>
  <dialog id="edit-dialog"><form method="dialog" id="edit-form"><button type="button" class="dialog-close" id="close-dialog" aria-label="Cerrar">×</button><p class="eyebrow">EDITAR ETIQUETA</p><h2>Tu obra, tus palabras.</h2><input type="hidden" id="edit-id"/><label class="field-label" for="edit-title">TÍTULO</label><input id="edit-title" maxlength="48" required/><label class="field-label" for="edit-author">AUTOR</label><input id="edit-author" maxlength="32" required/><div class="dialog-actions"><button type="button" class="cancel-button" id="cancel-edit">Cancelar</button><button class="save-button" id="update-button" type="submit">Guardar cambios ↗</button></div></form></dialog>`
}

function card(art: Artwork): string {
  return `<article class="art-card" data-id="${art.id}"><div class="card-image">${artSvg(art.artwork, art.title)}<span class="card-index">F. / ${String(art.id).padStart(3, '0')}</span><button class="delete-button" data-delete="${art.id}" aria-label="Eliminar ${escapeHtml(art.title)}" title="Eliminar obra">×</button></div><div class="card-info"><div><h3>${escapeHtml(art.title)}</h3><p>por <span class="card-author">${escapeHtml(art.author)}</span></p></div><span class="color-pill"><i style="--swatch:${colors.find((color) => color.name === art.color)?.hex ?? '#aaa'}"></i>${escapeHtml(art.color)}</span></div><div class="card-actions"><button data-edit="${art.id}">Editar ficha ↗</button></div></article>`
}

async function refresh(): Promise<void> {
  const artworks = await listArtworks({ color: activeColor, author: authorFilter })
  const grid = document.querySelector<HTMLDivElement>('#art-grid')!
  document.querySelector('#art-count')!.textContent = `${artworks.length} ${artworks.length === 1 ? 'obra' : 'obras'}`
  grid.innerHTML = artworks.length ? artworks.map(card).join('') : `<div class="empty-state"><span>✳</span><h3>Aquí empieza algo.</h3><p>${activeColor || authorFilter ? 'No encontramos obras con esos filtros. Prueba con otros.' : 'Todavía no hay obras en la colección. La primera podría ser tuya.'}</p></div>`
}

export async function initGallery(): Promise<void> {
  await refresh()
  document.querySelectorAll<HTMLButtonElement>('.swatch').forEach((button) => button.addEventListener('click', () => {
    selectedColor = button.dataset.color!; draft = makeArt(selectedColor)
    document.querySelectorAll('.swatch').forEach((item) => item.classList.toggle('selected', item === button))
    document.querySelector('#draft-preview')!.innerHTML = artSvg(draft, 'Tu obra en proceso')
    document.querySelector('#hero-art')!.innerHTML = artSvg(draft, 'Composición abstracta generada', 'hero-svg') + '<span class="art-note">COMPOSICIÓN EN PROCESO<br>HECHA AL AZAR</span><span class="orbit orbit-one"></span><span class="orbit orbit-two"></span>'
  }))
  document.querySelector('#shuffle')!.addEventListener('click', () => {
    draft = makeArt(selectedColor)
    document.querySelector('#draft-preview')!.innerHTML = artSvg(draft, 'Tu obra en proceso')
    document.querySelector('#hero-art')!.innerHTML = artSvg(draft, 'Composición abstracta generada', 'hero-svg') + '<span class="art-note">COMPOSICIÓN EN PROCESO<br>HECHA AL AZAR</span><span class="orbit orbit-one"></span><span class="orbit orbit-two"></span>'
  })
  document.querySelector<HTMLFormElement>('#create-form')!.addEventListener('submit', async (event) => {
    event.preventDefault()
    const form = event.currentTarget as HTMLFormElement
    const values = new FormData(form)
    await saveArtwork(String(values.get('title')).trim(), String(values.get('author')).trim(), selectedColor, draft)
    form.reset(); draft = makeArt(selectedColor)
    document.querySelector('#draft-preview')!.innerHTML = artSvg(draft, 'Tu obra en proceso')
    await refresh(); document.querySelector('#galeria')!.scrollIntoView({ behavior: 'smooth' })
  })
  document.querySelector('#color-filter')!.addEventListener('change', async (event) => { activeColor = (event.currentTarget as HTMLSelectElement).value; await refresh() })
  document.querySelector<HTMLInputElement>('#author-filter')!.addEventListener('input', async (event) => { authorFilter = (event.currentTarget as HTMLInputElement).value; await refresh() })
  document.querySelector('#clear-filters')!.addEventListener('click', async () => {
    activeColor = ''; authorFilter = ''
    ;(document.querySelector('#color-filter') as HTMLSelectElement).value = ''
    ;(document.querySelector('#author-filter') as HTMLInputElement).value = ''
    await refresh()
  })
  const dialog = document.querySelector<HTMLDialogElement>('#edit-dialog')!
  const closeDialog = () => dialog.close()
  document.querySelector('#close-dialog')!.addEventListener('click', closeDialog)
  document.querySelector('#cancel-edit')!.addEventListener('click', closeDialog)
  document.querySelector('#art-grid')!.addEventListener('click', async (event) => {
    const target = event.target as HTMLElement
    const deleteId = target.closest<HTMLElement>('[data-delete]')?.dataset.delete
    if (deleteId) {
      if (confirm('¿Eliminar esta obra del museo?')) { await deleteArtwork(Number(deleteId)); await refresh() }
      return
    }
    const editId = target.closest<HTMLElement>('[data-edit]')?.dataset.edit
    if (editId) {
      const art = (await listArtworks()).find((item) => item.id === Number(editId))
      if (art) {
        ;(document.querySelector('#edit-id') as HTMLInputElement).value = String(art.id)
        ;(document.querySelector('#edit-title') as HTMLInputElement).value = art.title
        ;(document.querySelector('#edit-author') as HTMLInputElement).value = art.author
        dialog.showModal()
      }
    }
  })
  document.querySelector<HTMLFormElement>('#edit-form')!.addEventListener('submit', async (event) => {
    event.preventDefault()
    await updateArtwork(Number((document.querySelector('#edit-id') as HTMLInputElement).value), (document.querySelector('#edit-title') as HTMLInputElement).value.trim(), (document.querySelector('#edit-author') as HTMLInputElement).value.trim())
    dialog.close(); await refresh()
  })
}
