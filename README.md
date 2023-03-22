# Plaro - OPG Planer

Plaro is a comprehensive application designed to streamline the management of family businesses in the tourism industry. It offers a user-friendly platform that allows businesses to efficiently organize their guests and enhance their overall experience.

At the core of the app is the concept of events, which provides a quick and convenient way to add guest-related activities such as restaurant bookings, apartment check-ins and check-outs, and other relevant events. This feature ensures that guests are properly accommodated and attended to, leading to a more pleasant and memorable stay.

Plaro also provides a visual representation of the business's day/week, making it easier for businesses to manage their operations more effectively. With this feature, businesses can better allocate their resources and staff, optimize their schedules, and prevent conflicts and overbooking.

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

