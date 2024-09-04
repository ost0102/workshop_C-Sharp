$(function () {
    if (_fnToNull($("#Session_EMAIL").val()) == "") {
        window.location = "/Admin/Login";
        return false;
    } else { 
        RegionView();
        $("#From_Date_Quot").val(_fnPlusDate(-15));
        $("#To_Date_Quot").val(_fnPlusDate(15));
    }

    //input 실시간 - Validation
    $("input").keyup(function (e) {

        var $this = $(e.target);
        //Input => E-mail
        if ($this.attr('id') == "From_Date_Quot") {
            if (e.keyCode == 13) {
                $("#To_Date_Quot").focus();
            }
        }
        else if ($this.attr('id') == "To_Date_Quot") {
            if (e.keyCode == 13) {
                $("#Status").focus();
            }
        }
        else if ($this.attr('id') == "Status") {
            if (e.keyCode == 13) {
                $("#estimate_search").focus();
            }
        }
    })

    if (_fnToNull($("#View_MNGT_NO").val()) != "") {
        $("#estimate_search").click();
    }
});


$(document).ready(function () {
    $('.simple-estimate').hide();
    $('.company_info').hide();
});
$(document).on('click', '.show_detail', function () {
    $('#alert06').show();
    $('.img_slide_estimate_view').not('.slick-initialized').slick();
    $('body').addClass('noscroll');
})
$(document).on('click', '#alert_close', function () {
    $('#alert06').hide();
    $('body').removeClass('noscroll');
    $("#InquiryText").val("");
})


//$(document).on("click", '#request_btn', function () {
//    $('.estimate_list.request').show();
//    $('.estimate_list.done').hide();
//    $('.tab1').addClass('on');
//    $('.tab2').removeClass('on');
//    /*$("#QuotCompleteText").empty();*/
//    $("#Simple_Quot_List").children().eq(0).children().click();

//})
//$(document).on("click", '#done_btn', function () {
//    $('.estimate_list.request').hide();
//    $('.estimate_list.done').show();
//    $('.tab1').removeClass('on');
//    $('.tab2').addClass('on');    
//    QuotComplete();
//})

//function QuotComplete() {
//    var objJsonData = new Object();
//    objJsonData.REQ_EMAIL = _fnToNull($("#Session_EMAIL").val());
//    objJsonData.QUOT_TYPE = _fnToNull($("input[name='sort_btn']:checked").val());
//    objJsonData.AREA = _fnToNull($("#Region option:selected").val());
//    objJsonData.STRT_YMD = _fnToNull($("#From_Date_Quot").val().replace(/-/gi, ""));
//    objJsonData.END_YMD = _fnToNull($("#To_Date_Quot").val().replace(/-/gi, ""));
//    objJsonData.STATUS = _fnToNull($("#Status").val());
//    objJsonData.USER_TYPE = _fnToNull($("#Session_USER_TYPE").val());
//    objJsonData.STATUS = _fnToNull($("#HeaderStatus").val());


//    $.ajax({
//        type: "POST",
//        url: "/Estimate/QuotComplete",
//        async: true,
//        dataType: "json",
//        data: { "vJsonData": _fnMakeJson(objJsonData) },
//        success: function (result) {
//            if (result.Result[0]["trxCode"] == "Y") {
//                SimpleMyQuotListComplete(result);
//                $("#QuotCompleteText").children().eq(0).children().click();
//                $("#search_position").show();
//                $("#No_data").hide();
//                $("#No_Mo_data").hide();
//            } else if (result.Result[0]["trxCode"] == "N") {
//                $("#No_data").show();
//                $("#No_Mo_data").hide();
//                $("#search_position").hide();
//            }
//        },
//        error: function (error) {
//            alert("에러");
//        }
//    })
//};





$(document).on("click", '#estimate_search', function () {
    var objJsonData = new Object();
    objJsonData.REQ_EMAIL = _fnToNull($("#Session_EMAIL").val());
    objJsonData.QUOT_TYPE = _fnToNull($("input[name='sort_btn']:checked").val());
    objJsonData.AREA = _fnToNull($("#Region option:selected").val());
    objJsonData.STRT_YMD = _fnToNull($("#From_Date_Quot").val().replace(/-/gi, ""));
    objJsonData.END_YMD = _fnToNull($("#To_Date_Quot").val().replace(/-/gi, ""));
    objJsonData.STATUS = _fnToNull($("#Status").val());
    objJsonData.USER_TYPE = _fnToNull($("#Session_USER_TYPE").val());
    objJsonData.MNGT_NO = _fnToNull($("#View_MNGT_NO").val());
    objJsonData.GRP_CD = _fnToNull($("#Session_GRP_CD").val());
    $.ajax({
        type: "POST",
        url: "/Estimate/EstimateSearch",
        async: true,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {
            if (result.Result[0]["trxCode"] == "Y") {
                if (result.EstimateSearch_Show[0]["QUOT_TYPE"] == 'A') {//간편견적 조회
                    SimpleMyQuotListSimpleHeader(result);
                    $("#search_position_simple").show();
                    $(".con_area").removeClass('on');
                    $("#Simple_Quot_List").children().children().eq(0).children().click();
                    $(".no_data_area").hide();
                    $('#simple').prop('checked', true);
                    if (_fnToNull($("#View_MNGT_NO").val()) != "") {
                        $("#View_MNGT_NO").val("")
                    }
                } else if (result.EstimateSearch_Show[0]["QUOT_TYPE"] == 'B') {//온라인견적 조회
                        SimpleMyQuotListHeader(result);
                        $(".con_area").addClass('on');
                        $(".con_area").show();
                        $("#search_position_simple").hide();
                        $("#Simple_Quot_List").children().children().eq(0).children().click();
                        $(".no_data_area").hide();
                        $('#online').prop('checked', true);
                        if (_fnToNull($("#View_MNGT_NO").val()) != "") {
                            $("#View_MNGT_NO").val("")
                        }
                    }   
            }
            else {
                if (result.Result[0]["trxCode"] == "N") {
                    $(".no_data_area").show();
                    $("#search_position").removeClass('on');
                    $("#search_position").hide();
                    $("#search_position_simple").hide();
                    //$("#No_Mo_data").hide();
                    //$("#search_position").hide();
                }
            }
        },
        error: function (error) {
            alert("에러");
        },
        beforeSend: function () {
            $("#ProgressBar_Loading").show(); //프로그래스 바
        },
        complete: function () {
            $("#ProgressBar_Loading").hide(); //프로그래스 바
        }
    })
});




//ETD 날짜 yyyymmdd 로 입력 시 yyyy-mm-dd 로 변경
$(document).on("focusout", "#From_Date_Quot", function () {
    var vValue = $("#From_Date_Quot").val();

    if (vValue.length > 0) {
        var vValue_Num = vValue.replace(/[^0-9]/g, "");
        if (vValue != "") {
            vValue = vValue_Num.substring("0", "4") + "-" + vValue_Num.substring("4", "6") + "-" + vValue_Num.substring("6", "8");
            $(this).val(vValue);
        }

        //값 벨리데이션 체크
        if (!_fnisDate_layer($(this).val())) {
            $(this).val(_fnPlusDate(0));
        }

        //날짜 벨리데이션 체크
        var vETD = $("#From_Date_Quot").val().replace(/[^0-9]/g, "");
        var vETA = $("#To_Date_Quot").val().replace(/[^0-9]/g, "");

        if (vETA < vETD) {
            _fnAlertMsg("시작일자는 종료일자보다 이후 일수 없습니다.");
            $("#From_Date_Quot").val(vETA.substring("0", "4") + "-" + vETA.substring("4", "6") + "-" + vETA.substring("6", "8"));
        }
    }

});

