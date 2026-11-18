import './styles/styles.css'
import { initGallery, renderPage } from './controllers/gallery'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = renderPage()
initGallery().catch((error: unknown) => {
  console.error('No se pudo iniciar el museo:', error)
  document.querySelector('#art-grid')!.innerHTML = '<p class="error-state">No se pudo abrir la base de datos local. Revisa que el navegador permita almacenamiento.</p>'
})
