const request = require('supertest');
const server = require('../src/testsever');

describe("Authentication Api Test", () => {
    const loginDetail = {
        "username": "Rushita",
        "password": "Rushita123"
    };

    const registerDetails = {
        "name": "Rushita Patel",
        "email": "demo7@gmail.com",
        "username": "Rushita",
        "phone": "6475628456",
        "password": "Rushita123"
    }

    test("Login User", async () => {

        const res = await request(server).post("/api/v1/user/login").send(loginDetail);

        expect(res.body).toHaveProperty("name");
        expect(res.body).toHaveProperty("email");
        expect(res.body).toHaveProperty("token");
    });

    test("Register User", async () => {

        const res = await request(server).post("/api/v1/user/register").send(registerDetails);

        expect(res.body).toHaveProperty("message");
        expect(200)
    });

});