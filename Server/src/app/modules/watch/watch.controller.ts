import { Request, Response } from "express";
import httpStatus from "http-status";

import { watchService } from "./watch.service";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IJwtPayload } from "../auth/auth.interface";



const addToWatchHistory = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IJwtPayload;
  // console.log(user);
  const { mediaId } = req.body;

  const hasAccess = await watchService.hasPaidForMedia(user.userId!, mediaId);
  if (!hasAccess) {
    sendResponse(res, {
      statusCode: httpStatus.FORBIDDEN,
      success: false,
      message: "You must pay to watch this media.",
      data: null,
    });
    return;
  }

  const result = await watchService.addToHistory(user.userId!, mediaId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Watch history added successfully",
    data: result,
  });
});

const getWatchHistory = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IJwtPayload;

  const result = await watchService.getUserHistory(user.userId!);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Watch history fetched successfully",
    data: result,
  });
});

const checkWatchAccess = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IJwtPayload;
  const mediaId = req.params.mediaId;

  const hasAccess = await watchService.hasPaidForMedia(user.userId!, mediaId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access check successful",
    data: { access: hasAccess },
  });
});

export const watchController = {
  addToWatchHistory,
  getWatchHistory,
  checkWatchAccess,
};
