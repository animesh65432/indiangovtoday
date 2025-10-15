import React, { createContext, useState, ReactNode } from "react";

type CurrentDateContextType = {
    startdate: Date;
    endDate: Date;
    onChangeDate: (newStartDate: Date, newEndDate: Date) => void;
};


const today = new Date();
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(today.getDate() - 7);

export const Currentdate = createContext<CurrentDateContextType>({
    startdate: sevenDaysAgo,
    endDate: today,
    onChangeDate: () => { },
});


export const CurrentdateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [startdate, setStartDate] = useState<Date>(sevenDaysAgo);
    const [endDate, setEndDate] = useState<Date>(today);

    const onChangeDate = (newStartDate: Date, newEndDate: Date) => {
        console.log("currentdate context")
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    };

    return (
        <Currentdate.Provider value={{ startdate, endDate, onChangeDate }}>
            {children}
        </Currentdate.Provider>
    );
};
