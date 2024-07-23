const Database = require("better-sqlite3");

const dbusers = './databaseUsers.sqlite3';

const db = new Database("./chat.db", Database.OPEN_READWRITE,{ verbose: console.log });


const createTableSql = `
    CREATE TABLE IF NOT EXISTS chat (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        message TEXT NOT NULL,
        ip_address TEXT
    )`;

// Execute the SQL statement to create the table
db.exec(createTableSql);