import { prisma } from "../../middleware/prisma";
import { IPaymentData } from "../ssl-commerce/ssl.interface";
import { SSLService } from "../ssl-commerce/ssl.service";

const initPayment = async (contentId: string, paymentInfo: { userId: string; type: 'MOVIE' | 'SERIES'; amount: number; name: string; email: string;  }) => {
  const { userId, type, amount, name, email } = paymentInfo;



  // Check if the media exists and matches the type
  const mediaData = await prisma.media.findFirstOrThrow({
    where: {
      id: contentId,
      type,
    },
  });

  // Check if payment record exists or create a new one
  let paymentData = await prisma.payment.findFirst({
    where: {
      mediaId: contentId,
      userId,
    },
  });

  const transactionId = paymentData?.transactionId || `txn_${Date.now()}`;

  if (!paymentData) {
    paymentData = await prisma.payment.create({
      data: {
        userId,
        mediaId: contentId,
        amount,
        method: 'ONLINE',
        status: 'PENDING',
        transactionId,
      },
    });
  }

  const initPaymentData: IPaymentData = {
    amount,
    transactionId,
    name,
    email,
    userId,
    contentId,
    type: type.toUpperCase() as 'MOVIE' | 'SERIES',
  };

  const result = await SSLService.initPayment(initPaymentData);
  return {
    paymentUrl: result.GatewayPageURL,
  };
};

const validatePayment = async (payload: any) => {
  const response = await SSLService.validatePayment(payload);

  if (!response || response.status !== 'VALID') {
    return {
      message: 'Payment Failed!',
    };
  }

  await prisma.$transaction(async (tx) => {
    const updatedPaymentData = await tx.payment.update({
      where: {
        transactionId: response.tran_id,
      },
      data: {
        status: 'PAID',
        paymentGatewayData: response,
      },
    });

    // Add to WatchHistory to grant access to the media
    await tx.watchHistory.create({
      data: {
        userId: updatedPaymentData.userId,
        mediaId: updatedPaymentData.mediaId,
      },
    });
  });

  return {
    message: 'Payment success!',
  };
};

export const PaymentService = {
  initPayment,
  validatePayment,
};