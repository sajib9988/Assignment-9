import { PaymentStatus } from "@prisma/client";
import ApiError from "../../errors/apiError";
import { prisma } from "../../middleware/prisma";
import { IPaymentData } from "../ssl-commerce/ssl.interface";
import { SSLService } from "../ssl-commerce/ssl.service";

const initPayment = async (
  contentId: string,
  paymentInfo: { userId: string; type: "MOVIE" | "SERIES"; amount: number; name: string; email: string }
) => {
  const { userId, type, amount, name, email } = paymentInfo;

  // console.log("Received Content ID in initPayment:", contentId);

  if (!contentId || contentId === "undefined") {
    throw new ApiError(400, "Content ID is missing or invalid");
  }

  const mediaData = await prisma.media.findFirst({
    where: {
      id: contentId,
      type,
    },
  });

  if (!mediaData) {
    console.log("Media not found for", { contentId, type });
    throw new ApiError(400, "Media not found");
  }

  // console.log("Found Media Data:", mediaData); // মিডিয়া ডেটা ডিবাগ

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
        method: "ONLINE",
        status: "PAID",
        transactionId,
      },
    });
  }

  console.log("Created/Found Payment Data:", paymentData); // পেমেন্ট ডেটা ডিবাগ

  const initPaymentData: IPaymentData = {
    amount,
    transactionId,
    name,
    email,
    userId,
    contentId,
    type: type.toUpperCase() as "MOVIE" | "SERIES",
  };

  const result = await SSLService.initPayment(initPaymentData);
  // console.log("SSL Service Response:", result); // SSL রেসপন্স
  return {
    paymentUrl: result.GatewayPageURL,
  };
};

const validatePayment = async (payload: any) => {
  const response = await SSLService.validatePayment(payload);

  if (!response || response.status !== "VALID") {
    // console.log("Payment Validation Failed:", response);
    return {
      message: "Payment Failed!",
    };
  }

  await prisma.$transaction(async (tx) => {
    const updatedPaymentData = await tx.payment.update({
      where: {
        transactionId: response.tran_id,
      },
      data: {
        status: "PAID",
        paymentGatewayData: response,
      },
    });

    await tx.watchHistory.create({
      data: {
        userId: updatedPaymentData.userId,
        mediaId: updatedPaymentData.mediaId,
      },
    });
  });

  console.log("Payment Validation Success:", response);
  return {
    message: "Payment success!",
  };
};



export const PaymentService = {
  initPayment,
  validatePayment,

};