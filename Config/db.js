const pg = require('pg');
var connection = "postgres://finch:finchtech@142.93.222.149:5432/localhost";
var db = new pg.Client(connection);
db.connect(err =>{
    if(err){
        console.log(err.message)
    }else{
        console.log("successfully connected to db");
    }
})

module.exports = db;