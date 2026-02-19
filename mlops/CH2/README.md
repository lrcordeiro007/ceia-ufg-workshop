# CH2 - Qdrant (Vector DB) & LLMs Locais

Bem-vindo ao **Capítulo 2** do Workshop MLOps!

O foco deste capítulo é **Infraestrutura para IA Generativa**. Vamos sair das APIs prontas (OpenAI) e aprender a rodar nossa própria stack de inteligência.

## 🎯 Objetivos de Aprendizado

1. **Qdrant**: Entender o que é um Banco Vetorial, para que serve e como integrá-lo em uma aplicação Python.
2. **LLMs Locais**: Aprender a servir modelos Open Source (Llama, Qwen, Mistral) usando Docker, sem depender de nuvem.

## 📂 O Laboratório: `practice/`

Para demonstrar essas tecnologias, criamos uma aplicação prática (um Chatbot Médico com RAG) que usa o **Qdrant** como memória e um **LLM Local** como cérebro.

👉 **[ACESSAR O GUIA DA PRÁTICA](./practice/README.md)**

---

## 🛠️ Stack Tecnológica

* **Qdrant**: Escolhido por ser open-source, muito rápido e fácil de subir com Docker.
* **vLLM / Llama.cpp**: Padrões da indústria para servir modelos LLM com alta performance.
* **Docker Compose**: Para subir toda essa infraestrutura complexa com um único comando.

## 🚦 Quick Start

```bash
cd practice
docker compose up --build
```

Acesse: **<http://localhost>**

---

> Dúvidas? Consulte o [README detalhado da prática](./practice/README.md).
