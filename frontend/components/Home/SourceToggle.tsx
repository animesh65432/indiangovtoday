
const SourceToggle = () => {
    return (
        <div className=" w-[99%] text-[13px] md:text-[14px] mx-auto md:mx-0 md:w-fit font-poppins flex items-center justify-around md:justify-start tracking-wide bg-[#F8F7F2] rounded-md border border-[#E8E4DA] divide-x divide-[#E8E4DA]">
            <button className="flex-1 text-nowrap md:flex-none px-3 py-2  font-semibold text-[#141414] bg-white rounded-l-md">
                All
            </button>

            <button className="flex-1 text-nowrap md:flex-none px-3 py-2 font-semibold text-[#777] hover:text-black">
                Central Govt
            </button>

            <button className="flex-1 text-nowrap md:flex-none px-3 py-2 font-semibold text-[#777] rounded-r-md hover:text-black">
                State Govts
            </button>

        </div>
    );
};

export default SourceToggle;