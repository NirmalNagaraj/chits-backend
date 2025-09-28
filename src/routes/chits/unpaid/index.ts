import { Router } from "express"
import { getUnpaidChits } from "./query"

const router = Router()

/**
 * @swagger
 * /chits/unpaid:
 *   get:
 *     summary: Get all unpaid chits grouped by user
 *     description: Returns a list of users with unpaid chits, including their name, mobile number, and total amount to be paid. Multiple unpaid chits for the same user are grouped together.
 *     tags:
 *       - Chits
 *     responses:
 *       200:
 *         description: Successfully retrieved unpaid chits
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UnpaidChitsResponse'
 *                 message:
 *                   type: string
 *                   example: "Unpaid chits retrieved successfully"
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
 *                   example: "Failed to retrieve unpaid chits"
 */
router.get("/", async (req, res) => {
  try {
    const unpaidChitsData = await getUnpaidChits()

    return res.status(200).json({
      success: true,
      data: unpaidChitsData,
      message: "Unpaid chits retrieved successfully",
    })
  } catch (error) {
    console.error("Error retrieving unpaid chits:", error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to retrieve unpaid chits",
    })
  }
})

export default router
