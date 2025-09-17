from http.server import BaseHTTPRequestHandler
import asyncio
from scrape_press_releases import scrape_press_releases
from services.news import insert_announcements, clear_announcements
from config import config


async def update_announcements_everyday():
    announcements = scrape_press_releases(config["INDIAN_GOVERMENT_BASE_URL"])

    if not announcements or len(announcements) == 0:
        print("No announcements found to insert.")
        return {"status": "no announcements"}

    await clear_announcements()
    await insert_announcements(announcements)
    print(f"Inserted {len(announcements)} announcements.")
    return {"status": f"Inserted {len(announcements)} announcements"}


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        
        result = asyncio.run(update_announcements_everyday())

        self.send_response(200)
        self.end_headers()
        self.wfile.write(str(result).encode())

    