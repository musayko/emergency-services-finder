# Progress Report: Emergency Finder Application

This document outlines the work done to deploy and stabilize the Emergency Finder application on Heroku.

## Team Contributions

- **Jayil**: Frontend Development
- **Musa**: Backend Development, DevOps, and Heroku Deployment

## Deployment Summary

The following tasks were completed to get the application running on Heroku:

### 1. Initial Deployment

- The application was initially deployed to Heroku.

### 2. Database Provisioning and Configuration

- A PostgreSQL database was provisioned on Heroku.
- The backend was configured to connect to the database using the `DATABASE_URL` environment variable.
- Several issues with database connection were resolved, including:
    - Incorrect database credentials.
    - Missing SSL configuration for the production environment.

### 3. Frontend Integration

- The backend was configured to serve the frontend application in a production environment.
- Issues with the catch-all route were resolved to ensure that the frontend is always served for any non-API routes.
- The `trust proxy` setting was enabled to ensure correct operation of the rate limiter behind the Heroku proxy.

### 4. Final Deployment

- The final version of the application was successfully deployed to Heroku.
- The application is now stable and accessible at the following URL: [https://emergency-finder-eec78ae0f274.herokuapp.com/](https://emergency-finder-eec78ae0f274.herokuapp.com/)

## Conclusion

The Emergency Finder application is now successfully deployed and running on Heroku. The backend and frontend are fully integrated, and the database is correctly configured.
