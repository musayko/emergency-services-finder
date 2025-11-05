# 24/7 Emergency Services Finder

This repository contains the source code for the "24/7 Emergency Services Finder" web application, a project for the Software Development Team Project course.

---

### **Team Members**

*   Jayil Mambetaliev
*   Musa Özdemir

---

### **1. Project Description**

The "24/7 Emergency Services Finder" is a hyperlocal, curated directory designed to solve a critical problem: connecting individuals facing urgent household emergencies with verified, available local service providers outside of standard business hours.

Our goal is to create a simple, fast, and reliable platform that serves two primary users:
1.  **Seekers:** Users in distress who need to quickly find trustworthy 24/7 help (e.g., plumbing, electrical, structural damage).
2.  **Providers:** Qualified service professionals who can receive valuable, targeted leads for emergency jobs.

The application features a clean search interface, detailed provider profiles, a straightforward system for providers to manage their listings, and real-time job updates.

---

### **2. Technology Stack**

This project is developed using a modern, efficient, and lightweight technology stack suitable for a full-stack web application.

*   **Frontend:**
    *   **Framework:** React (using Vite for a fast development environment)
    *   **Routing:** React Router
    *   **HTTP Client:** Axios
    *   **Internationalization (i18n):** react-i18next
    *   **JWT Decoding:** `jwt-decode`
    *   **Real-time Communication:** `socket.io-client`
*   **Backend:**
    *   **Framework:** Node.js with Express.js
    *   **Database:** PostgreSQL
    *   **Query Builder:** Knex.js
    *   **Environment Variables:** `dotenv`
    *   **Security:** `helmet`, `express-rate-limit`
    *   **Real-time Communication:** `socket.io`
    *   **Email Notifications:** `nodemailer`
*   **External APIs:**
    *   **Google Places API:** For address autocompletion to ensure data accuracy.
    *   **Google Gemini API:** For AI-powered content moderation and job classification.

---

### **3. Main Milestones**

The project is broken down into six key milestones to ensure a structured development process and consistent progress.

**Milestone 1: Backend & Database Foundation (Complete)**
*   **Objective:** Establish the core server-side logic and database structure.
*   **Deliverables:** A functional Node.js/Express server with a complete set of CRUD API endpoints for managing service providers, connected to a PostgreSQL database.

**Milestone 2: Frontend UI Scaffolding (Complete)**
*   **Objective:** Build the static, visual shell of the application.
*   **Deliverables:** A fully navigable, mobile-responsive React application with all necessary components and pages, populated with static data.

**Milestone 3: Frontend-Backend Integration (Complete)**
*   **Objective:** Connect the frontend to the live backend API to create a dynamic application.
*   **Deliverables:** Live search functionality, dynamic provider lists and detail pages, and robust handling of loading, empty, and error states.

**Milestone 4: Provider Features & Authentication (Complete)**
*   **Objective:** Implement the functionality for service providers to register and manage their profiles.
*   **Deliverables:** Backend and frontend for user registration/login, a protected dashboard, and a functional profile creation/editing form with image upload capabilities.

**Milestone 5: Final Requirements & Polish (In Progress)**
*   **Objective:** Integrate the remaining project requirements and refine the user experience.
*   **Deliverables:** Full localization (i18n), Google Places API integration, a thorough accessibility review, real-time job updates, user notifications, and final UI/UX polishing.

**Milestone 6: Documentation & Finalization (In Progress)**
*   **Objective:** Prepare the project for final submission.
*   **Deliverables:** A comprehensive README, a detailed API contracts file, clean code, and a fully prepared repository.

---

### **4. Local Development Setup**

To get the project running on your local machine, you will need Node.js, npm, and PostgreSQL installed. Follow these steps carefully.

#### **Backend Server Setup**

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **PostgreSQL Setup:**
    *   Ensure PostgreSQL is running on your system.
    *   Create a new PostgreSQL user and database. For example:
        ```sql
        CREATE USER emergency_user WITH PASSWORD 'your_actual_password';
        CREATE DATABASE emergency_finder OWNER emergency_user;
        GRANT ALL PRIVILEGES ON DATABASE emergency_finder TO emergency_user;
        ```

4.  **Create the environment file:**
    Create a new file named `.env` inside the `/server` directory. This file will hold your secret keys. **Do not commit this file to Git.** Add the following content, replacing placeholders with your actual values:
    ```
    # /server/.env
    JWT_SECRET=your_super_secret_and_random_jwt_key_here
    GEMINI_API_KEY=your_google_gemini_api_key_here

    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=emergency_user
    DB_PASSWORD=your_actual_password
    DB_DATABASE=emergency_finder

    EMAIL_HOST=smtp.example.com
    EMAIL_PORT=587
    EMAIL_SECURE=false
    EMAIL_USER=your_email@example.com
    EMAIL_PASSWORD=your_email_password
    EMAIL_FROM=no-reply@emergencyfinder.com
    ```

5.  **Run database migrations:**
    This command will set up the necessary PostgreSQL database tables.
    ```bash
    npx knex migrate:latest --knexfile knexfile.js
    ```

6.  **Start the backend server:**
    ```bash
    npm run dev
    ```
    The server should now be running on `http://localhost:5001`.

#### **Frontend Client Setup**

1.  **Open a new terminal window.** Do not close the terminal running the backend server.

2.  **Navigate to the client directory:**
    ```bash
    cd client
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The React application should now be running and will open automatically in your browser at `http://localhost:5173` (or the next available port).

---