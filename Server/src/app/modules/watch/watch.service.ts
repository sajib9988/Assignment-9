import { prisma } from "../../middleware/prisma";


const hasPaidForMedia = async (userId: string, mediaId: string): Promise<boolean> => {
  const payment = await prisma.payment.findFirst({
    where: {
      userId,
      mediaId,
      status: "PAID",
    },
  });
  return !!payment;
};

const addToHistory = async (userId: string, mediaId: string) => {
  const existing = await prisma.watchHistory.findFirst({
    where: {
      userId,
      mediaId,
    },
  });

  if (existing) return existing;

  const watch = await prisma.watchHistory.create({
    data: {
      userId,
      mediaId,
    },
  });

  return watch;
};

const getUserHistory = async (userId: string) => {
  const history = await prisma.watchHistory.findMany({
    where: { userId },
    include: {
      media: true,
    },
    orderBy: {
      watchedAt: "desc",
    },
  });
  return history;
};

export const watchService = {
  hasPaidForMedia,
  addToHistory,
  getUserHistory,
};
