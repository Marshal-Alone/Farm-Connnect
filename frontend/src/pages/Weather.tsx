import IndianFarmerWeatherDashboard from '../components/IndianFarmerWeatherDashboard';
import SEO from '@/components/SEO';

export default function Weather() {
  return (
    <>
      <SEO
        title="Farm Weather Insights - Real-time Rain & Forecast | FarmConnect"
        description="Get accurate agricultural weather forecasts, rain predictions, and humidity levels for your farm. Plan your harvest with FarmConnect Weather."
        url="https://farmbro.vercel.app/weather"
      />
      <IndianFarmerWeatherDashboard />
    </>
  );
}
