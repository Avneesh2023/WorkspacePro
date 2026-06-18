# Manual QA Checklist - WorkspacePro

This document acts as the master QA checklist to verify the functional integrity, security bounds, and layout consistency of **WorkspacePro**.

---

## 🔐 1. Authentication

- [ ] **Register User (Valid)**
  - Enter name, unique email, password (>= 6 chars). Click register.
  - *Expected*: Success toast, token stored in localStorage, redirected to dashboard.
- [ ] **Register User (Invalid Email)**
  - Enter invalid email format (e.g. `invalid-email`). Click register.
  - *Expected*: HTML5 validator / frontend form validation stops submit, warning shown.
- [ ] **Register User (Short Password)**
  - Enter password shorter than 6 characters.
  - *Expected*: Validation error: `Password must be at least 6 characters long`.
- [ ] **Register User (Duplicate Email)**
  - Attempt to register with a pre-existing email address.
  - *Expected*: Error banner / alert shows `User already exists`.
- [ ] **Login User (Valid)**
  - Enter valid email and password. Click Sign In.
  - *Expected*: Success toast, token saved, redirected to dashboard.
- [ ] **Login User (Invalid Password / Username)**
  - Enter incorrect password or unregistered email.
  - *Expected*: Centralized validation error: `Invalid credentials`.
- [ ] **Route Protection**
  - Try accessing `/dashboard`, `/clients`, `/projects`, or `/tasks` directly in browser while logged out.
  - *Expected*: Auto-redirected back to `/login`.
- [ ] **Logout User**
  - Click logout from the navbar dropdown.
  - *Expected*: Token cleared from localStorage, redirected to `/login`, success toast shown.

---

## 👥 2. Clients Management

- [ ] **List Clients**
  - Open `/clients` tab.
  - *Expected*: Skeleton cards/loader during fetch, then renders clients list.
- [ ] **Create Client (Valid)**
  - Click "Add Client", fill in name, email, phone.
  - *Expected*: Modal closes, client appears, success toast shown.
- [ ] **Create Client (Invalid Fields)**
  - Leave name blank or submit an invalid email format.
  - *Expected*: Form validation stops submission; error fields highlighted.
- [ ] **Edit Client**
  - Edit name/email.
  - *Expected*: Instant list update, success toast.
- [ ] **Delete Client**
  - Click delete on a client card.
  - *Expected*: Prompt/confirm, client disappears, success toast, associated projects dashboard stats updated.
- [ ] **Ownership Check (Security)**
  - Ensure users only see clients they created.

---

## 📁 3. Projects Management

- [ ] **List Projects**
  - Navigate to `/projects`.
  - *Expected*: Displays all owned projects. Shows Empty State if none exist.
- [ ] **Create Project**
  - Click "Create Project", assign to a client, enter name/description/status/dates.
  - *Expected*: Success toast, project added to list.
- [ ] **Edit Project**
  - Update status (e.g., Change "Not Started" to "In Progress").
  - *Expected*: Status color updates, success toast.
- [ ] **View Project Details**
  - Click on a project name.
  - *Expected*: Route goes to `/projects/:id`. Displays project meta, nested tasks module, and uploaded files.
- [ ] **Delete Project**
  - Click delete.
  - *Expected*: Project removed, success toast, redirection if inside details.

---

## 📋 4. Tasks Management

- [ ] **Create Task**
  - Click "Create Task" inside a project or under the global `/tasks` view.
  - *Expected*: Standard modal with priority/status selector, success toast.
- [ ] **Change Status**
  - Update status from "Todo" to "In Progress" or "Completed".
  - *Expected*: Real-time updates, dashboard stats update, success toast.
- [ ] **Delete Task**
  - Click delete task.
  - *Expected*: Task card removed, success toast.

---

## 📎 5. File Management

- [ ] **Upload File**
  - Drag/drop or select file, click upload.
  - *Expected*: Loading progress bar, uploaded file listed, success toast.
- [ ] **Delete File**
  - Click delete on a file card.
  - *Expected*: Removed, success toast.
- [ ] **Security Sandbox**
  - Try to fetch an upload URL of another user.
  - *Expected*: 401/403 status code from API.

---

## 📊 6. Dashboard Analytics

- [ ] **Stats Loading**
  - *Expected*: Displays count of total Clients, Projects, Tasks, Pending Tasks, Completed Tasks.
- [ ] **Empty States**
  - Clear all clients.
  - *Expected*: Dashboard shows introductory prompt to "Start by adding a client".
- [ ] **Recent Activity**
  - Verify that newly created projects and tasks are displayed under "Recent Activity" panels.
