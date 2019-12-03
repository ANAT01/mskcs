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
//                  console.log(keyCS)
                  for (regex of CN.REGEX[keyCS]){
//                      console.log(regex)
                      if (kvartal.match(regex)){
                          CS = keyCS
                          NAME = NAME + ', квартал ' + kvartal
                          CADNUM = okrug + ':' + rayon + ':' + kvartal
                          COMMENT = CN.COMMENT ? CN.COMMENT : ''
                          break
                      }
//                      console.log(kvartal.match(regex));
                      //TODO: Если регулярное выражение удовлетворяет то ОСТАНОВИТЬ проход и найти систему коорданит
                  }
                 } 
                
            }else{
                console.info('Квартал: [-]')
            }
            
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
    console.log(Date.now());


    
    var tempCadNum = $('input[aria-describedby="button-addon2"]').val()
    console.log('обрезаю кадастровый номер до 11 символов')
    var cleanCadNum = tempCadNum.replace(/\s|:|-/g, '').substring(0, 11);;
    var trueCadNum = ''

    if (isNaN(cleanCadNum)){
        // Если в веденном номере присутствуют посторонние символы кроме цифр
        console.warn('Введен неверный кадастровый номер')
        setAlert('Введен неверный кадастровый номер')
        setAlert('<br>Введите номер в формате XX:YY или XX:YY:ZZZZZZZ',true)
    }else{
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
//  $('#reportnum').text($('input[aria-describedby="button-addon2"]').val())
  $('#message-text').trigger('focus')
})


// Отправка сообщения об ошибке


/*<form action="https://docs.google.com/forms/u/0/d/e/1FAIpQLSem6mpUdKu6qfAP5H1nJpG2LAD30puHHB61G4i9cgFHfGq0CQ/formResponse" method="post" target="hidden_iframe" onsubmit="submitted=true;">
      <label>Кадастровый номер*</label>
  
  <input type="text" jsname="YPqjbf" autocomplete="off" tabindex="0" aria-label="Кадастровый номер" aria-describedby="i.desc.819996856 i.err.819996856" name="entry.1240314455" value="" required="" dir="auto" data-initial-dir="auto" data-initial-value="">
  
  
  <textarea class="quantumWizTextinputPapertextareaInput exportTextarea" jsname="YPqjbf" data-rows="1" tabindex="0" aria-label="Текст сообщения" jscontroller="gZjhIf" jsaction="input:Lg5SV;ti6hGc:XMgOHc;rcuQ6b:WYd;" required="" name="entry.1558097354" dir="auto" data-initial-dir="auto" data-initial-value="" aria-describedby="i.desc.1598112339 i.err.1598112339" style="height: 24px;"></textarea>
  
 
     
      <button type="submit">Send</button>
</form>





$( "#feedback" ).submit(function( event ) {
 
  // Stop form from submitting normally
  event.preventDefault();
 
  // Get some values from elements on the page:
  var $form = $( this ),
    term = $form.find( "input[name='s']" ).val(),
    url = $form.attr( "action" );
 
  // Send the data using post
  var posting = $.post( url, { s: term } );
 
  // Put the results in a div
  posting.done(function( data ) {
    var content = $( data ).find( "#content" );
    $( "#result" ).empty().append( content );
  });
});*/

$( "#feedback" ).click(function(){
    var url = 'https://script.google.com/macros/s/AKfycbxEkfylRoaWqf6MQqAtE-w6kYJnBWBjgWrKO6A594Mw9vtHF44/exec'
    var data = {
        'host': window.location.hostname ? window.location.hostname : window.location.href,
        'version': $('#current_version').text(),
        'cadnum': $('input[aria-describedby="button-addon2"]').val(),
        'message': $('textarea#message-text').val(),
    }

    $.post(url, data)
    .done(function(response){
        var result = JSON.parse(response)
        console.log(result)
//        if (result.success){
        if (result.version){
            $('#message-text').val('')
            $('#exampleModal').modal('hide')
            alert('Сообщение принято.\nСпасибо за информацию!')
        }

    })
    .fail(function(response){
        alert('Ошибка связи')
    })
//    var posting = $.ajax({
//      type: 'POST',
//      url: url,
//      data: data,
//      crossDomain: true,
//      dataType: 'json',
//      success: function(data) { alert("Success " + data); },
//        error: function() { alert('Failed!'); },
//    });
//success: success,
     // dataType: dataType

//    console.log(data)
//    console.log(posting)

    // Put the results in a div
//      posting.done(function( data ) {
//        var content = $( data ).find( "#content" );
//        $( "#result" ).empty().append( content );
//      });
})


// Проверка новой версии
$.get('https://raw.githubusercontent.com/ANAT01/mskcs/master/VERSION')
.done(function (data){
    var current_version = $('#current_version').text()
    var remote_version = data
    if ( current_version != remote_version){
        console.info('Доступна новая версия ' + remote_version)
        $('#remote_version').show()
    }
})
.fail(function(){
    $('#remote_version').hide()
//    $('#remote_version').text('failtest').show()
})

