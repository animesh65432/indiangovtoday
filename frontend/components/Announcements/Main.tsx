import { Announcement as AnnouncementsTypes } from "@/types";
import ShowAnnouncements from "../ShowAnnouncements";

type Props = {
    Announcements: AnnouncementsTypes[];
    IsLoading: boolean,
    SearchInput: string,
    SetSearchInput: React.Dispatch<React.SetStateAction<string>>
    OnLoadMoredata: () => void
    page: number,
    limit: number,
    IsLoadingMore: boolean

};

const Main: React.FC<Props> = ({ IsLoadingMore, page, limit, OnLoadMoredata, Announcements, IsLoading }) => {
    return (
        <ShowAnnouncements
            Announcements={Announcements}
            IsLoading={IsLoading}
            page={page}
            totalpage={limit}
            IsLoadingMore={IsLoadingMore}
            LoadMoreData={OnLoadMoredata}
        />
    );
};

export default Main;