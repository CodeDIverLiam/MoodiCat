Here is a comprehensive README.md file for your project, written in English.

-----

# Moodicat (aiDiary Project)

Moodicat is a full-stack AI-powered journal and task management application. It uses a Java Spring Boot backend, a React frontend, and integrates Spring AI (with Alibaba Dashscope) to provide intelligent chat and content analysis features.

## Tech Stack

* **Backend (Server):**
    * Java 17
    * Spring Boot 3.5.5
    * Spring AI (Alibaba Dashscope)
    * Spring Security (with JWT Authentication)
    * MyBatis (Persistence Framework)
    * MySQL (Database)
* **Frontend (Client):**
    * React
    * React Router
    * Tailwind CSS
    * TanStack React Query (Data Fetching & Caching)
    * Axios (HTTP Client)
    * Lucide React (Icons)
    * React Hook Form & Zod (Form Validation)

-----

## Quick Start Guide

### 1\. Database Setup (MySQL)

This project requires a MySQL database.

1.  Ensure you have a MySQL server running.
2.  Create a new database. The recommended name is `moodicat_db` as referenced in the configuration file.
3.  Execute the following SQL scripts *in order* to initialize the database schema:
    * **Main Tables:** `server/src/main/resources/dbConfig.sql` (Creates `users`, `tasks`, `diary_entries`, `reminders`).
    * **Chat Tables:** `server/src/main/resources/chat_tables.sql` (Creates `chat_sessions`, `chat_messages`).
4.  **(Optional)** To populate the database with test data, you can run:
    * **Mock Data:** `server/src/main/resources/dbinitial_config.sql`.

### 2\. Backend Setup (Spring Boot)

1.  **Requirements:**

    * Java 17 (JDK)
    * Apache Maven

2.  **Navigate to the backend directory:**

    ```bash
    cd server
    ```

3.  **Configure Application:**
    Copy the configuration template `server/src/main/resources/application-example.yml` and rename it to `application.yml` in the same directory.

    Open `application.yml` and fill in the required values:

    ```yaml
    spring:
      # ...
      ai:
        dashscope:
          api-key: sk-xxxxxxxxxxxx # <-- Your Alibaba Dashscope (Tongyi) API Key
      # ...
      datasource:
        url: jdbc:mysql://localhost:3306/moodicat_db # <-- Your JDBC URL
        username: ${username}      # <-- Your DB username
        password: ${password}   # <-- Your DB password
    # ...
    security:
      jwt:
        token:
          secret-key: YourVerySecretKeyHereWhichIsLongAndSecure # <-- A strong, custom secret key for JWT
    ```

4.  **Run the Backend:**

    ```bash
    ./mvnw spring-boot:run
    ```

    The backend service will start on `http://localhost:10000`.

### 3\. Frontend Setup (React)

1.  **Requirements:**

    * Node.js (LTS version)
    * npm or yarn

2.  **Navigate to the project's root directory** (the one containing both `server` and `src`).

3.  **Install Dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

4.  **Run the Frontend Development Server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    The React application will start (usually on `http://localhost:5173`) and will automatically proxy API requests to the backend running on `http://localhost:10000`.

-----

## Key Dependencies

### Backend (`server/pom.xml`)

* `spring-boot-starter-web`: For building RESTful APIs.
* `spring-boot-starter-security`: For authentication and authorization.
* `spring-ai-alibaba-starter-dashscope`: Spring AI integration for Dashscope models.
* `mybatis-spring-boot-starter`: MyBatis persistence framework.
* `mysql-connector-j`: MySQL JDBC driver.
* `io.jsonwebtoken` (jjwt-api, jjwt-impl, jjwt-jackson): For JWT generation and validation.
* `org.projectlombok`: To reduce boilerplate code.

### Frontend (Inferred from `src/` imports)

* `react` & `react-dom`: Core UI library.
* `react-router-dom`: For client-side routing.
* `@tanstack/react-query`: For server state management, caching, and data fetching.
* `axios`: Promise-based HTTP client.
* `tailwindcss`: Utility-first CSS framework.
* `react-hot-toast`: For notifications.
* `lucide-react`: Icon library.
* `react-hook-form` & `zod`: For robust form handling and validation.
* `framer-motion`: For animations.