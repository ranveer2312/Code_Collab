# CodeCollab - Real-time Code Collaboration Platform

A GitHub-inspired code collaboration platform built with React, featuring real-time multi-user code editing, version control, and team-based access with secure JWT authentication.

## 🚀 Features

- **User Authentication**: JWT-based registration and login system
- **Real-time Collaboration**: Multi-user code editing with WebSocket support
- **Project Management**: Create, edit, and manage code projects
- **Team Collaboration**: Role-based access (Owner, Collaborator, Viewer)
- **Version Control**: Save versions like commits with commit messages
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- **Code Editor**: Monaco Editor with syntax highlighting and IntelliSense

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **React Router** - Client-side routing
- **Monaco Editor** - Professional code editor
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.io Client** - Real-time WebSocket communication
- **Axios** - HTTP client for API calls
- **JWT Decode** - JWT token handling
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications

### Backend (Required)
- **Spring Boot** - Java backend framework
- **MySQL** - Database
- **WebSocket** - Real-time communication
- **JWT** - Authentication

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ranveer2312/Code_Collab.git
   cd Code_Collab
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   npm run install-deps
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:8080/api
   REACT_APP_WS_URL=http://localhost:8080
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   │   ├── Login.js
│   │   └── Register.js
│   ├── dashboard/      # Dashboard components
│   │   ├── Dashboard.js
│   │   └── CreateProjectModal.js
│   ├── editor/         # Code editor components
│   │   └── ProjectEditor.js
│   ├── layout/         # Layout components
│   │   └── Navbar.js
│   ├── profile/        # User profile components
│   │   └── Profile.js
│   └── projects/       # Project management components
│       └── ProjectSettings.js
├── contexts/           # React contexts
│   └── AuthContext.js
├── services/           # API services
│   ├── authService.js
│   ├── projectService.js
│   └── websocketService.js
└── App.js             # Main application component
```

## 🔧 Available Scripts

- `npm start` - Start the development server
- `npm run dev` - Start the development server (alias for start)
- `npm run build` - Build the app for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run install-deps` - Install dependencies

## 🌐 API Endpoints

The frontend expects the following API endpoints from your Spring Boot backend:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Projects
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Files
- `GET /api/projects/:id/files` - Get project files
- `GET /api/projects/:id/files/content` - Get file content
- `PUT /api/projects/:id/files/content` - Save file content
- `POST /api/projects/:id/files` - Create new file
- `DELETE /api/projects/:id/files` - Delete file

### Collaborators
- `GET /api/projects/:id/collaborators` - Get project collaborators
- `POST /api/projects/:id/collaborators` - Add collaborator
- `PUT /api/projects/:id/collaborators/:userId` - Update collaborator role
- `DELETE /api/projects/:id/collaborators/:userId` - Remove collaborator

### Versions
- `GET /api/projects/:id/versions` - Get project versions
- `POST /api/projects/:id/versions` - Create new version

## 🔌 WebSocket Events

The frontend sends and listens for these WebSocket events:

### Client to Server
- `join_project` - Join a project room
- `leave_project` - Leave a project room
- `file_content_change` - File content changed
- `cursor_position` - Cursor position changed
- `selection_change` - Text selection changed
- `typing_status` - User typing status

### Server to Client
- `user_joined_project` - User joined the project
- `user_left_project` - User left the project
- `file_content_changed` - File content was changed
- `cursor_position_changed` - Cursor position changed
- `selection_changed` - Selection changed
- `user_typing` - User is typing

## 🎨 UI Components

### Authentication
- **Login Form**: Email/password login with validation
- **Register Form**: User registration with password strength indicator
- **Protected Routes**: Automatic redirection for unauthenticated users

### Dashboard
- **Project Grid/List View**: Toggle between grid and list views
- **Search & Filter**: Search projects and filter by visibility
- **Create Project Modal**: Form to create new projects
- **Project Cards**: Display project info with quick actions

### Code Editor
- **Monaco Editor**: Professional code editor with syntax highlighting
- **File Tree**: Navigate project files and folders
- **Real-time Collaboration**: See other users' cursors and changes
- **Save & Commit**: Save files and create versions
- **Collaborator Panel**: View online collaborators

### Project Settings
- **General Settings**: Project name, description, visibility
- **Collaborator Management**: Add, remove, and manage team members
- **Version History**: View and manage project versions
- **Danger Zone**: Delete project (owner only)

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Owner, Collaborator, Viewer roles
- **Protected Routes**: Client-side route protection
- **Input Validation**: Form validation and sanitization
- **Secure API Calls**: Automatic token inclusion in requests

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_WS_URL=https://your-api-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Ranveer** - *Initial work* - [ranveer2312](https://github.com/ranveer2312)

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Professional code editor
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide React](https://lucide.dev/) - Beautiful icons
- [React Hot Toast](https://react-hot-toast.com/) - Toast notifications

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.
