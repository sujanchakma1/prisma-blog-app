import { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Unauthorized",
    });
  }
  try {
    console.log(req.user);
    const result = await postService.createPost(req.body, user.id as string);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      data: "Post created failed",
      details: error,
    });
  }
};

const getPost = async (req: Request, res: Response) => {
  try {
    const result = await postService.getPost();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      data: "Post created failed",
      details: error,
    });
  }
};

export const postController = {
  createPost,
  getPost,
};
