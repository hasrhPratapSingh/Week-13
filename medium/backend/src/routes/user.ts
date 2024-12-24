import { Hono } from "hono";
import {PrismaClient} from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign} from 'hono/jwt'
const user = new Hono<{
  Bindings: {
    DATABASE_URL: string
  }
}>();


user.post('/signup',async (c)=>{
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json();

  const user = await prisma.user.create({
    data:{
      email: body.email,
      password: body.password
    }
  })
  //@ts-ignore
  const token = await sign({id: user.id},c.env.JWT_SECRET)

  return c.json({
    jwt:token
  })
})

user.post('/signin',async (c)=>{
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body  = await c.req.json();
  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
      password: body.password
    }
  });

  if(!user) {
    c.status(403);
    return c.json({error: "user not found"});
  }
  //@ts-ignore
  const jwt = await sign({ id:user.id}, c.env.JWT_SECRET)
  return c.text(jwt)
})



export default user