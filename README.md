# Hattrick API Client

TypeScript/JavaScript library for easily interacting with Hattrick.org's CHPP APIs via OAuth 1.0a.

## Features
- Full OAuth 1.0a authentication (request token, access token, check token, invalidate token)
- Automatic XML response parsing
- Full TypeScript typing
- Support for various permission scopes

## Installation

```bash
npm install hattrick-api-client
```

## Basic Usage

```typescript
import HattrickApiClient, { Scope } from 'hattrick-api-client';

const client = new HattrickApiClient({
  oauth_consumer_key: 'YOUR_CONSUMER_KEY',
  oauth_consumer_secret: 'YOUR_CONSUMER_SECRET',
  // optional if already obtained
  // oauth_access_token: '...',
  // oauth_access_token_secret: '...',
  // oauth_callback: 'http://localhost/callback',
});

// 1. Get the request token
const requestToken = await client.getRequestToken();

// 2. Redirect the user to Hattrick for authorization
// 3. Obtain the access token
// 4. Use the API methods
```

## Main API

- `getRequestToken()`
- `getAccessToken(config)`
- `checkToken()`
- `invalidateToken()`

See the code documentation for details on parameters and responses.

## Supported Scopes

- `Scope.MANAGE_CHALLENGES`
- `Scope.SET_MATCH_ORDER`
- `Scope.MANAGE_YOUTH_PLAYERS`
- `Scope.SET_TRAINING`
- `Scope.PLACE_BID`

## Build & Development

```bash
npm run build
```

## Status of API Implementation

See [STATUS.md](./STATUS.md) for a detailed overview of the implementation progress of the various CHPP API endpoints.

## License

MIT © Emanuele Liardo

## Useful Links
- [CHPP Hattrick Documentation](https://www.hattrick.org/Community/CHPP/)
- [GitHub Repository](https://github.com/odrail/hattrick-api-client)
