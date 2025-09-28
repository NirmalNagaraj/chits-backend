import { Router, type Request, type Response } from "express"
import { processWeeklyChitsUpdate } from "./query"
import type { ApiResponse, WeeklyChitsUpdateResponse } from "../../../types"

const router = Router()

/**
 * @swagger
 * /update/weekly-chits:
 *   post:
 *     summary: Create weekly chit payment records
 *     description: Creates payment records for all active chits for the current week and increments the week counter
 *     tags:
 *       - Chit Management
 *     responses:
 *       200:
 *         description: Weekly chit payments created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/WeeklyChitsUpdateResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: "Failed to process weekly chits update"
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const result = await processWeeklyChitsUpdate()

    const response: ApiResponse<WeeklyChitsUpdateResponse> = {
      success: true,
      data: result,
      message: "Weekly chits update completed successfully",
    }

    res.status(200).json(response)
  } catch (error) {
    console.error("Error in weekly chits update:", error)

    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process weekly chits update",
    }

    res.status(500).json(response)
  }
})

export default router
