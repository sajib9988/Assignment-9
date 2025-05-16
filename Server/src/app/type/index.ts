export interface IResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data?: any;
    meta?: {
        page: number;
        limit: number;
        skip: number;
        total: number
    }
}




 export type IMovieReponse = {
    id: string;
    title: string;
    description: string;
    genre: string;
    videoUrl: string;
    thumbnail: string;
    createdAt?: Date;
  };





  export type IMovieUpdatePayload = {
    title?: string;
    description?: string;
    genre?: string;
    videoUrl?: string;
    thumbnail?: string;
  };


  export interface IMediaFilter {
    searchTerm?: string;
    genre?: string;
    title?: string;
    type?: 'MOVIE' | 'SERIES';
  }
  
  
  export interface IOptionsMedia {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
  