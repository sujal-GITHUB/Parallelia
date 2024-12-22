import {Router} from 'express';
import { adminMiddleware } from '../../middleware/admin';
import { addElementSchema, createAvatarSchema, createElementSchema, createMapSchema, updateElementSchema } from '../../types';
import client from '@repo/db/client'

export const adminRouter = Router();

adminRouter.post('/element',adminMiddleware, async (req, res) => {
    const parsedData = createElementSchema.safeParse(req.body);

    if(!parsedData.success){
        res.status(400).json({message: "Validation Failed"});
        return 
    }

    const element = await client.element.create({
        data: {
            width: parsedData.data.width,
            height: parsedData.data.height,
            static: parsedData.data.static,
            imageUrl: parsedData.data.imageUrl,
        }
    })

    res.json({
        id: element.id,
        message: 'Element created'});
})    
    
adminRouter.put('/element/:elementId', (req, res) => {
    const parsedData = updateElementSchema.safeParse(req.body);

    if(!parsedData.success){
        res.status(400).json({message: "Validation Failed"});
        return 
    }

    client.element.update({
        where: {
            id: req.params.elementId
        },
        data: {
            imageUrl: parsedData.data.imageUrl,
        }
    })

    res.json({message: 'Element updated'});
})    

adminRouter.post('/avatar',adminMiddleware, async (req, res) => {
    const parsedData = createAvatarSchema.safeParse(req.body);

    if(!parsedData.success){
        res.status(400).json({message: "Validation Failed"});
        return 
    }

    const avatar = await client.avatar.create({ 
        data: {
            name: parsedData.data.name,
            imageUrl: parsedData.data.imageUrl,
        }
    })

    res.json({
        id: avatar.id,
        message: 'Avatar created'});
})    

adminRouter.get('/map', async(req, res) => {
    const parsedData = createMapSchema.safeParse(req.query);

    if(!parsedData.success){
        res.status(400).json({message: "Validation Failed"});
        return 
    }

    const map = await client.map.create({
        data: {
            name: parsedData.data.name,
            width: parseInt(parsedData.data.dimensions.split('x')[0]),
            height: parseInt(parsedData.data.dimensions.split('x')[1]),
            thumbnail: parsedData.data.thumbnail,
            mapElements: {
                create: parsedData.data.defaultElements.map((element) => ({
                    elementId: element.elementId,
                    x: element.x,
                    y: element.y    
                }))
            }
        }
    })

    res.json({
        id: map.id,
        message: 'Map created'});
})    