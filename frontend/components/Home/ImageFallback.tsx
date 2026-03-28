import { getCategoryEmoji } from "@/lib/getCategoryEmoji"

const ImageFallback = ({ category }: { category: string }) => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 ">
        <span className="text-4xl mb-2 font-literata">{getCategoryEmoji(category)}</span>
        <span className="text-xs text-gray-500 font-literata uppercase text-center px-2">
            {category || "Government Update"}
        </span>
    </div>
)

export default ImageFallback