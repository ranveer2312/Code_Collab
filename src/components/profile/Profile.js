import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  Camera,
  Shield,
  Key,
  Bell,
  Globe
} from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: ''
  });
  const [activeTab, setActiveTab] = useState('profile');

  // Mock user stats
  const mockStats = {
    projects: 12,
    collaborators: 8,
    commits: 156,
    contributions: 89
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateUser(formData);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      bio: user.bio || '',
      location: user.location || '',
      website: user.website || ''
    });
    setEditing(false);
  };

  const handleChangePassword = () => {
    toast.info('Password change functionality not implemented in demo');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.info('Account deletion not implemented in demo');
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'notifications', label: 'Notifications', icon: Bell }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
              <button
                onClick={() => setEditing(!editing)}
                className="btn-secondary flex items-center space-x-2"
              >
                {editing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                <span>{editing ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>

            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="h-20 w-20 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl font-medium">
                        {user.name?.charAt(0) || user.email?.charAt(0)}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="absolute -bottom-1 -right-1 h-6 w-6 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700"
                    >
                      <Camera className="h-3 w-3 text-white" />
                    </button>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Profile Picture</h4>
                    <p className="text-sm text-gray-500">Upload a new profile picture</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter your location"
                    />
                  </div>

                  <div>
                    <label className="form-label">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="https://your-website.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="form-input resize-none"
                    placeholder="Tell us about yourself..."
                    maxLength={500}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.bio.length}/500 characters
                  </p>
                </div>

                {/* Stats */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Your Activity</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">{mockStats.projects}</div>
                      <div className="text-sm text-gray-500">Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">{mockStats.collaborators}</div>
                      <div className="text-sm text-gray-500">Collaborators</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">{mockStats.commits}</div>
                      <div className="text-sm text-gray-500">Commits</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">{mockStats.contributions}</div>
                      <div className="text-sm text-gray-500">Contributions</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-secondary"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Avatar Display */}
                <div className="flex items-center space-x-6">
                  <div className="h-20 w-20 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-medium">
                      {user.name?.charAt(0) || user.email?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{user.name}</h4>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Full Name</label>
                    <p className="text-gray-900">{user.name || 'Not provided'}</p>
                  </div>

                  <div>
                    <label className="form-label">Email Address</label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>

                  <div>
                    <label className="form-label">Location</label>
                    <p className="text-gray-900">{user.location || 'Not provided'}</p>
                  </div>

                  <div>
                    <label className="form-label">Website</label>
                    <p className="text-gray-900">
                      {user.website ? (
                        <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                          {user.website}
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="form-label">Bio</label>
                  <p className="text-gray-900">{user.bio || 'No bio provided'}</p>
                </div>

                {/* Stats */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Your Activity</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">{mockStats.projects}</div>
                      <div className="text-sm text-gray-500">Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">{mockStats.collaborators}</div>
                      <div className="text-sm text-gray-500">Collaborators</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">{mockStats.commits}</div>
                      <div className="text-sm text-gray-500">Commits</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">{mockStats.contributions}</div>
                      <div className="text-sm text-gray-500">Contributions</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Security Settings</h3>
            
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Key className="h-5 w-5 text-gray-600" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Change Password</h4>
                      <p className="text-sm text-gray-500">Update your password to keep your account secure</p>
                    </div>
                  </div>
                  <button
                    onClick={handleChangePassword}
                    className="btn-secondary"
                  >
                    Change Password
                  </button>
                </div>
              </div>

              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-red-600" />
                    <div>
                      <h4 className="text-sm font-medium text-red-800">Delete Account</h4>
                      <p className="text-sm text-red-700">Permanently delete your account and all associated data</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    className="btn-danger"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Notification Preferences</h3>
            
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-gray-600" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Receive email notifications for project updates</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-gray-600" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Browser Notifications</h4>
                      <p className="text-sm text-gray-500">Receive browser notifications for real-time updates</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 