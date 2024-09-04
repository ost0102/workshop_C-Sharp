function _fnisDate(vDate, id) {
    var vValue = vDate;
    var vValue_Num = vValue.replace(/[^0-9]/g, "");

    if (_fnToNull(vValue_Num) != "") {

        //8자리가 아닌 경우 false 
        if ((vValue_Num.length != 8 && vValue_Num.length != 6) && vValue_Num.length > 0) {
            _fnAlertMsg("날짜를 YYYYMMDD or YYMMDD 형식으로 입력 해 주세요.", "alert01");
            $(id).focus()
            return false;
        }

        if (vValue_Num.length == 8) {
            var rxDatePattern = /^(\d{4})(\d{1,2})(\d{1,2})$/;
            var dtArray = vValue_Num.match(rxDatePattern);
        }
        else if (vValue_Num.length == 6) {
            var year = new Date;
            var rxDatePattern = /^(\d{2})(\d{1,2})(\d{1,2})$/;
            var dtArray = vValue_Num.match(rxDatePattern);
            dtArray[1] = year.getFullYear().toString().substring("0", "2") + dtArray[1];
        }

        //8자리의 yyyymmdd를 원본 , 4자리 , 2자리 , 2자리로 변경해 주기 위한 패턴생성을 합니다. 

        if (dtArray == null) { return false; }
        //0번째는 원본 , 1번째는 yyyy(년) , 2번재는 mm(월) , 3번재는 dd(일) 입니다. 
        dtYear = dtArray[1]; dtMonth = dtArray[2]; dtDay = dtArray[3];
        //yyyymmdd 체크 
        if (dtMonth < 1 || dtMonth > 12) {
            _fnAlertMsg("존재하지 않은 월을 입력하셨습니다. 다시 한번 확인 해주세요");
            return false;
        } else if (dtDay < 1 || dtDay > 31) {
            _fnAlertMsg("존재하지 않은 일을 입력하셨습니다. 다시 한번 확인 해주세요");
            return false;
        }
        else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31) {
            _fnAlertMsg("존재하지 않은 일을 입력하셨습니다. 다시 한번 확인 해주세요"); return false;
        } else if (dtMonth == 2) {
            var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
            if (dtDay > 29 || (dtDay == 29 && !isleap)) {
                _fnAlertMsg("존재하지 않은 일을 입력하셨습니다. 다시 한번 확인 해주세요");
                return false;
            }
        }

    }
    return true;

}
// 넘패드
function _fnPad(data, num) {
    var pad = "";
    if (data.toString().length < num) {
        for (var i = 0; i < num - data.toString().length; i++) {
            pad += "0";
        }
    }
    data = pad + data;
    return data;
}


//날짜 유효성 체크 (윤달 포함)
function _fnisDate_layer(vDate) {

    var vValue = vDate;
    var vValue_Num = vValue.replace(/[^0-9]/g, "");

    if (_fnToNull(vValue_Num) == "") {
        _fnLayerAlertMsg("날짜를 입력 해 주세요.");
        return false;
    }

    //8자리가 아닌 경우 false
    if (vValue_Num.length != 8) {
        _fnLayerAlertMsg("날짜를 20200101 or 2020-01-01 형식으로 입력 해 주세요.");
        return false;
    }

    var rxDatePattern = /^(\d{4})(\d{1,2})(\d{1,2})$/; //Declare Regex
    var dtArray = vValue_Num.match(rxDatePattern); // is format OK?

    if (dtArray == null) {
        return false;
    }

    dtYear = dtArray[1];
    dtMonth = dtArray[2];
    dtDay = dtArray[3];

    //yyyymmdd 체크
    if (dtMonth < 1 || dtMonth > 12) {
        _fnLayerAlertMsg("존재하지 않은 월을 입력하셨습니다. 다시 한번 확인 해주세요");
        return false;
    }
    else if (dtDay < 1 || dtDay > 31) {
        _fnLayerAlertMsg("존재하지 않은 일을 입력하셨습니다. 다시 한번 확인 해주세요");
        return false;
    }
    else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31) {
        _fnLayerAlertMsg("존재하지 않은 일을 입력하셨습니다. 다시 한번 확인 해주세요");
        return false;
    }
    else if (dtMonth == 2) {
        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
        if (dtDay > 29 || (dtDay == 29 && !isleap)) {
            _fnLayerAlertMsg("존재하지 않은 일을 입력하셨습니다. 다시 한번 확인 해주세요");
            return false;
        }
    }

    return true;
}


