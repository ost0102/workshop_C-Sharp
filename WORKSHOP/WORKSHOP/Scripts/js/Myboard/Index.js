$(document).ready(function () {
    $('.simple-estimate').hide();
    $('.company_info').hide();

});
$(document).on('click', '.starRev span', function () {
    $(this).parent().children('span').removeClass('on');
    $(this).addClass('on').prevAll('span').addClass('on');
    return false;
});
$(function () {
    if (_fnToNull($("#Session_EMAIL").val()) == "") {
        location.href = window.location.origin;
    }
    else {
        fnGetComment(); //후기작성버튼 클릭시 정보가져오기
        MyGetUserInfo(); //상단정보
        fnGetQuotationList(); // 진행정보
        fnGetCommenttopList(); //후기 상단
        fnGetCommentList(); //후기 하단리스트
        MyGetUserMileage(); //마일리지
    }
})


$(document).on('click', '#mileage_btn', function () {
    $('#alert08').show();
    $('html').css('overflow', 'hidden');
    //MyGetUserMileagePopup();
    goPage(1);
})
$(document).on('click', '.info_modify_btn', function () {
    location.href = '/Modify/index';
})

$(document).on('change', '#add_pic1', function () {
    ContUpload(this , "add_img_path1");
});
$(document).on('change', '#add_pic2', function () {
    ContUpload(this , "add_img_path2");
})
$(document).on('change', '#add_pic3', function () {
    ContUpload(this , "add_img_path3");
})
$(document).on('change', '#add_pic4', function () {
    ContUpload(this , "add_img_path4");
})
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
    $('#alert08').hide();
    //$("#From_mg_Date").val(_fnPlusDate(-15));
    //$("#To_mg_Date").val(_fnPlusDate(15));
    $("#From_mg_Date").val("");
    $("#To_mg_Date").val("");
})
$(document).on('click', '#report_review', function () {
    $('#alert07').show();
    $('html').css('overflow', 'hidden');
})
$(document).on('click', '#my_complete', function () {
    try {
        var objJsonData = new Object();
        if (_fnToNull($("#my_subject").val()) == "") {
            _fnLayerAlertMsg("제목은 필수입력 입니다.");
            return false;
        }

        if (_fnToNull($("#my_contents").val()) == "") {
            _fnLayerAlertMsg("내용은 필수입력 입니다.");
            return false;
        }
        objJsonData.MNGT_NO = _fnSequenceMngt("NO");
        objJsonData.BKG_NO = $("#my_bkg_no").val();
        objJsonData.CMT_SUBJECT = $("#my_subject").val(); //제목
        objJsonData.CMT_SCORE = $(".starR.on").length; //별점
        objJsonData.CMT_CONTENTS = $("#my_contents").val(); //내용
        objJsonData.CMT_IMG1_PATH = $("#add_img_path1").val(); //이미지경로 히든값
        objJsonData.CMT_IMG2_PATH = $("#add_img_path2").val();
        objJsonData.CMT_IMG3_PATH = $("#add_img_path3").val();
        objJsonData.CMT_IMG4_PATH = $("#add_img_path4").val();
        objJsonData.EMAIL = $("#Session_EMAIL").val();
        objJsonData.CUST_NAME = $("#Session_CUST_NAME").val();
        objJsonData.ITEM_NO = $("#my_item_no").val(); //아이템넘버 히든값
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
                        location.reload();
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
//후기작성 클릭시정보 가져오기
function fnGetComment() {
    try {

        var objJsonData = new Object();
        objJsonData.EMAIL = $("#Session_EMAIL").val(); //???값이 안담김

        $.ajax({
            type: "POST",
            url: "/Myboard/GetCommentInfo",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (result.Result[0]["trxCode"] == "Y") {
                    fnSetComment(result);
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
//후기작성 클릭시 팝업 정보넣어주기
function fnSetComment(result) {
    try {
        vResult = result.TABLE;

        $(".sub_info_area").empty();

        var vSplit = _fnToNull(vResult[0]["TAG"]).split("#");
        var vHtml = "";

        $("#my_subject").val(_fnToNull(vResult[0].ITEM_NM));
        $("#my_hotel").text(_fnToNull(vResult[0].ITEM_NM));
        $("#my_date").text(_fnPlusDate(0));
        $("#my_item_no").val(_fnToNull(vResult[0].ITEM_CD));
        $("#my_bkg_no").val(_fnToNull(vResult[0].BKG_NO));
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
        $("#milage_total_amt").val(_fnToNull(vResult[0].TOT_AMT));
    } catch (err) {
        console.log("[Error - fnSetComment()]" + err.message);
    }
}

function fnGetCommenttopList() {
    try {
        var objJsonData = new Object();
        objJsonData.EMAIL = $("#Session_EMAIL").val();

        $.ajax({
            type: "POST",
            url: "/Myboard/GetCommenttopList",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (result.Result[0]["trxCode"] == "Y") {
                    fnSetCommenttopList(result);
                } else if (result.Result[0]["trxCode"] == "N") {
                    //$("#review_no_box").hide(); visibility hidden으로 변경
                    //_fnAlertMsg("담당자에게 문의 해주세요.");
                    console.log("[Error - fnGetCommenttopList()]" + result.Result[0]["trxCode"]);
                }
            }
        })
    } catch (err) {
        _fnAlertMsg("GetCommenttopList에러");
        console.log("[Error - fnGetCommenttopList()]" + err.message);
    }
}

function fnSetCommenttopList(result) {
    try {
        vResult = result.TABLE;

        if (vResult.length > 0) {
            $("#comment_top_list").text(_fnDateFormat(_fnToNull(vResult[0].CONFIRM_DATE)) + " " + _fnToNull(vResult[0].ITEM_NM));
        } else {
            $("#comment_top_list").text("최근 이용내역이 없습니다.");
            $("#report_review").hide();
        }
        /*$("#comment_top_list").text(_fnDateFormat(_fnToNull(vResult[0].CONFIRM_DATE)) + " " + _fnToNull(vResult[0].ITEM_NM));*/
    } catch (err) {
        console.log("[Error - fnSetCommenttopList()]" + err.message);
    }
}

function fnGetQuotationList() {
    try {
        var objJsonData = new Object();
        objJsonData.EMAIL = $("#Session_EMAIL").val();

        $.ajax({
            type: "POST",
            url: "/Myboard/GetQuotationList",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (result.Result[0]["trxCode"] == "Y") {
                    fnSetQuotationList(result);
                } else if (result.Result[0]["trxCode"] == "N") {
                    //_fnAlertMsg("담당자에게 문의 해주세요.");
                }
            }
        })
    } catch (err) {
        _fnAlertMsg("GetCommentList에러");
        console.log("[Error - fnGetCommentList()]" + err.message);
    }
}
//후기 하단리스트정보 가져오기
function fnGetCommentList() {
    try {
        var objJsonData = new Object();
        objJsonData.EMAIL = $("#Session_EMAIL").val();

        $.ajax({
            type: "POST",
            url: "/Myboard/GetCommentList",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (result.Result[0]["trxCode"] == "Y") {
                    fnSetCommentList(result);
                } else if (result.Result[0]["trxCode"] == "N") {
                    //_fnAlertMsg("담당자에게 문의 해주세요.");
                }
            }
        })
    } catch (err) {
        _fnAlertMsg("GetCommentList에러");
        console.log("[Error - fnGetCommentList()]" + err.message);
    }
}
//후기 하단리스트정보
function fnSetCommentList(result) {
    try {
        vResult = result.TABLE;

        var vHtml = "";
        if (vResult.length > 0) {
            vHtml += "  <table class=\"review_table\">";
            vHtml += "      <tbody>";
            $.each(vResult, function (i) {
                var vStar = _fnToNull(vResult[i]["CMT_SCORE"]);

                vHtml += "          <tr> ";
                vHtml += "              <td>" + _fnDateFormatingDash(_fnToNull(vResult[i]["INS_DT"])) + "</td>";
                vHtml += "              <td>" + "[" + _fnToNull(vResult[i]["ITEM_NM"]) + "]" + "</td>";
                vHtml += "              <td>";
                if (vStar != "") {
                    for (s = 0; s < vStar; s++) {
                        vHtml += "<img src=\"/Images/rating.png\">";
                    }
                }
                vHtml += "              </td>";
                vHtml += "          </tr > ";
            })
            vHtml += "      </tbody>";
            vHtml += "  </table>";

            $("#review_listtb").append(vHtml);
        } else {
            vHtml += "<img src=\"/Images/happy.png\" />";
            vHtml += "<p>연수다 이용 후</p>";
            vHtml += "<p>후기를 남겨주세요.</p>";

            $("#myboard_no_review").append(vHtml);
        }
        //vHtml += "<div class=\"review_tb\" id=\"review_listtb\">";
        //vHtml += "  <table class=\"review_table\">";
        //vHtml += "      <tbody>";
        //$.each(vResult, function (i) {
        //    var vStar = _fnToNull(vResult[i]["CMT_SCORE"]);

        //    vHtml += "          <tr> ";
        //    vHtml += "              <td>" + _fnDateFormatingDash(_fnToNull(vResult[i]["INS_DT"])) + "</td>";
        //    vHtml += "              <td>" + "[" + _fnToNull(vResult[i]["ITEM_NM"]) + "]" + "</td>";
        //    vHtml += "              <td>";
        //    if (vStar != "") {
        //        for (s = 0; s < vStar; s++) {
        //            vHtml += "<img src=\"/Images/rating.png\">";
        //        }
        //    }
        //    vHtml += "              </td>";
        //    vHtml += "          </tr > ";
        //})
        //vHtml += "      </tbody>";
        //vHtml += "  </table>";
        //vHtml += "</div>";

        //$("#review_listtb").append(vHtml);
    } catch (err) {
        _fnAlertMsg("GetCommenttopList에러");
        console.log("[Error - fnGetCommenttopList()]" + err.message);
    }
}


function fnSetQuotationList(result) {
    try {
        vResult = result.TABLE;
        
        var vHtml = "";
        if (vResult.length > 0) {
            $.each(vResult, function (i) {
                if (vResult[i].TYPE == "Q") {
                    $("#quot_cnt").text(_fnToZero(vResult[i].TOTCNT));
                } else if (vResult[i].TYPE == "B") {
                    $("#bkg_cnt").text(_fnToZero(vResult[i].TOTCNT));
                }
                vHtml += "	<tr>	";
                vHtml += "        <td>" + _fnToNull(_fnDateFormatAdmin(vResult[i].INS_DT)) + "</td>";
                if (_fnToNull(vResult[i].ITEM_NM) != "") {
                    vHtml += "        <td>" + _fnToNull(vResult[i].ITEM_NM) + "</td>";
                } else {
                    vHtml += "        <td>견적 진행중입니다.</td>";
                }
                if (_fnToNull(vResult[i].STATUS) == "Y") {
                    vHtml += "        <td>완료</td>";
                } else {
                    vHtml += "        <td>진행</td>";
                }
                vHtml += "    </tr>";

            })
            $("#my_quot").append(vHtml);
        }
        else {
            $("#myboard_no_left").empty();
            $("#myboard_no_right").empty();
            $("#myboard_no_info").empty();

            vHtml += "<div class=\"progress_estimate\">";
            vHtml += " 견적 |";
            vHtml += "<span id=\"quot_cnt\">0</span> ";
            vHtml += "<span>건</span>";
            vHtml += "</div>";
            $("#myboard_no_left").append(vHtml);
            vHtml = "";

            vHtml += "<div class=\"progress_reservation\">";
            vHtml += " 예약 |";
            vHtml += "<span id=\"bkg_cnt\">0</span> ";
            vHtml += "<span>건</span>";
            vHtml += "</div>";
            $("#myboard_no_right").append(vHtml);
            vHtml = "";

            vHtml += "<img src=\"/Images/smile.png\"/>";
            vHtml += "<p>진행 중인</p>";
            vHtml += "<p>견적, 예약건이 없습니다.</p>";
            $("#myboard_no_info").append(vHtml);
        }
        //$("#my_quot").append(vHtml);
    } catch (err) {
        console.log("[Error - fnGetCommenttopList()]" + err.message);
    }
}
//상단정보 가져오기
function MyGetUserInfo() {
    try {

        var objJsonData = new Object();
        objJsonData.EMAIL = $("#Session_EMAIL").val();

        $.ajax({
            type: "POST",
            url: "/Modify/GetModifyInfo",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (result.Result[0]["trxCode"] == "Y") {
                    MySetUserInfo(result);
                }
            }, error: function (error) {
                /*_fnAlertMsg("담당자에게 문의 해주세요.");*/
                console.log(error);
            }
        });
    }
    catch (err) {
        console.log("[Error - MyGetUserInfo()]" + err.message);
    }
}

function MySetUserInfo(result) {
    try {
        vResult = result.UserInfo;

        var vHtml = "";

        vHtml += "<div class=\"user_txt\" id=\"myboard_userinfo\">";
        vHtml += "  <p>" + _fnToNull(vResult[0].CUST_NAME) + "님 </p>";
        vHtml += "  <p>" + _fnToNull(vResult[0].EMAIL) + "</p>";

        $("#myboard_userinfo").append(vHtml);
    }catch (err) {
        console.log("[Error - MySetUserInfo()]" + err.message);
    }
}

//마일리지
function MyGetUserMileage() {
    try {
        var objJsonData = new Object();
        objJsonData.EMAIL = $("#Session_EMAIL").val();
        objJsonData.GRP_CD = $("#Session_GRP_CD").val();

        $.ajax({
            type: "POST",
            url: "/Myboard/MyGetUserMileage",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (result.Result[0]["trxCode"] == "Y") {
                    MySetUserMileage(result);
                }
            }, error: function (error) {
                console.log("[Error - MyGetUserMileage()]" + error.message);
            }
        });
    } catch (err) {
        console.log("[Error - MyGetUserMileage()]" + err.message);
    }
}
//마일리지 그려주기
function MySetUserMileage(result) {
    try {
        vResult = result.MILEAGE;

        var vHtml = "";
        $("#point_top_mileage").empty();
        $("#point_table_list").empty();
        $("#inner_title_mileage").empty();

        var MTot = 0;
        $.each(vResult, function (i) {
            MTot += parseInt(vResult[i]["MILEAGE"])
        })

        if (vResult.length > 0) {
            vHtml += "  <p>" + fnSetComma(_fnToZero(MTot)) + " M</p>";
            vHtml += "  <p>※ 100,000원 단위로 사용가능합니다.</p>";
        } else {
            vHtml += "  <p>" + 0 + " M</p>";
            vHtml += "  <p>※ 100,000원 단위로 사용가능합니다.</p>";
        }
        $("#point_top_mileage").append(vHtml);
        vHtml = "";

        if (vResult.length > 0) {
                vHtml += "<table class=\"point_table\">";
                vHtml += "   <tbody>";
                   $.each(vResult, function (i) {
                           vHtml += "     <tr>";
                       vHtml += "       <td>" + _fnDateFormatingDash(_fnToNull(vResult[i].USED_DATE)) + "</td>";
                       if (vResult[i].USE_YN == "Y") {
                           vHtml += "       <td>-" + fnSetComma(vResult[i].USED_MILEAGE) + "</td>";
                       } else {
                           vHtml += "       <td>+" + fnSetComma(vResult[i].USED_MILEAGE) + "</td>";
                       }
                           vHtml += "     </tr>";
                   })
                vHtml += "   </tbody>";
                vHtml += "</table>";
        } else {
            vHtml += " <div class=\"no_info\">";
            vHtml += "  <img src=\"/Images/scream.png\">";
            vHtml += "  <p>마일리지가</p>";
            vHtml += "  <p>없습니다.</p>";
            vHtml += " </div>";
        }
        $("#point_table_list").append(vHtml);
        vHtml = "";

        $("#inner_title_mileage").empty();

        if (vResult.length > 0) {
            vHtml += " <p class=\"cont_title orange\">현재 총 마일리지 : " + fnSetComma(_fnToZero(MTot)) + " M</p>";
            vHtml += " <p class=\"cont_sub\">※ 100,000원 단위로 사용가능합니다.</p>";
        } else {
            vHtml += " <p class=\"cont_title orange\">현재 총 마일리지 : 0 M</p>";
            vHtml += " <p class=\"cont_sub\">※ 100,000원 단위로 사용가능합니다.</p>";
        }
        $("#inner_title_mileage").append(vHtml);
        vHtml = "";
    } catch (err) {
        console.log("[Error - MySetUserMileage()]" + err.message);
    }
}

////마일리지 전체보기 클릭
//function MyGetUserMileagePopup() {
//    try {
//        var objJsonData = new Object();
//        objJsonData.EMAIL = $("#Session_EMAIL").val();

//        $.ajax({
//            type: "POST",
//            url: "/Myboard/GetUserMileagePopup",
//            async: false,
//            dataType: "json",
//            data: { "vJsonData": _fnMakeJson(objJsonData) },
//            success: function (result) {
//                if (result.Result[0]["trxCode"] == "Y") {
//                    //MySetUserMileagePopup(result);
//                }
//            }, error: function (error) {
//                console.log("[Error - MyGetUserMileagePopup()]" + error.message);
//            }
//        });
//    } catch (err) {
//        console.log("[Error - MyGetUserMileagePopup()]" + err.message);
//    }
//}

//마일리지전체보기 팝업 그려주기
//function MySetUserMileagePopup(result) {
//    try {
//        vResult = result.MILEAGEPOP;

//        var vHtml = "";

//        $("#mileage_body_popup").empty();

//        if (vResult.length > 0) {
//            $.each(vResult, function (i) {
//                vHtml += " <tr class=\"mileage_tr\">";
//                vHtml += "    <td>" + _fnDateFormatingDash(_fnToNull(vResult[i].USED_DATE)) + "</td>";
//                vHtml += "    <td>" + _fnToNull(vResult[i].CMT_SUBJECT) + "</td>";
//                vHtml += "    <td>" + _fnToNull(vResult[i].INS_USR) + "</td>";
//                if (vResult[i].USE_YN == "Y") {
//                    vHtml += "    <td>사용</td>";
//                    vHtml += "    <td>-" + fnSetComma(_fnToNull(vResult[i].USED_MILEAGE)) + "</td>";
//                } else {
//                    vHtml += "    <td>적립</td>";
//                    vHtml += "    <td>+" + fnSetComma(_fnToNull(vResult[i].USED_MILEAGE)) + "</td>";
//                }
//            })
//        } 
//        $("#mileage_body_popup").append(vHtml);
//        vHtml = "";

//        //goPage(1)

//    } catch (err) {
//        console.log("[Error - MySetUserMileagePopup()]" + err.message);
//    }
//}
//마일리지 페이징
function goPage(pageindex) {
        fnSearchMg(pageindex)
}

function fnSearchMg(pageIndex) {

    try {
        var objJsonData = new Object();
        //$("#From_mg_Date").val(_fnPlusDate(-15));
        //$("#To_mg_Date").val(_fnPlusDate(15));

        objJsonData.PAGE = pageIndex;
        objJsonData.EMAIL = $("#Session_EMAIL").val();
        objJsonData.USED_DATE = _fnToNull($("#From_mg_Date").val().replace(/-/gi, ""));
        objJsonData.USED_DATE1 = _fnToNull($("#To_mg_Date").val().replace(/-/gi, ""));
        objJsonData.GRP_CD = $("#Session_GRP_CD").val();

        $.ajax({
            type: "POST",
            url: "/Myboard/fnSearchMg",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    makeMgList(result, pageIndex);
                } else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    console.log("[Fail - fnSearchMg()]" + result.Result[0]["trxCode"]);
                    _fnAlertMsg("검색값이 없습니다.");
                } else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    console.log("[Fail - fnSearchMg()]" + result.Result[0]["trxCode"]);
                }
            }, error: function (error) {
                console.log(error);
            }
        });
    }
    catch (err) {
        console.log("[Error - fnSearchMg]" + err.message);
    }
}

