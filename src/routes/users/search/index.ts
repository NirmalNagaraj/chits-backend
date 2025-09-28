import { Router, type Request, type Response } from "express"
import { searchUsers } from "./query"
import type { ApiResponse, UserSearchResponse } from "../../../types"

const router = Router()

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Search users by name or mobile number
 *     description: Search for users using partial matches on name or mobile number
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *         description: Search query (name or mobile number)
 *         example: "John"
 *     responses:
 *       200:
 *         description: Users found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserSearchResponse'
 *                 message:
 *                   type: string
 *                   example: "Users found successfully"
 *       400:
 *         description: Missing or invalid search query
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
 *                   example: "Search query is required"
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
 *                   example: "Failed to search users"
 */
router.get("/", async (req: Request, res: Response): Promise<Response> => {
  try {
    const { query } = req.query

    // Validate search query
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Search query is required",
      } as ApiResponse)
    }

    const searchQuery = query.trim()
    console.log(`[v0] Searching users with query: ${searchQuery}`)

    const searchResults = await searchUsers(searchQuery)

    const response: UserSearchResponse = {
      users: searchResults,
      total_results: searchResults.length,
      search_query: searchQuery,
    }

    return res.status(200).json({
      success: true,
      data: response,
      message: "Users found successfully",
    } as ApiResponse<UserSearchResponse>)
  } catch (error) {
    console.error("[v0] Error searching users:", error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to search users",
    } as ApiResponse)
  }
})

export default router
