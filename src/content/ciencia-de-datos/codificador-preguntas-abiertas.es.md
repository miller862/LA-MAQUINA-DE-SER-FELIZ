---
title: "Codificando respuestas abiertas con procesamiento de lenguaje natural y modelos de lenguaje"
date: "2026-07-10"
description: "Cuando ahorrar costos y tiempos coincide con un aumento de la efectividad. Cómo usamos técnicas de procesamiento de lenguaje natural (NLP) y modelos de lenguaje para codificar preguntas abiertas con foco en la pregunta de investigación."
tags: ["python", "nlp", "ia"]
lang: "es"
postId: "codificador-preguntas-abiertas"
cover: "/img/cover-codificador.svg"
draft: false
---

<div style="margin-bottom:2.5rem;border-radius:12px;overflow:hidden;background:#0c0f0c;">
  <img src="/img/cover-codificador.svg" alt="Codificador de preguntas abiertas" style="width:100%;display:block;height:auto;" />
</div>

En investigación de mercado, las preguntas abiertas son un arma de doble filo: capturan una riqueza y una especificidad deseable pero cuantificarlas es siempre un desafío por la ambigüedad, la variedad semántica y los errores ortográficos que traen. En Moiguer desarrollamos nuestra propia solución in-house para este problema de antaño en encuestas de opinión desarrollando nuestro propio software de codificación de preguntas abiertas.

Para convertir texto libre en datos existe un proceso que se llama **codificación**. Alguien lee todas las respuestas, agrupa las que dicen lo mismo, asigna un número a cada grupo y reemplaza el texto por ese número en la base. "Hellmanns", "Jelman" y "hellmans" terminan bajo un mismo código, el que corresponde a Hellmann's.

Es un trabajo tedioso, repetitivo y propenso a errores de consistencia. Cuando se trata de miles de respuestas a múltiples preguntas, para varios proyectos corriendo en paralelo, además es caro e ineficiente. Ese fue el punto de partida.

El objetivo era aumentar la eficiencia (de recursos y tiempo), sin perder efectividad (hablo de la fidelidad del resultado final) y de ser posible, incrementarla.

---

## Dos problemas, no uno

Toda pregunta abierta cae en una de dos situaciones, y cada una exige una lógica distinta.

**Cuando ya existe un libro de códigos.** En estudios longitudinales, paneles o proyectos con múltiples olas, las categorías se definieron en una medición anterior. Hay un archivo (el libro de códigos) con una lista de claves numéricas y los valores que les corresponden. La tarea es *imputar*: tomar cada respuesta nueva y mapearla a la clave correcta. El desafío central es la variabilidad ortográfica: "Cocca-cola", "coca cola" y "CocaCola" refieren a la misma clave.

**Cuando no existe ningún libro de códigos.** En estudios nuevos, o en preguntas que nunca se hicieron, hay que *codificar* las categorías desde cero. El analista no sabe de antemano qué va a encontrar, puede intuirlo, pero si quiere predefinir el libro de códigos incurre en el riesgo de introducir su sesgo por encima de lo que dicen los encuestados. Primero hay que descubrir qué categorías emergen de los datos, después asignar cada respuesta a una, y finalmente producir un libro de códigos reutilizable para las próximas olas.

Los dos flujos comparten infraestructura pero resuelven cosas diferentes. La distinción no es menor: la imputación sigue una pauta que ya existe, mientras que la codificación lo fabrica.