function makeMgList(result, pageIndex) {
    $("#mileage_body_popup").empty();
    var MgJson = JSON.parse(result).Table1;
    var vHtml = "";
    var totPageCnt = "";

    if (MgJson.length > 0) {
        $.each(MgJson, function (i) {
            totPageCnt = MgJson[i].TOTCNT;
            vHtml += " <tr class=\"mileage_tr\">";
            vHtml += "    <td>" + _fnDateFormatingDash(_fnToNull(MgJson[i].USED_DATE)) + "</td>";
            vHtml += "    <td>" + _fnToNull(MgJson[i].ITEM_NM) + "</td>";
            vHtml += "    <td>" + _fnToNull(MgJson[i].INS_USR) + "</td>";
            if (vResult[i].USE_YN == "Y") {
                vHtml += "    <td>사용</td>";
                vHtml += "    <td>-" + fnSetComma(_fnToNull(vResult[i].USED_MILEAGE)) + "</td>";
            } else {
                vHtml += "    <td>적립</td>";
                vHtml += "    <td>+" + fnSetComma(_fnToNull(vResult[i].USED_MILEAGE)) + "</td>";
            }
        });
       
        fnPaging(totPageCnt, 10, 5, pageIndex);
    } else {
        fnPaging(1, 10, 5, pageIndex);
    }
    $("#mileage_body_popup").append(vHtml);
}

