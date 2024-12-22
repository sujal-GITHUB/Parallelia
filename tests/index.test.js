const axios2 = require('axios')

const BACKEND_URL = "http://localhost:3000"
const WS_URL = "ws://localhost:3001"

const axios = {
    post: async(...args) => {
        try {
            const res = await axios2.post(...args)
            return res
        } catch (error) {
            return error.response
        }
    },

    get: async(...args) => {
        try {
            const res = await axios2.get(...args)
            return res
        } catch (error) {
            return error.response
        }
    },

    put: async(...args) => {
        try {
            const res = await axios2.put(...args)
            return res
        } catch (error) {
            return error.response
        }
    },

    delete: async(...args) => {
        try {
            const res = await axios2.delete(...args)
            return res
        } catch (error) {
            return error.response
        }
    }
}

describe("Authentication", () => {
    test('User is able to sign up only once', async () => {
        const username = "sujal-" + Date.now();
        const password = "12345678";

        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        });

        expect(response.status).toBe(201); // Created resource

        const duplicateResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        });

        expect(duplicateResponse.status).toBe(400); // User already exists
    });

    test('Signup request fails if the username is empty', async () => {
        const password = "12345678";

        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            password, // Missing username here
            type: "admin"
        }).catch(err => err.response);

        expect(response.status).toBe(400); // Validation error
    });

    test('Sign in succeeds if username and password are correct', async () => {
        const username = "sujal-" + Date.now();
        const password = "12345678";

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: 'admin'
        });

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });

        expect(response.status).toBe(200);
        expect(response.data.token).toBeDefined(); // Token should be returned
    });

    test('Sign in fails if username or password is incorrect', async () => {
        const username = "sujal-" + Date.now();
        const password = "12345678";

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: 'admin'
        });

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: "WrongUsername", // Incorrect username
            password
        }).catch(err => err.response);

        expect(response.status).toBe(403); // Invalid credentials
    });

    test('Sign in fails if password is incorrect', async () => {
        const username = "sujal-" + Date.now();
        const password = "12345678";

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: 'admin'
        });

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password: "WrongPassword" // Incorrect password
        }).catch(err => err.response);

        expect(response.status).toBe(403); // Invalid credentials
    });
});

describe('User metadata endpoints', () => {
    let token = "";
    let avatarId = "";

    beforeAll(async () => {
        // Sign up and sign in as an admin
        const username = 'sujal' + Math.random();
        const password = '12345678';

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: 'admin',
        });

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password,
        });

        token = response.data.token;

        // Create an avatar
        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            imageUrl: "https://plus.unsplash.com/premium_photo-1683865776032-07bf70b0add1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            name: "Timmy",
        }, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });

        avatarId = avatarResponse.data.avatarId;
    });

    test("User can't update their metadata with an invalid avatar ID", async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
                avatarId: "123123123",
            }, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            // Assert the status code
            expect(response.status).toBe(400);
        } catch (error) {
            // Handle 400 errors explicitly
            expect(error.response.status).toBe(400);
        }
    });

    test("User can update their metadata with a valid avatar ID", async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
                avatarId: avatarId,
            }, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            // Assert the status code
            expect(response.status).toBe(200);
        } catch (error) {
            // Handle unexpected errors
            console.error("Error:", error);
            throw error;
        }
    });

    test("Unauthorized user cannot update metadata", async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
                avatarId: avatarId,
            });

            // This line should not be reached
            throw new Error("Unauthorized request was successful unexpectedly");
        } catch (error) {
            // Assert the status code for unauthorized access
            expect(error.response.status).toBe(403);
        }
    });
});

