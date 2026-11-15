import 'dotenv/config'
import mongoose from 'mongoose'
import {MongoMemoryServer} from 'mongodb-memory-server'
import app from '../../app.js'

let mongoServer

export const connectTestDb = async () => {
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)
}


export const closeTestDb = async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    if(mongoServer) {
        await mongoServer.stop()
    }
}


export const clearDb = async () => {
    const collections = mongoose.connection.collections
    for (const key in collections) {
        await collections[key].deleteMany({})
    }
}

export {app}