const axios = require('axios')

const BACKEND_URL = "http://localhost:3000"
const WS_URL = "ws://localhost:3001"

describe("Authentication",()=>{
    test('User is able to sign up only once',async()=>{
        const username = "sujal"+Math.random()
        const password = "123456"
 
        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:admin
        })

        expect(response.statusCode).toBe(200)

        const Updatedresponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:admin
        })

        expect(Updatedresponse.statusCode).toBe(400)
    })

    test('Signup requst fails if the username is empty',async()=>{
        const username = "sujal"+Math.random()
        const password = "123456"

        const Updatedresponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            password,
        })

        expect(Updatedresponse.statusCode).toBe(400)
    })

    test('Sign in succeeds if username and password is correct',async()=>{
        const username = "sujal"+Math.random()
        const password = "123456"

        await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
        })

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password,
        })

        expect(response.statusCode).toBe(200)
        expect(response.body.token).toBeDefined()
    })

    test('Sign in fails if username or password is incorrect',async()=>{
        const username = "sujal"+Math.random()
        const password = "123456"

        await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password
        })

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username: "Wrong",
            password
        })      

        expect(response.statusCode).toBe(403)
    })
})

describe('User metadata endpoints',()=>{

    let token = ""
    let avatarId = ""

    beforeAll(async ()=>{
        const username = 'sujal' + Math.random()
        const password = 123456

        await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:'admin'
        })

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

    test("User cant update their metadata with wrong avatar id",async ()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId: "123123123"
        },{
            headers:{
                "authorization":`Bearer ${token}`
            }
        })

        expect(response.statusCode).toBe(400)
    })

    test("User can update their metadata with right avatar id", async() =>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId: avatarId
        },{
            headers:{
                "authorization":`Bearer ${token}`
            }
        })

        expect(response.statusCode).toBe(200)    
    })
    
    test("User can update their metadata with right avatar id", async() =>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId: avatarId
        })

        expect(response.statusCode).toBe(403)    
    })
})

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

describe("Create an element",async()=>{ 
    let userToken
    let userId
    let adminId 
    let adminToken 

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

        const space = await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name":"Test",
            "dimensions":"100*200",
            "mapId":mapId
        },{
            headers:{
                "authorization":`Bearer ${userToken}`
            }
        })
    })

    test("User is not able to hit admin endpoints", async()=>{
        const elementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl":"https://plus.unsplash.com/premium_photo-1683865776032-07bf70b0add1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "width":1,
            "height":1,
            "static":true
        },{
            headers:{
                "authorization": `Bearer ${userToken}`
            }
        })

        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`,{
            "thumbnail":"https://thumbnail.com/a.png",
            "dimensions":"100*200",
            "defaultElements":[]
        },{
            headers:{
                "authorization": `Bearer ${userToken}`
            }
        })

        const createAvatarResponse = await axios.post(`${BACKEND_URL}/api/v1/avatar`,{
            "thumbnail":"https://thumbnail.com/a.png",
            "dimensions":"100*200",
            "defaultElements":[]
        },{
            headers:{
                "authorization": `Bearer ${userToken}`
            }
        })

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`,{
            "imageUrl":"https://plus.unsplash.com/premium_photo-1683865776032-07bf70b0add1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "name":"Timmy"
        },{
            headers:{
                "authorization":`Bearer ${userToken}`
            }
        })  

        const updateElementResponse = await axios.put(`${BACKEND_URL}/api/v1/admin/element/:elementId`,{
            "imageUrl":"https://plus.unsplash.com/premium_photo-1683865776032-07bf70b0add1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },{
            headers:{
                "authorization":`Bearer ${userToken}`
            }
        })

        expect(elementResponse.statusCode).toBe(403)
        expect(mapResponse.statusCode).toBe(403)
        expect(avatarResponse.statusCode).toBe(403)
        expect(updateElementResponse.statusCode).toBe(403)
    })

    test("User is able to hit admin endpoints", async()=>{
        const elementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl":"https://plus.unsplash.com/premium_photo-1683865776032-07bf70b0add1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "width":1,
            "height":1,
            "static":true
        },{
            headers:{
                "authorization": `Bearer ${adminToken}`
            }
        })

        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`,{
            "thumbnail":"https://thumbnail.com/a.png",
            "dimensions":"100*200",
            "defaultElements":[]
        },{
            headers:{
                "authorization": `Bearer ${adminToken}`
            }
        })

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`,{
            "imageUrl":"https://plus.unsplash.com/premium_photo-1683865776032-07bf70b0add1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "name":"Timmy"
        },{
            headers:{
                "authorization":`Bearer ${adminToken}`
            }
        })  

        expect(elementResponse.statusCode).toBe(200)
        expect(mapResponse.statusCode).toBe(200)
        expect(avatarResponse.statusCode).toBe(200)
    })   

    test("Admin is able to update a space", async()=>{

        const elementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl":"https://plus.unsplash.com/premium_photo-1683865776032-07bf70b0add1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "width":1,
            "height":1,
            "static":true
        },{
            headers:{
                "authorization":`Bearer ${adminToken}`
            }
        })

        const updateElementResponse = await axios.put(`${BACKEND_URL}/api/v1/admin/element/:${elementResponse.data.id}`,{
            "imageUrl":"https://plus.unsplash.com/premium_photo-1683865776032-07bf70b0add1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },{
            headers:{
                "authorization":`Bearer ${adminToken}`
            }
        })

        expect(updateElementResponse.statusCode).toBe(200)
    })
})

