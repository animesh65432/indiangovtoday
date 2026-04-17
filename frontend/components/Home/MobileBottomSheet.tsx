import { Drawer } from "vaul";
import CategoryOptions from "./CategoryOptions";
import ShowAnnouncements from "./ShowAnnouncements";
import React from "react";
import InputBox from "./InputBox";
import { Brief_Announcement, Announcement } from "@/types"

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
}

const MobileBottomSheet: React.FC<Props> = (props) => {
    return (
        <Drawer.Root
            snapPoints={[0.5, 0.7, 1]}
            defaultOpen
            modal={false}
            open
        >
            <Drawer.Portal>
                <Drawer.Content className="md:hidden fixed bottom-0 left-0 right-0 z-500 flex flex-col bg-white rounded-t-2xl shadow-xl max-h-[92vh] outline-none">

                    <div className="flex justify-center py-3 shrink-0">
                        <div className="w-10 h-1 rounded-full bg-gray-300" />
                    </div>

                    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain">
                        <CategoryOptions
                            CategorySelected={props.CategorySelected}
                            SetCategorySelected={props.SetCategorySelected}
                        />
                        <InputBox
                            SearchQuery={props.SearchQuery}
                            SetSearchQuery={props.SetSearchQuery}
                            handleClick={props.handleClick}
                            StatesSelected={props.StatesSelected}
                            setSheetOpen={props.setSheetOpen}
                            SetStatesSelected={props.SetStatesSelected}
                            sheetOpen={props.sheetOpen}
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
                        />
                    </div>

                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}

export default MobileBottomSheet;