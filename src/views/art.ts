import type { Shape } from '../models/artwork'

export function artSvg(shapes: Shape[], label: string, className = ''): string {
  const shapesMarkup = shapes.map((shape) => {
    const transform = `translate(${shape.x} ${shape.y}) rotate(${shape.rotation})`
    if (shape.kind === 'circle') return `<circle cx="${shape.x}" cy="${shape.y}" r="${shape.size / 2}" fill="${shape.color}" opacity="${shape.opacity}"/>`
    if (shape.kind === 'rect') return `<rect x="${shape.x - shape.size / 2}" y="${shape.y - shape.size / 2}" width="${shape.size}" height="${shape.size}" rx="2" fill="${shape.color}" opacity="${shape.opacity}" transform="${transform}"/>`
    return `<path d="M ${shape.x} ${shape.y - shape.size / 2} L ${shape.x + shape.size / 2} ${shape.y + shape.size / 2} L ${shape.x - shape.size / 2} ${shape.y + shape.size / 2} Z" fill="${shape.color}" opacity="${shape.opacity}"/>`
  }).join('')
  return `<svg class="${className}" viewBox="0 0 100 100" role="img" aria-label="${escapeHtml(label)}" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#eee9df"/>${shapesMarkup}</svg>`
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!)
}
