import z from "zod";

export const SignupSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
  type: z.enum(["user", "admin"]),
});

export const SigninSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
});

export const updateMetadataSchema = z.object({
  avatarId: z.string(),
});

export const createSpaceSchema = z.object({
  name: z.string(),
  dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
  mapId: z.string(),
});

export const deleteElementSchema = z.object({
  id: z.string(),
});

export const addElementSchema = z.object({
  spaceId: z.string(),
  x: z.number(),
  y: z.number(),
  elementId: z.string(),
});

export const createElementSchema = z.object({
  width: z.number(),
  height: z.number(),
  imageUrl: z.string(),
  static: z.boolean(),
});

export const updateElementSchema = z.object({
  imageUrl: z.string(),
});

export const createAvatarSchema = z.object({
  name: z.string(),
  imageUrl: z.string(),
});

export const createMapSchema = z.object({
  thumbnail: z.string(),
  dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
  name: z.string(),
  defaultElements: z.array(
    z.object({
      elementId: z.string(),
      x: z.number(),
      y: z.number(),
    })
  ),
});


declare global {
    namespace Express {
        interface Request {
            userId: string,
            user: {
                role: "Admin" | "User";
                userId: string;
            },
            role: "Admin" | "User";
        }
    }
}