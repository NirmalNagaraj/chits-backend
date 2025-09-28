import { Router, type Request, type Response } from "express"
import type { ApiResponse, UserDetailsResponse, UserDetailedResponse } from "../../../types"
import { getAllUsersDetails, getUserDetailedInfo } from "./query"

const router = Router()

/**
 * @swagger
 * /users/details:
 *   get:
 *     summary: Get all users basic details
 *     description: Retrieves basic information (name, mobile, total_chits) for all users in the system
 *     tags:
 *       - User Management
 *     responses:
 *       200:
 *         description: Successfully retrieved all users details
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/UserDetailsResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               error: "Internal server error"
 *               message: "Failed to fetch users details"
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersDetails()

    const response: ApiResponse<UserDetailsResponse[]> = {
      success: true,
      data: users,
      message: "Users details retrieved successfully",
    }

    return res.status(200).json(response)
  } catch (error) {
    console.error("Error in users details route:", error)

    const response: ApiResponse = {
      success: false,
      error: "Internal server error",
      message: "Failed to fetch users details",
    }

    return res.status(500).json(response)
  }
})

/**
 * @swagger
 * /users/details/{id}:
 *   get:
 *     summary: Get detailed user information
 *     description: Retrieves comprehensive user information including basic details, chit payment history, and loan details for a specific user
 *     tags:
 *       - User Management
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID (UUID)
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Successfully retrieved user detailed information
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/UserDetailedResponse'
 *       400:
 *         description: Bad request - Invalid user ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               error: "Validation failed"
 *               message: "User ID is required and must be a valid UUID"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               error: "User not found"
 *               message: "No user found with the provided ID"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               error: "Internal server error"
 *               message: "Failed to fetch user detailed information"
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // Validation
    if (!id || typeof id !== "string" || id.trim().length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "Validation failed",
        message: "User ID is required and must be a valid UUID",
      }
      return res.status(400).json(response)
    }

    // UUID format validation (basic check)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      const response: ApiResponse = {
        success: false,
        error: "Validation failed",
        message: "User ID must be a valid UUID format",
      }
      return res.status(400).json(response)
    }

    const userDetails = await getUserDetailedInfo(id)

    if (!userDetails) {
      const response: ApiResponse = {
        success: false,
        error: "User not found",
        message: "No user found with the provided ID",
      }
      return res.status(404).json(response)
    }

    const response: ApiResponse<UserDetailedResponse> = {
      success: true,
      data: userDetails,
      message: "User detailed information retrieved successfully",
    }

    return res.status(200).json(response)
  } catch (error) {
    console.error("Error in user detailed info route:", error)

    const response: ApiResponse = {
      success: false,
      error: "Internal server error",
      message: "Failed to fetch user detailed information",
    }

    return res.status(500).json(response)
  }
})

export default router
