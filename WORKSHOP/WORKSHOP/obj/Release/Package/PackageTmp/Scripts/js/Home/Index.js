var pageindex = 1;
$(function () {


    $('.recommend_con').scroll(function () {
        var scrollTop = $('.recommend_con').scrollTop();
        var innerHeight = $('.recommend_con').innerHeight();
        var scrollHeight = $('.recommend_con').prop('scrollHeight') - 100;
        

        if (scrollTop + innerHeight >= scrollHeight) {
            pageindex += 1;
            fnSearchList("ROAD", pageindex);
        }
        
    });
    $('.location_con').scroll(function () {
        var scrollTop = $(".location_con").scrollTop();
        var innerHeight = $(".location_con").innerHeight();
        var scrollHeight = $(".location_con").prop('scrollHeight') -100;


        if (scrollTop + innerHeight >= scrollHeight) {
            pageindex += 1;
            fnSearchList("SEARCH", pageindex);
        }

    });

    $('.time_con').scroll(function () {
        var scrollTop = $(".time_con").scrollTop();
        var innerHeight = $(".time_con").innerHeight();
        var scrollHeight = $(".time_con").prop('scrollHeight') - 100;


        if (scrollTop + innerHeight >= scrollHeight) {
            pageindex += 1;
            fnSchCommentList(pageindex);
        }

    });



    if (_fnToNull($("#Session_EMAIL").val()) != "") {
        $("div").removeClass("blur_div");
        $(".login_layer").hide();
        //if (sessionStorage.val("TAB3_CLICK") == "Y") {
        //    alert(sessionStorage);
        //    fnSchCommentList();
        //}
    }
    window.onpageshow = function (event) {
        if (event.persisted || (window.performance && window.performance.navigation.type == 2)) {
            $("#recommend").prop("checked", true);
            $("#location").prop("checked", false);
            $("#time").prop("checked", false);
        }
    };
    if (sessionStorage.length > 3) {
        $("#From_Date").val(sessionStorage.getItem("From_Date"));
        $("#To_Date").val(sessionStorage.getItem("To_Date"));
        $("#est_min_prc").val(sessionStorage.getItem("est_min_prc"));
        $("#est_max_prc").val(sessionStorage.getItem("est_max_prc"));
        $("#est_head_cnt").val(sessionStorage.getItem("est_head_cnt"));
        HomeEstimate(sessionStorage.getItem("item_cd"));
        $("#alert03").show();
        $(document).on('click', '#FacilitiesPic', function () {
            $('.hotel_slide_box').show();
            $('.event_slide_box').hide();
            $('.hotel_slide_box .img_slide_estimate').slick('refresh');
            $('.hotel_slide_box .img_slide_estimate').not('.slick-initialized').slick();
        })
        $(document).on('click', '#EventPic', function () {
            $('.hotel_slide_box').hide();
            $('.event_slide_box').show();
            $('.event_slide_box .img_slide_estimate').slick('refresh');
            $('.event_slide_box .img_slide_estimate').not('.slick-initialized').slick();
        })
    } else {
        $("#From_Date").val(_fnPlusDate(0));
        $("#To_Date").val("");
    }
    if (sessionStorage.getItem("TAB3_CLICK") == "Y") {
        $("#time").click();
        $("#time").attr("checked", true);
        sessionStorage.setItem("TAB3_CLICK", "");
    }
    //****************************
    $(document).on("focusout", '.ChkCount', function () {
        var Chk = $(this).closest('.ChkCount').val();

        if (_fnToNull(Chk) == "") {
            $(this).closest('.ChkCount').val(0);
        }
    });
    $(document).on("keyup", '.ChkCount', function () {
        var Chk = $(this).closest('.ChkCount').val();
        var ChkOn = _fnToNull(parseInt(Chk));
        var vValue_Num = ChkOn.toString().replace(/[^0-9]/g, "");

        $(this).closest('.ChkCount').val(vValue_Num);
        if (ChkOn > 0) {
            $(".choice_stay1").css("background", "rgb(199, 233, 232)")
            $(this).closest('.stay_form').addClass("on")

        }
        else {
            $(this).closest(".stay_form").removeClass("on")
        }
    });
    //*******************************
    $("input.cost").bind('keyup', function (e) {
        var num = "";
        if (this.value.toString().replace(/,/gi, '').length > 10) {
            num = this.value.substr(0, 10);
        }
        else {
            num = this.value;
        }
        var rgx1 = /\D/g;
        var rgx2 = /(\d+)(\d{3})/;
        num = num.replace(rgx1, "");

        while (rgx2.test(num)) num = num.replace(rgx2, '$1' + ',' + '$2');
        this.value = num;
    });

   // console.log("start");
    fnSearchList("ROAD",1);
    /*fnSearchList("SEARCH");*/
    //input 실시간 - Validation
    $("input").keyup(function (e) {

        var $this = $(e.target);

        if (!FocusData) {
            if (e.keyCode == 13) {
                if ($(e.target).attr('data-value') != undefined) {
                    if ($(e.target).attr('data-value').indexOf("value") > -1) {

                        if ($(e.target).attr('data-value') == "value0") {
                            $("#close_region").click();
                        }
                        var vIndex = $(e.target).attr('data-value').replace("value", "");

                        $('[data-value="value' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
                    }

                }
            }
        
        } else {
            FocusData = false;
        }
    })


})
$(document).on('click', '#main_login_btn', function () { /*연수다와 함께한시간 로그인id*/
    var id = _fnToNull($(this).parent().siblings('.login_id').find('input[name=id_login]').val());
    var pw = _fnToNull($(this).parent().siblings('.login_pw').find('input[name=pw_login]').val());

    sessionStorage.setItem("TAB3_CLICK", "Y");
    _fnLogin(id, pw);
    //fnSchCommentList();
})

$(document).on('keyup', '#main_pw', function (e) { /*연수다와 함께한시간 로그인id*/
    if (e.keyCode == 13) {  
        var id = _fnToNull($("#main_id").val());
        var pw = _fnToNull($("#main_pw").val());
        sessionStorage.setItem("TAB3_CLICK", "Y");
        _fnLogin(id, pw);
        //fnSchCommentList();
    }
});

//이미지클릭
$(document).on('click', '.info_box .region_img', function () {
    $('#alert01').show();
    if ($("#01_top_img").children().hasClass('slick-list')) {
        $('.img_slide_detail').slick('refresh');
        $(".img_slide_detail").removeClass('slick-initialized');
        $(".img_slide_detail").removeClass('slick-slider');
    }
    Alert01imgclick($(this).parents('.region_img_area').children('input').val()); //이미지클릭함수
    $('.img_slide_detail').not('.slick-initialized').slick();
    $('.img_slide_detail').slick('refresh');
    $('html').css('overflow', 'hidden');
});
//견적문의클릭
$(document).on('click', '.estimate_btn', function () {
    $('.slick-track').children().removeClass('.arrow_btn');
    $(document).on('click', '#FacilitiesPic', function () {
        $('.hotel_slide_box').show();
        $('.event_slide_box').hide();
        $('.hotel_slide_box .img_slide_estimate').slick('refresh');
        $('.hotel_slide_box .img_slide_estimate').not('.slick-initialized').slick();
    })
    $(document).on('click', '#EventPic', function () {
        $('.hotel_slide_box').hide();
        $('.event_slide_box').show();
        $('.event_slide_box .img_slide_estimate').slick('refresh');
        $('.event_slide_box .img_slide_estimate').not('.slick-initialized').slick();
    })
    if (_fnToNull($(this).attr('id')) != "Req_submit") {
        if (_fnToNull($(this).attr('id')) != "Login_Req_submit") {
            if (_fnToNull($("#Session_EMAIL").val()) != "") {
                $('#alert03').show();
            }
            else if (_fnToNull($(this).attr('id')) == "Req_submit") {
                $('#alert02').hide();
            }
            else {
                location.href = "/Login/Index";
                //$('#alert02').show();
            }
            if ($("#layer_img_path").children().hasClass('slick-list')) {
                $('.img_slide_estimate').slick('refresh');
                $(".img_slide_estimate").removeClass('slick-initialized');
                $(".img_slide_estimate").removeClass('slick-slider');
            }
            if ($("#layer_event_img_path").children().hasClass('slick-list')) {
                $('.img_slide_estimate').slick('refresh');
                $(".img_slide_estimate").removeClass('slick-initialized');
                $(".img_slide_estimate").removeClass('slick-slider');
            }
            HomeEstimate($(this).siblings().val());
            $('html').css('overflow', 'hidden');
            
        }
    }
});


$(document).on('click', '#close_stay', function () {
    $('.stay_form_area').hide();
});


$(document).on('click', '.loginLayerChk', function (e) {
    if ($(e.target).attr('data-index') != undefined) {
        if ($(e.target).attr('data-index').indexOf("Layer_Esti") > -1) {
            if ($(e.target).attr('data-index') == "Layer_Esti10") {
                $("#Region_4").click();
            } else if ($(e.target).attr('data-index') == "Layer_Esti12") {
                $("#Region_5").click();
            }
            var vindex = $(e.target).attr('data-index').replace("Layer_Esti", "");
            

            $('[data-index="Layer_Esti' + (parseFloat(vindex) + 1).toString() + '"]').focus();

            layerCloseLayer('#alertLayercheck');
            //else if (vindex == 2) {
            //    $("#btn_seaschedule_search").click();
            //}
        }

    }
});


$(document).on('click', '#Not_login_Quot', function () {
    $("#From_Date_4").val(_fnPlusDate(0));
    $("#To_Date_4").val("");
    var objJsonData = new Object();
    objJsonData.GRP_CD = "A5";

    var VId = "add_opt_4";

    $.ajax({
        type: "POST",
        url: "/Home/Addoption",
        async: false,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {
            fnAddoption(result, VId);
            $('#alert04').show();
            $('html').css('overflow', 'hidden');
        },
        error: function (error) {
            alert("에러");
        }
    })

});

$(document).on('click', '#Login_Quot', function () {
    $("#From_Date_5").val(_fnPlusDate(0));
    $("#To_Date_5").val("");
    var objJsonData = new Object();
    objJsonData.GRP_CD = "A5";

    var VId = "add_opt_5";

    $.ajax({
        type: "POST",
        url: "/Home/Addoption",
        async: false,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {
            fnAddoption(result, VId);
            $('#alert05').show();
            $('html').css('overflow', 'hidden');
        },
        error: function (error) {
            alert("에러");
        }
    })
});

$(document).on('click', '#location', function () {
    $("#location_area").empty();
    $(".con1").empty();
    pageindex = 1;
    $('#koreaMap').css('display', 'none');
    $(".con1").append("<div id='map' class='map' style='width:100%; height:1020px;'></div>");
    fnSearchList("SEARCH", 1);
    //SetMainMap();
    //googleapisView();
    $("#location").attr('checked', true);
    $("#time").attr('checked', false);
    $("#recommend").attr('checked', false);
    $('.location_con').show();
    $('.time_con').hide();
    $('.recommend_con').hide();
    $("#login_time_area").hide();
})
$(document).on('click', '#time', function () {
    pageindex = 1;
    $(".con1").empty();
    $("#location_area").empty();
    $(".con1").append("<div id='koreaMap' class='map' style='background:#daf2f1;'></div>");
    fnSchCommentList(pageindex);
    drawMap('#koreaMap', "COMMENT");
    $('.map.leaflet-container').hide();
    $('#koreaMap').show();
    $("#time").attr('checked', true);
    $("#location").attr('checked', false);
    $("#recommend").attr('checked', false);
    $('.location_con').hide();
    $('.recommend_con').hide();
    $('.time_con').show();
    if (_fnToNull($("#Session_EMAIL").val()) == "") {
        $('.login_layer').show();
    } else {
        $('.login_layer').hide();
    }
})
$(document).on('click', '#recommend', function () {
    pageindex = 1;
    $(".con1").empty();
    $("#recommend_area").empty();
    $(".con1").append("<div id='koreaMap' class='map' style='background:#daf2f1;'></div>");
    drawMap('#koreaMap', "ROAD");
    $('#koreaMap').show();
    fnSearchList("ROAD", 1);
    $("#recommend").attr('checked', true);
    $("#location").attr('checked', false);
    $("#time").attr('checked', false);
    $('.location_con').hide();
    $('.time_con').hide();
    $('.recommend_con').show();
    $("#login_time_area").hide();
})


//#region Global Variable
var _initPage = "";
var DateValue = "";
var vHtml = "";
var picObj = new Object;
//#endregion



//#endregion 

//#region ☆☆☆☆Event Area☆☆☆☆



$(document).on("focusout", "#From_Date", function () {
    DateValue = $("#From_Date").val().replace(/-/gi, "");
    fnDateForm(DateValue, this.id);
    var startDate = $("#From_Date").val().replace(/-/gi, ""); //시작일
    var endDate = $("#To_Date").val().replace(/-/gi, ""); //종료일

    var Date = _fnCompareDay(startDate, endDate);
    var Dateday = Date + 1

    $('#room_select').empty();
    $("#room_select_btn").css("background", "rgb(238, 239, 240)")
    $("#room_date_select_btn").css("background", "rgb(238, 239, 240)")
    $('#room_select').text("[숙박] 일정입니다. / " + "[" + Date + "]" + "박" + "[" + Dateday + "]" + "일 일정입니다.");
});

$(document).on("focusout", "#To_Date", function () {
    DateValue = $("#To_Date").val().replace(/-/gi, "");
    fnDateForm(DateValue, this.id);
});


$(document).on("focusout", "#From_Date_5", function () {
    DateValue = $("#From_Date_5").val().replace(/-/gi, "");
    fnDateForm_login(DateValue, this.id);

});

$(document).on("focusout", "#To_Date_5", function () {
    DateValue = $("#To_Date_5").val().replace(/-/gi, "");
    fnDateForm_login(DateValue, this.id);
});

$(document).on("focusout", "#From_Date_4", function () {
    DateValue = $("#From_Date_4").val().replace(/-/gi, "");
    fnDateForm_Nologin(DateValue, this.id);

});

$(document).on("focusout", "#To_Date_4", function () {
    DateValue = $("#To_Date_4").val().replace(/-/gi, "");
    fnDateForm_Nologin(DateValue, this.id);
});
//#endregion


//#region ★List Area★

//사진 보기 버튼

$(document).on('click', '.show_pic', function () {

    var path = $(this).parents('.result').children('.hiddenValue')
    picObj.pic1 = _fnToNull(path.children('.pic1_url').val());
    picObj.pic2 = _fnToNull(path.children('.pic2_url').val());
    picObj.pic3 = _fnToNull(path.children('.pic3_url').val());
    LoadPreviewPop(picObj);
    //$("body").addClass("noscroll");
})


// 출발 버튼
$(document).on('click', '.btn_start', function () {
    var path = $(this).parents('.result').children('.hiddenValue')
    picObj.pic1 = _fnToNull(path.children('.pic1_url').val());
    picObj.pic2 = _fnToNull(path.children('.pic2_url').val());
    picObj.pic3 = _fnToNull(path.children('.pic3_url').val());
    LoadStartPop(picObj);
    //$("body").addClass("noscroll");
})


//상세 보기 컨트롤
$(document).on('click', '.btn_detail', function () {
    var info = $(this).parents('.result_con').children('.detail').children('.hidden_detail');
    // 펼치고 접기
    if (info.css('display') == 'none') {
        ListDetailInit();


        $(this).addClass("on");
        info.slideDown();
        $(this).text('접기');
        info.parent('.detail').css('padding-bottom', '10px');

    } else {
        $(this).removeClass("on");
        info.slideUp();
        $(this).text('상세');
        info.parent('.detail').css('padding-bottom', '0');
    }


    var top_px = $(this).parents('.result_area').attr('id');
    fnMovePage(top_px, 'id');

})
//#endregion

//#endregion 


// #region ☆☆☆☆Func Area☆☆☆☆


//세션 체크
function fnCheckSession() {
    var SessionValue = _fnToNull($("#Session_USR_ID").val());

    if (SessionValue == "") {
        return false;
    }
    return true;
}

//#region ★★Search Area ★★

//#region ★Init Func★
//날짜 초기 셋팅

function initList() {
    $("#task_order").empty();
}

function initDate() {
    var now = new Date();

    var now_year = now.getFullYear();
    var now_month = _pad(now.getMonth() + 1, 2);
    var now_day = _pad(now.getDate(), 2);

    var to_day = now_year + "-" + now_month + "-" + now_day;

    var past = new Date(now.setDate(now.getDate() - 7));

    var past_year = past.getFullYear();
    var past_month = _pad(past.getMonth() + 1, 2);
    var past_day = _pad(past.getDate(), 2);


    var from_day = past_year + "-" + past_month + "-" + past_day;


    $("#To_Date").val(to_day);
    $("#From_Date").val(from_day);

}
//#endregion Init Func End

//#region Validation Func
function DateCampare(id, date) {
    var first = "";
    var sec = "";


    //앞 날짜
    if (id == "#From_Date") {
        first = date.replace(/-/gi, "");
        sec = $("#To_Date").val().replace(/-/gi, "");
        if (sec.length == 8) {
            if (first > sec) {
                _fnLayerAlertMsg_2("시작일자는 종료일자보다 이후 일 수 없습니다.");
                return false;
            }
        }

    }
    //뒷날짜
    if (id == "#To_Date") {
        first = $("#From_Date").val().replace(/-/gi, "");
        sec = date.replace(/-/gi, "");
        if (first.length == 8) {
            if (sec < first) {
                _fnLayerAlertMsg_2("종료일자는 시작일자보다 이전 일 수 없습니다.");
                return false;
            }
        }
    }

    return true;
}

function fnDateForm_Nologin(strDate, id) {
    var date = new Date();
    var form_year = date.getFullYear().toString();
    var dateForm = "";
    var bindingID = "#" + id;

    if (strDate.length > 0) {
        if (strDate.length == 4) {
            dateForm = form_year + "-" + strDate.substr(0, 2) + "-" + strDate.substr(2, 2);
        }
        else if (strDate.length == 6) {
            dateForm = form_year.substr(0, 2) + strDate.substr(0, 2) + "-" + strDate.substr(2, 2) + "-" + strDate.substr(4, 2);
        }
        else if (strDate.length == 8) {
            dateForm = strDate.substr(0, 4) + "-" + strDate.substr(4, 2) + "-" + strDate.substr(6, 2);
        }
        else {
            dateForm = $(bindingID).val();
        }

        if (DateCampare_Nologin(bindingID, dateForm)) {
            $(bindingID).val(dateForm);
        }
        else {
            $(bindingID).val(_fnPlusDate(0));
        }

    }
}

function DateCampare_Nologin(id, date) {
    var first = "";
    var sec = "";


    //앞 날짜
    if (id == "#From_Date_4") {
        first = date.replace(/-/gi, "");
        sec = $("#To_Date_4").val().replace(/-/gi, "");
        if (sec.length == 8) {
            if (first > sec) {
                _fnLayerAlertMsg_2("시작일자는 종료일자보다 이후 일 수 없습니다.");
                return false;
            }
        }

    }
    //뒷날짜
    if (id == "#To_Date_4") {
        first = $("#From_Date_4").val().replace(/-/gi, "");
        sec = date.replace(/-/gi, "");
        if (first.length == 8) {
            if (sec < first) {
                _fnLayerAlertMsg_2("종료일자는 시작일자보다 이전 일 수 없습니다.");
                return false;
            }
        }
    }

    return true;
}


function fnDateForm_login(strDate, id) {
    var date = new Date();
    var form_year = date.getFullYear().toString();
    var dateForm = "";
    var bindingID = "#" + id;

    if (strDate.length > 0) {
        if (strDate.length == 4) {
            dateForm = form_year + "-" + strDate.substr(0, 2) + "-" + strDate.substr(2, 2);
        }
        else if (strDate.length == 6) {
            dateForm = form_year.substr(0, 2) + strDate.substr(0, 2) + "-" + strDate.substr(2, 2) + "-" + strDate.substr(4, 2);
        }
        else if (strDate.length == 8) {
            dateForm = strDate.substr(0, 4) + "-" + strDate.substr(4, 2) + "-" + strDate.substr(6, 2);
        }
        else {
            dateForm = $(bindingID).val();
        }

        if (DateCampare_login(bindingID, dateForm)) {
            $(bindingID).val(dateForm);
        }
        else {
            $(bindingID).val(_fnPlusDate(0));
        }

    }
}

function DateCampare_login(id, date) {
    var first = "";
    var sec = "";


    //앞 날짜
    if (id == "#From_Date_5") {
        first = date.replace(/-/gi, "");
        sec = $("#To_Date_5").val().replace(/-/gi, "");
        if (sec.length == 8) {
            if (first > sec) {
                _fnLayerAlertMsg_2("시작일자는 종료일자보다 이후 일 수 없습니다.");
                return false;
            }
        }

    }
    //뒷날짜
    if (id == "#To_Date_5") {
        first = $("#From_Date_5").val().replace(/-/gi, "");
        sec = date.replace(/-/gi, "");
        if (first.length == 8) {
            if (sec < first) {
                _fnLayerAlertMsg_2("종료일자는 시작일자보다 이전 일 수 없습니다.");
                return false;
            }
        }
    }

    return true;
}

function fnSearchVail() {
    if (_fnToNull($("#From_Date").val()) == "") {
        _fnAlertMsg("시작일자를 입력해주세요.", "From_Date");
        //$("#From_Date").focus();
        return false;
    }

    if (_fnToNull($("#To_Date").val()) == "") {
        _fnAlertMsg("종료일자를 입력해주세요.", "To_Date");
        //$("#To_Date").focus();
        return false;
    }

    return true;
}

//#endregion Vali Func End


function fnDateForm(strDate, id) {
    var date = new Date();
    var form_year = date.getFullYear().toString();
    var dateForm = "";
    var bindingID = "#" + id;

    if (strDate.length > 0) {
        if (strDate.length == 4) {
            dateForm = form_year + "-" + strDate.substr(0, 2) + "-" + strDate.substr(2, 2);
        }
        else if (strDate.length == 6) {
            dateForm = form_year.substr(0, 2) + strDate.substr(0, 2) + "-" + strDate.substr(2, 2) + "-" + strDate.substr(4, 2);
        }
        else if (strDate.length == 8) {
            dateForm = strDate.substr(0, 4) + "-" + strDate.substr(4, 2) + "-" + strDate.substr(6, 2);
        }
        else {
            dateForm = $(bindingID).val();
        }

        if (DateCampare(bindingID, dateForm)) {
            $(bindingID).val(dateForm);
        }
        else {
            $(bindingID).val(_fnPlusDate(0));
        }

    }
}
//#endregion Search Area End


//#region ★★List Area★★
function LoadPreviewPop() {

    fnMakePreviewPop(picObj);
    $('#LayerDispatch02').show();
}

function LoadStartPop() {
    fnMackStartPop(picObj);
    $('#LayerDispatch01').show();
}


function ListDetailInit() {
    $('.hidden_detail').hide();
    $('.btn_detail').text('상세');
    $('.btn_detail').removeClass("on");
    $('.detail').css('padding-bottom', '0');
}


//#endregion List Area End

//#endregion


//#region Drow List Area

//미리보기 팝업 그리기
function fnMakePreviewPop(pic_list) {

    $(".preview_pic_pop").empty();
    vHtml = "";
    $.each(pic_list, function (i) {
        vHtml += "<div class=\"preview_pic\">";
        vHtml += "  <div class=\"pic_box\">";
        if (_fnToNull(pic_list[i]) == "") {
            vHtml += "      <div class=\"n_img\">"
            vHtml += "          <img src=\"/Images/no_img.png\"><p>no-imge</p>";
            vHtml += "      </div>";
        }
        else {
            vHtml += "          <image src=\"" + _fnToNull(pic_list[i]) + "\" class=\"pic\">"
        }
        vHtml += "  </div>";
        vHtml += "</div>";
    });



    $(".preview_pic_pop").append(vHtml);
}


function fnMackStartPop(pic_list) {

    $(".start_pic_pop").empty();
    vHtml = "";
    $.each(pic_list, function (i) {
        vHtml += "<div class=\"preview_pic\">";
        vHtml += "  <div class=\"pic_box\">";
        if (_fnToNull(pic_list[i]) == "") {
            vHtml += "      <div class=\"n_img\">"
            vHtml += "          <img src=\"/Images/no_img.png\"><p>no-imge</p>";
            vHtml += "      </div>";
        }
        else {
            vHtml += "      <div class=\"n_img\" style=\"display:none;\">"
            vHtml += "          <img src=\"/Images/no_img.png\"><p>no-imge</p>";
            vHtml += "      </div>";
            vHtml += "          <image src=\"" + _fnToNull(pic_list[i]) + "\" class=\"pic\">"
            vHtml += "          <img src=\"/Images/delete_img.png\" class=\"d_img\"/>";
        }
        vHtml += "  </div>";
        vHtml += "</div>";
    });

    $(".start_pic_pop").append(vHtml);
}

//#endregion


// #region ☆☆☆☆ Only View Event ☆☆☆☆

$(document).on('click', '#move_top', function () {
    $('html, body').stop().animate({ scrollTop: 0 }, 500);
})



$(document).on('click', '#start_run', function () {
    location.href = '/OrderRun/index'
})

$(document).on('click', '.d_img', function () {
    var bg = $(this).parents('.pic_box');
    var noImg = $(this).parents('.pic_box').children('.n_img');
    var showImg = $(this).parents('.pic_box').children('.pic');
    noImg.show();
    showImg.hide();
    bg.css('background', '#efefef');
    $(this).hide();
})


$(document).on("click", '.seminar', function () {
    $(this).addClass("on");
})
$(document).on("click", '.seminar.on', function () {
    $(this).removeClass("on");
})


//$(document).on("click", '.video_btn', function () {
//    $('.video_area').show();
//});

$(document).on("click", '#alert04 .col1 .option', function () {
    $(this).addClass("on");
});
$(document).on("click", '#alert04 .col1 .option.on', function () {
    $(this).removeClass("on");
});
$(document).on("click", '#alert05 .col1 .option', function () {
    $(this).addClass("on");
});
$(document).on("click", '#alert05 .col1 .option.on', function () {
    $(this).removeClass("on");
});
//$(document).on("click", '#alert02 .col2 .option', function () {
//    $(this).addClass("on");
//});
//$(document).on("click", '#alert02 .col2 .option.on', function () {
//    $(this).removeClass("on");
//});
//$(document).on("click", '.col2 .option', function () {
//    $(this).addClass("on");
//});
//$(document).on("click", '.col2 .option.on', function () {
//    $(this).removeClass("on");
//    /*$('.feed_area').css('display', 'none');*/
//    /*$('.video_area').css('display', 'none');*/
//})
$(document).on("click", '.close', function () {
    $('#alert02').hide();
})

//$(document).on("click", '.stay_form', function () {
//    $(this).addClass("on");
//})
//$(document).on("click", '.stay_form.on', function () {
//    $(this).removeClass("on");
//})


//$(document).on("click", '.feed', function () {
//    $(this).addClass("on");
//})
//$(document).on("click", '.feed.on', function () {
//    $(this).removeClass("on");
//})
//$(document).on("click", '.video', function () {
//    $('.video').removeClass("on");
//    $(this).addClass("on");
//})
//$(document).on("click", '#close_video', function () {
//    $('.video_area').hide();
//})
//$(document).on("click", '#video', function () {
//    $('.video_area').show();
//})
$(document).on("click", '.select_region', function () {
    $('.popup').show();
})
$(document).on("click", '#close_region', function () {
    $('.popup').hide();
})


//$(document).on("click", '.option', function () {
//    $(this).addClass('on');
//$(this).attr('checked', true);
//})
//$(document).on("click", '.option.on', function () {
//    $(this).removeClass('on');
//$(this).attr('checked', false);
//})

$(document).on("click", 'span.show_policy', function () {
    $('.policy_text').slideDown();
    $(this).text('접기');
    $('span.show_policy').addClass('on');
})
$(document).on("click", '.show_policy.on', function (e) {
    e.stopImmediatePropagation();
    $('.policy_text').slideUp();
    $(this).text('보기');
    $('span.show_policy').removeClass('on');
})
$(document).on("keyup", "#quotCount", function () {
    var vValue = _fnToNull($("#quotCount").val());
    var vValue_Num = vValue.replace(/[^0-9]/g, "");

    $("#quotCount").val(vValue_Num);
    $('#input_people_NoLogin').val($(this).val())

})

$(document).on("keyup", "#input_people_NoLogin", function () {

    var vValue = _fnToNull($("#input_people_NoLogin").val());
    var vValue_Num = vValue.replace(/[^0-9]/g, "");

    $("#input_people_NoLogin").val(vValue_Num);
    $('.count_btn_NoLogin > #quotCount').val($(this).val())
})
//수량 증감 버튼
$(document).on('click', '.count_btn_NoLogin > button', function (e) {

    var $count = $(this).parent('.count_btn_NoLogin').find('#quotCount');
    var now = parseInt($count.val());
    var min = 1;
    var max = 9999;
    var num = now;

    if (isNaN(num)) {
        num =0;
    }

    if ($(this).hasClass('minus')) {
        var type = 'm';
    } else if ($(this).hasClass('plus')) {
        var type = 'p';
    }
    if (type == 'm') {
        if (now > min) {
            num = now - 1;
            $('#input_people_NoLogin').val(now - 1);
        }
    } else if (type == 'p') {
        if (now < max) {
            num = now + 1;
            $('#input_people_NoLogin').val(now + 1);
        }
    }
    if (num != now) {
        $count.val(num);
    }
});


$(document).on("keyup", "#input_people_simple", function () {

    var vValue = $("#input_people_simple").val();
    var vValue_Num = vValue.replace(/[^0-9]/g, "");

    $("#input_people_simple").val(vValue_Num);
    $('.count_btn_simple > #count_simple').val($(this).val())
})

$(document).on("keyup", "#count_simple", function () {
    var vValue = $("#count_simple").val();
    var vValue_Num = vValue.replace(/[^0-9]/g, "");

    $("#count_simple").val(vValue_Num);
    $('#input_people_simple').val($(this).val())

})

$(document).on('click', '.count_btn_simple > button', function (e) {
    e.stopImmediatePropagation();
    var $count = $(this).parent('.count_btn_simple').find('#count_simple');
    var now = parseInt($count.val());
    var min = 1;
    var max = 9999;
    var num = now;

    if (isNaN(num)) {
        num = 0;
    }

    if ($(this).hasClass('minus')) {
        var type = 'm';
    } else if ($(this).hasClass('plus')) {
        var type = 'p';
    }
    if (type == 'm') {
        if (now > min) {
            num = now - 1;
            $('#input_people_simple').val(now - 1);
        }
    } else if (type == 'p') {
        if (now < max) {
            num = now + 1;
            $('#input_people_simple').val(now + 1);
        }
    }
    if (num != now) {
        $count.val(num);
    }
});
$(document).on('click', '.login_estimate_btn', function () {
    $('#alert03').show();
    $('.img_slide_estimate2').not('.slick-initialized').slick();
    $('html').css('overflow', 'hidden');
});
$(document).on('click', '#test', function () {
    $('#alert05').show();
    $('html').css('overflow', 'hidden');
})
//휴대폰 체크
$(document).on("keyup", "#Tel_4", function () {
    var vValue = $("#Tel_4").val();

    if (this.value.toString().replace(/-/gi, '').length > 11) {
        vValue = this.value.substr(0, 11);
    }

    //Phone 하이픈 넣기
    if (vValue != "") {
        $(this).val(_fnMakePhoneForm(vValue));
    }
    if (!(event.keyCode >= 37 && event.keyCode <= 40)) {
        var inputVal = $(this).val();
        $(this).val(inputVal.replace(/[^0-9 | -]/gi, ''));
    }
});
//이름 체크
$(document).on("keyup", "#Name_4", function () {
    var vValue = $("#Name_4").val();

    if (!(event.keyCode >= 37 && event.keyCode <= 40)) {
        var inputVal = $(this).val();
        $(this).val(inputVal.replace(/[^a-zA-Zㄱ-힣]/g, ''));
    }
});

$(document).on('click', '#estimate_search', function () {
   // fnSearchList("SEARCH",1);

    $("#location").click();
        //sessionStorage.setItem("search", "Y");
        //if (sessionStorage.getItem("search") == "Y") {
        //    $("#location").click();
        //    sessionStorage.setItem("search", "");
        //}
    });

function fnSearchList(type,pageidx) {
    try {
        var objJsonData = new Object();

        objJsonData.ITEM_TYPE = $("#select_itemTpye option:selected").val();
        objJsonData.AREA = $("#select_area option:selected").val();
        objJsonData.MAX_TO = _fnToNull($("#MAX_TO")).val();
        objJsonData.KEYWORD = _fnToNull($("#Keyword")).val();
        objJsonData.TYPE = type;
        objJsonData.PAGE = pageidx;

        $.ajax({
            type: "POST", 
            url: "/Home/fnGetSearchList",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (result.Result[0]["trxCode"] == "Y") {
                    if ((objJsonData.TYPE) == "ROAD") {
                        fnMakeRoadList(result, "ROAD"); //연수다 추천
                        //drawMap('#koreaMap', "ROAD");
                    } else if ((objJsonData.TYPE == "SEARCH")) {
                        fnMakeSechList(result, "SEARCH"); //어디로 가실래요?
                    }
                } else if(result.Result[0]["trxCode"] == "N") {
                    console.log("[Fail - fnGetSearchList()]" + result.Result[0]["trxCode"]); 
                    //_fnAlertMsg("검색값이 없습니다.");
                } else if (result.Result[0]["trxCode"] == "E") {``
                console.log("[Fail - fnGetSearchList()]" + result.Result[0]["trxCode"]);
                }
            }, error: function (error) {
                console.log(error);
            }
        });     
    }
    catch (err) {
        alert("srfef")
        console.log("[Error - fnSearchList]" + err.message);
    }
}