<svg viewBox="0 0 600 270" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;display:block;margin:1.5rem auto;font-family:monospace;">
  <defs><marker id="d1" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="currentColor" opacity="0.7"/></marker></defs>
  <rect x="215" y="6" width="170" height="36" rx="8" fill="currentColor" fill-opacity="0.06" stroke="currentColor" stroke-opacity="0.5"/>
  <text x="300" y="24" text-anchor="middle" font-size="11" fill="currentColor" font-weight="bold">Cargar proyecto</text>
  <text x="300" y="37" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.6">y elegir preguntas</text>
  <line x1="300" y1="42" x2="300" y2="58" stroke="currentColor" stroke-opacity="0.5" marker-end="url(#d1)"/>
  <polygon points="300,60 375,92 300,124 225,92" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-opacity="0.55"/>
  <text x="300" y="90" text-anchor="middle" font-size="10" fill="currentColor" font-weight="bold">¿hay libro</text>
  <text x="300" y="103" text-anchor="middle" font-size="10" fill="currentColor" font-weight="bold">de códigos?</text>
  <path d="M225,92 L150,92 L150,142" fill="none" stroke="currentColor" stroke-opacity="0.5" marker-end="url(#d1)"/>
  <text x="185" y="84" font-size="8.5" fill="currentColor" opacity="0.8" font-weight="bold">sí</text>
  <rect x="65" y="144" width="170" height="44" rx="8" fill="currentColor" fill-opacity="0.09" stroke="currentColor" stroke-opacity="0.65"/>
  <text x="150" y="163" text-anchor="middle" font-size="11" fill="currentColor" font-weight="bold">Imputación</text>
  <text x="150" y="178" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.6">usar los códigos que ya existen</text>
  <path d="M375,92 L450,92 L450,142" fill="none" stroke="currentColor" stroke-opacity="0.5" marker-end="url(#d1)"/>
  <text x="415" y="84" font-size="8.5" fill="currentColor" opacity="0.8" font-weight="bold">no</text>
  <rect x="365" y="144" width="170" height="44" rx="8" fill="currentColor" fill-opacity="0.09" stroke="currentColor" stroke-opacity="0.65"/>
  <text x="450" y="163" text-anchor="middle" font-size="11" fill="currentColor" font-weight="bold">Codificación</text>
  <text x="450" y="178" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.6">armar los códigos desde cero</text>
  <path d="M150,188 L150,224 L290,224" fill="none" stroke="currentColor" stroke-opacity="0.4" marker-end="url(#d1)"/>
  <path d="M450,188 L450,224 L310,224" fill="none" stroke="currentColor" stroke-opacity="0.4" marker-end="url(#d1)"/>
  <rect x="215" y="228" width="170" height="36" rx="8" fill="currentColor" fill-opacity="0.06" stroke="currentColor" stroke-opacity="0.5"/>
  <text x="300" y="246" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="bold">Base codificada</text>
  <text x="300" y="259" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.6">y libro listo para la próxima ola</text>
</svg>

---

## Proyectos múltiples y respuestas múltiples

La herramienta no se pensó para un único estudio. El menú inicial lista todos los proyectos de una carpeta central, y cada uno tiene su propia estructura: los datos de entrada, el libro de códigos, las variaciones aprendidas y los resultados con sus checkpoints. Los subproyectos se detectan de forma automática, y cuando los archivos siguen un patrón de olas la herramienta pregunta qué ola procesar. Cada proyecto puede tener además sus propios códigos especiales.

No importa qué tan claramente se redacte una pregunta, mientras las preguntas sigan siendo respondidas por personas con agencia propia seguirá existiendo la libre interpretación de las preguntas (y esperemos que así siga siendo), lo que hace que muchas veces el usuario responda con más de un factor en su respuesta. Por ejemplo, ante la pregunta "¿Qué es lo que te resulta más atractivo de este producto?", el encuestado puede responder: "Me gusta su presentación y la variedad que ofrece". Ideamos una lógica para captar ambas dimensiones, presentación y variedad, diferenciando entre top of mind o driver principal y secundarios.

---

## El flujo de imputación

Cuando el libro de códigos ya existe, entra como insumo de solo lectura. El objetivo es una única salida: la base codificada.

<svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;display:block;margin:1.5rem auto;font-family:monospace;">
  <defs><marker id="i2" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="currentColor" opacity="0.7"/></marker></defs>
  <rect x="30" y="60" width="120" height="44" rx="8" fill="none" stroke="currentColor" stroke-opacity="0.4" stroke-dasharray="4 3"/>
  <text x="90" y="80" text-anchor="middle" font-size="9.5" fill="currentColor" opacity="0.75" font-weight="bold">Libro de códigos</text>
  <text x="90" y="94" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.55">insumo (solo lectura)</text>
  <path d="M150,82 L196,82" fill="none" stroke="currentColor" stroke-opacity="0.4" stroke-dasharray="4 3" marker-end="url(#i2)"/>
  <rect x="200" y="6" width="200" height="38" rx="8" fill="currentColor" fill-opacity="0.06" stroke="currentColor" stroke-opacity="0.5"/>
  <text x="300" y="24" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="bold">Valores únicos + frecuencias</text>
  <text x="300" y="37" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.6">texto normalizado</text>
  <line x1="300" y1="44" x2="300" y2="56" stroke="currentColor" stroke-opacity="0.5" marker-end="url(#i2)"/>
  <rect x="200" y="58" width="200" height="40" rx="8" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.45" stroke-dasharray="4 3"/>
  <text x="300" y="76" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="bold">Pre-clasificar sin tokens</text>
  <text x="300" y="90" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.6">caché, especiales y vacíos</text>
  <line x1="300" y1="98" x2="300" y2="110" stroke="currentColor" stroke-opacity="0.5" marker-end="url(#i2)"/>
  <rect x="200" y="112" width="200" height="38" rx="8" fill="currentColor" fill-opacity="0.08" stroke="currentColor" stroke-opacity="0.6"/>
  <text x="300" y="130" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="bold">Clasificar el resto con el LLM</text>
  <text x="300" y="143" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.6">en lotes · tolerante a errores de tipeo</text>
  <line x1="300" y1="150" x2="300" y2="162" stroke="currentColor" stroke-opacity="0.5" marker-end="url(#i2)"/>
  <polygon points="300,164 370,194 300,224 230,194" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-opacity="0.55"/>
  <text x="300" y="198" text-anchor="middle" font-size="9.5" fill="currentColor" font-weight="bold">¿cayó en "otros"?</text>
  <path d="M370,194 L440,194 L440,131 L400,131" fill="none" stroke="currentColor" stroke-opacity="0.45" stroke-dasharray="4 3" marker-end="url(#i2)"/>
  <text x="386" y="186" font-size="8.5" fill="currentColor" opacity="0.8" font-weight="bold">sí</text>
  <text x="452" y="165" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.6">segunda pasada</text>
  <line x1="300" y1="224" x2="300" y2="238" stroke="currentColor" stroke-opacity="0.5" marker-end="url(#i2)"/>
  <text x="310" y="236" font-size="8.5" fill="currentColor" opacity="0.8" font-weight="bold">no</text>
  <rect x="200" y="240" width="200" height="30" rx="8" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.5"/>
  <text x="300" y="259" text-anchor="middle" font-size="10" fill="currentColor" font-weight="bold">Revisión del analista</text>
  <line x1="300" y1="270" x2="300" y2="282" stroke="currentColor" stroke-opacity="0.5" marker-end="url(#i2)"/>
  <rect x="205" y="284" width="190" height="24" rx="6" fill="currentColor" fill-opacity="0.14" stroke="currentColor" stroke-opacity="0.75" stroke-width="1.4"/>
  <text x="300" y="300" text-anchor="middle" font-size="10" fill="currentColor" font-weight="bold">▸ Base codificada</text>
