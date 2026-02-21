"""
Cliente OpenRouter — compatível com a interface da OpenAI SDK.

O OpenRouter oferece acesso unificado a múltiplos provedores de LLM
(OpenAI, Anthropic, Meta, etc.) através de uma API compatível com o
padrão da OpenAI. Isso significa que podemos usar o SDK oficial da
OpenAI apontando apenas para um base_url diferente.

Documentação OpenRouter: https://openrouter.ai/docs
"""

import os

from openai import OpenAI


def get_client() -> OpenAI:
    """
    Retorna um cliente OpenAI configurado para usar o OpenRouter.

    A variável OPENROUTER_API_KEY deve estar definida no ambiente.
    """
    return OpenAI(
        api_key=os.getenv("OPENROUTER_API_KEY"),
        base_url="https://openrouter.ai/api/v1",
    )
