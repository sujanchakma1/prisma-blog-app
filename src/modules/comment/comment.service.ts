import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}) => {
  await prisma.post.findFirstOrThrow({
    where: {
      id: payload.postId,
    },
  });
  if (payload.parentId) {
    await prisma.comment.findUniqueOrThrow({
      where: {
        id: payload.parentId,
      },
    });
  }

  const result = await prisma.comment.create({
    data: payload,
  });
  return result;
};

const getCommentsById = async (commentId: string) => {
  const result = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
  return result;
};

const getCommentsByAuthorId = async (authorId: string) => {
  const result = await prisma.comment.findMany({
    where: {
      authorId,
    },
    orderBy: { createdAt: "desc" },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
  return result;
};

const deleteComment = async (commentId: string, authorId: string) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
    },
  });
  if (!commentData) {
    throw new Error("Your input is invalid");
  }

  return await prisma.comment.delete({
    where: {
      id: commentData.id,
    },
  });
};

const updateComment = async (
  commentId: string,
  data: { content: string; status: CommentStatus },
  authorId: string,
) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
    },
  });
  if (!commentData) {
    throw new Error("Your input is invalid");
  }
  return await prisma.comment.update({
    where: {
      id: commentData.id,
    },
    data,
  });
};

const moderateComment = async (id: string, data: { status: CommentStatus }) => {
  const commentData = await prisma.comment.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      id: true,
      status: true,
    },
  });
  if (commentData.status === data.status) {
    throw new Error(`Your Status ${data.status} is already up to date`);
  }
  return await prisma.comment.update({
    where: {
      id: commentData.id,
    },
    data,
  });
};

export const commentService = {
  createComment,
  getCommentsById,
  getCommentsByAuthorId,
  deleteComment,
  updateComment,
  moderateComment,
};
