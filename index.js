const express = require('express');
const cron = require('node-cron');
const axios = require('axios');
const fs = require('fs');

const app = express();
const JOBS_FILE = './jobs.json';
const PORT = process.env.PORT || 3000;

// Basic route to check if server is running
app.get('/', (req, res) => {
  res.send('Cron Job Server is running! Check console for job logs.');
});

// Load jobs from JSON file
let jobs = [];
try {
  if (fs.existsSync(JOBS_FILE)) {
    const data = fs.readFileSync(JOBS_FILE, 'utf8');
    jobs = JSON.parse(data);
  } else {
    console.warn(`Warning: ${JOBS_FILE} not found. No jobs scheduled.`);
  }
} catch (error) {
  console.error(`Error reading ${JOBS_FILE}:`, error.message);
}

// Schedule jobs
if (jobs.length > 0) {
  console.log(`[${new Date().toISOString()}] Loading ${jobs.length} jobs...`);
  
  jobs.forEach((job, index) => {
    if (!job.url || !job.schedule) {
      console.warn(`Skipping invalid job at index ${index}:`, job);
      return;
    }

    if (!cron.validate(job.schedule)) {
        console.warn(`Skipping job at index ${index} due to invalid cron schedule: ${job.schedule}`);
        return;
    }

    console.log(`Scheduling ${job.url} with schedule: "${job.schedule}"`);

    cron.schedule(job.schedule, async () => {
      console.log(`[${new Date().toISOString()}] Pinging ${job.url}...`);
      try {
        const response = await axios.get(job.url);
        console.log(`[${new Date().toISOString()}] Success: ${job.url} - Status ${response.status}`);
      } catch (error) {
        console.error(`[${new Date().toISOString()}] Error: ${job.url} - ${error.message}`);
      }
    });
  });
} else {
    console.log('No jobs found to schedule.');
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// https://crontab.guru/