import { Hono } from "hono";
import blog from "./blog";
import user from "./user";

const mainrouter = new Hono()

mainrouter.route('/user',user)
mainrouter.route('/blog',blog)

export default mainrouter



