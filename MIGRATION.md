# Migration Guide: v2.x to v3.0

## Overview

Version 3.0 is a complete TypeScript rewrite of the package with modern ES Module support. While the API remains backward compatible, there are some important changes to be aware of.

## What Changed

### Module System
- **v2.x**: CommonJS (require/module.exports)
- **v3.0**: ES Modules (import/export)

### File Structure
- **v2.x**: `index.js` at root
- **v3.0**: TypeScript source in `src/`, compiled output in `dist/`

### TypeScript Support
- **v2.x**: No TypeScript definitions
- **v3.0**: Full TypeScript support with type definitions

## Migration Steps

### For JavaScript Users (CommonJS)

If you're using the old CommonJS syntax, **your code should continue to work** as the package maintains backward compatibility:

```javascript
// v2.x - Still works in v3.0
require('dotenv').config();
const spotifyPreviewFinder = require('spotify-preview-finder');

async function example() {
  const result = await spotifyPreviewFinder('Shape of You', 'Ed Sheeran');
  if (result.success) {
    console.log(result.results[0].name);
  }
}
```

### For ES Module Users

If your project uses ES Modules (type: "module" in package.json), use the new import syntax:

```javascript
// v3.0 - New ES Module syntax
import { searchAndGetLinks } from 'spotify-preview-finder';
import { config } from 'dotenv';

config();

async function example() {
  const result = await searchAndGetLinks('Shape of You', 'Ed Sheeran');
  if (result.success) {
    console.log(result.results[0].name);
  }
}
```

### For TypeScript Users

If you're using TypeScript, you now have full type support:

```typescript
// v3.0 - TypeScript with full type definitions
import { searchAndGetLinks, type SearchResult, type TrackInfo } from 'spotify-preview-finder';
import { config } from 'dotenv';

config();

async function example() {
  const result: SearchResult = await searchAndGetLinks('Shape of You', 'Ed Sheeran');
  
  if (result.success) {
    result.results.forEach((track: TrackInfo) => {
      console.log(track.name);
      console.log(track.albumName);
      console.log(track.previewUrls);
    });
  } else {
    console.error(result.error);
  }
}
```

## Breaking Changes

### None for Most Users

The API is fully backward compatible. Your existing code should work without changes.

### Potential Issues

1. **Module Resolution**: If you're using TypeScript or ES Modules, ensure your `tsconfig.json` or Node.js configuration supports ES Modules.

2. **Build Process**: If you were importing the source directly (not recommended), you now need to import from the built `dist` directory. Use the package name instead:
   ```typescript
   // ✅ Correct
   import { searchAndGetLinks } from 'spotify-preview-finder';
   
   // ❌ Don't do this
   import { searchAndGetLinks } from 'spotify-preview-finder/src/index';
   ```

3. **Node.js Version**: Minimum Node.js version is now 16.0.0 (for ES Module support).

## New Features in v3.0

### Type Definitions

```typescript
interface SearchResult {
  success: boolean;
  searchQuery?: string;
  results: TrackInfo[];
  error?: string;
}

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

### Better IDE Support

With TypeScript definitions, you get:
- IntelliSense/autocomplete in VS Code and other IDEs
- Type checking at compile time
- Better documentation through JSDoc comments
- Catch errors before runtime

### Example File

Check out `src/example.ts` for comprehensive usage examples.

## Testing

The package now includes a full test suite. Run tests locally:

```bash
npm test
```

## Questions?

If you encounter any issues during migration, please:
1. Check the [README.md](README.md) for updated examples
2. Open an issue on [GitHub](https://github.com/lakshay007/spot/issues)

## Summary

- ✅ API is backward compatible
- ✅ CommonJS imports still work
- ✅ New ES Module syntax available
- ✅ Full TypeScript support
- ✅ Better error handling
- ✅ Comprehensive tests
- ⚠️ Requires Node.js 16+
