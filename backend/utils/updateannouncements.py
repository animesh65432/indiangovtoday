from .scrape_press_releases import scrape_press_releases
from services.news import insert_announcements, clear_announcements
from config import config


async def update_announcements_everyday():
    print("Updating announcements...")
    try :
        announcements = scrape_press_releases(config["INDIAN_GOVERMENT_BASE_URL"])
        if not announcements or len(announcements) == 0:
            print("No announcements found to insert.")
            return {"status": "no announcements"}
        
        await clear_announcements()
        
        await insert_announcements(announcements)
        print(f"Inserted {len(announcements)} announcements.")
        return {"status": f"Inserted {len(announcements)} announcements"}
    except Exception as e:
        print("Error updating announcements:", e)


