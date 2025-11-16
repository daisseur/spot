/**
 * Example usage of spotify-preview-finder TypeScript module
 * 
 * Before running this example:
 * 1. Create a .env file with your Spotify credentials:
 *    SPOTIFY_CLIENT_ID=your_client_id
 *    SPOTIFY_CLIENT_SECRET=your_client_secret
 * 
 * 2. Run with: npm run dev
 */

import { searchAndGetLinks, type SearchResult, type TrackInfo } from './index.js';

/**
 * Example 1: Basic search with song name only
 */
async function basicSearch() {
  console.log('\n=== Example 1: Basic Search ===');
  const result = await searchAndGetLinks('Shape of You', 2);
  
  if (result.success) {
    console.log(`Search Query: ${result.searchQuery}`);
    console.log(`Found ${result.results.length} track(s):\n`);
    
    result.results.forEach((track, index) => {
      console.log(`${index + 1}. ${track.name}`);
      console.log(`   Album: ${track.albumName}`);
      console.log(`   Popularity: ${track.popularity}/100`);
      console.log(`   Preview URLs: ${track.previewUrls.length} found`);
    });
  } else {
    console.error('Search failed:', result.error);
  }
}

/**
 * Example 2: Enhanced search with artist name for better accuracy
 */
async function searchWithArtist() {
  console.log('\n=== Example 2: Search with Artist ===');
  const result = await searchAndGetLinks('Bohemian Rhapsody', 'Queen', 1);
  
  if (result.success && result.results.length > 0) {
    const track = result.results[0];
    console.log(`Search Query: ${result.searchQuery}`);
    console.log(`\nFound: ${track.name}`);
    console.log(`Album: ${track.albumName} (${track.releaseDate})`);
    console.log(`Duration: ${Math.round(track.durationMs / 1000)}s`);
    console.log(`Spotify URL: ${track.spotifyUrl}`);
    
    if (track.previewUrls.length > 0) {
      console.log(`\nPreview URLs:`);
      track.previewUrls.forEach(url => console.log(`  - ${url}`));
    }
  } else {
    console.error('Search failed:', result.error);
  }
}

/**
 * Example 3: Batch search with multiple songs
 */
async function batchSearch() {
  console.log('\n=== Example 3: Batch Search ===');
  
  const searches = [
    { song: 'Imagine', artist: 'John Lennon' },
    { song: 'Hotel California', artist: 'Eagles' },
    { song: 'Yesterday', artist: 'The Beatles' }
  ];

  for (const search of searches) {
    const result = await searchAndGetLinks(search.song, search.artist, 1);
    
    if (result.success && result.results.length > 0) {
      const track = result.results[0];
      console.log(`\n"${search.song}" by ${search.artist}:`);
      console.log(`  ✓ Found: ${track.name}`);
      console.log(`  ✓ Album: ${track.albumName}`);
      console.log(`  ✓ Preview URLs: ${track.previewUrls.length}`);
    } else {
      console.log(`\n"${search.song}" by ${search.artist}: ✗ Not found`);
    }
  }
}

/**
 * Example 4: TypeScript type safety demonstration
 */
async function typeSafetyExample() {
  console.log('\n=== Example 4: TypeScript Type Safety ===');
  
  // TypeScript ensures we handle all possible outcomes
  const result: SearchResult = await searchAndGetLinks('Test', 1);
  
  if (result.success) {
    // TypeScript knows result.results is available and properly typed
    result.results.forEach((track: TrackInfo) => {
      // All properties are type-checked
      const info: string = track.name;
      const duration: number = track.durationMs;
      const urls: string[] = track.previewUrls;
      
      console.log(`Track: ${info}, Duration: ${duration}ms, URLs: ${urls.length}`);
    });
  } else {
    // TypeScript knows result.error is available
    console.error(`Error: ${result.error}`);
  }
}

/**
 * Run all examples
 */
async function runAllExamples() {
  try {
    await basicSearch();
    await searchWithArtist();
    await batchSearch();
    await typeSafetyExample();
    
    console.log('\n✅ All examples completed successfully!');
  } catch (error) {
    console.error('\n❌ Error running examples:', error);
    process.exit(1);
  }
}

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples();
}

export { basicSearch, searchWithArtist, batchSearch, typeSafetyExample };
