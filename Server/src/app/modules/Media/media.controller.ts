import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

import { pick } from '../../helper/pick';
import { mediaService } from './Media.service';

const mediaUploadCreate = catchAsync(async (req: Request, res: Response) => {

   console.log('Request body:', req.body);
  console.log('Request file:', req.file);
  const result = await mediaService.createMedia(req);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Media created successfully', data: result });
});

const getAllMedia = catchAsync(async (req: Request, res: Response) => {
  const filterableFields = ['searchTerm', 'genre', 'title', 'type', 'releaseDate'];
  const paginationFields = ['page', 'limit', 'sortBy', 'sortOrder'];
  const filters = pick(req.query, filterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await mediaService.getAllMedia(filters, paginationOptions);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Media retrieved successfully', data: result });
});


const singleMediaId = catchAsync(async (req: Request, res: Response) => {
  const mediaId = req.params.mediaId;
  const result = await mediaService.singleMediaId(mediaId);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Media Id retrieved successfully', data: result });
});



const updateMedia = catchAsync(async (req: Request, res: Response) => {
  const mediaId = req.params.id;
  const updateData = req.body;
  const file = req.file;
  const result = await mediaService.updateMedia(mediaId, updateData, file);
  sendResponse(res, 
    { statusCode: httpStatus.OK, 
      success: true, 
      message: 'Media updated successfully',
      data: result });
});

const deleteMedia = catchAsync(async (req: Request, res: Response) => {
  const mediaId = req.params.id;
  const result = await mediaService.deleteMedia(mediaId);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Media deleted successfully', data: result });
});

export const mediaController = { mediaUploadCreate, getAllMedia, updateMedia, deleteMedia, singleMediaId };