//ETD 날짜 yyyymmdd 로 입력 시 yyyy-mm-dd 로 변경
$(document).on("focusout", "#To_Date_Quot", function () {
    var vValue = $("#To_Date_Quot").val();

    if (vValue.length > 0) {
        var vValue_Num = vValue.replace(/[^0-9]/g, "");
        if (vValue != "") {
            vValue = vValue_Num.substring("0", "4") + "-" + vValue_Num.substring("4", "6") + "-" + vValue_Num.substring("6", "8");
            $(this).val(vValue);
        }
        //값 벨리데이션 체크
        if (!_fnisDate_layer($(this).val())) {
            $(this).val(_fnPlusDate(10));
        }

        //날짜 벨리데이션 체크
        var vETD = $("#From_Date_Quot").val().replace(/[^0-9]/g, "");
        var vETA = $("#To_Date_Quot").val().replace(/[^0-9]/g, "");

        if (vETA < vETD) {
            _fnAlertMsg("종료일자는 시작일자보다 이전 일수 없습니다.");
            $("#To_Date_Quot").val(vETD.substring("0", "4") + "-" + vETD.substring("4", "6") + "-" + vETD.substring("6", "8"));
        }
    }
});

$(document).on("click", '.estimate_list_box', function () {
    $('.estimate_list_box').removeClass('online_box');
    $(this).addClass('online_box');
    
    var objJsonData = new Object();
    objJsonData.REQ_NO = $(this).find("input[name = 'ReqNo']").val();

    $.ajax({
        type: "POST",
        url: "/Estimate/SimpleComPareQuotList",
        async: true,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {
            if (result.Result[0]["trxCode"] == "Y") {
                if (result.SimpleComPareQuotList_Show[0]["QUOT_TYPE"] == "A") {
                    SimpleComPareQuotListDetail(result);
                    $("#CompareQuotDiv").show();
                    $("#CompareQuotNoData").hide();
                    $("#Compare_List").show();
                } else {
                    SimpleComPareQuotListDetail(result);
                    $("#CompareQuotDiv").show();
                    $("#CompareQuotNoData").hide();
                    $("#Compare_List").show();
                }
            } else if (result.Result[0]["trxCode"] == "N") {
                $("#CompareQuotDiv").show();
                $("#CompareQuotNoData").show();
                $("#Compare_List").hide();
                $("#quot_cnt").text("0개");
            }
        },
        error: function (error) {
            alert("에러");
        }
    });
})
function SimpleComPareQuotListDetail(vJsonData) {
    var vHtml = "";
    var vResult = vJsonData.SimpleComPareQuotList_Show;
    $("#quot_cnt").text(vResult.length + "개");

    $.each(vResult, function (i) {
        var ItemCnt = _fnToNull(vResult[i]['ITEM_NM']);
        var ItemGrdCnt = _fnToNull(vResult[i]['ITEM_GRD']);
        var ItemTypeCnt = _fnToNull(vResult[i]['ITEM_TYPE']);
        vHtml += "                     <div class='compare_list'>";
        if (_fnToNull(vResult[i]['IMG_PATH']) != "") {
            vHtml += "                                           <div class='compare_img'><img src='" + _fnToNull(vResult[i]['IMG_PATH']) + "'/ ></div>";
        } else {
            vHtml += "                                           <div class='compare_img'><img src='/Images/estimate_none.png'/></div>";
        }
        vHtml += "                                           <div class='compare_contents'>";
        vHtml += "                                               <div class='times'>";
        vHtml += "                                                   <div class='times_title'>";
        vHtml += "                                                       문의횟수";
        vHtml += "                                                   </div>";
        vHtml += "                                                   <div class='num_time'>";
        vHtml += "                                                       " + _fnToNull(vResult[i]['INQ_CNT']) + "";
        vHtml += "                                                   </div>";
        vHtml += "                                               </div>";
        vHtml += "                                               <div class='compare_info'>";
        vHtml += "                                                   <div class='compare_title'>";
        vHtml += "                                                       <span class='location_title'> " + _fnToNull(vResult[i]['AREA']) + "</span><span class='location_detail'> "
        if (ItemCnt != "") {
            vHtml += " " + _fnToNull(vResult[i]['ITEM_NM']);
        }
        if (ItemGrdCnt != "") {
            vHtml += " | " + _fnToNull(vResult[i]['ITEM_GRD']);
        }
        if (ItemTypeCnt != "") {
            vHtml += " | " + _fnToNull(vResult[i]['ITEM_TYPE']);
        }
        vHtml += "                                                   </span>";
        vHtml += "                                                   </div>";
        vHtml += "                                                   <div class='price'>";
        vHtml += "                                                       <span class='price_title'>총 견적금액&nbsp;:</span>";
        if (_fnGetNumber(_fnToZero(vResult[i]['TOT_AMT']), "sum") != 0) {
            vHtml += "    <span class='orange'>&nbsp " + _fnGetNumber(_fnToNull(vResult[i]['TOT_AMT']), 'sum') + '원' + " </span>";
        } else {
            vHtml += "    <span class='orange'>&nbsp별도 문의</span>";
        }
        vHtml += "    <span class='won'></span>";
        vHtml += "                                                   </div>";
        vHtml += "                                                   <div class='compare_detail'>";
        vHtml += "                                                       <span class='show_detail' name='QuotDetail'>견적상세보기</span>";
        vHtml += "                                                <input type ='hidden' name='QuotNo' value='" + _fnToNull(vResult[i]['QUOT_NO']) + "'/> ";
        vHtml += "                                                <input type ='hidden' name='Staus' value='" + _fnToNull(vResult[i]['QUOT_STATUS']) + "'/> ";
        vHtml += "                                                <input type ='hidden' name='item_cd' value='" + _fnToNull(vResult[i]['ITEM_CD']) + "'/> ";
        vHtml += "                                                   </div>";
        vHtml += "                                               </div>";
        vHtml += "                                           </div>";
        vHtml += "                                       </div>";

    });
    $("#Compare_List")[0].innerHTML = vHtml;

}


$(document).on("click", 'span[name=QuotDetail]', function () {

    var objJsonData = new Object();
    objJsonData.QUOT_NO = $(this).siblings("input[name = 'QuotNo']").val();
    objJsonData.INQ_TYPE ="A";
    objJsonData.ITEM_CD = $(this).siblings("input[name = 'item_cd']").val();
    $.ajax({
        type: "POST",
        url: "/Estimate/ComPareQuotDetail",
        async: false,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {
            ComPareQuotDetail(result);
            $('#talk_box').scrollTop($('#talk_box')[0].scrollHeight);
        },
        error: function (error) {
            alert("에러");
        }
    });
})

$(document).on("click", '#Refresh', function () {
    var objJsonData = new Object();
    objJsonData.QUOT_NO = $(this).parent().siblings(".inquiry").find("#Quot_MngtNo").val();
    objJsonData.INQ_TYPE = "A";
    objJsonData.ITEM_CD = $(this).parent().siblings(".inquiry").find("#Item_Cd").val();
    $.ajax({
        type: "POST",
        url: "/Estimate/TalkDataSearch",
        async: true,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {
            TalkDataSearch(result);
            $('#talk_box').scrollTop($('#talk_box')[0].scrollHeight);
        },
        error: function (error) {
            alert("에러");
        },
        beforeSend: function () {
            $("#ProgressBar_Loading_alert").show(); //프로그래스 바
        },
        complete: function () {
            $("#ProgressBar_Loading_alert").hide(); //프로그래스 바
        }
    });
})

