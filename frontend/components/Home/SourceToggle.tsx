
const SourceToggle = () => {
    return (
        <div className="w-fit font-poppins flex items-center text-[0.85rem] tracking-wide bg-[#F8F7F2] rounded-md border border-[#E8E4DA] divide-x divide-[#E8E4DA]">

            <button className="px-3 py-2  font-semibold text-[#141414] bg-white rounded-l-md">
                All
            </button>

            <button className="px-3 py-2 font-semibold text-[#777] hover:text-black">
                Central Govt
            </button>

            <button className="px-3 py-2 font-semibold text-[#777] rounded-r-md hover:text-black">
                State Govts
            </button>

        </div>
    );
};

export default SourceToggle;