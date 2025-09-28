def GetPrompt(content: str, target_language: str) -> str:
    """
    Generate a prompt for translating content to Indian languages.
    
    Args:
        content (str): The content to be translated
        target_language (str): Target Indian language (e.g., 'Hindi', 'Bengali', 'Tamil')
    
    Returns:
        str: Formatted prompt for translation
    """
    
    prompt = f"""Translate the following English text to {target_language}.

Requirements:
- Use simple, easy words
- Keep the meaning the same
- Make it sound natural
- Keep response under 2500 characters
- Use language that common people understand

Text to translate:
{content}

Target Language: {target_language}

Please provide only the translated text in simple {target_language}."""

    return prompt