describe("User avatar information",()=>{
    let avatarId
    let token
    let userId

    beforeAll(async ()=>{
        const username = 'sujal' + Math.random()
        const password = 123456

        const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:'admin'
        })

        userId = signupResponse.data.userId

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
        })

        token = response.data.token

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`,{
            "imageUrl":"https://plus.unsplash.com/premium_photo-1683865776032-07bf70b0add1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "name":"Timmy"
        },{
            headers:{
                "authorization":`Bearer ${token}`
            }
        })  

        avatarId = avatarResponse.data.avatarId  
    })

    test("Get back avatar information for a user", async()=>{

        const response = await axios.get(`${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`)

        expect(response.data.avatars.length).toBe(1)
        expect(response.data.avatars[0].userId).toBe(userId)
    })

    test("Availabe avatars lists the recently created avatar", async()=>{
        const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`)
        expect(response.data.avatars.length).not.toBe(0)

        const currentAvatar = response.data.avatars.find(x => x.id == avatarId)
        expect(currentAvatar).toBeDefined()
    })
})

describe('Space information', () => {
    let mapId
    let element1Id
    let element2Id
    let userToken
    let userId
    let adminId 
    let adminToken

    beforeAll(async ()=>{
        const username = 'sujal' + Math.random()
        const password = 123456

        const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username:username+'-user',
            password,
            type:'user'
        })

        userId = userSignupResponse.data.userId

        const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username:username+'-user',
            password
        })

        userToken = userSigninResponse.data.token

        const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:'admin'
        })

        adminId = signupResponse.data.userId

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
        })

        adminToken = response.data.token

        const element1Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl":"https://plus.unsplash.com/premium_photo-1683865776032-07bf70b0add1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "width":1,
            "height":1,
            "static":true
        },{
            headers:{
                "authorization": `Bearer ${adminToken}`
            }
        })

        const element2Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl":"https://plus.unsplash.com/premium_photo-1683865776032-07bf70b0add1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "width":1,
            "height":1,
            "static":true
        },{
            headers:{
                "authorization": `Bearer ${adminToken}`
            }
        })

        element1Id = element1Response.data.id
        element2Id = element2Response.data  .id
        
        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`,{
            "thumbnail":"linkd5a1d3ca2cs",
            "dimensions":"100*200",
            "defaultElements":[{
                "id":"1",
                "elementId":element1Id,
                "x":20,
                "y":20
            },{
                "id":"2",
                "elementId":element2Id,
                "x":10,
                "y":20
            }]
        },{
            headers:{
                "authorization": `Bearer ${adminToken}`
            }
        })

        mapId = mapResponse.id

    })

    test("User is able to create a space", async()=>{
        const response = axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name":"Test",
            "dimensions":"100*200",
            "mapId":mapId
        },{
            headers:{
                "authorization":`Bearer ${userToken}`
            }
        })

        expect(response.data.spaceId).toBeDefined()
    })

    test("User is able to create a space without mapId (empty space)", async()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name":"Test",
            "dimensions":"100*200",
        },{
            headers:{
                "authorization":`Bearer ${userToken}`
            }
        })

        expect(response.data.spaceId).toBeDefined()
    })

    test("User is able to create a space without mapId and dimensions", async()=>{  
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name":"Test",
        },{
            headers:{
                "authorization":`Bearer ${userToken}`
            }
        })

        expect(response.statusCode).toBe(400)
    })

    test("User is not able to delete a space that doesnt exist", async()=>{
        const response = await axios.delete(`${BACKEND_URL}/api/v1/space/randomIdDoesntExist`,{
            headers:{
                "authorization":`Bearer ${userToken}`
            }
        })

        expect(response.statusCode).toBe(400)
    })

    test("User is able to delete a space that exist", async()=>{
        const response = await axios.delete(`${BACKEND_URL}/api/v1/space`,{
            "name":"Test",
            "dimensions":"100*200"
        },{
            headers:{
                "authorization":`Bearer ${userToken}`
            }
        })

        const deleteResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,{
            headers:{
                "authorization":`Bearer ${userToken}`
            }
        })

        expect(deleteResponse.statusCode).toBe(200)
    })

    test("User should not be able to delete a space created by another user", async()=>{    
        const response = await axios.delete(`${BACKEND_URL}/api/v1/space`,{
            "name":"Test",
            "dimensions":"100*200"
        },{
            headers:{
                "authorization":`Bearer ${userToken}`
            }
        })

        const deleteResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,{
            headers:{
                "authorization":`Bearer ${adminToken}`
            }
        })

        expect(deleteResponse.statusCode).toBe(403)
    })

    test("Admin has no spaces initially",async()=>{
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`)

        expect(response.data.spaces.length).toBe(0)
    })

    test("Admin has no spaces initially",async()=>{
        const spaceCreateResponse = axios.post(`${BACKEND_URL}/api/v1/space/all`,{
            "name":"Test",
            "dimensions":"100*200",
        },{
            headers:{
                "authorization":`Bearer ${userToken}`
            }
        })

        const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`,{
            headers:{
                "authorization":`Bearer ${userToken}`
            }
        })
        const filteredSpace = response.data.spaces.find(x=>x.id == spaceCreateResponse.spaceId)
        expect(response.data.spaces.length).toBe(1)
        expect(filteredSpace).toBeDefined()   
    })
})

describe('Tests for Arena endpoints', () => {
    let mapId
    let element1Id
    let element2Id
    let userToken
    let userId
    let adminId 
    let adminToken
    let spaceId

    beforeAll(async ()=>{
        const username = 'sujal' + Math.random()
        const password = 123456

        const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:'user'
        })

        userId = userSignupResponse.data.userId

        const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username:username+'-user',
            password,
        })

        userToken = userSigninResponse.data.token

        const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:'admin'
        })

        adminId = signupResponse.data.userId

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password,
        })

        adminToken = response.data.token


        const element1Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl":"https://plus.unsplash.com/premium_photo-1683865776032-07bf70b0add1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "width":1,
            "height":1,
            "static":true
        },{
            headers:{
                "authorization": `Bearer ${adminToken}`
            }
        })

        const element2Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl":"https://plus.unsplash.com/premium_photo-1683865776032-07bf70b0add1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "width":1,
            "height":1,
            "static":true
        },{
            headers:{
                "authorization": `Bearer ${adminToken}`
            }
        })

        element1Id = element1Response.data.id
        element2Id = element2Response.data  .id
        
        const map = await axios.post(`${BACKEND_URL}/api/v1/admin/map`,{
            "thumbnail":"linkd5a1d3ca2cs",
            "dimensions":"100*200",
            "defaultElements":[{
                "id":"1",
                "elementId":element1Id,
                "x":20,
                "y":20
            },{
                "id":"2",
                "elementId":element2Id,
                "x":10,
                "y":20
            }]
        },{
            headers:{
                "authorization": `Bearer ${adminToken}`
            }
        })

        mapId = map.id

        const spaceResponse = await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name":"Test",
            "dimensions":"100*200",
            "mapId":mapId
        },{
            headers:{
                "authorization":`Bearer ${userToken}`
            }
        })

        spaceId = spaceResponse.data.spaceId  
    })

    test("Incorrect spaceId returns a 400",async()=>{
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/ds1ad2a`,{
            headers:{
                "authorization": `Bearer ${userToken}`
            }
        })

        expect(response.statusCode).toBe(400)
    })

    test("Correct spaceId returns an element",async()=>{
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`,{
            headers:{
                "authorization": `Bearer ${userToken}`
            }
        })

        expect(response.data.dimensions).toBe("100*200")
        expect(response.data.elements.length).toBe(2)
    })

    test("Delete endpoint is able to delete an element",async()=>{
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`,{
            headers:{
                "authorization": `Bearer ${userToken}`
            }
        })

        await axios.get(`${BACKEND_URL}/api/v1/space/element`,{
            spaceId: spaceId, 
            elementId: response.data.elements[0].id    
        })  

        const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`)

        expect(newResponse.data.elements.length).toBe(1)
    })

    test("Adding an element in space",async()=>{
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`,{
            headers:{
                "authorization": `Bearer ${userToken}`
            }
        })

        await axios.get(`${BACKEND_URL}/api/v1/space/element`,{
            spaceId: spaceId, 
            elementId: response.data.elements[0].id,
            "x": 50,
            "y": 20    
        })  

        const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`)
        expect(newResponse.data.elements.length).toBe(2)
    })  

    test("Adding an element in space fails if element lies outside the dimensions",async()=>{
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`,{
            headers:{
                "authorization": `Bearer ${userToken}`
            }
        })

        await axios.get(`${BACKEND_URL}/api/v1/space/element`,{
            spaceId: spaceId, 
            elementId: response.data.elements[0].id,
            "x": 5000,
            "y": 20    
        })  

        const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`)
        expect(newResponse.statusCode).toBe(404)
    })  
})

describe("Create an element", () => {
    let userToken, 
    userId, 
    adminId, 
    adminToken;
    let mapId; // Assuming mapId is predefined or needs to be set up in the beforeAll block

    beforeAll(async () => {
        const username = 'sujal' + Math.random();
        const password = "123456";

        // User Signup and Sign-in
        const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: 'user',
        });

        userId = userSignupResponse.data.userId;

        const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password,
        });

        userToken = userSigninResponse.data.token;

        // Admin Signup and Sign-in
        const adminSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: username + "-admin",
            password,
            type: 'admin',
        });

        adminId = adminSignupResponse.data.userId;

        const adminSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: username + "-admin",
            password,
        });

        adminToken = adminSigninResponse.data.token;

        // Create a space
        const spaceResponse = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            name: "Test",
            dimensions: "100*200",
            mapId,
        }, {
            headers: {
                authorization: `Bearer ${userToken}`,
            },
        });

        mapId = spaceResponse.data.mapId; // Assuming response includes a mapId
    });

    test("User is not able to hit admin endpoints", async () => {
        try {
            const elementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
                imageUrl: "https://example.com/image.png",
                width: 1,
                height: 1,
                static: true,
            }, {
                headers: {
                    authorization: `Bearer ${userToken}`,
                },
            });

            expect(elementResponse.status).toBe(403);
        } catch (error) {
            expect(error.response.status).toBe(403);
        }
    });

    test("Admin is able to hit admin endpoints", async () => {
        const elementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            imageUrl: "https://example.com/image.png",
            width: 1,
            height: 1,
            static: true,
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`,
            },
        });

        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            thumbnail: "https://thumbnail.com/a.png",
            dimensions: "100*200",
            defaultElements: [],
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`,
            },
        });

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            imageUrl: "https://example.com/avatar.png",
            name: "Timmy",
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`,
            },
        });

        expect(elementResponse.status).toBe(200);
        expect(mapResponse.status).toBe(200);
        expect(avatarResponse.status).toBe(200);
    });

    test("Admin is able to update a space", async () => {
        const elementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            imageUrl: "https://example.com/image.png",
            width: 1,
            height: 1,
            static: true,
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`,
            },
        });

        const updateElementResponse = await axios.put(`${BACKEND_URL}/api/v1/admin/element/${elementResponse.data.id}`, {
            imageUrl: "https://example.com/updated-image.png",
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`,
            },
        });

        expect(updateElementResponse.status).toBe(200);
    });
});

