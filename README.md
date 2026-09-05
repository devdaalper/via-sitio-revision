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
- Commit fuente documentado: `d4e2239f5ed385cf6e3f8b16bf1021e1b070e8a6`.
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
  cliente y se implementan como contenido confirmado para R002.
- Las URLs oficiales de Instagram, Facebook y LinkedIn se configuran mediante variables públicas;
  los iconos quedan inactivos mientras esas URLs no se proporcionen.

## Activos

Los logos y las curvas se copiaron del paquete oficial ya analizado en el proyecto. El header usa la
variante oficial sobre fondo oscuro porque el paquete no contiene todavía una exportación oscura
validada para fondos claros.
