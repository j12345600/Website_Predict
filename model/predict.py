import csv
import numpy as np
import mxnet as mx
import logging
from utilities import sno_total_map,get_current_weather,time_map_dict
import datetime

def predict(fname,base_time,test_iter):
    base_path = "../public/data/station_predict/"
    batch_size = 2000
    shape = 8
    prefix = "mymodel"
    # testIt=mx.io.CSVIter(
    #             data_csv="test.csv",
    #             data_shape=(shape),
    #             batch_size=batch_size,
    #             label_csv='test_label.csv',
    #             name='softmax')
    model_loaded = mx.model.FeedForward.load(prefix, 5)
    [prob, data, label]=model_loaded.predict(
                X=test_iter,
                num_batch=None,
                return_data=True)
    with open(base_path+fname+".json",'w') as f:
        f.write("{\"data\":[")
        for i in range(len(prob)):
            if i > 0:
                f.write(",%d"%(prob[i][0]*sno_total_map[str(int(data[i][0]*100+0.1))]))
            else:
                f.write("%d"%(prob[i][0]*sno_total_map[str(int(data[i][0]*100+0.1))]))
        f.write("]}")
def gen_prediction():
    batch_size=12*24
    current_weather = get_current_weather()
    now = datetime.datetime.now()
    minute_one_digit =  now.minute%10
    offset=0
    if minute_one_digit < 4:
        offset=abs(minute_one_digit - 9+10)
    elif minute_one_digit >4 and minute_one_digit < 9:
        offset = (minute_one_digit - 4)
    important_time = now - datetime.timedelta(minutes = offset)
    for station_id in current_weather:
        temp_list = []
        for i in range(0,batch_size):
            temp_time = important_time + datetime.timedelta(minutes = i*5)
            try:
                temp_list.append([
                                float(station_id)/100,
                                float(temp_time.month)/12,
                                float(temp_time.day)/31,
                                float(temp_time.timetuple()[6]+1)/7,
                                time_map_dict[temp_time.strftime("%H:%M")]/287.0,
                                current_weather[station_id]["t"],
                                current_weather[station_id]["w"]/17.0,
                                1])
            except:
                print ("current_weather error")
        predict(station_id,important_time,mx.io.NDArrayIter(np.array(temp_list,dtype=float), label=None, batch_size=batch_size, shuffle=False, last_batch_handle='pad', label_name='softmax_label'))
gen_prediction()