function fnPaging(totalData, dataPerPage, pageCount, currentPage) {
    $("#paging_mg").empty();

    var totalPage = Math.ceil(totalData / dataPerPage);    // 총 페이지 수
    var pageGroup = Math.ceil(currentPage / pageCount);    // 페이지 그룹
    if (pageCount > totalPage) pageCount = totalPage;
    var last = pageGroup * pageCount;    // 화면에 보여질 마지막 페이지 번호
    if (last > totalPage) last = totalPage;
    var first = last - (pageCount - 1);    // 화면에 보여질 첫번째 페이지 번호
    var next = last + 1;
    var prev = first - 1;

    var prevPage;
    var nextPage;
    if (currentPage - 1 < 1) { prevPage = 1; } else { prevPage = currentPage - 1; }
    if (last < totalPage) { nextPage = currentPage + 1; } else { nextPage = last; }

    var html = "";
    html += "<ul>";
    html += "	<li><a href='#' onclick='goPage(1)' class='prev-first'><span>맨앞으로</span></a></li>";
    html += "	<li><a href='#' onclick='goPage(" + prevPage + ")' class='prev'><span>이전으로</span></a></li>";
    //html += "	<span class='number'> ";

    for (var i = first; i <= last; i++) {

        if (i == currentPage) {
            //html += "		<span class='on'>" + i + "</span> ";
            html += "	<li><a href='javascript:void(0)' class='active'>" + i + "</a></li>";
        } else {
            //html += "		<a href='#' onclick='goPage(" + i + ")'>" + i + "</a> ";
            html += "	<li><a href='#' onclick='goPage(" + i + ")' class='prevt'>" + i + "</a></li>";
        }
    }

    //html += "	</span> ";
    html += "	<li><a href='#' onclick='goPage(" + nextPage + ")' class='next'><span>다음으로</span></a></li>";
    html += "	<li><a href='#' onclick='goPage(" + totalPage + ")' class='next-last'><span>맨뒤로</span></a></li>";
    //html += "	<a href='#' onclick='goPage(" + nextPage + ")' class='page next'><span class='blind'>다음페이지로 가기</span></a> ";
    //html += "	<a href='#' onclick='goPage(" + totalPage + ")' class='page last'><span class='blind'>마지막페이지로 가기</span></a> ";
    html += "</ul>";

    $("#paging_mg").append(html);
}

