import { Link } from 'react-router-dom';
import { Paintbrush, Palette, Layers } from 'lucide-react';
import { Button } from './ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Palette className="w-8 h-8 text-purple-600" />
          <span className="text-2xl">qwer</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl mb-6">
            Create Amazing Digital Art
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            A powerful and intuitive drawing canvas to bring your creative ideas to life. Draw, paint, and create stunning artwork right in your browser.
          </p>
          <div className="flex justify-center gap-4 mb-20">
            <Link to="/signup">
              <Button size="lg" className="text-lg px-8">
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="p-8 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Paintbrush className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl mb-3">Powerful Tools</h3>
              <p className="text-gray-600">
                Professional-grade brushes, pencils, and shapes to create exactly what you envision.
              </p>
            </div>

            <div className="p-8 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Palette className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl mb-3">Custom Colors</h3>
              <p className="text-gray-600">
                Full color picker with unlimited possibilities to express your creativity.
              </p>
            </div>

            <div className="p-8 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Layers className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl mb-3">Save & Share</h3>
              <p className="text-gray-600">
                Save your artwork to your gallery and download in high quality.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
