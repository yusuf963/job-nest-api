### [see server HTTP status code for more understanding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

## User Schema

| Field         | Required | Type    | Rule                                                                                     | Description                                                                                         |
| ------------- | -------- | ------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| firstName     | No       | string  | Length: 2-30 characters                                                                  | First name of the user. Optional.                                                                   |
| lastName      | No       | string  | Length: 2-30 characters                                                                  | Last name of the user. Optional.                                                                    |
| username      | Yes      | string  | Unique, Length: 2-30 characters                                                          | Unique username of the user. Required.                                                              |
| email         | Yes      | string  | Unique, Length: 10-50 characters, Pattern: /^\w+([.-]?\w+)_@\w+([.-]?\w+)_(\.\w{2,3})+$/ | Unique email address of the user. Required.                                                         |
| isTermsAgreed | Yes      | boolean |                                                                                          | Boolean indicating whether the user has agreed to terms.                                            |
| isVerified    | No       | boolean | Default: false                                                                           | Boolean indicating whether the user's email is verified. Default is false.                          |
| password      | Yes      | string  | Length: 8-100 characters, Rule: 1 uppercase, 1 lowercase, 1 number, 1 special character  | User's password. Required.                                                                          |
| image         | No       | string  |                                                                                          | URL of the user's profile image. Optional.                                                          |
| phone         | No       | string  | Length: 6-30 characters                                                                  | User's phone number. Optional.                                                                      |
| skills        | No       | array   |                                                                                          | Array of skills associated with the user. Optional.                                                 |
| bio           | No       | string  | Length: 6-300 characters                                                                 | User's biography. Optional.                                                                         |
| sex           | No       | string  |                                                                                          | User's gender. Optional.                                                                            |
| isAdmin       | No       | boolean | Default: false                                                                           | Boolean indicating whether the user is an admin. Default is false.                                  |
| address       | No       | object  |                                                                                          | Object containing user's address details (street, city, area, post code, country).                  |
| createdAt     | Yes      | Date    | Default: Current date and time                                                           | Date when the user was created. Automatically set to current date and time upon creation.           |
| updatedAt     | Yes      | Date    | Default: Current date and time                                                           | Date when the user was last updated. Automatically updated to current date and time.                |
| lastLogin     | No       | Date    | Default: Current date and time                                                           | Date when the user last logged in. Optional, automatically set to current date and time upon login. |

## User related end points:

| endPoint  | verb | return | Description                    |
| --------- | ---- | ------ | ------------------------------ |
| /register | POST | 201    | register user to stor it to DB |
| /login    | POST | 202    | return a token                 |

### Register

The minimum required fields to register user are:

```js
{
	"firstName": "dummy",
	"lastName": "user",
	"username": "User-123",
	"email": "user-1@example.com",
	"password": "User12345@",
    "confirmPassword": "User12345@",
    "isTermsAgreed": true
}
```

if register successful the return will be something like:

```js
{
    "status": 201,
    "message": "User has been created"
}
```

if register is not successful the return will be something like:

```js
{
    "status": 409,
    "message": "User already exists"
}
```

### Login

The minimum required fields to user to login are:

```js
{
	"email": "user-1@example.com",
	"password": "User1235@"
}
```

if log in successful the return will be something like

```js
{
    "status": 202,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmV4cCI6MTc3MzkxMTA3OH0.OPsjHK1-mCEWlyhgQIx6DItk3Jp1B257ZRbxZ_-AeAs",
    "loggedinUser": {
        "_id": "65f8a8727796a4382c77b23c",
        "firstName": "dummy",
        "lastName": "user",
        "username": "User-123",
        "email": "user-1@example.com",
        "isTermsAgreed": true,
        "isVerified": false,
        "skills": [],
        "isAdmin": false,
        "createdAt": "2024-03-18T20:47:46.253Z",
        "updatedAt": "2024-03-18T20:47:46.256Z",
        "lastLogin": "2024-03-18T21:04:38.230Z",
        "__v": 0
    },
    "message": "Login successful"
}
```

if login is not successful the return will be something like

```js
{
    "status": 401,
    "message": "Unauthorized"
}
```
