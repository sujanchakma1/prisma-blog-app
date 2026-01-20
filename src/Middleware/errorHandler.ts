import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors = err;
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Your Provide fields is missing or invalid fields";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    {
      if (err.code === "P2002") {
        statusCode = 409;
        message = "Duplicate value error";
      } else if (err.code === "P2025") {
        statusCode = 404;
        message = "Record not found";
      } else if (err.code === "P2003") {
        statusCode = 400;
        message = "Foreign key constraint failed";
      } else if (err.code === "P2004") {
        statusCode = 400;
        message = "A constraint failed on the database";
      }
    }
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 500;
    message = "An unknown error occurred";
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = 500;
    message = "A panic occurred in the query engine";
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = 500;
      message = "Database connection error";
    }
    if (err.errorCode === "P1001") {
      statusCode = 500;
      message = "Database server is not reachable";
    }
    if (err.errorCode === "P1002") {
      statusCode = 500;
      message = "Database connection timed out";
    }
  }
  res.status(statusCode).json({
    message: message,
    error: errors,
  });
};

export default errorHandler;
