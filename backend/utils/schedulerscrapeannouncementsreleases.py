from .scrapeannouncementsreleases import scrape_announcements
from .scrapeannouncement import scrapeannouncement
from database import get_database
from config import config
from .translateannouncements import translate_announcements
from .simplefyannouncement import simplefyannouncement

from models.announcement import Announcement

async def insert_announcement(title: str, link: str,orginaltitle:str):
    try:
        announcement_data = await scrapeannouncement(link)

        if not announcement_data or not announcement_data.content:
            return
        
        db = await get_database()
        
        announcements = db["announcements"]

        announcement_obj = Announcement(content=announcement_data.content)

      
        translated_list = await simplefyannouncement(announcement_obj, "English")
        translated_content = translated_list[0]["content"] if translated_list else ""

        await announcements.insert_one({
            "title": title,
            "source": f"{link}",
            "content": translated_content,
            "language": "English",
            "original_title":orginaltitle
        })

        print(f"Saved successfully: {title}")
    except Exception as e:
        print(f"Error inserting announcement '{title}': {e}")

async def announcement_exists(title: str) -> bool:
    db = await get_database()
    announcements = db["announcements"]
    check = await announcements.find_one({"orginal_title": title})
    return check is not None


async def scrape_and_store_announcements():
    try:
        indian_announcements = await scrape_announcements(config["INDIAN_GOVERMENT_BASE_URL"])

        if not indian_announcements:
            print("No announcements found")
            return


        
        filter_indian_announcements = []
        for ann in indian_announcements:
            if not await announcement_exists(ann["title"]):
                filter_indian_announcements.append(ann)

        if len(filter_indian_announcements) == 0 :
            print("nothing new")
            return
      
        update_indian_announcements = await translate_announcements(
            filter_indian_announcements, "English"
        )

     
        for ann in update_indian_announcements:
            await insert_announcement(
                ann["title"], ann["link"], ann["original_title"]  
            )

        print(f"Processed {len(update_indian_announcements)} announcements")

        return True

    except Exception as e:
        print(e,"scrape_and_store_announcements functions")
        return False