function TalkDataSearch(vJsonData) {
    var vHtml = "";

    var gResult = _fnToNull(vJsonData.TalkDataSearch_Show);


    vHtml = "";


    $("#talk_box").empty();

    vHtml += "                                                    <div class='chat ch1'>";
    vHtml += "                                                        <div class='icon'><i class='fa-solid fa-user'></i></div>";
    vHtml += "                                                        <div class='talk_area'>";
    vHtml += "                                                            <div class='textbox'>문의사항 남겨주세요.</div>";
    vHtml += "                                                        </div>";
    vHtml += "                                                    </div>";
    $.each(gResult, function (a) {
        if (gResult[a]["USER_TYPE"] == "U") {
            vHtml += "                                                    <div class='chat ch2'>";
        }
        else {
            vHtml += "                                                    <div class='chat ch1'>";
        }
        /*vHtml += "                                                    <div class='chat ch2'>";*/
        vHtml += "                                                        <div class='icon'><i class='fa-solid fa-user'></i></div>";
        vHtml += "                                                        <div class='talk_area'>";
        vHtml += "                                                            <div class='textbox'>" + _fnToNull(gResult[a]['INQ_CONTENT']) + "</div>";
        vHtml += "                                                            <p class='talk_date'>" + _fnDateFormating(_fnToNull(gResult[a]['INQ_YMD'])) + "</p>";
        vHtml += "                                                        </div>";
        vHtml += "                                                    </div>";
        //if (_fnToNull(gResult[a]['ANSWER']) != "") {
        //    vHtml += "                                                    <div class='chat ch1'>";
        //    vHtml += "                                                        <div class='icon'><i class='fa-solid fa-user'></i></div>";
        //    vHtml += "                                                        <div class='talk_area'>";
        //    vHtml += "                                                            <div class='textbox'>" + _fnToNull(gResult[a]['ANSWER']) + "</div>";
        //    vHtml += "                                                            <p class='talk_date'>" + _fnToNull(_fnDateFormating(gResult[a]['ANS_YMD'])) + "</p>";
        //    vHtml += "                                                        </div>";
        //    vHtml += "                                                    </div>";
        //}
    })
    $("#talk_box").append(vHtml);
    if (gResult.length > 0) {
        $("#Inq_Cnt").text("문의횟수 : " + gResult[0]["INQ_CNT"] + '회');
    }
    else {
        $("#Inq_Cnt").text("문의횟수 : 0회");
    }
    
    vHtml = "";

}



