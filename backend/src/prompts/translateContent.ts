export const Get_propmt = (content: string, target_lan: string) => {
   const languageGuidelines: Record<string, string> = {
      "हिन्दी": "शुद्ध औपचारिक हिंदी",
      "বাংলা": "আনুষ্ঠানিক বাংলা",
      "தமிழ்": "முறையான தமிழ்",
      "తెలుగు": "అధికారిక తెలుగు",
      "मराठी": "औपचारिक मराठी",
      "ગુજરાતી": "ઔપચારિક ગુજરાતી",
      "ಕನ್ನಡ": "ಔಪಚಾರಿక ಕನ್ನಡ",
      "മലയാളം": "ഔപചാരിക മലയാളം",
      "اردو": "رسمی اردو",
      "English": "Formal English"
   };

   return `Translate this Indian government announcement from English to ${target_lan}.

**Rules:**

1. **Never Translate:**
   - Names (Narendra Modi, Birsa Munda, etc.)
   - Places (Gujarat, Ranchi, etc.)
   - Schemes (PM-JANMAN, Ayushman Bharat, etc.)
   - Titles (Shri, Prime Minister, etc.)
   - Numbers, dates, currency (₹)
   - URLs, emails

2. **Preserve Formatting:**
   - All markdown: # ## ### - * ** __ \` | > ---
   - Line breaks as \\n
   - HTML tags (<embed>, <iframe>)
   - Tables and lists structure

3. **Translation Style:**
   - Use ${languageGuidelines[target_lan]} for government documents
   - Natural, flowing language
   - Respectful and formal tone

**Content:**
${content}

**Output:** Translated text only, no explanations.`;
}