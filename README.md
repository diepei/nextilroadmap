# nextilroadmap

Web estática en español del Plan Estratégico de Crecimiento y Expansión 2026–2030 de Nextil.

## Ejecutar

Desde este directorio: `npm run dev`. Abrir http://localhost:8000.

## Despliegue en Vercel

El proyecto es un sitio estático. `vercel.json` configura `dist` como directorio de salida y ejecuta la verificación antes de cada despliegue.

Con la CLI de Vercel:

```bash
npm install -g vercel
vercel
```

Para producción:

```bash
vercel --prod
```

También se puede importar el repositorio en Vercel usando la configuración incluida. No hace falta seleccionar un framework: el directorio de salida es `dist`.

## Contenido y seguimiento

- `dist/data.json`: metas, hitos e iniciativas con páginas de referencia.
- `dist/plan-nextil-2026-2030.pdf`: documento original completo del 4 de junio de 2026.
- `dist/index.html`, `styles.css`, `app.js`: interfaz adaptable, navegación anual, detalle de objetivos y metodología.
- `dist/resultados-1s-2026.pdf`: presentación pública de resultados de 1S 2026.
- `research/plan.txt` y `research/resultados-1s-2026.txt`: extracciones para trazabilidad.

Incorpora la presentación de resultados de 1S 2026 publicada por Nextil el 30 de septiembre de 2026 y enlazada desde su IPP. Corte financiero: 30 de junio de 2026. Última consulta: 5 de octubre de 2026. Actualización manual, sin conexión automática. Ventas/EBITDA normalizados: 32,5/7,2 M€ (incluyen Sindutex desde enero); perímetro comparable: 27,2/5,9 M€. Las otras tres adquisiciones previstas no se incluyen en el normalizado semestral. DFN/EBITDA: 1,98x, dentro del límite solo al cierre observado. No se anualiza el semestre ni se calcula un porcentaje global de cumplimiento. La caja operativa no se confunde con FCF; las conversiones del semestre no se imputan automáticamente al límite de dilución posterior al cierre. Las referencias usan páginas físicas de cada PDF.

Para incorporar resultados posteriores, añadir evidencia, fecha y bases comparables antes de modificar los estados o calcular porcentajes. El sitio no permite alterar manualmente la evidencia publicada desde la interfaz.

## Publicación

Configuración de Sites en `.openai/hosting.json`. Salida estática en `dist`, sin dependencias ni paso de compilación.
