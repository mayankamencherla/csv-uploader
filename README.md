# CSV Uploader

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
<!-- [![Packagist](https://img.shields.io/packagist/v/symfony/symfony.svg)]() -->

> This app is a backend over HTTP that consumes CSV's and allows users to upload csv's and download them at a later time.

## Pre-requisities:
> Some key things to set up / understand to use this app:

- **[NodeJS v9](https://nodejs.org/en/)**
- **[npm](https://www.npmjs.com/)**

## Downloading
```bash
$ git clone https://github.com/mayankamencherla/csv-uploader.git
```

## Setup Locally
> To get the app working locally, or to run test cases, follow the instructions below.
> After setting up the app, details on each API and how to use it can be found below in the **[API's available on this app](https://github.com/mayankamencherla/csv-uploader#apis-available-on-this-app)** section.
> If any of the commands below are denied due to a permission error, please prepend a sudo to the command.

1. Navigate to the app's root directory

2. Run the following command to install all the dependencies:
```bash
$ npm install
```

3. Create a .env file in the root directory
```bash
$ touch .env
```

4. Change the values of the environment variables in .env.

5. Run the app on localhost by typing the following command:
```bash
$ npm start
```

6. Head over to <a href="http://localhost:3000" target="_blank">localhost:3000</a> on your browser to see Success = true

7. To use this app on heroku, please head over to <a href="https://gentle-mountain-30189.herokuapp.com" target="_blank">heroku</a>

## Environment variables
Environment variables are picked up from the .env file, which must be created in the app's root directory.

Some key environment variables are listed and explained below:

1. *MONGODB_URI*: The URI that points to your MongoDB installation
1. *accessKeyId*: Access key ID for the amazon s3 bucket
1. *secretAccessKey*: Secret access key for the amazon s3 bucket

## API's available on this app
> This app supports 2 API's currently

1. POST <a href="http://localhost:3000/csv" target="_blank">/csv</a>
    - Allows your to upload your CSV via to be stored by the app
    - The file needs to be uploaded via the *file* post parameter
    - Returns the download link of the file in the *download* parameter
    - Returns the user's authentication token as the x-auth parameter in the response headers
    - Example:
    ```
    {
        "Success": true,
        "download": "<host>:<PORT>/query?file_id=file_<ID>",
        "message": "Just paste the download url in the browser to download the file"
    }
    ```

2. GET <a href="http://localhost:3000/query?file_id=file_34234234" target="_blank">/query</a>
    - Allows you to download the csv using the download link
    - The URL can be pasted into the browser to get the CSV into your system
    - The user's authentication token that was returned by the csv upload endpoint must be used as the x-auth token in the request
    - Example: `<host>:<PORT>/query?file_id=file_<ID>`