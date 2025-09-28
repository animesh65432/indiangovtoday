import re

async def is_announcement(title: str) -> bool:
    """Check if a press release title appears to be an announcement."""
    title_lower = title.lower()

    high_confidence_patterns = [
        r'prime minister (greets|wishes|congratulates|shares|prays)',
        r'(greets|wishes) (everyone|people|citizens) on',
        r'on (occasion|eve) of (navratri|diwali|holi|eid|christmas)',
        r'(shares|posts) (soulful|beautiful|inspiring)',
        r'pays (tribute|homage) to',
        r'(celebrates|observes) (the )?(occasion|day|festival)',
        r'prays to (goddess|god)',
    ]

    for pattern in high_confidence_patterns:
        if re.search(pattern, title, flags=re.IGNORECASE):
            return True

    medium_confidence_keywords = ['interacts with', 'hosts', 'inaugurates', 'visits']
    substantive_indicators = [
        'policy', 'reform', 'operation', 'strategy', 'agreement', 'mou',
        'bilateral', 'cooperation', 'security', 'defense', 'defence',
        'economic', 'trade', 'investment', 'development', 'infrastructure',
        'highlights', 'discusses', 'announces', 'launches'
    ]

    for keyword in medium_confidence_keywords:
        if keyword in title_lower:
            has_substantive = any(indicator in title_lower for indicator in substantive_indicators)
            if not has_substantive:
                return True

    religious_keywords = [
        'navratri', 'diwali', 'holi', 'eid', 'christmas',
        'festival', 'goddess', 'god', 'prayer', 'blessing'
    ]
    if any(word in title_lower for word in religious_keywords):
        return True

    social_media_patterns = [
        r'shares.*on.*social media', r'tweets.*about', r'posts.*video'
    ]
    for pattern in social_media_patterns:
        if re.search(pattern, title, flags=re.IGNORECASE):
            return True

    return False


async def filter_announcements(press_releases, filter_type="exclude"):
    """Filter press releases asynchronously."""
    results = []
    for pr in press_releases:
        check = await is_announcement(pr['title'])
        if filter_type == "exclude" and not check:
            results.append(pr)
        elif filter_type == "include" and check:
            results.append(pr)
    return results



