var fs = require('fs');
var mysql=require('mysql');
var moment= require('moment');
moment.defaultFormat='YYYY-MM-DD HH:mm:ss';
var dbsc = require('./secret');
dbsc['waitForConnections']=true;
var pool = mysql.createPool(dbsc);
var processArray = function(array){
	var arrayLength = array.length;
	var result = {};
	for (var i = 0; i < arrayLength; i++) {
		result[array[i].sno.toString()]={
			"temp":array[i].Temp,
			"weather":array[i].Weather,
			"avail":array[i].available
		};
	}
	return result;
};
setInterval(()=>{
	pool.getConnection((err,connection) => {
		if(err) console.log(err);
		else if(connection==undefined){
			console.log("connection==undefined");
		}
		else{
			connection.query('SELECT sno,Temp,Weather,available FROM CurrentWeather WHERE 1',function(err,rows){
				if(err) console.log(err);
				else if(rows!=undefined){
					fs.writeFile(__dirname+'/public/data/current.json', JSON.stringify(processArray(rows)),'utf8', (err) => {
						if (err) throw err;
						console.log('Current saved!  '+moment().format());
					});
				}
				else console.log('rows= undefined');
				connection.release();
			});
		}
	});
},300000);

