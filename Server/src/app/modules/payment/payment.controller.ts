import { Request, Response } from 'express';

import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { PaymentService } from './payment.service';
import catchAsync from '../../utils/catchAsync';
import { prisma } from '../../middleware/prisma';

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const { contentId } = req.params;
  const { userId, type, amount, name, email } = req.body;
  const result = await PaymentService.initPayment(contentId, { userId, type, amount, name, email });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment initiated successfully',
    data: result,
  });
});

const validatePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.validatePayment(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment validated successfully',
    data: result,
  });
});


const getPaymentStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { contentId } = req.params;

  if (!contentId || !userId) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Invalid contentId or userId",
    });
  }

  // ✅ এখানে service function call হচ্ছে
  const result = await PaymentService.getPaymentStatus(userId, contentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment status fetched successfully",
    data: result,
  });
});



export const PaymentController = {
  initPayment,
  validatePayment,
  getPaymentStatus,
};