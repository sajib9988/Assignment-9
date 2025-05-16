import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { ratingService } from './rating.service';

const createOrUpdateRating = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  console.log('✅ [createOrUpdateRating] userId:', userId);

  const { mediaId, rating } = req.body;
  console.log('📥 [createOrUpdateRating] Incoming Body:', req.body);
  console.log('➡️ mediaId:', mediaId);
  console.log('⭐ rating:', rating);

  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'User ID is required',
    });
  }

  const result = await ratingService.createRating({
    userId,
    mediaId,
    rating,
  });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rating created or updated successfully',
    data: result,
  });
});





const getRatingsByMediaId = catchAsync(async (req: Request, res: Response) => {
  const mediaId = req.params.mediaId;
  if (!mediaId) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Media ID is required',
    });
  }

  const result = await ratingService.getRatingsByMediaId(mediaId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Ratings fetched successfully',
    data: result,
  });
});

const updateRating = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const mediaId = req.params.mediaId;
  const newRating = req.body.rating;

  if (!userId || !mediaId) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'User ID and Media ID are required',
    });
  }

  const result = await ratingService.updateRating(userId, mediaId, newRating);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rating updated successfully',
    data: result,
  });
});

const deleteRating = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const mediaId = req.params.mediaId;

  if (!userId || !mediaId) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'User ID and Media ID are required',
    });
  }

  const result = await ratingService.deleteRating(userId, mediaId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rating deleted successfully',
    data: result,
  });
});

const getAverageRating = catchAsync(async (req: Request, res: Response) => {
  const mediaId = req.params.mediaId;
  const result = await ratingService.getAverageRating(mediaId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Average rating fetched successfully',
    data: result,
  });
});



export const ratingController = {
  createOrUpdateRating,
  getRatingsByMediaId,
  updateRating,
  deleteRating,
    getAverageRating,
};
