import express from 'express';
import { PaymentController } from './payment.controller';
import auth from '../../middleware/auth';
import { Role } from '@prisma/client';


const router = express.Router();

router.get('/ipn', auth(Role.USER, Role.ADMIN), PaymentController.validatePayment);


router.post('/init-payment/:contentId', auth(Role.USER, Role.ADMIN), PaymentController.initPayment);

export const PaymentRoutes = router;