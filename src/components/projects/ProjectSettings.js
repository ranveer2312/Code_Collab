import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ArrowLeft, 
  Settings, 
  Users, 
  Shield, 
  Trash2, 
  Plus, 
  Mail,
  UserPlus,
  Eye,
  EyeOff,
  Edit3,
  Save,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProjectSettings = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [collaborators, setCollaborators] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('collaborator');
  const [editingProject, setEditingProject] = useState(false);
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    visibility: 'private'
  });

  // Mock project data
  const mockProject = {
    id: projectId,
    name: 'React Todo App',
    description: 'A simple todo application built with React and TypeScript',
    visibility: 'public',
    ownerId: '1',
    language: 'typescript',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Mock collaborators data
  const mockCollaborators = [
    { 
      id: '2', 
      name: 'John Doe', 
      email: 'john@example.com', 
      role: 'collaborator',
      joinedAt: new Date(Date.now() - 86400000).toISOString()
    },
    { 
      id: '3', 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      role: 'viewer',
      joinedAt: new Date(Date.now() - 172800000).toISOString()
    }
  ];

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProject(mockProject);
      setCollaborators(mockCollaborators);
      setProjectForm({
        name: mockProject.name,
        description: mockProject.description,
        visibility: mockProject.visibility
      });
    } catch (error) {
      console.error('Error fetching project data:', error);
      toast.error('Failed to load project settings');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProject = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProject(prev => ({
        ...prev,
        ...projectForm,
        updatedAt: new Date().toISOString()
      }));
      
      setEditingProject(false);
      toast.success('Project updated successfully');
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    }
  };

  const handleInviteCollaborator = async (e) => {
    e.preventDefault();
    
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCollaborator = {
        id: Date.now().toString(),
        name: inviteEmail.split('@')[0], // Mock name from email
        email: inviteEmail,
        role: inviteRole,
        joinedAt: new Date().toISOString()
      };
      
      setCollaborators(prev => [...prev, newCollaborator]);
      setInviteEmail('');
      setInviteRole('collaborator');
      setShowInviteModal(false);
      toast.success('Invitation sent successfully');
    } catch (error) {
      console.error('Error inviting collaborator:', error);
      toast.error('Failed to send invitation');
    }
  };

  const handleRemoveCollaborator = async (collaboratorId) => {
    if (!window.confirm('Are you sure you want to remove this collaborator?')) {
      return;
    }

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCollaborators(prev => prev.filter(c => c.id !== collaboratorId));
      toast.success('Collaborator removed successfully');
    } catch (error) {
      console.error('Error removing collaborator:', error);
      toast.error('Failed to remove collaborator');
    }
  };

  const handleUpdateCollaboratorRole = async (collaboratorId, newRole) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCollaborators(prev => prev.map(c => 
        c.id === collaboratorId ? { ...c, role: newRole } : c
      ));
      toast.success('Role updated successfully');
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    }
  };

  const handleDeleteProject = async () => {
    const projectName = prompt('Please type the project name to confirm deletion:');
    if (projectName !== project?.name) {
      toast.error('Project name does not match');
      return;
    }

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Project deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'owner':
        return 'bg-blue-100 text-blue-800';
      case 'collaborator':
        return 'bg-green-100 text-green-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOwner = project?.ownerId === user?.id;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link
            to={`/project/${projectId}`}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Project</span>
          </Link>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Project Settings</h1>
            <p className="mt-2 text-gray-600">
              Manage your project settings, collaborators, and permissions
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'general', label: 'General', icon: Settings },
            { id: 'collaborators', label: 'Collaborators', icon: Users },
            { id: 'security', label: 'Security', icon: Shield }
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
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">General Information</h3>
              {isOwner && (
                <button
                  onClick={() => setEditingProject(!editingProject)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  {editingProject ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                  <span>{editingProject ? 'Cancel' : 'Edit'}</span>
                </button>
              )}
            </div>

            {editingProject ? (
              <div className="space-y-4">
                <div>
                  <label className="form-label">Project Name</label>
                  <input
                    type="text"
                    value={projectForm.name}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, name: e.target.value }))}
                    className="form-input"
                    maxLength={50}
                  />
                </div>
                
                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                    className="form-input resize-none"
                    rows={3}
                    maxLength={500}
                  />
                </div>
                
                <div>
                  <label className="form-label">Visibility</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="private"
                        checked={projectForm.visibility === 'private'}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, visibility: e.target.value }))}
                        className="h-4 w-4 text-primary-600"
                      />
                      <div className="flex items-center space-x-2">
                        <EyeOff className="h-4 w-4 text-gray-600" />
                        <span>Private</span>
                      </div>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="public"
                        checked={projectForm.visibility === 'public'}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, visibility: e.target.value }))}
                        className="h-4 w-4 text-primary-600"
                      />
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-green-600" />
                        <span>Public</span>
                      </div>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 pt-4">
                  <button
                    onClick={handleUpdateProject}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    onClick={() => setEditingProject(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="form-label">Project Name</label>
                  <p className="text-gray-900">{project?.name}</p>
                </div>
                
                <div>
                  <label className="form-label">Description</label>
                  <p className="text-gray-900">{project?.description || 'No description'}</p>
                </div>
                
                <div>
                  <label className="form-label">Visibility</label>
                  <div className="flex items-center space-x-2">
                    {project?.visibility === 'public' ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-600" />
                    )}
                    <span className="capitalize">{project?.visibility}</span>
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Primary Language</label>
                  <p className="text-gray-900 capitalize">{project?.language}</p>
                </div>
                
                <div>
                  <label className="form-label">Created</label>
                  <p className="text-gray-900">{new Date(project?.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <label className="form-label">Last Updated</label>
                  <p className="text-gray-900">{new Date(project?.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Collaborators */}
        {activeTab === 'collaborators' && (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Collaborators</h3>
              {isOwner && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Invite Collaborator</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {collaborators.map(collaborator => (
                <div key={collaborator.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {collaborator.name?.charAt(0) || collaborator.email?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{collaborator.name}</p>
                      <p className="text-sm text-gray-500">{collaborator.email}</p>
                      <p className="text-xs text-gray-400">
                        Joined {new Date(collaborator.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {isOwner && collaborator.role !== 'owner' ? (
                      <select
                        value={collaborator.role}
                        onChange={(e) => handleUpdateCollaboratorRole(collaborator.id, e.target.value)}
                        className="form-input text-sm"
                      >
                        <option value="collaborator">Collaborator</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(collaborator.role)}`}>
                        {collaborator.role}
                      </span>
                    )}
                    
                    {isOwner && collaborator.role !== 'owner' && (
                      <button
                        onClick={() => handleRemoveCollaborator(collaborator.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {collaborators.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No collaborators yet</h3>
                  <p className="text-gray-600 mb-4">Invite team members to collaborate on this project</p>
                  {isOwner && (
                    <button
                      onClick={() => setShowInviteModal(true)}
                      className="btn-primary"
                    >
                      Invite Collaborator
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Security */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Security Settings</h3>
            
            <div className="space-y-6">
              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-red-800">Danger Zone</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Once you delete a project, there is no going back. Please be certain.
                    </p>
                    {isOwner && (
                      <button
                        onClick={handleDeleteProject}
                        className="mt-3 btn-danger"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete Project</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Invite Collaborator</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleInviteCollaborator} className="p-6 space-y-4">
              <div>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="form-input"
                  placeholder="Enter email address"
                  required
                />
              </div>
              
              <div>
                <label className="form-label">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="form-input"
                >
                  <option value="collaborator">Collaborator</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>Send Invitation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSettings; 