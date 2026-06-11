---
title: "Codificando respuestas abiertas con procesamiento de lenguaje natural y modelos de lenguaje"
date: "2025-06-18"
description: ""
tags: ["python", "nlp", "ia"]
lang: "es"
postId: "codificador-preguntas-abiertas"
cover: "/img/cover-codificador.svg"
draft: false
---

<div style="margin-bottom:2.5rem;border-radius:12px;overflow:hidden;background:#0c0f0c;">
  <img src="/img/banner-codificador.svg" alt="Codificador de preguntas abiertas" style="width:100%;display:block;height:auto;" />
</div>

En investigación cuantitativa todos odiamos las preguntas abiertas. Sin embargo de todos los usarios que intervienen en el proceso de una encuesta, el que mas las odia es probablemente el encargado de codificar las respuestas.

Para convertirlas en datos, existe un proceso que se llama **codificación**: alguien lee todas las respuestas, agrupa las que dicen lo mismo, asigna un número a cada grupo, y reemplaza el texto por ese número en la base de datos. "Hellmanns", "Jelman" y "hellmans" se agrupan bajo un mismo codigo, que corresponde a Hellmann's.

Es un trabajo tedioso, repetitivo y propenso a errores de consistencia. Y cuando se trata de miles de respuestas a múltiples preguntas para varios proyectos corriendo en paralelo, es también caro e ineficiente. Decidí automatizarlo.

---

## El problema en toda su complejidad

 Hay dos situaciones fundamentalmente distintas ante cualquier pregunta abierta:

**Cuando ya existe un libro de códigos.** En estudios longitudinales, paneles o proyectos con múltiples olas, alguien ya definió las categorías en una medición anterior. Hay un archivo —el libro de códigos— con una lista de claves numéricas y los valores canónicos que les corresponden. La tarea aquí es *imputar*: tomar cada respuesta nueva y mapearla a la clave correcta. El desafío principal es la variabilidad ortográfica. "Cocca-cola", "coca cola", "CocaCola" y "la negra" corresponden todas a una misma clave.

**Cuando no existe ningún libro de códigos.** En estudios nuevos o preguntas que nunca se habían hecho, hay que *Codificar* las categorías desde cero. El analista no sabe de antemano qué va a encontrar. Primero hay que descubrir qué categorías emergen de los datos, luego asignar cada respuesta a alguna, y finalmente generar un Libro de codigos escalable (En casso de que se repita el estudio).

Ambos flujos comparten infraestructura pero tienen lógicas completamente distintas.

---

## Un problema que nadie menciona: la respuesta multi-valor

Hay un tercer que aparece todo el tiempo.

Imaginá una pregunta: *"¿Qué cualidades debería tener un buen jugador de fútbol?"*. Un encuestado responde: *"Velocidad, técnica y garra"*. Otro: *"La actitud y el compromiso con el equipo"*.

El primero mencionó tres cosas. El segundo mencionó dos. Pero en el archivo de datos, ambas ocupan una sola celda. Si codificamos esa celda como una unidad, perdemos menciones. En un estudio de imagen de marca o de atributos de producto, esas menciones perdidas pueden cambiar los resultados.

La solución que desarrollé es la **expansión ad-hoc**: detectar cuándo una respuesta contiene múltiples menciones reales, dividirlas, y distribuirlas en columnas adicionales. La columna original (`P23`) se queda con la primera mención (top of mind), y se crean columnas nuevas (`P23adhoc2`, `P23adhoc3`, etc.) para las siguientes. La detección no puede ser solo por regex —una coma puede separar menciones o puede ser parte de una frase narrativa— por eso la decisión final la toma un Modelo de lenguaje entreado para estas situaciones.

---

## La arquitectura

<svg viewBox="0 0 600 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;display:block;margin:1.5rem auto;">
  <rect width="600" height="120" fill="none"/>
  <!-- main box -->
  <rect x="150" y="4" width="300" height="38" rx="5" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.5"/>
  <text x="300" y="18" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor" opacity="0.9" font-weight="bold">main.py</text>
  <text x="300" y="32" text-anchor="middle" font-family="monospace" font-size="9" fill="currentColor" opacity="0.55">Seleccionar proyecto → Cargar → Menú preguntas</text>
  <!-- flechas hacia abajo -->
  <line x1="220" y1="42" x2="160" y2="68" stroke="currentColor" stroke-width="1" opacity="0.4"/>
  <line x1="380" y1="42" x2="440" y2="68" stroke="currentColor" stroke-width="1" opacity="0.4"/>
  <!-- imputation box -->
  <rect x="60" y="68" width="200" height="34" rx="5" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.4"/>
  <text x="160" y="82" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor" opacity="0.8" font-weight="bold">IMPUTACIÓN</text>
  <text x="160" y="95" text-anchor="middle" font-family="monospace" font-size="8.5" fill="currentColor" opacity="0.5">LDC existe → asignar claves</text>
  <!-- codification box -->
  <rect x="340" y="68" width="200" height="34" rx="5" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.4"/>
  <text x="440" y="82" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor" opacity="0.8" font-weight="bold">CODIFICACIÓN</text>
  <text x="440" y="95" text-anchor="middle" font-family="monospace" font-size="8.5" fill="currentColor" opacity="0.5">Sin LDC → crear categorías</text>