function ComPareQuotDetail(vJsonData) {

    var vHtml = "";
    var aResult = _fnToNull(vJsonData.ComPareQuotRoom_Show);
    var bResult = _fnToNull(vJsonData.ComPareQuotMeal_Show);
    var cResult = _fnToNull(vJsonData.ComPareQuotSvc_Show);
    var dResult = _fnToNull(vJsonData.ComPareQuotConf_Show);
    var fResult = _fnToNull(vJsonData.ComPareQuotMst_Show);
    var gResult = _fnToNull(vJsonData.ComPareQuotInq_Show);
    var hResult = _fnToNull(vJsonData.ComPareQuotImg_Show);

    $('#layer_img_path').empty(); //상단이미지


    
    vHtml = "";


    $("#talk_box").empty();

    vHtml += "                                                    <div class='chat ch1'>";
    vHtml += "                                                        <div class='icon'><i class='fa-solid fa-user'></i></div>";
    vHtml += "                                                        <div class='talk_area'>";
    vHtml += "                                                            <div class='textbox'>문의사항 남겨주세요.</div>";
    vHtml += "                                                        </div>";
    vHtml += "                                                    </div>";
    $.each(gResult, function (a) {


        if (gResult[a]["USER_TYPE"] == "U") {
            vHtml += "                                                    <div class='chat ch2'>";
        }
        else {
            vHtml += "                                                    <div class='chat ch1'>";
        }
        //vHtml += "                                                    <div class='chat ch2'>";
        vHtml += "                                                        <div class='icon'><i class='fa-solid fa-user'></i></div>";
        vHtml += "                                                        <div class='talk_area'>";
        vHtml += "                                                            <div class='textbox'>" + _fnToNull(gResult[a]['INQ_CONTENT']) + "</div>";
        vHtml += "                                                            <p class='talk_date'>" + _fnDateFormating(_fnToNull(gResult[a]['INQ_YMD'])) + "</p>";
        vHtml += "                                                        </div>";
        vHtml += "                                                    </div>";
        //if (_fnToNull(gResult[a]['ANSWER']) != "") {
        //    vHtml += "                                                    <div class='chat ch1'>";
        //    vHtml += "                                                        <div class='icon'><i class='fa-solid fa-user'></i></div>";
        //    vHtml += "                                                        <div class='talk_area'>";
        //    vHtml += "                                                            <div class='textbox'>" + _fnToNull(gResult[a]['ANSWER']) + "</div>";
        //    vHtml += "                                                            <p class='talk_date'>" + _fnToNull(_fnDateFormating(gResult[a]['ANS_YMD'])) + "</p>";
        //    vHtml += "                                                        </div>";
        //    vHtml += "                                                    </div>";
        //}
    })
    $("#talk_box").append(vHtml);
    if (gResult.length > 0) {
        $("#Inq_Cnt").text("문의횟수 : " + gResult[0]["INQ_CNT"] + '회');
    }
    else {
        $("#Inq_Cnt").text("문의횟수 : 0회");
    }
    
    vHtml = "";
    $("#Quot_no").text("견적 번호 : " + _fnToNull(fResult[0]['QUOT_NO']));
    $("#Quot_MngtNo").val(_fnToNull(fResult[0]['QUOT_NO']));

    if (_fnToNull(fResult[0]['QUOT_DT']) != "") {
        $("#Quot_IssuedDate").text("견적 발급날짜: " + _fnToNull(_fnDateFormat(fResult[0]['QUOT_DT'])));
        $("#Quot_validDate").text("견적 유효날짜: " + _fnToNull(_fnDateFormat(fResult[0]['QUOT_VALDT'])));
    };
    $("#Start_Dt").val(_fnToNull(fResult[0]['STRT_YMD']));
    $("#End_Dt").val(_fnToNull(fResult[0]['END_YMD']));
    $("#ReqNo").val(_fnToNull(fResult[0]['REQ_MNGT_NO']));
    $("#File_Path").val(_fnToNull(fResult[0]['FILE_PATH']));
    $("#File_Nm").val(_fnToNull(fResult[0]['FILE_NM']));
    $("#Head_Cnt").val(_fnToNull(fResult[0]['HEAD_CNT']));
    $("#Item_Cd").val(_fnToNull(fResult[0]['ITEM_CD']));
    
    $.each(fResult, function (i) {
        var HomeUrl = _fnToNull(fResult[i].HOME_URL);
        var Room = _fnToNull(aResult[i].ROOM_NM);
        var Meal = _fnToNull(bResult[i].QUOT_SEQ);
        var SVC = _fnToNull(cResult[i].QUOT_SEQ);
        var Conf = _fnToNull(dResult[i].QUOT_SEQ);
        var Rmk = _fnToNull(fResult[i].RMK);
        var REQ_STATUS = _fnToNull(fResult[i].REQ_STATUS);
        var ItemCnt = _fnToNull(fResult[i]['ITEM_NM']);
        var ItemGrdCnt = _fnToNull(fResult[i]['ITEM_GRD']);
        var ItemTypeCnt = _fnToNull(fResult[i]['ITEM_TYPE']);


            vHtml += "												<div class='region_info'>";
        vHtml += "                                                    <p class='region_title'>" + _fnToNull(fResult[i]['AREA']) + "<span class='region_sub'>";
        if (ItemCnt != "") {
            vHtml += " " + _fnToNull(fResult[i]['ITEM_NM']);
        }
        if (ItemGrdCnt != "") {
            vHtml += " | " + _fnToNull(fResult[i]['ITEM_GRD']);
        }
        if (ItemTypeCnt != "") {
            vHtml += " | " + _fnToNull(fResult[i]['ITEM_TYPE']);
        }
        vHtml += "</p > ";
            vHtml += "                                                    <p class='region_sub_title'>" + _fnToNull(fResult[i]['ADDR1']) + " " + _fnToNull(fResult[i]['ADDR2']) + "" + _fnToNull(fResult[i]['ZIPCODE']) + "</p>";
            vHtml += "                                                </div>";
        if (HomeUrl != "") {
            vHtml += "                                                <div class='location_info'>";
            vHtml += "                                                    <div class='move_home2'>";
            vHtml += "                                                        <img src='/Images/region_home.png'/>";
            vHtml += "                                                    </div>";
            vHtml += "                                                    <span>홈페이지 바로가기 :<a href='" + _fnToNull(fResult[i]['HOME_URL'])+"' target='_blank'>" + _fnToNull(fResult[i]['HOME_URL']) + "</a></span>";
            vHtml += "                                                </div>";
        }
        vHtml += "                                                <div class='request_option'>";
        vHtml += "                                                    <div class='option_list'>";
        if (Room != "") {
            vHtml += "                                                        <div class='option_div'>";
            vHtml += "                                                            <div class='option_left'>";
            vHtml += "                                                                <img src='/Images/stay.png'><span>숙박</span><span>옵션 :";
            var test = 0;
            $.each(aResult, function (j) {
                var alength = aResult.length;
                test += parseInt(aResult[j]['PRC']);
                vHtml += " " + _fnToNull(aResult[j]['ROOM_NM']) + "  " + _fnToNull(aResult[j]['ROOM_CNT']) + "개";
                if (alength - 1 > j) {
                    vHtml += " | ";
                }
            })
            vHtml += "</span>";
            vHtml += "                                                            </div>";
            vHtml += "                                                            <div class='cost'>";
            if (_fnToZero(test) != 0) {
                vHtml += "                                                                " + _fnGetNumber(_fnToZero(test), "sum") + "원";
            } else {
                vHtml += "별도 문의";
            }
            vHtml += "                                                            </div>";
            vHtml += "                                                        </div>";
        }
        if (Meal != "") {
            vHtml += "                                                        <div class='option_div'>";
            vHtml += "                                                            <div class='option_left'>";
            vHtml += "                                                                <img src='/Images/feed.png'><span>식사</span><span>옵션 :";
            var atest = 0;
            $.each(bResult, function (j) {
                var blength = bResult.length;
                atest += parseInt(bResult[j]['PRC']);
                vHtml += " " + _fnToNull(bResult[j]['MEAL_NM']);
                if (blength - 1 > j) {
                    vHtml += ","
                }
            })
            vHtml += "</span>";
            vHtml += "                                                            </div>";
            vHtml += "                                                            <div class='cost'>";
            if (_fnToZero(atest) != 0) {
                vHtml += "                                                                " + _fnGetNumber(_fnToZero(atest), "sum") + "원";
            }else {
                vHtml += "별도 문의";
            }
            vHtml += "                                                            </div>";
            vHtml += "                                                        </div>";
        }
        if (SVC != "") {
            $.each(cResult, function (k) {
                var File_Path = _fnToNull(cResult[k].SVC_PATH).split(",");
            vHtml += "                                                        <div class='option_div'>";
            vHtml += "                                                            <div class='option_left'>";
            if (_fnToNull(File_Path[i].replace("/", "")) != "") {
                vHtml += "<img src='" + File_Path[i] + "'>" + "<span>" + _fnToNull(cResult[k]['SVC_NM']) + "</span>";
            } else {
                if (_fnToNull(cResult[k]['SVC_NM']) == "스크린" || _fnToNull(cResult[k]['SVC_NM']) == "엑스박스" || _fnToNull(cResult[k]['SVC_NM']) == "빔 프로젝터" || _fnToNull(cResult[k]['SVC_NM']) == "빔프로젝터" || _fnToNull(cResult[k]['SVC_NM']) == "LCD 프로젝터" || _fnToNull(cResult[k]['SVC_NM']) == "LCD프로젝터" || _fnToNull(cResult[k]['SVC_NM']) == "DVD 플레이어") {
                    vHtml += "<img src=\"/Images/camera.png\">" + "<span>" + _fnToNull(cResult[k]['SVC_NM']) + "</span>";
                } else if (_fnToNull(cResult[k]['SVC_NM']) == "기념품") {
                    vHtml += "<img src=\"/Images/gift.png\">" + "<span>" + _fnToNull(cResult[k]['SVC_NM']) + "</span>";
                } else if (_fnToNull(cResult[k]['SVC_NM']) == "마이크") {
                    vHtml += "<img src=\"/Images/play.png\">" + "<span>" + _fnToNull(cResult[k]['SVC_NM']) + "</span>";
                } else if (_fnToNull(cResult[k]['SVC_NM']) == "출력물" || _fnToNull(cResult[k]['SVC_NM']) == "프린트" || _fnToNull(cResult[k]['SVC_NM']) == "인쇄") {
                    vHtml += "<img src=\"/Images/print.png\">" + "<span>" + _fnToNull(cResult[k]['SVC_NM']) + "</span>";
                } else {
                    vHtml += "<img src=\"/Images/etc.png\">" + "<span>" + _fnToNull(cResult[k]['SVC_NM']) + "</span>";
                }
            }
            vHtml += "                                                            </div>";
            vHtml += "                                                            <div class='cost'>";
            if (_fnGetNumber(_fnToZero(cResult[k]['PRC']), "sum") != 0) {
                vHtml += "                                                                " + _fnGetNumber(_fnToZero(cResult[k]['PRC']), "sum") + "원";
            } else {
                vHtml += "별도 문의";
            }
            vHtml += "                                                            </div>";
            vHtml += "                                                        </div>";
        });
        }
        if (Conf != "") {
            vHtml += "                                                        <div class='etc_option etc_option1'>";
            vHtml += "                                                            <div class='option_left'>";
            vHtml += "                                                                <p>세미나룸 :"
            $.each(dResult, function (q) {
                var dlength = dResult.length;
                vHtml += " " + _fnToNull(dResult[q]['CONF_TYPE']) + " " + _fnToNull(dResult[q]['ITEM_CD']);
                if (dlength - 1 > q) {
                    vHtml += "|";
                }
            })
            vHtml += "</p>";
            vHtml += "                                                            </div>";
            vHtml += "                                                            <div class='cost'>";
            if (_fnGetNumber(_fnToZero(dResult[i]['PRC']), "sum") != 0) {
                vHtml += "                                                                " + _fnGetNumber(_fnToZero(dResult[i]['PRC']), "sum") + "원";
            } else {
                vHtml += "별도 문의";
            }
            vHtml += "                                                            </div>";
            vHtml += "                                                        </div>";
        }
        if (Rmk != "") {
            vHtml += "                                                        <div class='etc_option etc_option2'>";
            vHtml += "                                                            <div class='option_left'>";
            vHtml += "                                                                <p>Remark :" + _fnToNull(fResult[i]['RMK']) + " </p>";
            vHtml += "                                                            </div>";
            vHtml += "                                                        </div>";
        }
        vHtml += "                                                    </div>";
        vHtml += "                                                </div>";
        vHtml += "                                                <div class='total'>";
        vHtml += "                                                    <div class='total_title'>총 견적</div>";
        if (_fnGetNumber(_fnToZero(fResult[i]['TOT_AMT']), "sum") != 0) {
            vHtml += "                                                    <div class='total_cost'>" + _fnGetNumber(_fnToZero(fResult[i]['TOT_AMT']), "sum") + "원" + "</div>";
        } else {
            vHtml += "별도 문의";
        }
        vHtml += "                                                </div>";
        vHtml += "                                                    <div class='region_img_area'>";
        vHtml += "                                                        <div class='img_slide'>";
        vHtml += "                                                            <div class='img_slide_estimate_view' id='layer_img_path'>";
        vHtml += "                                                            </div>";
        vHtml += "                                                        </div>";
        vHtml += "                                                    </div>";
        vHtml += "                                                    <div class='region_img_bottom_area'>";
        vHtml += "                                                        <div class='img_menu'>";
        vHtml += "                                                            <div class='img_menu_con' id='layer_bottom_img_path'>";
        vHtml += "                                                            </div>";
        vHtml += "                                                        </div>";
        vHtml += "                                                    </div>";
        vHtml += "                                                <div class='estimate_info mo'>";
        vHtml += "                                                    <p>견적 번호 : " + _fnToNull(fResult[i]['QUOT_NO']) + "</p>";
        vHtml += "                                                    <p>견적 발급시간 : 2023.06.28</p>";
        vHtml += "                                                    <p>견적 유효기간 : 2023.07.01</p>";
        vHtml += "                                                    <div class='estimate_btn_area'>";
        if (_fnToNull($("#File_Path").val()) != "") {
            vHtml += "                                                        <button type='button' class='estimate_down'>견적서 다운로드</button>";
            $(".estimate_down").show();
        } else {
            $(".estimate_down").hide();
        }
        if (REQ_STATUS == "") {
            vHtml += "                                                        <button type='button' id='reserve'>예약요청</button>";
            $(".reserve").show();
        } else {
            $(".reserve").hide();
        }
        vHtml += "                                                    </div>";
        vHtml += "                                                </div>";
    });
    $("#CompareQuotDetail")[0].innerHTML =vHtml;

    vHtml = "";
    if (hResult.length > 0) {
        //이미지 슬릭슬라이드
        if (_fnToNull(hResult[0].IMG_PATH) != "") {
            $.each(hResult, function (i) {
                vHtml += "<div class='region_img" + (i + 1) + " region_img'><img src='" + _fnToNull(hResult[i].IMG_PATH) + "/" + _fnToNull(hResult[i].IMG_NM) + "'/></div>";
            })
        } else {
            vHtml += "<div class='region_img region_img'><img src='/Images/alert_slide_none_img.png'/></div>";
        }
    } else {
        vHtml += "<div class='region_img region_img'><img src='/Images/alert_slide_none_img.png'/></div>";
    }
    $('#layer_img_path').append(_fnToNull(vHtml));
    vHtml = "";

    ////하단 이미지
    //if (_fnToNull(vItem[0].IMG_PATH) != "") {
    // $.each(vItem, function (i) {
    // if (i < 5) {
    // vHtml += "<div class='region_img" + (i + 1) + " region_img'><img src='" + _fnToNull(vItem[i].IMG_PATH) + "/" + _fnToNull(vItem[i].IMG_NM) + "'/></div>";
    // }
    // })
    //}
    if (hResult.length > 0) {
        if (_fnToNull(hResult[0].IMG_PATH) != "") {
            var imgCnt = hResult.length;
            for (var i = 0; i < 5; i++) {
                if (hResult.length > i) {
                    vHtml += "<div class='region_img" + (i + 1) + " region_img' name='Quot_Img'><img src='" + _fnToNull(hResult[i].IMG_PATH) + "/" + _fnToNull(hResult[i].IMG_NM) + "'/></div>";
                } else {
                    vHtml += "<div class='region_img" + (i + 1) + " region_img'><img src='/Images/estimate_none.png'/></div>";
                }
            }

        } else {
            for (var i = 0; i < 5; i++) {
                //if (i == 0) {
                vHtml += "<div class='region_img" + (i + 1) + " region_img'><img src='/Images/estimate_none.png'/></div>";
                //} else {
                // vHtml += "<div class='region_img" + (i + 1) + " region_img'><img src='/Images/estimate_none.png'/></div>";
                //}
            }
        }
    } else {
        for (var i = 0; i < 5; i++) {
            vHtml += "<div class='region_img" + (i + 1) + " region_img'><img src='/Images/estimate_none.png'/></div>";
        }
    }
    $('#layer_bottom_img_path').append(vHtml);
    vHtml = "";

    //슬릭 슬라이드 이미지
    $('.img_slide_estimate_view').not('.slick-initialized').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        setPosition: 0
    });

    //$('.img_slide_estimate_view').not('.slick-initialized').slick();
    
};


