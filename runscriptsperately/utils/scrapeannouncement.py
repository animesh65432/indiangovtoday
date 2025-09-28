from models.announcement import Announcement
import httpx
from urllib.parse import quote
from bs4 import BeautifulSoup
from config import config

API_KEY = config["SCRAPERAPI"]  

async def scrapeannouncement(BASE_URL: str) -> Announcement | None:
    try:
        print("call in", BASE_URL)

        url = quote(BASE_URL, safe='')

        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.get(
                f"https://api.scraperapi.com?api_key={API_KEY}&url={url}&render=true"
            )
            resp.raise_for_status()

        soup = BeautifulSoup(resp.text, "html.parser")
        print(soup)

        # Adjust class name if needed
        main_container = soup.find("div", class_="innner-page-main-about-us-content-right-part")
        if not main_container:
            return None

        paragraphs = main_container.find_all("p")
        content = " ".join(
            p.get_text(" ", strip=True) for p in paragraphs if p.get_text(strip=True)
        )

        return Announcement(content=content)

    except httpx.RequestError as e:
        print(f"Error fetching the webpage: {e}")
        return None
    except Exception as e:
        print(f"Scraping failed: {e}")
        return None