# Contrato de AJUSTES

Fuente: pestaña AJUSTES de MAPA SITIO WEB, documento
`1n-Hwyi6TK1a3Pp5VRWxJFQJ4frjzk02BTabgbDcQ5RU`, pestaña `t.o2nu9s4gb0q3`.

`feedback-copy.json`: 91 cadenas textuales de la checklist maestra de 200 controles,
con sus IDs originales. Se normalizan espacios técnicos; se conservan signos, tildes y mayúsculas.
Cuatro rótulos tienen `sourceCase: css-uppercase`: la fuente conserva su capitalización editorial
y la prueba en navegador exige literalmente las mayúsculas producidas por CSS.

`feedback-format.json`: 70 fragmentos del cotejo nativo del 7-sep-2026, 59 con formato
explícito. `sourceBlock` identifica los 32 bloques auxiliares del original, no los 200 IDs de
la checklist. Las cadenas binarias representan las propiedades de cada letra/número de `key`.
La normalización de `key` solo alinea el formato: el contrato de copy comprueba el texto exacto.
Un 1 exige la propiedad; un 0 no obliga a eliminar la jerarquía tipográfica del componente.

Procedencia preservada: `tmp/cotejo-ajustes-directo-2026-09-07/native-contract.json` y
`tmp/revision-200-controles-2026-09-07/lista-antes.md`, en la raíz del proyecto.
Actualizar solo tras una decisión editorial comprobada, nunca regenerar desde el sitio para
hacer que una prueba pase. Las decisiones de HOME-47 y SOL-37 ya están incorporadas.
