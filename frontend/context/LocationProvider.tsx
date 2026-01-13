import React, { createContext, useState, useEffect } from 'react'
import { getUserIndiaLocation } from '@/hooks/getUserIndiaLocation';

export const LocationContext = createContext<{
    state_ut: string;
    district: string;
    city: string;
    country: string;
    pincode: string;
}>({
    state_ut: '',
    district: '',
    city: '',
    country: '',
    pincode: '',
});

type LocationProviderProps = {
    children: React.ReactNode;
}


const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {

    const [location, setLocation] = useState<{
        state_ut: string;
        district: string;
        city: string;
        country: string;
        pincode: string;
    }>({
        state_ut: '',
        district: '',
        city: '',
        country: '',
        pincode: '',
    });

    const fetchLocation = async () => {
        try {
            const loc = await getUserIndiaLocation();
            if (loc) {
                setLocation(loc);
            } else {
                console.warn("Location data is null");
            }
        } catch (error) {
            console.error("Error fetching location:", error);
        }
    }

    useEffect(() => {
        fetchLocation();
    }, []);


    return (
        <LocationContext.Provider value={location}>
            {children}
        </LocationContext.Provider>
    )
}

export default LocationProvider