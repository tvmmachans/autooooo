import axios from 'axios';

export interface StockMediaItem {
  id: string;
  url: string;
  thumbnailUrl: string;
  type: 'image' | 'video';
  width: number;
  height: number;
  duration?: number;
  source: 'pexels' | 'unsplash';
  tags?: string[];
}

export interface StockMediaSearchParams {
  query: string;
  type?: 'image' | 'video';
  orientation?: 'landscape' | 'portrait' | 'square';
  perPage?: number;
  page?: number;
}

export class StockMediaService {
  private pexelsApiKey: string;
  private unsplashApiKey: string;

  constructor() {
    this.pexelsApiKey = process.env.PEXELS_API_KEY || '';
    this.unsplashApiKey = process.env.UNSPLASH_API_KEY || '';
  }

  async searchMedia(params: StockMediaSearchParams): Promise<StockMediaItem[]> {
    const results: StockMediaItem[] = [];

    // Search Pexels (videos and images)
    if (this.pexelsApiKey) {
      try {
        const pexelsResults = await this.searchPexels(params);
        results.push(...pexelsResults);
      } catch (error) {
        console.error('Pexels search failed:', error);
      }
    }

    // Search Unsplash (images only)
    if (this.unsplashApiKey && (!params.type || params.type === 'image')) {
      try {
        const unsplashResults = await this.searchUnsplash(params);
        results.push(...unsplashResults);
      } catch (error) {
        console.error('Unsplash search failed:', error);
      }
    }

    return results;
  }

  private async searchPexels(params: StockMediaSearchParams): Promise<StockMediaItem[]> {
    const type = params.type || 'video'; // Pexels is better for videos
    const url = type === 'video'
      ? 'https://api.pexels.com/videos/search'
      : 'https://api.pexels.com/v1/search';

    const response = await axios.get(url, {
      params: {
        query: params.query,
        per_page: params.perPage || 20,
        page: params.page || 1,
        orientation: params.orientation,
      },
      headers: {
        Authorization: this.pexelsApiKey,
      },
    });

    if (type === 'video') {
      return response.data.videos.map((video: any) => ({
        id: `pexels_${video.id}`,
        url: video.video_files[0]?.link || video.video_files.find((f: any) => f.quality === 'hd')?.link,
        thumbnailUrl: video.image,
        type: 'video' as const,
        width: video.width,
        height: video.height,
        duration: video.duration,
        source: 'pexels' as const,
        tags: video.tags?.map((t: any) => t.title),
      }));
    } else {
      return response.data.photos.map((photo: any) => ({
        id: `pexels_${photo.id}`,
        url: photo.src.large,
        thumbnailUrl: photo.src.medium,
        type: 'image' as const,
        width: photo.width,
        height: photo.height,
        source: 'pexels' as const,
        tags: [],
      }));
    }
  }

  private async searchUnsplash(params: StockMediaSearchParams): Promise<StockMediaItem[]> {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query: params.query,
        per_page: params.perPage || 20,
        page: params.page || 1,
        orientation: params.orientation,
      },
      headers: {
        Authorization: `Client-ID ${this.unsplashApiKey}`,
      },
    });

    return response.data.results.map((photo: any) => ({
      id: `unsplash_${photo.id}`,
      url: photo.urls.regular,
      thumbnailUrl: photo.urls.thumb,
      type: 'image' as const,
      width: photo.width,
      height: photo.height,
      source: 'unsplash' as const,
      tags: photo.tags?.map((t: any) => t.title) || [],
    }));
  }

  async getMediaById(id: string): Promise<StockMediaItem | null> {
    const [source, mediaId] = id.split('_');

    if (source === 'pexels') {
      return this.getPexelsMediaById(mediaId);
    } else if (source === 'unsplash') {
      return this.getUnsplashMediaById(mediaId);
    }

    return null;
  }

  private async getPexelsMediaById(id: string): Promise<StockMediaItem | null> {
    try {
      const response = await axios.get(`https://api.pexels.com/videos/videos/${id}`, {
        headers: {
          Authorization: this.pexelsApiKey,
        },
      });

      const video = response.data;
      return {
        id: `pexels_${video.id}`,
        url: video.video_files[0]?.link,
        thumbnailUrl: video.image,
        type: 'video',
        width: video.width,
        height: video.height,
        duration: video.duration,
        source: 'pexels',
        tags: video.tags?.map((t: any) => t.title),
      };
    } catch (error) {
      return null;
    }
  }

  private async getUnsplashMediaById(id: string): Promise<StockMediaItem | null> {
    try {
      const response = await axios.get(`https://api.unsplash.com/photos/${id}`, {
        headers: {
          Authorization: `Client-ID ${this.unsplashApiKey}`,
        },
      });

      const photo = response.data;
      return {
        id: `unsplash_${photo.id}`,
        url: photo.urls.regular,
        thumbnailUrl: photo.urls.thumb,
        type: 'image',
        width: photo.width,
        height: photo.height,
        source: 'unsplash',
        tags: photo.tags?.map((t: any) => t.title) || [],
      };
    } catch (error) {
      return null;
    }
  }
}

