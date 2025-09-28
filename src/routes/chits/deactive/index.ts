import { Router, type Request, type Response } from "express"
import type { ApiResponse, DeactivateChitRequest, DeactivateChitResponse } from "../../../types"
import { deactivateChit } from "./query"

const router = Router()

/**
 * @swagger
 * /chits/deactive:
 *   post:
 *     summary: Force close/deactivate a chit
 *     tags: [Chits]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeactivateChitRequest'
 *     responses:
 *       200:
 *         description: Chit deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/DeactivateChitResponse'
 *                 message:
 *                   type: string
 *                   example: "Chit deactivated successfully"
 *       400:
 *         description: Bad request - Invalid chit_id or chit already inactive
 *       404:
 *         description: Chit not found
 *       500:
 *         description: Internal server error
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { chit_id, reason }: DeactivateChitRequest = req.body

    if (!chit_id) {
      const response: ApiResponse = {
        success: false,
        error: "chit_id is required",
      }
      return res.status(400).json(response)
    }

    const result = await deactivateChit(chit_id, reason)

    const response: ApiResponse<DeactivateChitResponse> = {
      success: true,
      data: result,
      message: "Chit deactivated successfully",
    }

    return res.status(200).json(response)
  } catch (error: any) {
    console.error("Error deactivating chit:", error)

    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to deactivate chit",
    }

    return res.status(500).json(response)
  }
})

export default router
