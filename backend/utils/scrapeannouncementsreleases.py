import requests
from bs4 import BeautifulSoup
from .filteroutannoucment import filter_announcements
from config import config

API_KEY = config["SCRAPERAPI"] 

def scrape_announcements(BASE_URL: str):
    if not BASE_URL or BASE_URL.strip() == "":
        return []

    try:
       
        resp = requests.get(
            f"https://api.scraperapi.com?api_key={API_KEY}&url={BASE_URL}&render=true",
            timeout=30
        )
        resp.raise_for_status() 

        soup = BeautifulSoup(resp.text, "html.parser")

        announcements = []
        release_lists = soup.find_all("ul", class_="num")

        for release_list in release_lists:
            for li in release_list.find_all("li"):
                link_elem = li.find("a")
                if not link_elem:
                    continue

                title = link_elem.get("title") or link_elem.get_text(strip=True)
                href = link_elem.get("href")
                full_link = href

                announcements.append({
                    "title": title.strip(),
                    "link": full_link
                })

        return filter_announcements(announcements)

    except requests.RequestException as e:
        print(f"Error fetching the webpage: {e}")
