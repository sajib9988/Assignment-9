export interface IMedia {
    id?: string;
    title: string;
    description: string;
    genre: string;
    thumbnail: string;
    videoUrls: string[];
    type: 'MOVIE' | 'SERIES';
    amount?: number | null;
    releaseDate?: Date;
    createdAt?: Date;
  }