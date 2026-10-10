# CoolVideo

Pega una URL y genera imágenes y videos promocionales en distintos estilos (Motion Graphics,
Vox, 3D isométrico, cinemático, retro VHS, anime, minimal suizo, claymation) usando la API de
[Higgsfield](https://higgsfield.ai).

**Stack:** Next.js 15 (App Router) · Tailwind CSS v4 · [Magic UI](https://magicui.design) · Clerk (auth) · Supabase (Postgres) · Higgsfield API

## Cómo funciona

1. El usuario (autenticado con Clerk) pega una URL y elige hasta 4 estilos, formato (16:9, 9:16, 1:1)
   y si quiere solo imágenes o imágenes + video.
2. `POST /api/projects` lee la página (título, descripción, titulares, `og:image`, color de marca)
   con protección SSRF, guarda el proyecto en Supabase y envía una generación de imagen por estilo
   a Higgsfield (`bytedance/seedream/v4/text-to-image` por defecto).
3. La página del proyecto consulta `GET /api/projects/:id` cada 5 s. Ese endpoint pide el estado a
   Higgsfield y, cuando una imagen termina, la anima con el modelo de video
   (`higgsfield-ai/dop/standard` por defecto, image-to-video).

```
src/
  app/
    page.tsx                  landing
    dashboard/page.tsx        formulario + lista de proyectos
    projects/[id]/page.tsx    resultados en vivo
    api/projects/...          crear / listar / consultar / borrar
    sign-in, sign-up          páginas de Clerk
  components/ui/              componentes de Magic UI
  lib/
    higgsfield.ts             cliente REST de Higgsfield (+ modo mock)
    scrape.ts                 lectura de la URL con protección SSRF
    styles.ts                 catálogo de estilos y prompts
    projects.ts               lógica de proyectos y sincronización de generaciones
    supabase.ts               cliente de servidor (service role)
  middleware.ts               protege /dashboard, /projects y /api/projects con Clerk
supabase/migrations/0001_init.sql
```

## Interfaz (Magic UI)

Los componentes de [Magic UI](https://github.com/magicuidesign/magicui) (licencia MIT) viven en
`src/components/ui/`, siguiendo el modelo de shadcn: el código se copia al proyecto y es tuyo.
Sus animaciones (`@keyframes`) están en `src/app/globals.css`.

Se usan: MagicCard, BorderBeam, ShimmerButton, BlurFade, Marquee, AnimatedShinyText, ShineBorder,
WordRotate, NumberTicker, AuroraText, DotPattern y Particles.

Para añadir más componentes:

```bash
npx shadcn@latest add @magicui/<componente>   # p. ej. @magicui/animated-beam
```

Si el CSS del componente incluye keyframes, la CLI los añade a `globals.css`.

## Puesta en marcha

1. **Instala dependencias:** `npm install`
2. **Clerk:** crea una app en [dashboard.clerk.com](https://dashboard.clerk.com) y copia las claves.
3. **Supabase:** crea un proyecto y ejecuta `supabase/migrations/0001_init.sql` en el SQL editor.
   Copia la URL del proyecto y la `service_role` key (solo servidor).
4. **Higgsfield:** crea una API key en [cloud.higgsfield.ai](https://cloud.higgsfield.ai).
5. **Variables de entorno:** `cp .env.example .env.local` y rellénalas.
6. `npm run dev` y abre http://localhost:3000

> Sin créditos de Higgsfield todavía? Pon `HIGGSFIELD_MOCK=true` para probar todo el flujo con
> imágenes y videos de ejemplo.

### Notas sobre Higgsfield

El cliente sigue el formato del SDK oficial
([higgsfield-ai/higgsfield-client](https://github.com/higgsfield-ai/higgsfield-client)):
`POST {base}/{model-id}` devuelve `request_id`, y `GET {base}/requests/{id}/status` devuelve
`status` (`queued`, `in_progress`, `completed`, `failed`, `nsfw`, `canceled`) con `images[].url`
o `video.url`. La URL base y los modelos se pueden cambiar con `HIGGSFIELD_BASE_URL`,
`HIGGSFIELD_IMAGE_MODEL` y `HIGGSFIELD_VIDEO_MODEL`; revisa en la página de cada modelo qué
parámetros acepta (duración, resolución) si cambias de modelo.

## Seguridad

- Todas las consultas a Supabase se hacen en el servidor con la service-role key y filtrando por el
  `userId` de Clerk. La migración activa RLS con políticas `auth.jwt()->>'sub' = user_id`, válidas
  si más adelante conectas la integración Clerk ↔ Supabase para leer desde el navegador.
- El scraper solo acepta http/https, rechaza IPs privadas/locales (también tras redirecciones),
  limita la respuesta a 2 MB y usa timeout de 10 s.

## Siguientes pasos sugeridos

- Límite de uso / créditos por usuario (p. ej. Clerk Billing) para controlar el gasto en Higgsfield.
- Copiar los resultados a Supabase Storage (las URLs de Higgsfield pueden expirar).
- Webhook de Higgsfield (`?hf_webhook=`) en lugar de polling.
