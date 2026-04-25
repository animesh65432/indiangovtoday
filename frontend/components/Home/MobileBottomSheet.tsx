import { Drawer } from "vaul";
import ShowAnnouncements from "./ShowAnnouncements";
import React, { useContext } from "react";
import { Brief_Announcement, Announcement } from "@/types"
import MobileCategoryOptions from "./MobileCategoryOptions";
import { ThemeContext } from "@/context/Theme";

interface Props {
    CategorySelected: string;
    SetCategorySelected: React.Dispatch<React.SetStateAction<string>>;
    Announcements: Announcement[];
    IsLoading: boolean;
    IsLoadingMore: boolean;
    LoadMoreData: () => void;
    totalpage: number;
    page: number;
    BriefAnnouncements: Brief_Announcement[];
    ShowBriefingComponent: boolean;
    StatesSelected: string[];
    setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
    SetStatesSelected: React.Dispatch<React.SetStateAction<string[]>>;
    sheetOpen: boolean;
    SearchQuery: string;
    SetSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    handleClick: () => void;
    Options: string[]
}
const MobileBottomSheet: React.FC<Props> = (props) => {
    const { theme } = useContext(ThemeContext)
    const isDark = theme === "dark"
    const [snapPoint, setSnapPoint] = React.useState<number | string | null>(0.5)

    return (
        <Drawer.Root
            snapPoints={[0.5, 0.7, 0.92]}
            activeSnapPoint={snapPoint}
            setActiveSnapPoint={setSnapPoint}
            defaultOpen
            modal={false}
            open
        >
            <Drawer.Portal>
                <Drawer.Content className={`md:hidden fixed bottom-0 left-0 right-0 z-600 flex flex-col ${isDark ? "bg-[#050505]" : "bg-white"} rounded-t-2xl shadow-xl min-h-[50vh] max-h-[calc(100vh-56px)] outline-none`}>

                    <div className="flex justify-center py-3 shrink-0">
                        <div className={`w-10 h-1 rounded-full ${isDark ? "bg-gray-300" : "bg-gray-100"}`} />
                    </div>

                    <div className="flex-1 min-h-[40vh] overflow-y-auto overflow-x-hidden overscroll-contain">
                        <MobileCategoryOptions
                            CategoriesOptions={props.Options}
                            CategorySelected={props.CategorySelected}
                            SetCategorySelected={props.SetCategorySelected}
                        />
                        <ShowAnnouncements
                            Announcements={props.Announcements}
                            IsLoading={props.IsLoading}
                            IsLoadingMore={props.IsLoadingMore}
                            LoadMoreData={props.LoadMoreData}
                            totalpage={props.totalpage}
                            page={props.page}
                            ShowBriefingComponent={props.ShowBriefingComponent}
                            BriefAnnouncements={props.BriefAnnouncements}
                            StatesSelected={props.StatesSelected}
                            scrollable={false}
                        />
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
export default MobileBottomSheet;