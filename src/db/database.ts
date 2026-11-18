import initSqlJs, { type Database } from 'sql.js'
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'

const STORAGE_KEY = 'forma-sqlite-v1'
let database: Database | null = null

export async function getDatabase(): Promise<Database> {
  if (database) return database
  const SQL = await initSqlJs({ locateFile: () => wasmUrl })
  const saved = localStorage.getItem(STORAGE_KEY)
  database = saved ? new SQL.Database(Uint8Array.from(atob(saved), (char) => char.charCodeAt(0))) : new SQL.Database()
  database.run(`CREATE TABLE IF NOT EXISTS artworks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    color TEXT NOT NULL,
    artwork TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`)
  persist()
  return database
}

export function persist(): void {
  if (!database) return
  const bytes = database.export()
  let binary = ''
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000))
  }
  localStorage.setItem(STORAGE_KEY, btoa(binary))
}
