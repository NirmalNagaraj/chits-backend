/**
 * @swagger
 * /analytics:
 *   get:
 *     summary: Get comprehensive analytics data
 *     description: Retrieve analytics including chit and loan statistics, amounts, and counts
 *     tags:
 *       - Analytics
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/AnalyticsResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch analytics data"
 */

import { Router } from "express"
import { getAnalyticsData } from "./query"
import type { ApiResponse, AnalyticsResponse } from "../../types"

const router = Router()

router.get("/", async (req, res) => {
  try {

    const analyticsData = await getAnalyticsData()


    const response: ApiResponse<AnalyticsResponse> = {
      success: true,
      data: analyticsData,
    }

    res.status(200).json(response)
  } catch (error) {
    console.error("[Analytics error:", error)

    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch analytics data",
    }

    res.status(500).json(response)
  }
})

export default router
