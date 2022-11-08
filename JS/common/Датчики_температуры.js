//создание экземпляров виртуальных датчиков температуры 
//(Если они уже присутствуют в проекте то дубли не создаются)

  CreateTemperSensor('Датичк температуры 1 (виртуальный)',  //наименование виртуального датчика 
                     'javascript.0.VirtualTempSensor1',    //идентификатор виртуального датчика (под которым создадим этот объект)
                     'javascript.0.Sensors.TempSensor_1'   //связанный физический датчик. тут указываем что то  типа 
                    )                                      // "mysensors.0.16.26_TEMP.V_TEMP", "zigbee.0.00158d000396afc3.xxx", те ссылку на любою переменную 

  CreateTemperSensor('Датичк температуры 2 (виртуальный)', 
                     'javascript.0.VirtualTempSensor2',   
                     'javascript.0.Sensors.TempSensor_2'  
                    )                                     

  CreateTemperSensor('Датичк температуры 3 (виртуальный)', 
                     'javascript.0.VirtualTempSensor3',   
                     'javascript.0.Sensors.TempSensor_3'  
                    )                                                         

  CreateTemperSensor('Датичк температуры 4 (виртуальный)', 
                     'javascript.0.VirtualTempSensor4',   
                     'javascript.0.Sensors.TempSensor_4'  
                    )                                     

  CreateTemperSensor('Датичк температуры 5 (виртуальный)', 
                     'javascript.0.VirtualTempSensor5',   
                     'javascript.0.Sensors.TempSensor_5'  
                    )                                     
