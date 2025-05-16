import ApiError from '../../errors/apiError';
import { prisma } from '../../middleware/prisma';
import { IReview } from './review.interface';
 // Adjust path as needed

const createReview = async (reviewData: Required<Pick<IReview, 'mediaId' | 'comment'>> & { userId: string }) => {
  if (!reviewData.userId) {
    throw new ApiError(401, 'Unauthorized access: User ID is required');
  }

  return await prisma.review.create({
    data: {
      userId: reviewData.userId,
      mediaId: reviewData.mediaId,
      comment: reviewData.comment,
    },
  });
};

const getReviewsByMediaId = async (mediaId: string) => {
  return await prisma.review.findMany({
    where: { mediaId },
    include: { 
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          password: false
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  });
};

const deleteReviewById = async (reviewId: string, userId: string) => {
  if (!userId) {
    throw new ApiError(401, 'Unauthorized access: User ID is required');
  }

  const existing = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!existing || existing.userId !== userId) {
    throw new ApiError(403, 'Unauthorized or review not found');
  }

  return await prisma.review.delete({ where: { id: reviewId } });
};

const updateReviewById = async (reviewId: string, userId: string, updateData: { comment: string }) => {
  if (!userId) {
    throw new ApiError(401, 'Unauthorized access: User ID is required');
  }

  const existing = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!existing || existing.userId !== userId) {
    throw new ApiError(403, 'Unauthorized or review not found');
  }

  return await prisma.review.update({
    where: { id: reviewId },
    data: { comment: updateData.comment },
  });
};

export const reviewService = {
  createReview,
  getReviewsByMediaId,
  deleteReviewById,
  updateReviewById,
};