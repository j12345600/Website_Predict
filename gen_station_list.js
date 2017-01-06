var fs = require('fs');
var mysql=require('mysql');
var moment= require('moment');
moment.defaultFormat='YYYY-MM-DD HH:mm:ss';
var dbsc = require('./secret');
var connection = mysql.createConnection(dbsc);
connection.connect();

query = "SELECT sno, sname, lat, lng FROM Station_Info WHERE 1";
connection.query(query,function(err,rows){
    if(err) console.log(err);
    else if(rows!=undefined){
        fs.writeFile(__dirname+'/public/data/station_info.json',JSON.stringify(rows),'utf-8',(err)=>{
            if(err) throw err;
            console.log('Station Info Is Saved!!'+moment().format());
        });
    }
    else console.log('rows = undefined');
});
connection.end();
