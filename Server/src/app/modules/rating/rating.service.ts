
import { prisma } from '../../middleware/prisma';
import { IRatingInput } from './rating.interface';

const createRating = async (data: IRatingInput) => {
  const existing = await prisma.rating.findUnique({
    where: {
      userId_mediaId: {
        userId: data.userId,
        mediaId: data.mediaId,
      },
    },
  });

  if (existing) {
    return await prisma.rating.update({
      where: {
        userId_mediaId: {
          userId: data.userId,
          mediaId: data.mediaId,
        },
      },
      data: {
        rating: data.rating,
      },
    });
  }

  return await prisma.rating.create({
    data,
  });
};

const getRatingsByMediaId = async (mediaId: string) => {
  return await prisma.rating.findMany({
    where: { mediaId },
    include: { user: true },
  });
};

const updateRating = async (userId: string, mediaId: string, rating: number) => {


  const existing = await prisma.rating.findUnique({
    where: {
      userId_mediaId: { userId, mediaId },
    },
  });
  if (!existing) {
    throw new Error('Rating not found');
  }

  
  return await prisma.rating.update({
    where: {
      userId_mediaId: { userId, mediaId },
    },
    data: { rating },
  });
};

const deleteRating = async (userId: string, mediaId: string) => {
  return await prisma.rating.delete({
    where: {
      userId_mediaId: { userId, mediaId },
    },
  });
};


const getAverageRating = async (mediaId: string) => {
  const result = await prisma.rating.aggregate({
    where: { mediaId },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  return {
    averageRating: result._avg.rating || 0,
    totalRatings: result._count.rating || 0,
  };
};


export const ratingService = {
  createRating,
  getRatingsByMediaId,
  updateRating,
  deleteRating,
    getAverageRating,
};
