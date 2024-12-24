import { Hono } from "hono";
import {PrismaClient} from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign, verify} from 'hono/jwt'
const blog = new Hono<{
  Bindings: {
    DATABASE_URL: string
  }
}>();

blog.use('/api/v1/blog/*', async (c, next)=>{
  
  const header = c.req.header("authorization")||"";
  const token = header.split(" ")[1]
  //@ts-ignore
  const response = await verify(token, c.env.JWT_SECRET);

  if(response.id){
    next()
  }else{
    c.status(403)
    return c.json({error:"unauthorized"})
  }
})

blog.post('/',(c)=>{
  return c.text('post blog')
})

blog.put('/',(c)=>{
  return c.text('put blog')
})

blog.get('/:id',(c)=>{
  return c.text('get blog')
})


export default blog