$(document).on("click", "div[name='Quot_Img']", function () {

    var Count = $(this).index();
    $("#layer_img_path").slick('slickGoTo', Count);


});


$(document).on("click", '#QuotRevConfirm', function () {
    var objJsonData = new Object();
    objJsonData.QUOT_NO = _fnToNull($("#Quot_MngtNo").val());
    objJsonData.REQ_NO = _fnToNull($("#ReqNo").val());
    objJsonData.BKG_NO = _fnSequenceMngt("BKG");
    objJsonData.INS_USR = _fnToNull($("#Session_CUST_NAME").val());
    objJsonData.CUST_NM = _fnToNull($("#Session_COMPANY").val());
    objJsonData.CUST_EMAIL = _fnToNull($("#Session_EMAIL").val());
    objJsonData.CUST_TEL = _fnToNull($("#Session_TELNO").val());
    objJsonData.HEAD_CNT = _fnToNull($("#Head_Cnt").val());
    objJsonData.GRP_CD = _fnToNull($("#Session_GRP_CD").val());

    $.ajax({
        type: "POST",
        url: "/Estimate/QuotReserve",
        async: true,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {
            if (result.Result[0]["trxCode"] == "Y") {
                _fnAlertMsg("예약이 요청되었습니다.");
            } else if (result.Result[0]["trxCode"] == "N"){
                _fnAlertMsg("예약이 완료된 건입니다.");
            }
        },
        error: function (error) {
            alert("에러");
        }
    });
})

$(document).on("click", "#findpwalert", function (e) {
    var objParam = new Object();
    objParam.MNGT_NO = _fnToNull($("#Quot_MngtNo").val());
    controllerToLink("Index", "Reservation", objParam);
})



$(document).on("click", '.reserve', function () {
    _fnLayerConfirmMsg("예약 요청 하시겠습니까?");
})


$(document).on("click", '.estimate_down', function () {
    var File_Path = _fnToNull($("#File_Path").val());
    var File_Nm = _fnToNull($("#File_Nm").val());

    window.location = "/Estimate/DownloadFile?FILE_NM=" + File_Nm + "&FILE_PATH=" + File_Path;

    
})

