# Agile Sprint Plan - Moodicat Project

## Team Members
- **zijian xue** - Full-stack Developer (Tech Lead)
- **jiaming shi** - Frontend Developer  
- **jiaqi dang** - Frontend Developer
- **lehe zhao** - Frontend Developer
- **yanjun bao** - Backend Developer

---

## Sprint Overview
**Sprint Goal**: Complete Moodicat application with AI-powered diary and task management

**Sprint Duration**: 2 weeks (can be adjusted)

---

## Epic 1: Core Infrastructure & Authentication
**Owner**: zijian xue  
**Priority**: P0 (Critical)

### User Stories

#### Story 1.1: User Authentication System
**Owner**: zijian xue (Backend), jiaming shi (Frontend)

- **As a** user
- **I want to** register and login to my account
- **So that** I can access my personal diary and tasks

**Tasks**:
- [ ] Implement authentication service (backend) - zijian xue
- [ ] Create JWT token management - zijian xue
- [ ] Build login/register UI (frontend) - jiaming shi
- [ ] Implement protected routes - jiaming shi
- [ ] Add logout functionality - jiaming shi

**Acceptance Criteria**:
- Users can register with username, email, password
- Users can login and receive JWT token
- Protected routes redirect to login if not authenticated
- Logout clears session and redirects to login

**Files**:
- Backend: `AuthController.java`, `AuthService.java`, `JwtTokenProvider.java`, `SecurityConfig.java`
- Frontend: `SimpleLogin.jsx`, `useAuth.js`, `ProtectedRoute.jsx`, `App.jsx`

---

#### Story 1.2: Application Layout & Navigation
**Owner**: jiaming shi

- **As a** user
- **I want to** see a consistent layout and navigation
- **So that** I can easily access all features

**Tasks**:
- [ ] Create main application layout
- [ ] Implement sidebar/navigation component
- [ ] Add logo and branding
- [ ] Create common UI components (Loading, Error, Empty states)

**Acceptance Criteria**:
- Consistent layout across all pages
- Navigation works between main features
- Loading and error states are handled gracefully

**Files**:
- Frontend: `App.jsx`, `Logo.jsx`, `Sidebar.jsx`, `common/*.jsx`

---

## Epic 2: Diary Feature
**Owner**: yanjun bao (Backend), lehe zhao (Frontend)  
**Priority**: P0 (Critical)

### User Stories

#### Story 2.1: Diary Entry CRUD (Backend)
**Owner**: yanjun bao

- **As a** system
- **I need** diary entry CRUD API endpoints
- **So that** users can manage their diary entries

**Tasks**:
- [ ] Implement DiaryEntryController with REST endpoints
- [ ] Create DiaryEntryService with business logic
- [ ] Set up DiaryEntryMapper with database operations
- [ ] Add user authorization checks
- [ ] Write MyBatis mapper XML

**Acceptance Criteria**:
- All CRUD endpoints work correctly
- User can only access their own diary entries
- Date range filtering works
- Proper error handling and validation

**Files**:
- Backend: `DiaryEntryController.java`, `DiaryEntryService.java`, `DiaryEntryMapper.java`, `DiaryEntryMapper.xml`, `DiaryEntry.java`

**Story Points**: 5

---

#### Story 2.2: Diary Entry UI (Frontend)
**Owner**: lehe zhao

- **As a** user
- **I want to** create, view, edit, and delete diary entries
- **So that** I can record my daily thoughts and moods

**Tasks**:
- [ ] Create DiaryPage component
- [ ] Build DiaryForm for creating/editing
- [ ] Implement DiaryList to display entries
- [ ] Add date range filtering
- [ ] Integrate with diary API
- [ ] Create DiaryPanel for main view

**Acceptance Criteria**:
- Users can create new diary entries
- Users can edit existing entries
- Users can delete entries
- Date filtering works correctly
- Entries display with title, content, mood, date

**Files**:
- Frontend: `DiaryPage.jsx`, `DiaryPanel.jsx`, `DiaryForm.jsx`, `DiaryList.jsx`, `useDiary.js`, `api/diary.js`

