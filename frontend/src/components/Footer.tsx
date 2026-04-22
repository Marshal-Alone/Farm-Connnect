import { Github, Mail, MapPin, Phone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Footer() {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="container px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">FarmConnect</h3>
            <p className="text-sm text-gray-400">
              AI-powered smart farming platform designed for Indian farmers. Empowering agriculture through technology.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+91-XXXX-XXXX-XX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contact@farmconnect.com</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Features</h4>
            <ul className="text-sm space-y-2">
              <li><a href="/disease-detection" className="hover:text-white transition">Disease Detection</a></li>
              <li><a href="/weather" className="hover:text-white transition">Weather Insights</a></li>
              <li><a href="/machinery" className="hover:text-white transition">Machinery Rental</a></li>
              <li><a href="/schemes" className="hover:text-white transition">Government Schemes</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Resources</h4>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="hover:text-white transition">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition">Guides</a></li>
              <li><a href="#" className="hover:text-white transition">FAQs</a></li>
              <li><a href="#" className="hover:text-white transition">Support</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-green-600 transition">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-green-600 transition">
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <p className="text-xs text-gray-500">Open source on GitHub</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} FarmConnect. All rights reserved.
            </p>
            <div className="text-sm text-gray-400 space-x-4">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            <strong>Team:</strong> [Your Name] | <strong>Guide:</strong> [Guide Name] | <strong>Department:</strong> Computer Science & Engineering | <strong>Year:</strong> 4th Year B.Tech
          </p>
        </div>
      </div>
    </footer>
  );
}
