# Spotify Clone Vite: A minimalist full-stack rebuild of Spotify with a lyric generator - built with React and Spotify's API by Brady Gerber

[![GitHub issues](https://img.shields.io/github/issues/bg-write/spotify-clone-vite?style=flat-square)](https://github.com/bg-write/spotify-clone-vite/issues)

![Spotify clone login page](https://doodleipsum.com/700?bg=D96363&i=2950d197771be2105d7d9a91975907bc)

## This Spotify Clone in One Sentence

TBD

## This Spotify Clone Explained in One Minute

TBD

## The Problem

TBD

## The Solution

TBD

## The Goal

TBD

---

## Getting Started (On Your Local Machine)

In your IDE of choice, in an open terminal window, enter and run `npm run dev` and open the server URL provided in the terminal output.

## Running Tests

TBD

---

## Steps To Creating This Clone, Then Expanding

### Step 1: Auth

Build and return a GET request for a Spotify user's authentication

```javascript
// Login.jsx

const AUTH_URL = `${GET}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}`;
```

---

## Architecture

- `public`
- `src`
  - `assets`
  - `App.jsx`: Pass through our Login component
  - `Login.jsx`: Where we build and send a GET request to request a Spotify user's authorization
  - `main.jsx`
- `index.html`
- `vite.config.js`

---

## Style Guide

### CSS

Using Bootstrap (imported in `App.jsx`) and Rect Bootstrap.

### The Code Itself

Style Guide notes TBD

### Accessibility

Lighthouse Reports TBD

---

## Tech Stack & Tools

- React via [Vite](https://vitejs.dev/)
- [Spotify for Developers](https://developer.spotify.com/)
- Bootstrap
- React Bootstrap

---

## Next Steps (my "Icebox")

- Fully adopt Airbnb's JS coding style guide
- Incorporate automated testing

---

## Closing Credits

A special shout-out to Web Dev Simplified's [Spotify clone tutorial](https://flask.palletsprojects.com/en/2.2.x/quickstart/) for introducing the basics of Spotify's API and initial setup of this clone.

---

© 2023 Brady Gerber. All Rights Reserved.
