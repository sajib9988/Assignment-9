import { Request } from 'express';
import { prisma } from '../../middleware/prisma';
import { fileUploader } from '../../helper/fileUploader';
import ApiError from '../../errors/apiError';
import httpStatus from 'http-status';
import { IMedia } from './media.interface';
import { MediaType } from '@prisma/client';
import { IMediaFilter, IOptionsMedia } from '../../type';
import { paginationHelper } from '../../helper/paginationHelper';

const createMedia = async (req: Request): Promise<IMedia> => {
  const { title, description, genre, videoUrls, type,amount } = req.body;
  const file = req.file;

  if (!file) throw new ApiError(httpStatus.BAD_REQUEST, 'Thumbnail is required');

  const existingMedia = await prisma.media.findFirst({
    where: { OR: [{ title }] },
  });
  if (existingMedia) throw new ApiError(httpStatus.CONFLICT, 'Media with this title already exists');

  const uploadResult = await fileUploader.uploadToCloudinary(file);
  if (!uploadResult?.secure_url) throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to upload thumbnail');

  // Type-based validation
  if (type === 'MOVIE' && videoUrls.length !== 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'MOVIE must have exactly one video URL.');
  }
  if (type === 'SERIES' && videoUrls.length <= 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'SERIES must have more than one video URL.');
  }

  return prisma.media.create({
    data: {
      title,
      description,
      genre,
      thumbnail: uploadResult.secure_url,
      type: type.toUpperCase() as MediaType,
      releaseDate: new Date(),
      videoUrls,
      amount,
    },
  });
};



const getAllMedia = async (
    filters: IMediaFilter,
    options: IOptionsMedia
  ) => {
    const { searchTerm, genre, title, type } = filters;
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
  
    const andConditions: any[] = [];
  
    if (searchTerm) {
      andConditions.push({
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { genre: { contains: searchTerm, mode: 'insensitive' } },
        ],
      });
    }
    
    if (genre) {
      andConditions.push({
        genre: { equals: genre, mode: 'insensitive' },
      });
    }
    
    if (title) {
      andConditions.push({
        title: { contains: title, mode: 'insensitive' },
      });
    }
    
    if (type && ['MOVIE', 'SERIES'].includes(type.toUpperCase())) {
      andConditions.push({
        type: type.toUpperCase() as MediaType,
      });
    }
    
  
    const whereCondition = andConditions.length > 0 ? { AND: andConditions } : {};
  
    const result = await prisma.media.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });
  
    const total = await prisma.media.count({ where: whereCondition });
  
    return {
      meta: { page, limit, total },
      data: result,
    };
  };
  

const singleMediaId = async (mediaId: string) => {
  const existingMedia = await prisma.media.findUnique({
    where: { id: mediaId },
  });

  if (!existingMedia) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Media not found');
  }

  return existingMedia;
};

const updateMedia = async (mediaId: string, payload: any, file?: Express.Multer.File) => {
  const existingMedia = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!existingMedia) throw new ApiError(httpStatus.NOT_FOUND, 'Media not found');

  let thumbnail = existingMedia.thumbnail;
  if (file) {
    const uploadResult = await fileUploader.uploadToCloudinary(file);
    if (!uploadResult?.secure_url) throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to upload thumbnail');
    thumbnail = uploadResult.secure_url;
  }

  return prisma.media.update({ where: { id: mediaId }, data: { ...payload, thumbnail } });
};

const deleteMedia = async (mediaId: string) => {
  const existingMedia = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!existingMedia) 
    throw new ApiError(httpStatus.NOT_FOUND, 'Media not found');
  await prisma.media.delete({ where: { id: mediaId } });
  return existingMedia;
};

export const mediaService =
 { createMedia, 
  getAllMedia,
   updateMedia, 
   deleteMedia ,
   singleMediaId

 };