$(document).on("click", '.down_estimate', function () {
    var File_Path = $(this).find("input[name=File_Path]").val();
    var File_Nm = $(this).find("input[name=File_Nm]").val();

    window.location = "/Estimate/DownloadFile?FILE_NM=" + File_Nm + "&FILE_PATH=" + File_Path;

})

$(document).on("click", '#btn_talk', function () {
    var objJsonData = new Object();
    objJsonData.QUOT_NO = _fnToNull($("#Quot_MngtNo").val());
    objJsonData.INQ_TYPE = "A";
    objJsonData.INQ_CONTENT = _fnToNull($("#InquiryText").val().replace(/\[|\]/g, ''));
    objJsonData.INQ_USR = _fnToNull($("#Session_CUST_NAME").val());
    if (_fnToNull($("#InquiryText").val()) == "" || _fnToNull($("#InquiryText").val()) == null) {
        _fnLayerAlertMsg_1("문의사항을 입력해주세요.");
        return false;
    }
    
    $.ajax({
        type: "POST",
        url: "/Estimate/QuotInquire",
        async: false,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {
            TalkData(result);
            $('#talk_box').scrollTop($('#talk_box')[0].scrollHeight);
        },
        error: function (error) {
            alert("에러");
        }
    });
});


function TalkData(vJsonData) {

    var vHtml = "";
    var vResult = vJsonData.QuotInquireDetail_Show;

    $("#talk_box").empty();
    if (vResult.length > 0) {
        $("#Inq_Cnt").text("문의횟수 : " + vResult[0]["INQ_CNT"] + '회');
    }
    else {
        $("#Inq_Cnt").text("문의횟수 : 0회");
    }
    
    vHtml += "                                                    <div class='chat ch1'>";
    vHtml += "                                                        <div class='icon'><i class='fa-solid fa-user'></i></div>";
    vHtml += "                                                        <div class='talk_area'>";
    vHtml += "                                                            <div class='textbox'>문의사항 남겨주세요.</div>";
    vHtml += "                                                        </div>";
    vHtml += "                                                    </div>";
    $.each(vResult, function (i) {
        if (_fnToNull(vResult[i]["USER_TYPE"]) == "U") {
            vHtml += "                                                    <div class='chat ch2'>";
        }
        else {
            vHtml += "                                                    <div class='chat ch1'>";
        }
        /*vHtml += "                                                    <div class='chat ch2'>";*/
        vHtml += "                                                        <div class='icon'><i class='fa-solid fa-user'></i></div>";
        vHtml += "                                                        <div class='talk_area'>";
        vHtml += "                                                            <div class='textbox'>" + _fnToNull(vResult[i]['INQ_CONTENT']) + "</div>";
        vHtml += "                                                            <p class='talk_date'>" + _fnDateFormating(_fnToNull(vResult[i]['INQ_YMD'])) + "</p>";
        vHtml += "                                                        </div>";
        vHtml += "                                                    </div>";
        //if (_fnToNull(vResult[i]['ANSWER']) != "") {
        //    vHtml += "                                                    <div class='chat ch1'>";
        //    vHtml += "                                                        <div class='icon'><i class='fa-solid fa-user'></i></div>";
        //    vHtml += "                                                        <div class='talk_area'>";
        //    vHtml += "                                                            <div class='textbox'>" + _fnToNull(vResult[i]['ANSWER']) + "</div>";
        //    vHtml += "                                                            <p class='talk_date'>" + _fnToNull(_fnDateFormating(vResult[i]['ANS_YMD'])) + "</p>";
        //    vHtml += "                                                        </div>";
        //    vHtml += "                                                    </div>";
        //}
    });

    $("#talk_box").append(vHtml);
    $("#InquiryText").val("");
}




function SimpleMyQuotList(){
    var objJsonData = new Object();
    objJsonData.REQ_EMAIL = _fnToNull($("#Session_EMAIL").val());

    $.ajax({
        type: "POST",
        url: "/Estimate/SimpleMyQuotList",
        async: true,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData)},
        success: function (result) {
            SimpleMyQuotListHeader(result);
        },
        error: function (error) {
            alert("에러");
        }
    });
};

function RegionView(){
    var objJsonData = new Object();

    $.ajax({
        type: "POST",
        url: "/Estimate/RegionView",
        async: true,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {
            RegionViewDetail(result);
        },
        error: function (error) {
            alert("에러");
        }
    });
}

function RegionViewDetail(vJsonData) {

    var vHtml = "";
    var vResult = vJsonData.RegionView_Show;


    vHtml = "                 <option value='ALL'>지역</option>";
    $.each(vResult, function (i) {
        vHtml += "                 <option value='" +_fnToNull(vResult[i]['COMM_NM']) +"'>" + _fnToNull(vResult[i]['COMM_NM']) + " </option>";

    });
    $("#Region")[0].innerHTML = vHtml;

}




