import type { Request, Response, NextFunction } from "express"
import type { ApiResponse } from "../types"

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err.message)
  console.error("Stack:", err.stack)

  const response: ApiResponse = {
    success: false,
    error: err.message || "Internal server error",
    message: "An error occurred while processing your request",
  }

  res.status(500).json(response)
}

export const notFoundHandler = (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: false,
    error: "Route not found",
    message: `Cannot ${req.method} ${req.path}`,
  }

  res.status(404).json(response)
}
