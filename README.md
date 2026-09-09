# Sitio v.ia — revisión R002

Implementación en Astro + Tailwind de la reestructura de contenido enviada por Marketing y Diseño.
El corte vigente es **Versión 5 · VIA-WEB-R002**.

## Comandos

```bash
npm install
npm run dev
npm run check
npm run build
npm run preview
```

## Revisión pública vigente

- URL para compartir: <https://devdaalper.github.io/via-web-revisiones/r002/>
- Rama fuente: `codex/via-r002-final-polish`.
- Fecha del corte: 9 de septiembre de 2026.
- Commit fuente: consultar el [manifiesto público](https://devdaalper.github.io/via-web-revisiones/revision-manifest.json).
- La revisión añade `noindex, nofollow` y no representa un lanzamiento de producción.
- Estado maestro: `../docs/ESTADO-ACTUAL-SITIO-VIA.md`.

## Rutas

- `/` — Home;
- `/plataforma` — Cómo funciona;
- `/soluciones` — agentes con IA, integraciones y soluciones por rol;
- `/reclutamiento-masivo` — ruta heredada, fuera de la navegación principal;
- `/contacto` — formulario diseñado, sin captación activa;
- `/privacidad` y `/terminos` — rutas técnicas no indexables, pendientes de contenido aprobado.

## Límites de publicación

- El formulario usa `data-lead-status="inactive"`; todos sus controles permanecen
  desactivados. No hay destino, persistencia ni mensaje de éxito simulado.
- Los visuales reales de entrevista por chat y videollamada siguen pendientes de recibir de Olivia;
  mientras tanto se usan iconos editoriales sin simular interfaz de producto.
- Privacidad y términos no contienen borradores inventados y están marcados con `noindex`.
- Las métricas porcentuales de esta revisión provienen directamente del documento instruccional del
  cliente y están aprobadas para revisión en R002; su ratificación para lanzamiento sigue pendiente.
- Las URLs oficiales de Instagram, Facebook y LinkedIn se configuran mediante variables públicas;
  los iconos quedan inactivos mientras esas URLs no se proporcionen.

## Activos

Los logos provienen del editable oficial. Las curvas A y B conservan los trazados y tintas de los
originales, recuperados en SVG con trazo de 0.9 px y opacidad 0.8 sobre un lienzo compartido.
Los cuatro iconos exactos del proceso conservan procedencia, hash y atribución visible.

El corte incorpora la integración del video de personas, jerarquía del CTA de cabecera, selector
corregido en Safari y navegación alternativa sin JavaScript. Se verificaron siete páginas en ocho
perfiles de Chrome, Firefox y WebKit, más dos perfiles con la base de GitHub Pages.
