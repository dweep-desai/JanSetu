export interface WeatherData {
    temp: number;
    condition: string;
    location: string;
    coordinates?: string;
    humidity: number;
    wind: number;
    aqi: number;
    precipitation: number;
    sunrise: string;
    sunset: string;
    lastUpdated: string;
}

// Helper to map WMO Weather Codes to text
const getWeatherCondition = (code: number): string => {
    // WMO Weather interpretation codes (https://open-meteo.com/en/docs)
    if (code === 0) return 'Clear Sky';
    if (code === 1 || code === 2 || code === 3) return 'Partly Cloudy';
    if (code === 45 || code === 48) return 'Foggy';
    if (code >= 51 && code <= 55) return 'Drizzle';
    if (code >= 61 && code <= 67) return 'Rainy';
    if (code >= 71 && code <= 77) return 'Snowy';
    if (code >= 80 && code <= 82) return 'Rain Showers';
    if (code >= 95 && code <= 99) return 'Thunderstorm';
    return 'Unknown';
};

export const getWeather = async (lat?: number, lng?: number): Promise<WeatherData> => {
    try {
        // Default to New Delhi if no coordinates provided
        const latitude = lat || 28.6139;
        const longitude = lng || 77.2090;
        const isLocal = !!lat && !!lng;

        // Fetch Weather Data (Added precipitation, sunrise, sunset)
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,precipitation&daily=sunrise,sunset&timezone=auto`
        );
        const weatherData = await weatherResponse.json();

        // Fetch AQI Data
        const aqiResponse = await fetch(
            `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi&timezone=auto`
        );
        const aqiData = await aqiResponse.json();

        // Process Data
        const current = weatherData.current;
        const daily = weatherData.daily;
        const currentAqi = aqiData.current;

        // Fetch Location Name (Reverse Geocoding)
        let locationName = isLocal ? 'Current Location' : 'New Delhi, India';
        if (isLocal) {
            try {
                const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const geoData = await geoResponse.json();

                if (geoData && geoData.address) {
                    const area = geoData.address.suburb || geoData.address.neighbourhood || geoData.address.residential || geoData.address.village || '';
                    const city = geoData.address.city || geoData.address.town || geoData.address.municipality || geoData.address.state_district || '';
                    const state = geoData.address.state || '';

                    if (area && city) {
                        locationName = `${area}, ${city}`;
                    } else if (city) {
                        locationName = `${city}, ${state}`;
                    } else if (area) {
                        locationName = `${area}, ${state}`;
                    } else {
                        locationName = state || 'Unknown Location';
                    }
                }
            } catch (geoError) {
                console.warn("Reverse geocoding failed", geoError);
                // Fallback to default
            }
        }

        return {
            temp: Math.round(current.temperature_2m),
            condition: getWeatherCondition(current.weather_code),
            location: locationName,
            coordinates: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            humidity: current.relative_humidity_2m,
            wind: Math.round(current.wind_speed_10m),
            aqi: currentAqi.us_aqi,
            precipitation: current.precipitation || 0,
            sunrise: daily.sunrise[0] ? new Date(daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
            sunset: daily.sunset[0] ? new Date(daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
            lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    } catch (error) {
        console.error("Error fetching weather data:", error);
        // Fallback or re-throw
        throw error;
    }
};
