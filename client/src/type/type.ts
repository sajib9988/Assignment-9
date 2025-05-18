export interface IUser{
    userId: string;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    isActive?: boolean;
    role: "ADMIN" | "user";
    iat?: number;
    exp?: number;
   
}

export enum MediaType {
  MOVIE = "MOVIE",
  SERIES = "SERIES"
}

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER"
}

export enum PaymentMethod {
  ONLINE = "ONLINE",
  CASH = "CASH"
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED"
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  id: string;
  title: string;
  description: string;
  genre: string;
  thumbnail: string | File ;
  type: string;
  videoUrls: string[];
  amount: number;
  releaseDate: string;
  createdAt: string;
  updatedAt: string;
  rating?: number; // Optional, as it’s not in the provided response
}

export interface Rating {
  id: string;
  userId: string;
  mediaId: string;
  rating: number;
  user?: User;
  media?: Media;
}

export interface Review {
  id: string;
  userId: string;
  mediaId: string;
  comment: string;
  user?: User;
  media?: Media;
  createdAt: string;
  likes?: number;
  isApproved?: boolean;
  hasSpoilers?: boolean;
  tags?: string[];
}

export interface Payment {
  id: string;
  userId: string;
  mediaId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paymentGatewayData?: any;
  createdAt: string;
  updatedAt: string;
  user?: User;
  media?: Media;
}

export interface WatchHistory {
  id: string;
  userId: string;
  mediaId: string;
  watchedAt: string;
  user?: User;
  media?: Media;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  mediaId: string;
  addedAt: string;
  media?: Media;
}


export interface MediaResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
    };
    data: Media[];
  };
}


export type IPaymentData = {
  amount: number;
  transactionId: string;
  name: string;
  email: string;
  userId: string;
  contentId: string;
  type: "MOVIE" | "SERIES";
};
