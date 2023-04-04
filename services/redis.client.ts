import { createClient } from 'redis';




class redisConect {

    constructor() { }

    async connectRedis() {
        const client = createClient();
        client.on('error', err => console.log('Redis Client Error', err));
        const clintCo = await client.connect();
        return client
    }

}



export default redisConect

