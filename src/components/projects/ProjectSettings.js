import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { projectService } from '../../services/projectService';
import { 
  Settings, 
  Users, 
  GitBranch, 
  Eye, 
  EyeOff, 
  Trash2, 
  Plus, 
  Mail,
  UserPlus,
  Crown,
  Shield,
  Eye as EyeIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProjectSettings = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [newCollaborator, setNewCollaborator] = useState({ email: '', role: 'viewer' });
  const [isAddingCollaborator, setIsAddingCollaborator] = useState(false);

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const [projectResponse, collaboratorsResponse, versionsResponse] = await Promise.all([
        projectService.getProject(projectId),
        projectService.getCollaborators(projectId),
        projectService.getVersions(projectId)
      ]);
      
      setProject(projectResponse.data);
      setCollaborators(collaboratorsResponse.data);
      setVersions(versionsResponse.data);
    } catch (error) {
      console.error('Error fetching project data:', error);
      toast.error('Failed to load project settings');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProject = async (updatedData) => {
    try {
      const response = await projectService.updateProject(projectId, updatedData);
      setProject(response.data);
      toast.success('Project updated successfully');
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    }
  };

  const handleAddCollaborator = async (e) => {
    e.preventDefault();
    
    if (!newCollaborator.email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      setIsAddingCollaborator(true);
      await projectService.addCollaborator(projectId, newCollaborator.email, newCollaborator.role);
      
      // Refresh collaborators list
      const response = await projectService.getCollaborators(projectId);
      setCollaborators(response.data);
      
      setNewCollaborator({ email: '', role: 'viewer' });
      toast.success('Collaborator added successfully');
    } catch (error) {
      console.error('Error adding collaborator:', error);
      toast.error('Failed to add collaborator');
    } finally {
      setIsAddingCollaborator(false);
    }
  };

  const handleUpdateCollaboratorRole = async (userId, newRole) => {
    try {
      await projectService.updateCollaboratorRole(projectId, userId, newRole);
      
      // Refresh collaborators list
      const response = await projectService.getCollaborators(projectId);
      setCollaborators(response.data);
      
      toast.success('Collaborator role updated');
    } catch (error) {
      console.error('Error updating collaborator role:', error);
      toast.error('Failed to update collaborator role');
    }
  };

  const handleRemoveCollaborator = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this collaborator?')) {
      return;
    }

    try {
      await projectService.removeCollaborator(projectId, userId);
      
      // Refresh collaborators list
      const response = await projectService.getCollaborators(projectId);
      setCollaborators(response.data);
      
      toast.success('Collaborator removed successfully');
    } catch (error) {
      console.error('Error removing collaborator:', error);
      toast.error('Failed to remove collaborator');
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      await projectService.deleteProject(projectId);
      toast.success('Project deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'collaborator':
        return <Shield className="h-4 w-4 text-blue-600" />;
      case 'viewer':
        return <EyeIcon className="h-4 w-4 text-gray-600" />;
      default:
        return <UserPlus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'owner':
        return 'Owner';
      case 'collaborator':
        return 'Collaborator';
      case 'viewer':
        return 'Viewer';
      default:
        return role;
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
        <div className="flex items-center space-x-3">
          <Settings className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Project Settings</h1>
            <p className="mt-1 text-gray-600">{project?.name}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'general', label: 'General', icon: Settings },
            { id: 'collaborators', label: 'Collaborators', icon: Users },
            { id: 'versions', label: 'Versions', icon: GitBranch }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Project Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Project Name</label>
                  <input
                    type="text"
                    value={project?.name || ''}
                    onChange={(e) => setProject(prev => ({ ...prev, name: e.target.value }))}
                    onBlur={(e) => handleUpdateProject({ name: e.target.value })}
                    className="form-input"
                    disabled={!isOwner}
                  />
                </div>
                
                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    value={project?.description || ''}
                    onChange={(e) => setProject(prev => ({ ...prev, description: e.target.value }))}
                    onBlur={(e) => handleUpdateProject({ description: e.target.value })}
                    rows={3}
                    className="form-input resize-none"
                    disabled={!isOwner}
                  />
                </div>
                
                <div>
                  <label className="form-label">Visibility</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="visibility"
                        value="private"
                        checked={project?.visibility === 'private'}
                        onChange={(e) => {
                          setProject(prev => ({ ...prev, visibility: e.target.value }));
                          handleUpdateProject({ visibility: e.target.value });
                        }}
                        disabled={!isOwner}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <div className="flex items-center space-x-2">
                        <EyeOff className="h-4 w-4 text-gray-600" />
                        <span className="text-sm">Private</span>
                      </div>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="visibility"
                        value="public"
                        checked={project?.visibility === 'public'}
                        onChange={(e) => {
                          setProject(prev => ({ ...prev, visibility: e.target.value }));
                          handleUpdateProject({ visibility: e.target.value });
                        }}
                        disabled={!isOwner}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Public</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {isOwner && (
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Danger Zone</h3>
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-red-800">Delete Project</h4>
                      <p className="text-sm text-red-600 mt-1">
                        Once you delete a project, there is no going back. Please be certain.
                      </p>
                    </div>
                    <button
                      onClick={handleDeleteProject}
                      className="btn-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Project</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Collaborators */}
        {activeTab === 'collaborators' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add Collaborator</h3>
              <form onSubmit={handleAddCollaborator} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="form-label">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        value={newCollaborator.email}
                        onChange={(e) => setNewCollaborator(prev => ({ ...prev, email: e.target.value }))}
                        className="form-input pl-10"
                        placeholder="Enter email address"
                        disabled={!isOwner}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="form-label">Role</label>
                    <select
                      value={newCollaborator.role}
                      onChange={(e) => setNewCollaborator(prev => ({ ...prev, role: e.target.value }))}
                      className="form-input"
                      disabled={!isOwner}
                    >
                      <option value="viewer">Viewer</option>
                      <option value="collaborator">Collaborator</option>
                    </select>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={!isOwner || isAddingCollaborator}
                  className="btn-primary flex items-center space-x-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>{isAddingCollaborator ? 'Adding...' : 'Add Collaborator'}</span>
                </button>
              </form>
            </div>

            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Current Collaborators</h3>
              <div className="space-y-3">
                {collaborators.map(collaborator => (
                  <div key={collaborator.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {collaborator.name?.charAt(0) || collaborator.email?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{collaborator.name}</p>
                        <p className="text-xs text-gray-500">{collaborator.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(collaborator.role)}
                        <span className="text-sm text-gray-600">{getRoleLabel(collaborator.role)}</span>
                      </div>
                      
                      {isOwner && collaborator.role !== 'owner' && (
                        <div className="flex items-center space-x-2">
                          <select
                            value={collaborator.role}
                            onChange={(e) => handleUpdateCollaboratorRole(collaborator.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="viewer">Viewer</option>
                            <option value="collaborator">Collaborator</option>
                          </select>
                          
                          <button
                            onClick={() => handleRemoveCollaborator(collaborator.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Versions */}
        {activeTab === 'versions' && (
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Version History</h3>
            <div className="space-y-3">
              {versions.map(version => (
                <div key={version.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{version.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(version.createdAt).toLocaleString()} by {version.author?.name}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{version.id.substring(0, 8)}</span>
                    <button className="text-sm text-primary-600 hover:text-primary-700">
                      View
                    </button>
                  </div>
                </div>
              ))}
              
              {versions.length === 0 && (
                <div className="text-center py-8">
                  <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No versions yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSettings; 