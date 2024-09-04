$(function () {
    if (_fnToNull($("#Session_EMAIL").val()) != "") {
        $("div").removeClass("blur_div");
        $(".login_layer").hide();
        $("#From_Date_Quot").val(_fnPlusDate(-15));
        $("#To_Date_Quot").val(_fnPlusDate(15));
        RegionView_ReServe();
    } else {
        window.location = "/Admin/Login";
    }

    if (sessionStorage.getItem("TAB3_CLICK") == "Y") {
        $("#time").click();
        sessionStorage.setItem("TAB3_CLICK", "");
    }


    $('html').click(function (e) {
        if ($(e.target).parents('.feed_area').length < 1) {
            $('.feed_area').hide();
        }
    });

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


    if (_fnToNull($("#View_MNGT_NO").val()) != "" || _fnToNull($("#View_QUOT_NO").val()) != "") {
        $("#estimate_search_Reserve").click();
    }


    $(document).on('click', '.compare_box', function (event) {

        var objJsonData = new Object();
        objJsonData.BKG_NO = _fnToNull($(this).find("input[name = 'BkgNo']").val());
        objJsonData.ITEM_CD = _fnToNull($(this).find("input[name = 'ITEM_CD']").val());
        objJsonData.MNG_NO = _fnToNull($(this).find("input[name = 'MNG_NO']").val());

        $.ajax({
            type: "POST",
            url: "/Reservation/ReserveDetail",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (result.Result[0]["trxCode"] == "Y") {
                    ReserveDetail(result);//예약상세
                    itemDetail(result);//수정요청
                    InquiryReserve();//문의사항
                    //$("#reserve_detail").click();
                } else if (result.Result[0]["trxCode"] == "N") {
                    alert("에러");
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


    $(document).on("click", ".compare_detail", function (e) {
        e.stopPropagation();
        $(e.target).closest('.compare_list').siblings('.request_option').remove();

        var objJsonDetail = new Object();
        objJsonDetail.BKG_NO = _fnToNull($(this).find("input[name=BkgNo]").val());


        $.ajax({
            type: "POST",
            url: "/Reservation/ReservationSearchDetail",
            async: false,   
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonDetail) },
            success: function (result) {
                if (result.Result[0]["trxCode"] == "Y") {
                    var vHtml = "";
                    var aResult = result.ReserveBottomRoom_Show;
                    var bResult = result.ReserveBottomMeal_Show;
                    var cResult = result.ReserveBottomSvc_Show;
                    var dResult = result.ReserveBottomConf_Show;
                    var fResult = result.ReserveBottomMst_Show;



                    $.each(fResult, function (i) {

                        vHtml += "                                  <div class='request_option'>";
                        vHtml += "                                      <div class='option_list'>                                                                                          ";
                        vHtml += "                                          <h4>요청옵션<span class='hide_option'>접기</span></h4>                                                           ";
                        if (aResult.length > 0) {
                        vHtml += "                                          <div class='option_div'>                                                                                       ";
                        vHtml += "                                              <img src='/Images/stay.png' /><span>숙박</span><span>옵션 :";
                            $.each(aResult, function (i) {
                                var alength = aResult.length;
                                if (_fnToNull(aResult[i].ROOM_NM) != "") {
                                    vHtml += " " + _fnToNull(aResult[i].ROOM_NM) + " " + _fnToNull(aResult[i].ROOM_CNT) + "개 ";
                                } else {
                                    vHtml += " 별도 문의";
                                }
                                if (alength - 1 > i) {
                                    vHtml += "|";
                                }
                            });
                            vHtml += "                                          </span > ";
                        
                        vHtml += "                                          </div>                                                                                                         ";
                        }
                        if (bResult.length > 0) {
                        vHtml += "                                          <div class='option_div'>                                                                                       ";
                        vHtml += "                                              <img src='/Images/feed.png' /><span>식사</span><span>옵션 : ";
                            $.each(bResult, function (i) {
                                var alength = bResult.length;
                                if (_fnToNull(bResult[i].MEAL_NM) != "") {
                                    vHtml += " " + _fnToNull(bResult[i].MEAL_NM);
                                } else {
                                    vHtml += " 별도 문의";
                                }
                                if (alength - 1 > i) {
                                    vHtml += ",";
                                }
                            });
                            vHtml += "    </span > ";
                            vHtml += "                                          </div>                                                                                                         ";
                        }
                        if (cResult.length > 0) {
                            $.each(cResult, function (i) {
                                var File_Path = _fnToNull(cResult[i].SVC_PATH).split(",");
                                if (_fnToNull(cResult[i].SVC_NM) != "") {
                                    vHtml += "                        <div class='option_div'>";
                                    if (_fnToNull(File_Path[i]).replace("/", "") != "") {
                                        vHtml += "<img src='" + File_Path[i] + "'>" + "<span>" + _fnToNull(cResult[i]['SVC_NM']) + "</span>";
                                    } else {
                                        if (_fnToNull(cResult[i]['SVC_NM']) == "스크린" || _fnToNull(cResult[i]['SVC_NM']) == "엑스박스" || _fnToNull(cResult[i]['SVC_NM']) == "빔 프로젝터" || _fnToNull(cResult[i]['SVC_NM']) == "빔프로젝터" || _fnToNull(cResult[i]['SVC_NM']) == "LCD 프로젝터" || _fnToNull(cResult[i]['SVC_NM']) == "LCD프로젝터" || _fnToNull(cResult[i]['SVC_NM']) == "DVD 플레이어") {
                                            vHtml += "<img src=\"/Images/camera.png\">" + "<span>" + _fnToNull(cResult[i]['SVC_NM']) + "</span>";
                                        } else if (_fnToNull(cResult[i]['SVC_NM']) == "기념품") {
                                            vHtml += "<img src=\"/Images/gift.png\">" + "<span>" + _fnToNull(cResult[i]['SVC_NM']) + "</span>";
                                        } else if (_fnToNull(cResult[i]['SVC_NM']) == "마이크") {
                                            vHtml += "<img src=\"/Images/play.png\">" + "<span>" + _fnToNull(cResult[i]['SVC_NM']) + "</span>";
                                        } else if (_fnToNull(cResult[i]['SVC_NM']) == "출력물" || _fnToNull(cResult[i]['SVC_NM']) == "프린트" || _fnToNull(cResult[i]['SVC_NM']) == "인쇄") {
                                            vHtml += "<img src=\"/Images/print.png\">" + "<span>" + _fnToNull(cResult[i]['SVC_NM']) + "</span>";
                                        } else {
                                            vHtml += "<img src=\"/Images/etc.png\">" + "<span>" + _fnToNull(cResult[i]['SVC_NM']) + "</span>";
                                        }
                                    }
                                    vHtml += "                        </div>";
                                }
                            });
                        }
                        vHtml += "                                          <div class='etc_option'>                                                                                       ";
                        vHtml += "                                              <p>                                                                                                        ";
                        if (dResult.length > 0) {
                        vHtml += "                                                  세미나룸 : ";
                            $.each(dResult, function (i) {
                                var alength = dResult.length;
                                vHtml += " " + _fnToNull(dResult[i].CONF_TYPE);
                                if (alength - 1 > i) {
                                    vHtml += " | ";
                                }
                            });
                        }
                        vHtml += "              " + "<br />";
                        if (_fnToNull(fResult[i]['RMK']) != "") {
                            vHtml += "                                Remark : " + _fnToNull(fResult[i]['RMK']);
                        }
                        vHtml += "                                              </p>                                                                                                       ";
                        vHtml += "                                          </div>                                                                                                         ";
                        vHtml += "                                      </div>                                                                                                             ";
                        vHtml += "                                     </div>                                                                                                             ";
                    });
                    $(e.target).closest('.compare_list').after(vHtml);

                } else if (result.Result[0]["trxCode"] == "N") {
                    alert("에러");
                }
            },
            error: function (error) {
                alert("에러");
            }
        })
        var op = $(e.target).closest('.compare_list').siblings('.request_option');
        op.slideDown();
        op.addClass('on');

    });

})

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


function DateCampare(id, date) {
    var first = "";
    var sec = "";


    //앞 날짜
    if (id == "#Mod_From_Date") {
        first = date.replace(/-/gi, "");
        sec = $("#Mod_To_Date").val().replace(/-/gi, "");
        if (sec.length == 8) {
            if (first > sec) {
                _fnAlertMsg("시작일자는 종료일자보다 이후 일 수 없습니다.");
                return false;
            }
        }

    }
    //뒷날짜
    if (id == "#Mod_To_Date") {
        first = $("#Mod_From_Date").val().replace(/-/gi, "");
        sec = date.replace(/-/gi, "");
        if (first.length == 8) {
            if (sec < first) {
                _fnAlertMsg("종료일자는 시작일자보다 이전 일 수 없습니다.");
                return false;
            }
        }
    }

    return true;
}

$(document).on("focusout", "#Mod_From_Date", function () {
    DateValue = $("#Mod_From_Date").val().replace(/-/gi, "");
    fnDateForm(DateValue, this.id);
    var startDate = $("#Mod_From_Date").val().replace(/-/gi, ""); //시작일
    var endDate = $("#Mod_To_Date").val().replace(/-/gi, ""); //종료일

    var Date = _fnCompareDay(startDate, endDate);
    var Dateday = Date + 1

    $('#room_select').empty();
    $("#room_select_btn").css("background", "rgb(238, 239, 240)")
    $("#room_date_select_btn").css("background", "rgb(238, 239, 240)")
    $('#room_select').text("[숙박] 일정입니다. / " + "[" + Date + "]" + "박" + "[" + Dateday + "]" + "일 일정입니다.");
});

$(document).on("focusout", "#Mod_To_Date", function () {
    DateValue = $("#Mod_To_Date").val().replace(/-/gi, "");
    fnDateForm(DateValue, this.id);
});

$(document).on("focusout", "#mod_min_prc", function () {

    var vFromcost = $("#mod_min_prc").val().replace(/,/gi, "");
    var vTocost = $("#mod_max_prc").val().replace(/,/gi, "");

    if (parseInt(vFromcost) > parseInt(vTocost)) {
        _fnAlertMsg("예산범위가 최대예산보다 최소예산이 큽니다.");
        $("#mod_min_prc").val("");
    }

});

$(document).on("focusout", "#mod_max_prc", function () {

    var vFromcost = $("#mod_min_prc").val().replace(/,/gi, "");
    var vTocost = $("#mod_max_prc").val().replace(/,/gi, "");

    if (parseInt(vFromcost) > parseInt(vTocost)) {
        _fnAlertMsg("예산범위가 최대예산보다 최소예산이 큽니다.");
        $("#mod_max_prc").val("");
    }

});

$(document).on("keyup", "#HEAD_CNT", function () {

    var vValue = $("#HEAD_CNT").val();
    var vValue_Num = vValue.replace(/[^0-9]/g, "");


    $("#HEAD_CNT").val(vValue_Num);
});



function RegionView_ReServe() {
    var objJsonData = new Object();
        
    $.ajax({
        type: "POST",
        url: "/Reservation/RegionView",
        async: true,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {
            RegionViewDetail_Reserve(result);
        },
        error: function (error) {
            alert("에러");
        }
    });
}

function RegionViewDetail_Reserve(vJsonData) {

    var vHtml = "";
    var vResult = vJsonData.RegionView_Show;

    vHtml = " <option value='ALL'>지역</option>";
    $.each(vResult, function (i) {
        vHtml += " <option value='" + _fnToNull(vResult[i]['COMM_NM']) + "'>" + _fnToNull(vResult[i]['COMM_NM']) + " </option>";

    });
    $("#Region")[0].innerHTML = vHtml;

}

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



$(document).on("click", '#estimate_search_Reserve', function () {
    var objJsonData = new Object();
    var vHtml = "";
        objJsonData.CUST_EMAIL = _fnToNull($("#Session_EMAIL").val());
        objJsonData.QUOT_TYPE = _fnToNull($("input[name='sort_btn']:checked").val());
        objJsonData.AREA = _fnToNull($("#Region option:selected").val());
        objJsonData.STRT_DT = _fnToNull($("#From_Date_Quot").val().replace(/-/gi, ""));
        objJsonData.END_DT = _fnToNull($("#To_Date_Quot").val().replace(/-/gi, ""));
        objJsonData.BKG_STATUS = _fnToNull($("#ResStatus option:selected").val());
        objJsonData.USER_TYPE = _fnToNull($("#Session_USER_TYPE").val());
        objJsonData.MNGT_NO = _fnToNull($("#View_MNGT_NO").val());
        objJsonData.QUOT_NO = _fnToNull($("#View_QUOT_NO").val());
        objJsonData.GRP_CD = _fnToNull($("#Session_GRP_CD").val());

        $.ajax({
            type: "POST",
            url: "/Reservation/ReservationSearch",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (result.Result[0]["trxCode"] == "Y") {
                    $(".no_data_area").hide();
                    $("#search_position").show();
                    ReserVationSearch(result);
                    $('.compare').children('.reserve').eq(0).click()
                    if (_fnToNull($("#View_MNGT_NO").val()) != "") {
                        $("#View_MNGT_NO").val("")
                    }
                    if (_fnToNull($("#View_QUOT_NO").val()) != "") {
                        $("#View_QUOT_NO").val("")
                    }
                } else if (result.Result[0]["trxCode"] == "N") {
                    $(".no_data_area").show();
                    $("#search_position").hide();

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
    
    

function ReserveDetail(vJsonData) {
    var vHtml = "";
    var aResult = vJsonData.ReserveDetailRoom_Show;
    var bResult = vJsonData.ReserveDetailMeal_Show;
    var cResult = vJsonData.ReserveDetailSvc_Show;
    var dResult = vJsonData.ReserveDetailConf_Show;
    var eResult = vJsonData.ReserveDetailMst_Show;
    if (eResult.length > 0) {
        if (_fnGetNumber(_fnToZero(eResult[0]['TOT_AMT']), "sum") != 0) {
            $("#TotExp").text(_fnGetNumber(eResult[0]['TOT_AMT'], "sum") + "원");
        } else {
            $("#TotExp").text("별도 문의");
        }
        $("#Mod_From_Date").val(_fnDateFormatingDash(eResult[0]['STRT_DT']));
        $("#Mod_To_Date").val(_fnDateFormatingDash(eResult[0]['END_DT']));
        $("#HEAD_CNT").val(eResult[0]['HEAD_CNT']);
        $("#mod_min_prc").val(_fnGetNumber(eResult[0]['MIN_PRC'], "sum"));
        $("#mod_max_prc").val(_fnGetNumber(eResult[0]['MAX_PRC'], "sum"));
        $("#mod_max_prc").val(_fnGetNumber(eResult[0]['MAX_PRC'], "sum"));
        if (_fnToNull(eResult[0].REVIEW_YN) != "") {
            $("#review_btn").hide();
        } else {
            $("#review_btn").show();
        }
        if (_fnToNull(eResult[0].FILE_PATH) == "") {
            $("#ReserveDown").hide();
        }
        $("#RMK").val(eResult[0]['RMK']);
        $('input[name=bKg_no]').val(eResult[0]['BKG_NO']);
        $("#CancleBkg").val(eResult[0]['BKG_NO']);
        $("#ItemDetail").val(_fnToNull(eResult[0]['ITEM_CD']));
        $("#File_Path").val(eResult[0]['FILE_PATH']);
        $("#File_Nm").val(eResult[0]['FILE_NM']);
        var aToT = 0;
        $.each(aResult, function (a) {
            aToT += parseInt(aResult[a]['PRC']);
        });
        var bToT = 0;
        $.each(bResult, function (b) {
            bToT += parseInt(bResult[b]['PRC']);
        });
        var cToT = 0;
        $.each(cResult, function (c) {
            cToT += parseInt(cResult[c]['PRC']);
        });
        var dToT = 0;
        $.each(dResult, function (d) {
            dToT += parseInt(dResult[d]['PRC']);
        });

        $.each(eResult, function (i) {
            vHtml += "					                                                <div class='reserve_detail_area'>";
            vHtml += "					                                                    <div class='detail_list'>";
            vHtml += "					                                                        <div class='detail_area'>";
            vHtml += "					                                                            <div class='list_img'>";
            vHtml += "					                                                                <img src='/Images/stay.png' />";
            vHtml += "					                                                            </div>";
            vHtml += "					                                                            <div class='list_cont'>";
            vHtml += "					                                                                <div class='list_top'>";
            if (_fnToZero(aToT) == 0) {
                vHtml += "					                                                                    <span class='list_title'>숙박</span><span class='list_total_cost'>별도문의</span>";
            } else {
                vHtml += "					                                                                    <span class='list_title'>숙박</span><span class='list_total_cost'>" + _fnGetNumber(_fnToZero(aToT), "sum") + "원</span>";
            }
            
            vHtml += "					                                                                </div>";
            if (_fnToZero(aToT) == 0) {
                vHtml += "					                                                                <div class='reserve_detail_show' style='display:none'>";
            } else {
                vHtml += "					                                                                <div class='reserve_detail_show'>";
            }
            $.each(aResult, function (a) {
                vHtml += "                                                                    <div class='list_info'>";
                if (_fnToZero(aResult[a]['PRC']) == 0) {
                    vHtml += "                                                                        <span class='info_title'>" + _fnToNull(aResult[a]['ROOM_NM']) + " : " + _fnToNull(aResult[a]['ROOM_CNT']) + "개</span><span class='info_cost'>별도문의</span>";
                } else {
                    vHtml += "                                                                        <span class='info_title'>" + _fnToNull(aResult[a]['ROOM_NM']) + " : " + _fnToNull(aResult[a]['ROOM_CNT']) + "개</span><span class='info_cost'>" + _fnGetNumber(_fnToZero(aResult[a]['PRC']), "sum") + "원</span>";
                }
                
                vHtml += "                                                                    </div>";
            });
            vHtml += "					                                                                </div>";
            vHtml += "					                                                            </div>";
            vHtml += "					                                                        </div>";
            if (_fnToZero(aToT) == 0) {
                vHtml += "                                                        <button type='button' class='hide_reserve_btn' id='hide_reserve_btn'><img src='/Images/show_detail.png' /></button>";
                vHtml += "                                                        <button type='button' class='show_reserve_btn' id='show_reserve_btn'><img src='/Images/hide_detail.png' /></button>";
            } else {
                vHtml += "                                                        <button type='button' class='hide_reserve_btn' id='hide_reserve_btn'><img src='/Images/hide_detail.png' /></button>";
                vHtml += "                                                        <button type='button' class='show_reserve_btn' id='show_reserve_btn'><img src='/Images/show_detail.png' /></button>";
            }
            vHtml += "					                                                    </div>";
            vHtml += "					                                                </div>";
            vHtml += "                                                <div class='reserve_detail_area'>";
            vHtml += "                                                    <div class='detail_list'>";
            vHtml += "                                                        <div class='detail_area'>";
            vHtml += "                                                            <div class='list_img'>";
            vHtml += "                                                                <img src='/Images/feed.png' />";
            vHtml += "                                                            </div>";
            vHtml += "                                                            <div class='list_cont'>";
            vHtml += "                                                                <div class='list_top'>";
            if (_fnToZero(bToT) == 0) {
                vHtml += "                                                                    <span class='list_title'>식사</span><span class='list_total_cost'>별도문의</span>";
            } else {
                vHtml += "                                                                    <span class='list_title'>식사</span><span class='list_total_cost'>" + _fnGetNumber(_fnToZero(bToT), "sum") + "원</span>";
            }
            
            vHtml += "                                                                </div>";
            if (_fnToZero(aToT) == 0) {
                vHtml += "                                                                <div class='reserve_detail_show' style='display:none'>";
            } else {
                vHtml += "                                                                <div class='reserve_detail_show'>";
            }
            
            $.each(bResult, function (b) {
                vHtml += "                                                                    <div class='list_info'>";
                if (_fnToZero(bResult[b]['PRC']) == 0) {
                    vHtml += "                                                                        <span class='info_title'>" + _fnToNull(bResult[b]['MEAL_NM']) + "</span><span class='info_cost'>별도문의</span>";
                } else {
                    vHtml += "                                                                        <span class='info_title'>" + _fnToNull(bResult[b]['MEAL_NM']) + "</span><span class='info_cost'>" + _fnGetNumber(_fnToZero(bResult[b]['PRC']), "sum") + "원</span>";
                }
                
                vHtml += "                                                                    </div>";
            });
            vHtml += "                                                                </div>";
            vHtml += "                                                            </div>";
            vHtml += "                                                        </div>";
            if (_fnToZero(bToT) == 0) {
                vHtml += "                                                        <button type='button' class='hide_reserve_btn' id='hide_reserve_btn'><img src='/Images/show_detail.png' /></button>";
                vHtml += "                                                        <button type='button' class='show_reserve_btn' id='show_reserve_btn'><img src='/Images/hide_detail.png' /></button>";
            } else {
                vHtml += "                                                        <button type='button' class='hide_reserve_btn' id='hide_reserve_btn'><img src='/Images/hide_detail.png' /></button>";
                vHtml += "                                                        <button type='button' class='show_reserve_btn' id='show_reserve_btn'><img src='/Images/show_detail.png' /></button>";
            }
            vHtml += "                                                    </div>";
            vHtml += "                                                </div>";
            vHtml += "                                                <div class='reserve_detail_area'>";
            vHtml += "                                                    <div class='detail_list'>";
            vHtml += "                                                        <div class='detail_area'>";
            vHtml += "                                                            <div class='list_img'>";
            vHtml += "                                                                <img src='/Images/camera.png' />";
            vHtml += "                                                            </div>";
            vHtml += "                                                            <div class='list_cont'>";
            vHtml += "                                                                <div class='list_top'>";
            if (_fnToZero(cToT) == 0) {
                vHtml += "                                                                    <span class='list_title'>부가서비스</span><span class='list_total_cost'>별도문의</span>";
            } else {
                vHtml += "                                                                    <span class='list_title'>부가서비스</span><span class='list_total_cost'>" + _fnGetNumber(_fnToZero(cToT), "sum") + "원</span>";
            }
            
            vHtml += "                                                                </div>";
            if (_fnToZero(cToT) == 0) {
                vHtml += "                                                                <div class='reserve_detail_show' style='display:none'>";
            } else {
                vHtml += "                                                                <div class='reserve_detail_show'>";
            }
            $.each(cResult, function (c) {
                vHtml += "                                                                    <div class='list_info'>";
                if (_fnToZero(cResult[c]['PRC']) == 0) {
                    vHtml += "                                                                        <span class='info_title'>" + _fnToNull(cResult[c]['SVC_NM']) + "</span><span class='info_cost'>별도문의</span>";
                } else {
                    vHtml += "                                                                        <span class='info_title'>" + _fnToNull(cResult[c]['SVC_NM']) + "</span><span class='info_cost'>" + _fnGetNumber(_fnToZero(cResult[c]['PRC']), "sum") + "원</span>";
                }
                
                vHtml += "                                                                    </div>";
            });
            vHtml += "                                                                </div>";
            vHtml += "                                                            </div>";
            vHtml += "                                                        </div>";
            if (_fnToZero(cToT) == 0) {
                vHtml += "                                                        <button type='button' class='hide_reserve_btn' id='hide_reserve_btn'><img src='/Images/show_detail.png' /></button>";
                vHtml += "                                                        <button type='button' class='show_reserve_btn' id='show_reserve_btn'><img src='/Images/hide_detail.png' /></button>";
            } else {
                vHtml += "                                                        <button type='button' class='hide_reserve_btn' id='hide_reserve_btn'><img src='/Images/hide_detail.png' /></button>";
                vHtml += "                                                        <button type='button' class='show_reserve_btn' id='show_reserve_btn'><img src='/Images/show_detail.png' /></button>";
            }
            vHtml += "                                                    </div>";
            vHtml += "                                                </div>";
            vHtml += "                                                <div class='reserve_detail_area'>";
            vHtml += "                                                    <div class='detail_list'>";
            vHtml += "                                                        <div class='detail_area'>";
            vHtml += "                                                            <div class='list_img'>";
            vHtml += "                                                                <img src='/Images/seminar.png' />";
            vHtml += "                                                            </div>";
            vHtml += "                                                            <div class='list_cont'>";
            vHtml += "                                                                <div class='list_top'>";
            if (_fnToZero(dToT) == 0) {
                vHtml += "                                                                    <span class='list_title'>세미나룸</span><span class='list_total_cost'>별도문의</span>";
            } else {
                vHtml += "                                                                    <span class='list_title'>세미나룸</span><span class='list_total_cost'>" + _fnGetNumber(_fnToZero(dToT), "sum") + "원</span>";
            }
            
            vHtml += "                                                                </div>";
            if (_fnToZero(dToT) == 0) {
                vHtml += "                                                                <div class='reserve_detail_show' style='display:none'>";
            } else {
                vHtml += "                                                                <div class='reserve_detail_show'>";
            }
            $.each(dResult, function (d) {
                vHtml += "                                                                    <div class='list_info'>";
                if (_fnToZero(dResult[d]['PRC']) == 0) {
                    vHtml += "                                                                        <span class='info_title'>" + _fnToNull(dResult[d]['CONF_TYPE']) + "</span><span class='info_cost'>별도문의</span>";
                } else {
                    vHtml += "                                                                        <span class='info_title'>" + _fnToNull(dResult[d]['CONF_TYPE']) + "</span><span class='info_cost'>" + _fnGetNumber(_fnToZero(dResult[d]['PRC']), "sum") + "원</span>";
                }
                
                vHtml += "                                                                    </div>";
            });
            vHtml += "                                                                </div>";
            vHtml += "                                                            </div>";
            vHtml += "                                                        </div>";
            if (_fnToZero(dToT) == 0) {
                vHtml += "                                                        <button type='button' class='hide_reserve_btn' id='hide_reserve_btn'><img src='/Images/show_detail.png' /></button>";
                vHtml += "                                                        <button type='button' class='show_reserve_btn' id='show_reserve_btn'><img src='/Images/hide_detail.png' /></button>";
            } else {
                vHtml += "                                                        <button type='button' class='hide_reserve_btn' id='hide_reserve_btn'><img src='/Images/hide_detail.png' /></button>";
                vHtml += "                                                        <button type='button' class='show_reserve_btn' id='show_reserve_btn'><img src='/Images/show_detail.png' /></button>";
            }
          
            vHtml += "                                                    </div>";
            vHtml += "                                                </div>";
            if (_fnToNull(eResult[i]['RMK']) != "") {
                vHtml += "                                                <div class='reserve_detail_area'>";
                vHtml += "                                                    <div class='detail_list'>";
                vHtml += "                                                        <div class='detail_area'>";
                vHtml += "                                                            <div class='list_cont'>";
                vHtml += "                                                                <div class='list_top'>";
                vHtml += "                                                                    <span class='remark_title'>Remark : " + _fnToNull(eResult[i]['RMK']) + "</span>";
                vHtml += "                                                                </div>";
                vHtml += "                                                            </div>";
                vHtml += "                                                        </div>";
                vHtml += "                                                    </div>";
                vHtml += "                                                </div>";
            }
            vHtml += "                                               </div>";
        });
        $("#ConFirmDetail")[0].innerHTML = vHtml;
        $("#CompareBkgNoData2").hide();
        $("#reserveDetail").show();
    } else {
        $("#CompareBkgNoData2").show();
        $("#reserveDetail").hide();
        $("#mod_min_prc").val("");
        $("#mod_max_prc").val("");
    }
    
};

function itemDetail(vJsonData) {

    $(".stay_form_box").empty();
    $(".seminar_box").empty();
    $(".option_box").empty();
    $(".feed_box").empty();
    $(".choice_stay1").css("background", "rgb(238, 239, 240)")
    $(".choice_stay2").css("background", "rgb(238, 239, 240)")
    var vHtml = "";
    var aResult = vJsonData.ItemDetailRoom_Show;
    var aResult_view = vJsonData.ReserveBottomRoom_Show;
    var bResult = vJsonData.ItemDetailMeal_Show;
    var cResult = vJsonData.ItemDetailSvc_Show;
    var dResult = vJsonData.ItemDetailConf_Show;


    var Fm_Date = $("#Mod_From_Date").val().replace(/-/g, '');
    var To_Date = $("#Mod_To_Date").val().replace(/-/g, '');

    var Date = _fnCompareDay(Fm_Date, To_Date);
    var Dateday = Date + 1



    //숙박*당일 체크 표시 단독으로 표기
    if ( (parseInt(To_Date)- parseInt(Fm_Date))  > 0) {
        $(".choice_stay1").css("background", "rgb(199, 233, 232)")
        $('#room_select').text("[숙박] 일정입니다. / " + "[" + Date + "]" + "박" + "[" + Dateday + "]" + "일 일정입니다.");
    }
    else if ((parseInt(To_Date) - parseInt(Fm_Date)) == 0) {
        $(".choice_stay2").css("background", "rgb(199, 233, 232)");
        $('#room_select').text("[당일] 일정입니다.");
    }

    $.each(aResult, function (i) {
        if (aResult[i].ROOM_CNT > 0) {
            //$(".choice_stay1").css("background", "rgb(199, 233, 232)")
            vHtml += "	<div class='stay_form room_form on'> ";
        }
        else {
            //$(".choice_stay2").css("background", "rgb(199, 233, 232)")
            vHtml += "	<div class='stay_form room_form'> ";
        }
        vHtml += "        <p>" + _fnToNull(aResult[i].ROOM_NM) + "</p> ";
        /*vHtml += "        <b style='display:none'>" + _fnToNull(aResult[i].BKG_SEQ) + "</b> ";*/
        vHtml += "        <p style=\"display:none;\">" + _fnToNull(aResult[i].BKG_SEQ) + "</p> ";
        vHtml += "        <div class='count_btn'> ";
        vHtml += "            <button type='button' class='minus' id='minus'></button> ";
        vHtml += "            <input type='text' class='ChkCount' id='count' value=" + _fnToNull(aResult[i].ROOM_CNT)+" maxlength = '4'> ";
        vHtml += "            <button type='button' class='plus' id='plus'></button> ";
        vHtml += "        </div> ";
        vHtml += "    </div>";
    });
    $(".rev_form_box").append(vHtml);
    vHtml = "";
    if (dResult.length > 0) {
        $.each(dResult, function (i) {
            if (_fnToNull(dResult[i].CONF_ON) == "Y") {
                vHtml += "	<div class='seminar seminar_form on'> ";
            }
            else {
                vHtml += "	<div class='seminar seminar_form'> ";
            }
            vHtml += "        <button class='seminar_btn'>" + _fnToNull(dResult[i].CONF_TYPE) + "</button> ";
            vHtml += "        <p style='display:none'>" + _fnToNull(dResult[i].BKG_SEQ) + "</p> ";
            if (_fnToNull(dResult[i].MAX_NUM) != "") {
                vHtml += "        <p class='room_info'>최대 " + _fnToNull(dResult[i].MAX_NUM) + "명 수용</p> ";
            } else {
                vHtml += "        <p class='room_info'></p> ";
            }
            vHtml += "    </div>";
        });
        $(".rev_seminar_box").append(vHtml);
        $(".seminar_area").show();
    } else {
        $(".seminar_area").hide();
    }
    vHtml = "";
    vHtml += "<div class='option feed_btn'>";
    vHtml += "    <button class='option_btn'><img src='/Images/feed.png'/>식사</button>";
    vHtml += "</div>";
    vHtml += "<div class='option_head' style='display: none;'>";
    vHtml += "    <div class='o_head' data-value='SVC_NM'></div>";
    vHtml += "    <div class='o_head' data-value='BKG_SEQ'></div>";
    vHtml += "</div>";
    $.each(cResult, function (i) {
        if (_fnToNull(cResult[i].SVC_YN) == "Y") {
            vHtml += "	<div class='option etc_form on'>	";
        } else {
            vHtml += "	<div class='option etc_form'>	";
        }
        vHtml += "        <button class='option_btn'>" + _fnToNull(cResult[i].SVC_NM) + "</button>";
        vHtml += "        <p style='display:none'>" + _fnToNull(cResult[i].BKG_SEQ) + "</p> ";
        vHtml += "    </div>";
    });
    $(".option_box").append(vHtml);


    vHtml = "";
    var chkMeal = false;
    $.each(bResult, function (i) {
        if (_fnToNull(bResult[i].MEAL_YN) == "Y") {
            chkMeal = true;
            vHtml += "	<div class='feed rev_form on'>";
        }
        else {
            vHtml += "	<div class='feed rev_form'>";
        }
        vHtml += "        <p>" + _fnToNull(bResult[i].MEAL_NM) + "</p>";
        vHtml += "        <p style='display:none'>" + _fnToNull(bResult[i].BKG_SEQ) + "</p> ";
        vHtml += "    </div>";
    });
    $(".rev_feed_box").append(vHtml);
    if (chkMeal) {
        $(".feed_btn").addClass("on")
    }

};


function ReserVationSearch(vJsonData) {
    var vHtml = "";
    var vResult = vJsonData.ReservationSearch_Show;

    //var aResult = vJsonData.ReserveBottomRoom_Show;
    //var bResult = vJsonData.ReserveBottomMeal_Show;
    //var cResult = vJsonData.ReserveBottomSvc_Show;
    //var dResult = vJsonData.ReserveBottomConf_Show;
    //var fResult = vJsonData.ReserveBottomMst_Show;

    //if (vResult.length == 0) {
    //    vHtml += "	<div>	 ";
    //    vHtml += "        <div class='no-data pc' id='CompareQuotNoData'> ";
    //    vHtml += "            <img src='/Images/no_data_estimate_pc.png' /> ";
    //    vHtml += "            <p> ";
    //    vHtml += "                요청하신<br /> ";
    //    vHtml += "                <span>견적내역이</span> 없습니다. ";
    //    vHtml += "            </p> ";
    //    vHtml += "        </div> ";
    //    vHtml += "        <div class='no-data mo'> ";
    //    vHtml += "            <img src='/Images/no_data_mo.png' /> ";
    //    vHtml += "            <p>요청하신 <span>견적내역이</span> 없습니다.</p> ";
    //    vHtml += "        </div> ";
    //    vHtml += "    </div>";
    //} else {
        //$("#ItemDetail").val(vResult[0]["ITEM_CD"]);
    if (vResult.length > 2) {
        $("#ReserveCompleted").css("height", "534px");
    } else {
        $("#ReserveCompleted").css("height", "unset");
    }
    $.each(vResult, function (i) {

        var ItemCnt = _fnToNull(vResult[i]['ITEM_NM']);
        var ItemGrdCnt = _fnToNull(vResult[i]['ITEM_GRD']);
        var ItemTypeCnt = _fnToNull(vResult[i]['ITEM_TYPE']);
        var Img = _fnToNull(vResult[i]['IMG_PATH']);
        var ReserveStatus = _fnToNull(vResult[i]['BKG_STATUS']);

        if (ReserveStatus == "N") {
            vHtml += "                                    <div class='compare_box reserve request'>";
        } else if (ReserveStatus == "Y") {
            vHtml += "                                    <div class='compare_box reserve compelete'>";
        } else if (ReserveStatus == "C") {
            vHtml += "                                    <div class='compare_box reserve cancle'>";
        } else if (ReserveStatus == "F") {
            vHtml += "                                    <div class='compare_box reserve final'>";
        } else if (ReserveStatus == "M") {//수정 요청건 modify로 수정 231004 dhkim
            vHtml += "                                    <div class='compare_box reserve modi'>";
        }
            vHtml += "                                  <div class='compare_list'>";
            if (Img != "") {
                vHtml += "                                    <div class='compare_img'><img src='" + _fnToNull(vResult[i].IMG_PATH) + "/" + _fnToNull(vResult[i].IMG_NM) + "' /></div>";
            } else {
                vHtml += "                                           <div class='compare_img'><img src='/Images/estimate_none.png'/></div>";
            };
            vHtml += "                                    <div class='compare_contents'>";
            vHtml += "                                        <div class='compare_date'>";
            vHtml += "                                            " + _fnDateFormat(_fnToNull(vResult[i]['STRT_DT'])) + " - " + _fnDateFormat(_fnToNull(vResult[i]['END_DT'])) + "";
            vHtml += "                                        </div>";
            vHtml += "                                        <div class='compare_info'>";
            vHtml += "                                            <div class='compare_title'>";
            vHtml += "                                                <span class='location_title'>" + _fnToNull(vResult[i]['AREA']) + "</span><span class='location_detail'>";
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
            vHtml += "                                            </div>";
            vHtml += "                                            <div class='price'>";
            vHtml += "                                                       <span class='price_title'>총 예상금액&nbsp;:</span>";
            if (_fnGetNumber(_fnToZero(vResult[i]['TOT_AMT']), "sum") != 0) {
                vHtml += "    <span class='orange'>" + _fnGetNumber(_fnToNull(vResult[i]['TOT_AMT']), 'sum') + '원' + " </span>";
            } else {
                vHtml += "    <span class='orange'> 별도 문의</span>";
            }
            vHtml += "    <span class='won'></span>";
            vHtml += "                                            </div>";
            vHtml += "                                            <div class='compare_detail'>";
            vHtml += "                                                <span class='show_detail' name='ReserveDetail'>예약상세보기</span>";
            vHtml += "                                                <input type ='hidden' Name='BkgNo' value='" + _fnToNull(vResult[i]['BKG_NO']) + "'/> ";
            vHtml += "                                                <input type ='hidden' Name='ITEM_CD' value='" + _fnToNull(vResult[i]['ITEM_CD']) + "'/> ";
            vHtml += "                                                <input type ='hidden' Name='MNG_NO' value='" + _fnToNull(vResult[i]['MNG_NO']) + "'/> ";
            vHtml += "                                            </div>";
            vHtml += "                                        </div>";
            vHtml += "                                    </div>";
            vHtml += "                                  <div class='reserve_num_area'>";
            vHtml += "                                    <span class='reserve_num'>예약번호:</span>" + "<span class='reserve_num'>" + _fnToNull(vResult[i]['BKG_NO']) + "</span>";
            vHtml += "                                  </div>";
            vHtml += "                                  </div>";
            vHtml += "                                  </div>                                                                                                             ";
                //vHtml += "                                  <div class='request_option' >";
                //vHtml += "                                      <div class='option_list'>                                                                                          ";
                //vHtml += "                                          <h4>요청옵션<span class='hide_option'>접기</span></h4>                                                           ";
                //vHtml += "                                          <div class='option_div'>                                                                                       ";
                //vHtml += "                                              <img src='/Images/stay.png' /><span>숙박</span><span>옵션 :";
                //$.each(aResult, function (i) {
                //    var alength = aResult.length;
                //    if (_fnToNull(aResult[i].ROOM_NM) != "") {
                //        vHtml += " " + _fnToNull(aResult[i].ROOM_NM) + " " + _fnToNull(aResult[i].ROOM_CNT) + "개 ";
                //    } else {
                //        vHtml += " 별도 문의";
                //    }
                //    if (alength - 1 > i) {
                //        vHtml += "|";
                //    }
                //});
                //vHtml += "                                          </span > ";
                //vHtml += "                                          </div>                                                                                                         ";
                //vHtml += "                                          <div class='option_div'>                                                                                       ";
                //vHtml += "                                              <img src='~/Images/feed.png' /><span>식사</span><span>옵션 : ";
                //$.each(bResult, function (i) {
                //    var alength = bResult.length;
                //    if (_fnToNull(bResult[i].MEAL_NM) != "") {
                //        vHtml += " " + _fnToNull(bResult[i].MEAL_NM);
                //    } else {
                //        vHtml += " 별도 문의";
                //    }
                //    if (alength - 1 > i) {
                //        vHtml += ",";
                //    }
                //});
                //vHtml += "    </span > ";
                //vHtml += "                                          </div>                                                                                                         ";
                //$.each(cResult, function (i) {
                //    if (_fnToNull(cResult[i].SVC_NM) != "") {
                //        vHtml += "                        <div class='option_div'>";
                //        vHtml += "                            <img src='/Images/etc.png'/><span>" + _fnToNull(cResult[i].SVC_NM) + "</span>";
                //        vHtml += "                        </div>";
                //    }
                //});
                //vHtml += "                                          <div class='etc_option'>                                                                                       ";
                //vHtml += "                                              <p>                                                                                                        ";
                //vHtml += "                                                  세미나룸 : ";
                //$.each(dResult, function (i) {
                //    var alength = dResult.length;
                //    vHtml += " " + _fnToNull(dResult[i].CONF_TYPE);
                //    if (alength - 1 > i) {
                //        vHtml += " | ";
                //    }
                //});
                //vHtml += "              " + "<br />";
                //if (_fnToNull(cResult[i].SVC_NM) != "") {
                //    if (_fnToNull(fResult[0]['RMK']) != "") {
                //        vHtml += "                                Remark : " + _fnToNull(fResult[0]['RMK']);
                //    }
                //}
                //vHtml += "                                              </p>                                                                                                       ";
                //vHtml += "                                          </div>                                                                                                         ";
                //vHtml += "                                      </div>                                                                                                             ";
                //vHtml += "                                     </div>                                                                                                             ";

            });
        
        $("#CompareBkgNoData").hide();
    
    $("#ReserveCompleted")[0].innerHTML = vHtml;
};


function InquiryReserve() {
    var objJsonData = new Object();
    objJsonData.BKG_NO = $('input[name=bKg_no]').val();
    objJsonData.INQ_TYPE = "B";
    $.ajax({
        type: "POST",
        url: "/Reservation/ReserveInquirySelect",
        async: true,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {
            ReserveInquirySelect(result);
            $('#talkBox_Reserve').scrollTop($('#talkBox_Reserve')[0].scrollHeight);
        },
        error: function (error) {
            alert("에러");
        }
    });
}



$(document).on("click", '#Refresh', function () {
    var objJsonData = new Object();
    objJsonData.BKG_NO = $('input[name=bKg_no]').val();
    objJsonData.INQ_TYPE = "B";
    $.ajax({
        type: "POST",
        url: "/Reservation/ReserveInquirySelect",
        async: true,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {
            ReserveInquirySelect(result);
            $('#talkBox_Reserve').scrollTop($('#talkBox_Reserve')[0].scrollHeight);
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
    });

})
function ReserveInquirySelect(vJsonData) {

    var vHtml = "";
    var vResult = _fnToNull(vJsonData.ReserveInquirySelect_Show);

    $("#talkBox_Reserve").empty();
    if (vResult.length > 0) {
        $("#Inq_Cnt_Reserve").text("문의횟수 : " + vResult[0]["INQ_CNT"].toString() + "회");
    }
    else {
        $("#Inq_Cnt_Reserve").text("문의횟수 : 0회");
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

    $("#talkBox_Reserve").append(vHtml);
    $("#InquiryText_Reserve").val("");
}


$(document).on('click', '#ReservCancelAlert', function () {
    var objJsonData = new Object();
    objJsonData.BKG_NO = $("#CancleBkg").val();

    $.ajax({
        type: "POST",
        url: "/Reservation/ReservCancelAlert",
        async: true,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {            
            $("#ReservCancel").click();
            $("#estimate_search_Reserve").click();
            
        },
        error: function (error) {
            alert("에러");
        }
    });
})

$(document).on("click", '#btn_talk_Reserve', function () {
    if (_fnToNull($("#InquiryText_Reserve").val()) == "") {
        _fnAlertMsg("문의사항을 입력해주세요.");
        return false;
    }


    var objJsonData = new Object();
    objJsonData.BKG_NO = $('input[name=bKg_no]').val();
    objJsonData.INQ_TYPE = "B";
    objJsonData.INQ_CONTENT = _fnToNull($("#InquiryText_Reserve").val().replace(/\[|\]/g, ''));
    objJsonData.INQ_USR = _fnToNull($("#Session_CUST_NAME").val());

    $.ajax({
        type: "POST",
        url: "/Reservation/ReserveInquire",
        async: false,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData)},
        success: function (result) {
            TalkDataReserve(result);
            $('#talkBox_Reserve').scrollTop($('#talkBox_Reserve')[0].scrollHeight);
        },
        error: function (error) {
            alert("에러");
        }
    });
});



function TalkDataReserve(vJsonData) {

    var vHtml = "";
    var vResult = vJsonData.ReseveInquireDetail_Show;

    $("#talkBox_Reserve").empty();
    $("#Inq_Cnt_Reserve").text("문의횟수 : " + vResult.length + '회');
    vHtml += "                                                    <div class='chat ch1'>";
    vHtml += "                                                        <div class='icon'><i class='fa-solid fa-user'></i></div>";
    vHtml += "                                                        <div class='talk_area'>";
    vHtml += "                                                            <div class='textbox'>문의사항 남겨주세요.</div>";
    vHtml += "                                                        </div>";
    vHtml += "                                                    </div>";
    $.each(vResult, function (i) {
        vHtml += "                                                    <div class='chat ch2'>";
        vHtml += "                                                        <div class='icon'><i class='fa-solid fa-user'></i></div>";
        vHtml += "                                                        <div class='talk_area'>";
        vHtml += "                                                            <div class='textbox'>" + _fnToNull(vResult[i]['INQ_CONTENT']) + "</div>";
        vHtml += "                                                            <p class='talk_date'>" + _fnDateFormating(_fnToNull(vResult[i]['INQ_YMD'])) + "</p>";
        vHtml += "                                                        </div>";
        vHtml += "                                                    </div>";
        if (_fnToNull(vResult[i]['ANSWER']) != "") {
            vHtml += "                                                    <div class='chat ch1'>";
            vHtml += "                                                        <div class='icon'><i class='fa-solid fa-user'></i></div>";
            vHtml += "                                                        <div class='talk_area'>";
            vHtml += "                                                            <div class='textbox'>" + _fnToNull(vResult[i]['ANSWER']) + "</div>";
            vHtml += "                                                            <p class='talk_date'>" + _fnToNull(_fnDateFormating(vResult[i]['ANS_YMD'])) + "</p>";
            vHtml += "                                                        </div>";
            vHtml += "                                                    </div>";
        }
    });

    $("#talkBox_Reserve").append(vHtml);
    $("#InquiryText_Reserve").val("");
}

$(document).on('click', '.hide_option', function (e) {
    e.stopImmediatePropagation();
    var op = $(this).parents('.request_option');
    op.slideUp();
});

function ReserveDetailBottom(vJsonData) {
    var vHtml = "";
    var aResult = vJsonData.ReserveBottomRoom_Show;
    var bResult = vJsonData.ReserveBottomMeal_Show;
    var cResult = vJsonData.ReserveBottomSvc_Show;
    var dResult = vJsonData.ReserveBottomConf_Show;
    var fResult = vJsonData.ReserveBottomMst_Show;
    


    $.each(fResult, function (i) {

        vHtml += "                                  <div class='request_option'  style='display:block'>";
        vHtml += "                                      <div class='option_list'>                                                                                          ";
        vHtml += "                                          <h4>요청옵션<span class='hide_option'>접기</span></h4>                                                           ";
        vHtml += "                                          <div class='option_div'>                                                                                       ";
        vHtml += "                                              <img src='/Images/stay.png' /><span>숙박</span><span>옵션 :";
        if (aResult.length > 0) {
            $.each(aResult, function (i) {
                var alength = aResult.length;
                if (_fnToNull(aResult[i].ROOM_NM) != "") {
                    vHtml += " " + _fnToNull(aResult[i].ROOM_NM) + " " + _fnToNull(aResult[i].ROOM_CNT) + "개 ";
                } else {
                    vHtml += " 별도 문의";
                }
                if (alength - 1 > i) {
                    vHtml += "|";
                }
            });
        }
        vHtml += "                                          </span > ";
        vHtml += "                                          </div>                                                                                                         ";
        vHtml += "                                          <div class='option_div'>                                                                                       ";
        vHtml += "                                              <img src='/Images/feed.png' /><span>식사</span><span>옵션 : ";
        if (bResult.length > 0) {
            $.each(bResult, function (i) {
                var alength = bResult.length;
                if (_fnToNull(bResult[i].MEAL_NM) != "") {
                    vHtml += " " + _fnToNull(bResult[i].MEAL_NM);
                } else {
                    vHtml += " 별도 문의";
                }
                if (alength - 1 > i) {
                    vHtml += ",";
                }
            });
        }
        vHtml += "    </span > ";
        vHtml += "                                          </div>                                                                                                         ";
        if (cResult.length > 0) {
            $.each(cResult, function (i) {
                if (_fnToNull(cResult[i].SVC_NM) != "") {
                    vHtml += "                        <div class='option_div'>";
                    vHtml += "                            <img src='/Images/etc.png'/><span>" + _fnToNull(cResult[i].SVC_NM) + "</span>";
                    vHtml += "                        </div>";
                }
            });
        }
        vHtml += "                                          <div class='etc_option'>                                                                                       ";
        vHtml += "                                              <p>                                                                                                        ";
        vHtml += "                                                  세미나룸 : ";
        if (dResult.length > 0) {
            $.each(dResult, function (i) {
                var alength = dResult.length;
                vHtml += " " + _fnToNull(dResult[i].CONF_TYPE);
                if (alength - 1 > i) {
                    vHtml += " | ";
                }
            });
        }
        vHtml += "              " + "<br />";
        if (_fnToNull(fResult[i]['RMK']) != "") {
            vHtml += "                                Remark : " + _fnToNull(fResult[i]['RMK']);
        }
        vHtml += "                                              </p>                                                                                                       ";
        vHtml += "                                          </div>                                                                                                         ";
        vHtml += "                                      </div>                                                                                                             ";
        vHtml += "                                     </div>                                                                                                             ";

    });
    var op = $(this).children('.request_option');
    op.slideDown();
    op.addClass('on');
    alert($(this))
    $(this).closest('.compare_list').after(vHtml);

};


$(document).on('click', '#ReserveDown', function () {
    var File_Path = _fnToNull($("#File_Path").val());
    var File_Nm = _fnToNull($("#File_Nm").val());

    window.location = "/Estimate/DownloadFile?FILE_NM=" + File_Nm + "&FILE_PATH=" + File_Path;

});


$(document).ready(function () {
    $('.simple-estimate').hide();
    $('.company_info').hide();
});
$(document).on('click', '.compare_box.reserve.compelete', function () {
    $('.compare_box.reserve.compelete').removeClass('on');
    $('.compare_box.reserve.cancle').removeClass('on');
    $('.compare_box.reserve.request').removeClass('on');
    $('#review_btn').hide();
    if ($(this).hasClass('on') === true) {
        $(this).removeClass('on');
    } else {
        $(this).addClass('on');
    }
});
$(document).on('click', '.compare_box.reserve.request', function () {
    $('.compare_box.reserve.compelete').removeClass('on');
    $('.compare_box.reserve.cancle').removeClass('on');
    $('.compare_box.reserve.request').removeClass('on');
    $('#review_btn').hide();
    if ($(this).hasClass('on') === true) {
        $(this).removeClass('on');
    } else {
        $(this).addClass('on');
    }
});
$(document).on('click', '.compare_box.reserve.cancle', function () {
    $('.compare_box.reserve.compelete').removeClass('on');
    $('.compare_box.reserve.request').removeClass('on');
    $('.compare_box.reserve.cancle').removeClass('on');
    $(this).removeClass('on');
    $('#review_btn').hide();
    $('.compare_box.reserve.compelete').removeClass('on');
    if ($(this).hasClass('on') === true) {
        $(this).removeClass('on');
    } else {
        $(this).addClass('on');
    }
});
$(document).on('click', '.compare_box.reserve.final', function () {
    $('#review_btn').show();
    $('.compare_box.reserve.cancle').removeClass('on');
    $('.compare_box.reserve.compelete').removeClass('on');
});

$(document).on('click', '.reserve_detail_area', function () {
    var show_list = $(this).find('.reserve_detail_show');
    var show_btn = $(this).find('#show_reserve_btn');
    var hide_btn = $(this).find('#hide_reserve_btn');
    if (show_list.css("display") == "block") {
        hide_btn.hide();
        show_btn.show();
        show_list.slideUp();
    } else if (show_list.css("display") == "none") {
        hide_btn.show();
        show_btn.hide();
        show_list.slideDown();
    }
})

$(document).on('click', '.regulation_cont', function () {
    var i = $(this).children('.regulation_detail');
    var h = $(this).children('.regulation_txt').children('#hide_regulation_btn');
    var s = $(this).children('.regulation_txt').children('#show_regulation_btn');
    $(this).addClass('on')
    s.hide();
    h.show();
    if (i.css("display") == "none") {
        i.slideDown();
    }
})
$(document).on('click', '.regulation_cont.on', function () {
    var i = $(this).children('.regulation_detail');
    var h = $(this).children('.regulation_txt').children('#hide_regulation_btn');
    var s = $(this).children('.regulation_txt').children('#show_regulation_btn');
    $(this).removeClass('on')
    h.hide();
    s.show();
    if (i.css("display") == "block") {
        i.slideUp();
    }
})

$(document).on('click', '.mileage_cont', function () {
    var i = $(this).children('.mileage_detail');
    var h = $(this).children('.mileage_txt').children('#hide_mileage_btn');
    var s = $(this).children('.mileage_txt').children('#show_mileage_btn');
    $(this).addClass('on')
    s.hide();
    h.show();
    if (i.css("display") == "none") {
        i.slideDown();
    }
})
$(document).on('click', '.mileage_cont.on', function () {
    var i = $(this).children('.mileage_detail');
    var h = $(this).children('.mileage_txt').children('#hide_mileage_btn');
    var s = $(this).children('.mileage_txt').children('#show_mileage_btn');
    $(this).removeClass('on')
    h.hide();
    s.show();
    if (i.css("display") == "block") {
        i.slideUp();
    }
})

$(document).on('click', '.announce_cont', function () {
    var i = $(this).children('.announce_detail');
    var h = $(this).children('.announce_txt').children('#hide_use_btn');
    var s = $(this).children('.announce_txt').children('#show_use_btn');
    $(this).addClass('on')
    s.hide();
    h.show();
    if (i.css("display") == "none") {
        i.slideDown();
    }
})
$(document).on('click', '.announce_cont.on', function () {
    var i = $(this).children('.announce_detail');
    var h = $(this).children('.announce_txt').children('#hide_use_btn');
    var s = $(this).children('.announce_txt').children('#show_use_btn');
    $(this).removeClass('on')
    h.hide();
    s.show();
    if (i.css("display") == "block") {
        i.slideUp();
    }
})

$(document).on("click", '.r_tab', function () {
    $('.r_tab').removeClass('on');
    $(this).addClass('on');
    if ($(this).attr('id') == "inquriy") {
        $("._inquiry").show();
    }
})
//$(document).on('click', '#inquriy', function () {
//    $(this).addClass('on');
//    $('.estimate_detail').removeClass('on');
//    $('._inquriy').addClass('on');
//    $('#request_modify').removeClass('on');
//    $('#inquriy').removeClass('on');
//})
//$(document).on('click', '#reserve_detail', function () {
//    $(this).addClass('on');
//    $('.estimate_detail').addClass('on');
//    $('.modify').removeClass('on');
//    $('#request_modify').removeClass('on');
//    $('#inquriy').removeClass('on');
//})
//$(document).on('click', '#request_modify', function () {
//    $(this).addClass('on');
//    $('.estimate_detail').removeClass('on');
//    $('.modify').addClass('on');
//    $('#reserve_detail').removeClass('on');
//    $('#inquriy').removeClass('on');
//})
$(document).on("focusout", "#Mod_From_Date", function () {

    var startDate = $("#Mod_From_Date").val().replace(/-/gi, ""); //시작일
    var endDate = $("#Mod_To_Date").val().replace(/-/gi, ""); //종료일

    var Date = _fnCompareDay(startDate, endDate);
    var Dateday = Date + 1

    $('#room_select').empty();

    $('#room_select').text("[숙박] 일정입니다. / " + "[" + Date + "]" + "박" + "[" + Dateday + "]" + "일 일정입니다.");

});

$(document).on("focusout", "#Mod_To_Date", function () {
    var startDate = $("#Mod_From_Date").val().replace(/-/gi, ""); //시작일
    var endDate = $("#Mod_To_Date").val().replace(/-/gi, ""); //종료일

    var Date = _fnCompareDay(startDate, endDate);
    var Dateday = Date + 1

    $('#room_select').empty();

    $('#room_select').text("[숙박] 일정입니다. / " + "[" + Date + "]" + "박" + "[" + Dateday + "]" + "일 일정입니다.");
});

//당일 버튼클릭
$(document).on('click', '#room_date_select_btn', function () {
    $('#room_select').empty();
    $('#room_select').text("[당일] 일정입니다.");
    var FromDt = _fnToNull($("#Mod_From_Date").val());
    $("#Mod_To_Date").val(FromDt);
    $(".stay_form ").each(function (i) {
        $(this).removeClass('on');
        $(this).find("#count").val(0);
    });
});
//숙박 버튼클릭
$(document).on('click', '#room_select_btn', function () {
    var startDate = $("#Mod_From_Date").val().replace(/-/gi, ""); //시작일
    var endDate = $("#Mod_To_Date").val().replace(/-/gi, ""); //종료일

    var Date = _fnCompareDay(startDate, endDate);
    var Dateday = Date + 1

    $('#room_select').empty();

    $('#room_select').text("[숙박] 일정입니다. / " + "[" + Date + "]" + "박" + "[" + Dateday + "]" + "일 일정입니다.");
});
$(document).on("click", '#reserve_detail', function () {
    $('.estimate_detail').addClass('on');
    $('.modify').removeClass('on');
    $('.modify').addClass('off');
    $('._inquiry').removeClass('on');
    $('._inquiry').addClass('off');
})
$(document).on("click", '#request_modify', function () {
    var startDate = $("#Mod_From_Date").val().replace(/-/gi, ""); //시작일
    var endDate = $("#Mod_To_Date").val().replace(/-/gi, ""); //종료일

    var Date = _fnCompareDay(startDate, endDate);
    var Dateday = Date + 1

    $('#room_select').empty();

    if (startDate == endDate) {
        $('#room_select').text("[당일] 일정입니다.");
    } else {
        $('#room_select').text("[숙박] 일정입니다. / " + "[" + Date + "]" + "박" + "[" + Dateday + "]" + "일 일정입니다.");
    }

    $('.modify').addClass('on');
    $('.estimate_detail').removeClass('on');
    $('._inquiry').removeClass('on');
    $('._inquiry').addClass('off');
    $('.modify').removeClass('off');
})
$(document).on("click", '#inquriy', function () {
    $('._inquiry').addClass('on');
    $('.estimate_detail').removeClass('on');
    $('.modify').removeClass('on');
    $('.modify').addClass('off');
    $('._inquiry').removeClass('off');
})

$(document).on("click", '.compare_box.reserve.cancle', function () {
    $('.reserve_info.estimate_detail').addClass('off2');
    $('#request_modify').hide();
    $('#inquriy').hide();
    $("#reserve_detail").click();
    $('.file_btn').hide();
    $('#ReserveCancel').hide();
})
$(document).on("click", '.compare_box.reserve.compelete', function () {
    $('.reserve_info.on').removeClass('off2');
    $('#request_modify').show();
    $('#request_modify').text("수정 요청");
    $('#inquriy').show();
    $('.file_btn').show();
    $('.cancle_request').show();
})
$(document).on("click", '.compare_box.reserve.request', function () {
    $('.reserve_info.on').removeClass('off2');
    $('#request_modify').show();
    $('#request_modify').text("정보 수정");
    $('#inquriy').show();
    $('.file_btn').show();
    $('.cancle_request').show();
})
$(document).on("click", '.compare_box.reserve.final', function () {
    $('.reserve_info.on').removeClass('off2');
    $("#reserve_detail").click();
    $('#request_modify').hide();
    $('#inquriy').hide();
    $('.cancle_request').hide();
    $('.file_btn').show();
    $('.reserve_info._inquiry').hide();
})
$(document).on("click", '.compare_box.reserve.modi', function () {
    $('.reserve_info.on').removeClass('off2');
    $("#reserve_detail").click();
    $('#request_modify').hide();
    $('#inquriy').show();
    $('.cancle_request').show();
    $('.file_btn').show();
    $('.reserve_info._inquiry').hide();
    $('#review_btn').hide();
})
$(document).on('click', '#review_btn', function () {

    fnGetComment_Res();
    $('#alert07').show();
    $('html').css('overflow', 'hidden');
    
})


$(document).on('click', '.cancle_request', function () {
    $('#ReserveCancle').show();
})
$(document).on('click', '.ok_btn', function () {
    /*$('.cancle_request').addClass('none');*/
})

function fnMoveList(vId) {
    var offset = $("#" + vId).offset();
    //클릭시 window width가 몇인지 체크
    var windowWidth = $(window).width();
    var vHeaderHeight = $("#header").height();

    if (windowWidth < 1025) {
        $('html, body').animate({ scrollTop: offset.top - vHeaderHeight - (-50) }, 10);
    }

}

function fnGetComment_Res() {
    try {

        var objJsonData = new Object();
        objJsonData.ITEM_CD = _fnToNull($("#ItemDetail").val());
        objJsonData.BKG_NO = _fnToNull($("input[name=bKg_no]").val());

        $.ajax({
            type: "POST",
            url: "/Reservation/ResGetCommentInfo",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (result.Result[0]["trxCode"] == "Y") {
                    fnSetComment_Res(result);
                } else {
                    //_fnAlertMsg("담당자에게 문의 해주세요.");
                }
            }
        })
    } catch (err) {
        _fnAlertMsg("담당자에게 문의 해주세요.");
        console.log("[Error - fnGetComment()]" + err.message);
    }
}

function fnSetComment_Res(result) {
    try {

        var vHtml = "";
        var vResult = result.ResGetCommentInfo_Show;
        

        $(".sub_info_area").empty();
        if (vResult.length > 0) {
            var vSplit = _fnToNull(vResult[0]["TAG"]).split("#");
            var vHtml = "";

            $("#my_subject").val(_fnToNull(vResult[0].ITEM_NM));
            $("#my_hotel").text(_fnToNull(vResult[0].ITEM_NM));
            $("#my_date").text(_fnPlusDate(0));
            $("#my_item_no").val(_fnToNull(vResult[0].ITEM_CD));
            $("#my_bkg_no").val(_fnToNull(vResult[0].BKG_NO));
            $("#milage_total_amt").val(_fnToNull(vResult[0].TOT_AMT));
            if (vSplit.length > 1) {
                $.each(vSplit, function (t) {
                    if (t > 0) {

                        vHtml += "         <div class=\"sub_info\" id=\"my_tag\">";
                        vHtml += "            <div class=\"_sub\">" + vSplit[t] + "</div>";
                        vHtml += "         </div>";
                    }
                });
            }
            $("#my_tag").append(_fnToNull(vHtml));
        }

    } catch (err) {
        console.log("[Error - fnSetComment()]" + err.message);
    }
}

$(document).on('click', '#my_complete', function () {
    try {
        if (_fnToNull($("#my_subject").val()) == "") {
            _fnLayerAlertMsg("제목은 필수입력 입니다.");
            return false;
        }

        if (_fnToNull($("#my_contents").val()) == "") {
            _fnLayerAlertMsg("내용은 필수입력 입니다.");
            return false;
        }


        var objJsonData = new Object();

        objJsonData.MNGT_NO = _fnSequenceMngt("NO");
        objJsonData.BKG_NO = $("input[name=bKg_no]").val();
        objJsonData.CMT_SUBJECT = _fnToNull($("#my_subject").val()); //제목
        objJsonData.CMT_SCORE = $(".starR.on").length; //별점
        objJsonData.CMT_CONTENTS = $("#my_contents").val(); //내용
        objJsonData.CMT_IMG1_PATH = $("#add_img_path1").val(); //이미지경로 히든값
        objJsonData.CMT_IMG2_PATH = $("#add_img_path2").val();
        objJsonData.CMT_IMG3_PATH = $("#add_img_path3").val();
        objJsonData.CMT_IMG4_PATH = $("#add_img_path4").val();
        objJsonData.EMAIL = $("#Session_EMAIL").val();
        objJsonData.ITEM_NO = $("#my_item_no").val(); //아이템넘버 히든값
        objJsonData.CUST_NAME = $("#Session_CUST_NAME").val(); //아이템넘버 히든값
        objJsonData.TOT_AMT = _fnPercent($("#milage_total_amt").val());
        objJsonData.GRP_CD = $("#Session_GRP_CD").val();

        $.ajax({
            type: "POST",
            url: "/Myboard/fnAddcomment",
            async: false,
            dataType: "json",
            data: { "vJSonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (result["rec_cd"] == "Y") {
                    _fnAlertMsg("후기 작성이 완료되었습니다.")
                    $(document).on('click', '#findpwalert', function () {
                        sessionStorage.setItem("review", "Y");
                        window.location = "/Service/Index";
                    })
                } else if (result["rec_cd"] == "N") {
                    _fnAlertMsg("후기 작성을 실패하였습니다.")
                    console.log("[Fail - fnCmtcomment()]" + result.Result[0]["trxCode"]);
                } else if (result["rec_cd"] == "E") {
                    _fnAlertMsg("후기 작성을 실패하였습니다.")
                    console.log("[Fail - fnCmtcomment()]" + result.Result[0]["trxCode"]);
                }
            }
        });
    }
    catch (err) {
        console.log("[Fail - fnCmtcomment()]" + err.message);
    }
});


$(document).on('change', '#add_pic1', function () {
    ContUpload(this, "add_img_path1");
});
$(document).on('change', '#add_pic2', function () {
    ContUpload(this, "add_img_path2");
})
$(document).on('change', '#add_pic3', function () {
    ContUpload(this, "add_img_path3");
})
$(document).on('change', '#add_pic4', function () {
    ContUpload(this, "add_img_path4");
})

$(document).on('click', '.starRev span', function () {
    $(this).parent().children('span').removeClass('on');
    $(this).addClass('on').prevAll('span').addClass('on');
    return false;
});
function ContUpload(value, id) {

    var load = $(this).siblings('label').children('img');
    var formData = new FormData();
    var fileinput = $(value);
    var fileName = "";

   // for (var i = 0; i < fileinput.length; i++) {
    if (fileinput[0].files.length > 0) {
            //for (var j = 0; j < fileinput0i].files.length; j++) {
              formData.append('file', fileinput[0].files[0]);
              fileName = fileinput[0].files[0].name;
            //}
   // }

        $.ajax({
            type: "POST",
            enctype: "multipart/form-data",
            url: "/Admin/UploadHandler",
            async: true,
            dataType: "json",
            data: formData,
            contentType: false, // Not to set any content header
            processData: false, // Not to process data
            success: function (result) {
                if (result["rec_cd"] == "Y") {

                    var this_area = $(value).closest("div");
                    var img = $(value).siblings("label").children();
                    var label = $(value).siblings("label")
                    $(img).attr("src", result["res_msg"] + "/" + fileName);
                    $("#" + id).val(result["res_msg"] + "/" + fileName);
                    //var commentimg = result["res_msg"] + "/" + fileName;

                    this_area.removeClass("no_img");

                    label.removeClass('on');
                    img.removeClass('unload_img');
                    img.addClass('upload_img');
                    img.css('padding', '0!important');
                } else if ((result)["rec_cd"] == "N") {
                    console.log("[Fail - fileUpload]" + JSON.parse(result).Result[0]["trxMsg"]);
                } else if ((result)["rec_cd"] == "E") {
                    console.log("[Fail - fileUpload]" + JSON.parse(result).Result[0]["trxMsg"]);
                }
            }
        })

    }
}



//김은빈
$(".modify_btn").click(function (e) {

    _fnLayerConfirmMsg("예약수정 요청 하시겠습니까?");
});

$(document).on('click', '#RevModConfirm', function () 
{
        HomeEstimateCompare($("#ItemDetail").val());
    
});

////ETD 날짜 yyyymmdd 로 입력 시 yyyy-mm-dd 로 변경
//$(document).on("focusout", "#Mod_From_Date", function () {
//    var vValue = $("#Mod_From_Date").val();

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
//        var vETD = $("#Mod_From_Date").val().replace(/[^0-9]/g, "");
//        var vETA = $("#Mod_To_Date").val().replace(/[^0-9]/g, "");

//        if (vETA < vETD) {
//            _fnAlertMsg("시작일자는 종료일자보다 이후 일수 없습니다.");
//            $("#Mod_To_Date").val(vETD.substring("0", "4") + "-" + vETD.substring("4", "6") + "-" + vETD.substring("6", "8"));
//            //숙박*당일 체크 표시 단독으로 표기
//            if ((parseInt(vETA) - parseInt(vETD)) > 0) {
//                $(".choice_stay1").css("background", "rgb(199, 233, 232)")
//                $('#room_select').text("[숙박] 일정입니다. / " + "[" + Date + "]" + "박" + "[" + Dateday + "]" + "일 일정입니다.");
//            }
//            else if ((parseInt(vETA) - parseInt(vETD)) <= 0) {
//                /*$(".choice_stay2").css("background", "rgb(199, 233, 232)");*/
//                $('#room_select').text("[당일] 일정입니다.");
//            }
//        }

//    }

//});

////ETD 날짜 yyyymmdd 로 입력 시 yyyy-mm-dd 로 변경
//$(document).on("focusout", "#Mod_To_Date", function () {
//    var vValue = $("#Mod_To_Date").val();

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
//        var vETD = $("#Mod_From_Date").val().replace(/[^0-9]/g, "");
//        var vETA = $("#Mod_To_Date").val().replace(/[^0-9]/g, "");

//        if (vETA < vETD) {
//            _fnAlertMsg("종료일자는 시작일자보다 이전 일수 없습니다.");
//            $("#Mod_To_Date").val(vETD.substring("0", "4") + "-" + vETD.substring("4", "6") + "-" + vETD.substring("6", "8"));
//            //숙박*당일 체크 표시 단독으로 표기
//            if ((parseInt(vETA) - parseInt(vETD)) > 0) {
//                $(".choice_stay1").css("background", "rgb(199, 233, 232)")
//                $('#room_select').text("[숙박] 일정입니다. / " + "[" + Date + "]" + "박" + "[" + Dateday + "]" + "일 일정입니다.");
//            }
//            else if ((parseInt(To_Date) - parseInt(Fm_Date)) == 0) {
//                $(".choice_stay2").css("background", "rgb(199, 233, 232)");
//                $('#room_select').text("[당일] 일정입니다.");
//            }
//        }
//    }
//});



var objJD = new Object();
var chkOn = false;
function HomeEstimateCompare(item_cd) {
    try {

        var objJsonData = new Object();
        objJsonData.BKG_MOD_NO = _fnToNull(_fnSequenceMngt("BKG_MOD")); //REQ_NO
        objJsonData.BKG_NO = _fnToNull($('.confirm_box').find("input[name='bKg_no']").val());
        objJsonData.STRT_YMD = _fnToNull($("#Mod_From_Date").val()).replace(/-/gi, ""); //시작일
        objJsonData.END_YMD = _fnToNull($("#Mod_To_Date").val()).replace(/-/gi, ""); //종료일
        objJsonData.MIN_PRC = _fnToNull($('#mod_min_prc').val()).replace(/,/gi, ""); //최소금액
        objJsonData.MAX_PRC = _fnToNull($('#mod_max_prc').val()).replace(/,/gi, ""); //최대금액
        //예상인원
        objJsonData.RMK = _fnToNull($('#RMK').val().replace(/\[|\]/g, ''));
        objJsonData.HEAD_CNT = _fnToNull($('#HEAD_CNT').val()); //비고
        objJsonData.INS_USR = _fnToNull($("#Session_CUST_NAME").val()); //사용자
        //objJsonData.REQ_NM = $('#Session_CUST_NAME').val(); //사용자이름
        //objJsonData.REQ_EMAIL = $('#Session_EMAIL').val(); //사용자메일
        //objJsonData.REQ_CUST_NM = $('#Session_COMPANY').val(); //사용자회사명
        //objJsonData.REQ_TEL = $('#Session_TELNO').val().replace(/-/gi, ""); //사용자번호
        //objJsonData.USR_TYPE = $('#Session_USER_TYPE').val(); //유저타입

        objJD.MAIN = JSON.parse(_fnMakeJson(objJsonData));

        //객실
        var roomcolums = $('.room_head .r_head').map(function () {
            return $(this).attr('data-value');
        }).get();

        var obj1 = "";
        var arry = new Array();
        var chkOn = false;

        var roomcl = $('.room_form').map(function (idx, el) {
            const td = $(el).children();
            obj1 = { id: idx + 1 };
            for (var i = 0; i < roomcolums.length; i++) {
                if ($(el).hasClass("on")) {
                    chkOn = true;
                    if (i == 0) {
                        obj1[roomcolums[i]] = td.eq(0).text().trim();
                    } else if (i == 1) {
                        obj1[roomcolums[i]] = td.eq(1).text().trim();
                    } else {
                        obj1[roomcolums[i]] = td.find('input').val();
                    }
                } else {
                    chkOn = false;
                }
            }
            if (chkOn) {
                obj1.INS_USR = $("#Session_CUST_NAME").val();
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

        var seminacl = $('.seminar_form').map(function (idx, el) {
            const td = $(el);
            console.log(td);
            obj1 = { id: idx + 1 };
            for (var i = 0; i < seminacolums.length; i++) {
                if ($(el).hasClass("on")) {
                    chkOn = true;
                    if (i == 0) {
                        obj1[seminacolums[i]] = td.find("button").text();
                    } else if (i == 1) {
                        obj1[seminacolums[i]] = td.find("p").text().trim();
                    }
                } else {
                    chkOn = false;
                }
            }
            if (chkOn) {
                obj1.INS_USR = $("#Session_CUST_NAME").val();
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

        var foodcl = $('.rev_form').map(function (idx, el) {
            const td = $(el).children();
            console.log(td);
            obj1 = { id: idx + 1 };
            for (var i = 0; i < foodcolums.length; i++) {
                if ($(el).hasClass("on")) {
                    chkOn = true;
                    if (i == 0) {
                        obj1[foodcolums[i]] = td.eq(0).text().trim();
                    } else if (i == 1) {
                        obj1[foodcolums[i]] = td.eq(1).text().trim();
                    }

                } else {
                    chkOn = false;
                }
            }
            if (chkOn) {
                obj1.INS_USR = $("#Session_CUST_NAME").val();
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

        var optioncl = $('#reserveDetail .etc_form').map(function (idx, el) {
            const td = $(el);
            obj1 = { id: idx + 1 };
            for (var i = 0; i < optioncolums.length; i++) {
                if ($(el).hasClass("on")) {
                    chkOn = true;
                    if (i == 0) {
                        obj1[optioncolums[i]] = td.find('button').text();
                    } else if (i == 1) {
                        obj1[optioncolums[i]] = td.children().eq(1).text().trim();
                    }

                } else {
                    chkOn = false;
                }
            }
            if (chkOn) {
                obj1.INS_USR = $("#Session_CUST_NAME").val();
                arry.push(obj1);
            }

            return obj1;
        }).get();

        var jsonArray = JSON.parse(JSON.stringify(arry));
        objJD.ETC = jsonArray;

        console.log(objJD)

        $.ajax({
            type: "POST",
            url: "/Reservation/ModifyReserve",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJD) },
            success: function (result) {
                if (result["rec_cd"] == "Y") {
                    _fnAlertMsg("예약 수정요청 되었습니다.");
                } else if (result["rec_cd"] == "N") {
                    _fnAlertMsg("담당자에게 문의 해주세요.");
                } else if (result["rec_cd"] == "E") {
                    _fnAlertMsg("담당자에게 문의 해주세요.");
                }
            }
        })
    } catch (err) {
        console.log("[Error - HomeEstimateCompare()]" + err.message);
    }
};
$(document).on('click', '#alert_close', function () {
    $("#my_subject").val("");
    $("#my_contents").val("");
    $(".starR").removeClass('on');
    $('#add_img_path1').val("");
    $('#add_img_path2').val("");
    $('#add_img_path3').val("");
    $('#add_img_path4').val("");
    $('#add_pic1').val("");
    $('#add_pic2').val("");
    $('#add_pic3').val("");
    $('#add_pic4').val("");
    $("#add_image1").attr("src", "");
    $("#add_image1").removeClass("upload_img");
    $("#add_image1").addClass("unload_img");
    $("#add_image2").attr("src", "");
    $("#add_image2").removeClass("upload_img");
    $("#add_image2").addClass("unload_img");
    $("#add_image3").attr("src", "");
    $("#add_image3").removeClass("upload_img");
    $("#add_image3").addClass("unload_img");
    $("#add_image4").attr("src", "");
    $("#add_image4").removeClass("upload_img");
    $("#add_image4").addClass("unload_img");
    $('.upload').addClass('no_img');
    $('.upload > label').addClass('on');
    $('#alert07').hide();
})
//