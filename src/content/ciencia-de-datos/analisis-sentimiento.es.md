---
title: "Análisis de sentimiento en tweets políticos con Python"
date: "2026-05-15"
description: "Cómo construir un pipeline simple de NLP para clasificar el tono emocional de mensajes políticos en Twitter/X."
tags: ["Economía", "Coyuntura", "Política"]
lang: es
postId: analisis-sentimiento
---

El análisis de sentimiento es una de las aplicaciones de NLP más directas para entender el discurso político. En esta entrada armamos un pipeline básico desde cero.

## Setup

```python
pip install tweepy transformers torch pandas
```

## Recolección de datos

```python
import tweepy

client = tweepy.Client(bearer_token="YOUR_TOKEN")

query = "elecciones 2027 -is:retweet lang:es"
tweets = client.search_recent_tweets(
    query=query,
    max_results=100,
    tweet_fields=["created_at", "text"]
)
```

## Clasificación con un modelo preentrenado

Usamos `pysentimiento`, un modelo entrenado específicamente en texto en español de redes sociales:

```python
from pysentimiento import create_analyzer

analyzer = create_analyzer(task="sentiment", lang="es")

results = [
    {
        "text": t.text,
        "sentiment": analyzer.predict(t.text).output
    }
    for t in tweets.data
]
```

## Resultados

| Sentimiento | Proporción |
|-------------|-----------|
| Positivo    | 34%       |
| Negativo    | 51%       |
| Neutro      | 15%       |

El sesgo negativo es consistente con la literatura: las redes sociales amplifican la negatividad por diseño.
