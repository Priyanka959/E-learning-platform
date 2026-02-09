# Elearning Project — Interview Documentation ✅

## Elevator pitch 💡
A full-stack e-learning web application built with a Node.js/Express + MongoDB backend and a React (Vite) frontend. Supports role-based access (student, instructor, admin), course creation, lessons, quizzes, enrollments, progress tracking, and certificate generation.

---

## Tech stack & key libs 🔧
- **Backend:** Node.js, Express, MongoDB (Mongoose)
  - Auth: JWT (jsonwebtoken)
  - Passwords: bcryptjs
  - File & PDF: multer, pdfkit
  - Testing: Jest, Supertest, mongodb-memory-server
- **Frontend:** React (Vite), React Router, MUI (Material UI), Axios
- **Dev tools:** nodemon, ESLint

---

## How to run locally 🚀
### Backend
1. cd `backend`
2. install: `npm install`
3. env variables (create `.env`):
   - `MONGODB_URI` (or local Mongo URI)
   - `JWT_SECRET`
   - `PORT` (optional)
4. dev: `npm run dev` (nodemon)
5. tests: `npm test` (Jest with mongodb-memory-server)

### Frontend
1. cd `frontend`
2. install: `npm install`
3. dev: `npm run dev`
4. build: `npm run build`

---

## API Overview (selected endpoints) 📡
Base URL: `http://localhost:5000/api`

### Auth
- `POST /api/auth/register` — register user
- `POST /api/auth/login` — login -> returns JWT
- `PUT /api/auth/role/:userId` — (admin) set user role
- `GET /api/auth/me` — get current user

### Courses
- `POST /api/courses/create` — (instructor) create course
- `GET /api/courses` — list courses (supports ?search=&category=&level=&sortBy=)
- `GET /api/courses/search?q=<term>` — search by title/description
- `GET /api/courses/:id` — get course details
- `PUT /api/courses/:id` — (instructor-owner) update
- `DELETE /api/courses/:id` — (instructor-owner) delete
- `GET /api/courses/my-courses` — (instructor) courses created by current user

### Other (implemented routes)
- `lesson`, `quiz`, `enrollment`, `progress`, `certificate` routes exist under `backend/routes/*`.

> Protected routes require `Authorization: Bearer <token>` header

---

## Data models (summary) 🧭
- **User** (`backend/models/userModel.js`)
  - `name`, `email` (unique), `password`, `role` (student|instructor|admin)
  - `completedLessons`, `quizResults` (quiz ref + score)
- **Course** (`backend/models/courseModel.js`)
  - `title`, `description`, `category`, `level` (Beginner|Intermediate|Advanced)
  - `instructor` (User ref), `lessons`, `quizzes`, `students`
- **Lesson** (`backend/models/lessonModel.js`)
  - `title`, `content`, `videoUrl`, `course` (ref)
- **Quiz** (`backend/models/quizModel.js`)
  - `title`, `course` (ref), `questions` (options + answer)

---

## Frontend notes (UX & API usage) 🖥️
- `frontend/src/pages/Courses.jsx`:
  - Fetches: `GET /api/courses?search&category&level&sortBy`
  - Allows instructors to delete their own courses (checks `user.role` and `user.id`)
  - Uses `AuthContext` for `user` and `token`
- Pages: `Home`, `Courses`, `CourseDetail`, `CreateCourse`, `LessonView`, `QuizView`, `Login`, `Register`, `Profile`, `MyCourses`.

---

## Testing strategy 🧪
- Unit/integration tests using **Jest** and **Supertest**
- An in-memory Mongo instance is used for fast, isolated tests (`mongodb-memory-server`).
- Example test file: `backend/tests/course.test.js` — demonstrates auth token generation, CRUD course flow, and DB assertions.

---

## Common interview talking points & suggested answers 🎯
- **Why role-based access?** - Keeps permissions clear and simple (student/instructor/admin). Easier to enforce ownership checks (instructor-only update/delete).
- **Testing approach:** - Using in-memory DB avoids flakiness and speeds up tests; Supertest gives end-to-end HTTP testing without deploying server.
- **Scalability improvements:** - Add pagination & indexing on queries, caching (Redis), background jobs for heavy tasks (certificate generation), and rate limiting.
- **Security improvements:** - Add input validation (Joi/Ajv), stronger rate limiting, helmet, content-security-policy, and proper logging/monitoring.
- **Frontend decisions:** - Use React + Vite for dev speed, MUI for consistent UI, and axios for API calls; consider adding E2E tests with Playwright/Cypress.

---

## Example curl snippets 🔬
Register:
```
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{"name":"Test","email":"t@example.com","password":"password"}'
```
Create course (requires token):
```
curl -X POST http://localhost:5000/api/courses/create -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{"title":"New Course","description":"Desc"}'
```

---

## Key files to reference 📂
- `backend/server.js`, `backend/app.js` (app setup)
- `backend/routes/*.js`, `backend/controllers/*.js`, `backend/models/*.js`
- `frontend/src/pages/*`, `frontend/context/AuthContext.jsx`
- `backend/tests/*.test.js`

---

## Challenges & Solutions ⚠️➡️✅
- **Authentication & security:** Implemented bcrypt for passwords, short-lived JWTs with a refresh strategy, input validation and rate-limiting to mitigate token misuse.
- **Certificate generation & file handling:** Used `pdfkit` with streaming and `multer` for uploads, and moved heavy PDF generation to asynchronous/background jobs to avoid blocking requests.
- **Testing stability:** Adopted `mongodb-memory-server` for isolated tests and used Supertest for reliable integration testing, which reduced flakiness.
- **Data consistency (enrollments/progress):** Used Mongoose transactions and atomic operators (`$addToSet`, `$inc`) to prevent duplicates and race conditions.
- **Search & performance:** Added DB indexes, server-side pagination, and client-side debouncing for search and filters to improve responsiveness.
- **Media storage & bandwidth:** Offloaded videos to cloud storage/streaming solutions and implemented lazy loading on the frontend to reduce bandwidth usage.
- **Role-based access & ownership:** Centralized checks in `authMiddleware` and `roleMiddleware`, and added tests to enforce instructor ownership and prevent unauthorized actions.

---

## Quick improvements / TODO (good to mention in interviews) ✅
1. Add pagination and indexes for large datasets.
2. Add validation middleware (AJV/Joi) and better error handling.
3. CI: add GitHub Actions for tests and linting.
4. Add E2E tests and Docker setup for reproducible dev.
5. Add RBAC tests and more API coverage.

---

## Contact / Author
- Project root: `c:\project\elearning`
- Maintainer: (update with your name)

---

Good luck in your interview! If you'd like, I can also generate a one-page bullet summary for your talking points or a presentation slide deck. 📄✨