var request = require('request');
var mysql = require('mysql');
var fs = require('fs');
var zlib = require('zlib');
var dataInJson;
var dbsc = require('./secret');
var connection = mysql.createConnection(dbsc);
connection.connect();
var basicURL = 'http://api.wunderground.com/api/';
var secondPURL = '/conditions/q/pws:';
var Jap = '.json';
//var sampleURL='http://api.wunderground.com/api/70f81464831465e8/conditions/lang:TW/q/pws:IDAANDIS7.json';
var keySet = ["70f81464831465e8", "3a98365f23eb0c68", "4925937049f4effd"];
keyNum = 0;
var locID = {
    "INEIHUDI14": "Neihu Dist.",
    "IDATONGD2": "Zhongshan Dist.",
    "IZHONGSH10": "Songshan Dist.",
    "IZHONGZH4": "Zhongzheng Dist.",
    "IWANHUAD5": "Wanhua Dist.",
    "IXINYIDI10": "Xinyi Dist.",
    "ISHILIND2": "Datong Dist.",
    "ISHILIND7": "Shilin Dist.",
    "ITAMSUID8": "Beitou Dist.",
    "INANGANG3": "Nangang Dist.",
    "I1236": "Daan Dist.",
    "IWENSHAN6": "Wenshan Dist."
}
var locfTemp = {
    "Neihu Dist.": 0,
    "Zhongshan Dist.": 0,
    "Songshan Dist.": 0,
    "Zhongzheng Dist.": 0,
    "Wanhua Dist.": 0,
    "Xinyi Dist.": 0,
    "Datong Dist.": 0,
    "Shilin Dist.": 0,
    "Beitou Dist.": 0,
    "Nangang Dist.": 0,
    "Daan Dist.": 0,
    "Wenshan Dist.": 0
}
var locTemp = {
    "Neihu Dist.": 0,
    "Zhongshan Dist.": 0,
    "Songshan Dist.": 0,
    "Zhongzheng Dist.": 0,
    "Wanhua Dist.": 0,
    "Xinyi Dist.": 0,
    "Datong Dist.": 0,
    "Shilin Dist.": 0,
    "Beitou Dist.": 0,
    "Nangang Dist.": 0,
    "Daan Dist.": 0,
    "Wenshan Dist.": 0
}
var locCond = {
    "Neihu Dist.": "",
    "Zhongshan Dist.": "",
    "Songshan Dist.": "",
    "Zhongzheng Dist.": "",
    "Wanhua Dist.": "",
    "Xinyi Dist.": "",
    "Datong Dist.": "",
    "Shilin Dist.": "",
    "Beitou Dist.": "",
    "Nangang Dist.": "",
    "Daan Dist.": "",
    "Wenshan Dist.": ""
}

function refresh() {
    for (var id in locID) {
        var name = locID[id];
        request((basicURL + keySet[keyNum] + secondPURL + id + Jap), function(error, response, body) {
            if (!error && response.statusCode == 200) {
                parsed = JSON.parse(body);
                if (parsed["current_observation"] == undefined) {
                    console.log("[Error undefined]");
                } else {
                    //console.log(parsed["current_observation"]);
                    if (parsed["current_observation"]["station_id"] != undefined)
                        id = parsed["current_observation"]["station_id"];
                    else id = "undefined";
                    locname = locID[id];
                    if (parsed["current_observation"]["temp_c"] != undefined)
                        temp = parseFloat(parsed["current_observation"]["temp_c"]);
                    else temp = "undefined";
                    if (parsed["current_observation"]["weather"] != undefined)
                        weather = parsed["current_observation"]["weather"];
                    else weather = "undefined";
                    if (parsed["current_observation"]["feelslike_c"] != undefined)
                        FeelsTemp = parseFloat(parsed["current_observation"]["feelslike_c"]);
                    else FeelsTemp = "undefined";

                    locTemp[locname] = temp;
                    locfTemp[locname] = FeelsTemp;
                    locCond[locname] = weather;
                }
            }
        });
        if (keyNum < 2) {
            keyNum++;
        } else {
            keyNum = 0;
        }
    }
}

refresh();

setInterval(function() {
    refresh();
    today = new Date();
    console.log("[update weather] " + parseInt(today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds());
}, 690000);


function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

function toDate(date) {
    year = date.substr(0, 4);
    month = date.substr(4, 2);
    day = date.substr(6, 2);
    hour = date.substr(8, 2);
    min = date.substr(10, 2);
    sec = date.substr(12, 2);
    return (year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec);
}

function querry(indice) {
    newSi = zeroPad(indice, 4);
    data = {
        sno: indice,
        sname: dataInJson["retVal"][newSi]['sna'],
        available: parseInt(dataInJson["retVal"][newSi]['sbi']),
        empty: parseInt(dataInJson["retVal"][newSi]['bemp']),
        lastUpdate: toDate(dataInJson["retVal"][newSi]['mday']),
        sStatus: parseInt(dataInJson["retVal"][newSi]['act']),
        Temp: locTemp[dataInJson["retVal"][newSi]['sareaen']],
        Weather: locCond[dataInJson["retVal"][newSi]['sareaen']],
        FeelsTemp: locfTemp[dataInJson["retVal"][newSi]['sareaen']]
    };
    connection.query('INSERT IGNORE INTO Station_log SET ?', data, function(err, result) {
        if (err) {
            console.log(err);
        }
    });
    connection.query('UPDATE CurrentWeather SET available=?,Temp=?, Weather=?, FeelsTemp=?,sStatus=?,lastUpdate=? WHERE sno=? ', [
        parseInt(dataInJson["retVal"][newSi]['sbi']),
        locTemp[dataInJson["retVal"][newSi]['sareaen']],
        locCond[dataInJson["retVal"][newSi]['sareaen']],
        locfTemp[dataInJson["retVal"][newSi]['sareaen']],
        parseInt(dataInJson["retVal"][newSi]['act']),
        toDate(dataInJson["retVal"][newSi]['mday']), indice
    ], function(err, result) {
        if (err) {
            console.log(err);
        }
    });
}
url1 = 'http://data.taipei/youbike';
setInterval(function() {
    request(url1, {
        encoding: null
    }, function(error, response, body) {
        if (response == undefined || body == undefined) {
            today = new Date();
            console.log("[response undefined!] " + parseInt(today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds());
        } else if (response.headers['content-encoding'] == 'gzip') {
            today = new Date();
            console.log("update database " + parseInt(today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds());
            zlib.gunzip(body, function(err, dezipped) {
                if (dezipped == undefined) {
                    console.log('dezipped=undefined!');
                } else {
                    dataInJson = JSON.parse(dezipped.toString());
                    for (var i = 1; i < 320; i++) {
                        Si = zeroPad(i, 4);
                        if (dataInJson["retVal"][Si] == undefined) continue;
                        querry(i);
                    }
                }
            });
        }
    });
}, 60000);