//홈페이지 로드검색 함수
function fnMakeRoadList(result,type) {
    var vList = (result).TABLE;
    var vHtml = "";
    if (type == "ROAD") {
        $("#recommend").attr('checked', true);
        $("#location").attr('checked', false);
        $("#time").attr('checked', false);
        $('.location_con').hide();
        $('.time_con').hide();
        $('.recommend_con').show();
    }
    
    $.each(vList, function (i) {

        var vSplit = _fnToNull(vList[i]["TAG"]).split("#");
        var vImage = _fnToNull(vList[i]["IMG_PATH"]).split("|");
        var vUrl = _fnToNull(vList[i]["HOME_URL"]);
        var itemCnt = _fnToNull(vList[i]["ITEM_NM"]);
        var itemGrdCnt = _fnToNull(vList[i]["ITEM_GRD"]);



        vHtml += " <div class=\"info_con\">";
        vHtml += "      <div class=\"info_box\">";
        vHtml += "          <div class=\"info_group\">";
        vHtml += "              <div class=\"region_info\">";
        vHtml += "                  <p class=\"region_title\">" + _fnToNull(vList[i]["AREA"]);
        vHtml += "                  <span class=\"region_sub\">" + _fnToNull(vList[i]["ITEM_NM"]) + "</span>";
        if (itemGrdCnt != "") {
            vHtml += "                  <span class=\"line\">" + "|" + "</span>";
            vHtml += "                  <span class=\"star\">" + _fnToNull(vList[i]["ITEM_GRD"]) + "</span>";
        }
        vHtml += "                  </p>";
        vHtml += "                  <p class=\"region_sub_title\">" + _fnToNull(vList[i]["ADDR1"]) + " " +_fnToNull(vList[i]["ADDR2"]) + "</p>";
        vHtml += "              </div>";
        vHtml += "              <div class=\"sub_info_area\">";
            if (vSplit.length > 1) {
                $.each(vSplit, function (v) {
                    if (v > 0) {
                        vHtml += "<div class=\"sub_info\">";
                        vHtml += "<div class=\"_sub\">" + vSplit[v] + "</div>";
                        vHtml += "</div>";
                    }
                });
            }
        vHtml += "              </div>";
        var cnt = 5;
        if (vImage != "") {
            vHtml += "<div class=\"region_img_area\">";
            vHtml += "                 <input type='hidden' value='" + _fnToNull(vList[i]["ITEM_CD"]) + "'>";
            vHtml += "   <div class=\"img_slide\">";
            vHtml += "     <div class=\"img_slide_con\">";
            for (var m = 0; m < vImage.length; m++) {
                vHtml += "<div class=\"region_img1 region_img\"><img src='" + vImage[m] + "'/></div>";
                cnt -= 1;
            }
            if (cnt > 0) {
                for (var m = 0; m < cnt; m++) {
                    vHtml += "<div class='off region_img" + (m + 1) + " region_img'><img src='/Images/estimate_none.png'/></div>";
                }
            }
            vHtml += "     </div>";
            vHtml += "   </div>";
            vHtml += "</div>";
        } else {
            vHtml += "<div class=\"region_img_area\">";
            vHtml += "                 <input type='hidden' value='" + _fnToNull(vList[i]["ITEM_CD"]) + "'>";
            vHtml += "   <div class=\"img_slide\">";
            vHtml += "     <div class=\"img_slide_con\">";
            for (var m = 0; m < 5; m++) {
                vHtml += "<div class='off region_img" + (m + 1) + " region_img'><img src='/Images/estimate_none.png'/></div>";
            }
            vHtml += "     </div>";
            vHtml += "   </div>";
            vHtml += "</div>";
        }
        vHtml += "             <div class=\"estimate\">";
            vHtml += "                 <button type=\"button\" class=\"estimate_btn\" name=\"home_estimate\">견적문의</button>";
            vHtml += "                 <input type='hidden' value='" + _fnToNull(vList[i]["ITEM_CD"]) + "'>";
        vHtml += "             </div>";
        if (vUrl.length > 2) {
            vHtml += "             <div class=\"move_home\">";
            vHtml += "                 <a href=" + _fnToNull(vList[i]["HOME_URL"]) + " target=\"_blank\"><img src=\"/Images/region_home.png\"></a>";
            vHtml += "             </div>";
        } else {
            vHtml += "";
        }
        

        vHtml += "          </div>";
        vHtml += "      </div>";
        vHtml += " </div>";
    });

    $("#recommend_area").append(vHtml);


    $('.img_slide_con').not('.slick-initialized').slick({
        slidesToShow: 5,
        slidesToScroll: 5,
        responsive: [ // 반응형 웹 구현 옵션
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4
                }
            },
            {
                breakpoint: 530,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 430,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }
        ]
    });

} 

