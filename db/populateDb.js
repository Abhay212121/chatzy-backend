require('dotenv').config()
const { Client } = require('pg')

const createUserSQL = `
DROP TABLE users;
 CREATE TABLE IF NOT EXISTS users(
    user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_name VARCHAR (255),
    user_nickname VARCHAR (255),
    user_mail VARCHAR (255),
    user_password VARCHAR (255)
 )
`

const createMessagesSQL = `
    CREATE TABLE IF NOT EXISTS messages(
        message_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        message_from VARCHAR (255),
        message_text TEXT,
        message_time VARCHAR (255),
        message_group INTEGER
    )
`

const createGroupsSQL = `
        CREATE TABLE IF NOT EXISTS groups(
            group_id INTEGER  PRIMARY KEY,
            group_name VARCHAR (100)
        )
`

async function main() {
    console.log('sending...')
    const client = new Client({
        connectionString: process.env.CONNECTION_STRING
    })
    await client.connect()
    await client.query(createUserSQL)
    await client.end()
    console.log('Done!')
}

main()