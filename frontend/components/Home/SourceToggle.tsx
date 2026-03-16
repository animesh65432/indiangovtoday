type Props = {
    AnnouncementsType: "All" | "Central Govt" | "States Govt",
    SetAnnouncementsType: React.Dispatch<React.SetStateAction<"All" | "Central Govt" | "States Govt">>
}
const SourceToggle: React.FC<Props> = ({ AnnouncementsType, SetAnnouncementsType }) => {
    return (
        <div className=" w-[99%] text-[11px] md:text-[12px] mx-auto md:mx-0 md:w-fit font-poppins flex items-center justify-around md:justify-start tracking-wide bg-[#F8F7F2] rounded-md border border-[#E8E4DA] divide-x divide-[#E8E4DA]">
            <button onClick={() => SetAnnouncementsType("All")} className={`flex-1 text-nowrap md:flex-none px-3 py-2  font-semibold  ${AnnouncementsType === "All" ? "bg-white" : ""} rounded-l-md`}>
                All
            </button>

            <button onClick={() => SetAnnouncementsType("Central Govt")} className={`flex-1 text-nowrap md:flex-none px-3 py-2 font-semibold text-[#777] ${AnnouncementsType === "Central Govt" ? "bg-white" : ""}`}>
                Central Govt
            </button>

            <button onClick={() => SetAnnouncementsType("States Govt")} className={`flex-1 text-nowrap md:flex-none px-3 py-2 font-semibold text-[#777] rounded-r-md ${AnnouncementsType === "States Govt" ? "bg-white" : ""}`}>
                State Govts
            </button>

        </div>
    );
};

export default SourceToggle;