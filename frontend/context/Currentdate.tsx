import React, { createContext, useState, ReactNode } from "react";

type CurrentDateContextType = {
    date: Date;
    Oncahngedate: (date: Date) => void;
};

export const Currentdate = createContext<CurrentDateContextType>({
    date: new Date(),
    Oncahngedate: () => { },
});

export const CurrentdateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [date, setDate] = useState<Date>(new Date());

    const Oncahngedate = (newDate: Date) => {
        setDate(newDate);
    };

    return (
        <Currentdate.Provider value={{ date, Oncahngedate }}>
            {children}
        </Currentdate.Provider>
    );
};