function _fnGetNumber(obj, sum) {
    var num01;
    var num02;
    if (sum == "sum") {
        num02 = obj;
        num01 = fnSetComma(num02); //콤마 찍기
        return num01;
    }
    else {
        num01 = obj.value.slice(0, 13);
        num02 = num01.replace(/[^0-9.]/g, ""); //0으로 시작하거나 숫자가 아닌것을 제거,
        num01 = fnSetComma(num02); //콤마 찍기
        obj.value = num01;
    }
}


function fnSetComma(n) {
    var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
    n += '';                          // 숫자를 문자열로 변환         
    while (reg.test(n)) {
        n = n.replace(reg, '$1' + ',' + '$2');
    }
    return n;
}


//Null 값 ""
function _fnToNull(data) {
    // undifined나 null을 null string으로 변환하는 함수. 
    if (String(data) == 'undefined' || String(data) == 'null') {
        return ''
    } else {
        return data
    }
}

//Null 값 0으로
function _fnToZero(data) {
    // undifined나 null을 null string으로 변환하는 함수. 
    if (String(data) == 'undefined' || String(data) == 'null' || String(data) == '' || String(data) == 'NaN') {
        return '0'
    } else {
        return data
    }
}

/* 지연 함수 - ms 시간만큼 지연하여 실행. */
function _fnsleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

///* 레이어팝업 */
//var layerPopup = function (obj, target, bool, id) {
//    var $laybtn = $(obj),
//        $glayer_zone = $(".layer_zone");
//    $focus = target;
//    if ($glayer_zone.length === 0) { return; }
//    $glayer_zone.hide();
//    $("body").addClass("layer_on");
//    $laybtn.fadeIn(200);

//    $glayer_zone.on("click", ".login_entering", function (e) {
//        var $this = $(this),
//            t_layer = $this.parents(".layer_zone");
//        $("body").removeClass("layer_on");
//        t_layer.fadeOut(300);
//    });

//    $glayer_zone.on("click", function (e) {
//        if (bool != false) {
//            var $this = $(this),
//                $t_item = $this.find(".layer_cont");
//            if (id != undefined) {
//                $("#" + id).focus();
//            }
//            if ($(e.target).parents(".layer_cont").length > 0) {
//                return;
//            }
//            $("body").removeClass("layer_on");
//            $this.fadeOut(300);
//        }
//    });

//};

function _fnMakeJson(data) {
    if (data != undefined) {
        var str = JSON.stringify(data);
        if (str.indexOf("[") == -1) {
            str = "[" + str + "]";
        }
        return str;
    }
}

