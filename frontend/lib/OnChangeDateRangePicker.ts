import { useContext } from "react";
import { Currentdate } from "@/context/Currentdate"

export const OnChangeDateRangePicker = (values: {
    range: { from?: Date; to?: Date };
    rangeCompare?: { from?: Date; to?: Date };
}) => {
    const { onChangeDate } = useContext(Currentdate)
    if (values.range.from && values.range.to) {
        onChangeDate(values.range.from, values.range.to);
    }
};