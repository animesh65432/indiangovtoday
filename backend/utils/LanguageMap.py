class LanguageMap:
    LANGUAGES = {
        "hi": "हिन्दी",
        "bn": "বাংলা",
        "ta": "தமிழ்",
        "te": "తెలుగు",
        "mr": "मराठी",
        "gu": "ગુજરાતી",
        "kn": "ಕನ್ನಡ",
        "ml": "മലയാളം",
        "pa": "ਪੰਜਾਬੀ",
        "or": "ଓଡ଼ିଆ",
        "ur": "اردو",
        "as": "অসমীয়া",
        "sa": "संस्कृतम्",
        "mai": "मैथिली",
        "sat": "संথाली",
        "ne": "नेपाली",
        "doi": "डोगरी",
        "brx": "बोडो",
        "mni": "मणিপুরী",
        "en": "English"
    }
    
    @classmethod
    def get_label(cls, code):
        """Get language label by code"""
        return cls.LANGUAGES.get(code)
    
    @classmethod
    def get_all_languages(cls):
        """Get all languages as list of dicts"""
        return [{"value": code, "label": label} for code, label in cls.LANGUAGES.items()]
    
    @classmethod
    def is_supported(cls, code):
        """Check if language code is supported"""
        return code in cls.LANGUAGES