import httpx
from bs4 import BeautifulSoup
from utils.filteroutannoucment import filter_announcements
from config import config
from urllib.parse import urljoin, quote

API_KEY = config["SCRAPERAPI"]

async def scrape_announcements(BASE_URL: str):
    if not BASE_URL or BASE_URL.strip() == "":
        return []

    url = quote(BASE_URL, safe='')

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.get(
                f"https://api.scraperapi.com?api_key={API_KEY}&url={url}&render=true"
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
                if href:
                    href = urljoin(BASE_URL, href)

                announcements.append({
                    "title": title.strip(),
                    "link": href
                })

        return filter_announcements(announcements)

    except httpx.RequestError as e:
        print(f"Error fetching the webpage: {e}")
        return []
