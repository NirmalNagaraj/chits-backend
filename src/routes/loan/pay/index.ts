import { Router } from "express"
import { processLoanPayment } from "./query"
import type { LoanPaymentRequest, ApiResponse, LoanPaymentResponse } from "../../../types"

const router = Router()

/**
 * @swagger
 * /loan/pay:
 *   post:
 *     summary: Process loan payment
 *     description: Process a payment towards a loan. Updates loan balance and transaction history. Automatically deactivates loan when fully paid.
 *     tags:
 *       - Loans
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoanPaymentRequest'
 *     responses:
 *       200:
 *         description: Loan payment processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/LoanPaymentResponse'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Loan not found or user not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post("/", async (req, res) => {
  try {
    const { user_id, loan_id, amount, payment_mode }: LoanPaymentRequest = req.body

    // Validate required fields
    if (!user_id || !loan_id || !amount || !payment_mode) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: user_id, loan_id, amount, payment_mode",
      } as ApiResponse)
    }

    // Validate amount is positive
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Amount must be greater than 0",
      } as ApiResponse)
    }

    const result = await processLoanPayment({ user_id, loan_id, amount, payment_mode })

    res.status(200).json({
      success: true,
      data: result,
      message: result.is_active ? "Loan payment processed successfully" : "Loan fully paid and closed",
    } as ApiResponse<LoanPaymentResponse>)
  } catch (error) {
    console.error("Loan payment error:", error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    } as ApiResponse)
  }
})

export default router
