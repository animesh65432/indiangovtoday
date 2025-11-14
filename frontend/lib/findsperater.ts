export function findsperater(lan: string) {
    if (lan === "English") return ".";
    const indicLanguages = [
        "हिन्दी",
        "বাংলা",
        "தமிழ்",
        "తెలుగు",
        "मराठी",
        "ગુજરાતી",
        "ಕನ್ನಡ",
        "മലയാളം",
        "اردو"
    ];

    if (indicLanguages.includes(lan)) {
        return "।";
    }

    return ".";
}
