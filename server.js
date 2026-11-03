import 'dotenv/config'
import connectDb from './src/config/db.js'
import app from './app.js'

const port = process.env.PORT || 5000

const startServer = async () => {
    try {
        await connectDb()
        app.listen(port, () => console.log(`Server running and listening on port ${port}`))
    }catch(error){
        console.error("Failed to start server: ", error.message)
        process.exit(1)
    }
}

startServer()