//검색버튼 눌렀을때 어디로 가실래요?탭 검색
function fnMakeSechList(result,type) {

    var vList = (result).TABLE;
    var vTotal = (result).TOTAL;
    var vHtml = "";
    if (type == "SEARCH") {
        $("#location").prop('checked', true);
        $("#time").prop('checked', false);
        $("#recommend").prop('checked', false);
        $('.location_con').show();
        $('.time_con').hide();
        $('.recommend_con').hide();

        SetMainMap(vTotal);
    }

    $.each(vList, function (i) {

        var vSplit = _fnToNull(vList[i]["TAG"]).split("#");
        var vImage = _fnToNull(vList[i]["IMG_PATH"]).split("|");
        var vUrl = _fnToNull(vList[i]["HOME_URL"]);
        var vitemGrdCnt = _fnToNull(vList[i]["ITEM_GRD"]);
        var vitemMin = _fnToNull(vList[i]["MIN_TO"]);
        var vitemMax = _fnToNull(vList[i]["MAX_TO"]);

        vHtml += " <div class=\"info_con\">";
        if (_fnToNull(vList[i]["REC_YN"]) == "Y") {
            vHtml += " <div class=\"info_box recommend_list\">";
        } else {
            vHtml += " <div class=\"info_box\">";
        }
        //vHtml += "      <div class=\"info_box\">";
        vHtml += "          <div class=\"info_group\">";
        vHtml += "              <div class=\"region_info\">";
        vHtml += "                  <p class=\"region_title\">" + _fnToNull(vList[i]["AREA"]);
        vHtml += "                  <span class=\"region_sub\">" + _fnToNull(vList[i]["ITEM_NM"]) + "</span>";
        if (vitemGrdCnt != "") {
            vHtml += "                  <span class=\"line\">" + "|" + "</span>";
            vHtml += "                  <span class=\"star\">" + _fnToNull(vList[i]["ITEM_GRD"]) + "</span>";
        }
        if (vitemMax != "" || vitemMin != "") {
            vHtml += "                  <span class=\"size\">"
            vHtml += "                      <span class=\"line\">" + "|" + "</span>";
            vHtml += "                      <img src=\"/Images/icn_size.png\">" + "규모 : " + _fnToNull(vList[i]["MIN_TO"]) + " ~ " + _fnToNull(vList[i]["MAX_TO"]) + "명";
            vHtml += "                      </span>";
        }
        vHtml += "                  </p>";
        vHtml += "                  <p class=\"region_sub_title\">" + _fnToNull(vList[i]["ADDR1"]) + " " + _fnToNull(vList[i]["ADDR2"]) + "</p>";
        vHtml += "              </div>";
        vHtml += "              <div class=\"sub_info_area\">";
        if (vSplit.length > 1) {
            $.each(vSplit, function (v) {
                if (v > 0) {
                    vHtml += "<div class=\"sub_info\">";
                    vHtml += "<div class=\"_sub\">" + vSplit[v] + "</div>";
                    vHtml += "</div>";
                }
            });
        }
        vHtml += "              </div>";
        var cnt = 5;
        if (vImage != "") {
            vHtml += "<div class=\"region_img_area\">";
            vHtml += "                 <input type='hidden' value='" + _fnToNull(vList[i]["ITEM_CD"]) + "'>";
            vHtml += "   <div class=\"img_slide\">";
            vHtml += "     <div class=\"img_slide_con\">";
            for (var m = 0; m < vImage.length; m++) {
                vHtml += "<div class=\"region_img1 region_img\"><img src='" + vImage[m] + "'/></div>";
                cnt -= 1;
            }
            if (cnt > 0) {
                for (var m = 0; m < cnt; m++) {
                    vHtml += "<div class='off region_img" + (m + 1) + " region_img'><img src='/Images/estimate_none.png'/></div>";
                }
            }
            vHtml += "     </div>";
            vHtml += "   </div>";
            vHtml += "</div>";
        } else {
            vHtml += "<div class=\"region_img_area\">";
            vHtml += "                 <input type='hidden' value='" + _fnToNull(vList[i]["ITEM_CD"]) + "'>";
            vHtml += "   <div class=\"img_slide\">";
            vHtml += "     <div class=\"img_slide_con\">";
            for (var m = 0; m < 5; m++) {
                vHtml += "<div class='off region_img" + (m + 1) + " region_img'><img src='/Images/estimate_none.png'/></div>";
            }
            vHtml += "     </div>";
            vHtml += "   </div>";
            vHtml += "</div>";
        }
        vHtml += "             <div class=\"estimate\">";
        vHtml += "                 <button type=\"button\" class=\"estimate_btn\" name=\"home_estimate\">견적문의</button>";
        vHtml += "                 <input type='hidden' value='" + _fnToNull(vList[i]["ITEM_CD"]) + "'>";
        vHtml += "             </div>";
        if (vUrl.length > 2) {
            vHtml += "             <div class=\"move_home\">";
            vHtml += "                 <a href=" + _fnToNull(vList[i]["HOME_URL"]) + " target=\"_blank\"><img src=\"/Images/region_home.png\"></a>";
            vHtml += "             </div>";
        } else {
            vHtml += "";
        }
        vHtml += "          </div>";
        vHtml += "      </div>";
        vHtml += " </div>";
    });



    $("#location_area").append(vHtml);

    

    $('.img_slide_con').not('.slick-initialized').slick({
        slidesToShow: 5,
        slidesToScroll: 5,
        responsive: [ // 반응형 웹 구현 옵션
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4
                }
            },
            {
                breakpoint: 530,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 430,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }
        ]
    });
}

function fnSchCommentList(pageidx) {
    try {
        var objJsonData = new Object();

        objJsonData.EMAIL = $("#Session_EMAIL").val();
        objJsonData.PAGE = pageidx;

        $.ajax({
            type: "POST",
            url: "/Home/fnSchCommentList",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (result.Result[0]["trxCode"] == "Y") {
                    fnMakeCommentList(result); //연수다와 함께한 시간
                } else if (result.Result[0]["trxCode"] == "N") {
                    //console.log("[Fail - fnSchCommentList()]" + result.Result[0]["trxCode"]);
                    /*_fnAlertMsg("검색값이 없습니다.");*/
                } else if (result.Result[0]["trxCode"] == "E") {
                    console.log("[Fail - fnSchCommentList()]" + result.Result[0]["trxCode"]);
                }
            }, error: function (error) {
                console.log(error);
            }
        });
    }
    catch (err) {
        console.log("[Error - fnSchCommentList]" + err.message);
    }
}
//이메일 체크
$(document).on("keyup", "#Email_4", function () {
    var vValue = $("#Email_4").val();

    vValue = $("#Email_4").val().trim();

    var regExp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;


    if (regExp.test(vValue) == false) {
        $("#Span_Waning_ID_4").css("display", "block");
        return false;
    } else {
        $("#Span_Waning_ID_4").css("display", "none");
        return true;
    }
});


////ETD 날짜 yyyymmdd 로 입력 시 yyyy-mm-dd 로 변경
//$(document).on("focusout", "#From_Date_4", function () {
//    var vValue = $("#From_Date_4").val();

//    if (vValue.length > 0) {
//        var vValue_Num = vValue.replace(/[^0-9]/g, "");
//        if (vValue != "") {
//            vValue = vValue_Num.substring("0", "4") + "-" + vValue_Num.substring("4", "6") + "-" + vValue_Num.substring("6", "8");
//            $(this).val(vValue);
//        }

//        //값 벨리데이션 체크
//        if (!_fnisDate_layer($(this).val())) {
//            $(this).val(_fnPlusDate(0));
//        }

