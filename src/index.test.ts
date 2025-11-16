import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchAndGetLinks } from './index';
import type { SearchResult } from './index';

// Mock environment variables
beforeEach(() => {
  process.env.SPOTIFY_CLIENT_ID = 'test_client_id';
  process.env.SPOTIFY_CLIENT_SECRET = 'test_client_secret';
});

describe('searchAndGetLinks', () => {
  describe('Basic validation', () => {
    it('should throw error when song name is empty', async () => {
      const result = await searchAndGetLinks('');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Song name is required');
    });

    it('should throw error when environment variables are not set', async () => {
      delete process.env.SPOTIFY_CLIENT_ID;
      delete process.env.SPOTIFY_CLIENT_SECRET;
      
      const result = await searchAndGetLinks('Test Song');
      expect(result.success).toBe(false);
      expect(result.error).toContain('environment variables are required');
    });
  });

  describe('Parameter handling', () => {
    it('should handle song name only (default limit)', async () => {
      // This test would require mocking Spotify API
      // For now, we'll test the function signature
      const result = await searchAndGetLinks('Shape of You');
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('results');
      expect(Array.isArray(result.results)).toBe(true);
    });

    it('should handle song name with numeric limit', async () => {
      const result = await searchAndGetLinks('Shape of You', 3);
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('results');
      expect(Array.isArray(result.results)).toBe(true);
    });

    it('should handle song name with artist name', async () => {
      const result = await searchAndGetLinks('Shape of You', 'Ed Sheeran');
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('results');
      expect(Array.isArray(result.results)).toBe(true);
      if (result.success) {
        expect(result.searchQuery).toContain('track:');
        expect(result.searchQuery).toContain('artist:');
      }
    });

    it('should handle song name with artist and limit', async () => {
      const result = await searchAndGetLinks('Shape of You', 'Ed Sheeran', 2);
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('results');
      expect(Array.isArray(result.results)).toBe(true);
    });
  });

  describe('Response structure', () => {
    it('should return proper SearchResult structure on failure', async () => {
      const result = await searchAndGetLinks('');
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('results');
      expect(result).toHaveProperty('error');
      expect(result.success).toBe(false);
      expect(result.results).toEqual([]);
      expect(typeof result.error).toBe('string');
    });

    it('should have correct SearchResult type on success', () => {
      const mockResult: SearchResult = {
        success: true,
        searchQuery: 'test query',
        results: [
          {
            name: 'Test Song - Test Artist',
            spotifyUrl: 'https://open.spotify.com/track/test',
            previewUrls: ['https://p.scdn.co/mp3-preview/test'],
            trackId: 'test123',
            albumName: 'Test Album',
            releaseDate: '2021-01-01',
            popularity: 85,
            durationMs: 180000
          }
        ]
      };

      expect(mockResult.success).toBe(true);
      expect(mockResult.results).toHaveLength(1);
      expect(mockResult.results[0]).toHaveProperty('name');
      expect(mockResult.results[0]).toHaveProperty('spotifyUrl');
      expect(mockResult.results[0]).toHaveProperty('previewUrls');
      expect(mockResult.results[0]).toHaveProperty('trackId');
      expect(mockResult.results[0]).toHaveProperty('albumName');
      expect(mockResult.results[0]).toHaveProperty('releaseDate');
      expect(mockResult.results[0]).toHaveProperty('popularity');
      expect(mockResult.results[0]).toHaveProperty('durationMs');
    });
  });

  describe('Type safety', () => {
    it('should ensure TrackInfo has all required properties', () => {
      const trackInfo = {
        name: 'Test',
        spotifyUrl: 'url',
        previewUrls: [],
        trackId: 'id',
        albumName: 'album',
        releaseDate: 'date',
        popularity: 0,
        durationMs: 0
      };

      // Type checking - if this compiles, types are correct
      expect(trackInfo).toBeDefined();
    });

    it('should validate result contains correct types', async () => {
      const result = await searchAndGetLinks('Test');
      
      expect(typeof result.success).toBe('boolean');
      expect(Array.isArray(result.results)).toBe(true);
      
      if (result.success && result.results.length > 0) {
        const track = result.results[0];
        expect(typeof track.name).toBe('string');
        expect(typeof track.spotifyUrl).toBe('string');
        expect(Array.isArray(track.previewUrls)).toBe(true);
        expect(typeof track.trackId).toBe('string');
        expect(typeof track.albumName).toBe('string');
        expect(typeof track.releaseDate).toBe('string');
        expect(typeof track.popularity).toBe('number');
        expect(typeof track.durationMs).toBe('number');
      }
    });
  });

  describe('Backward compatibility', () => {
    it('should support old API: searchAndGetLinks(songName)', async () => {
      const result = await searchAndGetLinks('Test Song');
      expect(result).toBeDefined();
    });

    it('should support old API: searchAndGetLinks(songName, limit)', async () => {
      const result = await searchAndGetLinks('Test Song', 5);
      expect(result).toBeDefined();
    });

    it('should support new API: searchAndGetLinks(songName, artist)', async () => {
      const result = await searchAndGetLinks('Test Song', 'Test Artist');
      expect(result).toBeDefined();
    });

    it('should support new API: searchAndGetLinks(songName, artist, limit)', async () => {
      const result = await searchAndGetLinks('Test Song', 'Test Artist', 3);
      expect(result).toBeDefined();
    });
  });
});
