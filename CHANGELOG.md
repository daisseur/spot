# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2025-11-16

### Added
- ✨ Complete TypeScript rewrite with full type definitions
- 📦 Modern ES Module (ESM) support
- ✅ Comprehensive test suite with Vitest (14 tests)
- 📚 TypeScript interfaces: `SearchResult` and `TrackInfo`
- 🔧 Build and test scripts
- 📖 Example file demonstrating TypeScript usage
- 🎯 Type-safe API with proper error handling

### Changed
- 🔄 Migrated from JavaScript (CommonJS) to TypeScript (ES Modules)
- 📝 Updated README with TypeScript examples and comprehensive documentation
- 🏗️ Project structure: source code now in `src/` directory
- 📦 Package entry point changed from `index.js` to `dist/index.js`
- 🔧 Version bumped to 3.0.0 (major version due to module type change)

### Maintained
- 🎯 Backward compatibility with v2.x API
- ✅ All existing functionality preserved
- 🔑 Same authentication mechanism with environment variables
- 📊 Same metadata and preview URL extraction features

### Technical Details
- TypeScript 5.9.3
- Vitest 4.0.9 for testing
- Modern ES2020 target
- Strict TypeScript mode enabled
- Source maps and declaration maps included

## [2.1.0] - Previous Version

### Added
- Artist parameter for more accurate searches
- Enhanced metadata in search results (trackId, albumName, releaseDate, popularity, durationMs)
- Search query transparency (returned in results)

### Changed
- Improved error handling
- Better parameter handling for backward compatibility

## [2.0.0] - Initial Version

### Added
- Basic song search functionality
- Preview URL extraction from Spotify
- Spotify Web API integration
- Environment variable configuration
