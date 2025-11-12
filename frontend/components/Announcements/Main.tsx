import React, { useContext, useEffect, useState } from "react";
import { Announcement as AnnouncementsTypes } from "@/types";
import ShowAnnouncements from "../ShowAnnouncements";

type Props = {
    Announcements: AnnouncementsTypes[];
    IsLoading: boolean,
    SearchInput: string,
    SetSearchInput: React.Dispatch<React.SetStateAction<string>>

};

const Main: React.FC<Props> = ({ Announcements, IsLoading, SearchInput, SetSearchInput }) => {
    return (
        <>
            <ShowAnnouncements
                Announcements={Announcements}
                IsLoading={IsLoading}
                page={0}
                totalpage={10}
                IsLoadingMore={true}
                LoadMoreData={() => { }}
            />
        </>
    );
};

export default Main;