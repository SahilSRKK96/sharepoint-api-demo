# Project Context

## Company Background
- We are a **Microsoft CSP (Cloud Solution Provider)**
- Expertise in Microsoft 365, Azure, and SharePoint solutions

## Current Project: KTMB2 POC

### Client Requirements
- **Client**: KTMB2 (Keretapi Tanah Melayu Berhad - Malaysian Railways)
- **Current System**: Staff Dashboard with admin panel functionality
- **Goal**: Migrate frontend to modern hosting (Azure) while keeping SharePoint as the data backend

### Current Features (from screenshots)
The existing Staff Dashboard includes:
- **Portal Administration**: Menu, Articles, Portal Media, Promo Code, Advertisement, Portal Gallery, Board
- **Intranet Administration**: E-Commerce Admin, Internal Circular, Operation Information
- **User Management**: Add/edit users with groups, status tracking
- **Audit Trail**: Activity logging with date filtering
- **Integrity Information, Intranet Application, Bulletin, Covid-19 Info**

---

## Project Structure

```
sharepoint-api-test/
├── backend/                    # Express API Server
│   ├── server.js              # SharePoint CRUD API
│   ├── package.json
│   └── .env                   # Azure AD credentials
│
├── frontend/                   # Next.js App
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx     # Root layout with Sidebar
│   │   │   ├── page.tsx       # Dashboard
│   │   │   └── users/
│   │   │       └── page.tsx   # User Management (CRUD)
│   │   ├── components/
│   │   │   ├── Sidebar.tsx    # Navigation sidebar
│   │   │   └── UserModal.tsx  # Add/Edit user modal
│   │   └── types/
│   │       └── index.ts       # TypeScript interfaces
│   ├── .env.local             # API URL config
│   └── package.json
│
└── CLAUDE.md                   # This file
```

---

## Running the Application

### 1. Start Backend (Port 3001)
```bash
cd backend
npm install
npm run dev
```

### 2. Start Frontend (Port 3000)
```bash
cd frontend
npm install
npm run dev
```

### 3. Open Browser
- Frontend: http://localhost:3000
- API: http://localhost:3001/api/users

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | List all users |
| GET | /api/users/:id | Get single user |
| POST | /api/users | Create user |
| PATCH | /api/users/:id | Update user |
| DELETE | /api/users/:id | Delete user |

---

## SharePoint List: KTMBStaffUsers

| Column | Type | Description |
|--------|------|-------------|
| Title | Text | User ID (e.g., 301023) |
| Name | Text | Full name |
| Status | Choice | Active, Inactive, Pending |
| Group | Choice | Department/division |

---

## Environment Variables

### Backend (.env)
```
TENANT_ID=your-tenant-id
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret
SHAREPOINT_HOST=liquidoffice.sharepoint.com
SHAREPOINT_SITE_NAME=
LIST_NAME=KTMBStaffUsers
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Deployment Options
1. **Azure Static Web Apps** - Frontend + API functions
2. **Azure App Service** - Full control over backend
3. **Vercel** - Easy Next.js deployment (already configured)
