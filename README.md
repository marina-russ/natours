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

✅ Allow user data to be updated

✅ Ability to process payments using Stripe

- Compress bundled JavaScript files. Find a package with CLI utility, hopefully.
- Customize Leaflet map appearance
- Replace the scroll bar in Review section of Tour Details page with a nicer UI (potentially (SwiperJS)[https://swiperjs.com/swiper-api])
- Refresh account page when updating user data, or show an alert advising user to refresh page.

### :incoming_envelope: API <a name="api"></a>

### :bug: Development <a name="dev"></a>

#### Development Challenges:

This application was built following a tutorial course created in 2019. Since the course's creation, several technologies have significantly changed, become deprecated, or no longer have a free tier for usage. This required me to read documentation to learn how to implement the technology now or search for an alternate solution that I had to figure out how to implement.

- Stronger Content Security Policy (CSP) guidelines that required me to learn more about CSP and enact CSP whitelisting features.
- Tutorial used **Parcel** as a package bundler, but I was having issues with getting it to work. I learned a lot about how package bundlers work, and ended up implementing **ESBuild** in this project.
- Tutorial used **Mapbox** which is no longer free so I discovered and implemented **Leaflet** instead.
- Tutorial used **SendGrid** for emails as it is preconfigured for Node.js. I had issues getting started with SendGrid (and they require a business website to provide an account), so I used **Brevo** (formerly SendInBlue) instead. This involved figuring out how to create an email Transport since Brevo is not preconfigured for Node.js. (Shout out to the npm package nodemailer-brevo-transport!)

(If I implement mongoose-beautiful-unique-validation to handle duplicate database fields | See Notes 9.7)
(Alias Routes | See Notes 11.6)

#### Known Issues/Bugs:

- CSP uses `unsafe-inline`.
  - Would need to remove inline script tags from \_reviewCard.pug, \_header.pug, account.pug, overview.pug, & tour.pug.
  - Unknown if I will attempt to resolve this issue as I did not enjoy working with Pug templates.
- Upon successful login, user does not get a green-colored alert message. Instead, they see a grey "undefined" alert.
- Until application is deployed, Stripe code can be manipulated to create Bookings without first making a payment.
- Cannot update user password.
- Get Alias routes to work again.
  - Error occurred around the time that handler factory functions were implemented.

### :zap: Live Site <a name="site"></a>

#### Screenshots

### :studio_microphone: Credits <a name="credits"></a>

Site design created by Jonas Schmedtmann