//마일리지 팝업 검색
$(document).on('click', '#reservation_search', function () {
    goPage(1);
    //SearchMileage();
})
//function SearchMileage() {
//    try {
//        var objJsonData = new Object();

//        objJsonData.EMAIL = $("#Session_EMAIL").val();
//        objJsonData.USED_DATE = _fnToNull($("#From_mg_Date").val().replace(/-/gi, ""));
//        objJsonData.USED_DATE1 = _fnToNull($("#To_mg_Date").val().replace(/-/gi, ""));

//        $.ajax({
//            type: "POST",
//            url: "/Myboard/SearchMileage",
//            async: false,
//            dataType: "json",
//            data: { "vJsonData": _fnMakeJson(objJsonData) },
//            success: function (result) {
//                if (result.Result[0]["trxCode"] == "Y") {
//                    SearchSetMileage(result);
//                }
//            }, error: function (error) {
//                console.log("[Error - SearchMileage()]" + error.message);
//            }
//        });
//    } catch (err) {
//        console.log("[Error - SearchMileage()]" + err.message);
//    }
//}

//function SearchSetMileage(result) {
//    try {
//        vResult = result.TABLE;

//        var vHtml = "";

//        $("#mileage_body_popup").empty();

//        if (vResult.length > 0) {
//            $.each(vResult, function (i) {
//                vHtml += " <tr class=\"mileage_tr\">";
//                vHtml += "    <td>" + _fnDateFormatingDash(_fnToNull(vResult[i].USED_DATE)) + "</td>";
//                vHtml += "    <td>" + _fnToNull(vResult[i].CMT_SUBJECT) + "</td>";
//                vHtml += "    <td>" + _fnToNull(vResult[i].INS_USR) + "</td>";
//                if (vResult[i].USE_YN == "Y") {
//                    vHtml += "    <td>사용</td>";
//                    vHtml += "    <td>-" + fnSetComma(_fnToNull(vResult[i].USED_MILEAGE)) + "</td>";
//                } else {
//                    vHtml += "    <td>적립</td>";
//                    vHtml += "    <td>+" + fnSetComma(_fnToNull(vResult[i].USED_MILEAGE)) + "</td>";
//                }
//            })
//        }
//        $("#mileage_body_popup").append(vHtml);
//        vHtml = "";

//    } catch (err) {
//        console.log("[Error - SearchSetMileage()]" + err.message);
//    }
//}

