import { Pool } from "pg";

export default class DbService {
    
    private readonly pool: Pool;

    constructor(connectionString: string) { 
        this.pool = new Pool({ connectionString: connectionString });
    }

    async query(sql: string, params: any[] = []): Promise<any> {

        let client;

        try {
            client = await this.pool.connect(); 
            const result = await client.query(sql, params);
            return result;
        }  
        catch (err) {
            console.log(err);
        }
        finally {
            if (client) {
                client.release();
            }
        } 
    }
}