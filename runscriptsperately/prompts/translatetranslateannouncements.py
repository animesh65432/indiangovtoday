from typing import List, TypedDict

class Announcement(TypedDict):
    title: str
    link: str

def GetPrompt(announcements: List[Announcement], target_language: str) -> str:
    """
    Translates and simplifies government announcement titles only
    
    Args:
        announcements: List of announcement dictionaries with title, id, and content
        target_language: Target Indian language (e.g., 'Hindi', 'Bengali', 'Tamil')
    
    Returns:
        Prompt for translating and simplifying titles only
    """
    
   
    formatted_announcements = []
    for announcement in announcements:
        formatted_text = f"Title: {announcement['title']}\nID: {announcement['link']}"
        formatted_announcements.append(formatted_text)
    
    announcements_text = "\n---\n".join(formatted_announcements)
    
    prompt = f"""Translate government announcement titles to {target_language} using simple words.

Rules:
- Use simple words that anyone can understand
- Keep ID exactly the same
- Make title short and clear
- Use everyday language

Format:
title: [Simple translated title]
link: [paste the user link]

Announcements:
{announcements_text}

Target Language: {target_language}

Translate titles only, keep IDs same."""

    return prompt