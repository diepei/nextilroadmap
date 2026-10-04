# nextilroadmap

Web estática en español del Plan Estratégico de Crecimiento y Expansión 2026–2030 de Nextil.

## Ejecutar

Desde este directorio: `python3 -m http.server 8000 --directory dist`. Abrir http://localhost:8000.

## Contenido y seguimiento

- `dist/data.json`: metas, hitos e iniciativas con páginas de referencia.
- `dist/plan-nextil-2026-2030.pdf`: documento original completo del 4 de junio de 2026.
- `dist/index.html`, `styles.css`, `app.js`: interfaz adaptable, navegación anual, detalle de objetivos y metodología.
- `research/plan.txt`: extracción de texto para trazabilidad.

Los resultados de 2026–2030 están pendientes de verificar. No hay conexión a resultados actuales ni actualización automática. No se confunde la ausencia de datos con un avance del 0%. Las previsiones de ventas y EBITDA son normalizadas; no se interpolan ejercicios sin cifras publicadas. La página usa números físicos del PDF.

Para incorporar resultados posteriores, añadir evidencia, fecha y bases comparables antes de modificar los estados o calcular porcentajes. El sitio no permite alterar manualmente la evidencia publicada desde la interfaz.

## Publicación

Configuración de Sites en `.openai/hosting.json`. Salida estática en `dist`, sin dependencias ni paso de compilación.