function SimpleMyQuotListSimpleHeader(vJsonData) {  

    var vHtml = "";
    var vResult = vJsonData.EstimateSearch_Show;


            vHtml += "                   <div class='con_title'>나의견적요청</div>";
    $.each(vResult, function (i) {
        var svc_cd = _fnToNull(vResult[i].SVC_CD).split(",");
        var conf_type = _fnToNull(vResult[i].CONF_TYPE).split(",");
        var room_nm = _fnToNull(vResult[i].ROOM_NM).split(",");
        var room_cnt = _fnToNull(vResult[i].ROOM_CNT).split(",");
        var meal_nm = _fnToNull(vResult[i].MEAL_NM).split(",");
        var svc_nm = _fnToNull(vResult[i].SVC_NM).split(",");
        var min_prc = _fnToNull(vResult[i].MIN_PRC).split(",");
        var max_prc = _fnToNull(vResult[i].MAX_PRC).split(",");
        var File_Path = _fnToNull(vResult[i].FILE_PATH).split(",");
        if (_fnToNull(vResult[i].QUOT_TYPE) == "A") {
            if (_fnToNull(vResult[i].QUOT_FILE_PATH) != "") {
                vHtml += "                   <div class='estimate_list done'>";
            } else {
                vHtml += "                   <div class='estimate_list'>";
            }
            vHtml += "                   <div class='list_box--padding'>";
            vHtml += "                             <div class='estimate_list_box'> ";
            vHtml += "                              <div class='simple_estimate'>";
            vHtml += "                                <div class='estimate_simple'>";
            vHtml += "                            <div class='estimate_simple_img'><img src='/Images/Simple_img.png' /></div>";
            vHtml += "                    <div class='estimate_simple_contents'>";
            vHtml += "                                        <div class='token'>";
            vHtml += "                                            <span>간편견적</span>";
            vHtml += "                                        </div>";
            vHtml += "                                        <div class='estimate_simple_date'>";
            vHtml += "                                            <span>" + _fnDateFormat(_fnToNull(vResult[i]['STRT_YMD'])) + " - " + _fnDateFormat(_fnToNull(vResult[i]['END_YMD'])) + "</span>";
            vHtml += "                                        </div>";
            vHtml += "                                        <div class='estimate_simple_info'>";
            vHtml += "                                            <div class='estimate_simple_title'>";
            vHtml += "                                                <span class='location_title'>지역 : " + _fnToNull(vResult[i]['AREA']) + " &nbsp;&nbsp;|&nbsp;&nbsp; 인원 :  " + _fnToNull(vResult[i]['HEAD_CNT']) + " 명</span>";
            vHtml += "                                                <input type ='hidden' name='ReqNo' value='" + _fnToNull(vResult[i]["REQ_NO"]) + "'/> ";
            vHtml += "                                                <input type ='hidden' id='HeaderStatus' value='" + _fnToNull(vResult[i]["STATUS"]) + "'/> ";
            vHtml += "                                            </div>";
            vHtml += "                                        </div>";
            vHtml += "                                        <div class='price'>";
            vHtml += "                                          <span class='price_title'>총 견적금액&nbsp;:</span>";
            vHtml += "                                          <span class='orange'>&nbsp; " + _fnToNull(_fnGetNumber(vResult[i]['MIN_PRC'], "sum")) + "원" + " ~ " + _fnToNull(_fnGetNumber(vResult[i]['MAX_PRC'], "sum")) +"원" + "</span>";
            vHtml += "                                        </div>";
            vHtml += "                                    </div>";
            vHtml += "                                </div>";
            vHtml += "                                <div class='request_option'>";
            vHtml += "                                    <div class='option_list'>";
            vHtml += "                                        <h4>요청옵션</h4>";
            if (_fnToNull(svc_cd) != "") {
                vHtml += "                                        <div class='add_option' id='Simple_AddoptQuot_List'>";
                $.each(svc_cd, function (j) {
                    vHtml += "                                            <div class='option' style='pointer-events:none'>";
                    if (_fnToNull(File_Path[j].replace("/","")) != "") {
                        vHtml += "<button type='button'><img src='" + File_Path[j] + "'>" + _fnToNull(svc_cd[j]) + "</button>";
                    } else {
                        if (_fnToNull(svc_cd[j]) == "스크린" || _fnToNull(svc_cd[j]) == "엑스박스" || _fnToNull(svc_cd[j]) == "빔 프로젝터" || _fnToNull(svc_cd[j]) == "빔프로젝터" || _fnToNull(svc_cd[j]) == "LCD 프로젝터" || _fnToNull(svc_cd[j]) == "LCD프로젝터" || _fnToNull(svc_cd[j]) == "DVD 플레이어") {
                            vHtml += "<button type='button'><img src=\"/Images/camera.png\">" + _fnToNull(svc_cd[j]) + "</button>";
                        } else if (_fnToNull(svc_cd[j]) == "기념품") {
                            vHtml += "<button type='button'><img src=\"/Images/gift.png\">" + _fnToNull(svc_cd[j]) + "</button>";
                        } else if (_fnToNull(svc_cd[j]) == "마이크") {
                            vHtml += "<button type='button'><img src=\"/Images/play.png\">" + _fnToNull(svc_cd[j]) + "</button>";
                        } else if (_fnToNull(svc_cd[j]) == "출력물" || _fnToNull(svc_cd[j]) == "프린트" || _fnToNull(svc_cd[j]) == "인쇄") {
                            vHtml += "<button type='button'><img src=\"/Images/print.png\">" + _fnToNull(svc_cd[j]) + "</button>";
                        } else {
                            vHtml += "<button type='button'><img src=\"/Images/etc.png\">" + _fnToNull(svc_cd[j]) + "</button>";
                        }
                    }
                    vHtml += "                                            </div>";
                });
                vHtml += "                                        </div>";
            }
            vHtml += "                                    </div>";
            vHtml += "                                        <div class='remark'>";
            vHtml += "                                            <span>Remark : " + _fnToNull(vResult[i]['RMK']) + " </span>";
            vHtml += "                                        </div>";
            vHtml += "                                </div>";
            vHtml += "                                </div>";
            if (_fnToNull(vResult[i]["QUOT_FILE_PATH"]) != "") {
                vHtml += "                                        <div class='down_estimate'>";
                vHtml += "                                          <a>견적서 다운로드</a>";
                vHtml += "                                                <input type ='hidden' name='File_Path' value='" + _fnToNull(vResult[i]["QUOT_FILE_PATH"]) + "'/> ";
                vHtml += "                                                <input type ='hidden' name='File_Nm' value='" + _fnToNull(vResult[i]["QUOT_FILE_NM"]) + "'/> ";
                vHtml += "                                        </div>";
            } else {
                $(".down_estimate").hide();
            }
            vHtml += "                            </div>";
            vHtml += "                        </div>";
            vHtml += "                        </div>";
        }
    });

    $(".con_area_simple")[0].innerHTML = vHtml;

}

