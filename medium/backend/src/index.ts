import { Hono } from 'hono'
import mainrouter from './routes'

const app = new Hono()



app.route('/api/v1', mainrouter);

export default app
