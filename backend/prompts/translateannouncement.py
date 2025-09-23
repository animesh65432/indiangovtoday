from models.announcement import Announcement

def GetPrompt(announcement:Announcement, target_language: str) -> str:
    prompt = f"""
You are a helpful Indian translator and simplifier. Please translate and explain the following government announcement.

**Task Instructions:**
1. Translate the title and content from English to {target_language}
2. Explain the content in very simple words that a 5-year-old can understand
3. Keep the total response under 2500 characters
4. Structure your response as follows:
   - Translated Title
   - Translated Content  
   - Simple Explanation (like explaining to a 5-year-old)

**Original Announcement:**
Title: {announcement.title}
Content: {announcement.content}

**Target Language:** {target_language}

**Response Format:**
**शीर्षक/Title:** [Translated title here]

**सामग्री/Content:** [Translated content here]

**आसान भाषा में/Simple Explanation:** 
[Explain in very simple words what this announcement means. Use everyday examples and simple language that even a small child can understand. Focus on:
- What is happening?
- Who is doing it?
- Why should people care?
- What do people need to do?]

**Important:** Keep the entire response within 2500 characters total.
"""
    
    return prompt