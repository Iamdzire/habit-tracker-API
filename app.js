import express from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cors from 'cors'
import authRoutes from './src/routes/authRoutes.js'
import habitRoutes from './src/routes/habitRoutes.js'
import checkInRoutes from './src/routes/checkInRoutes.js'


const app = express()

app.use(express.json())
app.use(cors())
app.use(helmet())

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // Max requests per IP
    message: {
        error: "Too many requests, please try again later."
    }
})

app.use(limiter)

// Health check
app.get('/', (req, res) => res.send("Habit Tracker API running!"))

// Register API Routes
app.use('/api/auth', authRoutes)
app.use('/api/habits', habitRoutes)
app.use('/api/check-ins', checkInRoutes)

// 404 Handler
app.use((req, res) => res.status(404).json({
    error: "Route " + req.method + req.url + " not found."
}))

export default app