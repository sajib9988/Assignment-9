import express from 'express';
import { ratingController } from './rating.controller';
import auth from '../../middleware/auth';


const router = express.Router();
router.get('/average/:mediaId', ratingController.getAverageRating);

router.post('/', auth(), ratingController.createOrUpdateRating);
router.get('/:mediaId', ratingController.getRatingsByMediaId);
router.patch('/:mediaId', auth(), ratingController.updateRating);
router.delete('/:mediaId', auth(), ratingController.deleteRating);

export const ratingRoutes = router;
