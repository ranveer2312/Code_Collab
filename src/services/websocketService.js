import io from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.projectId = null;
    this.userId = null;
    this.listeners = new Map();
  }

  connect(token, userId) {
    if (this.socket) {
      this.disconnect();
    }

    this.userId = userId;
    
    this.socket = io(process.env.REACT_APP_WS_URL || 'http://localhost:8080', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      this.emit('user_connected', { userId: this.userId });
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    // Project-specific events
    this.socket.on('user_joined_project', (data) => {
      this.notifyListeners('user_joined_project', data);
    });

    this.socket.on('user_left_project', (data) => {
      this.notifyListeners('user_left_project', data);
    });

    this.socket.on('file_content_changed', (data) => {
      this.notifyListeners('file_content_changed', data);
    });

    this.socket.on('cursor_position_changed', (data) => {
      this.notifyListeners('cursor_position_changed', data);
    });

    this.socket.on('selection_changed', (data) => {
      this.notifyListeners('selection_changed', data);
    });

    this.socket.on('user_typing', (data) => {
      this.notifyListeners('user_typing', data);
    });

    this.socket.on('version_created', (data) => {
      this.notifyListeners('version_created', data);
    });

    this.socket.on('project_updated', (data) => {
      this.notifyListeners('project_updated', data);
    });
  }

  joinProject(projectId) {
    if (this.socket && this.socket.connected) {
      this.projectId = projectId;
      this.emit('join_project', { projectId });
    }
  }

  leaveProject() {
    if (this.socket && this.socket.connected && this.projectId) {
      this.emit('leave_project', { projectId: this.projectId });
      this.projectId = null;
    }
  }

  // File editing events
  sendFileContentChange(filePath, content, cursorPosition) {
    if (this.socket && this.socket.connected && this.projectId) {
      this.emit('file_content_change', {
        projectId: this.projectId,
        filePath,
        content,
        cursorPosition,
        userId: this.userId,
        timestamp: Date.now()
      });
    }
  }

  sendCursorPosition(filePath, position) {
    if (this.socket && this.socket.connected && this.projectId) {
      this.emit('cursor_position', {
        projectId: this.projectId,
        filePath,
        position,
        userId: this.userId,
        timestamp: Date.now()
      });
    }
  }

  sendSelection(filePath, selection) {
    if (this.socket && this.socket.connected && this.projectId) {
      this.emit('selection_change', {
        projectId: this.projectId,
        filePath,
        selection,
        userId: this.userId,
        timestamp: Date.now()
      });
    }
  }

  sendTypingStatus(filePath, isTyping) {
    if (this.socket && this.socket.connected && this.projectId) {
      this.emit('typing_status', {
        projectId: this.projectId,
        filePath,
        isTyping,
        userId: this.userId,
        timestamp: Date.now()
      });
    }
  }

  // Event listener management
  addEventListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  removeEventListener(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  emit(event, data) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.projectId = null;
      this.userId = null;
      this.listeners.clear();
    }
  }

  isConnected() {
    return this.socket && this.socket.connected;
  }

  getProjectId() {
    return this.projectId;
  }

  getUserId() {
    return this.userId;
  }
}

// Create a singleton instance
const websocketService = new WebSocketService();
export default websocketService; 