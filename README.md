# Chit Fund Backend

A TypeScript Express.js backend template for a chit fund application.

## Features

- TypeScript support with strict type checking
- Express.js server with security middleware
- Health check endpoint
- Error handling middleware
- CORS and Helmet security
- Request logging with Morgan
- Development hot reload with tsx

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start development server:
\`\`\`bash
npm run dev
\`\`\`

3. Build for production:
\`\`\`bash
npm run build
npm start
\`\`\`

## API Endpoints

### Health Check
- **GET** `/health` - Returns server health status

Example response:
\`\`\`json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "uptime": 123.45,
    "environment": "development",
    "version": "1.0.0"
  },
  "message": "Service is healthy"
}
\`\`\`

## Project Structure

\`\`\`
src/
├── config/          # Configuration files
├── middleware/      # Express middleware
├── routes/          # API route handlers
├── types/           # TypeScript type definitions
└── index.ts         # Main application entry point
\`\`\`

## Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run type-check` - Run TypeScript type checking
# chits-backend
