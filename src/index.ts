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

// Enhanced security middleware with CSP for Swagger UI
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    },
  },
}))

// Enhanced CORS configuration
app.use(cors({
  origin: config.nodeEnv === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || []
    : true,
  credentials: true,
}))

// Environment-aware logging
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'))

// Enhanced body parsing middleware
app.use(express.json({ 
  limit: "10mb",
  type: ['application/json', 'text/plain']
}))
app.use(express.urlencoded({ 
  extended: true,
  limit: "10mb"
}))

// Trust proxy for production deployments
if (config.nodeEnv === 'production') {
  app.set('trust proxy', 1)
}

// Fix Swagger UI with CDN assets to avoid MIME type issues
const swaggerOptions = {
  explorer: true,
  customSiteTitle: "Chit Fund API Documentation",
  customfavIcon: "/favicon.ico",
  swaggerOptions: {
    persistAuthorization: true,
  },
  // Use CDN assets to prevent MIME type issues on Vercel
  customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.19.1/swagger-ui.css",
  customJs: [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.19.1/swagger-ui-bundle.js",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.19.1/swagger-ui-standalone-preset.js"
  ]
}

app.use('/api-docs', swaggerUi.serve)
app.get('/api-docs', swaggerUi.setup(swaggerSpec, swaggerOptions))

// Serve raw swagger spec
app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Chit Fund API Server',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  })
})

// API Routes - organized and documented
const routes = [
  { path: "/health", router: healthRoutes, description: "Health check endpoints" },
  { path: "/onboard", router: onboardRoutes, description: "User onboarding endpoints" },
  { path: "/update/weekly-chits", router: weeklyChitsRoutes, description: "Weekly chit updates" },
  { path: "/pay/chit-funds", router: chitPaymentRoutes, description: "Chit fund payments" },
  { path: "/loan/apply", router: loanApplyRoutes, description: "Loan applications" },
  { path: "/loan/pay", router: loanPayRoutes, description: "Loan payments" },
  { path: "/users/details", router: userDetailsRoutes, description: "User details" },
  { path: "/analytics", router: analyticsRoutes, description: "Analytics data" },
  { path: "/chits/deactive", router: chitDeactiveRoutes, description: "Chit deactivation" },
  { path: "/loan/deactive", router: loanDeactiveRoutes, description: "Loan deactivation" }
]

// Register all routes
routes.forEach(({ path, router, description }) => {
  app.use(path, router)
  console.log(`📍 Route registered: ${path} - ${description}`)
})

// Routes summary endpoint for debugging
app.get('/routes', (req, res) => {
  const routeSummary = routes.map(({ path, description }) => ({
    path,
    description,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  }))

  res.json({
    message: 'Available API routes',
    totalRoutes: routes.length,
    routes: routeSummary,
    documentation: '/api-docs'
  })
})

// Error handling middleware (must be last)
app.use(notFoundHandler)
app.use(errorHandler)

// Enhanced server startup with better logging
const startServer = () => {
  const baseUrl = config.nodeEnv === 'production' 
    ? `https://${process.env.VERCEL_URL || 'your-domain.vercel.app'}`
    : `http://localhost:${config.port}`

  app.listen(config.port, () => {
    console.log('🚀 Chit Fund Backend Server Started')
    console.log('=' .repeat(50))
    console.log(`📊 Environment: ${config.nodeEnv}`)
    console.log(`🌐 Server: ${baseUrl}`)
    console.log(`💚 Health: ${baseUrl}/health`)
    console.log(`📚 API Docs: ${baseUrl}/api-docs`)
    console.log(`🔗 Routes: ${baseUrl}/routes`)
    console.log('=' .repeat(50))
  })
}

// Graceful shutdown handlers
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully')
  process.exit(0)
})

// Start server only if not in test environment
if (config.nodeEnv !== 'test') {
  startServer()
}

export default app