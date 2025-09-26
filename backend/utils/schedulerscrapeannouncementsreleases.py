from .scrapeannouncementsreleases import scrape_announcements
from .scrapeannouncement import scrapeannouncement
from database import announcements
from config import config
from .translateannouncements import translate_announcements
from .simplefyannouncement import simplefyannouncement
import asyncio

from models.announcement import Announcement

async def insert_announcement(title: str, link: str):
    check = await announcements.find_one({"title": title})
    if check:
        return

    try:
      
        announcement_data = await asyncio.to_thread(scrapeannouncement, link)

        if not announcement_data or not announcement_data.content:
            return

      
        announcement_obj = Announcement(content=announcement_data.content)

      
        translated_list = await simplefyannouncement(announcement_obj, "English")
        translated_content = translated_list[0]["content"] if translated_list else ""

        await announcements.insert_one({
            "title": title,
            "source": f"https://www.pib.gov.in/{link}",
            "content": translated_content,
            "language": "English"
        })

        print(f"Saved successfully: {title}")
    except Exception as e:
        print(f"Error inserting announcement '{title}': {e}")

async def scrape_and_store_announcements():
    try:
        indian_announcements = scrape_announcements(config["INDIAN_GOVERMENT_BASE_URL"])

        if not indian_announcements:
            print("No announcements found")
            return

     
        indian_announcements = await translate_announcements(indian_announcements, "English")

        for ann in indian_announcements:
            await insert_announcement(ann["title"], ann["link"])

        print(f"Processed {len(indian_announcements)} announcements")

    except Exception as e:
        print(f"Error in scrape_and_store_announcements: {e}")
