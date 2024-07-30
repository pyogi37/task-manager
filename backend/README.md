
# Task Management API Documentation

The Task Management API provides endpoints to manage tasks for users.

## Base URL

```
https://api.example.com/v1
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. To authenticate a request, include the JWT token in the `Authorization` header using the Bearer scheme.

```
Authorization: Bearer <JWT token>
```

## Endpoints

### Create a Task

Create a new task for a user.

- URL: `/tasks`
- Method: POST
- Headers:
  - Content-Type: application/json
  - Authorization: Bearer \<JWT token>
- Request Body:
  ```json
  {
    "content": "Task content",
    "category": "Task category",
    "due_date": "2023-06-01"
  }
  ```
- Response:
  - Status: 201 Created
  - Body:
    ```json
    {
      "data": {
        "task": {
          "_id": "task_id",
          "content": "Task content",
          "category": "Task category",
          "due_date": "2023-06-01",
          "user": "user_id",
          "done": false,
          "createdAt": "2023-05-26T10:00:00Z",
          "updatedAt": "2023-05-26T10:00:00Z"
        }
      }
    }
    ```

### Mark Task as Done

Mark a task as done.

- URL: `/tasks/{taskId}/done`
- Method: PATCH
- Headers:
  - Content-Type: application/json
  - Authorization: Bearer \<JWT token>
- Response:
  - Status: 200 OK
  - Body:
    ```json
    {
      "data": {
        "message": "Task marked as done",
        "task": {
          "_id": "task_id",
          "content": "Task content",
          "category": "Task category",
          "due_date": "2023-06-01",
          "user": "user_id",
          "done": true,
          "createdAt": "2023-05-26T10:00:00Z",
          "updatedAt": "2023-05-27T08:30:00Z"
        }
      }
    }
    ```

### Update a Task

Update an existing task.

- URL: `/tasks/{taskId}`
- Method: PUT
- Headers:
  - Content-Type: application/json
  - Authorization: Bearer \<JWT token>
- Request Body:
  ```json
  {
    "content": "Updated task content",
    "category": "Updated task category",
    "due_date": "2023-06-05"
  }
  ```
- Response:
  - Status: 200 OK
  - Body:
    ```json
    {
      "data": {
        "task": {
          "_id": "task_id",
          "content": "Updated task content",
          "category": "Updated task category",
          "due_date": "2023-06-05",
          "user": "user_id",
          "done": false,
          "createdAt": "2023-05-26T10:00:00Z",
          "updatedAt": "2023-05-27T09:15:00Z"
        }
      }
    }
    ```

### Delete a Task

Delete an existing task.

- URL: `/tasks/{taskId}`
- Method: DELETE
- Headers:
  - Authorization: Bearer \<JWT token>
- Response:
 

 - Status: 204 No Content

### Get All Tasks

Get all tasks of the authenticated user.

- URL: `/tasks`
- Method: GET
- Headers:
  - Authorization: Bearer \<JWT token>
- Response:
  - Status: 200 OK
  - Body:
    ```json
    {
      "data": {
        "tasks": [
          {
            "_id": "task_id_1",
            "content": "Task 1 content",
            "category": "Task 1 category",
            "due_date": "2023-06-01",
            "user": "user_id",
            "done": false,
            "createdAt": "2023-05-26T10:00:00Z",
            "updatedAt": "2023-05-26T10:00:00Z"
          },
          {
            "_id": "task_id_2",
            "content": "Task 2 content",
            "category": "Task 2 category",
            "due_date": "2023-06-05",
            "user": "user_id",
            "done": true,
            "createdAt": "2023-05-27T08:30:00Z",
            "updatedAt": "2023-05-27T08:30:00Z"
          }
        ]
      }
    }
    ```

### Get User Tasks by Category

Get user tasks filtered by category.

- URL: `/tasks?category={category}`
- Method: GET
- Headers:
  - Authorization: Bearer \<JWT token>
- Response:
  - Status: 200 OK
  - Body:
    ```json
    {
      "data": {
        "tasks": [
          {
            "_id": "task_id_1",
            "content": "Task 1 content",
            "category": "Task 1 category",
            "due_date": "2023-06-01",
            "user": "user_id",
            "done": false,
            "createdAt": "2023-05-26T10:00:00Z",
            "updatedAt": "2023-05-26T10:00:00Z"
          },
          {
            "_id": "task_id_2",
            "content": "Task 2 content",
            "category": "Task 2 category",
            "due_date": "2023-06-05",
            "user": "user_id",
            "done": true,
            "createdAt": "2023-05-27T08:30:00Z",
            "updatedAt": "2023-05-27T08:30:00Z"
          }
        ]
      }
    }
    ```
