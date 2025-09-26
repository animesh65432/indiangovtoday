def GetPrompt(content: str, title: str, target_language: str) -> str:
    """
    Generate a prompt for translating content and title to Indian languages.
    
    Args:
        content (str): The content to be translated
        title (str): The title to be translated
        target_language (str): Target Indian language (e.g., 'Hindi', 'Bengali', 'Tamil')
    
    Returns:
        str: Formatted prompt for translation
    """
    
    prompt = f"""Translate the following English title and content to {target_language}.

Requirements:
- Use simple, easy words that common people understand
- Keep the meaning the same
- Make it sound natural
- IMPORTANT: Keep the entire translated content under 2500 characters
- If content is too long, summarize while keeping key information
- Use everyday language, not complex words

Title: {title}

Content: {content}

Target Language: {target_language}

Format your response as:
Title: [Translated title in {target_language}]
Content: [Translated content in {target_language} - under 2500 characters]

Please provide only the translated text in simple {target_language}."""

    return prompt