**Story Points**: 8

---

## Epic 3: Task Management Feature
**Owner**: lehe zhao (Frontend), zijian xue (Backend)  
**Priority**: P1 (High)

### User Stories

#### Story 3.1: Task CRUD Backend
**Owner**: zijian xue

- **As a** system
- **I need** task CRUD API endpoints
- **So that** users can manage their tasks

**Tasks**:
- [ ] Implement TaskController with REST endpoints
- [ ] Create TaskService with business logic
- [ ] Set up TaskMapper with database operations
- [ ] Add status filtering support

**Acceptance Criteria**:
- All CRUD endpoints work correctly
- Status filtering works (pending, completed, cancelled)
- User authorization enforced

**Files**:
- Backend: `TaskController.java`, `TaskService.java`, `TaskMapper.java`, `TaskMapper.xml`, `Task.java`

**Story Points**: 5

---

#### Story 3.2: Task Management UI
**Owner**: lehe zhao

- **As a** user
- **I want to** manage my tasks with status tracking
- **So that** I can organize my daily activities

**Tasks**:
- [ ] Create TasksPage component
- [ ] Build TaskForm for creating/editing
- [ ] Implement TaskList with status display
- [ ] Add status filtering tabs
- [ ] Create TaskPanel for main view
- [ ] Implement TaskListNotebook style

**Acceptance Criteria**:
- Users can create tasks with title, description, due date
- Users can update task status
- Users can filter tasks by status
- Tasks display in organized list/notebook view

**Files**:
- Frontend: `TasksPage.jsx`, `TaskPanel.jsx`, `TaskForm.jsx`, `TaskList.jsx`, `TaskListNotebook.jsx`, `useTasks.js`, `api/tasks.js`

**Story Points**: 8

---

## Epic 4: AI Chat Feature
**Owner**: jiaming shi (Frontend), zijian xue (Backend)  
**Priority**: P1 (High)

### User Stories

#### Story 4.1: AI Chat Backend Integration
**Owner**: zijian xue

- **As a** system
- **I need** AI chat processing with tool integration
- **So that** users can interact with AI assistant

**Tasks**:
- [ ] Integrate AI chat service (DashScope)
- [ ] Implement chat session management
- [ ] Create DiaryTools and TaskTools for AI
- [ ] Set up chat message storage
- [ ] Configure AI system prompts

**Acceptance Criteria**:
- AI chat responds to user messages
- AI can call diary and task creation tools
- Chat history is maintained per session
- Tool execution results are returned to user

**Files**:
- Backend: `AiController.java`, `AiService.java`, `ChatSessionService.java`, `DiaryTools.java`, `TaskTools.java`, `ChatConfig.java`

**Story Points**: 13

---

#### Story 4.2: AI Chat UI
**Owner**: jiaming shi

- **As a** user
- **I want to** chat with AI assistant to manage diary and tasks
- **So that** I can quickly record entries or create tasks via conversation

**Tasks**:
- [ ] Create AIChatPanel component
- [ ] Implement message input and display
- [ ] Add loading states during AI processing
- [ ] Handle tool call responses
- [ ] Format AI responses nicely
- [ ] Add chat history display

**Acceptance Criteria**:
- Users can send messages to AI
- AI responses display clearly
- Tool execution feedback is shown
- Chat interface is responsive and user-friendly

**Files**:
- Frontend: `AIChatPanel.jsx`, `api/client.js` (AI endpoints)

**Story Points**: 8

---

## Epic 5: Reports & Analytics
**Owner**: jiaqi dang (Frontend), zijian xue (Backend)  
**Priority**: P2 (Medium)

### User Stories

#### Story 5.1: Reports Backend API
**Owner**: zijian xue

- **As a** system
- **I need** report generation APIs
- **So that** users can see summaries and trends

**Tasks**:
- [ ] Implement ReportController
- [ ] Create daily summary endpoint
- [ ] Build mood trend analysis
- [ ] Add today's mood summary
- [ ] Integrate AI for mood analysis

