import request from 'supertest'
import {app, connectTestDb, closeTestDb, clearDb} from './setup.js'

beforeAll(async () => {
    await connectTestDb()
})

afterEach(async () => {
    await clearDb()
})

afterAll(async () => {
    await closeTestDb()
})

describe('Habit routes', () => {
    test('Should block habits route without token', async () => {
        const res = await request(app)
        .get('/api/habits')

        expect(res.statusCode).toBe(401)
    })

    test('should get habits with valid token', async () => {
        // Register
        await request(app)
        .post('/api/auth/create')
        .send({
            name: 'Uchendu Chigozie Emmanuel',
            email: 'uchenduchigozie03@gmail.com',
            password: 'anything',
            confirmPassword: 'anything'
        })

        // Login
        const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'uchenduchigozie03@gmail.com',
            password: 'anything'
        })

        const token = loginRes.body.data.token

        // Call Protected Route
        const res = await request(app)
        .get('/api/habits')
        .set('Authorization', `Bearer ${token}`)

        expect([200, 404]).toContain(res.statusCode)
    })

    test('Should not allow another user to access a habit', async () => {
        // User A Register + Login
        await request(app)
        .post('/api/auth/create')
        .send({
            name: 'Uchendu Chigozie Emmanuel',
            email: 'uchenduchigozie03@gmail.com',
            password: 'anything',
            confirmPassword: 'anything'
        })

        const loginA = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'uchenduchigozie03@gmail.com',
            password: 'anything'
        })

        const tokenA = loginA.body.data.token

        // User A Creates Habit
        const habitRes = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
            name: 'Coding',
            frequency: 'Daily'
        })

        expect(habitRes.statusCode).toBe(201)
        const habitId = habitRes.body.data._id

        // User B Register + Login
        await request(app)
        .post('/api/auth/create')
        .send({
            name: 'Uchendu Chigozie Emmanuel',
            email: 'uchenduchigozie04@gmail.com',
            password: 'anything',
            confirmPassword: 'anything'
        })

        const loginB = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'uchenduchigozie04@gmail.com',
            password: 'anything'
        })

        const tokenB = loginB.body.data.token

        // User B tries to access User A habit
        const res = await request(app)
        .get(`/api/habits/${habitId}`)
        .set('Authorization', `Bearer ${tokenB}`)

        expect(res.statusCode).toBe(403)
    })
})