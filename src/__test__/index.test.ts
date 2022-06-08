import supertest from 'supertest';
import app from '../app';
import dotenv from 'dotenv'
dotenv.config()

const client = supertest(app)


describe('Test the root path', () => {


    it('It should response the GET method', async () => {
        const response = await client.get('/api/test')
        expect(response.status).toBe(200)
    })

})


