from models.announcement import Announcement
import requests
from bs4 import BeautifulSoup

def scrapeannouncement(BASE_URL: str) -> Announcement | None:
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                          "AppleWebKit/537.36 (KHTML, like Gecko) "
                          "Chrome/117.0 Safari/537.36"
        }
        resp = requests.get(BASE_URL, headers=headers)
        resp.raise_for_status()

        soup = BeautifulSoup(resp.text, "html.parser")

        main_container = soup.find("div", class_="innner-page-main-about-us-content-right-part")
        if not main_container:
            return None

        title_tag = main_container.find("h2", id="Titleh2")
        title = title_tag.get_text(strip=True) if title_tag else None

        paragraphs = main_container.find_all("p")
        content = " ".join(p.get_text(" ", strip=True) for p in paragraphs if p.get_text(strip=True))

        return Announcement(title=title,content=content)

    except Exception as e:
        print(f"Scraping failed: {e}")
        return None
