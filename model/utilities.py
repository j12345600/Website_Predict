import csv
import numpy as np
from random import shuffle
import os
from secret import dbinfo
import pymysql

def csv2ndary(fname):
    with open(fname,newline="") as f:
        reader = csv.reader(f)
        return np.array(list(reader),dtype=float)
def csv2list(fname):
    with open(fname,newline="") as f:
        reader = csv.reader(f)
        return list(reader)
def csv_shape(fname):
    npary = csv2ndary(fname)
    return npary.shape
def get_total(fname):
    with open(fname,newline="") as f:
        reader = csv.reader(f)
        for row in reader:
            return int(row[0])+int(row[1])
def shuffle_csv2list(fname):
    list_train = csv2list(fname)
    shuffle(list_train)
    return list_train
def shuffle_csv(fname, out):
    csvlist=shuffle_csv2list(fname)
    with open(out, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(csvlist)
def mkdir(fname):
   try:
       os.mkdir(fname)
   except:
       pass
def temp_process(temp):
    if(temp<=0):
        return -1
    else:
        return temp
def get_current_weather():
    query="SELECT sno,Temp,Weather FROM CurrentWeather WHERE 1"
    db = pymysql.connect(dbinfo["host"],dbinfo["user"],dbinfo["password"],dbinfo["database"] )
    cursor = db.cursor()
    results = {}
    try:
        cursor.execute(query)
        rows = cursor.fetchall()
        for row in rows:
            results[str(row[0])]={"t":temp_process(row[1]),"w":weather_map_int_dict[row[2]]}
    except:
        print ("Error: unable to fecth data")
    db.close()
    return results
weather_map_int_dict = {
        "NULL"                          :0,
        ""                              :0,
        "Clear"                         :1,
        "Heavy Rain"                    :2,
        "Heavy Rain Showers"            :2,
        "Heavy Thunderstorms and Rain"  :3,
        "Light Drizzle"                 :4,
        "Light Rain"                    :5,
        "Light Rain Showers"            :6,
        "Light Thunderstorms and Rain"  :7,
        "Mostly Cloudy"                 :8,
        "Overcast"                      :9,
        "Partly Cloudy"                 :10,
        "Rain"                          :11,
        "Rain Showers"                  :12,
        "Scattered Clouds"              :13,
        "Thunderstorm"                  :14,
        "Thunderstorms and Rain"        :15,
        "Fog"                           :16,
        "Haze"                          :17
        }
sno_total_map={
"1":180,
"2":48,
"3":40,
"4":60,
"5":60,
"6":80,
"7":80,
"8":60,
"9":40,
"10":54,
"11":66,
"12":34,
"13":66,
"14":32,
"15":60,
"16":48,
"17":34,
"18":38,
"19":30,
"20":70,
"21":66,
"22":44,
"23":32,
"24":46,
"25":30,
"26":42,
"27":50,
"28":36,
"29":54,
"30":74,
"31":30,
"32":30,
"33":46,
"34":32,
"35":30,
"36":72,
"37":46,
"38":34,
"39":26,
"40":34,
"41":30,
"42":38,
"43":36,
"44":36,
"45":30,
"46":44,
"47":40,
"48":38,
"49":52,
"50":52,
"51":44,
"52":30,
"53":26,
"54":30,
"55":46,
"56":42,
"57":46,
"58":48,
"59":32,
"60":30,
"61":46,
"62":34,
"63":36,
"64":50,
"65":38,
"66":42,
"67":48,
"68":36,
"69":34,
"70":52,
"71":30,
"72":42,
"73":32,
"74":40,
"75":30,
"76":36,
"77":32,
"78":52,
"79":50,
"80":44,
"81":40,
"82":60,
"83":74,
"84":38,
"85":46,
"86":46,
"87":58,
"88":58,
"89":44,
"90":44,
"91":36,
"92":42,
"93":56,
"94":52,
"95":32,
"96":30,
"97":52,
"98":42,
"99":42,
"100":40,
"101":50,
"102":32,
"103":52,
"104":38,
"105":42,
"106":44,
"107":54,
"108":32,
"109":36,
"110":44,
"111":54,
"112":48,
"113":38,
"114":30,
"115":68,
"116":44,
"117":58,
"118":36,
"119":56,
"120":46,
"121":66,
"122":50,
"123":44,
"124":36,
"125":30,
"126":30,
"127":40,
"128":36,
"129":50,
"130":26,
"131":34,
"132":88,
"133":40,
"134":64,
"135":54,
"136":30,
"137":46,
"138":30,
"139":30,
"140":46,
"141":36,
"142":52,
"143":72,
"144":70,
"145":40,
"146":46,
"147":32,
"148":68,
"149":62,
"150":38,
"151":34,
"152":40,
"153":40,
"154":38,
"155":30,
"156":38,
"157":42,
"158":48,
"159":36,
"160":30,
"161":56,
"162":70,
"163":72,
"164":56,
"165":62,
"166":34,
"167":50,
"168":44,
"169":44,
"170":50,
"171":38,
"172":24,
"173":56,
"174":52,
"175":52,
"176":98,
"177":40,
"178":32,
"179":52,
"180":40,
"181":52,
"182":50,
"183":38,
"184":42,
"185":30,
"186":82,
"187":34,
"188":60,
"189":38,
"190":52,
"191":58,
"192":44,
"193":36,
"194":50,
"195":50,
"196":24,
"201":44,
"202":60,
"203":40,
"204":42,
"205":28,
"206":32,
"207":30,
"208":46,
"209":42,
"210":60,
"211":40,
"212":50,
"213":30,
"214":54,
"215":62,
"216":50,
"217":40,
"218":42,
"219":38,
"220":38,
"221":40,
"222":30,
"223":40,
"224":40,
"225":40,
"226":32,
"227":40,
"228":32,
"229":34,
"230":36,
"231":40,
"232":44,
"233":50,
"234":38,
"235":30,
"236":36,
"237":38,
"238":32,
"239":48,
"240":58,
"241":38,
"242":40,
"243":30,
"244":46,
"245":48,
"246":40,
"247":34,
"248":32,
"249":32,
"250":38,
"251":42,
"252":42,
"253":34,
"254":34,
"255":30,
"256":40,
"257":34,
"258":40,
"259":36,
"260":36,
"261":44,
"262":28,
"263":38,
"264":28,
"266":34,
"267":38,
"268":30,
"269":30,
"270":34,
"272":32,
"273":38,
"274":34,
"275":58,
"276":38,
"277":32,
"278":32,
"279":48,
"280":28,
"281":32,
"282":30,
"283":32,
"284":44,
"285":40,
"289":38,
"291":50,
"293":40,
"295":26,
"296":32,
"297":26,
"298":32,
"299":32,
"300":28,
"301":28,
"307":30,
}
time_map_dict = {
        "00:04":0,
        "00:09":1,
        "00:14":2,
        "00:19":3,
        "00:24":4,
        "00:29":5,
        "00:34":6,
        "00:39":7,
        "00:44":8,
        "00:49":9,
        "00:54":10,
        "00:59":11,
        "01:04":12,
        "01:09":13,
        "01:14":14,
        "01:19":15,
        "01:24":16,
        "01:29":17,
        "01:34":18,
        "01:39":19,
        "01:44":20,
        "01:49":21,
        "01:54":22,
        "01:59":23,
        "02:04":24,
        "02:09":25,
        "02:14":26,
        "02:19":27,
        "02:24":28,
        "02:29":29,
        "02:34":30,
        "02:39":31,
        "02:44":32,
        "02:49":33,
        "02:54":34,
        "02:59":35,
        "03:04":36,
        "03:09":37,
        "03:14":38,
        "03:19":39,
        "03:24":40,
        "03:29":41,
        "03:34":42,
        "03:39":43,
        "03:44":44,
        "03:49":45,
        "03:54":46,
        "03:59":47,
        "04:04":48,
        "04:09":49,
        "04:14":50,
        "04:19":51,
        "04:24":52,
        "04:29":53,
        "04:34":54,
        "04:39":55,
        "04:44":56,
        "04:49":57,
        "04:54":58,
        "04:59":59,
        "05:04":60,
        "05:09":61,
        "05:14":62,
        "05:19":63,
        "05:24":64,
        "05:29":65,
        "05:34":66,
        "05:39":67,
        "05:44":68,
        "05:49":69,
        "05:54":70,
        "05:59":71,
        "06:04":72,
        "06:09":73,
        "06:14":74,
        "06:19":75,
        "06:24":76,
        "06:29":77,
        "06:34":78,
        "06:39":79,
        "06:44":80,
        "06:49":81,
        "06:54":82,
        "06:59":83,
        "07:04":84,
        "07:09":85,
        "07:14":86,
        "07:19":87,
        "07:24":88,
        "07:29":89,
        "07:34":90,
        "07:39":91,
        "07:44":92,
        "07:49":93,
        "07:54":94,
        "07:59":95,
        "08:04":96,
        "08:09":97,
        "08:14":98,
        "08:19":99,
        "08:24":100,
        "08:29":101,
        "08:34":102,
        "08:39":103,
        "08:44":104,
        "08:49":105,
        "08:54":106,
        "08:59":107,
        "09:04":108,
        "09:09":109,
        "09:14":110,
        "09:19":111,
        "09:24":112,
        "09:29":113,
        "09:34":114,
        "09:39":115,
        "09:44":116,
        "09:49":117,
        "09:54":118,
        "09:59":119,
        "10:04":120,
        "10:09":121,
        "10:14":122,
        "10:19":123,
        "10:24":124,
        "10:29":125,
        "10:34":126,
        "10:39":127,
        "10:44":128,
        "10:49":129,
        "10:54":130,
        "10:59":131,
        "11:04":132,
        "11:09":133,
        "11:14":134,
        "11:19":135,
        "11:24":136,
        "11:29":137,
        "11:34":138,
        "11:39":139,
        "11:44":140,
        "11:49":141,
        "11:54":142,
        "11:59":143,
        "12:04":144,
        "12:09":145,
        "12:14":146,
        "12:19":147,
        "12:24":148,
        "12:29":149,
        "12:34":150,
        "12:39":151,
        "12:44":152,
        "12:49":153,
        "12:54":154,
        "12:59":155,
        "13:04":156,
        "13:09":157,
        "13:14":158,
        "13:19":159,
        "13:24":160,
        "13:29":161,
        "13:34":162,
        "13:39":163,
        "13:44":164,
        "13:49":165,
        "13:54":166,
        "13:59":167,
        "14:04":168,
        "14:09":169,
        "14:14":170,
        "14:19":171,
        "14:24":172,
        "14:29":173,
        "14:34":174,
        "14:39":175,
        "14:44":176,
        "14:49":177,
        "14:54":178,
        "14:59":179,
        "15:04":180,
        "15:09":181,
        "15:14":182,
        "15:19":183,
        "15:24":184,
        "15:29":185,
        "15:34":186,
        "15:39":187,
        "15:44":188,
        "15:49":189,
        "15:54":190,
        "15:59":191,
        "16:04":192,
        "16:09":193,
        "16:14":194,
        "16:19":195,
        "16:24":196,
        "16:29":197,
        "16:34":198,
        "16:39":199,
        "16:44":200,
        "16:49":201,
        "16:54":202,
        "16:59":203,
        "17:04":204,
        "17:09":205,
        "17:14":206,
        "17:19":207,
        "17:24":208,
        "17:29":209,
        "17:34":210,
        "17:39":211,
        "17:44":212,
        "17:49":213,
        "17:54":214,
        "17:59":215,
        "18:04":216,
        "18:09":217,
        "18:14":218,
        "18:19":219,
        "18:24":220,
        "18:29":221,
        "18:34":222,
        "18:39":223,
        "18:44":224,
        "18:49":225,
        "18:54":226,
        "18:59":227,
        "19:04":228,
        "19:09":229,
        "19:14":230,
        "19:19":231,
        "19:24":232,
        "19:29":233,
        "19:34":234,
        "19:39":235,
        "19:44":236,
        "19:49":237,
        "19:54":238,
        "19:59":239,
        "20:04":240,
        "20:09":241,
        "20:14":242,
        "20:19":243,
        "20:24":244,
        "20:29":245,
        "20:34":246,
        "20:39":247,
        "20:44":248,
        "20:49":249,
        "20:54":250,
        "20:59":251,
        "21:04":252,
        "21:09":253,
        "21:14":254,
        "21:19":255,
        "21:24":256,
        "21:29":257,
        "21:34":258,
        "21:39":259,
        "21:44":260,
        "21:49":261,
        "21:54":262,
        "21:59":263,
        "22:04":264,
        "22:09":265,
        "22:14":266,
        "22:19":267,
        "22:24":268,
        "22:29":269,
        "22:34":270,
        "22:39":271,
        "22:44":272,
        "22:49":273,
        "22:54":274,
        "22:59":275,
        "23:04":276,
        "23:09":277,
        "23:14":278,
        "23:19":279,
        "23:24":280,
        "23:29":281,
        "23:34":282,
        "23:39":283,
        "23:44":284,
        "23:49":285,
        "23:54":286,
        "23:59":287
        }