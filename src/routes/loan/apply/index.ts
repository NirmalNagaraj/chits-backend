import { Router } from "express"
import { createLoanApplication, validateUserExists } from "./query"
import type { LoanApplicationRequest, ApiResponse, LoanApplicationResponse } from "../../../types"

const router = Router()

/**
 * @swagger
 * /loan/apply:
 *   post:
 *     summary: Apply for a new loan
 *     description: Creates a new loan application for a user with specified interest rate and type
 *     tags:
 *       - Loans
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoanApplicationRequest'
 *     responses:
 *       201:
 *         description: Loan application created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/LoanApplicationResponse'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: User not found
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
    const { user_id, interest_rate, interest_type, borrowed_amount }: LoanApplicationRequest = req.body

    // Validate required fields
    if (!user_id || !interest_rate || !interest_type || !borrowed_amount) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: user_id, interest_rate, interest_type, and borrowed_amount are required",
      } as ApiResponse)
    }

    // Validate user exists
    const userExists = await validateUserExists(user_id)
    if (!userExists) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      } as ApiResponse)
    }

    // Create loan application
    const loan = await createLoanApplication({ user_id, interest_rate, interest_type, borrowed_amount })

    const response: LoanApplicationResponse = {
      loan_id: loan.loan_id,
      user_id: loan.user_id,
      interest_rate: loan.interest_rate,
      interest_type: loan.interest_type,
      is_active: loan.is_active,
      created_at: loan.created_at,
      borrowed_amount: loan.borrowed_amount,
      balance: loan.balance,
    }

    res.status(201).json({
      success: true,
      data: response,
      message: "Loan application created successfully",
    } as ApiResponse<LoanApplicationResponse>)
  } catch (error) {
    console.error("Error creating loan application:", error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    } as ApiResponse)
  }
})

export default router
