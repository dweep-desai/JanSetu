import { useState, useEffect } from 'react';
import { CloudSun, Wind, Droplets, Thermometer, MapPin, RefreshCw, Sunrise, Sunset, Umbrella } from 'lucide-react';
import { getWeather } from '../../../services/weatherService';


const WeatherInfo = () => {
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeatherData = async (lat?: number, lng?: number) => {
            setLoading(true);
            try {
                const data = await getWeather(lat, lng);
                setWeather(data);
            } catch (error) {
                console.error("Failed to fetch weather", error);
                // Fallback to default/Delhi if error
                try {
                    const data = await getWeather();
                    setWeather(data);
                } catch (e) {
                    setLoading(false);
                }
            } finally {
                setLoading(false);
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeatherData(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error("Geolocation denied/error", error);
                    fetchWeatherData(); // Fallback to default
                }
            );
        } else {
            fetchWeatherData();
        }
    }, []);


    return (
        <div className="min-h-screen bg-blue-50 p-4 pb-20 md:pb-4 flex items-center justify-center">
            {loading ? (
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    <p className="text-blue-600 font-medium">Loading weather...</p>
                </div>
            ) : (
                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden relative">
                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-8 text-white text-center relative">
                        <div className="absolute top-4 right-4 text-blue-100 text-xs flex items-center gap-1">
                            <RefreshCw className="w-3 h-3" /> Updated {weather.lastUpdated}
                        </div>
                        <h2 className="text-3xl font-bold flex flex-col items-center justify-center gap-1 mb-1">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-6 h-6" /> {weather.location}
                            </div>
                            {weather.coordinates && (
                                <span className="text-xs font-normal opacity-80">{weather.coordinates}</span>
                            )}
                        </h2>

                        <p className="text-blue-100 text-lg mb-6">{weather.condition}</p>

                        <div className="flex items-center justify-center gap-4 mb-4">
                            <CloudSun className="w-20 h-20 text-yellow-300" />
                            <div className="text-6xl font-bold">{weather.temp}°</div>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 bg-gray-50 rounded-xl">
                            <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">Humidity</p>
                            <p className="font-bold text-gray-800">{weather.humidity}%</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl">
                            <Wind className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">Wind</p>
                            <p className="font-bold text-gray-800">{weather.wind} km/h</p>
                        </div>
                        <div className={`p-3 rounded-xl ${weather.aqi > 150 ? 'bg-orange-50' : 'bg-green-50'}`}>
                            <Thermometer className={`w-6 h-6 mx-auto mb-2 ${weather.aqi > 150 ? 'text-orange-500' : 'text-green-500'}`} />
                            <p className="text-xs text-gray-500">AQI</p>
                            <p className={`font-bold ${weather.aqi > 150 ? 'text-orange-600' : 'text-green-600'}`}>{weather.aqi}</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-xl">
                            <Umbrella className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">Rain</p>
                            <p className="font-bold text-gray-800">{weather.precipitation} mm</p>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-xl">
                            <Sunrise className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">Sunrise</p>
                            <p className="font-bold text-gray-800">{weather.sunrise}</p>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-xl">
                            <Sunset className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">Sunset</p>
                            <p className="font-bold text-gray-800">{weather.sunset}</p>
                        </div>
                    </div>

                    <div className="px-6 pb-6">
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                            <p className="text-blue-800 text-sm font-medium">
                                "Its a good day for a walk, but wear a mask due to moderate AQI."
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeatherInfo;
