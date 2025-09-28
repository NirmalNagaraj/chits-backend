import { Router, type Request, type Response } from "express"
import type { HealthResponse, ApiResponse } from "../types"
import { config } from "../config"

const router = Router()

router.get("/", (req: Request, res: Response) => {
  try {
    const healthData: HealthResponse = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.nodeEnv,
      version: config.version,
    }

    const response: ApiResponse<HealthResponse> = {
      success: true,
      data: healthData,
      message: "Service is healthy",
    }

    res.status(200).json(response)
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: "Health check failed",
      message: "Internal server error",
    }

    res.status(500).json(response)
  }
})

export default router