**Acceptance Criteria**:
- Daily summary includes tasks and diary entries
- Mood trend returns JSON data for visualization
- AI-generated suggestions work

**Files**:
- Backend: `ReportController.java`, `ReportService.java`

**Story Points**: 8

---

#### Story 5.2: Reports & Analytics UI
**Owner**: jiaqi dang

- **As a** user
- **I want to** view my activity reports and mood trends
- **So that** I can understand my patterns over time

**Tasks**:
- [ ] Create ReportsPage layout
- [ ] Implement Heatmap component for activity
- [ ] Build MoodBar chart for weekly mood
- [ ] Add MoodDisplayCard for today's mood
- [ ] Create ImportantCard for key metrics
- [ ] Implement date range selector
- [ ] Add daily summary display

**Acceptance Criteria**:
- Reports page displays all visualizations
- Heatmap shows activity over time
- Mood charts are interactive and readable
- Date filtering updates all charts
- Daily summary shows tasks completed and AI suggestions

**Files**:
- Frontend: `ReportsPage.jsx`, `Heatmap.jsx`, `MoodBar.jsx`, `MoodDisplayCard.jsx`, `ImportantCard.jsx`, `FeatureCard.jsx`, `TimeSelector.jsx`, `useReports.js`, `api/reports.js`

**Story Points**: 13

---

## Sprint Backlog Summary

### Backend Stories
| Story | Owner | Points | Priority |
|-------|-------|--------|----------|
| 1.1 Authentication | zijian xue | 8 | P0 |
| 2.1 Diary CRUD | yanjun bao | 5 | P0 |
| 3.1 Task CRUD | zijian xue | 5 | P1 |
| 4.1 AI Chat Backend | zijian xue | 13 | P1 |
| 5.1 Reports API | zijian xue | 8 | P2 |
| **Total Backend** | | **39** | |

### Frontend Stories
| Story | Owner | Points | Priority |
|-------|-------|--------|----------|
| 1.2 Layout & Navigation | jiaming shi | 5 | P0 |
| 2.2 Diary UI | lehe zhao | 8 | P0 |
| 3.2 Task Management UI | lehe zhao | 8 | P1 |
| 4.2 AI Chat UI | jiaming shi | 8 | P1 |
| 5.2 Reports UI | jiaqi dang | 13 | P2 |
| **Total Frontend** | | **42** | |

### Total Sprint Points: 81

---

## Sprint Timeline

### Week 1 Focus
**Days 1-2**: Setup & Authentication
- All: Project setup, repository access
- zijian xue: Complete authentication backend (1.1 backend)
- jiaming shi: Complete authentication frontend & layout (1.1 frontend, 1.2)

**Days 3-5**: Core Features
- yanjun bao: Diary CRUD backend (2.1)
- lehe zhao: Diary UI (2.2), Task Management UI (3.2)
- zijian xue: Task CRUD backend (3.1)

### Week 2 Focus
**Days 6-8**: AI Integration
- zijian xue: AI Chat Backend (4.1)
- jiaming shi: AI Chat UI (4.2)

**Days 9-10**: Reports & Polish
- zijian xue: Reports API (5.1)
- jiaqi dang: Reports UI (5.2)
- All: Integration testing, bug fixes

---

## Definition of Done

Each story is considered complete when:
- [ ] Code is implemented and committed
- [ ] Code review is approved
- [ ] Manual testing is completed
- [ ] No blocking bugs exist
- [ ] Documentation is updated (if needed)
- [ ] Feature works in integration with other components

---

## Daily Standup Questions

Each team member should answer:
1. What did I complete yesterday?
2. What will I work on today?
3. Are there any blockers?

---

## Sprint Retrospective

After sprint completion, discuss:
- What went well?
- What could be improved?
- Action items for next sprint

---

## Notes

- **Dependencies**: Frontend stories depend on corresponding backend APIs
- **Communication**: Use team chat for questions and blockers
- **Code Review**: All PRs require at least one approval
- **Testing**: Manual testing required for all user-facing features
- **Excluded**: Reminder features and test/mock pages are not in scope