//        //날짜 벨리데이션 체크
//        var vETD = $("#From_Date_4").val().replace(/[^0-9]/g, "");
//        var vETA = $("#To_Date_4").val().replace(/[^0-9]/g, "");

//        if (vETA < vETD) {
//            _fnLayerAlertMsg("시작일자는 종료일자보다 이후 일수 없습니다.");
//            $("#From_Date_4").val(vETA.substring("0", "4") + "-" + vETA.substring("4", "6") + "-" + vETA.substring("6", "8"));
//        }
//    }

//});

////ETD 날짜 yyyymmdd 로 입력 시 yyyy-mm-dd 로 변경
//$(document).on("focusout", "#To_Date_4", function () {
//    var vValue = $("#To_Date_4").val();

//    if (vValue.length > 0) {
//        var vValue_Num = vValue.replace(/[^0-9]/g, "");
//        if (vValue != "") {
//            vValue = vValue_Num.substring("0", "4") + "-" + vValue_Num.substring("4", "6") + "-" + vValue_Num.substring("6", "8");
//            $(this).val(vValue);
//        }
//        //값 벨리데이션 체크
//        if (!_fnisDate_layer($(this).val())) {
//            $(this).val(_fnPlusDate(10));
//        }
//    }
//    //날짜 벨리데이션 체크
//    var vFROM = $("#From_Date_4").val().replace(/[^0-9]/g, "");
//    var vTO = $("#To_Date_4").val().replace(/[^0-9]/g, "");

//    if (vTO < vFROM) {
//        _fnLayerAlertMsg("종료기간이 출발기간보다 짧을수 없습니다.");
//        $("#To_Date_4").val(vFROM.substring("0", "4") + "-" + vFROM.substring("4", "6") + "-" + vFROM.substring("6", "8"));
//    }
//});

////ETD 날짜 yyyymmdd 로 입력 시 yyyy-mm-dd 로 변경
//$(document).on("focusout", "#From_Date_5", function () {
//    var vValue = $("#From_Date_5").val();

//    if (vValue.length > 0) {
//        var vValue_Num = vValue.replace(/[^0-9]/g, "");
//        if (vValue != "") {
//            vValue = vValue_Num.substring("0", "4") + "-" + vValue_Num.substring("4", "6") + "-" + vValue_Num.substring("6", "8");
//            $(this).val(vValue);
//        }

//        //값 벨리데이션 체크
//        if (!_fnisDate_layer($(this).val())) {
//            $(this).val(_fnPlusDate(0));
//        }

//        //날짜 벨리데이션 체크
//        var vETD = $("#From_Date_5").val().replace(/[^0-9]/g, "");
//        var vETA = $("#To_Date_5").val().replace(/[^0-9]/g, "");

//        if (vETA < vETD) {
//            _fnLayerAlertMsg("시작일자는 종료일자보다 이후 일수 없습니다.");
//            $("#To_Date_5").val(vETD.substring("0", "4") + "-" + vETD.substring("4", "6") + "-" + vETD.substring("6", "8"));
//        }

//    }

//});

////ETD 날짜 yyyymmdd 로 입력 시 yyyy-mm-dd 로 변경
//$(document).on("focusout", "#To_Date_5", function () {
//    var vValue = $("#To_Date_5").val();

//    if (vValue.length > 0) {
//        var vValue_Num = vValue.replace(/[^0-9]/g, "");
//        if (vValue != "") {
//            vValue = vValue_Num.substring("0", "4") + "-" + vValue_Num.substring("4", "6") + "-" + vValue_Num.substring("6", "8");
//            $(this).val(vValue);
//        }
//        //값 벨리데이션 체크
//        if (!_fnisDate_layer($(this).val())) {
//            $(this).val(_fnPlusDate(0));
//        }
//        //날짜 벨리데이션 체크
//        var vETD = $("#From_Date_5").val().replace(/[^0-9]/g, "");
//        var vETA = $("#To_Date_5").val().replace(/[^0-9]/g, "");

//        if (vETA < vETD) {
//            _fnLayerAlertMsg("종료일자는 시작일자보다 이전 일수 없습니다.");
//            $("#To_Date_5").val(vETD.substring("0", "4") + "-" + vETD.substring("4", "6") + "-" + vETD.substring("6", "8"));
//        }
//    }
//});

////ETD 날짜 yyyymmdd 로 입력 시 yyyy-mm-dd 로 변경
//$(document).on("focusout", "#From_Date", function () {
//    var vValue = $("#From_Date").val();

//    if (vValue.length > 0) {
//        var vValue_Num = vValue.replace(/[^0-9]/g, "");
//        if (vValue != "") {
//            vValue = vValue_Num.substring("0", "4") + "-" + vValue_Num.substring("4", "6") + "-" + vValue_Num.substring("6", "8");
//            $(this).val(vValue);
//        }

//        //값 벨리데이션 체크
//        if (!_fnisDate_layer($(this).val())) {
//            $(this).val(_fnPlusDate(0));
//        }
//        //날짜 벨리데이션 체크
//        var vETD = $("#From_Date").val().replace(/[^0-9]/g, "");
//        var vETA = $("#To_Date").val().replace(/[^0-9]/g, "");
//        if (vETA != "") {
//        if (vETA < vETD) {
//            _fnLayerAlertMsg("시작일자는 종료일자보다 이후 일수 없습니다.");
//            $("#To_Date").val(vETD.substring("0", "4") + "-" + vETD.substring("4", "6") + "-" + vETD.substring("6", "8"));
//            $('#room_select').text("[당일] 일정입니다.");
//        }
//        }
//    }

//});

////ETD 날짜 yyyymmdd 로 입력 시 yyyy-mm-dd 로 변경
//$(document).on("focusout", "#To_Date", function () {
//    var vValue = $("#To_Date").val();

//    if (vValue.length > 0) {
//        var vValue_Num = vValue.replace(/[^0-9]/g, "");
//        if (vValue != "") {
//            vValue = vValue_Num.substring("0", "4") + "-" + vValue_Num.substring("4", "6") + "-" + vValue_Num.substring("6", "8");
//            $(this).val(vValue);
//        }
//        //값 벨리데이션 체크
//        if (!_fnisDate_layer($(this).val())) {
//            $(this).val(_fnPlusDate(0));
//        }
//        //날짜 벨리데이션 체크
//        var vETD = $("#From_Date").val().replace(/[^0-9]/g, "");
//        var vETA = $("#To_Date").val().replace(/[^0-9]/g, "");

//        if (vETA < vETD) {
//            _fnLayerAlertMsg("종료일자는 시작일자보다 이전 일수 없습니다.");
//            $("#To_Date").val(vETD.substring("0", "4") + "-" + vETD.substring("4", "6") + "-" + vETD.substring("6", "8"));
//        }
//    }
//});



$(document).on("focusout", "#From_cost5", function () {
    
    var vFromcost = $("#From_cost5").val().replace(/,/gi, "");
    var vTocost = $("#To_cost5").val().replace(/,/gi, "");

    if (parseInt(vFromcost) > parseInt(vTocost)) {
        _fnLayerAlertMsg("예산범위가 최대예산보다 최소예산이 큽니다.");
        $("#From_cost5").val("");
        }
    
});

$(document).on("focusout", "#To_cost5", function () {

    var vFromcost = $("#From_cost5").val().replace(/,/gi, "");
    var vTocost = $("#To_cost5").val().replace(/,/gi, "");

    if (parseInt(vFromcost) > parseInt(vTocost)) {
        _fnLayerAlertMsg("예산범위가 최대예산보다 최소예산이 큽니다.");
        $("#To_cost5").val("");
    }

});


$(document).on("focusout", "#From_cost4", function () {

    var vFromcost = $("#From_cost4").val().replace(/,/gi, "");
    var vTocost = $("#To_cost4").val().replace(/,/gi, "");

    if (parseInt(vFromcost) > parseInt(vTocost)) {
        _fnLayerAlertMsg("예산범위가 최대예산보다 최소예산이 큽니다.");
        $("#From_cost4").val("");
    }

});

$(document).on("focusout", "#To_cost4", function () {

    var vFromcost = $("#From_cost4").val().replace(/,/gi, "");
    var vTocost = $("#To_cost4").val().replace(/,/gi, "");

    if (parseInt(vFromcost) > parseInt(vTocost)) {
        _fnLayerAlertMsg("예산범위가 최대예산보다 최소예산이 큽니다.");
        $("#To_cost4").val("");
    }

});

$(document).on("focusout", "#input_people_simple", function () {
    var Chk = $('#input_people_simple').val();

    if (_fnToNull(Chk) == "") {
        $('#input_people_simple').val(0);
        $('#count_simple').val(0);
    }
})
$(document).on("focusout", "#count_simple", function () {
    var Chk = $('#count_simple').val();

    if (_fnToNull(Chk) == "") {
        $('#input_people_simple').val(0);
        $('#count_simple').val(0);
    }
})


$(document).on("click", "#Req_submit", function () {

    if (fnValidation_4() == true) {
        fnQuotRequire();
        //fnSendMail();
        $("#alert_close_4").click();
    }
    else {
        return false;
    }

});
$(document).on("click", "#Login_Req_submit", function () {
    if (_fnToNull(sessionStorage.getItem("Login")) == "Y") {
        if (fnValidation_Login()) {
            _fnLayerConfirmMsg_1("견적문의 하시겠습니까?");
        }
        else {
            return false;
        }
    } else {
        window.location = "/Login/index";
    }

});

//엔터키 입력시 마다 다음 input으로 가기 
$(document).keyup(function (e) {
    if (e.keyCode == 13) {
        //alert($(e.target).attr('data-index'));
        if ($(e.target).attr('data-index') != undefined) {
            var vIndex = $(e.target).attr('data-index');
            $('[data-index="' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
        }
    }
});

//동의하고 가입하기 벨리데이션 체크
function fnValidation_4() {

    try {
        var vRegion = _fnToNull($("#Region_4").val().trim());
        var vFrom_Date = _fnToNull($("#From_Date_4").val().replace(/[^0-9]/g, ""));
        var vTo_Date = _fnToNull($("#To_Date_4").val().replace(/[^0-9]/g, ""));
        var vinput_people = _fnToNull($('#input_people_NoLogin').val());
        var vEmail = _fnToNull($('#Email_4').val());
        var vName = _fnToNull($('#Name_4').val());
        var vTel = _fnToNull($('#Tel_4').val());
        var chk01 = _fnToNull($('#login_keep_pc').is(':checked'));
        var vFrom_cost = _fnToNull($('#From_cost4').val().replace(/,/gi, ""));
        var vTo_cost = _fnToNull($('#To_cost4').val().replace(/,/gi, ""));

        var regExp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;



        if (vRegion == "") {
            _fnLayerAlertMsgDataIndex("지역을 입력 해주세요.","Layer_Esti10");
            return false;
        }
        else if (vFrom_Date == "") {
            _fnLayerAlertMsgDataIndex("시작기간을 입력 해주세요.");
            return false;
        }
        else if (vTo_Date == "") {
            _fnLayerAlertMsgDataIndex("종료기간을 입력 해주세요.");
            return false;
        }
        else if (vFrom_cost == "") {
            _fnLayerAlertMsgDataIndex("최소예산 범위를 입력 해주세요.","Layer_Esti0");
            return false;
        }
        else if (vTo_cost == "") {
            _fnLayerAlertMsgDataIndex("최대예산 범위를 입력 해주세요.", "Layer_Esti1");
            return false;
        }
        else if (vinput_people == "") {
            _fnLayerAlertMsgDataIndex("인원을 입력 해주세요.", "Layer_Esti2");
            return false;
        }
        else if (vEmail == "") {
            _fnLayerAlertMsgDataIndex("이메일을 입력 해주세요.", "Layer_Esti3");
            return false;
        }
        else if (regExp.test(vEmail) == false) {
            _fnLayerAlertMsgDataIndex("이메일 형식으로 입력해주세요.", "Layer_Esti3");
            return false;
        }
        else if (vName == "") {
            _fnLayerAlertMsgDataIndex("이름을 입력 해주세요.", "Layer_Esti4");
            return false;
        }
        else if (vTel == "") {
            _fnLayerAlertMsgDataIndex("연락처를 입력 해주세요.", "Layer_Esti5");
            return false;
        }
        else if (parseInt(vFrom_cost) > parseInt(vTo_cost)) {
            _fnLayerAlertMsgDataIndex("예산금액이 최대예산보다 최소예산이 큽니다.", "Layer_Esti0");
            return false;
        }
        else if (vFrom_Date > vTo_Date) {
            _fnLayerAlertMsgDataIndex("예약날짜가 종료 날짜보다 큽니다.");
            return false;
        }
        else if (chk01 == false) {
            _fnLayerAlertMsgDataIndex("개인정보 처리방침를 체크해주세요.");
            return false;
        }
        return true;
        
    } catch (err) {
        console.log(err.message);
    }
}

//동의하고 가입하기 벨리데이션 체크
function fnValidation_Login() {


    try {
        var vRegion = _fnToNull($("#Region_5").val().trim());
        var vFrom_Date = _fnToNull($("#From_Date_5").val().replace(/[^0-9]/g, ""));
        var vTo_Date = _fnToNull($("#To_Date_5").val().replace(/[^0-9]/g, ""));
        var vinput_people = _fnToNull($('#input_people_simple').val());
        var vFrom_cost = _fnToNull($('#From_cost5').val().replace(/,/gi, ""));
        var vTo_cost = _fnToNull($('#To_cost5').val().replace(/,/gi, ""));


        if (vRegion == "") {
            _fnLayerAlertMsgDataIndex("지역을 입력 해주세요.", "Layer_Esti12");
            return false;
        }
        if (vFrom_Date == "") {
            _fnLayerAlertMsgDataIndex("시작기간을 입력 해주세요.");
            return false;
        }
        if (vTo_Date == "") {
            _fnLayerAlertMsgDataIndex("종료기간을 입력 해주세요.");
            return false;
        }
        if (vinput_people == "") {
            _fnLayerAlertMsgDataIndex("인원을 입력 해주세요.", "Layer_Esti16");
            return false;
        }
        if (vFrom_cost == "") {
            _fnLayerAlertMsgDataIndex("최소예산 범위를 입력 해주세요.", "Layer_Esti14");
            return false;
        }
        if (vTo_cost == "") {
            _fnLayerAlertMsgDataIndex("최대예산 범위를 입력 해주세요.", "Layer_Esti15");
            return false;
        }
        if (parseInt(vFrom_cost) > parseInt(vTo_cost)) {
            _fnLayerAlertMsgDataIndex("예산금액이 최대값보다 최소값이 큽니다.");
            return false;
        }
        if (vFrom_Date > vTo_Date) {
            _fnLayerAlertMsgDataIndex("시작날짜가 종료 날짜보다 큽니다.");
            return false;
        }
        return true;
 
    } catch (err) {
        console.log(err.message);
    }
}

$(document).on("click", "#Region_4", function (e) {
    Region_show("A1", "Region_Detail_4");
});

$(document).on("click", "#Region_5", function (e) {
    Region_show("A1", "Region_Detail_5");
});

function fnQuotRequire() {

    var objJsonData = new Object();
    var objJsonArray = new Array();
    var objJsonDataSet = new Object();

    var obj = {};
    objJsonData.QUOT_TYPE = "A";
    objJsonData.AREA = _fnToNull($("#Region_4").val());
    objJsonData.STRT_YMD = _fnToNull($("#From_Date_4").val().replace(/-/gi, ""));
    objJsonData.END_YMD = _fnToNull($("#To_Date_4").val().replace(/-/gi, ""));
    objJsonData.MIN_PRC = _fnToNull($("#From_cost4").val().replace(/,/gi, ""));
    objJsonData.MAX_PRC = _fnToNull($("#To_cost4").val().replace(/,/gi, ""));
    objJsonData.HEAD_CNT = _fnToNull($("#input_people_NoLogin").val());
    objJsonData.RMK = _fnToNull($("#Rmk_4").val().replace(/\[|\]/g, ''));
    objJsonData.REQ_NM = _fnToNull($("#Name_4").val());
    objJsonData.REQ_EMAIL = _fnToNull($("#Email_4").val());
    objJsonData.REQ_TEL = _fnToNull($("#Tel_4").val().replace(/-/gi, ""));
    objJsonData.USER_TYPE = "B";
    


    objJsonDataSet.MAIN = JSON.parse(_fnMakeJson(objJsonData));

    $("div[name='addopt_4']").each(function (index, item) {
        if ($(this).hasClass("on")) {
            obj = { id: index + 1 };
            var test = $(this).attr("id");
            var svc_cd = test.split(';')[0];
            var svc_nm = test.split(';')[1];
            //var dynamicObject = {};
            //dynamicObject[keyName] = keyValue;
            obj["SVC_CD"] = svc_cd;
            obj["SVC_NM"] = svc_nm;
            if (_fnToNull($("#Session_CUST_NAME").val()) != "") {
                obj["REQ_NM"] = _fnToNull($("#Session_CUST_NAME").val());
            } else {
                obj["REQ_NM"] = objJsonData.REQ_NM;
            }
            objJsonArray.push(obj);
        }
    });
    var jsonArry = JSON.parse(JSON.stringify(objJsonArray));
    objJsonDataSet.DTL = jsonArry;


    $.ajax({
        type: "POST",
        url: "/Home/fnQuotRequire",
        async: false,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonDataSet) },
        success: function (result) {
            _fnLayerAlertMsg("간편견적문의가 완료되었습니다.");
        },
        error: function (error) {
            _fnLayerAlertMsg("담당자 문의 하십시오.");
        }
    });
}