</svg>

---

## Multi-proyecto y configuración por proyecto

La herramienta no fue diseñada para un único estudio. El menú inicial lista todos los proyectos disponibles en una carpeta central. Cada proyecto tiene su propia estructura:

```
proyectos/
  PROYECTO_A/
    data/          ← archivos Excel de entrada
    LDC/           ← libro(s) de códigos
    REFUERZOS/     ← variaciones aprendidas
    outputs/       ← resultados + checkpoints
  PROYECTO_B/
    subproyecto_a/           
    subproyecto_b/            
```

Los subproyectos se detectan automáticamente. Si los archivos siguen el patrón `PROYECTO1.xlsx`, `PROYECTO2.xlsx`, también pregunta el número de ola. Cada proyecto puede tener sus propios códigos especiales.

---

## El flujo de imputación

<svg viewBox="0 0 520 340" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:520px;display:block;margin:1.5rem auto;font-family:monospace;">
  <rect width="520" height="340" fill="none"/>

  <!-- Nodo 1 -->
  <rect x="60" y="4" width="400" height="44" rx="5" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.5"/>
  <text x="260" y="22" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.85" font-weight="bold">Detección automática de especiales</text>
  <text x="260" y="38" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.55">"no sé", "ninguno", vacíos → se asignan sin LLM</text>
  <line x1="260" y1="48" x2="260" y2="68" stroke="currentColor" stroke-width="1" opacity="0.4"/>
  <polygon points="255,66 265,66 260,74" fill="currentColor" opacity="0.4"/>

  <!-- Nodo 2 -->
  <rect x="60" y="74" width="400" height="44" rx="5" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.5"/>
  <text x="260" y="92" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.85" font-weight="bold">Clasificación LLM en batches de 50</text>
  <text x="260" y="108" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.55">Prompt con LDC completo + refuerzos + ejemplos fonéticos</text>
  <line x1="260" y1="118" x2="260" y2="138" stroke="currentColor" stroke-width="1" opacity="0.4"/>
  <polygon points="255,136 265,136 260,144" fill="currentColor" opacity="0.4"/>

  <!-- Rombo decisión -->
  <polygon points="260,144 340,168 260,192 180,168" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.45"/>
  <text x="260" y="164" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.8">¿Quedó</text>
  <text x="260" y="177" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.8">en OTRO?</text>
  <!-- SÍ -->
  <line x1="260" y1="192" x2="260" y2="212" stroke="currentColor" stroke-width="1" opacity="0.35" stroke-dasharray="4 3"/>
  <text x="268" y="206" font-size="8" fill="currentColor" opacity="0.5">SÍ</text>
  <polygon points="255,210 265,210 260,218" fill="currentColor" opacity="0.35"/>

  <!-- Nodo 3 -->
  <rect x="60" y="218" width="400" height="44" rx="5" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.45"/>
  <text x="260" y="236" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.85" font-weight="bold">Segunda pasada (batches de 20)</text>
  <text x="260" y="252" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.55">Re-clasifica con ejemplos reales de cada categoría</text>
  <line x1="260" y1="262" x2="260" y2="282" stroke="currentColor" stroke-width="1" opacity="0.4"/>
  <polygon points="255,280 265,280 260,288" fill="currentColor" opacity="0.4"/>

  <!-- Nodo 4 -->
  <rect x="60" y="288" width="400" height="44" rx="5" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.45"/>
  <text x="260" y="306" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.85" font-weight="bold">Revisión interactiva + guardar</text>
  <text x="260" y="322" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.55">Analista aprueba, edita o mueve · acumula refuerzos</text>
</svg>

Los **refuerzos** son el mecanismo de aprendizaje incremental. Cada vez que el LLM mapea una variación nueva ("cocca-cola" → Coca-Cola), esa relación se guarda en un JSON. La próxima vez, esas variaciones conocidas se inyectan en el prompt. Con el tiempo, el sistema necesita cada vez menos llamadas a la API.

---

## El flujo de codificación (sin LDC)

