import supertest from 'supertest'
import app from '../app'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const client = supertest(app)

let user = {
    username: 'test',
    phoneNumber: '12345',
    password: 'test'
}

let userId: string;
let accessToken: string;

describe('Test the users endpoint', () => { 

    beforeAll(async () => {
        expect(process.env.MONGO_URL_TEST).toBeDefined()
        await mongoose.connect(process.env.MONGO_URL_TEST!);
    });


    it('It should response the POST method to users API {users/account}', async () => {
        const response = await client.post('/users/account').send(user)
        expect(response.status).toBe(201)
        /**
         * response.body => {
         *  user:{
         *      //...dati tranne pwd
         *  },
         *  accessToken: string
         * }
         */
        expect(response.body).toHaveProperty('accessToken')
        expect(user).toBeDefined()
        userId = response.body._id
        console.log('userId ',response.body)//{accessToken:{}}
    });

    it('It should response the POST method to users API {users/session}', async () => {
        const response = await client.post('/users/session').send(user)
        expect(response.status).toBe(200)
        console.log(response.body)
        expect(response.body).toHaveProperty('accessToken')
        accessToken = response.body.accessToken
    });

    it('It should response the GET method to users API {users}', async () => {
        const response = await client.get('/users').set('Authorization', `Bearer ${accessToken}`)
        console.log(accessToken)
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('_id')
        expect(response.body._id).toBeDefined()
    });

    it('It should response the GET method to users API {users/me}', async () => {
        const response = await client.get('/users/me').set('Authorization', `Bearer ${accessToken}`)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('_id')
        expect(response.body._id).toBeDefined()
    })

    it('It should response the GET method to users API {users/:id}', async () => {
        const response = await client.get(`/users/${userId}`).set('Authorization', `Bearer ${accessToken}`)
        console.log(userId)
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('_id')
        expect(response.body._id).toBeDefined()
    });

    it('It should response the GET method to users API {users/:id} with incorrect id', async () => {
        console.log(accessToken)
        const response = await client.get(`/users/5e9b8f9f9b8f9b8f9b8f9b8f`).set('Authorization', `Bearer ${accessToken}`)
        expect(response.status).toBe(404)
    });

    it('It should response the PUT method to users API {users/:id}', async () => {
        const response = await client.put(`/users/me`).set('Authorization', `Bearer ${accessToken}`).send({
            username: 'test2',
            email: 'test2@test.com',
            password: 'test2'
        })
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('_id')
        expect(response.body._id).toBe(userId)
    });

    it('It should response the PUT method to users API {users/:id} with incorrect id', async () => {
        const response = await client.put(`/users/5e9b8f9f9b8f9b8f9b8f9b8f`).set('Authorization', `Bearer ${accessToken}`).send({
            username: 'test2',
            email: 'test2@test.com',
            password: 'test2'
        })
        expect(response.status).toBe(404)
    });

  

    afterAll(async () => {
        console.log("Running after all the tests in the suite")
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
    })

 })