function fnQuotRequire_5() {

    var objJsonData = new Object();
    var objJsonArray = new Array();
    var objJsonDataSet = new Object();

    var obj = {};
    objJsonData.QUOT_TYPE = "A";
    objJsonData.AREA = _fnToNull($("#Region_5").val());
    objJsonData.STRT_YMD = _fnToNull($("#From_Date_5").val().replace(/-/gi, ""));
    objJsonData.END_YMD = _fnToNull($("#To_Date_5").val().replace(/-/gi, ""));
    objJsonData.MIN_PRC = _fnToNull($("#From_cost5").val().replace(/,/gi, ""));
    objJsonData.MAX_PRC = _fnToNull($("#To_cost5").val().replace(/,/gi, ""));
    objJsonData.HEAD_CNT = _fnToNull($("#input_people_simple").val());
    objJsonData.RMK = _fnToNull($("#Rmk_5").val().replace(/\[|\]/g, ''));
    objJsonData.REQ_NM = _fnToNull($("#Session_CUST_NAME").val());
    objJsonData.REQ_EMAIL = _fnToNull($("#Session_EMAIL").val());
    objJsonData.REQ_TEL = _fnToNull($("#Session_TELNO").val()).replace(/-/gi, "");
    objJsonData.USER_TYPE = _fnToNull($("#Session_USER_TYPE").val());
    objJsonData.REQ_CUST_NM = _fnToNull($("#Session_COMPANY").val());
    objJsonData.GRP_CD = _fnToNull($("#Session_GRP_CD").val());

    objJsonDataSet.MAIN = JSON.parse(_fnMakeJson(objJsonData));

    $("div[name='addopt_4']").each(function (index, item) {
        if ($(this).hasClass("on")) {
            obj = { id: index + 1 };
            var test = $(this).attr("id");
            var svc_cd = test.split(';')[0];
            var svc_nm = test.split(';')[1];
            //var dynamicObject = {};
            //dynamicObject[keyName] = keyValue;

            obj["SVC_CD"] = svc_cd;
            obj["SVC_NM"] = svc_nm;
            if (_fnToNull($("#Session_CUST_NAME").val()) != "") {
                obj["REQ_NM"] = _fnToNull($("#Session_CUST_NAME").val());

            } else {
                obj["REQ_NM"] = objJsonData.REQ_NM;
            }
            objJsonArray.push(obj);
        }
    });
    var jsonArry = JSON.parse(JSON.stringify(objJsonArray));
    objJsonDataSet.DTL = jsonArry;


    $.ajax({
        type: "POST",
        url: "/Home/fnQuotRequire",
        async: false,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonDataSet) },
        success: function (result) {
            if (result.rec_cd == "Y") {
                $("#EasyQuotNo").val(_fnToNull(result.res_msg));
                var objParam = new Object();
                objParam.MNGT_NO = _fnToNull($("#EasyQuotNo").val());
                controllerToLink("Index", "Estimate", objParam);
            } else if (result.rec_cd == "N") {
                _fnLayerAlertMsg("담당자 문의 하십시오.");
            }
        },
        error: function (error) {
            _fnLayerAlertMsg("담당자 문의 하십시오.");
        }
    });
}


$(document).on("click", '#QuotConfirm_1', function () {
    fnQuotRequire_5();
});


$(document).on("click", 'span.show_policy', function () {
    $('.policy_text').slideDown();
    $(this).text('접기');
    $('span.show_policy').addClass('on');
})
$(document).on("click", '.show_policy.on', function (e) {
    e.stopImmediatePropagation();
    $('.policy_text').slideUp();
    $(this).text('보기');
    $('span.show_policy').removeClass('on');
})



$(document).on("click", ".btnRegion_Detail_4", function () {

    var vValue = $(this).text();

    $("#Region_4").val(vValue);
    $("#Region_4").siblings('button').show();

    

    $("#close_region").click();
})

$(document).on("click", ".btnRegion_Detail_5", function () {

    var vValue = $(this).text();


    $("#Region_5").val(vValue);

    $("#Region_5").siblings('button').show();
    $("#close_region").click();
})


$(document).on('click', '#login_keep_pc', function () {

    var chk01 = $('#login_keep_pc').is(':checked');

    if (chk01) {
        $("#login_keep_pc").attr('checked', true);
    } else {
        $("#login_keep_pc").attr('checked', false);
    }

})

$(document).on("click", "#alert_close_4", function () {
    fnQuotReqClear();
    $(".delete").hide();
    var layer = $(this).parents('.layer_zone');
    layer.hide();


})

$(document).on("click", "#alert_close_5", function () {
    fnQuotReqClear_5();
    $(".delete").hide();
    var layer = $(this).parents('.layer_zone');
    layer.hide();


})


function fnQuotReqClear() {
    $("#Region_4").val("");
    $("#From_cost4").val("");
    $("#To_cost4").val("");
    $("#input_people_NoLogin").val("1");
    $("#quotCount").val("1");
    $("#From_Date_4").val(_fnPlusDate(0));
    $("#To_Date_4").val("");
    $("#From_Date").val(_fnPlusDate(0));
    $("#To_Date").val("");
    $("#From_Date_5").val(_fnPlusDate(0));
    $("#To_Date_5").val("");
    $("#Rmk_4").val("");
    $("#Email_4").val("");
    $("#Name_4").val("");
    $("#Tel_4").val("");
    $("#login_keep_pc").attr('checked', false);
};

function fnQuotReqClear_5() {
    $("#Region_5").val("");
    $("#From_cost5").val("");
    $("#To_cost5").val("");
    $("#From_Date_5").val(_fnPlusDate(0));
    $("#To_Date_5").val("");
    $("#From_Date").val(_fnPlusDate(0));
    $("#To_Date").val("");
    $("#input_people_simple").val("1");
    $("#count_simple").val("1");
    $("#Rmk_5").val("");
};

function fnAddoption(vJsonData, VId) {
    var vHtml = "";
    var vResult = vJsonData.Addoption_Show;

    $.each(vResult, function (i) {
        vHtml += " <div class='option_el'>";
        vHtml += "  <div class='option' name = 'addopt_4' id='" + _fnToNull(vResult[i]["COMM_CD"]) + ";" + _fnToNull(vResult[i]["COMM_NM"]) + "'> ";
        if (_fnToNull(vResult[i]["FILE_PATH"]) != "") {
            vHtml += "      <button type='button' id ='opt_4'><img src='" + _fnToNull(vResult[i]["FILE_PATH"]) + "/" + _fnToNull(vResult[i]["FILE_NM"]) + "'>" + _fnToNull(vResult[i]["COMM_NM"]) + "</button> ";
        } else if (_fnToNull(vResult[i].COMM_NM) == "스크린" || _fnToNull(vResult[i].COMM_NM) == "엑스박스" || _fnToNull(vResult[i].COMM_NM) == "빔 프로젝터" || _fnToNull(vResult[i].COMM_NM) == "빔프로젝터" || _fnToNull(vResult[i].COMM_NM) == "LCD 프로젝터" || _fnToNull(vResult[i].COMM_NM) == "LCD프로젝터" || _fnToNull(vResult[i].COMM_NM) == "DVD 플레이어") {
            vHtml += "<button type='button' id ='opt_4'><img src=\"/Images/camera.png\">" + _fnToNull(vResult[i].COMM_NM) + "</button>";
        } else if (_fnToNull(vResult[i].COMM_NM) == "기념품") {
            vHtml += "<button type='button' id ='opt_4'><img src=\"/Images/gift.png\">" + _fnToNull(vResult[i].COMM_NM) + "</button>";
        } else if (_fnToNull(vResult[i].COMM_NM) == "마이크") {
            vHtml += "<button type='button' id ='opt_4'><img src=\"/Images/play.png\">" + _fnToNull(vResult[i].COMM_NM) + "</button>";
        } else if (_fnToNull(vResult[i].COMM_NM) == "출력물" || _fnToNull(vResult[i].COMM_NM) == "프린트" || _fnToNull(vResult[i].COMM_NM) == "인쇄") {
            vHtml += "<button type='button' id ='opt_4'><img src=\"/Images/print.png\">" + _fnToNull(vResult[i].COMM_NM) + "</button>";
        } else {
            vHtml += "<button type='button' id ='opt_4'><img src=\"/Images/etc.png\">" + _fnToNull(vResult[i].COMM_NM) + "</button>";
        }
    

        vHtml += "  <input type='hidden' id ='Com_Cd_4' value='" + _fnToNull(vResult[i]["COMM_CD"]) + "'>";
        vHtml += "  <input type='hidden' id ='Com_Nm_4' value='" + _fnToNull(vResult[i]["COMM_NM"]) + "'>";
        vHtml += "  </div> ";
        vHtml += " </div> ";
    });

    $("#" + VId)[0].innerHTML = vHtml;

}

//$(document).on('click', 'a#estimate_search', function () {
//    sessionStorage.setItem("search", "Y");
//    if (sessionStorage.getItem("search") == "Y") {
//        $("#location").click();
//        sessionStorage.setItem("search", "");
//    }
//});

//연수다와 함께한 시간 로그인 화면 닫기
$(document).on('click', '#login_close', function () {
    $('.login_layer').hide();
})

//연수다와 함께한 시간
function fnMakeCommentList(result) {

    var vList = (result).TABLE;
    var vHtml = "";

    if (vList.length > 0) {
        $("#time_area").empty();
        $.each(vList, function (i) {

            var vSplit = _fnToNull(vList[i]["TAG"]).split("#");
            var vStar = _fnToNull(vList[i]["CMT_SCORE"]);
            var vimage1 = _fnToNull(vList[i]["CMT_IMG1_PATH"]);
            var vimage2 = _fnToNull(vList[i]["CMT_IMG2_PATH"]);
            var vimage3 = _fnToNull(vList[i]["CMT_IMG3_PATH"]);
            var vimage4 = _fnToNull(vList[i]["CMT_IMG4_PATH"]);

            vHtml += " <div class=\"info_con\">";
            vHtml += "  <div class=\"info_box\">";
            vHtml += "      <div class=\"info_group\">";
            vHtml += "          <div class=\"time_info\">";
            vHtml += "              <p class=\"time_title\">" + _fnToNull(vList[i]["CMT_SUBJECT"]) + "(" + _fnToNull(vList[i]["ITEM_NM"]) + ")" + "</p>";
            vHtml += "          </div>";
            vHtml += "          <div class=\"sub_info_area\">";
            if (vSplit.length > 1) {
                $.each(vSplit, function (v) {
                    if (v > 0) {
                        vHtml += "<div class=\"sub_info\">";
                        vHtml += "<div class=\"_sub\">" + vSplit[v] + "</div>";
                        vHtml += "</div>";
                    }
                });
            }
            vHtml += "          </div>";
            if (_fnToNull($("#Session_EMAIL").val()) == "") {
                vHtml += "          <div class=\"blur_div\">";
            } else {
                vHtml += "          <div class>";
            }
            vHtml += "              <p class=\"time_sub_title\">";
            vHtml += _fnToNull(vList[i]["CMT_CONTENTS"])
            vHtml += "              </p>";

            vHtml += "<div class=\"time_img_area\">";
            vHtml += "   <div class=\"img_slide\">";
            vHtml += "     <div class=\"img_slide_time\">";
            if (vimage1.length > 1) {
                vHtml += "<div class=\"time_img1 time_img\"><img src='" + _fnToNull(vList[i]["CMT_IMG1_PATH"]) + "'/></div>";
            }
            if (vimage2.length > 1) {
                vHtml += "<div class=\"time_img1 time_img\"><img src='" + _fnToNull(vList[i]["CMT_IMG2_PATH"]) + "'/></div>";
            }
            if (vimage3.length > 1) {
                vHtml += "<div class=\"time_img1 time_img\"><img src='" + _fnToNull(vList[i]["CMT_IMG3_PATH"]) + "'/></div>";
            }
            if (vimage4.length > 1) {
                vHtml += "<div class=\"time_img1 time_img\"><img src='" + _fnToNull(vList[i]["CMT_IMG4_PATH"]) + "'/></div>";
            }
            vHtml += "     </div>";
            vHtml += "   </div>";
            vHtml += "</div>";
            vHtml += "</div>";
            vHtml += "          <div class=\"rating\">";
            if (vStar != "") {
                for (s = 0; s < vStar; s++) {
                    vHtml += "<img src=\"/Images/rating.png\">";
                }
            }
            vHtml += "          </div>";
            vHtml += "      </div>";
            vHtml += "  </div>";
            vHtml += " </div>";
        })
    }
    if (_fnToNull($("#Session_EMAIL").val()) == "") {
        $("#login_time_area").show();
    }
        //$('.login_layer').show();
    //} else {
    //    vHtml += "	<div class='info_con'> ";
    //    vHtml += "        <div class='info_box'> ";
    //    vHtml += "            <div class='info_group'> ";
    //    vHtml += "                <div class='time_info'> ";
    //    vHtml += "                    <p class='time_title'>상반기 팀빌딩 워크샵 (시그니엘 부산)</p> ";
    //    vHtml += "                </div> ";
    //    vHtml += "                <div class='sub_info_area'> ";
    //    vHtml += "                    <div class='sub_info'> ";
    //    vHtml += "                        <div class='_sub'>50명 이상</div> ";
    //    vHtml += "                    </div> ";
    //    vHtml += "                    <div class='sub_info'> ";
    //    vHtml += "                        <div class='_sub'>세미나실 1</div> ";
    //    vHtml += "                    </div> ";
    //    vHtml += "                    <div class='sub_info'> ";
    //    vHtml += "                        <div class='_sub'>부산</div> ";
    //    vHtml += "                    </div> ";
    //    vHtml += "                    <div class='sub_info'> ";
    //    vHtml += "                        <div class='_sub'>숙박</div> ";
    //    vHtml += "                    </div> ";
    //    vHtml += "                    <div class='sub_info'> ";
    //    vHtml += "                        <div class='_sub'>조식</div> ";
    //    vHtml += "                    </div> ";
    //    vHtml += "                    <div class='sub_info'> ";
    //    vHtml += "                        <div class='_sub'>교통:버스</div> ";
    //    vHtml += "                    </div> ";
    //    vHtml += "                </div> ";
    //    vHtml += "                <div class=> ";
    //    vHtml += "                    <p class='time_sub_title'> ";
    //    vHtml += "                        너무 좋고 만족스러웠던 워크샵입니다. 역시 연수다를 통해서 해야해요~<br /> ";
    //    vHtml += "                        너무 좋고 만족스러웠던 워크샵입니다. 역시 연수다를 통해서 해야해요~ ";
    //    vHtml += "                    </p> ";
    //    vHtml += "                    <div class='time_img_area'> ";
    //    vHtml += "                        <div class='img_slide'> ";
    //    vHtml += "                            <div class='img_slide_time'> ";
    //    vHtml += "                                <div class='time_img1 time_img'><img src='/Images/time_img1.png' /></div> ";
    //    vHtml += "                                <div class='time_img2 time_img'><img src='/Images/time_img2.png' /></div> ";
    //    vHtml += "                                <div class='time_img3 time_img'><img src='/Images/time_img3.png' /></div> ";
    //    vHtml += "                            </div> ";
    //    vHtml += "                        </div> ";
    //    vHtml += "                    </div> ";
    //    vHtml += "                </div> ";
    //    vHtml += "                <div class='rating'> ";
    //    vHtml += "                    <img src='/Images/rating.png' /> ";
    //    vHtml += "                    <img src='/Images/rating.png' /> ";
    //    vHtml += "                    <img src='/Images/rating.png' /> ";
    //    vHtml += "                    <img src='/Images/rating.png' /> ";
    //    vHtml += "                    <img src='/Images/rating.png' /> ";
    //    vHtml += "                </div> ";
    //    vHtml += "            </div> ";
    //    vHtml += "        </div> ";
    //    vHtml += "    </div> ";
    //}
    $("#time_area").append(vHtml);

    $('.img_slide_time').not('.slick-initialized').slick({
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [ // 반응형 웹 구현 옵션
            {
                breakpoint: 530,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 430,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }
        ]
    });
    /*sessionStorage.setItem("TAB3_CLICK", "Y");*/
   /* $("#time").click();*/
}

