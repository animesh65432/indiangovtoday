import React, { createContext, useState, ReactNode } from "react";

type CurrentDateContextType = {
    startdate: Date;
    endDate: Date;
    onChangeStartDate: (newStartDate: Date) => void,
    onChangeEndDate: (newEndDate: Date) => void,
};


const today = new Date();
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(today.getDate() - 7);

export const Currentdate = createContext<CurrentDateContextType>({
    startdate: sevenDaysAgo,
    endDate: today,
    onChangeStartDate: () => { },
    onChangeEndDate: () => { },
});


export const CurrentdateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [startdate, setStartDate] = useState<Date>(sevenDaysAgo);
    const [endDate, setEndDate] = useState<Date>(today);

    const onChangeStartDate = (newStartDate: Date) => {
        setStartDate(newStartDate);
    };

    const onChangeEndDate = (newEndDate: Date) => {
        setEndDate(newEndDate);
    };

    return (
        <Currentdate.Provider value={{ startdate, endDate, onChangeEndDate, onChangeStartDate }}>
            {children}
        </Currentdate.Provider>
    );
};
