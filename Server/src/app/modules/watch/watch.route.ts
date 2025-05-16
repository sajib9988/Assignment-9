import express from "express";
import { watchController } from "./watch.controller";

import auth from "../../middleware/auth";
import { Role } from "@prisma/client";

const router = express.Router();

router.post("/", auth(Role.USER, Role.ADMIN), watchController.addToWatchHistory);
router.get("/", auth(Role.USER, Role.ADMIN), watchController.getWatchHistory);
router.get("/access/:mediaId", auth(Role.USER, Role.ADMIN), watchController.checkWatchAccess);

export const watchRoutes = router;