describe('WebSocket tests', () => {
    let adminToken;
    let adminUserId;
    let userToken;
    let userId;
    let mapId;
    let element1Id;
    let element2Id;
    let spaceId;
    let ws1;
    let ws2;
    let ws1Messages = [];
    let ws2Messages = [];
    let userX;
    let userY;
    let adminX;
    let adminY;

    const waitForAndPopLatestMessage = (messageArray) => {
        return new Promise((resolve) => {
            if (messageArray.length > 0) {
                resolve(messageArray.shift());
            } else {
                const interval = setInterval(() => {
                    if (messageArray.length > 0) {
                        resolve(messageArray.shift());
                        clearInterval(interval);
                    }
                }, 100);
            }
        });
    };

    const setupHTTP = async () => {
        const username = `sujal-${Math.random()}`;
        const password = 'TestPassword123';

        const adminSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            role: "admin"
        });

        const adminSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });

        adminUserId = adminSignupResponse.data.userId;
        adminToken = adminSigninResponse.data.token;

        const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: `${username}-user`,
            password
        });

        const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: `${username}-user`,
            password
        });

        userId = userSignupResponse.data.userId;
        userToken = userSigninResponse.data.token;

        const element1Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            imageUrl: "https://example.com/image1",
            width: 1,
            height: 1,
            static: true
        }, {
            headers: { authorization: `Bearer ${adminToken}` }
        });

        const element2Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            imageUrl: "https://example.com/image2",
            width: 1,
            height: 1,
            static: true
        }, {
            headers: { authorization: `Bearer ${adminToken}` }
        });

        element1Id = element1Response.data.id;
        element2Id = element2Response.data.id;

        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            thumbnail: "https://example.com/thumbnail",
            dimensions: "100*200",
            defaultElements: [
                { id: "1", elementId: element1Id, x: 20, y: 20 },
                { id: "2", elementId: element2Id, x: 10, y: 20 }
            ]
        }, {
            headers: { authorization: `Bearer ${adminToken}` }
        });

        mapId = mapResponse.data.id;

        const spaceResponse = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            name: "Test",
            dimensions: "100*200",
            mapId
        }, {
            headers: { authorization: `Bearer ${userToken}` }
        });

        spaceId = spaceResponse.data.spaceId;
    };

    const setupWs = async () => {
        ws1 = new WebSocket(WS_URL);
        await new Promise((resolve) => ws1.onopen = resolve);
        ws1.onmessage = (event) => ws1Messages.push(JSON.parse(event.data));

        ws2 = new WebSocket(WS_URL);
        await new Promise((resolve) => ws2.onopen = resolve);
        ws2.onmessage = (event) => ws2Messages.push(JSON.parse(event.data));
    };

    beforeAll(async () => {
        await setupHTTP();
        await setupWs();
    });

    test("Get back acknowledgment for join", async () => {
        ws1.send(JSON.stringify({ type: "join", payload: { spaceId, token: adminToken } }));
        const message1 = await waitForAndPopLatestMessage(ws1Messages);

        ws2.send(JSON.stringify({ type: "join", payload: { spaceId, token: userToken } }));
        const message2 = await waitForAndPopLatestMessage(ws2Messages);
        const message3 = await waitForAndPopLatestMessage(ws1Messages);

        expect(message1.type).toBe("space-joined");
        expect(message2.type).toBe("space-joined");
        expect(message3.type).toBe("user-join");

        expect(message1.payload.users.length).toBe(1);
        expect(message2.payload.users.length).toBe(2);

        adminX = message1.payload.spawn.x;
        adminY = message1.payload.spawn.y;

        userX = message2.payload.spawn.x;
        userY = message2.payload.spawn.y;

        expect(message3.payload.userId).toBe(userId);
        expect(message3.payload.x).toBe(userX);
        expect(message3.payload.y).toBe(userY);
    });

    test("User should not be able to move outside the dimensions", async () => {
        ws1.send(JSON.stringify({ type: "movement", payload: { x: 500000, y: 500000 } }));
        const message = await waitForAndPopLatestMessage(ws1Messages);

        expect(message.type).toBe("movement-rejected");
        expect(message.payload.x).toBe(adminX);
        expect(message.payload.y).toBe(adminY);
    });

    test("User should not be able to move two blocks at the same time", async () => {
        ws1.send(JSON.stringify({ type: "movement", payload: { x: adminX + 2, y: adminY } }));
        const message = await waitForAndPopLatestMessage(ws1Messages);

        expect(message.type).toBe("movement-rejected");
        expect(message.payload.x).toBe(adminX);
        expect(message.payload.y).toBe(adminY);
    });

    test("Correct movement should be broadcasted to other sockets", async () => {
        ws1.send(JSON.stringify({ type: "movement", payload: { x: adminX + 1, y: adminY } }));
        const message = await waitForAndPopLatestMessage(ws2Messages);

        expect(message.type).toBe("movement");
        expect(message.payload.x).toBe(adminX + 1);
        expect(message.payload.y).toBe(adminY);
    });

    test("If a user leaves, other users get a leave message", async () => {
        ws1.close();
        const message = await waitForAndPopLatestMessage(ws2Messages);

        expect(message.type).toBe("user-left");
        expect(message.payload.userId).toBe(adminUserId);
    });
});
