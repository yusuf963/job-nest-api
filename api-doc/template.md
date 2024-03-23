## [resource] Schema

| Field               | Required | Type                 | Rule                     | Description                                                           |
| ------------------- | -------- | -------------------- | ------------------------ | --------------------------------------------------------------------- |
| title               | Yes      | String               | Length: 1-499 characters | The title of the job post.                                            |
| exampleField        | No       | Number               |                          | The name of the company offering the job. Optional.                   |
| anotherExampleField | Yes      | ObjectId (Reference) | -                        | The owner of the job post. It references the user who posted the job. |

## [resource] available endpoints:

| endPoint  | verb | return | Description                    |
| --------- | ---- | ------ | ------------------------------ |
| /register | POST | 201    | register user to stor it to DB |
| /login    | POST | 202    | return a token                 |
