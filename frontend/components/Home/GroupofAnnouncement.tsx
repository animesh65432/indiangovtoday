import React, { useEffect, useState } from 'react'
import { GroupedAnnouncements } from "../../types/index"
import { motion, AnimatePresence } from 'motion/react'
import AnnouncementComponent from './Announcement'

type Props = {
    announcements: GroupedAnnouncements[],
}

const GroupOfAnnouncement: React.FC<Props> = ({ announcements }) => {
    const [announcementIndex, setAnnouncementIndex] = useState(0)
    const [visibleCount, setVisibleCount] = useState<number>(3)
    const totalAnnouncements = announcements.length

    useEffect(() => {
        if (!announcements || totalAnnouncements === 0) return

        const interval = setInterval(() => {
            setAnnouncementIndex(prevIndex => (prevIndex + 1) % totalAnnouncements)
        }, 5000)

        return () => clearInterval(interval)
    }, [announcements, totalAnnouncements])

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth
            setVisibleCount(width < 1024 ? 2 : 3)
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    if (totalAnnouncements === 0) {
        return null
    }

    const getVisibleAnnouncements = () => {
        const result = []
        for (let i = 0; i < visibleCount; i++) {
            const index = (announcementIndex + i) % totalAnnouncements
            result.push({ ...announcements[index], position: i })
        }
        return result
    }

    const visibleAnnouncements = getVisibleAnnouncements()

    return (
        <div className='w-[85%] mx-auto pt-6'>
            <div className='flex flex-row gap-4'>

                {visibleAnnouncements.map((announcement, i) => (
                    <motion.div
                        key={`${announcement.type}-${announcementIndex}-${i}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className='flex-1'
                    >
                        <AnnouncementComponent Announcement={announcement.announcements} />
                    </motion.div>
                ))}

            </div>
        </div>
    )
}

export default GroupOfAnnouncement