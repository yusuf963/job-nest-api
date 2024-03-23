## JobPost Schema

| Field                 | Required | Type                  | Rule                           | Description                                                                              |
| --------------------- | -------- | --------------------- | ------------------------------ | ---------------------------------------------------------------------------------------- |
| title                 | Yes      | String                | Length: 1-499 characters       | The title of the job post.                                                               |
| companyName           | No       | String                | Length: 1-299 characters       | The name of the company offering the job. Optional.                                      |
| jobPostOwner          | Yes      | ObjectId (Reference)  | -                              | The owner of the job post. It references the user who posted the job.                    |
| WorkplaceType         | Yes      | String                | Default: 'remote'              | The type of workplace (onsite, hybrid, remote).                                          |
| JobType               | Yes      | String                | Default: 'fulltime'            | The type of job (fulltime, parttime, contract, volunteer, temporary, internship, other). |
| isHidden              | No       | Boolean               | Default: false                 | Indicates if the job post is hidden.                                                     |
| location              | Yes      | String                | -                              | The location of the job.                                                                 |
| description           | Yes      | String                | Length: 1-1999 characters      | A description of the job.                                                                |
| otherDescription      | No       | String                | Length: 1-1999 characters      | Another description of the job. Optional.                                                |
| Benefits              | No       | Array of Strings      | -                              | Benefits offered with the job. Optional.                                                 |
| requirements          | Yes      | Array of Strings      | -                              | Requirements for the job.                                                                |
| responsibilities      | Yes      | Array of Strings      | -                              | Responsibilities of the job.                                                             |
| Qualifications        | No       | String                | -                              | Qualifications for the job. Optional.                                                    |
| yearsOfWorkExperience | No       | Number                | -                              | Years of work experience required for the job. Optional.                                 |
| salary                | No       | Number or String      | -                              | Salary offered for the job. Optional.                                                    |
| postedAt              | No       | Date                  | Default: Current date and time | The date when the job post was created.                                                  |
| applicant             | No       | Array of User objects | -                              | Array of users who have applied for the job. Optional.                                   |

## jobPost available endpoints:

| endPoint  | verb | return | Description                    |
| --------- | ---- | ------ | ------------------------------ |
| /register | POST | 201    | register user to stor it to DB |
| /login    | POST | 202    | return a token                 |
