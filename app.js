import express from 'express'
import cors from 'cors'
import authRoutes from './src/routes/authRoutes.js'
import habitRoutes from './src/routes/habitRoutes.js'
import checkInRoutes from './src/routes/checkInRoutes.js'


const app = express()

app.use(express.json())
app.use(cors())

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