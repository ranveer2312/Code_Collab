import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { projectService } from '../../services/projectService';
import websocketService from '../../services/websocketService';
import Editor from '@monaco-editor/react';
import { 
  Folder, 
  File, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Save, 
  GitCommit,
  Users,
  Settings,
  MoreVertical,
  Trash2,
  Download,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProjectEditor = () => {
  const { projectId } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showFileTree, setShowFileTree] = useState(true);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  useEffect(() => {
    fetchProjectData();
    setupWebSocket();
    
    return () => {
      websocketService.leaveProject();
    };
  }, [projectId]);

  useEffect(() => {
    if (token && user) {
      websocketService.connect(token, user.id);
    }
  }, [token, user]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const [projectResponse, filesResponse, collaboratorsResponse] = await Promise.all([
        projectService.getProject(projectId),
        projectService.getProjectFiles(projectId),
        projectService.getCollaborators(projectId)
      ]);
      
      setProject(projectResponse.data);
      setFiles(filesResponse.data);
      setCollaborators(collaboratorsResponse.data);
      
      // Select first file if available
      if (filesResponse.data.length > 0 && !selectedFile) {
        handleFileSelect(filesResponse.data[0]);
      }
    } catch (error) {
      console.error('Error fetching project data:', error);
      toast.error('Failed to load project');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocket = () => {
    websocketService.joinProject(projectId);
    
    websocketService.addEventListener('user_joined_project', (data) => {
      setOnlineUsers(prev => [...prev, data.user]);
      toast.success(`${data.user.name} joined the project`);
    });
    
    websocketService.addEventListener('user_left_project', (data) => {
      setOnlineUsers(prev => prev.filter(u => u.id !== data.user.id));
      toast.info(`${data.user.name} left the project`);
    });
    
    websocketService.addEventListener('file_content_changed', (data) => {
      if (data.userId !== user.id && data.filePath === selectedFile?.path) {
        setFileContent(data.content);
      }
    });
    
    websocketService.addEventListener('user_typing', (data) => {
      if (data.userId !== user.id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }
    });
  };

  const handleFileSelect = async (file) => {
    try {
      setSelectedFile(file);
      const response = await projectService.getFileContent(projectId, file.path);
      setFileContent(response.data.content);
    } catch (error) {
      console.error('Error loading file content:', error);
      toast.error('Failed to load file content');
    }
  };

  const handleEditorChange = (value, event) => {
    setFileContent(value);
    
    // Send typing status
    websocketService.sendTypingStatus(selectedFile?.path, true);
    
    // Clear previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Set new timeout
    const timeout = setTimeout(() => {
      websocketService.sendTypingStatus(selectedFile?.path, false);
    }, 1000);
    
    setTypingTimeout(timeout);
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    
    try {
      setSaving(true);
      await projectService.saveFileContent(projectId, selectedFile.path, fileContent);
      
      // Send content change to other users
      websocketService.sendFileContentChange(selectedFile.path, fileContent);
      
      toast.success('File saved successfully');
    } catch (error) {
      console.error('Error saving file:', error);
      toast.error('Failed to save file');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateFile = async (path, isDirectory = false) => {
    try {
      if (isDirectory) {
        // Handle directory creation
        toast.info('Directory creation not implemented yet');
        return;
      }
      
      const response = await projectService.createFile(projectId, path, '');
      const newFile = response.data;
      setFiles(prev => [...prev, newFile]);
      handleFileSelect(newFile);
      toast.success('File created successfully');
    } catch (error) {
      console.error('Error creating file:', error);
      toast.error('Failed to create file');
    }
  };

  const handleDeleteFile = async (file) => {
    if (!window.confirm(`Are you sure you want to delete ${file.name}?`)) {
      return;
    }
    
    try {
      await projectService.deleteFile(projectId, file.path);
      setFiles(prev => prev.filter(f => f.path !== file.path));
      
      if (selectedFile?.path === file.path) {
        setSelectedFile(null);
        setFileContent('');
      }
      
      toast.success('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  };

  const handleCreateVersion = async () => {
    const message = prompt('Enter commit message:');
    if (!message) return;
    
    try {
      await projectService.createVersion(projectId, {
        message,
        description: `Updated ${selectedFile?.name || 'files'}`
      });
      toast.success('Version created successfully');
    } catch (error) {
      console.error('Error creating version:', error);
      toast.error('Failed to create version');
    }
  };

  const getFileIcon = (file) => {
    if (file.type === 'directory') {
      return <Folder className="h-4 w-4 text-blue-500" />;
    }
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    const iconMap = {
      js: '⚡',
      ts: '🔷',
      jsx: '⚛️',
      tsx: '⚛️',
      py: '🐍',
      java: '☕',
      cpp: '⚙️',
      c: '⚙️',
      html: '🌐',
      css: '🎨',
      json: '📄',
      md: '📝',
      txt: '📄'
    };
    
    return <span className="text-sm">{iconMap[extension] || '📄'}</span>;
  };

  const renderFileTree = (fileList, level = 0) => {
    return fileList.map(file => (
      <div key={file.path}>
        <div 
          className={`flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 cursor-pointer ${
            selectedFile?.path === file.path ? 'bg-blue-50 border-r-2 border-blue-500' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => file.type === 'directory' ? null : handleFileSelect(file)}
        >
          {file.type === 'directory' && (
            <ChevronRight className="h-3 w-3 text-gray-400" />
          )}
          {getFileIcon(file)}
          <span className="text-sm truncate">{file.name}</span>
        </div>
        {file.children && renderFileTree(file.children, level + 1)}
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFileTree(!showFileTree)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              {showFileTree ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            <h1 className="text-lg font-semibold text-gray-900">{project?.name}</h1>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              project?.visibility === 'public' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {project?.visibility}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {isTyping && (
              <span className="text-sm text-gray-500">Someone is typing...</span>
            )}
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </button>
            
            <button
              onClick={handleCreateVersion}
              className="btn-secondary flex items-center space-x-2"
            >
              <GitCommit className="h-4 w-4" />
              <span>Commit</span>
            </button>
            
            <button
              onClick={() => setShowCollaborators(!showCollaborators)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>{collaborators.length}</span>
            </button>
            
            <Link
              to={`/project/${projectId}/settings`}
              className="btn-secondary"
            >
              <Settings className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* File Tree Sidebar */}
        {showFileTree && (
          <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Files</h3>
                <button
                  onClick={() => handleCreateFile('new-file.txt')}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              {renderFileTree(files)}
            </div>
          </div>
        )}

        {/* Editor */}
        <div className="flex-1 flex flex-col">
          {selectedFile ? (
            <>
              {/* File Header */}
              <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getFileIcon(selectedFile)}
                  <span className="text-sm font-medium">{selectedFile.name}</span>
                  <span className="text-xs text-gray-500">{selectedFile.path}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDeleteFile(selectedFile)}
                    className="p-1 hover:bg-red-50 text-red-600 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Monaco Editor */}
              <div className="flex-1">
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  language={selectedFile.name.split('.').pop() || 'plaintext'}
                  value={fileContent}
                  onChange={handleEditorChange}
                  onMount={(editor, monaco) => {
                    editorRef.current = editor;
                    monacoRef.current = monaco;
                  }}
                  options={{
                    minimap: { enabled: true },
                    fontSize: 14,
                    fontFamily: 'JetBrains Mono, monospace',
                    theme: 'vs-dark',
                    automaticLayout: true,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    cursorStyle: 'line',
                    automaticLayout: true,
                  }}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <File className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No file selected</h3>
                <p className="text-gray-600">Select a file from the sidebar to start editing</p>
              </div>
            </div>
          )}
        </div>

        {/* Collaborators Sidebar */}
        {showCollaborators && (
          <div className="w-64 bg-gray-50 border-l border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Collaborators</h3>
            <div className="space-y-3">
              {collaborators.map(collaborator => (
                <div key={collaborator.id} className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {collaborator.name?.charAt(0) || collaborator.email?.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{collaborator.name}</p>
                    <p className="text-xs text-gray-500">{collaborator.email}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    onlineUsers.some(u => u.id === collaborator.id) ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectEditor; 