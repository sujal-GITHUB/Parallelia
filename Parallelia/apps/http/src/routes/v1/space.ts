import {Router} from 'express';
import { addElementSchema, createSpaceSchema, deleteElementSchema } from '../../types';
import client from '@repo/db/client'
import { userMiddleware } from '../../middleware/user';

export const spaceRouter = Router();

spaceRouter.post('/', userMiddleware ,async (req, res) => {                                                                          
    const parsedData = createSpaceSchema.safeParse(req.body);

    if(!parsedData.success){
        res.status(400).json({message: "Validation Failed"});
        return 
    }

    if(!parsedData.data.mapId){
        await client.space.create({
            data: {
                name: parsedData.data.name,
                width: parseInt(parsedData.data.dimensions.split('x')[0]),
                height: parseInt(parsedData.data.dimensions.split('x')[1]),
                creatorId: req.userId!
            }
        })
    }

    const map = await client.map.findUnique({
        where: {
            id: parsedData.data.mapId
        },
        select: {
            mapElements: true,
            height: true,
            width: true
        }
    })

    if(!map){
        res.status(404).json({message: "Map not found"});
        return
    }

    let space = await client.$transaction(async()=>{
        const space = await client.space.create({
            data: {
                name: parsedData.data.name,
                width: map.height,
                height: map.width,
                creatorId: req.userId!,
            }
        })

        await client.spaceElements.createMany({
            data: map.mapElements.map((element) => ({
                spaceId: space.id,
                elementId: element.elementId,
                x: element.x!,
                y: element.y!,
            }))
        })

        return space
    })

    res.json({message: 'Space created'});
});

spaceRouter.delete('/:spaceId',userMiddleware,async (req, res) => {                                                                          
    const spaceId = await client.space.findUnique({
        where: {
            id: req.params.spaceId
        },
        select: {
            creatorId: true
        }
    })

    if(!spaceId){
        res.status(400).json({message: "Space not found"});
        return
    }

    if(spaceId?.creatorId !== req.userId){
        res.status(403).json({message: "Forbidden"});
        return
    }

    await client.space.delete({
        where: {
            id: req.params.spaceId
        }
    })

    res.json({message: 'Space deleted'});
});

spaceRouter.get('/all',userMiddleware, async (req, res) => {  
    const spaces = await client.space.findMany({
        where: {
            creatorId: req.userId
        }
    })

    res.json({
        spaces: spaces.map((space) => ({
            id: space.id,
            name: space.name,
            thumbnail: space.thumbnail,
            dimensions: `${space.width}x${space.height}` 
        }))
    });
});

spaceRouter.post('/element',userMiddleware, async (req, res) => {                                                                          
    const parsedData = addElementSchema.safeParse(req.body);

    if(!parsedData.success){
        res.status(400).json({message: "Validation Failed"});
        return 
    }

    const space = await client.space.findUnique({
        where: {
            id: req.body.spaceId,
            creatorId: req.userId!
        },select: { 
            width: true,
            height: true
        }
    })

    if(!space){
        res.status(404).json({message: "Space not found"});
        return
    }

    await client.spaceElements.create({
        data: {
            spaceId: req.body.spaceId,
            elementId: req.body.elementId,
            x: req.body.x,
            y: req.body.y
        }
    })

    res.json({message: 'Element added'});
});

spaceRouter.delete('/element',userMiddleware,async (req, res) => {                                                                          
    const parsedData = deleteElementSchema.safeParse(req.body);

    if(!parsedData.success){
        res.status(400).json({message: "Validation Failed"});
        return 
    }

    const spaceElement = await client.spaceElements.findFirst({
        where: {
            id: parsedData.data.id
        },select: {
            space: true
        }
    })

    if(!spaceElement?.space.creatorId || spaceElement.space.creatorId !== req.userId){
        res.status(404).json({message: "Element not found"});
        return
    }

    await client.spaceElements.delete({
        where: {
            id: parsedData.data.id
        }
    })

    res.json({message: 'Element deleted'});
});

spaceRouter.get('/:spaceId',userMiddleware, async (req, res) => {                                                                         
    const space = await client.space.findUnique({
        where: {
            id: req.params.spaceId
        },
        include: {
            elements: {
                include: {
                    element: true
                }
            }
        }
    })

    if(!space){
        res.status(400).json({message: "Space not found"});
        return
    }

    res.json({
        dimensions: `${space.width}x${space.height}`,
        elements: space.elements.map((element) => ({
            id: element.id,
            element: {
                id: element.element.id,
                width: element.element.width,
                height: element.element.height,
                imageUrl: element.element.imageUrl,
                static: element.element.static
            },
            x: element.x,
            y: element.y
        }))
    });

});