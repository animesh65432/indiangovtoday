export async function getUserIndiaLocation(): Promise<{
    state_ut: string;
    district: string;
    city: string;
    country: string;
    pincode: string;
} | null> {

    const cached = localStorage.getItem('userIndiaLocation');

    if (cached) {
        const { data, timestamp } = JSON.parse(cached);

        console.log(data, timestamp);

        if (Date.now() - timestamp < 30 * 864e5) {
            return data;
        }
    }

    if (!navigator.geolocation) return null;

    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const { latitude: lat, longitude: lng } = position.coords;

    const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );

    const data = await response.json();

    const location = {
        state_ut: data.principalSubdivision,
        district: data.locality,
        city: data.city || data.locality,
        country: data.countryName,
        pincode: data.postcode
    };


    localStorage.setItem('userIndiaLocation', JSON.stringify({
        data: location,
        timestamp: Date.now()
    }));

    return location;
}
