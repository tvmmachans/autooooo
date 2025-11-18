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
export declare class StockMediaService {
    private pexelsApiKey;
    private unsplashApiKey;
    constructor();
    searchMedia(params: StockMediaSearchParams): Promise<StockMediaItem[]>;
    private searchPexels;
    private searchUnsplash;
    getMediaById(id: string): Promise<StockMediaItem | null>;
    private getPexelsMediaById;
    private getUnsplashMediaById;
}
//# sourceMappingURL=StockMediaService.d.ts.map