<svg viewBox="0 0 520 380" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:520px;display:block;margin:1.5rem auto;font-family:monospace;">
  <rect width="520" height="380" fill="none"/>

  <!-- Nodo 1 -->
  <rect x="60" y="4" width="400" height="56" rx="5" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.5"/>
  <text x="260" y="22" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.85" font-weight="bold">FASE 1A — Definir categorías</text>
  <text x="260" y="37" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.55">LLM ve todos los valores únicos + frecuencias</text>
  <text x="260" y="51" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.55">→ propone 10-25 nombres (sin asignar nada aún)</text>
  <line x1="260" y1="60" x2="260" y2="80" stroke="currentColor" stroke-width="1" opacity="0.4"/>
  <polygon points="255,78 265,78 260,86" fill="currentColor" opacity="0.4"/>

  <!-- Nodo 2 edición -->
  <rect x="60" y="86" width="400" height="44" rx="5" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.45"/>
  <text x="260" y="104" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.85" font-weight="bold">Edición interactiva de categorías</text>
  <text x="260" y="120" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.55">Analista agrega, elimina, renombra o fusiona</text>
  <line x1="260" y1="130" x2="260" y2="150" stroke="currentColor" stroke-width="1" opacity="0.4"/>
  <polygon points="255,148 265,148 260,156" fill="currentColor" opacity="0.4"/>

  <!-- Nodo 3 -->
  <rect x="60" y="156" width="400" height="56" rx="5" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.5"/>
  <text x="260" y="174" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.85" font-weight="bold">FASE 2 — Clasificar valores (batches de 50)</text>
  <text x="260" y="189" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.55">El LLM no puede inventar categorías nuevas</text>
  <text x="260" y="203" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.55">Solo asigna a las ya definidas</text>
  <line x1="260" y1="212" x2="260" y2="232" stroke="currentColor" stroke-width="1" opacity="0.4"/>
  <polygon points="255,230 265,230 260,238" fill="currentColor" opacity="0.4"/>

  <!-- Rombo -->
  <polygon points="260,238 340,262 260,286 180,262" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.45"/>
  <text x="260" y="258" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.8">¿Muchos en</text>
  <text x="260" y="271" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.8">OTRO? (10+)</text>
  <line x1="260" y1="286" x2="260" y2="306" stroke="currentColor" stroke-width="1" opacity="0.35" stroke-dasharray="4 3"/>
  <text x="268" y="300" font-size="8" fill="currentColor" opacity="0.5">SÍ</text>
  <polygon points="255,304 265,304 260,312" fill="currentColor" opacity="0.35"/>

  <!-- Nodo 4 -->
  <rect x="60" y="312" width="400" height="56" rx="5" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.45"/>
  <text x="260" y="330" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.85" font-weight="bold">Revisión final + guardar LDC Excel</text>
  <text x="260" y="346" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.55">Distribución con frecuencias y % por categoría</text>
  <text x="260" y="360" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.55">LDC reutilizable para próximas olas</text>
</svg>

La separación en dos fases —primero definir qué categorías crear, después asignar— es deliberada. Si se hace en un solo paso, el LLM tiende a crear demasiadas categorías específicas o a agrupar de forma inconsistente entre batches. Al fijar primero la lista, el segundo paso tiene un espacio de respuesta constante y produce clasificaciones coherentes.

---

## Las frecuencias como señal de calidad

El LLM solo no siempre detecta bien qué merece categoría propia. Si hay 500 respuestas distintas, "ICBC" puede aparecer 5 veces con 5 grafías diferentes. Cada una parece un caso raro; juntas son una categoría relevante.

La solución fue pasarle las frecuencias normalizadas junto con los valores. Antes de armar el prompt, normalizo todos los textos (minúsculas, sin acentos, sin puntuación), cuento cuántas veces aparece cada término normalizado, y los más frecuentes van explícitamente al LLM. Esto también ayuda en la revisión interactiva, donde el analista ve el número de ocurrencias y el porcentaje que representa cada categoría. Saber que "OTRO" tiene el 23% de las respuestas es una señal para revisarlo con cuidado.

---

## Resiliencia: checkpoints

Procesar mil respuestas implica docenas de llamadas a la API. Si la conexión falla a mitad, no querés empezar desde cero. Después de procesar cada pregunta, el estado completo del DataFrame se guarda en un archivo Parquet junto con un JSON de caché de los valores ya clasificados. Al iniciar, la herramienta busca checkpoints existentes y pregunta si continuar desde donde quedó.

---

## La interactividad no es un defecto, es el producto

Una decisión de diseño que fui entendiendo con el tiempo: la automatización total no es el objetivo. El objetivo es que el analista confíe en el resultado para defenderlo ante el cliente.

Antes de clasificar, el analista puede editar las categorías propuestas. Después de clasificar, puede revisar cada categoría y mover los valores mal asignados. Antes de guardar, ve una distribución completa con frecuencias y porcentajes.

Lo que el LLM hace es eliminar el trabajo mecánico. Lo que el analista hace es tomar las decisiones que requieren criterio de dominio: si "Light" y "Light & Fit" deben ser la misma categoría o categorías separadas, qué hacer con las respuestas que critican el estudio en vez de responder la pregunta.

---

## Resultado en producción

Una base con 1.500 respuestas a 4 preguntas abiertas que antes tomaba entre 4 y 6 horas de trabajo manual ahora toma entre 25 y 45 minutos: 15-25 de procesamiento automático y 10-20 de revisión interactiva. La detección de variantes ortográficas es más robusta que la humana en casos de errores de tipeo poco obvios, y no hay deriva de consistencia a lo largo de sesiones largas.