</svg>

El sistema resuelve primero lo barato: los valores ya vistos salen de una caché y las respuestas especiales (vacíos, "no sé", "ninguno") se asignan por reglas de procesamiento de lenguaje natural, sin llamar a ningún LLM. Solo el resto va a un modelo, que clasifica en lotes con alta tolerancia a errores de tipeo. Lo que quedó en "otros" pasa por una segunda vuelta más exigente antes de la revisión humana.

Ese trabajo del modelo deja un residuo valioso. Cada vez que mapea una variación nueva ("cocca-cola" a Coca-Cola), la relación se guarda. En la corrida siguiente esas variaciones conocidas ya no necesitan al modelo: se resuelven en la pre-clasificación. Con el transcurrir de las iteraciones, el sistema depende cada vez menos del LLM.

---

## El flujo de codificación

Cuando no hay libro de códigos, el trabajo es más ambicioso y tiene dos salidas: la base codificada y un libro nuevo. Ese libro es lo que convierte la próxima ola en un problema de imputación.

<svg viewBox="0 0 600 350" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;display:block;margin:1.5rem auto;font-family:monospace;">
  <defs><marker id="i3" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="currentColor" opacity="0.7"/></marker></defs>
  <rect x="195" y="6" width="210" height="40" rx="8" fill="currentColor" fill-opacity="0.08" stroke="currentColor" stroke-opacity="0.6"/>
  <text x="300" y="24" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="bold">Paso 1 · Proponer categorías</text>
  <text x="300" y="38" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.6">frecuencias como señal · solo nombres</text>
  <line x1="300" y1="46" x2="300" y2="58" stroke="currentColor" stroke-opacity="0.5" marker-end="url(#i3)"/>
  <polygon points="300,60 368,88 300,116 232,88" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-opacity="0.55"/>
  <text x="300" y="92" text-anchor="middle" font-size="9" fill="currentColor" font-weight="bold">¿demasiadas?</text>
  <path d="M232,88 L150,88 L150,26 L195,26" fill="none" stroke="currentColor" stroke-opacity="0.45" stroke-dasharray="4 3" marker-end="url(#i3)"/>
  <text x="210" y="80" font-size="8.5" fill="currentColor" opacity="0.8" font-weight="bold">sí</text>
  <text x="138" y="57" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.6" transform="rotate(-90 138 57)">achicar la lista</text>
  <line x1="300" y1="116" x2="300" y2="128" stroke="currentColor" stroke-opacity="0.5" marker-end="url(#i3)"/>
  <text x="310" y="127" font-size="8.5" fill="currentColor" opacity="0.8" font-weight="bold">no</text>
  <rect x="195" y="130" width="210" height="34" rx="8" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.5"/>
  <text x="300" y="151" text-anchor="middle" font-size="10" fill="currentColor" font-weight="bold">El analista ajusta la lista</text>
  <line x1="300" y1="164" x2="300" y2="176" stroke="currentColor" stroke-opacity="0.5" marker-end="url(#i3)"/>
  <rect x="195" y="178" width="210" height="40" rx="8" fill="currentColor" fill-opacity="0.08" stroke="currentColor" stroke-opacity="0.6"/>
  <text x="300" y="196" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="bold">Paso 2 · Asignar respuestas</text>
  <text x="300" y="210" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.6">lista fija · no crea categorías nuevas</text>
  <line x1="300" y1="218" x2="300" y2="230" stroke="currentColor" stroke-opacity="0.5" marker-end="url(#i3)"/>
  <polygon points="300,232 368,260 300,288 232,260" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-opacity="0.55"/>
  <text x="300" y="256" text-anchor="middle" font-size="8.5" fill="currentColor" font-weight="bold">¿"otros" excede</text>
  <text x="300" y="268" text-anchor="middle" font-size="8.5" fill="currentColor" font-weight="bold">el umbral?</text>
  <path d="M368,260 L434,260 L434,198 L405,198" fill="none" stroke="currentColor" stroke-opacity="0.45" stroke-dasharray="4 3" marker-end="url(#i3)"/>
  <text x="378" y="252" font-size="8.5" fill="currentColor" opacity="0.8" font-weight="bold">sí</text>
  <text x="449" y="228" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.6" transform="rotate(90 449 228)">re-examinar</text>
  <line x1="300" y1="288" x2="300" y2="300" stroke="currentColor" stroke-opacity="0.5"/>
  <text x="310" y="299" font-size="8.5" fill="currentColor" opacity="0.8" font-weight="bold">no</text>
  <path d="M300,300 L150,300 L150,312" fill="none" stroke="currentColor" stroke-opacity="0.6" marker-end="url(#i3)"/>
  <rect x="62" y="314" width="176" height="24" rx="6" fill="currentColor" fill-opacity="0.14" stroke="currentColor" stroke-opacity="0.75" stroke-width="1.4"/>
  <text x="150" y="330" text-anchor="middle" font-size="9.5" fill="currentColor" font-weight="bold">▸ Base codificada</text>
  <path d="M300,300 L470,300 L470,312" fill="none" stroke="currentColor" stroke-opacity="0.6" marker-end="url(#i3)"/>
  <rect x="382" y="314" width="176" height="24" rx="6" fill="currentColor" fill-opacity="0.14" stroke="currentColor" stroke-opacity="0.85" stroke-width="1.4"/>
  <rect x="385" y="317" width="170" height="18" rx="4" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
  <text x="470" y="330" text-anchor="middle" font-size="9.5" fill="currentColor" font-weight="bold">▸ Libro de códigos nuevo</text>
  <path d="M558,326 C586,326 586,20 460,20 L405,20" fill="none" stroke="currentColor" stroke-opacity="0.5" stroke-dasharray="5 4" marker-end="url(#i3)"/>
  <text x="586" y="175" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.7" transform="rotate(90 586 175)">la próxima ola ya es imputación</text>