function SimpleMyQuotListHeader(vJsonData) {
    var vHtml = "";
    var vResult = vJsonData.EstimateSearch_Show;

    if (vResult.length > 2) {
        $("#Simple_Quot_List").css("height", "534px");
    } else {
        $("#Simple_Quot_List").css("height", "unset");
    }
    /*vHtml += "            <div class='con_title'>나의견적요청</div>";*/
    $.each(vResult, function (i) {
        var svc_cd = _fnToNull(vResult[i].SVC_CD).split(",");
        var conf_type = _fnToNull(vResult[i].CONF_TYPE).split(",");
        var room_nm = _fnToNull(vResult[i].ROOM_NM).split(",");
        var room_cnt = _fnToNull(vResult[i].ROOM_CNT).split(",");
        var meal_nm = _fnToNull(vResult[i].MEAL_NM).split(",");
        var svc_nm = _fnToNull(vResult[i].SVC_NM).split(",");
        var File_Path = _fnToNull(vResult[i].FILE_PATH).split(",");
        if (_fnToNull(vResult[i].QUOT_TYPE) == "B") {
            if (_fnToNull(vResult[i].STATUS) == "Y") {
                vHtml += "                   <div class='estimate_list done'>";
            } else {
                vHtml += "                   <div class='estimate_list request'>";
            }
            vHtml += "            <div class='estimate_list_box online_box'>";
            vHtml += "                <div class='estimate_online'>";
            vHtml += "                    <div class='estimate_img'>";
            if (_fnToNull(vResult[i].IMG_PATH) == "") {
                vHtml += "                <img src='/Images/estimate_none.png'/>";
            } else {
                vHtml += "                <img src='" + _fnToNull(vResult[i]['IMG_PATH']) + "'/>";
            }
            vHtml += "                    </div > ";
            vHtml += "                    <div class='estimate_contents'>";
            vHtml += "                        <div class='token'>";
            vHtml += "                            <span>온라인견적</span>";
            vHtml += "                        </div>";
            vHtml += "                        <div class='estimate_date'>";
            vHtml += "                                            <span>" + _fnDateFormat(_fnToNull(vResult[i]['STRT_YMD'])) + " - " + _fnDateFormat(_fnToNull(vResult[i]['END_YMD'])) + "</span>";
            vHtml += "                        </div>";
            vHtml += "                        <div class='estimate_info'>";
            vHtml += "                            <div class='estimate_title'>";
            vHtml += "                                                <span class='location_title'>지역 : " + _fnToNull(vResult[i]['AREA']) + " &nbsp;&nbsp;|&nbsp;&nbsp; 인원 :  " + _fnToNull(vResult[i]['HEAD_CNT']) + " 명</span>";
            vHtml += "                                                <input type ='hidden' name='ReqNo' value='" + _fnToNull(vResult[i]["REQ_NO"]) + "'/> ";
            vHtml += "                                                <input type ='hidden' id='HeaderStatus' value='" + _fnToNull(vResult[i]["STATUS"]) + "'/> ";
            vHtml += "                            </div>";
            vHtml += "                            <div class='price'>";
            vHtml += "                                <span class='price_title'>예산범위&nbsp;:</span><span class='orange'>&nbsp;" + _fnToNull(_fnGetNumber(vResult[i]['MIN_PRC'], "sum")) + " - " + _fnToNull(_fnGetNumber(vResult[i]['MAX_PRC'], "sum")) + "</span><span class='won'>원</span>";
            vHtml += "                            </div>";
            vHtml += "                        </div>";
            vHtml += "                    </div>";
            vHtml += "                </div>";
            vHtml += "                <div class='request_option'>";
            vHtml += "                    <div class='option_list'>";
            vHtml += "                        <h4>요청옵션</h4>";
            vHtml += "                        <div class='option_div'>";
            vHtml += "                            <img src='/Images/stay.png' /><span>숙박</span><span>옵션 :";
            $.each(room_nm, function (i) {
                var alength = room_nm.length;
                if (_fnToNull(room_nm[i]) != "") {
                    vHtml += " " + _fnToNull(room_nm[i]) + " " + _fnToNull(room_cnt[i]) + "개 ";
                } else {
                    vHtml += " 별도 문의";
                }
                if (alength - 1 > i) {
                    vHtml += "|";
                }
            });
            vHtml += "</span >";
            vHtml += "                        </div>";
            vHtml += "                        <div class='option_div'>";
            vHtml += "                            <img src='/Images/feed.png' /><span>식사</span><span>옵션 : ";
            $.each(meal_nm, function (i) {
                var alength = meal_nm.length;
                if (_fnToNull(meal_nm[i]) != "") {
                    vHtml += " " + _fnToNull(meal_nm[i]);
                } else {
                    vHtml += " 별도 문의";
                }
                if (alength - 1 > i) {
                    vHtml += ",";
                }
            });
            vHtml += "</span >";
            vHtml += "                        </div>";
            $.each(svc_nm, function (i) {
                if (_fnToNull(svc_nm[i]) != "") {
                    vHtml += "                        <div class='option_div'>";
                    if (_fnToNull(File_Path[i].replace("/", "")) != "") {
                        vHtml += "<img src='" + File_Path[i] + "'>" + "<span>" + _fnToNull(svc_cd[i]) + "</span>";
                    } else {
                        if (_fnToNull(svc_cd[i]) == "스크린" || _fnToNull(svc_cd[i]) == "엑스박스" || _fnToNull(svc_cd[i]) == "빔 프로젝터" || _fnToNull(svc_cd[i]) == "빔프로젝터" || _fnToNull(svc_cd[i]) == "LCD 프로젝터" || _fnToNull(svc_cd[i]) == "LCD프로젝터" || _fnToNull(svc_cd[i]) == "DVD 플레이어") {
                            vHtml += "<img src=\"/Images/camera.png\">" + "<span>" + _fnToNull(svc_cd[i]) + "</span>";
                        } else if (_fnToNull(svc_cd[i]) == "기념품") {
                            vHtml += "<img src=\"/Images/gift.png\">" + "<span>" + _fnToNull(svc_cd[i]) + "</span>";
                        } else if (_fnToNull(svc_cd[i]) == "마이크") {
                            vHtml += "<img src=\"/Images/play.png\">" + "<span>" + _fnToNull(svc_cd[i]) + "</span>";
                        } else if (_fnToNull(svc_cd[i]) == "출력물" || _fnToNull(svc_cd[i]) == "프린트" || _fnToNull(svc_cd[i]) == "인쇄") {
                            vHtml += "<img src=\"/Images/print.png\">" + "<span>" + _fnToNull(svc_cd[i]) + "</span>";
                        } else {
                            vHtml += "<img src=\"/Images/etc.png\">" + "<span>" + _fnToNull(svc_cd[i]) + "</span>";
                        }
                    }
                    vHtml += "                        </div>";
                }
            });
            vHtml += "                        <div class='etc_option'>";
            vHtml += "                            <p>";
            vHtml += "                                세미나룸 : "
            $.each(conf_type, function (i) {
                var alength = conf_type.length;
                vHtml += " " + _fnToNull(conf_type[i]);
                if (alength - 1 > i) {
                    vHtml += " | ";
                }
            });
            vHtml += "              " + "<br />";
            if (_fnToNull(svc_nm[i]) != "") {
                if (_fnToNull(vResult[i]['RMK']) != "") {
                    vHtml += "                                Remark : " + _fnToNull(vResult[i]['RMK']);
                }
            }
            vHtml += "                            </p>";
            vHtml += "                        </div>";
            vHtml += "                    </div>";
            vHtml += "                </div>";
            vHtml += "            </div>";
            vHtml += "        </div>";

        }
    });
    $("#Simple_Quot_List")[0].innerHTML = vHtml;
}


function SimpleMyQuotListComplete(vJsonData) {

    var vHtml = "";
    var vResult = vJsonData.QuotComplete_Show;

    $.each(vResult, function (i) {
        var svc_nm = _fnToNull(vResult[i].SVC_CD).split(",");
        var File_Path = _fnToNull(vResult[i].FILE_PATH).split(",");
        vHtml += "                   <div class='list_box--padding'>";
        vHtml += "                             <div class='estimate_list_box'> ";
        vHtml += "                                <div class='estimate_simple'>";
        vHtml += "                            <div class='estimate_simple_img'><img src='/Images/estimate_none.png' /></div>";
        vHtml += "                    <div class='estimate_simple_contents'>";
        vHtml += "                                        <div class='token'>";
        vHtml += "                                            <span>간편견적</span>";
        vHtml += "                                        </div>";
        vHtml += "                                        <div class='estimate_simple_date'>";
        vHtml += "                                            <span>" + _fnDateFormat(_fnToNull(vResult[i]['STRT_YMD'])) + " - " + _fnDateFormat(_fnToNull(vResult[i]['END_YMD'])) + "</span>";
        vHtml += "                                        </div>";
        vHtml += "                                        <div class='estimate_simple_info'>";
        vHtml += "                                            <div class='estimate_simple_title'>";
        vHtml += "                                                <span class='location_title'>지역 : " + _fnToNull(vResult[i]['AREA']) + " &nbsp;&nbsp;|&nbsp;&nbsp; 인원 :  " + _fnToNull(vResult[i]['HEAD_CNT']) + " 명</span>";
        vHtml += "                                                <input type ='hidden' name='ReqNo' value='" + _fnToNull(vResult[i]["REQ_NO"]) + "'/> ";
        vHtml += "                                                <input type ='hidden' id='HeaderStatus' value='" + _fnToNull(vResult[i]["STATUS"]) + "'/> ";
        vHtml += "                                            </div>";
        vHtml += "                                        </div>";
        vHtml += "                                    </div>";
        vHtml += "                                </div>";
        vHtml += "                                <div class='request_option'>";
        vHtml += "                                    <div class='option_list'>";
        vHtml += "                                        <h4>요청옵션</h4>";
        if (_fnToNull(svc_nm[0]) != "") {
            vHtml += "                                        <div class='add_option' id='Simple_AddoptQuot_List'>";
            $.each(svc_nm, function (j) {
                vHtml += "                                            <div class='option' style='pointer-events:none'>";
                vHtml += "                                                <button type='button'><img src='" + _fnToNull(File_Path[j]) + "'/>" + _fnToNull(svc_nm[j]) + "</button>";
                vHtml += "                                            </div>";
            });
            vHtml += "                                        </div>";
        }
        vHtml += "                                        <div class='remark'>";
        vHtml += "                                            <span>Remark : " + _fnToNull(vResult[i]['RMK']) + " </span>";
        vHtml += "                                        </div>";
        vHtml += "                                    </div>";
        vHtml += "                                </div>";
        vHtml += "                            </div>";
        vHtml += "                        </div>";
    });
    $("#QuotCompleteText")[0].innerHTML = vHtml;
    };
