## :book: Table of Contents

1. [Concept](#concept)
2. [Technology](#tech)
3. [Features](#features)
4. [API](#api)
5. [Development](#dev)
6. [Live Site](#site)
7. [Credits](#credits)

### :bulb: Concept <a name="concept"></a>

**Natours** is a fictional company that sells guided travel tours across North America.

The website's primary goal is to get users to purchase a tour. This is accomplished through an API database that displays tour details and user reviews.

### :desktop_computer: Technology <a name="tech"></a>

Tech Stack:

- Node.js
- Express
- MongoDB
- Mongoose
  [![My Skills](https://skillicons.dev/icons?i=nodejs,express,mongodb)](https://skillicons.dev)

Libraries:

- Leaflet (map generation)

Specific to Development:

- Postman
- Mailtrap.io (password reset emails)

### :sparkles: Features <a name="features"></a>

- JSON Web Tokens (JWT)
- Slugs in URLS for SEO ranking
- Security &amp; Authentication features
  <!-- - Aggregation Pipeline -->
  <!-- - API featuring sorting/filtering/etc -->

#### Areas for Potential Future Development

- Customize Leaflet map appearance
- Allow user data to be updated
- Ability to process payments
- Replace the scroll bar in Review section of Tour Details page with a nicer UI (potentially (SwiperJS)[https://swiperjs.com/swiper-api])
- Implement a module bundler

### :incoming_envelope: API <a name="api"></a>

### :bug: Development <a name="dev"></a>

Known Issues/Bugs:

- Logout functionality does not work.
  - Issue relates to handling JWT cookie upon user logout.
  - Note: Event listener for logout button is commented out in index.js since errors were preventing Leaflet maps from loading.
- Upon successful login, user does not get a green-colored alert message. Instead, they see a grey "undefined" alert.
- Get Alias routes to work again.
  - Error occurred around the time that handler factory functions were implemented.

### :zap: Live Site <a name="site"></a>

#### Screenshots

### :studio_microphone: Credits <a name="credits"></a>

Site design created by Jonas Schmedtmann
