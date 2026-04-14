import { Drawer } from "vaul";
import CategoryOptions from "./CategoryOptions";
import ShowAnnouncements from "./ShowAnnouncements";
import React from "react";

interface Props {
    categoryOptions: any;
    setCategoryOptions: any;
    CategorySelected: any;
    SetCategorySelected: any;
    Announcements: any;
    IsLoading: boolean;
    IsLoadingMore: boolean;
    LoadMoreData: () => void;
    totalpage: number;
    page: number;
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
                            categoryOptions={props.categoryOptions}
                            setCategoryOptions={props.setCategoryOptions}
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
                        />
                    </div>

                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}

export default MobileBottomSheet;