function _fnSetCookie(name, value, hours) {
    if (hours) {
        var date = new Date();
        date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else {
        var expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function _fnDelCookie(cookie_name) {
    _fnSetCookie(cookie_name, "", "-1");
}

function _fnGetCookie(cookie_name) {
    var x, y;
    var val = document.cookie.split(';');

    for (var i = 0; i < val.length; i++) {
        x = val[i].substr(0, val[i].indexOf('='));
        y = val[i].substr(val[i].indexOf('=') + 1);
        x = x.replace(/^\s+|\s+$/g, ''); // 앞과 뒤의 공백 제거하기
        if (x == cookie_name) {
            return unescape(y); // unescape로 디코딩 후 값 리턴
        }
    }
}

function _fnMakePhoneForm(value) {
    var vTel = "";
    var vValue = value;
    vValue = vValue.replace(/-/gi, "");
    //자동 하이픈
    if (vValue.length < 4) {
        vTel = vValue;
    }
    else if (vValue.length < 7) {
        vTel += vValue.substr(0, 3);
        vTel += "-";
        vTel += vValue.substr(3);
    }
    else if (vValue.length < 11) {
        vTel += vValue.substr(0, 3);
        vTel += "-";
        vTel += vValue.substr(3, 3);
        vTel += "-";
        vTel += vValue.substr(6);
    } else {
        vTel += vValue.substr(0, 3);
        vTel += "-";
        vTel += vValue.substr(3, 4);
        vTel += "-";
        vTel += vValue.substr(7);
    }

    return vTel;
}

function _fnAlertMsg(msg, id) {
    $(".alert_cont .inner h5").html("");
    $(".alert_cont .inner h5").html(msg);
    $('body').removeClass('noscroll');
    if (_fnToNull(id) != "") {
        layerPopup('#alertcheck');
        $(".loginChk").addClass(id);
    } else {
        layerPopup('#alertcheck');
    }
    $("#findpwalert").focus();
}
var closeVar = "";



//현재 시간값 밀리초까지 문자열로 치환
function _fnNow() {
    var now = new Date();
    var result = "";

    now.setHours(now.getHours() + 9);

    result = now.toISOString().replace(/-|:|\.|T|Z/gi, '')

    return result;
}

//날짜 차이 , 간격 일수 함수 (yyyymmdd , yyyy-mm-dd)
function _fnCompareDay(vValue1, vValue2) {

    var rxDatePattern = /^(\d{4})(\d{1,2})(\d{1,2})$/; //Declare Regex

    if (vValue1.length > 7 && vValue2.length > 7) {

        //- replaceAll
        var dtArray1 = vValue1.replace(/-/gi, "").match(rxDatePattern); //기준 날짜
        var dtArray2 = vValue2.replace(/-/gi, "").match(rxDatePattern); //비교 날짜

        //0 => 현재 날짜 / 1 => yyyy / 2 => mm / 3 => dd
        var vSDate = new Date(parseInt(dtArray1[1]), parseInt(dtArray1[2]) + 1, parseInt(dtArray1[3]));
        var vEDate = new Date(parseInt(dtArray2[1]), parseInt(dtArray2[2]) + 1, parseInt(dtArray2[3]));

        var vGapDay = Math.abs(vEDate.getTime() - vSDate.getTime());
        vGapDay = Math.ceil(vGapDay / (1000 * 3600 * 24));

        return vGapDay;
    } else {
        return "N";
    }
}

//날짜 플러스
function _fnPlusDate(date) {
    var nowDate = new Date();
    var weekDate = nowDate.getTime() + (date * 24 * 60 * 60 * 1000);
    nowDate.setTime(weekDate);

    var weekYear = nowDate.getFullYear();
    var weekMonth = nowDate.getMonth() + 1;
    var weedDay = nowDate.getDate();

    if (weekMonth < 10) { weekMonth = "0" + weekMonth; }
    if (weedDay < 10) { weedDay = "0" + weedDay; }
    var result = weekYear + "-" + weekMonth + "-" + weedDay;
    return result;
}
//데이터 날짜 포멧 그려주기
function _fnDateFormat(date) {
    if (_fnToNull(date) != "") {
        if (date.length == 8) {
            return date.substr(0, 4) + '.' + date.substr(4, 2) + '.' + date.substr(6, 2);
        } else if (date.length == 6 || date.length == 4) {
            return date.substr(0, 2) + ':' + date.substr(2, 2);
        } else if (date.length == 14) {
            return date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6, 2) + '-' + date.substr(8, 2) + '-' + date.substr(10, 2);
        }

    }

    return date;
}

function _fnDateFormatAdmin(date) {
    if (_fnToNull(date) != "") {
        if (date.length == 8) {
            return date.substr(0, 4) + '.' + date.substr(4, 2) + '.' + date.substr(6, 2);
        } else if (date.length == 6 || date.length == 4) {
            return date.substr(0, 2) + ':' + date.substr(2, 2);
        } else if (date.length == 14) {
            return date.substr(0, 4) + '.' + date.substr(4, 2) + '.' + date.substr(6, 2);
        }

    }

    return date;
}

//레이어 팝업
function _fnLayerAlertMsg(msg , id) {
    $("#alertcheck .inner h5").html("");
    $("#alertcheck .inner h5").html(msg);
    layerPopup2('#alertcheck', "");
    $(".loginChk").focus();
}

//레이어 팝업
function _fnLayerAlertMsg_1(msg, id) {
    $("#alertcheck_1 .inner").html("");
    $("#alertcheck_1 .inner").html(msg);
    layerPopup2('#alertcheck_1', "");
    $("#alert_1").focus();
}

function _fnLayerAlertMsg_2(msg, id) {
    $("#alertcheck_2 .inner").html("");
    $("#alertcheck_2 .inner").html(msg);
    layerPopup2('#alertcheck_2', "");
    $("#alert_2").focus();
}

function _fnLayerAlertMsgDataIndex (msg, id) {
    $("#alertLayercheck .inner").html("");
    $("#alertLayercheck .inner").html(msg);
    layerPopup2('#alertLayercheck', "");
    $(".loginLayerChk").focus();
    $(".loginLayerChk").addClass('isAlert');
    $(".loginLayerChk").attr('data-index', id);
}

//레이어 
function _fnLayerConfirmMsg(msg) {
    $("#ConFirm .inner").html(msg);
    layerPopup2('#ConFirm', "");
}
//레이어/간편견적
function _fnLayerConfirmMsg_1(msg) {
    $("#ConFirm_1 .inner").html(msg);
    layerPopup2('#ConFirm_1', "");
}
$(document).on('click', 'button', function (e) {
    var id = $(this).hasClass();
    if (id == "loginChk") {
        if (e.keyCode == 13) {
            layerClose('#alertcheck');
        }
    }
});

/* 레이어 팝업 공백 클릭 시 닫히지 않게 하는 팝업*/
var layerPopup2 = function (obj, target) {


    var $laybtn = $(obj),
        $glayer_zone = $(".layer_zone");
    $focus = target;
    if ($glayer_zone.length === 0) { return; }
    $("body").addClass("layer_on"); // ★본문스크롤 제거
    $laybtn.fadeIn(200);
    $laybtn.attr("tabindex", "0").focus();
};


///* 레이어팝업 닫기 */
//var layerClose = function (obj) {
//    var $laybtn = $(obj);

//    if (obj == "#Tracking_pop") {
//        $("#Tracking_pdfIframe").attr("src", "");
//    }
//    $("#" + closeVar).focus(); //focus
//    $("body").removeClass("layer_on"); // ★본문스크롤 제거
//    $laybtn.hide();
//};



function Region_show(vGRP_CODE, VId) {
    var objJsonData = new Object();
    objJsonData.GRP_CD = vGRP_CODE;

    $.ajax({
        type: "POST",
        url: "/Home/fnRegionshow",
        async: true,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {
            if (result.Result[0].trxCode == "Y") {
                Region_Detail(result, VId);
            }
        },
        error: function (error) {
            alert("에러");
        }
    });
}

function Region_Detail(vJsonData, VId) {
    var vHtml = "";
    var vResult = vJsonData.Region_Show;

    $.each(vResult, function (i) {

        vHtml += " <li class='item'> ";
        vHtml += " <button type='button' class='city-btn btn" + VId +"'>" + _fnToNull(vResult[i]["COMM_NM"]) + "</button> ";
        vHtml += " </li> ";
    });

    $("#" + VId)[0].innerHTML = vHtml;
}

function _fnSequenceMngt(prefix) {
    var test = prefix + _fnNow();
    console.log(test);
    return test;

}

//데이터 날짜 포멧 그려주기
function _fnDateFormating(date) {
    if (_fnToNull(date) != "") {
        return date.substr(0, 4) + '.' + date.substr(4, 2) + '.' + date.substr(6, 2) + " " + date.substr(8, 2) + ":" + date.substr(10, 2);
    }
}

function _fnDateFormatingDash(date) {
    if (_fnToNull(date) != "") {
        return date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6, 2);
    }
}
var closeVar = "";

function controllerToLink(view, controller, obj) {
    var objParam = new Object();
    objParam.LOCATION = view;
    objParam.CONTROLLER = controller;

    if (obj != null) {
        objParam = $.extend({}, objParam, obj);
    }

    $.ajax({
        type: "POST",
        url: "/Quotation/CallPage",
        async: false,
        dataType: "text",
        data: objParam,
        success: function (result) {
            window.location = result;
        }, error: function (xhr) {
            console.log("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
            console.log(xhr);
            return;
        }
    });
}

//총 금액에 10%를 빼고 2%만 추출
function _fnPercent(data) {
    if (_fnToNull(data) != "") {
        // 10%빼기
        var afterTenPercent = data * 0.9;
        // 2%계산
        var finalAmount = parseInt(afterTenPercent * 0.02);

        return finalAmount;
    } else {
        return "0";
    }
}


$(document).on("click", "#hide_arr", function () {
    $("#admin_slide").css("width", "50px");
    $(".st-main").addClass("no_padding");
    $(this).hide();
    $("#show_arr").show();
    $("#admin_logo").hide();
})

$(document).on("click", "#show_arr", function () {
    $("#admin_slide").css("width", "220px");
    $(".st-main").removeClass("no_padding");
    $(this).hide();
    $("#hide_arr").show();
    $("#admin_logo").show();
})


// url 에서 parameter 추출
function _fnGetParam(sname) {
    var params = location.search.substr(location.search.indexOf("?") + 1);
    var sval = "";
    params = params.split("&");
    for (var i = 0; i < params.length; i++) {
        temp = params[i].split("=");
        if ([temp[0]] == sname) { sval = temp[1]; }
    }

    return sval;
}