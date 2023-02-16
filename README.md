# Server organization

## Database (PSQL)

The database consists of the following tables:
- event
    - restaurant event
    - apartment event
    - activities event
    - other event
- apartments
- activities
- rooms
- tables
- event_tables (connects tables and events)
- event_apartments (connects apartments and events)

## Server structure

Each **component** has routes, collections and form validation file.

**Routes folder** is used to connect routes so it's easier to import them to the server file.

**Config folder** contains the setup for the  database connection (using Knex js).

Error handling is realized using Express middleware, and the **tryCatch.js** file in `/utils` is used to abstract error catching and to minimize code repetition.

