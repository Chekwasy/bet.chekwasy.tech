const { MongoClient } = require('mongodb');


const uri = 'mongodb://localhost:27017/mydatabase';
const dbName = 'mydatabase';


MongoClient.connect(uri, { useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.error('Failed to connect to the database', err);
        return;
    }
    
    console.log('Connected to the database');
    
    const db = client.db(dbName);
    
    // Perform database operations here
    
    client.close();
});
