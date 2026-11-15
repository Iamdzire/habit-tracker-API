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

describe('Auth routes', () => {
    test('Should register a new user', async () => {
        const res = await request(app)
        .post('/api/auth/create')
        .send({
            name: 'Uchendu Chigozie Emmanuel',
            email: 'uchenduchigozie03@gmail.com',
            password: 'anything',
            confirmPassword: 'anything'
        })

        expect(res.statusCode).toBe(201)
        expect(res.body.message).toBe('User created successfully.')
        expect(res.body.data.email).toBe('uchenduchigozie03@gmail.com')
        expect(res.body.data.password).toBeUndefined()
    })

    test('Should not register with missing fields', async () => {
        const res = await request(app)
        .post('/api/auth/create')
        .send({
            email: 'uchenduchigozie03@gmail.com'
        })

        expect(res.statusCode).toBe(400)
    })

    test('Should login successfully', async () => {
        await request(app)
        .post('/api/auth/create')
        .send({
            name: 'Uchendu Chigozie Emmanuel',
            email: 'uchenduchigozie03@gmail.com',
            password: 'anything',
            confirmPassword: 'anything'
        })

        const res = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'uchenduchigozie03@gmail.com',
            password: 'anything'
        })

        console.log(res.body)

        expect(res.statusCode).toBe(200)
        expect(res.body.data.token).toBeDefined()
    })

    test('Should not login with wrong password', async () => {
        await request(app)
        .post('/api/auth/create')
        .send({
            name: 'Uchendu Chigozie Emmanuel',
            email: 'uchenduchigozie03@gmail.com',
            password: 'anything',
            confirmPassword: 'anything'
        })

        const res = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'uchenduchigozie03@gmail.com',
            password: '123456'
        })

        console.log(res.statusCode, res.body)

        expect(res.statusCode).toBe(401)
    })
})