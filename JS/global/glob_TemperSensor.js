//Пример виртуального датчика отображения значения сенсора(например температуры), с контролем на
// определенные в нем две уставки "Предупредительная", "Аварийная". По текущему значению тепературы и значениям этих уставкок 
// вычисляется статус:  "Значение в норме", "Значение выше предупредительной уставки", "Значение выше аварийной уставки".
// Данный статус можно использовать в Vis для изменения стиля отображения, например изменение цвета заливки
// белый/желтый/красный.

//Виртуальный датчик создает следующие DataPoint(внутренние переменный):
// .Name - наименование, чтобы его можно было получить в Vis
// .Value - Значение температры, полученное от связанного физического датчика (задается в "link_Value")
// .Limit1 - уставка предупредительная 
// .Limit2 - уставка аварийная
// .Status - числовой статус датчика , вычисляется от value  при сравнении на Limit1 и Limit2.
//     =0 - значение < предупр уставки
//     =1 - значение >= прупред уставки
//     =2 - значение > аварийной уставки
// При использовании числового статуса в VIS нужно будет указать какой цвет заливки какому коду статуса соответсвует
//
//
// .StatusColor - альтернаривныей статус датчика сразу возвращающий цвет заливки. Это решение может буть более удобно,
//      тк если потребуется изменить цвет, нужно будет поменять только JS код, а в VIS изменения не потребуются.   
// .checkLimits - признак проверки уставок. В примере визуализации данный режим отображается голубой рамкой. вкл/отключение через
//                свайп вверх/вниз на зачении

//подробная справа 
//  по Vis: https://github.com/iobroker/iobroker.vis/blob/master/README.md
//  по скриптам JS:https://github.com/ioBroker/ioBroker.javascript/blob/master/docs/en/javascript.md

class TemperSensorDemo{
constructor(DevName,
            DevID,
            link_Value
            )
{
this.DevID=DevID;           
this.link_Value=link_Value; //

//создание датчика. Если в базе уже есть данные переменные,повторно они созданы не будут      
createState(DevID+'.Name', DevName, {name: DevName,  type: "string"}) //https://www.iobroker.net/#en/documentation/dev/objectsschema.md  ("Channel descriptions")
createState(DevID+'.Value',  0, {name: 'Значение датчика'});
createState(DevID+'.Status', 0, {name: 'Статус как числовой код'});
createState(DevID+'.StatusColor', 'white', {name: 'Статус как цвет',  type: "string"});
createState(DevID+'.Limit1', 70, {name: 'Уставка предупредительная'});
createState(DevID+'.Limit2', 90, {name: 'Уставка аварийная'}); 
createState(DevID+'.checkLimits', true, {name: 'Контроль уставок', type:"boolean"});//по умолчанию включ 

//Эти переменные созданы просто для тестирования визуалки в VIS 
//(изменять значения можно через окно "объекты")   
createState(DevID+'.testSign', 0, {name: 'Тестирование сигналов', type:"number"}); //При =1 отображ одна сигнальная иконка, =2 вторая иконка
createState(DevID+'.testVisible', 1, {name: 'Тестирование видимости', type:"number"}); //эта переменная связана с видимостью  виджета, отображающего значение (MS_SensorT.w00004)
                                                                                       //видим при  .testVisible < 10

//Перезаписываем значение если вызов скрипта повторно и нужно переназначить значение
setState(this.DevID+'.Name', DevName)

//регистрация обработчика изменения значения физического датчика 
let func=this.onValueChanged.bind(this);                  //через bind чтобы внутри обработчика было доступно "this"
on({id: this.link_Value}, function (obj) { func(obj); });

//регистрация обработчика изменения уставок виртуального датчика 
let func2=this.onLimitChanged.bind(this);
on({id: DevID+'.Limit1'}, function (obj) { func2(obj); });
on({id: DevID+'.Limit2'}, function (obj) { func2(obj); });

//регистрация обработчика флага "контроль уставок"
let func3=this.onCheckLimitChanged.bind(this);
on({id: DevID+'.checkLimits'}, function (obj) { func3(obj); });
}//constructor

//**************************************************************/
// Обработчик измения значения связаного физического датчика
//**************************************************************/
onValueChanged(obj) {
 let state=obj.state.val;
 setState(this.DevID+'.Value', state); //копируем значение в локальную переменную (DataPoint) виртуального датчика 
 this.calcStatus(); //пересчет статуса
}

//**************************************************************/
// Обработчик измения значения уставок виртуального датчика
//**************************************************************/
onLimitChanged(obj) {
 console.log('onLimitChanged='+obj.state.val);
 this.calcStatus(); //пересчет статуса
}

//**************************************************************/
// Обработчик измения значеия флага "контроль уставок"
//**************************************************************/
onCheckLimitChanged(obj) {
 console.log('onCheckLimitChanged='+obj.state.val);
 this.calcStatus(); //пересчет статуса
}

//**************************************************************/
//метод пересчета сатуса
//**************************************************************/
calcStatus(){
 let value=getState(this.DevID+'.Value').val;
 let limit1=getState(this.DevID+'.Limit1').val;
 let limit2=getState(this.DevID+'.Limit2').val;
 let checkLimits=getState(this.DevID+'.checkLimits').val;

 console.log('calcStatus Value='+value+' Limits:['+limit1+';'+limit2+']   checkLimits='+checkLimits+ ' ['+typeof checkLimits +']');

 if ((!checkLimits) || //без проверки 
     (checkLimits==0) ||
     (checkLimits=='false') 
    )
 {
    setState(this.DevID+'.Status', 0);
    setState(this.DevID+'.StatusColor', 'white');
    console.log('A1');
 }
 else
 if(value>=limit2) 
 {
    setState(this.DevID+'.Status', 2);
    setState(this.DevID+'.StatusColor', 'red');
    console.log('A2');
 }
 else 
 if(value>=limit1)
 {
    setState(this.DevID+'.Status', 1);
    setState(this.DevID+'.StatusColor', 'yellow');
 }
 else 
 {
    setState(this.DevID+'.Status', 0);
    setState(this.DevID+'.StatusColor', 'white');
 }
}
//**************************************************************/
}//class


/************************************************************************/
//Метод создания экземпляра виртуального датчика
/************************************************************************/
function  CreateTemperSensor(DevName,
                             DevID,
                             linkDD_Value)
{
  return new TemperSensorDemo(DevName,
                              DevID,
                              linkDD_Value);
};

