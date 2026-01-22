import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search, Tractor, Cloud, FileText } from "lucide-react";
import SEO from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <SEO
        title="Page Not Found | FarmConnect"
        description="The page you're looking for doesn't exist on FarmConnect."
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 px-4">
        <div className="text-center max-w-lg">
          <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Oops! The page you're looking for doesn't exist on FarmConnect.
            It might have been moved or the URL may be incorrect.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link to="/">
                <Home className="w-5 h-5" />
                Go to Homepage
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/disease-detection">
                <Search className="w-5 h-5" />
                Try Disease Detection
              </Link>
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              Explore FarmConnect Features:
            </h3>
            <ul className="flex flex-wrap justify-center gap-4 text-sm">
              <li>
                <Link to="/disease-detection" className="flex items-center gap-1 text-primary hover:underline">
                  <Search className="w-4 h-4" /> AI Disease Detection
                </Link>
              </li>
              <li>
                <Link to="/machinery" className="flex items-center gap-1 text-primary hover:underline">
                  <Tractor className="w-4 h-4" /> Machinery Rental
                </Link>
              </li>
              <li>
                <Link to="/weather" className="flex items-center gap-1 text-primary hover:underline">
                  <Cloud className="w-4 h-4" /> Weather Insights
                </Link>
              </li>
              <li>
                <Link to="/schemes" className="flex items-center gap-1 text-primary hover:underline">
                  <FileText className="w-4 h-4" /> Government Schemes
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
