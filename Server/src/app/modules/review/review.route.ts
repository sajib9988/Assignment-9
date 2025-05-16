
import Router from 'express';
import auth from '../../middleware/auth';
import { Role } from '@prisma/client';
import { reviewController } from './review.controller';
import Validator from '../../middleware/validator';
import { reviewUpdateValidation, reviewValidation } from './review.validation';

const router = Router();

router.get('/:mediaId', auth(Role.USER), reviewController.getReviews);
router.post('/', auth(Role.USER), Validator(reviewValidation), reviewController.createReview);

 
router.put('/:id', auth(Role.USER),Validator(reviewUpdateValidation), reviewController.updateReview);  
router.delete('/:id', auth(Role.USER), reviewController.deleteReview )

export const reviewRoutes = router;