import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Palette, LogOut, Home, Image as ImageIcon } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ username, bio, avatar });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <nav className="bg-white border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Palette className="w-6 h-6 text-purple-600" />
            <span className="text-xl">qwer</span>
          </Link>
          <div className="flex gap-2">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Manage your profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={avatar} alt={username} />
                  <AvatarFallback className="text-3xl">
                    {username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1">
                  Save Changes
                </Button>
                <Link to="/dashboard" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
