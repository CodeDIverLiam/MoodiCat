# Team Assignment - Moodicat Project

## Team Members
- **zijian xue** - Backend Developer 
- **yanjun bao** - Backend Developer
- **jiaming shi** - Frontend Developer 
- **jiaqi dang** - Frontend Developer 
- **lehe zhao** - Frontend Developer 


---

## Backend Assignments

### zijian xue - 
**Responsibility**: All backend functionality except Diary CRUD operations

**Files**:

**AI & Chat**:
- `server/src/main/java/com/aidiary/controller/AiController.java` - AI chat controller
- `server/src/main/java/com/aidiary/controller/ChatController.java` - Chat controller
- `server/src/main/java/com/aidiary/controller/ChatSessionController.java` - Chat session controller
- `server/src/main/java/com/aidiary/service/AiService.java` - AI service
- `server/src/main/java/com/aidiary/service/ChatSessionService.java` - Chat session service
- `server/src/main/java/com/aidiary/tools/DiaryTools.java` - AI diary tools
- `server/src/main/java/com/aidiary/tools/TaskTools.java` - AI task tools
- `server/src/main/java/com/aidiary/mapper/ChatSessionMapper.java` - Chat session mapper
- `server/src/main/resources/mapper/ChatSessionMapper.xml` - Chat session mapping
- `server/src/main/java/com/aidiary/model/ChatMessage.java` - Chat message model
- `server/src/main/java/com/aidiary/model/ChatSession.java` - Chat session model
- `server/src/main/java/com/aidiary/config/ChatConfig.java` - Chat configuration

**Tasks**:
- `server/src/main/java/com/aidiary/controller/TaskController.java` - Task controller
- `server/src/main/java/com/aidiary/service/TaskService.java` - Task service
- `server/src/main/java/com/aidiary/mapper/TaskMapper.java` - Task mapper
- `server/src/main/resources/mapper/TaskMapper.xml` - Task mapping
- `server/src/main/java/com/aidiary/model/Task.java` - Task model

**Reports**:
- `server/src/main/java/com/aidiary/controller/ReportController.java` - Report controller
- `server/src/main/java/com/aidiary/service/ReportService.java` - Report service

**Authentication & Security**:
- `server/src/main/java/com/aidiary/controller/AuthController.java` - Auth controller
- `server/src/main/java/com/aidiary/service/AuthService.java` - Auth service
- `server/src/main/java/com/aidiary/security/JwtTokenProvider.java` - JWT token provider
- `server/src/main/java/com/aidiary/security/JwtTokenFilter.java` - JWT filter
- `server/src/main/java/com/aidiary/security/CustomUserDetailsService.java` - User details service
- `server/src/main/java/com/aidiary/security/SecurityUtils.java` - Security utilities
- `server/src/main/java/com/aidiary/config/SecurityConfig.java` - Security configuration
- `server/src/main/java/com/aidiary/mapper/UserMapper.java` - User mapper
- `server/src/main/resources/mapper/UserMapper.xml` - User mapping
- `server/src/main/java/com/aidiary/model/User.java` - User model

**DTOs**:
- `server/src/main/java/com/aidiary/dto/LoginRequest.java`
- `server/src/main/java/com/aidiary/dto/LoginResponse.java`
- `server/src/main/java/com/aidiary/dto/RegisterRequest.java`
- `server/src/main/java/com/aidiary/dto/AiChatRequest.java`
- `server/src/main/java/com/aidiary/dto/AiChatResponse.java`
- `server/src/main/java/com/aidiary/dto/DailySummaryResponse.java`

**Other**:
- `server/src/main/java/com/aidiary/AiDiaryApplication.java` - Main application
- `server/src/main/java/com/aidiary/service/ReminderService.java` - Reminder service (internal use)
- `server/src/main/java/com/aidiary/controller/ReminderController.java` - Reminder controller (internal use)
- `server/src/main/java/com/aidiary/mapper/ReminderMapper.java` - Reminder mapper
- `server/src/main/resources/mapper/ReminderMapper.xml` - Reminder mapping
- `server/src/main/java/com/aidiary/model/Reminder.java` - Reminder model

**Features**:
- AI chat integration and processing
- Chat session management
- Task CRUD operations
- Report generation (daily summary, mood trends)
- User authentication and authorization
- JWT token management
- Security configuration
- AI tool integration (diary and task tools)
- Application configuration

**API Endpoints**:
- `/api/v1/auth/**` - Authentication endpoints
- `/api/v1/tasks/**` - Task management endpoints
- `/api/v1/ai/**` - AI chat endpoints
- `/api/v1/chat-sessions/**` - Chat session endpoints
- `/api/v1/reports/**` - Report endpoints

---

### yanjun bao - Diary CRUD Backend
**Responsibility**: Diary entry backend CRUD operations

**Files**:
- `server/src/main/java/com/aidiary/controller/DiaryEntryController.java` - Diary REST controller
- `server/src/main/java/com/aidiary/service/DiaryEntryService.java` - Diary business logic
- `server/src/main/java/com/aidiary/mapper/DiaryEntryMapper.java` - Diary data access interface
- `server/src/main/resources/mapper/DiaryEntryMapper.xml` - Diary MyBatis mapping
- `server/src/main/java/com/aidiary/model/DiaryEntry.java` - Diary entity model

