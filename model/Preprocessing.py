"""Preprocessing script.

This script walks over the directories and dump the frames into a csv file
"""
import os
import csv
import sys
import random
import scipy
import numpy as np
import utilities as utl
Path_train = './train.csv'
Path_out = './'
def temp_process(temp):
    if(temp<=0):
        return -1
    else:
        return temp
def write_trim_and_label_csv(fname,out):
    with open(fname, newline='') as f:
        reader = csv.reader(f)
        with open(out+"test_label.csv",'w', newline='') as w:
            with open(out+"test.csv",'w',newline='') as wt:
                writer_t=csv.writer(wt,quoting=csv.QUOTE_NONE)
                writer=csv.writer(w,quoting=csv.QUOTE_NONE)
                for row in reader:
                    writer.writerow([float(row[1])/float(utl.sno_total_map[row[0]])])
                    writer_t.writerow([
                    float(row[0])/100,
                    float(row[2])/12,
                    float(row[3])/31,
                    float(row[4])/7,
                    utl.time_map_dict[row[5]]/287.0,
                    temp_process(float(row[6])),
                    utl.weather_map_int_dict[row[7]]/17.0,
                    int(row[8])
                    ])
if __name__ == "__main__":
    write_trim_and_label_csv(Path_train,Path_out)