//메인 견적문의 눌렀을때 값넣어주는함수
function HomeEstimate(item_cd) {

    var objJsonData = new Object();
    objJsonData.ITEM_CD = item_cd;
    objJsonData.GRP_CD = "A5";

    $.ajax({
        type: "POST",
        url: "/Estimate/HomeEstimate",
        async: false,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {
            //if (result.Itemtableconf_show.length == 0 || result.Itemtableroom_show.length == 0 || result.Itemtable_show.length == 0) {
            //    alert("h");
            //} else {
                HomeEstimateDetail(result);
            //}
        },
        error: function (error) {
            console.log("[Error - 홈견적문의]" + error.message);
        }
    });
}
//메인 견적문의 눌렀을때 값그려주는 함수
function HomeEstimateDetail(result) {
    try {
        var vHtml = "";
        $('div[name=est_tag]').empty(); //태그
        $('span[name=est_home_url]').empty(); //홈페이지url
        $(".location_info").removeClass('off');
        $('#layer_img_path').empty(); //상단이미지
        $('#layer_img_path_after').empty(); //로그인 후 상단이미지
        $('#layer_bottom_img_path').empty(); //하단이미지
        $('#layer_bottom_img_path_after').empty(); //로그인 후 하단이미지
        $('#room_form_box_2').empty(); //숙박
        $('#room_form_box_1').empty(); //숙박
        $('#conf_form_box_2').empty(); //세미나
        $('#conf_form_box_1').empty(); //세미나
        $('#feed_dtl_box_2').empty(); //식사
        $('#feed_dtl_box_1').empty(); //식사
        $('#option_etc_box_2').empty(); //부가서비스
        $('#option_etc_box_1').empty(); //부가서비스
        $('div[name=est_com_btn').empty(); //버튼안에 히든값 아이템코드 넣기
        /*$('div[name=option_food_box]').empty();*/
        $('#layer_evnet_img_path').empty(); //연수다 행사사진
        $('#layer_event_bottom_img_path').empty(); //하단 행사사진

        var voption = result.Addoption_Show;
        var vItem = result.Itemtable_show;
        var vConf = result.Itemtableconf_show;
        var vEtc = result.Itemtableetc_show;
        var vMeal = result.Itemtablemeal_show;
        var vRoom = result.Itemtableroom_show;

        var vTag = _fnToNull(vItem[0]["TAG"]).split("#");
        var vUrl = _fnToNull(vItem[0]["HOME_URL"]);
        if (vRoom.length > 0) {
            var vRoomNm = _fnToNull(vRoom[0]["ROOM_NM"]);
        }
        if (vConf.length > 0) {
            var vConfType = _fnToNull(vConf[0]["CONF_TYPE"]);
        }
        if (vEtc.length > 0) {
            var vEtcNm = _fnToNull(vEtc[0]["SVC_NM"]);
        }
        if (vMeal.length > 0) {
            var vMealdetail = _fnToNull(vMeal[0]["MEAL_NM"]);
        }
        /*var vImg = _fnToNull(vItem[0]["IMG_PATH"]);*/

        $('p[name=est_area]').text(_fnToNull(vItem[0].AREA)); //지역
        $('p[name=est_item_nm]').text(_fnToNull(vItem[0].ITEM_NM)); //호텔정보
        $('p[name=est_item_grd]').text(_fnToNull(vItem[0].ITEM_GRD)); //호텔등급
        $('p[name=est_addr]').text(_fnToNull(vItem[0].ADDR1) + " " + _fnToNull(vItem[0].ADDR2)); //호텔주소

        //태그
        if (vTag.length > 1) {
            $.each(vTag, function (i) {
                if (i > 0) {
                    vHtml += "         <div class=\"sub_info\">";
                    vHtml += "            <div class=\"_sub\">" + vTag[i] + "</div>";
                    vHtml += "         </div>";
                }
            });
        }
        $('div[name=est_tag]').append(_fnToNull(vHtml));
        vHtml = "";

        //홈페이지 url
        if (vUrl.length > 2) {
            vHtml += "<a href ='" + _fnToNull(vItem[0].HOME_URL) + "' target='_blank'>" + _fnToNull(vItem[0].HOME_URL) + "</a>";
            $('span[name=est_home_url]').append(_fnToNull(vHtml));
        } else {
            $(".location_info").addClass('off');
        }
        vHtml = "";


        // 상단 이미지
        var vImgHrml_item = "";
        var vImgHrml_activ = "";

        var item_cnt = 0;
        var active_cnt = 0;

        if (_fnToNull(vItem[0].IMG_PATH) != "") {
            $.each(vItem, function (i) {
                if (vItem[i].IMG_TYPE == "I") {
                    vImgHrml_item += "<div class='region_img" + (i + 1) + " region_img'><img src='" + _fnToNull(vItem[i].IMG_PATH) + "/" + _fnToNull(vItem[i].IMG_NM) + "'/></div>";
                    item_cnt += 1;
                }
                else if (vItem[i].IMG_TYPE == "A") {
                    vImgHrml_activ += "<div class='region_img" + (i + 1) + " region_img'><img src='" + _fnToNull(vItem[i].IMG_PATH) + "/" + _fnToNull(vItem[i].IMG_NM) + "'/></div>";
                    active_cnt += 1;
                }
            })
            if (item_cnt == 0) {
                vImgHrml_item += "<div class='region_img region_img'><img src='/Images/alert_slide_none_img.png'/></div>";
            }
            if (active_cnt == 0) {
                vImgHrml_activ += "<div class='region_img region_img'><img src='/Images/alert_slide_none_img.png'/></div>";
            }
        }
        else {
                vImgHrml_item += "<div class='region_img region_img'><img src='/Images/alert_slide_none_img.png'/></div>";
                vImgHrml_activ += "<div class='region_img region_img'><img src='/Images/alert_slide_none_img.png'/></div>";
        }
        $('#layer_img_path').append(_fnToNull(vImgHrml_item));
        $('#layer_evnet_img_path').append(_fnToNull(vImgHrml_activ));

        /* // 기존 이미지 그리기
        //이미지 슬릭슬라이드
        if (_fnToNull(vItem[0].IMG_PATH) != "") { //아이템타입이 I인것만
            $.each(vItem, function (i) {
                if (_fnToNull(vItem[i].IMG_TYPE) == 'I') {
                    vHtml += "<div class='region_img" + (i + 1) + " region_img'><img src='" + _fnToNull(vItem[i].IMG_PATH) + "/" + _fnToNull(vItem[i].IMG_NM) + "'/></div>";
                }
            })
        } else {
            vHtml += "<div class='region_img region_img'><img src='/Images/alert_slide_none_img.png'/></div>";
        }
        $('#layer_img_path').append(_fnToNull(vHtml));
        vHtml = "";

        //연수다 행사사진 슬라이드
        if (_fnToNull(vItem[0].IMG_PATH) != "") { //아이템타입이 A인것만
            $.each(vItem, function (i) {
                if (_fnToNull(vItem[i].IMG_TYPE) == 'A') {
                    vHtml += "<div class='region_img" + (i + 1) + " region_img'><img src='" + _fnToNull(vItem[i].IMG_PATH) + "/" + _fnToNull(vItem[i].IMG_NM) + "'/></div>";
                }
            })
        } else {
            vHtml += "<div class='region_img region_img'><img src='/Images/alert_slide_none_img.png'/></div>";
        }
        $('#layer_evnet_img_path').append(_fnToNull(vHtml));
        */

        //***************************************************************************************************************************************************************************************

        //하단이미지
        var vImgHtml_item = "";
        var vImgHtml_activ = "";

        var item_bottom_cnt = 0;
        var active_bottom_cnt = 0;

        if (_fnToNull(vItem[0].IMG_PATH) != "") {
            $.each(vItem, function (i) {
                var vItemImg = _fnToNull(vItem[i]['IMG_PATH']);
                //시설 사진
                if (vItem[i].IMG_TYPE == "I") {
                    if (vItemImg.length > 1) {
                        vImgHtml_item += "<div class='region_img" + (i + 1) + " region_img' name='Quot_Facility_Img'><img src='" + _fnToNull(vItem[i].IMG_PATH) + "/" + _fnToNull(vItem[i].IMG_NM) + "'/ ></div>";
                        item_bottom_cnt += 1;
                    }
                }//행사사진
                else if (vItem[i].IMG_TYPE == "A") {
                    if (vItemImg.length > 1) {
                        vImgHtml_activ += "<div class='region_img" + (i + 1) + " region_img' name='Quot_Event_Img'><img src='" + _fnToNull(vItem[i].IMG_PATH) + "/" + _fnToNull(vItem[i].IMG_NM) + "'/></div>";
                        active_bottom_cnt += 1;
                    }
                }
            })
            for (var item_bottom_cnt = 0; item_bottom_cnt < 5; item_bottom_cnt++) {
                vImgHtml_item += "<div class='region_img" + (item_bottom_cnt + 1) + " region_img noo'><img src='/Images/estimate_none.png'/></div>";
            }
            for (var active_bottom_cnt = 0; active_bottom_cnt < 5; active_bottom_cnt++) {
                vImgHtml_activ += "<div class='region_img" + (active_bottom_cnt + 1) + " region_img noo'><img src='/Images/estimate_none.png'/></div>";
            }
            //행사사진은 있고 시설사진이 없을때
            if (item_bottom_cnt == 0) {
                for (var i = 0; i < 5; i++) {
                    vImgHtml_item += "<div class='region_img" + (i + 1) + " region_img noo'><img src='/Images/estimate_none.png'/></div>";
                }
            }
            //시설사진은 있고 행사사진이 없을때
            if (active_bottom_cnt == 0) {
                for (var i = 0; i < 5; i++) {
                    vImgHtml_activ += "<div class='region_img" + (i + 1) + " region_img noo'><img src='/Images/estimate_none.png'/></div>";
                }
            }
        }
        else {
            //둘다 없을때
            for (var i = 0; i < 5; i++) {
                vImgHtml_item += "<div class='region_img" + (i + 1) + " region_img noo'><img src='/Images/estimate_none.png'/></div>";
                vImgHtml_activ += "<div class='region_img" + (i + 1) + " region_img noo'><img src='/Images/estimate_none.png'/></div>";
            }
        }
        $('#layer_bottom_img_path').append(vImgHtml_item);
        $('#layer_event_bottom_img_path').append(vImgHtml_activ);

        //vHtml = "";
        //////하단 이미지
        //if (_fnToNull(vItem[0].IMG_PATH) != "") {
        //    var imgCnt = vItem.length;
        //        for (var i = 0; i < 5; i++) {
        //            if (vItem.length > i) {
        //                vHtml += "<div class='region_img" + (i + 1) + " region_img'><img src='" + _fnToNull(vItem[i].IMG_PATH) + "/" + _fnToNull(vItem[i].IMG_NM) + "'/></div>";
        //            } else {
        //                vHtml += "<div class='region_img" + (i + 1) + " region_img'><img src='/Images/estimate_none.png'/></div>";
        //            }
        //        }
            
        //} else {
        //    for (var i = 0; i < 5; i++) {
        //            vHtml += "<div class='region_img" + (i + 1) + " region_img'><img src='/Images/estimate_none.png'/></div>";
        //    }
        //}
        //$('#layer_bottom_img_path').append(vHtml);
        //vHtml = "";

        ////하단 행사사진 이미지
        //if (_fnToNull(vItem[0].IMG_PATH) != "") {
        //    var imgCnt = vItem.length;
        //        for (var i = 0; i < 5; i++) {
        //            if (vItem.length > i) {
        //                vHtml += "<div class='region_img" + (i + 1) + " region_img'><img src='" + _fnToNull(vItem[i].IMG_PATH) + "/" + _fnToNull(vItem[i].IMG_NM) + "'/></div>";
        //            } else {
        //                vHtml += "<div class='region_img" + (i + 1) + " region_img'><img src='/Images/estimate_none.png'/></div>";
        //            }
        //        }
            

        //} else {
        //    for (var i = 0; i < 5; i++) {
        //        vHtml += "<div class='region_img" + (i + 1) + " region_img'><img src='/Images/estimate_none.png'/></div>";
        //    }
        //}
        //$('#layer_event_bottom_img_path').append(vHtml);
        //vHtml = "";

        //숙박
        if (vRoom.length == 0) {
            $("#stay_room").hide();
        } else if (vRoomNm.length > 1) {
            $("#stay_room").show();
            $.each(vRoom, function (i) {
                if (i >= 0) {
                    vHtml += "<div class=\"stay_form stay_form_after\"> ";
                    vHtml += "<p>" + _fnToNull(vRoom[i].ROOM_NM) + "</p>";
                    vHtml += "<div class=\"count_btn\"> ";
                    vHtml += "<button class=\"minus\" id=\"minus\"></button>";
                    vHtml += "<input type=\"text\" class=\"ChkCount\" id=\"count\" value=\"0\" maxlength=\"4\" onlynumber>";
                    vHtml += "<button class=\"plus\" id=\"plus\"></button>";
                    vHtml += "</div>";
                    vHtml += "</div>";
                }
            })
        }
        if (_fnToNull($("#Session_EMAIL").val()) == "") {
            $('#room_form_box_2').append(vHtml);
        } else {
            $('#room_form_box_1').append(vHtml);
        }
        vHtml = "";

        //세미나룸
        if (vConf.length == 0) {
            $("#stay_seminar_area").hide();
        } else if (vConfType.length > 1) {
            $("#stay_seminar_area").show();
            $.each(vConf, function (i) {
                if (i >= 0) {
                    vHtml += "<div class=\"seminar seminar_form_after\"> ";
                    vHtml += "<button class=\"seminar_btn\">" + _fnToNull(vConf[i].CONF_TYPE) + "</button>";
                    if (_fnToNull(vConf[i].MAX_NUM != null)) {
                        vHtml += "<p class=\"room_info\">" + "최대 " + _fnToNull(vConf[i].MAX_NUM) + "명수용" + "</p>";
                    } else {
                        vHtml += "<p class=\"room_info\">" + "별도 문의" + "</p>";
                    }
                    vHtml += "</div>";
                }
            })
        }
        /*$('div[name=conf_form_box]').append(vHtml);*/

        if (_fnToNull($("#Session_EMAIL").val()) == "") {
            $('#conf_form_box_2').append(vHtml);
        } else {
            $('#conf_form_box_1').append(vHtml);
        }
        vHtml = "";
        //식사버튼
        //vhtml += "<div class=\"option feed_btn\" name=\"option_food_box\"> ";
        //vhtml += " <button class=\"option_btn\"><img src=\"~/Images/feed.png\" />식사</button> ";
        //vhtml += "</div> ";
        //$('div[name=option_food_box]').append(vHtml);
        //vHtml = "";
        if (vMeal.length == 0 && vEtc.length == 0) {
            $("#stay_add_option").hide();
        } else {
            $("#stay_add_option").show();
        }
        //추가옵션(부가서비스)
        if (vMeal.length > 0) {
            vHtml += "                 <div class=\"option_box\"> ";
            vHtml += "                     <div class=\"option feed_btn\" name=\"option_food_box\"> ";
            vHtml += "                         <button class=\"option_btn\"><img src=\"/Images/feed.png\"/>식사</button> ";
            vHtml += "                     </div> ";
            vHtml += "                     <div class=\"option_head\" style=\"display: none; \"> ";
            vHtml += "                         <div class=\"o_head\" data-value=\"SVC_CD\"></div> ";
            vHtml += "                         <div class=\"o_head\" data-value=\"SVC_NM\"></div> ";
            vHtml += "                     </div> ";
        }
        if (vEtc.length > 0) {
            $.each(vEtc, function (i) {
                if (i >= 0) {
                    vHtml += "<div class=\"option etc_form\">";
                    vHtml += "<button class=\"option_btn etc_form_after\">";
                    if (_fnToNull(vEtc[i].SVC_NM) == "스크린" || _fnToNull(vEtc[i].SVC_NM) == "엑스박스" || _fnToNull(vEtc[i].SVC_NM) == "빔 프로젝터" || _fnToNull(vEtc[i].SVC_NM) == "빔프로젝터" || _fnToNull(vEtc[i].SVC_NM) == "LCD 프로젝터" || _fnToNull(vEtc[i].SVC_NM) == "LCD프로젝터" || _fnToNull(vEtc[i].SVC_NM) == "DVD 플레이어") {
                        vHtml += "<img src=\"/Images/camera.png\">" + _fnToNull(vEtc[i].SVC_NM) + "</button>";
                    } else if (_fnToNull(vEtc[i].SVC_NM) == "기념품") {
                        vHtml += "<img src=\"/Images/gift.png\">" + _fnToNull(vEtc[i].SVC_NM) + "</button>";
                    } else if (_fnToNull(vEtc[i].SVC_NM) == "마이크") {
                        vHtml += "<img src=\"/Images/play.png\">" + _fnToNull(vEtc[i].SVC_NM) + "</button>";
                    } else if (_fnToNull(vEtc[i].SVC_NM) == "출력물" || _fnToNull(vEtc[i].SVC_NM) == "프린트" || _fnToNull(vEtc[i].SVC_NM) == "인쇄") {
                        vHtml += "<img src=\"/Images/print.png\">" + _fnToNull(vEtc[i].SVC_NM) + "</button>";
                    } else {
                        vHtml += "<img src=\"/Images/etc.png\">" + _fnToNull(vEtc[i].SVC_NM) + "</button>";
                    }
                    vHtml += "<div class='hidden_option' style='display:none'>" + _fnToNull(vEtc[i].SVC_CD) + "|" + _fnToNull(vEtc[i].SVC_NM) + "</div>";
                    vHtml += "</div>";
                }
            })
        }
        //if (vEtcNm.length > 1) {
        //    $.each(vEtc, function (i) {
        //        if (i >= 0) {
        //            vHtml += "<div class=\"option etc_form\">";
        //            vHtml += "<button class=\"option_btn etc_form_after\">";
        //            vHtml += "<img src=\"/Images/camera.png\">" + _fnToNull(vEtc[i].SVC_NM) + "</button>";
        //            vHtml += "<div class='hidden_option' style='display:none'>" + _fnToNull(vEtc[i].SVC_CD) + "|" + _fnToNull(vEtc[i].SVC_NM) + "</div>";
        //            vHtml += "</div>";
        //        }
        //    })
        //}
        vHtml += "                     <div class=\"feed_area\"> ";
        vHtml += "                         <h4>식사</h4> ";
        vHtml += "                         <div class=\"feed_choice\"> ";
        vHtml += "                             <div class=\"food_head\" style=\"display: none; \"> ";
        vHtml += "                                 <div class=\"f_head\" data-value=\"MEAL_CD\"></div> ";
        vHtml += "                                 <div class=\"f_head\" data-value=\"MEAL_NM\"></div> ";
        vHtml += "                             </div> ";
        if (_fnToNull($("#Session_EMAIL").val()) == "") {
            vHtml += "                             <div class=\"feed_box\" id=\"feed_dtl_box_2\"> ";
        } else {
            vHtml += "                             <div class=\"feed_box\" id=\"feed_dtl_box_1\"> ";
        }
        vHtml += "                             </div> ";
        vHtml += "                         </div> ";
        vHtml += "                         <button class=\"close_feed\" id=\"close_feed\"><img src=\"/Images/close.png\"></button> ";
        vHtml += "                     </div> ";
        vHtml += "                 </div> ";
    
    

        //if (vEtcNm.length > 1) {
        //    $.each(vEtc, function (i) {
        //        if (i >= 0) {
        //            vHtml += "<button class=\"option_btn etc_form_after\">";
        //            vHtml += "<img src=\"/Images/camera.png\">" + _fnToNull(vEtc[i].SVC_NM) + "</button>";
        //            vHtml += "<div class='hidden_option' style='display:none'>" + _fnToNull(vEtc[i].SVC_CD) + "|" +  _fnToNull(vEtc[i].SVC_NM) + "</div>";
        //        }
        //    })
        //}
        //$('div[name=option_etc_box]').append(vHtml);
        
        if (_fnToNull($("#Session_EMAIL").val()) == "") {
            $('#option_etc_box_2').append(vHtml);
        } else {
            $('#option_etc_box_1').append(vHtml);
        }
        vHtml = "";

        //식사버튼 클릭시
        if (vMeal.length != "") {
            $.each(vMeal, function (i) {
                if (i >= 0) {
                    vHtml += "<div class=\"feed feed_form_after\"> ";
                    vHtml += "  <p>" + _fnToNull(vMeal[i].MEAL_NM) + "</p>";
                    vHtml += "<div class='hidden_food' style='display:none'>" + _fnToNull(vMeal[i].MEAL_CD) + "|" + _fnToNull(vMeal[i].MEAL_NM) + "</div>";
                    vHtml += "</div>";
                }
            })
        }
        //$('div[name=feed_dtl_box]').append(vHtml);

        if (_fnToNull($("#Session_EMAIL").val()) == "") {
            $('#feed_dtl_box_2').append(vHtml);
        } else {
            $('#feed_dtl_box_1').append(vHtml);
        }
        vHtml = "";

        //하단 견적문의버튼
        if (_fnToNull($("#Session_EMAIL").val()) != "") {
            //vHtml += "<button type=\"button\" class=\"compare_btn\" id=\"est_compare_btn\">비교견적 받기</button>";
            /*vHtml += "<input type='hidden' value='" + _fnToNull(vItem[0]["ITEM_CD"]) + "'>";*/
            vHtml += "<button type=\"button\" class=\"estimate_btn_click\" id=\"est_estimate_btn\">견적요청하기</button>";
            vHtml += "<input type='hidden' value='" + _fnToNull(vItem[0]["ITEM_CD"]) + "'>";
        } else {
            /*vHtml += "<button type=\"button\" class=\"compare_btn\" id=\"est_compare_btn\">비교견적 받기</button>";*/
            /*vHtml += "<input type='hidden' value='" + _fnToNull(vItem[0]["ITEM_CD"]) + "'>";*/
            vHtml += "<button type=\"button\" class=\"estimate_btn_click\" id=\"est_estimate_btn\">견적요청하기</button>";
            vHtml += "<input type='hidden' id='main_item_cd' value='" + _fnToNull(vItem[0]["ITEM_CD"]) + "'>";
        }
        $('div[name=est_com_btn').append(vHtml);
        vHtml = "";

        ////슬릭 슬라이드 이미지
        $('.img_slide_estimate').not('.slick-initialized').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            setPosition: 0
        });

    } catch (err) {
        console.log("[Error - HomeEstimateDetail]" + err.message);
    }
}

