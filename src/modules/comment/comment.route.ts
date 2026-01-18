import express, { Request, Response } from "express";
import { commentController } from "./comment.controller";
import auth, { UserRoles } from "../../Middleware/auth";

const router = express.Router();

router.post(
  "/",
  auth(UserRoles.USER, UserRoles.ADMIN),
  commentController.createComment,
);
router.get("/:commentId", commentController.getCommentsById);
router.get("/author/:authorId", commentController.getCommentsByAuthorId);
router.delete(
  "/:commentId",
  auth(UserRoles.ADMIN, UserRoles.USER),
  commentController.deleteComment,
);
router.patch(
  "/:commentId",
  auth(UserRoles.ADMIN, UserRoles.USER),
  commentController.updateComment,
);
router.patch(
  "/moderate/:commentId",
  auth(UserRoles.ADMIN),
  commentController.moderateComment,
);
export const commentRouter = router;
