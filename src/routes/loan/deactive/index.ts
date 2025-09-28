import { Router, type Request, type Response } from "express"
import type { ApiResponse, DeactivateLoanRequest, DeactivateLoanResponse } from "../../../types"
import { deactivateLoan } from "./query"

const router = Router()

/**
 * @swagger
 * /loan/deactive:
 *   post:
 *     summary: Force close/deactivate a loan
 *     tags: [Loans]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeactivateLoanRequest'
 *     responses:
 *       200:
 *         description: Loan deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/DeactivateLoanResponse'
 *                 message:
 *                   type: string
 *                   example: "Loan deactivated successfully"
 *       400:
 *         description: Bad request - Invalid loan_id or loan already inactive
 *       404:
 *         description: Loan not found
 *       500:
 *         description: Internal server error
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { loan_id, reason }: DeactivateLoanRequest = req.body

    if (!loan_id) {
      const response: ApiResponse = {
        success: false,
        error: "loan_id is required",
      }
      return res.status(400).json(response)
    }

    const result = await deactivateLoan(loan_id, reason)

    const response: ApiResponse<DeactivateLoanResponse> = {
      success: true,
      data: result,
      message: "Loan deactivated successfully",
    }

    return res.status(200).json(response)
  } catch (error: any) {
    console.error("Error deactivating loan:", error)

    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to deactivate loan",
    }

    return res.status(500).json(response)
  }
})

export default router
