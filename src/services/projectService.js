import api from './authService';

export const projectService = {
  // Get all projects for the current user
  getProjects: async () => {
    return api.get('/projects');
  },

  // Get a specific project by ID
  getProject: async (projectId) => {
    return api.get(`/projects/${projectId}`);
  },

  // Create a new project
  createProject: async (projectData) => {
    return api.post('/projects', projectData);
  },

  // Update project details
  updateProject: async (projectId, projectData) => {
    return api.put(`/projects/${projectId}`, projectData);
  },

  // Delete a project
  deleteProject: async (projectId) => {
    return api.delete(`/projects/${projectId}`);
  },

  // Get project files
  getProjectFiles: async (projectId) => {
    return api.get(`/projects/${projectId}/files`);
  },

  // Get a specific file content
  getFileContent: async (projectId, filePath) => {
    return api.get(`/projects/${projectId}/files/content`, {
      params: { path: filePath }
    });
  },

  // Save file content
  saveFileContent: async (projectId, filePath, content) => {
    return api.put(`/projects/${projectId}/files/content`, {
      path: filePath,
      content: content
    });
  },

  // Create a new file
  createFile: async (projectId, filePath, content) => {
    return api.post(`/projects/${projectId}/files`, {
      path: filePath,
      content: content
    });
  },

  // Delete a file
  deleteFile: async (projectId, filePath) => {
    return api.delete(`/projects/${projectId}/files`, {
      params: { path: filePath }
    });
  },

  // Get project collaborators
  getCollaborators: async (projectId) => {
    return api.get(`/projects/${projectId}/collaborators`);
  },

  // Add collaborator to project
  addCollaborator: async (projectId, email, role) => {
    return api.post(`/projects/${projectId}/collaborators`, {
      email,
      role
    });
  },

  // Update collaborator role
  updateCollaboratorRole: async (projectId, userId, role) => {
    return api.put(`/projects/${projectId}/collaborators/${userId}`, {
      role
    });
  },

  // Remove collaborator from project
  removeCollaborator: async (projectId, userId) => {
    return api.delete(`/projects/${projectId}/collaborators/${userId}`);
  },

  // Get project versions (commits)
  getVersions: async (projectId) => {
    return api.get(`/projects/${projectId}/versions`);
  },

  // Create a new version (commit)
  createVersion: async (projectId, versionData) => {
    return api.post(`/projects/${projectId}/versions`, versionData);
  },

  // Get a specific version
  getVersion: async (projectId, versionId) => {
    return api.get(`/projects/${projectId}/versions/${versionId}`);
  },

  // Revert to a specific version
  revertToVersion: async (projectId, versionId) => {
    return api.post(`/projects/${projectId}/versions/${versionId}/revert`);
  },

  // Get project activity/feed
  getActivity: async (projectId) => {
    return api.get(`/projects/${projectId}/activity`);
  },

  // Search projects
  searchProjects: async (query) => {
    return api.get('/projects/search', {
      params: { q: query }
    });
  },

  // Fork a project
  forkProject: async (projectId) => {
    return api.post(`/projects/${projectId}/fork`);
  },

  // Get project statistics
  getProjectStats: async (projectId) => {
    return api.get(`/projects/${projectId}/stats`);
  },
}; 