var CSS = {
    "72-1": {
      "TITLE": "МСК ТО 1",
      "PROJ": false
    },
    "72-2": {
      "TITLE": "МСК ТО 2",
      "PROJ": false
    },
    "72-3": {
      "TITLE": "МСК ТО 3",
      "PROJ": false
    },
    "72-4": {
      "TITLE": "МСК ТО 4",
      "PROJ": false
    },
    "CONDITIONAL": {
      "TITLE": "Условная",
      "PROJ": false
    },
    "UNKNOWN": {
      "TITLE": "Условная",
      "PROJ": false
    },
      "166-3": {
        "TITLE": "МСК 166 Зона 3",
        "PROJ": false
      },
      "167-4": {
        "TITLE": "МСК 167 Зона 4",
        "PROJ": false
      },
      "168-5": {
        "TITLE": "МСК 168 Зона 5",
        "PROJ": false
      },
      "169-6": {
        "TITLE": "МСК 169 Зона 6",
        "PROJ": false
      },
      "CONDITIONAL": {
        "TITLE": "Условная",
        "PROJ": false
      },
      "UNKNOWN": {
        "TITLE": "Неизвестно",
        "PROJ": false
      }
    }
 
  var CADASTRE = {
    "72": {
      "16": {
        "NAME": "Тобольский район",
        "CS": "72-2",
        "COMMENT": "В районе есть кварталы в условных системах координат",
        "0101001": {
          "CS": "CONDITIONAL",
          "DOC": ""
        }
      },
      "24": {
        "NAME": "город Тобольск",
        "CS": "72-2"
      },
      "NAME": "Тюменская область",
      "CS": "UNKNOWN",
      "DOC": ""
    },
    "24": {
    "NAME": "Красноярский район",
    "DOC": "Приказ Управления Федеральной службы государственной регистрации, кадастра и картографии по Красноярскому краю №П/234 от 18 июля 2013г.",
    
    "00": {
      "NAME": "Условный кадастровый район",
      "CS": "167-4"
    },
    "01": {
      "NAME": "Абанский район",
      "CS": "168-5"
    },
    "02": {
      "NAME": "Ачинский район",
      "CS": "166-3"
    },
    "03": {
      "NAME": "Балахинский район",
  "REGEX": {
    "168-5": [
      "1001\\d{3}",
      "1[5-6]\\d{5}",
      "1[8-9]\\d{5}",
      "2[0-3]\\d{5}",
      "2[5]\\d{5}",
      "[4-6]\\d{6}"
    ],
    "169-6": [
      "0[7]\\d{5}",
      "1002\\d{3}",
      "1[1-4]\\d{5}",
      "1[7]\\d{5}",
      "2[4]\\d{5}",
      "2[6]\\d{5}",
      "3\\d{6}",
      "[7-9]\\d{6}"
    ]
  }

    }
  }

  }
       
function findCS(trueCadNum){
    var NAME = ''
    var CADNUM = ''
    var CS = ''
    var DOC = ''
    var PROJ = ''
    var COMMENT = ''
    
    
    var [okrug, rayon, kvartal] = trueCadNum.split(':');
        
    if (CADASTRE[okrug]){
        console.info('Регион: [+]')
        NAME = CADASTRE[okrug].NAME
        DOC = CADASTRE[okrug].DOC

        if (CADASTRE[okrug][rayon]){
            console.info('Район: [+]')
            var CN = CADASTRE[okrug][rayon]
            CADNUM = okrug + ':' + rayon
            NAME = NAME + ', ' + CN.NAME
            CS = CN.CS ? CN.CS : false
            DOC = CN.DOC ? CN.DOC : DOC
            PROJ = CN.PROJ ? CN.PROJ : false
            COMMENT = CN.COMMENT ? CN.COMMENT : ''

            if (CADASTRE[okrug][rayon][kvartal]){
                console.info('Квартал: [+]')
                var CN = CADASTRE[okrug][rayon][kvartal]
                CADNUM = okrug + ':' + rayon + ':' + kvartal
                NAME = NAME + ', квартал ' + kvartal
                CS = CN.CS ? CN.CS : false
                DOC = CN.DOC ? CN.DOC : DOC
                PROJ = CN.PROJ ? CN.PROJ : false
                COMMENT = CN.COMMENT ? CN.COMMENT : ''
            }else if(CN.REGEX && kvartal){
                console.warn('ПОИСК ПО РЕГУЛЯРНОМУ ВЫРАЖЕНИЮ')
                for (keyCS in CN.REGEX) {
                  console.log(keyCS)
                  for (regex of CN.REGEX[keyCS]){
                      console.log(regex)
                      if (kvartal.match(regex)){
                          CS = keyCS
                          NAME = NAME + ', квартал ' + kvartal
                          CADNUM = okrug + ':' + rayon + ':' + kvartal
                          COMMENT = CN.COMMENT ? CN.COMMENT : ''
                          break
                      }
                      console.log(kvartal.match(regex));
                      //TODO: Если регулярное выражение удовлетворяет то ОСТАНОВИТЬ проход и найти систему коорданит
                  }
                 } 
                
            }else{
                console.info('Квартал: [-]')
            }
            
            // TODO: Нет проверки если кадастровый номер введен полностью, но система координат не найдена
            if (CSS[CS]){
                $('#cadnum').text(CADNUM) //CN.CS
                $('#address').text(NAME)
                $('#csname').text(CSS[CS].TITLE)
  
                if ( DOC ) {
                    $('#doc').text(DOC)
                    $('#doc').parent().show()
                }else{
                    $('#doc').parent().hide()
                }
                if ( CSS[CS].PROJ ) {
                    $('#proj').text(CSS[CS].PROJ)
                    $('#proj').parent().show()
                }else{
                    $('#proj').parent().hide()
                }
                if ( COMMENT ) {
                    $('#comment').text(COMMENT)
                    $('#comment').parent().show()
                }else{
                    $('#comment').parent().hide()
                }
                $('#result-table').show()
            } else if (kvartal){
                setAlert('кадастровый номер введен полностью, но система координат не найдена')
            }
            else{
                setAlert('На данном уровне не установлена система координат')
                setAlert('<br>Введите номер кадастрового квартала',true)
            }

        }else if (rayon){
            console.warn('Район: [-]')
            setAlert('В базе нет кадастрового района ' + okrug + ':' + rayon)
       }else{
           setAlert('Укажите полный кадастровый номер')
       }
    }else{
        console.warn('Регион: [-]')
        setAlert('В базе нет кадастрового округа ' + okrug)
     }         
}

