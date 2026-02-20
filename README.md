# Cron Job Server

A simple Node.js server that runs a cron job to ping a specified URL at regular intervals. This is useful for keeping free-tier deployments (like on Render or Heroku) awake.

## Prerequisites

- Node.js installed

## Setup

1.  Clone the repository or download the files.
2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Configure environment variables:
    - Create a `.env` file in the root directory.
    - Add the following variables:

      ```env
      PORT=3000
      ```

    - Create a `jobs.json` file in the root directory to define your cron jobs:

      ```json
      [
        {
          "url": "https://your-target-url.com",
          "schedule": "*/14 * * * *"
        },
        {
          "url": "https://another-url.com",
          "schedule": "0 * * * *"
        }
      ]
      ```

      - `url`: The URL to ping.
      - `schedule`: The cron schedule expression.

## Usage

Start the server:

```bash
node index.js
```

The server will start and log the pings to the console.
