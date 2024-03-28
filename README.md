# job-nest-api

## Prerequisite for running the application server

1. should must have nodejs installed https://nodejs.org/en, in your terminal run `node -v` to validate if node is instated
2. Run this command `cp .env.example .env` in the root directory, this will create a file named `.env`
3. add the required environmental variables after = sign, e.g `JOB_NEST_DB_PASSWORD=` should look `JOB_NEST_DB_PASSWORD=yufgdfew`

## Run the app

1. Assume that you in in the root directory of the project
2. in your terminal run `npm install`
3. in your terminal run `run npm start`, the application will be accessible on http://localhost:5000


## Run the application via docker
1. Enure you have docker deamen installed and running.
2. Run the command `build -t jobtal-docker-image .` in your the root directory of jobtal-api repository, `.` means docker deamen will look the the default `Dockerfile`. this command will pull node-18.x image and start baking an image named jobtal-docker-image
3. Run the command `docker run -p HOST_PORT:CONTAINER_PORT --env-file=.env jobtal-docker-image` to creat a docker container with all the enviromental variable stored in `.env` file.

e.g `docker run -p 5000:5000 --env-file=.env --name jobtal-api-container -d jobtal-docker-image` this command will spit the container id and run on deattached mode on theb background