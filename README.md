# TODO LIST APP

A simple web application for managing your day-to-day tasks, sending reminders. This project is built with Node.js, Express, React, and MongoDB.

## Deployment Link

[https://todo-list-qp93.onrender.com/](https://task-manager-x73d.onrender.com/)

## Video of the functioning application

https://drive.google.com/file/d/1yyEw-Uudlvn9e9up-z-TxCiTGPPMhdQp/view

## Additional Features

1. **Google OAUTH Login and Signup**: Users can log in or sign up using their Google accounts.
2. **Push Emails for Task Reminders**: Users receive email notifications for upcoming tasks.
3. **User Profile with Cool Avatars**: Users can customize their profiles with unique avatars.
4. **Multiple Boards**: Organize tasks into various boards to simplify task management.


## Table of Contents

1. [Project Overview](#project-overview)
2. [Installation](#installation)
3. [Usage](#usage)
4. [API Endpoints](#api-endpoints)
5. [Contributing](#contributing)

## Project Overview

The Todo List App allows users to perform the following actions:

- **Create Boards**: Users can add Task Boards to the application.
- **Create Tasks**: Users can add tasks to the Board's TaskLists.
- **View Tasks**:Users can view a list of their created tasks.
- **Edit Tasks**: Users can edit tasks by updating their details or due dates.
- **Delete Tasks**: Users can delete tasks from their account.

This project uses the Express framework for the backend server, React for the frontend, and MongoDB.

## Installation

To run this project locally, follow these steps:

1. Clone the repository:

   ```shell
   git clone https://github.com/yourusername/pdf-editor-app.git
   ```

2. Change into the project directory:

   ```shell
   cd pdf-editor-app
   ```

3. Install the dependencies for both the server and client:

   ```shell
   cd server
   npm install
   cd ../client
   npm install

   ```

4. Start the server and client:
   Start the server:

   ```shell
   cd ../server
   npm start

   cd ../client
   npm start

   ```

5.Open a web browser and navigate to http://localhost:3000 to access the application.

## Usage

1. Register and log in to your account via email or Google.

2. Add tasks to your Boards.

3. View your uploaded tasks, edit or move them to done, doing or to do and delete them as needed.

4. Enjoy managing your tasks!

## API Endpoints

### User Authentication

- **POST /api/v1/users/create:** Register a new user.
- **POST /api/v1/users/create-session:** Authenticate and generate a token for a user.
- **GET /api/v1/users/tasks/:board :** Get all tasks of the signed in user by board id.
- **GET /api/v1/users/board :** Get all boards of the signed in user by board id.
- **POST /api/v1/users/board :** Create new board.
- **DELETE /api/v1/users/board/:boardId :** Delete a board by ID.
- **PATCH /api/v1/users/profile :** Update User Profile.

### Task Manangement

- **POST /api/v1/tasks/create:** Upload a Task to the server.
- **PUT /api/v1/tasks/update/:taskId:** Update a Task by ID.
- **DELETE /api/v1/tasks/:id:** Delete a Task.
- **PATCH /api/v1/tasks/move:** Used for drag and drop.

## Contributing

Contributions to this project are welcome. If you find any issues or would like to contribute new features or improvements, please open a pull request.
