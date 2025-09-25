from typing import List, TypedDict

class Announcement(TypedDict):
    title: str
    link: str


def GetPrompt(announcements: List[Announcement], target_language: str) -> str:
    """
    Translates government announcement titles to specified Indian language
    
    Args:
        announcements: List of announcement dictionaries with title and link
        target_language: Target Indian language (default: Hindi)
    
    Returns:
        Translated titles as formatted string
    """
    
    titles_and_links = [f"{i+1}. {announcement['title']} | {announcement['link']}"
                        for i, announcement in enumerate(announcements)]
    content_text = "\n".join(titles_and_links)
    
    prompt = f"""You are a professional translator specializing in Indian government communications. Please translate the following English titles of official government press releases into {target_language}.

**Translation Guidelines:**
- **SIMPLIFY THE TITLES**: Make the language simple enough that a 5-year-old child can understand the basic meaning
- Use simple, everyday words instead of complex technical jargon
- Break down complex concepts into easy-to-understand terms
- Maintain formal, official tone appropriate for government communications while keeping it accessible
- Preserve proper nouns (names of people, places, organizations)
- Translate technical terms accurately but use simpler alternatives when possible
- Use appropriate honorifics and formal language conventions of {target_language}
- Keep acronyms like GST, TRAI, NHRC in English if commonly used, but provide simple translation in parentheses
- For currency amounts (like Rs 5,100 crore), keep the numerical format but translate currency terms simply
- Make the content understandable to common people, not just government officials
- Focus on the main action or benefit that affects regular citizens
-don't use 1,2,3 likes that

**Titles to translate:**
{content_text}

**Output Format:**
Provide only the translated titles in the same numbered format with their original links preserved. Translate ONLY the title part, keep the link exactly as provided. Each entry should be on a separate line with its corresponding number.

Format: [Translated Title] | [Original Link]

**Target Language:** {target_language}
**Required Script:** Please use the appropriate script for {target_language} (e.g., Devanagari for Hindi, Bengali script for Bengali, etc.)

**Remember:** The goal is to make government announcements accessible to all citizens, including those with limited education. Use simple, clear language that explains what the government is doing in terms everyone can understand.

Begin translation:

"""
    
    return prompt