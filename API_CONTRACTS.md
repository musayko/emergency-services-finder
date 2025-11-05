# API Contracts

This document details all available API endpoints, their expected inputs, and their typical outputs.

---

## Seeker Routes (`/api/seekers`)

### 1. Register Seeker
*   **Endpoint:** `POST /api/seekers/register`
*   **Description:** Registers a new seeker user.
*   **Authentication:** None required.
*   **Request Body:**
    ```json
    {
      "fullName": "string",
      "email": "string",
      "password": "string"
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "message": "Seeker registered successfully",
      "token": "jwt_token_string"
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: If required fields are missing or email is already registered.
    *   `500 Internal Server Error`: For server-side issues.

### 2. Login Seeker
*   **Endpoint:** `POST /api/seekers/login`
*   **Description:** Authenticates a seeker user and returns a JWT token.
*   **Authentication:** None required.
*   **Request Body:**
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "message": "Logged in successfully",
      "token": "jwt_token_string"
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: If email or password is missing.
    *   `401 Unauthorized`: If invalid credentials are provided.
    *   `500 Internal Server Error`: For server-side issues.

### 3. Get Seeker Profile
*   **Endpoint:** `GET /api/seekers/profile`
*   **Description:** Retrieves the profile information of the authenticated seeker.
*   **Authentication:** Required (JWT in `Authorization` header).
*   **Request Body:** None.
*   **Success Response (200 OK):**
    ```json
    {
      "id": "integer",
      "fullName": "string",
      "email": "string",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: If no token or invalid token is provided.
    *   `403 Forbidden`: If the token is valid but the user is not a seeker.
    *   `500 Internal Server Error`: For server-side issues.

---

## Provider Routes (`/api/providers`)

### 1. Register Provider
*   **Endpoint:** `POST /api/providers/register`
*   **Description:** Registers a new provider user.
*   **Authentication:** None required.
*   **Request Body:**
    ```json
    {
      "businessName": "string",
      "email": "string",
      "password": "string",
      "category": "string" (e.g., "Plumbing", "Electrical", "HVAC", "Structural", "General")
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "message": "Provider registered successfully",
      "token": "jwt_token_string"
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: If required fields are missing or email is already registered.
    *   `500 Internal Server Error`: For server-side issues.

### 2. Login Provider
*   **Endpoint:** `POST /api/providers/login`
*   **Description:** Authenticates a provider user and returns a JWT token.
*   **Authentication:** None required.
*   **Request Body:**
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "message": "Logged in successfully",
      "token": "jwt_token_string"
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: If email or password is missing.
    *   `401 Unauthorized`: If invalid credentials are provided.
    *   `500 Internal Server Error`: For server-side issues.

---

## Job Routes (`/api/jobs`)

### 1. Submit New Job
*   **Endpoint:** `POST /api/jobs`
*   **Description:** Allows a logged-in seeker to submit a new emergency job with a description and an image.
*   **Authentication:** Required (JWT in `Authorization` header, Seeker role).
*   **Request Body (multipart/form-data):**
    *   `description`: "string" (User's description of the emergency)
    *   `image`: "file" (Image file of the emergency)
*   **Success Response (201 Created):**
    ```json
    {
      "message": "Job submitted and classified successfully!",
      "job": {
        "id": "integer",
        "user_description": "string",
        "image_url": "string",
        "ai_identified_problem": "string",
        "ai_identified_category": "string",
        "seeker_id": "integer",
        "status": "open",
        "created_at": "datetime",
        "updated_at": "datetime"
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: If description or image is missing, or if AI safeguard check fails.
    *   `401 Unauthorized`: If no token or invalid token is provided.
    *   `403 Forbidden`: If the token is valid but the user is not a seeker.
    *   `500 Internal Server Error`: For server-side issues.

### 2. Get Open Jobs (for Providers)
*   **Endpoint:** `GET /api/jobs/open`
*   **Description:** Retrieves a list of open emergency jobs relevant to the authenticated provider's service category.
*   **Authentication:** Required (JWT in `Authorization` header, Provider role).
*   **Request Body:** None.
*   **Success Response (200 OK):**
    ```json
    [
      {
        "id": "integer",
        "user_description": "string",
        "image_url": "string",
        "ai_identified_problem": "string",
        "ai_identified_category": "string",
        "seeker_id": "integer",
        "status": "open",
        "created_at": "datetime",
        "updated_at": "datetime"
      }
    ]
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: If no token or invalid token is provided.
    *   `403 Forbidden`: If the token is valid but the user is not a provider.
    *   `500 Internal Server Error`: For server-side issues.

### 3. Get Provider's Claimed Jobs
*   **Endpoint:** `GET /api/jobs/my-jobs`
*   **Description:** Retrieves a list of jobs claimed by the authenticated provider.
*   **Authentication:** Required (JWT in `Authorization` header, Provider role).
*   **Request Body:** None.
*   **Success Response (200 OK):**
    ```json
    [
      {
        "id": "integer",
        "user_description": "string",
        "image_url": "string",
        "ai_identified_problem": "string",
        "ai_identified_category": "string",
        "seeker_id": "integer",
        "provider_id": "integer",
        "status": "claimed" | "in_progress" | "completed",
        "created_at": "datetime",
        "updated_at": "datetime",
        "claimed_at": "datetime"
      }
    ]
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: If no token or invalid token is provided.
    *   `403 Forbidden`: If the token is valid but the user is not a provider.
    *   `500 Internal Server Error`: For server-side issues.

### 4. Get Seeker's Submitted Jobs
*   **Endpoint:** `GET /api/jobs/my-jobs/seeker`
*   **Description:** Retrieves a list of emergency jobs submitted by the authenticated seeker.
*   **Authentication:** Required (JWT in `Authorization` header, Seeker role).
*   **Request Body:** None.
*   **Success Response (200 OK):**
    ```json
    [
      {
        "id": "integer",
        "user_description": "string",
        "image_url": "string",
        "ai_identified_problem": "string",
        "ai_identified_category": "string",
        "seeker_id": "integer",
        "status": "open" | "claimed" | "in_progress" | "completed",
        "created_at": "datetime",
        "updated_at": "datetime"
      }
    ]
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: If no token or invalid token is provided.
    *   `403 Forbidden`: If the token is valid but the user is not a seeker.
    *   `500 Internal Server Error`: For server-side issues.

### 5. Claim a Job (for Providers)
*   **Endpoint:** `PUT /api/jobs/:id/claim`
*   **Description:** Allows an authenticated provider to claim an open emergency job.
*   **Authentication:** Required (JWT in `Authorization` header, Provider role).
*   **URL Parameters:**
    *   `id`: "integer" (The ID of the job to claim)
*   **Request Body:** None.
*   **Success Response (200 OK):**
    ```json
    {
      "message": "Job claimed successfully!",
      "job": {
        "id": "integer",
        "user_description": "string",
        "image_url": "string",
        "ai_identified_problem": "string",
        "ai_identified_category": "string",
        "seeker_id": "integer",
        "provider_id": "integer",
        "status": "claimed",
        "created_at": "datetime",
        "updated_at": "datetime",
        "claimed_at": "datetime"
      }
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: If no token or invalid token is provided.
    *   `403 Forbidden`: If the token is valid but the user is not a provider or not qualified for the job category.
    *   `404 Not Found`: If the job does not exist.
    *   `409 Conflict`: If the job is not open and cannot be claimed.
    *   `500 Internal Server Error`: For server-side issues.

### 6. Update Job Status (for Providers)
*   **Endpoint:** `PUT /api/jobs/:id/status`
*   **Description:** Allows an authenticated provider to update the status of a job they have claimed.
*   **Authentication:** Required (JWT in `Authorization` header, Provider role).
*   **URL Parameters:**
    *   `id`: "integer" (The ID of the job to update)
*   **Request Body:**
    ```json
    {
      "status": "string" (e.g., "in_progress", "completed")
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "message": "Job status updated successfully!",
      "job": {
        "id": "integer",
        "user_description": "string",
        "image_url": "string",
        "ai_identified_problem": "string",
        "ai_identified_category": "string",
        "seeker_id": "integer",
        "provider_id": "integer",
        "status": "string",
        "created_at": "datetime",
        "updated_at": "datetime",
        "claimed_at": "datetime"
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: If status is missing.
    *   `401 Unauthorized`: If no token or invalid token is provided.
    *   `403 Forbidden`: If the token is valid but the user is not a provider or not assigned to the job.
    *   `404 Not Found`: If the job does not exist or is not assigned to the provider.
    *   `500 Internal Server Error`: For server-side issues.

---
