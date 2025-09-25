from models.announcement import Announcement
import requests
from bs4 import BeautifulSoup
from config import config

API_KEY = config["SCRAPERAPI"]  

def scrapeannouncement(BASE_URL: str) -> Announcement | None:
    try:
        print("call in",BASE_URL)

        resp = requests.get(
            f"https://api.scraperapi.com?api_key={API_KEY}&url={BASE_URL}&render=true",
            timeout=30
        )
        resp.raise_for_status() 

        soup = BeautifulSoup(resp.text, "html.parser")

        print(soup)

     
        main_container = soup.find("div", class_="innner-page-main-about-us-content-right-part")
        if not main_container:
            return None

       
        title_tag = main_container.find("h2", id="Titleh2")
        title = title_tag.get_text(strip=True) if title_tag else None

       
        paragraphs = main_container.find_all("p")
        content = " ".join(p.get_text(" ", strip=True) for p in paragraphs if p.get_text(strip=True))

        return Announcement(title=title, content=content)

    except requests.RequestException as e:
        print(f"Error fetching the webpage: {e}")
        return None
    except Exception as e:
        print(f"Scraping failed: {e}")
        return None
