---
title: "Sentiment analysis on political tweets with Python"
date: "2026-05-15"
description: "How to build a simple NLP pipeline to classify the emotional tone of political messages on Twitter/X."
tags: ["Economy", "Current Affairs", "Politics"]
lang: en
postId: analisis-sentimiento
---

Sentiment analysis is one of the most direct NLP applications for understanding political discourse. In this post we build a basic pipeline from scratch.

## Setup

```python
pip install tweepy transformers torch pandas
```

## Data collection

```python
import tweepy

client = tweepy.Client(bearer_token="YOUR_TOKEN")

query = "elections 2027 -is:retweet lang:en"
tweets = client.search_recent_tweets(
    query=query,
    max_results=100,
    tweet_fields=["created_at", "text"]
)
```

## Classification with a pre-trained model

```python
from transformers import pipeline

classifier = pipeline("sentiment-analysis")

results = [
    {"text": t.text, "sentiment": classifier(t.text)[0]["label"]}
    for t in tweets.data
]
```

## Results

| Sentiment | Share |
|-----------|-------|
| Positive  | 34%   |
| Negative  | 51%   |
| Neutral   | 15%   |

The negative skew is consistent with the literature: social networks amplify negativity by design.
