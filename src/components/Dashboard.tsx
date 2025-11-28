import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Palette, Plus, User, LogOut, Trash2 } from 'lucide-react';

interface Drawing {
  id: string;
  title: string;
  thumbnail: string;
  createdAt: string;
  userId: string;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawings, setDrawings] = useState<Drawing[]>([]);

  useEffect(() => {
    loadDrawings();
  }, [user]);

  const loadDrawings = () => {
    if (!user) return;
    const allDrawings = JSON.parse(localStorage.getItem('drawings') || '[]');
    const userDrawings = allDrawings.filter((d: Drawing) => d.userId === user.id);
    setDrawings(userDrawings);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this drawing?')) return;

    const allDrawings = JSON.parse(localStorage.getItem('drawings') || '[]');
    const updatedDrawings = allDrawings.filter((d: Drawing) => d.id !== id);
    localStorage.setItem('drawings', JSON.stringify(updatedDrawings));
    loadDrawings();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <nav className="bg-white border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Palette className="w-6 h-6 text-purple-600" />
            <span className="text-xl">qwer</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/profile">
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user?.avatar} alt={user?.username} />
              <AvatarFallback className="text-2xl">
                {user?.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl mb-2">{user?.username}</h1>
              <p className="text-gray-600">{user?.bio}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl">My Gallery</h2>
          <Link to="/draw">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Drawing
            </Button>
          </Link>
        </div>

        {drawings.length === 0 ? (
          <Card className="py-16">
            <CardContent className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl mb-2">No drawings yet</h3>
              <p className="text-gray-600 mb-6">Start creating your first masterpiece!</p>
              <Link to="/draw">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Drawing
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {drawings.map((drawing) => (
              <Card key={drawing.id} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                <Link to={`/draw/${drawing.id}`}>
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    <img
                      src={drawing.thumbnail}
                      alt={drawing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="truncate mb-1">{drawing.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(drawing.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(drawing.id);
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
