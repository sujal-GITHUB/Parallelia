import { Router } from "express";
import client from "@repo/db/client";
import { userMiddleware } from "../../middleware/user";
import { AddElementSchema, CreateElementSchema, CreateSpaceSchema, DeleteElementSchema, FindMapSchema, JoinSpaceSchema } from "../../types";
export const spaceRouter = Router();
import { Request, Response } from 'express';

spaceRouter.post("/", userMiddleware, async (req, res) => {
    const parsedData = CreateSpaceSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ message: "Validation failed" });
        return;
    }

    // Check if space name already exists
    const existingSpace = await client.space.findFirst({
        where: {
            name: parsedData.data.name,
        },
    });

    if (existingSpace) {
        res.status(400).json({ message: "Space name already exists" });
        return;
    }

    // If there is no mapName, create a space with dimensions
    if (!parsedData.data.mapName) {
        const space = await client.space.create({
            data: {
                name: parsedData.data.name,
                width: parseInt(parsedData.data.dimensions.split("x")[0]),
                height: parseInt(parsedData.data.dimensions.split("x")[1]),
                creatorId: req.userId!,
            },
        });
        res.json(space);  // Return the entire space object
        return;
    }

    // Look up the map by mapName instead of mapId
    const map = await client.map.findFirst({
        where: {
            name: parsedData.data.mapName, // Search by mapName
        },
        select: {
            mapElements: true,
            width: true,
            height: true,
        },
    });

    if (!map) {
        res.status(400).json({ message: "Map not found" });
        return;
    }

    // Create space with map elements if map exists
    let space = await client.$transaction(async () => {
        const space = await client.space.create({
            data: {
                name: parsedData.data.name,
                width: map.width,
                height: map.height,
                creatorId: req.userId!,
            },
        });

        // Create space elements if map has elements
        await client.spaceElements.createMany({
            data: map.mapElements.map((e) => ({
                spaceId: space.id,
                elementId: e.elementId,
                x: e.x!,
                y: e.y!,
            })),
        });

        return space;
    });

    console.log("Space Created");
    res.json(space);  // Return the entire space object
});

spaceRouter.post("/lookup", userMiddleware, async (req, res) => {
    const parsedData = JoinSpaceSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ message: "Validation failed" });
        return;
    }

    const spaceName = parsedData.data.name;
    const mapName = parsedData.data.mapName; // Expecting mapName instead of mapId

    if (!spaceName || typeof spaceName !== "string") {
        res.status(400).json({ message: "Space name is required" });
        return;
    }

    try {
        // Check if a space with the provided name already exists
        const existingSpace = await client.space.findFirst({
            where: {
                name: spaceName, // Use the space name from the request body
            },
            select: {
                id: true,        // Fetch the space ID
                width: true,     // Fetch the space width
                height: true,    // Fetch the space height
            },
        });

        // If no existing space is found, stop and return an error
        if (!existingSpace) {
            res.status(400).json({ message: "Space not found" });
            return;
        }

        let spaceWidth = existingSpace.width;
        let spaceHeight = existingSpace.height;

        // If mapName is provided, fetch the map details
        if (mapName) {
            const map = await client.map.findFirst({
                where: {
                    name: mapName, // Use the mapName from the request body
                },
                select: {
                    mapElements: true,
                    width: true,
                    height: true,
                },
            });

            // If no map is found, return an error
            if (!map) {
                res.status(400).json({ message: "Map not found" });
                return;
            }

            // Use map dimensions to create the space
            spaceWidth = map.width;
            spaceHeight = map.height;

            // Create the space with map elements
            const space = await client.space.create({
                data: {
                    name: spaceName,
                    width: spaceWidth,
                    height: spaceHeight,
                    creatorId: req.userId!, // Assuming the user is authenticated
                },
            });

            // Associate the map's elements with the newly created space
            await client.spaceElements.createMany({
                data: map.mapElements.map((e) => ({
                    spaceId: space.id,
                    elementId: e.elementId,
                    x: e.x!,
                    y: e.y!,
                })),
            });

            console.log("Space Created with map elements");
            res.json(space);  // Return the full space object
            return;  // Exit after sending response
        }

        // If no mapName is provided, just create the space using existing space dimensions
        const space = await client.space.create({
            data: {
                name: spaceName,
                width: spaceWidth,
                height: spaceHeight,
                creatorId: req.userId!, // Assuming the user is authenticated
            },
        });

        console.log("Space Created without map elements");
        res.json(space);  // Return the full space object

    } catch (error) {
        console.error("Error in space lookup:", error);
        res.status(500).json({ message: "An error occurred while creating the space" });
    }
});

spaceRouter.delete("/element", userMiddleware, async (req, res) => {
    const parsedData = DeleteElementSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Validation failed"})
        return
    }

    const spaceElement = await client.spaceElements.findFirst({
        where: {
            id: parsedData.data.id
        }, 
        include: {
            space: true
        }
    })

    if (!spaceElement?.space.creatorId || spaceElement.space.creatorId !== req.userId) {
        res.status(403).json({message: "Unauthorized"})
        return
    }
    await client.spaceElements.delete({
        where: {
            id: parsedData.data.id
        }
    })
    res.json({message: "Element deleted"})
})

spaceRouter.delete("/:spaceId", userMiddleware, async(req, res) => {
    const space = await client.space.findUnique({
        where: {
            id: req.params.spaceId
        }, select: {
            creatorId: true
        }
    })

    if (!space) {
        res.status(400).json({message: "Space not found"})
        return
    }

    if (space.creatorId !== req.userId) {
        res.status(403).json({message: "Unauthorized"})
        return
    }

    await client.space.delete({
        where: {
            id: req.params.spaceId
        }
    })
    res.json({message: "Space deleted"})
})

spaceRouter.get("/all", userMiddleware, async (req, res) => {
    const spaces = await client.space.findMany({
        where: {
            creatorId: req.userId!
        }
    });

    res.json({
        spaces: spaces.map(s => ({
            id: s.id,
            name: s.name,
            thumbnail: s.thumbnail,
            dimensions: `${s.width}x${s.height}`,
        }))
    })

    
})

spaceRouter.post("/element", userMiddleware, async (req, res) => {
    const parsedData = AddElementSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Validation failed"})
        return
    }
    
    const space = await client.space.findUnique({
        where: {
            id: req.body.spaceId,
            creatorId: req.userId!
        }, select: {
            width: true,
            height: true
        }
    })

    if(req.body.x < 0 || req.body.y < 0 || req.body.x > space?.width! || req.body.y > space?.height!) {
        res.status(400).json({message: "Point is outside of the boundary"})
        return
    }

    if (!space) {
        res.status(400).json({message: "Space not found"})
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

    res.json({message: "Element added"})
})

spaceRouter.get("/:spaceId",async (req, res) => {
    const space = await client.space.findUnique({
        where: {
            id: req.params.spaceId
        },
        include: {
            elements: {
                include: {
                    element: true
                }
            },
        }
    })

    if (!space) {
        res.status(400).json({message: "Space not found"})
        return
    }

    res.json({
        "dimensions": `${space.width}x${space.height}`,
        elements: space.elements.map(e => ({
            id: e.id,
            element: {
                id: e.element.id,
                imageUrl: e.element.imageUrl,
                width: e.element.width,
                height: e.element.height,
                static: e.element.static
            },
            x: e.x,
            y: e.y
        })),
    })
})