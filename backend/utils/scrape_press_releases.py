import requests
from bs4 import BeautifulSoup

def scrape_press_releases(BASE_URL: str):
    if not BASE_URL or BASE_URL.strip() == "":
        return []

    resp = requests.get(BASE_URL, headers={"User-Agent": "Mozilla/5.0"})
    resp.raise_for_status()

    soup = BeautifulSoup(resp.text, "html.parser")

    release_list = soup.select("#content-column a.ext-link")

    results = []
    for a in release_list:
        title = a.text.strip()
        link = a.get("href")

        if link:
            results.append({
                "title": title,
                "source": link.strip()
            })

    return results