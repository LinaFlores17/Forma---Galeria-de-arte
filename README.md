# Forma — museo de arte generativo

Forma es una pequeña galería donde cada persona crea composiciones abstractas con formas y colores aleatorios, les pone título y las firma. La colección se puede explorar por color o buscar por artista.

## Funcionalidad

- Genera composiciones con círculos, rectángulos y triángulos en seis paletas de color.
- Guarda obras, edita sus títulos y autores, y elimina registros.
- Filtra la galería por color y por nombre de artista.
- Usa una base SQLite real mediante SQL.js. Su archivo binario se conserva en `localStorage`, por lo que sobrevive las recargas en el mismo navegador y dispositivo.
- No necesita una función de servidor; es compatible con el despliegue estático de Vercel.

> La persistencia local es individual por navegador. Para compartir una colección entre distintos usuarios/dispositivos se debe conectar una base remota como Turso.

## Desarrollo local

Requiere Node.js 20 o posterior.

```sh
npm install
npm run dev
```

Crear la compilación de producción:

```sh
npm run build
npm run preview
```

## Despliegue en Vercel

Importa el repositorio en Vercel. El framework preset es **Vite**, el comando de build `npm run build` y el directorio de salida `dist`. No se requieren variables de entorno.
