import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProjectEditor = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
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
  
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  // Mock project data
  const mockProject = {
    id: projectId,
    name: 'React Todo App',
    description: 'A simple todo application built with React and TypeScript',
    visibility: 'public',
    ownerId: '1',
    language: 'typescript'
  };

  // Mock files data
  const mockFiles = [
    {
      id: '1',
      name: 'App.tsx',
      path: 'src/App.tsx',
      type: 'file',
      content: `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to CodeCollab</h1>
        <p>Start editing your code here!</p>
      </header>
    </div>
  );
}

export default App;`
    },
    {
      id: '2',
      name: 'index.tsx',
      path: 'src/index.tsx',
      type: 'file',
      content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
    },
    {
      id: '3',
      name: 'package.json',
      path: 'package.json',
      type: 'file',
      content: `{
  "name": "codecollab-demo",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^4.9.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  }
}`
    }
  ];

  // Mock collaborators data
  const mockCollaborators = [
    { id: '2', name: 'John Doe', email: 'john@example.com', role: 'collaborator' },
    { id: '3', name: 'Jane Smith', email: 'jane@example.com', role: 'viewer' }
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
      setFiles(mockFiles);
      setCollaborators(mockCollaborators);
      
      // Select first file if available
      if (mockFiles.length > 0 && !selectedFile) {
        handleFileSelect(mockFiles[0]);
      }
    } catch (error) {
      console.error('Error fetching project data:', error);
      toast.error('Failed to load project');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (file) => {
    try {
      setSelectedFile(file);
      setFileContent(file.content || '');
    } catch (error) {
      console.error('Error loading file content:', error);
      toast.error('Failed to load file content');
    }
  };

  const handleEditorChange = (value, event) => {
    setFileContent(value);
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    
    try {
      setSaving(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update file content in local state
      setFiles(prev => prev.map(file => 
        file.id === selectedFile.id 
          ? { ...file, content: fileContent }
          : file
      ));
      
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
        toast.info('Directory creation not implemented yet');
        return;
      }
      
      const newFile = {
        id: Date.now().toString(),
        name: path.split('/').pop(),
        path: path,
        type: 'file',
        content: ''
      };
      
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
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
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
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