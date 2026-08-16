import React, { useState, useEffect } from 'react';
import { WeatherData, LanguageMode, DisplayMode } from '../types';
import { CloudSun, Sun, Wind, Droplets, RefreshCw, MapPin } from 'lucide-react';

interface WeatherWidgetProps {
  langMode: LanguageMode;
  displayMode: DisplayMode;
}

const getWeatherDescription = (code: number): { fr: string; ar: string } => {
  if (code === 0) return { fr: 'Ensoleillé & Ciel dégagé', ar: 'مشمس وسماء صافية' };
  if (code >= 1 && code <= 3) return { fr: 'Partiellement voilé', ar: 'غائم جزئيًا' };
  if (code >= 45 && code <= 48) return { fr: 'Brise saharienne douce', ar: 'رياح صحراوية خفيفة' };
  if (code >= 51 && code <= 65) return { fr: 'Ondées estivales légères', ar: 'زخات مطرية خفيفة' };
  return { fr: 'Beau temps sahélo-saharien', ar: 'طقس معتدل ومناسب' };
};

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ langMode, displayMode }) => {
  const [weather, setWeather] = useState<WeatherData>({
    temp: 32,
    tempMin: 24,
    tempMax: 35,
    conditionFr: 'Beau temps estival & Ciel dégagé',
    conditionAr: 'طقس صيفي جميل وسماء صافية',
    humidity: 45,
    windSpeed: 14,
    isForecast: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchKiffaWeather() {
      try {
        setLoading(true);
        // Kiffa, Mauritanie coordinates: 16.6166 N, -11.4045 W
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=16.6166&longitude=-11.4045&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=Africa%2FNouakchott'
        );

        if (!response.ok) {
          throw new Error('Météo indisponible');
        }

        const data = await response.json();
        if (isMounted && data.current) {
          const wCode = data.current.weather_code ?? 0;
          const desc = getWeatherDescription(wCode);
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            tempMin: data.daily?.temperature_2m_min?.[0] ? Math.round(data.daily.temperature_2m_min[0]) : 24,
            tempMax: data.daily?.temperature_2m_max?.[0] ? Math.round(data.daily.temperature_2m_max[0]) : 35,
            conditionFr: desc.fr,
            conditionAr: desc.ar,
            humidity: data.current.relative_humidity_2m ?? 45,
            windSpeed: Math.round(data.current.wind_speed_10m ?? 12),
            isForecast: true,
          });
        }
      } catch (err) {
        // Safe fallback already present
        console.info('Using local climate data for Kiffa', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchKiffaWeather();

    return () => {
      isMounted = false;
    };
  }, []);

  const isLight = displayMode === 'day';

  return (
    <div className="w-full max-w-4xl px-4 sm:px-6 my-1.5 flex justify-center">
      <div
        className={`w-full p-2.5 sm:p-3 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-2.5 transition-colors ${
          isLight
            ? 'bg-amber-100/70 border-amber-300 text-stone-900 shadow-sm'
            : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-100 backdrop-blur-md'
        }`}
      >
        {/* Left: Location & Condition */}
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${isLight ? 'bg-amber-400 text-stone-950' : 'bg-emerald-900/80 text-amber-300 border border-emerald-500/40'}`}>
            <CloudSun className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <MapPin className="w-3 h-3 text-amber-500" />
              <span>Météo prévisionnelle à Kiffa (Assaba)</span>
              <span className="text-stone-400">•</span>
              <span dir="rtl" className="font-arabic text-amber-500 font-bold">
                طقس كيفة (لعصابه)
              </span>
            </div>
            <div className="text-[11px] text-stone-300 flex items-center gap-2 mt-0.5">
              {langMode !== 'ar-focus' && (
                <span className={isLight ? 'text-stone-700' : 'text-emerald-200'}>
                  {weather.conditionFr} (Période festival fin août)
                </span>
              )}
              {langMode !== 'fr-focus' && (
                <span dir="rtl" className={`font-arabic ${isLight ? 'text-stone-700' : 'text-amber-300'}`}>
                  {weather.conditionAr}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Metrics (Temp, Humidity, Wind) */}
        <div className="flex items-center gap-3 text-xs">
          {/* Temperature */}
          <div className="flex items-baseline gap-1">
            <span className={`text-base font-extrabold ${isLight ? 'text-stone-900' : 'text-white'}`}>
              {weather.temp}°C
            </span>
            <span className={`text-[10px] ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
              ({weather.tempMin}° / {weather.tempMax}°)
            </span>
          </div>

          {/* Wind */}
          <div className={`flex items-center gap-1 text-[11px] ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
            <Wind className="w-3 h-3 text-amber-500" />
            <span>{weather.windSpeed} km/h</span>
          </div>

          {/* Humidity */}
          <div className={`flex items-center gap-1 text-[11px] ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
            <Droplets className="w-3 h-3 text-cyan-400" />
            <span>{weather.humidity}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
