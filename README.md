# Sitio v.ia — primera entrega

Implementación paralela en Astro + Tailwind de la primera entrega de contenido aprobada el
25-ago-2026. No modifica ni sustituye `prototipo/` o `prototipo-design-md/`.

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
- `/reclutamiento-masivo` — caso de uso de alto volumen;
- `/contacto` — formulario diseñado, sin captación activa;
- `/privacidad` y `/terminos` — rutas técnicas no indexables, pendientes de contenido aprobado.

## Límites de publicación

- El formulario usa `data-lead-status="inactive"`; todos sus controles permanecen
  desactivados. No hay destino, persistencia ni mensaje de éxito simulado.
- Las representaciones de producto son editoriales y se identifican como tales. Las capturas reales
  y anonimizadas siguen pendientes de preparar y autorizar.
- Privacidad y términos no contienen borradores inventados y están marcados con `noindex`.
- No se publican métricas porcentuales ni nombres de clientes.

## Activos

Los logos y las curvas se copiaron del paquete oficial ya analizado en el proyecto. El header usa la
variante oficial sobre fondo oscuro porque el paquete no contiene todavía una exportación oscura
validada para fondos claros.
