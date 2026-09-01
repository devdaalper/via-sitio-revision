# Sitio v.ia — revisión R002

Implementación en Astro + Tailwind de la reestructura de contenido enviada por Marketing y Diseño
el 31-ago-2026. La revisión pública R001 permanece inmutable.

## Comandos

```bash
npm install
npm run dev
npm run check
npm run build
npm run preview
```

## Revisión pública

La versión de revisión se publica desde el repositorio independiente
`devdaalper/via-sitio-revision` mediante GitHub Actions. El build público usa la base
`/via-sitio-revision` y añade `noindex, nofollow`; no sustituye al prototipo anterior ni representa
un lanzamiento de producción.

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
