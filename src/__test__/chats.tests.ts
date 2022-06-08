import supertest from 'supertest'
import app from '../app'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const client = supertest(app)



describe('It should response the POST method to chats api', () => {
    it('It should response the POST method', async () => {
        const response = await client.post('/chats').send({
            chatName: 'test',
            userId: '5e9f8f8f8f8f8f8f8f8f8f8f'
            })
        expect(response.status).toBe(201)
    })
})


