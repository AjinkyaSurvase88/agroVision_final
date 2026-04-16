/**
 * weatherApi.js — Weather Service
 * Uses OpenWeatherMap API. Falls back to rich mock data
 * if REACT_APP_WEATHER_API_KEY is not set (dev/demo mode).
 */
import axios from 'axios';

const OWM_KEY  = process.env.REACT_APP_WEATHER_API_KEY;
const OWM_BASE = 'https://api.openweathermap.org/data/2.5';

// ── Mock data for demo mode ──────────────────────────────────────────
const MOCK_DB = {
  default: {
    city: 'Nashik', country: 'IN',
    temp: 28, feels_like: 31, humidity: 62,
    wind_speed: 14, visibility: 10,
    condition: 'Partly Cloudy', icon: '02d',
    sunrise: '06:12', sunset: '18:45',
    uv_index: 6, pressure: 1012,
    forecast: [
      { day: 'Mon', icon: '01d', high: 30, low: 22 },
      { day: 'Tue', icon: '02d', high: 29, low: 21 },
      { day: 'Wed', icon: '10d', high: 26, low: 20 },
      { day: 'Thu', icon: '01d', high: 31, low: 23 },
      { day: 'Fri', icon: '03d', high: 28, low: 21 },
    ],
    agro_tip: 'शेतात पाहणी करण्यासाठी चांगली परिस्थिती. माध्यमिक आर्द्रतामुळे बुरशीजन्य दाबाचे निरीक्षण करा.',
  },
  pune: {
    city: 'Pune', country: 'IN', temp: 26, feels_like: 29, humidity: 68,
    wind_speed: 12, visibility: 8, condition: 'Overcast', icon: '04d',
    sunrise: '06:10', sunset: '18:50', uv_index: 4, pressure: 1008,
    forecast: [
      { day: 'Mon', icon: '04d', high: 27, low: 20 },
      { day: 'Tue', icon: '10d', high: 24, low: 19 },
      { day: 'Wed', icon: '09d', high: 22, low: 18 },
      { day: 'Thu', icon: '10d', high: 23, low: 19 },
      { day: 'Fri', icon: '02d', high: 26, low: 20 },
    ],
    agro_tip: 'ढगाळ आकाश — रोपांची रोपण करण्यासाठी आदर्श. पाऊसानंतर ओसी चिलमिरी पडण्याचे निरीक्षण करा.',
  },
  delhi: {
    city: 'Delhi', country: 'IN', temp: 36, feels_like: 41, humidity: 38,
    wind_speed: 18, visibility: 6, condition: 'Sunny', icon: '01d',
    sunrise: '05:55', sunset: '19:05', uv_index: 9, pressure: 1002,
    forecast: [
      { day: 'Mon', icon: '01d', high: 37, low: 27 },
      { day: 'Tue', icon: '01d', high: 38, low: 28 },
      { day: 'Wed', icon: '02d', high: 36, low: 26 },
      { day: 'Thu', icon: '03d', high: 34, low: 25 },
      { day: 'Fri', icon: '10d', high: 31, low: 23 },
    ],
    agro_tip: 'उच्च उष्णतेतून शरीरास नुकसान होण्याचा धोका. पहाटे किंवा संध्याकाळी सिंचन करा. थ्रिप्स उफाळ पडण्याचे निरीक्षण करा.',
  },
};

const getMock = (city) => MOCK_DB[city.toLowerCase()] || { ...MOCK_DB.default, city };

// ── Parse OWM response → normalised shape ───────────────────────────
const parseOWM = (data) => ({
  city:        data.name,
  country:     data.sys.country,
  temp:        Math.round(data.main.temp),
  feels_like:  Math.round(data.main.feels_like),
  humidity:    data.main.humidity,
  wind_speed:  Math.round(data.wind.speed * 3.6), // m/s → km/h
  visibility:  Math.round((data.visibility || 10000) / 1000),
  condition:   data.weather[0].main,
  icon:        data.weather[0].icon,
  sunrise:     new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  sunset:      new Date(data.sys.sunset  * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  uv_index:    null, pressure: data.main.pressure,
  forecast: [],
  agro_tip: deriveAgroTip(data.main.humidity, Math.round(data.main.temp), data.weather[0].main),
});

const deriveAgroTip = (hum, temp, cond) => {
  if (cond.toLowerCase().includes('rain'))  return 'पाऊस अपेक्षित आहे — कीटकनाशक प्रयोग विलंबित करा. मातीची आर्द्रता तपासण्याची चांगली वेळ.';
  if (temp > 35) return 'उच्च उष्णता तणाव. पहाटे किंवा संध्याकाळी पाणी द्या.';
  if (hum > 75)  return 'उच्च आर्द्रता — बुरशीजन्य रोग वाढण्याचा धोका. पत्र्यावरील धुसर रोग आणि ओसी चिलमिरीचे निरीक्षण करा.';
  if (hum < 40)  return 'कमी आर्द्रता — लाल माकडी उफाळ पडण्याचे निरीक्षण करा. पुरेसे पाणी द्या.';
  return 'मध्यम परिस्थिती. शेतात पाहणी आणि नियमित पाहणीची चांगली वेळ.';
};

/**
 * Fetch weather for a city.
 * Uses real OWM API if key present, else returns mock data.
 */
export const fetchWeather = async (city) => {
  if (!OWM_KEY) {
    // Simulate network delay in demo mode
    await new Promise(r => setTimeout(r, 800));
    return getMock(city);
  }

  const response = await axios.get(`${OWM_BASE}/weather`, {
    params: { q: city, appid: OWM_KEY, units: 'metric' },
  });
  return parseOWM(response.data);
};