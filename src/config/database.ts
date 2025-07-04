export default {
     host: process.env.DB_HOST,
     port: process.env.DB_PORT ? Number( process.env.DB_PORT) : 3306,
     database: process.env.DB_DATABASE,
     user: process.env.DB_USERNAME,
     password: process.env.DB_PASSWORD,
}