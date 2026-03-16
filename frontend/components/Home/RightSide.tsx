import React from 'react'
import AnnoucementsHeader from '../AnnoucementsHeader'
import Hwt from './Hwt'
import SearchInputBox from './SearchInputbox'
import { Announcement } from '@/types'
import ShowAnnouncements from '../ShowAnnouncements'

type Props = {
    StatesSelected: string[]
    SetStatesSelected: React.Dispatch<React.SetStateAction<string[]>>
    DeparmentsSelected: string
    SetDeparmentsSelected: React.Dispatch<React.SetStateAction<string>>
    SearchInput: string
    SetSearchInput: React.Dispatch<React.SetStateAction<string>>
    onSearch: () => void,
    announcements: Announcement[],
    LoadMoreData: () => void
    page: number
    totalpages: number
    IsLoading: boolean
    IsLoadingMore: boolean;
    AnnouncementsType: "All" | "Central Govt" | "States Govt",
    SetAnnouncementsType: React.Dispatch<React.SetStateAction<"All" | "Central Govt" | "States Govt">>,
    departmentOptions: string[]
    setDepartmentOptions: React.Dispatch<React.SetStateAction<string[]>>
    categoryOptions: string[]
    setCategoryOptions: React.Dispatch<React.SetStateAction<string[]>>,
    CategoriesSelected: string
    SetCategoriesSelected: React.Dispatch<React.SetStateAction<string>>,
    sheetOpen: boolean,
    setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>,
    handleMobileApply: (dept: string,
        category: string,
        states: string[],
        startDate: Date | null,
        endDate: Date | null) => void
    handleMobileReset: () => void,

}

const RightSide: React.FC<Props> = ({
    StatesSelected,
    SetStatesSelected,
    DeparmentsSelected,
    SetDeparmentsSelected,
    SearchInput,
    SetSearchInput,
    onSearch,
    announcements,
    LoadMoreData,
    page,
    totalpages,
    IsLoading,
    IsLoadingMore,
    AnnouncementsType,
    SetAnnouncementsType,
    departmentOptions,
    setDepartmentOptions,
    categoryOptions,
    setCategoryOptions,
    CategoriesSelected,
    SetCategoriesSelected,
    sheetOpen,
    setSheetOpen,
    handleMobileApply,
    handleMobileReset
}) => {
    return (
        <div className='flex flex-col gap-2 h-screen '>
            <AnnoucementsHeader />
            <Hwt />
            <SearchInputBox
                StatesSelected={StatesSelected}
                SetStatesSelected={SetStatesSelected}
                DeparmentsSelected={DeparmentsSelected}
                SetDeparmentsSelected={SetDeparmentsSelected}
                SearchInput={SearchInput}
                SetSearchInput={SetSearchInput}
                onSearch={onSearch}
                AnnouncementsType={AnnouncementsType}
                SetAnnouncementsType={SetAnnouncementsType}
                departmentOptions={departmentOptions}
                setDepartmentOptions={setDepartmentOptions}
                categoryOptions={categoryOptions}
                setCategoryOptions={setCategoryOptions}
                CategoriesSelected={CategoriesSelected}
                SetCategoriesSelected={SetCategoriesSelected}
                sheetOpen={sheetOpen}
                setSheetOpen={setSheetOpen}
                handleMobileApply={handleMobileApply}
                handleMobileReset={handleMobileReset}
            />
            <div className="flex-1 overflow-y-auto">
                <ShowAnnouncements
                    Announcements={announcements}
                    LoadMoreData={LoadMoreData}
                    page={page}
                    totalpage={totalpages}
                    IsLoading={IsLoading}
                    IsLoadingMore={IsLoadingMore}
                />
            </div>
        </div>
    )
}

export default RightSide