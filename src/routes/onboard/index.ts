import { Router, type Request, type Response } from "express"
import type { ApiResponse, CreateUserRequest, CreateUserResponse } from "../../types"
import { createUser, checkMobileExists } from "./query"

const router = Router()

/**
 * @swagger
 * /onboard:
 *   post:
 *     summary: Onboard a new user
 *     description: Creates a new user account with name, total chits, and mobile number. Also creates an associated chit entry. Validates input data and ensures mobile number uniqueness.
 *     tags:
 *       - User Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: User and chit created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/CreateUserResponse'
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             examples:
 *               missing_fields:
 *                 summary: Missing required fields
 *                 value:
 *                   success: false
 *                   error: "Validation failed"
 *                   message: "Name, total_chits, and mobile are required"
 *               invalid_name:
 *                 summary: Invalid name format
 *                 value:
 *                   success: false
 *                   error: "Validation failed"
 *                   message: "Name must be a non-empty string"
 *               invalid_chits:
 *                 summary: Invalid total_chits value
 *                 value:
 *                   success: false
 *                   error: "Validation failed"
 *                   message: "Total chits must be a positive integer"
 *               invalid_mobile:
 *                 summary: Invalid mobile number
 *                 value:
 *                   success: false
 *                   error: "Validation failed"
 *                   message: "Mobile must be a valid positive number"
 *       409:
 *         description: Conflict - Mobile number already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               error: "Mobile number already exists"
 *               message: "A user with this mobile number already exists"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               error: "Internal server error"
 *               message: "Failed to create user and chit"
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, total_chits, mobile }: CreateUserRequest = req.body

    // Validation
    if (!name || !total_chits || !mobile) {
      const response: ApiResponse = {
        success: false,
        error: "Validation failed",
        message: "Name, total_chits, and mobile are required",
      }
      return res.status(400).json(response)
    }

    // Validate name is not empty string
    if (typeof name !== "string" || name.trim().length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "Validation failed",
        message: "Name must be a non-empty string",
      }
      return res.status(400).json(response)
    }

    // Validate total_chits is positive integer
    if (!Number.isInteger(total_chits) || total_chits <= 0) {
      const response: ApiResponse = {
        success: false,
        error: "Validation failed",
        message: "Total chits must be a positive integer",
      }
      return res.status(400).json(response)
    }

    // Validate mobile is a valid number
    if (!Number.isInteger(mobile)  ||  mobile.toString().length !==10) {
      const response: ApiResponse = {
        success: false,
        error: "Validation failed",
        message: "Mobile must be a valid positive number and it should have 10 digits accurate",
      }
      return res.status(400).json(response)
    }

    // Check if mobile number already exists
    const mobileExists = await checkMobileExists(mobile)
    if (mobileExists) {
      const response: ApiResponse = {
        success: false,
        error: "Mobile number already exists",
        message: "A user with this mobile number already exists",
      }
      return res.status(409).json(response)
    }

    // Create user
    const result = await createUser({
      name: name.trim(),
      total_chits,
      mobile,
    })

    const userData: CreateUserResponse = {
      user_id: result.user.user_id,
      name: result.user.name,
      total_chits: result.user.total_chits,
      mobile: result.user.mobile,
      created_at: result.user.created_at,
      chit: {
        chit_id: result.chit.chit_id,
        total_chits: result.chit.total_chits,
        is_active: result.chit.is_active,
        user_id: result.chit.user_id,
        created_at: result.chit.created_at,
      },
    }

    const response: ApiResponse<CreateUserResponse> = {
      success: true,
      data: userData,
      message: "User and chit onboarded successfully",
    }

    res.status(201).json(response)
  } catch (error) {
    console.error("Error in onboard route:", error)

    const response: ApiResponse = {
      success: false,
      error: "Internal server error",
      message: "Failed to create user and chit",
    }

    res.status(500).json(response)
  }
})

export default router
