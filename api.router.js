var express = require('express');
var router = express.Router();
var mysql = require('promise-mysql');
var dbsc = require('./secret');
var fs = require('fs');
var moment = require('moment');
// define the home page route
router.get('/status', function(req, res) {
  res.setHeader('content-type', 'application/json');
  res.sendFile(__dirname+'/public/data/current.json');
});
router.get('/get_info',function(req,res){
    var id=parseInt(req.query.location_id);
    if (id >=0 && id<= 2000){
      var result={
        'station_info':{},
        'current':{},
      };
      mysql.createConnection(dbsc)
      .then(function(conn){
          connection = conn;
          return connection.query(`SELECT si.addr, si.total,cw.available,
            cw.Temp, cw.Weather FROM Station_Info si,CurrentWeather cw WHERE si.sno = cw.sno AND si.sno =` + id.toString());
      }).then((rows)=>{
          if(rows!=undefined&&rows[0]!=undefined){
            // console.log(rows);
            result.station_info['addr']=rows[0].addr;
            result.station_info['total']=parseInt(rows[0].total);
            result.current['count']=parseInt(rows[0].available);
            result.current['temp']=parseInt(rows[0].Temp);
            result.current['status']=rows[0].Weather;
            result.predict_info = JSON.parse(fs.readFileSync('./public/data/station_predict/'+id.toString()+'.json', 'utf8')).data;
            result.time_now = moment().add(8, 'h').format('YYYY-MM-DD HH:mm:ss');
            res.setHeader('content-type','application/json');
            res.send(JSON.stringify(result));
          }
          else{
            res.send("id "+req.query.location_id+" not found");
          }
      });
    }
    else{
      res.send("Invalid id "+req.query.location_id);
    }
});

module.exports = router;
