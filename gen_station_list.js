var fs = require('fs');
var mysql=require('mysql');
var moment= require('moment');
moment.defaultFormat='YYYY-MM-DD HH:mm:ss';
var connection = mysql.createConnection({
   host: '127.0.0.1',
   user: 'edison',
   password: 'youbike123',
   database: 'YouBike'
});
connection.connect();

query = "SELECT sno, sname, lat, lng FROM Station_Info WHERE 1";
connection.query(query,function(err,rows){
    if(err) console.log(err);
    else if(rows!=undefined){
        fs.writeFile('/public/data/station_info.json',JSON.stringify(rows),'utf-8',(err)=>{
            if(err) throw err;
            console.log('Station Info Is Saved!!'+moment().format());
        });
    }
    else console.log('rows = undefined');
    connection.release();
});