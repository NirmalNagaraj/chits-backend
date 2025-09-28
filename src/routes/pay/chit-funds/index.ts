import { Router, type Request, type Response } from "express"
import type { ApiResponse, ChitPaymentRequest, ChitPaymentResponse } from "../../../types"
import { processChitPayment } from "./query"

const router = Router()

/**
 * @swagger
 * /pay/chit-funds:
 *   post:
 *     summary: Process chit fund payment
 *     description: Process a payment for a specific chit fund. Updates payment status and marks as paid if full amount is received.
 *     tags:
 *       - Payments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChitPaymentRequest'
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ChitPaymentResponse'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Payment record not found
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
router.post("/", async (req: Request, res: Response) => {
  try {
    const { user_id, chit_id, amount, payment_mode }: ChitPaymentRequest = req.body

    // Validate required fields
    if (!user_id || !chit_id || !amount || !payment_mode) {
      const response: ApiResponse = {
        success: false,
        error: "Missing required fields: user_id, chit_id, amount, and payment_mode are required",
      }
      res.status(400).json(response)
      return
    }

    // Validate amount is positive
    if (amount <= 0) {
      const response: ApiResponse = {
        success: false,
        error: "Amount must be greater than 0",
      }
      res.status(400).json(response)
      return
    }

    // Process the payment
    const paymentResult = await processChitPayment({
      user_id,
      chit_id,
      amount,
      payment_mode,
    })

    const response: ApiResponse<ChitPaymentResponse> = {
      success: true,
      data: paymentResult,
      message: paymentResult.is_paid
        ? "Payment completed successfully. Chit is now fully paid."
        : "Partial payment processed successfully.",
    }

    res.status(200).json(response)
  } catch (error) {
    console.error("Error processing chit payment:", error)

    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process payment",
    }

    // Check if it's a not found error
    if (error instanceof Error && error.message.includes("No pending payment found")) {
      res.status(404).json(response)
    } else {
      res.status(500).json(response)
    }
  }
})

export default router