**API Endpoints**:
- `GET /api/v1/diary-entries` - List diary entries
- `GET /api/v1/diary-entries/{id}` - Get diary entry by ID
- `POST /api/v1/diary-entries` - Create diary entry
- `PUT /api/v1/diary-entries/{id}` - Update diary entry
- `DELETE /api/v1/diary-entries/{id}` - Delete diary entry

**Features**:
- Diary entry CRUD operations
- Date range filtering
- User authorization checks
- Database operations

---

## Frontend Assignments

### jiaming shi - AI Chat, Authentication & Core Infrastructure
**Responsibility**: AI Chat functionality, Authentication, Layout, and Common components

**Files**:
- `client/src/components/AIChatPanel.jsx` - Main AI chat interface
- `client/src/api/client.js` - API client configuration
- `client/src/App.jsx` - Main application component
- `client/src/pages/SimpleLogin.jsx` - Login page
- `client/src/components/common/ProtectedRoute.jsx` - Route protection
- `client/src/components/common/Loading.jsx` - Loading component
- `client/src/components/common/ErrorState.jsx` - Error state component
- `client/src/components/common/Empty.jsx` - Empty state component
- `client/src/components/Logo.jsx` - Logo component
- `client/src/components/Sidebar.jsx` - Sidebar component
- `client/src/components/MoodicatCard.jsx` - Moodicat card component
- `client/src/hooks/useAuth.js` - Authentication hook
- `client/src/api/auth.js` - Authentication API
- `client/src/main.jsx` - Application entry point
- `client/src/index.css` - Global styles
- `client/src/App.css` - App styles

**Features**:
- AI chat message sending/receiving
- Chat message display and formatting
- AI response handling
- Tool call visualization
- User authentication (login/logout)
- Application routing and navigation
- Main layout and structure
- Common reusable components
- Global state management

---

### jiaqi dang - Reports & Analytics Feature
**Responsibility**: Reports page and data visualization

**Files**:
- `client/src/pages/ReportsPage.jsx` - Reports page
- `client/src/components/Heatmap.jsx` - Activity heatmap
- `client/src/components/MoodBar.jsx` - Weekly mood & energy bar chart
- `client/src/components/MoodDisplayCard.jsx` - Mood display card
- `client/src/components/ImportantCard.jsx` - Important metrics card
- `client/src/components/FeatureCard.jsx` - Feature card component
- `client/src/components/TimeSelector.jsx` - Date/time selector
- `client/src/hooks/useReports.js` - Reports hook
- `client/src/api/reports.js` - Reports API
  **Diary**:
- `client/src/pages/DiaryPage.jsx` - Diary page
- `client/src/components/DiaryPanel.jsx` - Diary panel component
- `client/src/components/forms/DiaryForm.jsx` - Diary form component
- `client/src/components/lists/DiaryList.jsx` - Diary list component
- `client/src/components/NotebookPanel.jsx` - Notebook panel
- `client/src/hooks/useDiary.js` - Diary hook
- `client/src/api/diary.js` - Diary API
**Features**:
- Daily summary display
- Mood trend visualization
- Activity heatmap
- Weekly mood & energy charts
- Date range filtering
- Diary entry creation, editing, deletion
- Date range filtering for diary entries
- Diary list display
- Diary form validation
---

### lehe zhao - Tasks & Diary Management Features
**Responsibility**: Task management and Diary management (CRUD operations and UI)

**Files**:

**Tasks**:
- `client/src/pages/TasksPage.jsx` - Tasks page
- `client/src/components/TaskPanel.jsx` - Task panel component
- `client/src/components/TaskListNotebook.jsx` - Notebook-style task list
- `client/src/components/forms/TaskForm.jsx` - Task form component
- `client/src/components/lists/TaskList.jsx` - Task list component
- `client/src/hooks/useTasks.js` - Tasks hook
- `client/src/api/tasks.js` - Tasks API



**Features**:
- Task creation, editing, deletion
- Task status filtering (pending, completed, cancelled)
- Task list display
- Task form validation


---

## Excluded Files (Not Assigned - Deprecated/Mock Pages)

These files are not assigned as they are deprecated, test files, or mock pages:

**Frontend**:
- `client/src/pages/RemindersPage.jsx` - Deprecated reminders page
- `client/src/components/lists/ReminderList.jsx` - Deprecated reminder list
- `client/src/components/forms/ReminderForm.jsx` - Deprecated reminder form
- `client/src/hooks/useReminders.js` - Deprecated reminders hook
- `client/src/api/reminders.js` - Deprecated reminders API
- `client/src/components/AITest.jsx` - Test component
- `client/src/TestApp.jsx` - Test application
- `client/src/pages/Login.jsx` - Deprecated login page (using SimpleLogin instead)
- `client/src/pages/AppLayout.jsx` - Deprecated layout (using MainLayout in App.jsx instead)

**Test Files**:
- `client/src/test/` - All test files

---


## Notes

1. **Shared Dependencies**: API client (`client.js`) and common components are used by all frontend developers but maintained by jiaming shi.

2. **Communication**: Team members should coordinate on shared interfaces and API contracts.

3. **Backend API**: Frontend developers should refer to backend API documentation for endpoint specifications.

4. **Code Review**: All code changes should be reviewed before merging to main branch.

5. **Testing**: Each developer is responsible for testing their assigned features.
