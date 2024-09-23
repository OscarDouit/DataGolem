import express,{ Router } from "express";
import useUsersRouter from "./users.routes";

const router = Router();
router.use('/users',useUsersRouter);
export default router;