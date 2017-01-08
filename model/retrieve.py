#!/usr/bin/python3
from secret import dbinfo,rtquery
import pymysql
import csv

Path_out='./train.csv'

# Open database connection
db = pymysql.connect(dbinfo["host"],dbinfo["user"],dbinfo["password"],dbinfo["database"] )
cursor = db.cursor()
print(rtquery)
try:
    print("start executing query...")
    cursor.execute(rtquery)
    print("start fetching...")
    results = cursor.fetchall()
    with open(Path_out,'w') as f:
        csvW=csv.writer(f,quoting=csv.QUOTE_NONE)
        print("start generating csv")
        for row in results:
            csvW.writerow(row)
        print("CSV is generated")
except:
    print ("Error: unable to fecth data")
db.close()
