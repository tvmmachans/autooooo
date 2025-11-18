import axios from 'axios';
export class StockMediaService {
    pexelsApiKey;
    unsplashApiKey;
    constructor() {
        this.pexelsApiKey = process.env.PEXELS_API_KEY || '';
        this.unsplashApiKey = process.env.UNSPLASH_API_KEY || '';
    }
    async searchMedia(params) {
        const results = [];
        // Search Pexels (videos and images)
        if (this.pexelsApiKey) {
            try {
                const pexelsResults = await this.searchPexels(params);
                results.push(...pexelsResults);
            }
            catch (error) {
                console.error('Pexels search failed:', error);
            }
        }
        // Search Unsplash (images only)
        if (this.unsplashApiKey && (!params.type || params.type === 'image')) {
            try {
                const unsplashResults = await this.searchUnsplash(params);
                results.push(...unsplashResults);
            }
            catch (error) {
                console.error('Unsplash search failed:', error);
            }
        }
        return results;
    }
    async searchPexels(params) {
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
            return response.data.videos.map((video) => ({
                id: `pexels_${video.id}`,
                url: video.video_files[0]?.link || video.video_files.find((f) => f.quality === 'hd')?.link,
                thumbnailUrl: video.image,
                type: 'video',
                width: video.width,
                height: video.height,
                duration: video.duration,
                source: 'pexels',
                tags: video.tags?.map((t) => t.title),
            }));
        }
        else {
            return response.data.photos.map((photo) => ({
                id: `pexels_${photo.id}`,
                url: photo.src.large,
                thumbnailUrl: photo.src.medium,
                type: 'image',
                width: photo.width,
                height: photo.height,
                source: 'pexels',
                tags: [],
            }));
        }
    }
    async searchUnsplash(params) {
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
        return response.data.results.map((photo) => ({
            id: `unsplash_${photo.id}`,
            url: photo.urls.regular,
            thumbnailUrl: photo.urls.thumb,
            type: 'image',
            width: photo.width,
            height: photo.height,
            source: 'unsplash',
            tags: photo.tags?.map((t) => t.title) || [],
        }));
    }
    async getMediaById(id) {
        const [source, mediaId] = id.split('_');
        if (source === 'pexels') {
            return this.getPexelsMediaById(mediaId);
        }
        else if (source === 'unsplash') {
            return this.getUnsplashMediaById(mediaId);
        }
        return null;
    }
    async getPexelsMediaById(id) {
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
                tags: video.tags?.map((t) => t.title),
            };
        }
        catch (error) {
            return null;
        }
    }
    async getUnsplashMediaById(id) {
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
                tags: photo.tags?.map((t) => t.title) || [],
            };
        }
        catch (error) {
            return null;
        }
    }
}
//# sourceMappingURL=StockMediaService.js.map