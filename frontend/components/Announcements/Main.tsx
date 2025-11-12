import React, { useContext, useEffect, useState } from "react";
import { AnnouncementsTypes } from "@/types";
import { DateRangePicker } from "../ui/DateRangePicker";
import Image from "next/image";
import { TranslateText } from "@/lib/translatetext";
import { LanguageContext } from "@/context/Lan"
import { Currentdate } from "@/context/Currentdate"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from "../ui/select";
import { optionsforLanguages } from "@/lib/lan";
import { useRouter } from "next/router"
import { LoaderCircleIcon } from "lucide-react"
import Content from "../Announcement/Content";

type Props = {
    Announcements: AnnouncementsTypes[];
    IsLoading: boolean,
    SearchInput: string,
    SetSearchInput: React.Dispatch<React.SetStateAction<string>>

};

const Main: React.FC<Props> = ({ Announcements, IsLoading, SearchInput, SetSearchInput }) => {
    const { language, onSelectLanguage } = useContext(LanguageContext)
    const { startdate, endDate, onChangeDate } = useContext(Currentdate)
    const router = useRouter()

    const OnChangeDateRangePicker = (values: {
        range: { from?: Date; to?: Date };
        rangeCompare?: { from?: Date; to?: Date };
    }) => {
        if (values.range.from && values.range.to) {
            onChangeDate(values.range.from, values.range.to);
        }
    };


    return (
        <></>
    );
};

export default Main;