////견적문의 창뜬후에 비교견적받기 클릭
//$(document).on('click', '#est_compare_btn', function (btn) {
//    var btn = 'N';
//    //if (_fnToNull(sessionStorage.getItem("Login")) == "Y") {
//        if (fnValidation_est_compare() == true) {
//            HomeEstimateCompare($('#est_compare_btn').siblings('input').val(), btn);
//        }
//    //} else {
//    //    window.location = "/Login/Index";
//    //}
//    //HomeEstimateCompare($('#est_compare_btn').siblings().val());
//});

//견적문의창 전송시 유효성체크
function fnValidation_est_compare() {
    try {
        var vFromdt = _fnToNull($("#From_Date").val().replace(/-/gi, "").trim());
        var vTodt = _fnToNull($("#To_Date").val().trim().replace(/-/gi, "").trim());
        var vEstminprc = _fnToNull($("#est_min_prc").val().replace(/,/gi, "").trim());
        var vEstmaxprc = _fnToNull($("#est_max_prc").val().replace(/,/gi, "").trim());
        var vEstheadCnt = _fnToNull($("#est_head_cnt").val().trim());
        var vEstRoom = _fnToNull($(".stay_form_box")).text().trim();

        if (vTodt == "") {
            _fnLayerAlertMsg("종료 날짜를 입력해주세요.");
            return false;
        }
        else if (vEstminprc == "") {
            _fnLayerAlertMsg("예상 최소금액을 입력해주세요.");
            $(document).on('click', '#findpwalert', function () {
                $("#est_min_prc").focus();
            })
            return false;
        }
        else if (vEstmaxprc == "") {
            _fnLayerAlertMsg("예상 최대금액을 입력해주세요.");
            $(document).on('click', '#findpwalert', function () {
                $("#est_max_prc").focus();
            })
            return false;
        }
        else if (vEstheadCnt == "") {
            _fnLayerAlertMsg("예상인원을 입력해주세요.");
            $(document).on('click', '#findpwalert', function () {
                $("#est_head_cnt").focus();
            })
            return false;
        }
        return true;

    } catch (err) {
        console.log("[fnValidation_est_compare]" + err.message);
    }
}

//온라인견적 예산범위 포커스아웃 예산 값체크
$(document).on("focusout", "#est_min_prc", function () {

    var vFromcost = $("#est_min_prc").val().replace(/,/gi, "");
    var vTocost = $("#est_max_prc").val().replace(/,/gi, "");

    if (parseInt(vFromcost) > parseInt(vTocost)) {
        _fnLayerAlertMsg("예산범위가 최대예산보다 최소예산이 큽니다.");
        $("#est_min_prc").val("");
        $(document).on('click', '#findpwalert', function () {
            $("#est_min_prc").focus();
        })
    }

});
//온라인견적 예산범위 포커스아웃 예산 값체크
$(document).on("focusout", "#est_max_prc", function () {

    var vFromcost = $("#est_min_prc").val().replace(/,/gi, "");
    var vTocost = $("#est_max_prc").val().replace(/,/gi, "");

    if (parseInt(vFromcost) > parseInt(vTocost)) {
        _fnLayerAlertMsg("예산범위가 최대예산보다 최소예산이 큽니다.");
        $("#est_max_prc").val("");
        $(document).on('click', '#findpwalert', function () {
            $("#est_max_prc").focus();
        })
    }

});

