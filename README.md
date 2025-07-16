# Weather CLI

A tiny Node command line tool that prints the **current weather** or a **10-day forecast** for any location.

## Setup

1. Install the dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your Visual Crossing API key.

## Build

Compile the TypeScript source files:

```bash
npm run build
```

## Usage

Run the compiled CLI:

```bash
npm start
```

This invokes `node --env-file=.env dist/cli.js` and prompts for the desired action and location.
