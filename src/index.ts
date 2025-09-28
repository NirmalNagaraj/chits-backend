import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import swaggerUi from "swagger-ui-express"
import { config } from "./config"
import { errorHandler, notFoundHandler } from "./middleware/errorHandler"
import healthRoutes from "./routes/health"
import onboardRoutes from "./routes/onboard"
import weeklyChitsRoutes from "./routes/update/weekly-chits"
import chitPaymentRoutes from "./routes/pay/chit-funds"
import loanApplyRoutes from "./routes/loan/apply"
import loanPayRoutes from "./routes/loan/pay"
import userDetailsRoutes from "./routes/users/details"
import analyticsRoutes from "./routes/analytics"
import chitDeactiveRoutes from "./routes/chits/deactive"
import loanDeactiveRoutes from "./routes/loan/deactive"
import { swaggerSpec } from "../swagger"

const app = express()

// Security middleware
app.use(helmet())
app.use(cors())

// Logging middleware
app.use(morgan("combined"))

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Swagger documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Chit Fund API Documentation",
  }),
)

// Routes
app.use("/health", healthRoutes)
app.use("/onboard", onboardRoutes)
app.use("/update/weekly-chits", weeklyChitsRoutes)
app.use("/pay/chit-funds", chitPaymentRoutes)
app.use("/loan/apply", loanApplyRoutes)
app.use("/loan/pay", loanPayRoutes)
app.use("/users/details", userDetailsRoutes)
app.use("/analytics", analyticsRoutes)
app.use("/chits/deactive", chitDeactiveRoutes)
app.use("/loan/deactive", loanDeactiveRoutes)

// Error handling middleware
app.use(notFoundHandler)
app.use(errorHandler)

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Chit Fund Backend Server running on port ${config.port}`)
  console.log(`📊 Environment: ${config.nodeEnv}`)
  console.log(`🔗 Health check: http://localhost:${config.port}/health`)
  console.log(`📚 API Documentation: http://localhost:${config.port}/api-docs`)
})

export default app