</svg>

La separación en dos pasos es deliberada. Hecho todo junto, el modelo tiende a crear demasiadas categorías específicas o a agrupar de forma inconsistente entre lotes. Al fijar primero la lista de categorías, la asignación posterior trabaja sobre un espacio de respuesta constante y produce clasificaciones coherentes. Entre un paso y otro, el analista corrige la lista: agrega, borra, renombra o fusiona categorías.

---

## Las frecuencias como señal de calidad

Un modelo, por sí solo, no siempre detecta bien qué merece categoría propia. Entre 500 respuestas distintas, la marca A puede aparecer cinco veces de 5 formas diferentes. Cada una parece un caso raro; juntas son una categoría relevante.

La solución fue pasar las frecuencias normalizadas junto con los valores. Antes de armar el pedido, se normaliza todo el texto (minúsculas, sin acentos, sin puntuación), se cuenta cuántas veces aparece cada término y los más frecuentes van al modelo. 

---

## La interactividad no es un defecto, es el producto

La automatización total nunca fue el objetivo. Logramos una herramienta eficaz y eficiente que facilita la actividad del analista mientras garantiza un agrupamiento de mayor calidad.

Antes de clasificar puede editar las categorías propuestas. Después de clasificar puede revisar cada categoría y mover los valores mal asignados. Antes de guardar ve la distribución completa con frecuencias y porcentajes. El modelo elimina el trabajo mecánico; el analista aporta el criterio.

Este proyecto refleja cómo se cruzan ciencia de datos, desarrollo de software e investigación de mercado para acortar la brecha entre la voz de los usuarios y los insights que necesitan las marcas. Si te enfrentaste al mismo desafío en procesamiento de texto, me interesa saber qué enfoques te funcionaron.
