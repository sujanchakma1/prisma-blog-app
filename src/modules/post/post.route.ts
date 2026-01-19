import express, { NextFunction, Request, Response } from "express";
import { postController } from "./post.controller";
import auth, { UserRoles } from "../../Middleware/auth";

const router = express.Router();

router.post(
  "/",
  auth(UserRoles.USER, UserRoles.ADMIN),
  postController.createPost,
);

router.get("/", postController.getPost);
router.get(
  "/my-posts",
  auth(UserRoles.USER, UserRoles.ADMIN),
  postController.getMyPosts,
);
router.get("/:postId", postController.getPostById);
router.patch(
  "/:postId",
  auth(UserRoles.USER, UserRoles.ADMIN),
  postController.updatePost,
);
router.delete(
  "/:postId",
  auth(UserRoles.USER, UserRoles.ADMIN),
  postController.deletePost,
);
export const postRouter = router;
