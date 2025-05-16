import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { reviewService } from './review.service';


const createReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId ;
  console.log(userId);
  
  const reviewData = { ...req.body, userId };
  const result = await reviewService.createReview(reviewData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

const getReviews = catchAsync(async (req: Request, res: Response) => {
  const mediaId = req.params.mediaId;
  const result = await reviewService.getReviewsByMediaId(mediaId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reviews fetched successfully',
    data: result,
  });
});



const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const reviewId = req.params.id;
  const userId = req.user?.userId;
  if (!userId) {
    throw new Error('User ID is required');
  }
  const result = await reviewService.deleteReviewById(reviewId, userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review deleted successfully',
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const reviewId = req.params.id; 
  const userId = req.user?.userId;

  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'User not found',
      data: null,
    });
  }

  const updateData = req.body;
  const result = await reviewService.updateReviewById(reviewId, userId, updateData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review updated successfully',
    data: result,
  });
});

export const reviewController = {
  createReview,
  getReviews,
  deleteReview,
  updateReview,
};
