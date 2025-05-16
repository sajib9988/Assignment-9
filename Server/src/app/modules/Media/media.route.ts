import express, { NextFunction, Request, Response } from 'express';
import { mediaController } from './media.controller';
import auth from '../../middleware/auth';
import { Role } from '@prisma/client';
import { backendmediaZodSchema, mediaUpdateSchema } from './media.validation';
import { fileUploader } from '../../helper/fileUploader';

const router = express.Router();

router.post('/upload-media', auth(Role.ADMIN), fileUploader.upload.single('thumbnail'), (req: Request, res: Response, next: NextFunction) => {
  req.body = backendmediaZodSchema.parse(JSON.parse(req.body.data));
  return mediaController.mediaUploadCreate(req, res, next);
});

router.get('/get-all-media',  mediaController.getAllMedia);

router.patch('/update-media/:id', auth(Role.ADMIN), fileUploader.upload.single('thumbnail'), (req: Request, res: Response, next: NextFunction) => {
  req.body = mediaUpdateSchema.parse(JSON.parse(req.body.data));
  return mediaController.updateMedia(req, res, next);
});

router.delete('/delete-media/:id', auth(Role.ADMIN), mediaController.deleteMedia);

export const mediaRoutes = router;
