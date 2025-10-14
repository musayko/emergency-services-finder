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
1.  **Seekers:** Users in distress who need to quickly find trustworthy 24/7 help (e.g., plumbers, electricians).
2.  **Providers:** Qualified service professionals who can receive valuable, targeted leads for emergency jobs.

The application will feature a clean search interface, detailed provider profiles, and a straightforward system for providers to manage their listings.

---

### **2. Technology Stack**

This project will be developed using a modern, efficient, and lightweight technology stack suitable for a full-stack web application.

*   **Frontend:**
    *   **Framework:** React (using Vite for a fast development environment)
    *   **Routing:** React Router
    *   **HTTP Client:** Axios
    *   **Internationalization (i18n):** react-i18next
*   **Backend:**
    *   **Framework:** Node.js with Express.js
    *   **Database:** SQLite
    *   **Query Builder:** Knex.js
*   **External APIs:**
    *   **Google Places API:** For address autocompletion to ensure data accuracy.

---

### **3. Main Milestones**

The project is broken down into six key milestones to ensure a structured development process and consistent progress.

**Milestone 1: Backend & Database Foundation (Complete)**
*   **Objective:** Establish the core server-side logic and database structure.
*   **Deliverables:** A functional Node.js/Express server with a complete set of CRUD API endpoints for managing service providers, connected to a migrated SQLite database.

**Milestone 2: Frontend UI Scaffolding**
*   **Objective:** Build the static, visual shell of the application.
*   **Deliverables:** A fully navigable, mobile-responsive React application with all necessary components and pages, populated with static data.

**Milestone 3: Frontend-Backend Integration**
*   **Objective:** Connect the frontend to the live backend API to create a dynamic application.
*   **Deliverables:** Live search functionality, dynamic provider lists and detail pages, and robust handling of loading, empty, and error states.

**Milestone 4: Provider Features & Authentication**
*   **Objective:** Implement the functionality for service providers to register and manage their profiles.
*   **Deliverables:** Backend and frontend for user registration/login, a protected dashboard, and a functional profile creation/editing form with image upload capabilities.

**Milestone 5: Final Requirements & Polish**
*   **Objective:** Integrate the remaining project requirements and refine the user experience.
*   **Deliverables:** Full localization (i18n), Google Places API integration, a thorough accessibility review, and final UI/UX polishing.

**Milestone 6: Documentation & Finalization**
*   **Objective:** Prepare the project for final submission.
*   **Deliverables:** A comprehensive README, a detailed API contracts file, clean code, and a fully prepared repository.

---

### **4. Local Development Setup**

To get the project running on your local machine, you will need Node.js and npm installed. Follow these steps carefully.

#### **Backend Server Setup**

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create the environment file:**
    Create a new file named `.env` inside the `/server` directory. This file will hold your secret keys. **Do not commit this file to Git.** Add the following content:
    ```
    # /server/.env
    JWT_SECRET=your_super_secret_and_random_jwt_key_here
    ```

4.  **Run database migrations:**
    This command will set up the necessary SQLite database tables.
    ```bash
    npx knex migrate:latest
    ```

5.  **Start the backend server:**
    This will start the server in development mode using `nodemon`, which automatically restarts on file changes.
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