//견적전송
var objJD = new Object();
function HomeEstimateCompare(item_cd, btn) {
    try {

    var objJsonData = new Object();
    objJsonData.EST_YN = btn;
    objJsonData.REQ_NO = _fnSequenceMngt("REQ"); //REQ_NO
    objJsonData.AREA = $('#est_area_id').text(); //지역
    objJsonData.ITEM_CD = item_cd; //아이템코드
    objJsonData.ITEM_NM = $('#est_item_nm_id').text(); //호텔정보
    objJsonData.STRT_YMD = $("#From_Date").val().replace(/-/gi, ""); //시작일
    objJsonData.END_YMD = $("#To_Date").val().replace(/-/gi, ""); //종료일
    objJsonData.MIN_PRC = $('#est_min_prc').val().replace(/,/gi, ""); //최소금액
    objJsonData.MAX_PRC = $('#est_max_prc').val().replace(/,/gi, ""); //최대금액
 
    objJsonData.HEAD_CNT = $('#est_head_cnt').val(); //예상인원
        objJsonData.RMK = $('#est_rmk').val().replace(/\[|\]/g, '');
    objJsonData.REQ_NM = $('#Session_CUST_NAME').val(); //사용자이름
    objJsonData.REQ_EMAIL = $('#Session_EMAIL').val(); //사용자메일
    objJsonData.REQ_CUST_NM = $('#Session_COMPANY').val(); //사용자회사명
    objJsonData.REQ_TEL = $('#Session_TELNO').val().replace(/-/gi, ""); //사용자번호
        if (_fnToNull($("#Session_EMAIL").val() == "")) {
            objJsonData.USR_TYPE = 'B';
        } else {
            objJsonData.USR_TYPE = $('#Session_USER_TYPE').val(); //유저타입
        }
    objJsonData.GRP_CD = $('#Session_GRP_CD').val(); //사용자회사명

    objJD.MAIN = JSON.parse(_fnMakeJson(objJsonData));

    //객실
    var roomcolums = $('.room_head .r_head').map(function () {
        return $(this).attr('data-value');
    }).get();
     
    var obj1 = "";
    var arry = new Array();
    var chkOn = false;

    var roomcl = $('.stay_form_after').map(function (idx, el) {
        const td = $(el).children();
        obj1 = { id: idx + 1 };
        for (var i = 0; i < roomcolums.length; i++) {
            if ($(el).hasClass("on")) {
                chkOn = true;
                if (i == 0) {
                    obj1[roomcolums[i]] = td.text().trim();
                } else {
                    obj1[roomcolums[i]] = td.find('input').val().trim();
                }
            } else {
                chkOn = false;
            }
        }
        if (chkOn) {
            arry.push(obj1);
        }

        return obj1;
    }).get();

    var jsonArray = JSON.parse(JSON.stringify(arry));
    objJD.ROOM = jsonArray;

    //--------------------------------------------------

    obj1 = "";
    arry = new Array();
    //세미나
    var seminacolums = $('.seminar_head .s_head').map(function () {
        return $(this).attr('data-value'); 
    }).get();

    var seminacl = $('.seminar_form_after').map(function (idx, el) {
        const td = $(el);
        console.log(td);
        obj1 = { id: idx + 1 };
        for (var i = 0; i < seminacolums.length; i++) {
            if ($(el).hasClass("on")) {
                chkOn = true;
                obj1[seminacolums[i]] = td.find("button").text().trim();
            } else {
                chkOn = false;
            }
        }
        if (chkOn) {
            arry.push(obj1);
        }

        return obj1;
    }).get();

    var jsonArray = JSON.parse(JSON.stringify(arry));
    objJD.SEMINA = jsonArray;

    //--------------------------------------------------
    obj1 = "";
    arry = new Array();
    //푸드
    var foodcolums = $('.food_head .f_head').map(function () {
        return $(this).attr('data-value');
    }).get();

    var foodcl = $('.feed_form_after').map(function (idx, el) {
        const td = $(el);
        console.log(td);
        obj1 = { id: idx + 1 };
        for (var i = 0; i < foodcolums.length; i++) {
            if ($(el).hasClass("on")) {
                chkOn = true;
                if (i == 0) {
                    obj1[foodcolums[i]] = td.find('.hidden_food').text().split("|")[0].trim();
                } else {
                    obj1[foodcolums[i]] = td.find('.hidden_food').text().split("|")[1].trim();
                }
                
            } else {
                chkOn = false;
            }
        }
        if (chkOn) {
            arry.push(obj1);
        }

        return obj1;
    }).get();

    var jsonArray = JSON.parse(JSON.stringify(arry));
    objJD.FOOD = jsonArray;

    //--------------------------------------------------
    obj1 = "";
    arry = new Array();
    //부가서비스
    var optioncolums = $('.option_head .o_head').map(function () {
        return $(this).attr('data-value');
    }).get();

    var optioncl = $('.etc_form').map(function (idx, el) {
        const td = $(el);
        obj1 = { id: idx + 1 };
        for (var i = 0; i < optioncolums.length; i++) {
            if ($(el).hasClass("on")) {
                chkOn = true;
                if (i == 0) {
                    obj1[optioncolums[i]] = td.find(".hidden_option").text().split("|")[0].trim();
                } else {
                    obj1[optioncolums[i]] = td.find(".hidden_option").text().split("|")[1].trim();
                }
                
            } else {
                chkOn = false;
            }
        }
        if (chkOn) {
            arry.push(obj1);
        }

        return obj1;
    }).get();

    var jsonArray = JSON.parse(JSON.stringify(arry));
    objJD.ETC = jsonArray;

    console.log(objJD)

    $.ajax({
        type: "POST",
        url: "/Estimate/HomeEstimateCompare",
        async: false,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJD) },
        success: function (result) {
            if (result["rec_cd"] == "Y") {
                _fnLayerAlertMsg_2("견적문의가 요청되었습니다.");
                $(document).on('click', '#estalert', function () {
                    $("#Est_MngtNo").val(result["res_msg"]);
                    if (_fnToNull($("#Session_EMAIL").val()) != "") {
                        var objParam = new Object();
                        console.log()
                        objParam.MNGT_NO = _fnToNull($("#Est_MngtNo").val());
                        controllerToLink("Index", "Estimate", objParam);
                    }
                    //else {
                    //    location.reload();
                    //}
                })
                fnHomeEstimateClear();
                $("#alert03").hide();
                $("#alert02").hide();
            } else if (result["rec_cd"] == "N") {
                _fnLayerAlertMsg("담당자에게 문의 해주세요.");
            } else if (result["rec_cd"] == "E") {
                _fnLayerAlertMsg("담당자에게 문의 해주세요.");
            }
        }
    })
} catch (err) {
    console.log("[Error - HomeEstimateCompare()]" + err.message);
}
};

//목록 이미지클릭
function Alert01imgclick(item_cd) {
    var objJsonData = new Object();
    objJsonData.ITEM_CD = item_cd;

    $.ajax({
        type: "POST",
        url: "/Estimate/HomeEstimateImgClick",
        async: false,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {
            if (result.Result[0]["trxCode"] == "Y") {
                SetAlert01imgclick(result);
            }
        },
        error: function (error) {
            console.log("[Error - 이미지클릭]" + error.message);
        }
    });
}

function SetAlert01imgclick(result) {
    try {
        var vHtml = "";

        $('#01_item_tag').empty();
        $('#01_top_img').empty();
        $('#01_bottom_img').empty();
        $('div[name=img_ets_btn').empty();

        var vItem = result.TABLE;
        var vTag = _fnToNull(vItem[0]["TAG"]).split("#");
        var vUrl = _fnToNull(vItem[0]["HOME_URL"]);

        $('#01_item_nm').text(_fnToNull(vItem[0].ITEM_NM)); //호텔정보
        $('#01_item_addr').text("(" + _fnToNull(vItem[0].ADDR1) + _fnToNull(vItem[0].ADDR2) + ")" ); //호텔주소

        //태그
        if (vTag.length > 1) {
            $.each(vTag, function (i) {
                if (i > 0) {
                    vHtml += "         <div class=\"sub_info\">";
                    vHtml += "            <div class=\"_sub\">" + vTag[i] + "</div>";
                    vHtml += "         </div>";
                }
            });
        }
        $('#01_item_tag').append(_fnToNull(vHtml));
        vHtml = "";


        if (vUrl.length > 2) {
            $('#01_home_url').show();
            $('#01_home_url').attr("href", _fnToNull(vItem[0].HOME_URL));
        } else {
            $('#01_home_url').hide();
        }
        //홈이모티콘 클릭시 홈페이지이동
        //if (_fnToNull(vItem[0].HOME_URL) != "") {
        //    $('#01_home_url').attr("href", _fnToNull(vItem[0].HOME_URL));
        //} else {
        //    $('#01_home_url').attr("href", "");
        //}

        //이미지 슬릭슬라이드
        if (_fnToNull(vItem[0].IMG_PATH) != "") {
            $.each(vItem, function (i) {
                vHtml += "<div class='region_img" + (i + 1) + " region_img' name='Focus_Top_Img'><img name='Focus_Top_Path' src='" + _fnToNull(vItem[i].IMG_PATH) + "/" + _fnToNull(vItem[i].IMG_NM) + "'/></div>";
            })
        }
        $('#01_top_img').append(_fnToNull(vHtml));
        vHtml = "";

        //하단 이미지
        if (_fnToNull(vItem[0].IMG_PATH) != "") {
            $.each(vItem, function (i) {
                if (i < 5) {
                    vHtml += "<div class='region_img" + (i + 1) + " region_img' id='" + i +"' name='Focus_Bottom_Img'><img name='Focus_Bottom_Path' src='" + _fnToNull(vItem[i].IMG_PATH) + "/" + _fnToNull(vItem[i].IMG_NM) + "'/></div>";
                }
            })
        }
        $('#01_bottom_img').append(vHtml);
        vHtml = "";

        vHtml += "                 <button type=\"button\" class=\"estimate_btn\">견적문의</button>";
        vHtml += "                 <input type='hidden' value='" + _fnToNull(vItem[0]["ITEM_CD"]) + "'>";
        $('div[name=img_ets_btn').append(vHtml);
        vHtml = "";
    } catch(err) {
        console.log(err.message);
    }
}

$('body').on('click', function () {
    $('.pop-sch').hide();
})

$('html').click(function (e) {
    if ($(e.target).parents('.stay_form_area').length < 1) {
        $('.stay_form_area').hide();
    }
});
$('html').click(function (e) {
    if ($(e.target).parents('.feed_area').length < 1) {
        $('.feed_area').hide();
    }
});
$(document).on("keyup", "#MIN_TO", function () {

    var vValue = _fnToNull($("#MIN_TO").val());
    var vValue_Num = vValue.replace(/[^0-9]/g, "");

    $("#MIN_TO").val(vValue_Num);
})

$(document).on("keyup", "#MAX_TO", function () {

    var vValue = _fnToNull($("#MAX_TO").val());
    var vValue_Num = vValue.replace(/[^0-9]/g, "");

    $("#MAX_TO").val(vValue_Num);
})

$(document).on("keyup", "#est_head_cnt", function () {

    var vValue = _fnToNull($("#est_head_cnt").val());
    var vValue_Num = vValue.replace(/[^0-9]/g, "");

    $("#est_head_cnt").val(vValue_Num);
})

$(document).on("keyup", "#est_min_prc", function () {
    if (event.keyCode == 13) {
        $("#est_max_prc").focus();
    }
})

$(document).on("keyup", "#est_max_prc", function () {
    if (event.keyCode == 13) {
        $("#est_head_cnt").focus();
    }
})
//숙박 버튼클릭
$(document).on('click', '#room_select_btn', function () {
    var startDate = $("#From_Date").val().replace(/-/gi, ""); //시작일
    var endDate = $("#To_Date").val().replace(/-/gi, ""); //종료일

    var Date = _fnCompareDay(startDate, endDate);
    var Dateday = Date + 1

    $('#room_select').empty();

    $('#room_select').text("[숙박] 일정입니다. / " + "[" + Date + "]" + "박" + "[" + Dateday + "]" + "일 일정입니다.");
});
//당일 버튼클릭
$(document).on('click', '#room_date_select_btn', function () {
    $('#room_select').empty();
    $('#room_select').text("[당일] 일정입니다.");
    $(".stay_form ").each(function (i) {
        $(this).removeClass('on');
        $(this).find("#count").val(0);
    });
    var FromDt = _fnToNull($("#From_Date").val());
    $("#To_Date").val(FromDt);
});

//시작일 날짜변경
$(document).on('change', '.start_date', function () { /*연수다와 함께한시간 로그인id*/
    var startDate = $("#From_Date").val().replace(/-/gi, ""); //시작일
    var endDate = $("#To_Date").val().replace(/-/gi, ""); //종료일

    var Date = _fnCompareDay(startDate, endDate);
    var Dateday = Date + 1

    $('#room_select').empty();

    if (Date == 0) {
        $('#room_select').text("[당일] 일정입니다.");
        $('#room_date_select_btn').click();
    } else {
        $('#room_select').text("[숙박] 일정입니다. / " + "[" + Date + "]" + "박" + "[" + Dateday + "]" + "일 일정입니다.");
    }
});

//종료일 날짜변경
$(document).on('change', '.end_date', function () {
    var startDate = $("#From_Date").val().replace(/-/gi, ""); //시작일
    var endDate = $("#To_Date").val().replace(/-/gi, ""); //종료일

    var Date = _fnCompareDay(startDate, endDate);
    var Dateday = Date + 1

    $('#room_select').empty();
    if (Date == 0) {
        $('#room_select').text("[당일] 일정입니다.");
        $('#room_date_select_btn').click();
    } else {
        $('#room_select').text("[숙박] 일정입니다. / " + "[" + Date + "]" + "박" + "[" + Dateday + "]" + "일 일정입니다.");
    }
});

// 온라인견적 x키 클릭시 값 클리어
$(document).on("click", "#alert_close", function () {
    var layer = $(this).parents('.layer_zone');
    layer.hide();

    fnHomeEstimateClear();
})


$(document).on("click", "div[name='Focus_Bottom_Img']", function () {

    var Count = $(this).attr('id');
    $("#01_top_img").slick('slickGoTo', Count);


});

$(document).on("click", "div[name='Quot_Event_Img']", function () {

    var Count = $(this).index();
    console.log(Count);
    $("#layer_evnet_img_path").slick('slickGoTo', Count);


});

$(document).on("click", "div[name='Quot_Facility_Img']", function () {

    var Count = $(this).index();
    $("#layer_img_path").slick('slickGoTo', Count);


});


function fnHomeEstimateClear() {
    $("#est_min_prc").val("");
    $("#est_max_prc").val("");
    $("#est_head_cnt").val("");
    $("#From_Date").val(_fnPlusDate(0));
    $("#To_Date").val("");
    $("#From_Date_5").val(_fnPlusDate(0));
    $("#To_Date_5").val("");
    $("#est_rmk").val("");
    $('.choice_stay1').css('background', '#eeeff0');
    $('.choice_stay2').css('background', '#eeeff0');
    $("#room_select").text("");
    sessionStorage.removeItem("est_min_prc");
    sessionStorage.removeItem("est_max_prc");
    sessionStorage.removeItem("est_head_cnt");
    sessionStorage.removeItem("From_Date");
    sessionStorage.removeItem("To_Date");
    sessionStorage.removeItem("item_cd");
};

$(document).on("click", "#est_estimate_btn", function (btn) {
    var btn = 'Y';
    if (fnValidation_est_compare() == true) {
        _fnLayerConfirmMsg("견적 요청 하시겠습니까?");
        $(document).on("click", '#QuotRevConfirm', function (e) {
            e.stopImmediatePropagation();
            layerClose("#Confirm");
            HomeEstimateCompare($('#est_estimate_btn').siblings('input').val(), btn);
        })
    }
})
$(document).on('click', '.time_title', function () {
    sessionStorage.setItem("review", "Y");
    location.href = '/Service/index';
})

//비로그인 작성후 로그인시 세션스토리지값 담아두기
$(document).on('click', '#Estimate_login_btn', function () {
    var minprc = $("#est_min_prc").val();
    var maxprc = $("#est_max_prc").val();
    var headcnt = $("#est_head_cnt").val();
    var fromdate = $("#From_Date").val();
    var todate = $("#To_Date").val();
    var mainitemcd = $("#main_item_cd").val();

    sessionStorage.setItem("From_Date", fromdate);
    sessionStorage.setItem("To_Date", todate);
    sessionStorage.setItem("est_min_prc", minprc);
    sessionStorage.setItem("est_max_prc", maxprc);
    sessionStorage.setItem("est_head_cnt", headcnt);
    sessionStorage.setItem("item_cd", mainitemcd);
})
//비로그인 작성후 로그인엔터시 세션스토리지값 담아두기
$(document).on('keyup', '#Estimate_pw', function (e) {
    if (e.keyCode == 13) {
        var minprc = $("#est_min_prc").val();
        var maxprc = $("#est_max_prc").val();
        var headcnt = $("#est_head_cnt").val();
        var fromdate = $("#From_Date").val();
        var todate = $("#To_Date").val();
        var mainitemcd = $("#main_item_cd").val();

        sessionStorage.setItem("From_Date", fromdate);
        sessionStorage.setItem("To_Date", todate);
        sessionStorage.setItem("est_min_prc", minprc);
        sessionStorage.setItem("est_max_prc", maxprc);
        sessionStorage.setItem("est_head_cnt", headcnt);
        sessionStorage.setItem("item_cd", mainitemcd);
    }
});