describe('Web socket tests', async() => {
    let adminToken
    let adminUserId
    let userToken
    let userId
    let mapId
    let element1Id
    let element2Id
    let spaceId
    let ws1
    let ws2
    let ws1Messages = []
    let ws2Messages = []
    let userX
    let userY
    let adminX
    let adminY

    function waitForAndPopLatestMessage(messageArray){
        return new Promise(r=>{
            if (messageArray.length>0){
                return messageArray.shift()
            }
            else{
                let interval = setInterval(() => {
                    if(messageArray.length>0){
                        resolve(messageArray.shift())
                        clearInterval(interval)
                    }
                }, 100);
            }
        })
    }

    async function setupHTTP(){
        const username = `sujal-${Math.random()}`
        const adminSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            role: "admin"
        })

        const adminSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
        })

        adminUserId = adminSignupResponse.data.userId
        adminToken = adminSigninResponse.data.token

        const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username:username + "-user",
            password
        })

        const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username:username + "-user",
            password
        })

        userId = userSignupResponse.data.userId
        userToken = userSigninResponse.data.token

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
    }

    async function setupWs(){
        ws1 = new WebSocket(WS_URL)
        await new Promise(r=>{
            ws1.onopen = r
        })

        ws1.onmessage = (event)=>{
            ws1Messages.push(JSON.parse(event.data))
        }

        ws2 = new WebSocket(WS_URL)
        await new Promise(r=>{
            ws2.onopen = r 
        })

        ws2.onmessage = (event)=>{
            ws2Messages.push(JSON.parse(event.data))
        }
    }

    beforeAll(async()=>{
       setupHTTP()
       setupWs()
    })

    test("Get back acknoledgement for join", async()=>{
        ws1.send(JSON.stringify({
            "type":"join",
            "payload":{
                "spaceId":spaceId,
                "token":adminToken
            }
        }))

        const message1 = await waitForAndPopLatestMessage(ws1Messages)
    
        ws2.send(JSON.stringify({
            "type":"join",
            "payload":{
                "spaceId":spaceId,
                "token":userToken
            }
        }))

        const message2 = await waitForAndPopLatestMessage(ws2Messages)
        const message3 = await waitForAndPopLatestMessage(ws1Messages)

        expect(message1.type).toBe("space-joined")
        expect(message2.type).toBe("space-joined")

        expect(message1.payload.users.length + message2.payload.users.length).toBe(0)
        expect(message2.payload.users.length + message2.payload.users.length).toBe(1)
        expect(message3.type).toBe("user-join")
        expect(message3.payload.x).toBe(message2.payload.spawn.x)
        expect(message3.payload.y).toBe(message2.payload.spawn.y)
        expect(message3.payload.userId).toBe(userId)

        adminX = message1.payload.spawn.x
        adminY = message1.payload.spawn.y

        userX = message2.payload.spawn.x
        userY = message2.payload.spawn.y
    })

    test("User should not be able to move outside the dimensions", async()=>{
        ws1.send(JSON.stringify({
            type:"movement",
            payload:{
                x: 500000,
                y: 500000
            }
        }))

        const message = await waitForAndPopLatestMessage(ws1Messages)
        expect(message.type).toBe("movement-rejected")
        expect(message.paylaod.x).toBe(adminX)
        expect(message.paylaod.y).toBe(adminY)
    })

    test("User should not be able to move two blocks at the same time", async()=>{
        ws1.send(JSON.stringify({
            type:"movement",
            payload:{
                x: adminX + 2,
                y: adminY
            }
        }))

        const message = await waitForAndPopLatestMessage(ws1Messages)
        expect(message.type).toBe("movement-rejected")
        expect(message.paylaod.x).toBe(adminX)
        expect(message.paylaod.y).toBe(adminY)
    })

    test("Correct movement should be broadcasted to another sockets", async()=>{
        ws1.send(JSON.stringify({
            type:"movement",
            payload:{
                x: adminX + 1,
                y: adminY,
                userId: adminUserId
            }
        }))

        const message = await waitForAndPopLatestMessage(ws2Messages)
        expect(message.type).toBe("movement")
        expect(message.paylaod.x).toBe(adminX+1)
        expect(message.paylaod.y).toBe(adminY)
    })

    test("If a user leaves, other users get a leave message", async()=>{
        ws1.close()

        const message = await waitForAndPopLatestMessage(ws2Messages)
        expect(message.type).toBe("user-left")
        expect(message.paylaod.userId).toBe(adminUserId)
    })
})