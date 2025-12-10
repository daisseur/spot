# spotify-find-preview

Get Spotify song preview URLs along with song details. This package helps you find preview URLs for Spotify songs, which can be useful when the official preview URLs are not available.

**With full TypeScript support and modern ES Module syntax** 
> Check a example [here on my website MusiqueDuJour](https://music.daisseur.xyz/user/I7xr7ujgPKRfN1ZuXGgBUgUNhUkvRvgp)

## Features

- 🎵 Search for songs by name and artist
- 🔍 Get preview URLs from Spotify's CDN
- 📊 Access comprehensive track metadata
- 📘 Full TypeScript support with type definitions
- 🔄 Modern ES Module (ESM) syntax
- ✅ Comprehensive test coverage
- 🚀 Easy to use API with backward compatibility

## Installation

> npm
```bash
npm install spotify-find-preview dotenv
```

> pnpm
```bash
pnpm install spotify-find-preview dotenv
```


## Quick Start

### JavaScript (CommonJS)

```javascript
require('dotenv').config();
const spotifyPreviewFinder = require('spotify-find-preview');

async function example() {
  const result = await spotifyPreviewFinder.searchAndGetLinks('Shape of You', 'Ed Sheeran');
  
  if (result.success) {
    console.log(result.results[0].name);
    console.log(result.results[0].previewUrls);
  }
}

example();
```

### TypeScript / ES Modules

```typescript
import { searchAndGetLinks, type SearchResult } from 'spotify-find-preview';

async function example() {
  const result: SearchResult = await searchAndGetLinks('Shape of You', 'Ed Sheeran');
  
  if (result.success) {
    result.results.forEach(track => {
      console.log(track.name);
      console.log(track.previewUrls);
    });
  }
}

example();
```

## Usage Examples

### 1. Basic Search (Song Name Only)

```typescript
import { searchAndGetLinks } from 'spotify-find-preview';

async function basicSearch() {
  // Search by song name only (limit is optional, default is 5)
  const result = await searchAndGetLinks('Shape of You', 3);
  
  if (result.success) {
    console.log(`Search Query Used: ${result.searchQuery}`);
    result.results.forEach(song => {
      console.log(`\nSong: ${song.name}`);
      console.log(`Album: ${song.albumName}`);
      console.log(`Release Date: ${song.releaseDate}`);
      console.log(`Popularity: ${song.popularity}`);
      console.log(`Duration: ${Math.round(song.durationMs / 1000)}s`);
      console.log(`Spotify URL: ${song.spotifyUrl}`);
      console.log('Preview URLs:');
      song.previewUrls.forEach(url => console.log(`- ${url}`));
    });
  } else {
    console.error('Error:', result.error);
  }
}
```

### 2. Enhanced Search (Song Name + Artist)

For more accurate results, include the artist name:

```typescript
import { searchAndGetLinks, type TrackInfo } from 'spotify-find-preview';

async function enhancedSearch() {
  // Search with both song name and artist for higher accuracy
  const result = await searchAndGetLinks('Bohemian Rhapsody', 'Queen', 2);
  
  if (result.success) {
    console.log(`Search Query Used: ${result.searchQuery}`);
    result.results.forEach((song: TrackInfo) => {
      console.log(`\nFound: ${song.name}`);
      console.log(`Album: ${song.albumName}`);
      console.log(`Track ID: ${song.trackId}`);
      console.log('Preview URLs:');
      song.previewUrls.forEach(url => console.log(`- ${url}`));
    });
  } else {
    console.error('Error:', result.error);
  }
}
```

### 3. Batch Search with Different Artists

```typescript
import { searchAndGetLinks } from 'spotify-find-preview';

async function batchSearch() {
  const searches = [
    { song: 'Bohemian Rhapsody', artist: 'Queen' },
    { song: 'Hotel California', artist: 'Eagles' },
    { song: 'Imagine', artist: 'John Lennon' },
    { song: 'Yesterday' } // Without artist for comparison
  ];

  for (const search of searches) {
    let result;
    if (search.artist) {
      result = await searchAndGetLinks(search.song, search.artist, 1);
      console.log(`\n=== Searching: "${search.song}" by "${search.artist}" ===`);
    } else {
      result = await searchAndGetLinks(search.song, 1);
      console.log(`\n=== Searching: "${search.song}" (no artist specified) ===`);
    }

    if (result.success && result.results.length > 0) {
      const song = result.results[0];
      console.log(`Found: ${song.name}`);
      console.log(`Album: ${song.albumName} (${song.releaseDate})`);
      console.log(`Popularity: ${song.popularity}/100`);
      if (song.previewUrls.length > 0) {
        console.log(`Preview URL: ${song.previewUrls[0]}`);
      } else {
        console.log('No preview URLs found');
      }
    } else {
      console.log('No results found');
    }
  }
}
```

## TypeScript Support

This package is written in TypeScript and provides full type definitions.

### Available Types

```typescript
import type { SearchResult, TrackInfo } from 'spotify-find-preview';

// SearchResult type
interface SearchResult {
  success: boolean;
  searchQuery?: string;
  results: TrackInfo[];
  error?: string;
}

// TrackInfo type
interface TrackInfo {
  name: string;
  spotifyUrl: string;
  previewUrls: string[];
  trackId: string;
  albumName: string;
  releaseDate: string;
  popularity: number;
  durationMs: number;
}
```

### Type-Safe Usage

```typescript
import { searchAndGetLinks, type SearchResult, type TrackInfo } from 'spotify-find-preview';

async function typeSafeExample() {
  const result: SearchResult = await searchAndGetLinks('Test Song', 'Test Artist');
  
  if (result.success) {
    // TypeScript knows result.results is available and properly typed
    result.results.forEach((track: TrackInfo) => {
      // All properties are type-checked at compile time
      const name: string = track.name;
      const duration: number = track.durationMs;
      const urls: string[] = track.previewUrls;
    });
  } else {
    // TypeScript knows result.error is available
    console.error(result.error);
  }
}
```

## Environment Variables Setup

Create a `.env` file in your project root:

```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
```

### How Authentication Works

The package handles authentication automatically:

1. When you call `dotenv.config()`, it loads your credentials from the `.env` file into `process.env`
2. When you call the function, it:
   - Creates a Spotify API client using your credentials
   - Gets an access token automatically (valid for 1 hour)
   - Uses this token for the search request
   - The token is refreshed automatically when needed

## API Reference

### `searchAndGetLinks(songName, [artistOrLimit], [limit])`

#### Parameters

- `songName` (string) - **Required** - The name of the song to search for
- `artistOrLimit` (string | number, optional) - Either:
  - Artist name (string) for more accurate search results
  - Maximum number of results (number) for backward compatibility
- `limit` (number, optional) - Maximum number of results to return (default: 5, only used when `artistOrLimit` is an artist name)

#### Usage Examples

```typescript
// Basic search (backward compatible)
await searchAndGetLinks('Shape of You');                    // Default limit of 5
await searchAndGetLinks('Shape of You', 3);                 // Limit to 3 results

// Enhanced search with artist
await searchAndGetLinks('Shape of You', 'Ed Sheeran');      // Default limit of 5
await searchAndGetLinks('Shape of You', 'Ed Sheeran', 2);   // Limit to 2 results
```

#### Returns

`Promise<SearchResult>` - Promise that resolves to an object with:

- `success` (boolean) - Whether the request was successful
- `searchQuery` (string, optional) - The actual search query used (for transparency)
- `results` (TrackInfo[]) - Array of track objects containing:
  - `name` (string) - Song name with artist(s)
  - `spotifyUrl` (string) - Spotify URL for the song
  - `previewUrls` (string[]) - Array of preview URLs
  - `trackId` (string) - Spotify track ID
  - `albumName` (string) - Album name
  - `releaseDate` (string) - Release date
  - `popularity` (number) - Popularity score (0-100)
  - `durationMs` (number) - Duration in milliseconds
- `error` (string, optional) - Error message if success is false

## Development

### Building the Project

```bash
npm run build
```

### Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Running Examples

```bash
npm run dev
```

## Getting Spotify Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create an App"
4. Fill in the app name and description
5. Once created, you'll see your Client ID and Client Secret
6. Copy these credentials to your `.env` file:
   ```env
   SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here
   ```

## Common Issues

1. **"Authentication failed" error**: Make sure your `.env` file is in the root directory and credentials are correct
2. **"Cannot find module 'dotenv'"**: Run `npm install dotenv`
3. **No environment variables found**: Make sure you call `dotenv.config()` at the top of your main file
4. **Too many/irrelevant results**: Use the artist parameter for more accurate results
5. **TypeScript compilation errors**: Make sure you have TypeScript installed: `npm install --save-dev typescript`

## Benefits of Using Artist Parameter

1. **Higher Accuracy**: Including the artist name significantly reduces false positives
2. **Better Ranking**: Results are more likely to match your intended song
3. **Fewer Results to Sift Through**: More targeted search results
4. **Backward Compatible**: Existing code continues to work without changes

## Changelog

### v3.0.0
- ✨ Complete TypeScript rewrite with full type definitions
- 📦 Modern ES Module (ESM) support
- ✅ Comprehensive test suite with Vitest
- 📚 Improved documentation with TypeScript examples
- 🔧 Better error handling and type safety
- 🎯 Maintained backward compatibility with v2.x

### v2.1.0
- Added artist parameter for more accurate searches
- Enhanced metadata in search results
- Improved error handling

### v2.0.0
- Initial version with basic search functionality

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Author

daisseur (orignal repo by lakshay00)

## Links

- [GitHub Repository](https://github.com/lakshay007/spot)
- [npm Package](https://www.npmjs.com/package/spotify-find-preview)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
