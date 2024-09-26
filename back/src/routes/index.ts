import express,{ Router } from "express";
import useUsersRouter from "./users.routes";
import useCarsRouter from "./cars.routes";

const router = Router();
router.use('/users',useUsersRouter);
router.use('/cars',useCarsRouter);

export default router;