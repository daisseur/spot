import axios from 'axios';
import * as cheerio from 'cheerio';
import SpotifyWebApi from 'spotify-web-api-node';
import { config as dotenvConfig } from 'dotenv';

// Load environment variables
dotenvConfig();

/**
 * Track information returned by the search
 */
export interface TrackInfo {
  name: string;
  spotifyUrl: string;
  previewUrls: string[];
  trackId: string;
  albumName: string;
  releaseDate: string;
  popularity: number;
  durationMs: number;
}

/**
 * Search result containing all tracks found
 */
export interface SearchResult {
  success: boolean;
  searchQuery?: string;
  results: TrackInfo[];
  error?: string;
}

/**
 * Creates a Spotify API client with credentials from environment variables
 * @throws {Error} If SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET are not set
 * @returns {SpotifyWebApi} Configured Spotify API client
 */
function createSpotifyApi(): SpotifyWebApi {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables are required');
  }

  return new SpotifyWebApi({
    clientId,
    clientSecret
  });
}

/**
 * Fetches and extracts Spotify CDN links from a Spotify URL
 * @param url - The Spotify track URL to scrape
 * @returns Promise resolving to an array of preview URLs
 * @throws {Error} If fetching or parsing fails
 */
async function getSpotifyLinks(url: string): Promise<string[]> {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const scdnLinks = new Set<string>();

    $('*').each((_, element) => {
      if ('attribs' in element && element.attribs) {
        const attrs = element.attribs;
        Object.values(attrs).forEach(value => {
          if (value && typeof value === 'string' && value.includes('p.scdn.co')) {
            scdnLinks.add(value);
          }
        });
      }
    });

    return Array.from(scdnLinks);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to fetch preview URLs: ${errorMessage}`);
  }
}

/**
 * Search for songs and get their preview URLs
 * @param songName - The name of the song to search for
 * @param artistOrLimit - Artist name (string) or limit (number) for backward compatibility
 * @param limit - Maximum number of results to return (only used when artistOrLimit is a string)
 * @returns Promise resolving to search results with track information
 * 
 * @example
 * // Basic search
 * await searchAndGetLinks('Shape of You');
 * 
 * @example
 * // Search with limit
 * await searchAndGetLinks('Shape of You', 3);
 * 
 * @example
 * // Search with artist for better accuracy
 * await searchAndGetLinks('Shape of You', 'Ed Sheeran', 2);
 */
export async function searchAndGetLinks(
  songName: string,
  artistOrLimit?: string | number,
  limit: number = 5
): Promise<SearchResult> {
  try {
    if (!songName) {
      throw new Error('Song name is required');
    }

    // Handle backward compatibility and parameter parsing
    let artist: string | null = null;
    let actualLimit = 5;

    if (typeof artistOrLimit === 'string') {
      // New usage: searchAndGetLinks(songName, artist, limit)
      artist = artistOrLimit;
      actualLimit = limit;
    } else if (typeof artistOrLimit === 'number') {
      // Old usage: searchAndGetLinks(songName, limit)
      actualLimit = artistOrLimit;
    } else if (artistOrLimit === undefined) {
      // Default usage: searchAndGetLinks(songName)
      actualLimit = 5;
    }

    const spotifyApi = createSpotifyApi();
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body['access_token']);
    
    // Construct search query with artist if provided
    let searchQuery = songName;
    if (artist) {
      searchQuery = `track:"${songName}" artist:"${artist}"`;
    }
    
    const searchResults = await spotifyApi.searchTracks(searchQuery);
    
    if (!searchResults.body.tracks || searchResults.body.tracks.items.length === 0) {
      return {
        success: false,
        error: 'No songs found',
        results: []
      };
    }

    const tracks = searchResults.body.tracks.items.slice(0, actualLimit);
    const results = await Promise.all(tracks.map(async (track: SpotifyApi.TrackObjectFull): Promise<TrackInfo> => {
      const spotifyUrl = track.external_urls.spotify;
      const previewUrls = await getSpotifyLinks(spotifyUrl);
      
      return {
        name: `${track.name} - ${track.artists.map((artist: SpotifyApi.ArtistObjectSimplified) => artist.name).join(', ')}`,
        spotifyUrl,
        previewUrls,
        trackId: track.id,
        albumName: track.album.name,
        releaseDate: track.album.release_date,
        popularity: track.popularity,
        durationMs: track.duration_ms
      };
    }));

    return {
      success: true,
      searchQuery,
      results
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: errorMessage,
      results: []
    };
  }
}

// Default export for backward compatibility
export default searchAndGetLinks;