function getProjParam(proj){
    return proj ? proj : '' //"Параметры неизвестны"
}

$('#result-table').hide()


$('#button-addon2').click(function(){
    console.clear();
    //TODO: сделать валидацию кадастрового номера
    
    var tempCadNum = $('input[aria-describedby="button-addon2"]').val()
    console.log('обрезаю кадастровый номер до 11 символов')
    var cleanCadNum = tempCadNum.replace(/\s|:|-/g, '').substring(0, 11);;
    var trueCadNum = ''

    
    switch(cleanCadNum.length) {
      case 2:
        // Указан только регион
        console.warn('Указан только регион')
        trueCadNum = cleanCadNum
        break;
      case 4:
        // Указан только регион + район
        console.info('Указан регион + район')
         trueCadNum = cleanCadNum.replace(/^(\d{2})(\d{2})$/, "$1:$2");
        break;
      case 11:
        // code block
        console.info('Указан регион + район + квартал')
        trueCadNum = cleanCadNum.replace(/^(\d{2})(\d{2})(\d{7})$/, "$1:$2:$3");
        break;
      default:
        console.warn('Введен неверный кадастровый номер')
        setAlert('Введен неверный кадастровый номер')
        setAlert('<br>Введите номер в формате XX:YY или XX:YY:ZZZZZZZ',true)
    } 
    
    if (trueCadNum){
        // Update input area
        $('#alert').text('').hide()
        $('#baseinfo').hide()
        $('input[aria-describedby="button-addon2"]').val(trueCadNum)
        findCS(trueCadNum)
    }
    
    
 })
 

 
// Нажатие на кнопку Enter
 $('input[aria-describedby="button-addon2"]').bind("enterKey",function(e){
       //do stuff here
       $('#button-addon2').trigger( "click" );
    });
$('input[aria-describedby="button-addon2"]').keyup(function(e){
    if(e.keyCode == 13)
    {
        $(this).trigger("enterKey");
    }
});

 
 // Функция предупреждений
function setAlert(text, append=false){
    if (append){
        text = $('#alert').html() + text
    }
    $('#alert').html(text).show()
    $('#baseinfo').text("В базе есть кадастровые округа: " + Object.keys(CADASTRE).join(', ')).show()
    clearTable()
}

 
 // Очистка таблицы
function clearTable(){
    $('#cadnum').text('')
    $('#address').text('')
    $('#csname').text('')
    $('#doc').text('')
    $('#proj').text('')
    $('#result-table').hide()
}


 // Щелчек на примеры
$('#samples a').click(function(){
    $('input[aria-describedby="button-addon2"]').val($(this).text())
    $('#button-addon2').trigger( "click" );
})





// Открытие модального окна
$('#exampleModal').on('shown.bs.modal', function () {
  $('#reportnum').text($('input[aria-describedby="button-addon2"]').val())
  $('#message-text').trigger('focus')
})