import express, { NextFunction, Request, Response } from "express";
import { postController } from "./post.controller";
import auth, { UserRoles } from "../../Middleware/auth";



const router = express.Router();



router.post("/", auth(UserRoles.USER), postController.createPost);
router.get("/", postController.getPost);

export const postRouter = router;
