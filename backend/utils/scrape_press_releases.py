import requests
from bs4 import BeautifulSoup
from .filteroutannoucment import filter_announcements

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Referer": "https://www.pib.gov.in/",
    "Connection": "keep-alive"
}

session = requests.Session()
session.headers.update(headers)

def scrape_press_releases(BASE_URL: str):
    if not BASE_URL or BASE_URL.strip() == "":
        return []

    try:
        resp = requests.get(BASE_URL, headers={"User-Agent": "Mozilla/5.0"})
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
                    if href.startswith("/"):
                        full_link = f"https://www.pib.gov.in{href}"
                    else:
                        full_link = href
                else:
                    full_link = None

                announcements.append({
                    "title": title.strip(),
                    "link": full_link
                })
                
        return  filter_announcements(announcements)
    except requests.RequestException as e:
        print(f"Error fetching the webpage: {e}")
        return None
    except Exception as e:
        print(f"Error parsing the webpage: {e}")
        return None
        
