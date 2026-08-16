Store Rating Platform
About the Project

Store Rating Platform is a full-stack web application built using React, Node.js, Express, and PostgreSQL. The idea behind this project is to create a platform where users can create an account, log in, browse stores, submit ratings, and where administrators can manage stores and users from a separate dashboard.

This document is written as a complete setup guide so that the project can be started easily without having to remember every command or search through previous notes.

Technologies Used

The project is built with React and Vite for the frontend, Node.js and Express for the backend, PostgreSQL as the database, JWT for authentication, Git for version control, and Postman for testing the APIs.

Project Organization

The project is divided into two main parts. The backend contains the server, routes, controllers, middleware, configuration files, and database scripts. The frontend contains the React application, UI components, and related files. The README file is placed in the root folder as a reference for the complete setup process.

Before Starting

Before working on the project, make sure that Node.js, PostgreSQL, Git, Visual Studio Code, and Postman are installed on the computer. These applications only need to be installed once.

First-Time Setup

The first step is to open the project folder in Visual Studio Code.

Next, start PostgreSQL by opening SQL Shell and connect to the store_rating_platform database. Keeping the database running is important because the backend depends on it.

After the database is connected, open a new terminal for the backend, install the required packages, and start the backend server. When everything is working correctly, the server will connect successfully to PostgreSQL and start listening on port five thousand.

Once the backend is running, open another terminal for the frontend, install its dependencies, and start the development server. The React application will become available on port five thousand one hundred seventy-three.

Daily Startup Routine

Whenever working on the project again, the same routine can be followed.

First, start PostgreSQL and connect to the project database.

Second, start the backend server.

Third, start the frontend server.

After these three services are running, the application is ready for development.

API Testing

The authentication APIs should be tested using Postman instead of the browser. Registration and login endpoints expect POST requests, so opening those URLs directly in a browser may show a route error, which is normal.

Database Tasks

During development, it is often useful to view the users stored in the database, delete existing records while testing, or run the seed script to create default data. These tasks should always be performed after connecting to the project database.

Common Problems

If PostgreSQL is not running, start the PostgreSQL service from Windows Services.

If the psql command is not recognized, add PostgreSQL's bin folder to the system PATH and restart the terminal.

If the backend cannot start because port five thousand is already in use, stop the previous server and start it again.

If the frontend does not open, restart the Vite development server.

Development Workflow

The workflow for this project is simple and consistent.

Start the database first, then start the backend, and finally start the frontend. After making changes, test the APIs using Postman, verify the user interface in the browser, and commit the changes to Git with a meaningful commit message.

Following this sequence helps avoid unnecessary setup problems and keeps development organized.

Current Progress

The PostgreSQL database has been configured, the backend server is running correctly, the React frontend has been set up, and the authentication APIs are working. The next development stages include building the user dashboard, store listing, rating functionality, administrator dashboard, and finally deploying the complete application.