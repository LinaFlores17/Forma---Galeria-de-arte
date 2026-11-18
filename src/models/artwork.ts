import { getDatabase, persist } from '../db/database'

export type Shape = { kind: 'circle' | 'rect' | 'triangle'; x: number; y: number; size: number; color: string; rotation: number; opacity: number }
export type Artwork = { id: number; title: string; author: string; color: string; artwork: Shape[]; created_at: string }

const palette = [
  { name: 'Terracota', hex: '#c65d3a' }, { name: 'Azul', hex: '#426b87' },
  { name: 'Mostaza', hex: '#d2a33d' }, { name: 'Verde', hex: '#63856b' },
  { name: 'Lila', hex: '#9878a8' }, { name: 'Rosa', hex: '#d58488' },
]
export const colors = palette

export function makeArt(colorName?: string): Shape[] {
  const main = palette.find((color) => color.name === colorName) ?? palette[Math.floor(Math.random() * palette.length)]
  const accents = palette.filter((color) => color.hex !== main.hex)
  return Array.from({ length: 8 + Math.floor(Math.random() * 8) }, (_, index) => ({
    kind: (['circle', 'rect', 'triangle'] as const)[Math.floor(Math.random() * 3)],
    x: 8 + Math.random() * 84, y: 8 + Math.random() * 84, size: 8 + Math.random() * 26,
    color: index % 3 === 0 ? main.hex : accents[Math.floor(Math.random() * accents.length)].hex,
    rotation: Math.floor(Math.random() * 360), opacity: 0.58 + Math.random() * 0.4,
  }))
}

export async function listArtworks(filters: { color?: string; author?: string } = {}): Promise<Artwork[]> {
  const db = await getDatabase()
  const where: string[] = []
  const params: string[] = []
  if (filters.color) { where.push('color = ?'); params.push(filters.color) }
  if (filters.author) { where.push('LOWER(author) LIKE ?'); params.push(`%${filters.author.toLowerCase()}%`) }
  const result = db.exec(`SELECT * FROM artworks ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY id DESC`, params)
  if (!result.length) return []
  return result[0].values.map((row) => ({
    id: Number(row[0]), title: String(row[1]), author: String(row[2]), color: String(row[3]),
    artwork: JSON.parse(String(row[4])) as Shape[], created_at: String(row[5]),
  }))
}

export async function saveArtwork(title: string, author: string, color: string, art: Shape[]): Promise<void> {
  const db = await getDatabase()
  db.run('INSERT INTO artworks (title, author, color, artwork) VALUES (?, ?, ?, ?)', [title, author, color, JSON.stringify(art)])
  persist()
}

export async function updateArtwork(id: number, title: string, author: string): Promise<void> {
  const db = await getDatabase()
  db.run('UPDATE artworks SET title = ?, author = ? WHERE id = ?', [title, author, id])
  persist()
}

export async function deleteArtwork(id: number): Promise<void> {
  const db = await getDatabase()
  db.run('DELETE FROM artworks WHERE id = ?', [id])
  persist()
}
