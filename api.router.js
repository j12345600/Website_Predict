var express = require('express');
var router = express.Router();

// define the home page route
router.get('/station_info', function(req, res) {
  res.setHeader('content-type', 'application/json');
  res.sendFile(__dirname+'/public/data/station_info.json');
});
router.get('/station',function(req,res){
    res.send(req.query.id);
});

module.exports = router;
