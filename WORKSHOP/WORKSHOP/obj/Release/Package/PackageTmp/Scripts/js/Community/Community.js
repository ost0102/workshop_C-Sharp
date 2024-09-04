
var rereply = "<div class='write_coc'><div class='input_coc_box'> <div class='coc_nm'><input type='text' placeholder='이름' class='input_coc_nm' name ='Reply_Re' maxlength='20'/></div><div class='coc_cont'><textarea class='input_coc_cont' id = 'Reply_Re_Contents' maxlength='200'></textarea></div><div class='coc_input'><button type='button'class='input_coc' id='Reply_Re_input'>입력</button></div></div ></div >";


$(document).on('click', '.comment.comment_rel', function (e) {

        if (!$(e.target).closest('.del_pw_box').length && !$(e.target).is('.write_del')) {
            $('.write_coc').remove();
            $(this).after(rereply);
            if (_fnToNull($("#Session_EMAIL").val()) != "") {
                $("input[name = 'Reply_Re']").val($("#Session_CUST_NAME").val());
                $("input[name = 'Reply_Re']").attr("disabled", true);
            }

        }
})

$(document).on('click', '#Comm_Del', function () {
    $("#ConFirm .inner").html("삭제 하시겠습니까?");
    $('#ConFirm').show();

})


$(document).on('click', '#QuotRevConfirm', function () {
    var objJsonData = new Object();
    objJsonData.MNGT_NO = _fnGetParam("MNGT_NO");

    $.ajax({
        type: "POST",
        url: "/Community/fnDeleteCommuList",
        async: false,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {
            if (result.Result[0]["trxCode"] == "Y") {
                window.location = "/CommunityList/Index";

            } else if (result.Result[0]["trxCode"] == "E") {

            }
        }, error: function (error) {
            console.log(error);
        }
    });
});


$(document).on('click', '#Reply_Re_input', function () {

    if (_fnToNull($("input[name='Reply_Re']").val()) == "") {
        _fnAlertMsg("이름을 입력해주세요.");
        return false;
    }
    
    if (_fnToNull($("#Reply_Re_Contents").val()) == "") {
        _fnAlertMsg("댓글을 입력해주세요.");
        return false;
    }

    var objJsonData = new Object();
    objJsonData.MNGT_NO = _fnSequenceMngt("RECOMMU");
    objJsonData.MST_NO = _fnGetParam("MNGT_NO");
    objJsonData.HEAD_ID = $(this).parent().parent().parent().siblings().find("input[name='Reply_mngt']").val();
    objJsonData.INS_USR = _fnToNull($("input[name='Reply_Re']").val());
    objJsonData.USR_ID = _fnToNull($("#Session_EMAIL").val());
    objJsonData.CONTENT = _fnToNull($("#Reply_Re_Contents").val());

    $.ajax({
        type: "POST",
        url: "/Community/fnInsertReplyList",
        async: false,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {
            if (result.Result[0]["trxCode"] == "Y") {
                fnMakeReply(result);
                $("#Reply_Re_Contents").val("");
                fnNotice_Bottom(result)
            } else if (JSON.parse(result).Result[0]["trxCode"] == "E") {


            }
        }, error: function (error) {
            console.log(error);
        }

    });


});


$(function () {

    if (_fnToNull($("#Session_EMAIL").val()) != "") {
        $("#Comm_USR").attr("disabled", true);
    }


    var vMngtNo = _fnGetParam("MNGT_NO");
    if (_fnToNull(vMngtNo) != "") {
        fnGetContentDtl(vMngtNo);
    }
    


})
// 목록 버튼
$(document).on('click', '.comment_list > button', function () {
    location.href = '/communitylist/index';
});


// 삭제 버튼
$(document).on('click', '.write_del', function (e) {
    var DelPwBox = $(this).closest(".comment_rel").find(".del_pw_box");
    $(".del_pw_box").not($(this).closest(".comment_rel").find(".del_pw_box")).hide();
    DelPwBox.show();
    $('input[name="Reply_Re_pwd"]').val("");
    $('input[name="Reply_pwd"]').val("");
});

// X 버튼
$(document).on('click', 'button[name="ClosePw"]', function () {
    var PwBox = $(this).parents('.del_pw_box');
    PwBox.hide();
    $('input[name="Reply_Re_pwd"]').val("");
    $('input[name="Reply_pwd"]').val("");
})

$(document).on('click', 'div[name="GoCon"]', function () {
    var mngt = _fnToNull($(this).find("input[name='GoCon_MNGT']").val());
    if (mngt != "") {
        window.location = "/Community/Index?MNGT_NO=" + mngt;

    }
})



function fnNotice_Bottom(vJsonData) {
    var vHtml = "";
    var aResult = vJsonData.NOTICE_NUM;
    $("#Notice_Prev_Next").empty();
    var SCREAT_YN = _fnToNull(vJsonData.CONTENT[0].SCREAT_YN);
    var USR_TYPE = _fnToNull(vJsonData.CONTENT[0].USR_TYPE);


    if (USR_TYPE != "M") {
        if (SCREAT_YN != "Y") {
            if (aResult.length > 1) {
                vHtml += "                        <div class='commu_list'> ";
                vHtml += "                            <div class='move_list up' name='GoCon'> ";
                vHtml += "                                <img src='/Images/move_top_list.png' />";
                vHtml += "                                <span>이전</span>";
                if (aResult[0].FLAG == "PREV") {
                    if (_fnToNull(aResult[0]["TOPIC"]) != "") {
                        vHtml += "                                <span>" + _fnToNull(aResult[0]["TOPIC"]) + "</span>";
                        vHtml += "                                <input type ='hidden' name='GoCon_MNGT' value = '" + _fnToNull(aResult[0]["MNGT_NO"]) + "'>";
                    }
                } else {
                    vHtml += "                                <span>이전글이 없습니다.</span>";
                }
                vHtml += "                            </div>";
                vHtml += "                            <div class='move_list down' name='GoCon'>";
                vHtml += "                                <img src='/Images/move_bottom_list.png' />";
                vHtml += "                                <span>다음</span>";
                if (_fnToNull(aResult[1]) != "") {
                    if (aResult[1].FLAG == "NEXT") {
                        if (_fnToNull(aResult[1]["TOPIC"]) != "") {
                            vHtml += "                                <span>" + _fnToNull(aResult[1]["TOPIC"]) + "</span>";
                            vHtml += "                                <input type ='hidden' name='GoCon_MNGT' value = '" + _fnToNull(aResult[1]["MNGT_NO"]) + "'>";
                        }
                    }
                } else {
                    vHtml += "                                <span>다음글이 없습니다.</span>";
                }
                vHtml += "                            </div>";
                vHtml += "                        </div>";

            } else if (aResult.length == 1) {
                vHtml += "                        <div class='commu_list'> ";
                vHtml += "                            <div class='move_list up' name='GoCon'> ";
                vHtml += "                                <img src='/Images/move_top_list.png' />";
                vHtml += "                                <span>이전</span>";
                if (aResult[0].FLAG == "NEXT") {
                    vHtml += "                                <span>이전글이 없습니다.</span>";
                } else {
                    vHtml += "                                <span>" + _fnToNull(aResult[0]["TOPIC"]) + "</span>";
                    vHtml += "                                <input type ='hidden' name='GoCon_MNGT' value = '" + _fnToNull(aResult[0]["MNGT_NO"]) + "'>";
                }
                vHtml += "                            </div>";
                vHtml += "                            <div class='move_list down' name='GoCon'>";
                vHtml += "                                <img src='/Images/move_bottom_list.png' />";
                vHtml += "                                <span>다음</span>";
                if (aResult[0].FLAG == "NEXT") {
                    vHtml += "                                <span>" + _fnToNull(aResult[0]["TOPIC"]) + "</span>";
                    vHtml += "                                <input type ='hidden' name='GoCon_MNGT' value = '" + _fnToNull(aResult[0]["MNGT_NO"]) + "'>";
                } else {
                    vHtml += "                                <span>다음글이 없습니다.</span>";
                }
                vHtml += "                            </div>";
                vHtml += "                        </div>";
            }
            else {
                vHtml += "                        <div class='commu_list'> ";
                vHtml += "                            <div class='move_list up'> ";
                vHtml += "                                <img src='/Images/move_top_list.png' />";
                vHtml += "                                <span>이전</span>";
                vHtml += "                                <span>이전글이 없습니다.</span>";
                vHtml += "                            </div>";
                vHtml += "                            <div class='move_list down'>";
                vHtml += "                                <img src='/Images/move_bottom_list.png' />";
                vHtml += "                                <span>다음</span>";
                vHtml += "                                <span>다음글이 없습니다.</span>";
                vHtml += "                            </div>";
                vHtml += "                        </div>";
            }

            $("#Notice_Prev_Next").append(vHtml);
        }
    }
}
function goView(pageIdx) {

    window.location = "/Community/Index?MNGT_NO=" + pageIdx;
}

function fnGetContentDtl(mngt_no) {
    var objJsonData = new Object();
    objJsonData.MST_NO = mngt_no;
    objJsonData.INS_USR = _fnToNull($("#Session_CUST_NAME").val());

    $.ajax({
        type: "POST",
        url: "/Community/fnGetContentDtl",
        async: false,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {
            if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                fnCommDetail(JSON.parse(result));
                fnMakeReply(JSON.parse(result));
                fnNotice_Bottom(JSON.parse(result));
            } else if (JSON.parse(result).Result[0]["trxCode"] == "E") {


            }
        }, error: function (error) {
            console.log(error);
        }

    });
}

function fnMakeReply(vJsonData) {

    var vHtml = "";
    var aResult = vJsonData.REPLY;

    var session_use = _fnToNull($("#Session_CUST_NAME").val());
    


    $("#Reply_Show").empty();




    if (aResult.length > 0) {
        $.each(aResult, function (i) {

            var cnt = aResult.length;
            if (_fnToNull(aResult[i]["HEAD_ID"]) == "0") {
                if (i == 0) {
                    vHtml += "<div class='commu-border'>";
                }
                else {
                    vHtml += "</div><div class='commu-border'>";
                }
                // ~> <div comment comment_rel> </div> // 댓글 그리기
                vHtml += "                                                                    <div class='comment comment_rel'>";
                vHtml += "                                                                    <input type ='hidden' name='Reply_mngt' value = '" + _fnToNull(aResult[i]["MNGT_NO"]) + "'>";
                vHtml += "                                                                    <div class='comment_left' title='댓글작성하기'>";
                vHtml += "                                                                        <div class='writer'>" + _fnToNull(aResult[i]["INS_USR"]) + "</div> ";
                vHtml += "                                                                        <div class='write_cont'>";
                vHtml += "                                                                            <div>"+ _fnToNull(aResult[i]["CONTENT"]) + "</div> ";
                vHtml += "                                                                        </div> ";
                vHtml += "                                                                    </div> ";
                vHtml += "                                                                    <div class='comment_rigth'> ";
                vHtml += "                                                                        <div class='write_etc'> ";
                vHtml += "                                                                            <span class='write_date'>" + _fnDateFormatAdmin(_fnToNull(aResult[i]["INS_DT"])) + "</span> ";
                if (_fnToNull(aResult[i]["LOCK_YN"]) != "Y") {
                    if (session_use != "") {
                        if (_fnToNull(aResult[i]["INS_PW"]) != ""){
                            vHtml += "                                                                            <button type='button' class='write_del'>삭제</button> ";
                        }
                    }
                }
                
                vHtml += "                                                                        </div> ";
                vHtml += "                                                                    </div> ";
                vHtml += "                                                                    <div class='del_pw_box'> ";
                vHtml += "                                                                        <div class='del_pw_area'> ";
                vHtml += "                                                                            <input type='password' placeholder='비밀번호' name='Reply_pwd' maxlength='20'/> ";
                vHtml += "                                                                            <button type='button' Name='DelComment'>확인</button> ";
                vHtml += "                                                                            <button type='button' Name='ClosePw'> ";
                vHtml += "                                                                                <img src='/Images/close_pw.png'/> ";
                vHtml += "                                                                            </button> ";
                vHtml += "                                                                        </div> ";
                vHtml += "                                                                    </div> ";
                vHtml += "                                                                    </div> ";
            }
            else {
                vHtml += "                                <div class='coc_box'>";
                vHtml += "                                    <div class='coc_area comment_rel'>";
                vHtml += "                                                                    <input type ='hidden' name='Reply_mngt' value = '" + _fnToNull(aResult[i]["MNGT_NO"]) + "'>";
                vHtml += "                                        <div class='coc_left'>";
                vHtml += "                                            <img src='/Images/coc.png' />";
                vHtml += "                                            <span class='writer'>" + _fnToNull(aResult[i]["INS_USR"]) + "</span>";
                vHtml += "                                            <span class='write_cont'>";
                vHtml += "                                                                            <div>" + _fnToNull(aResult[i]["CONTENT"]) + "</div> ";
                vHtml += "                                            </span>";
                vHtml += "                                        </div>";
                vHtml += "                                        <div class='coc_right'>";
                vHtml += "                                            <span class='write_date'>" + _fnDateFormatAdmin(_fnToNull(aResult[i]["INS_DT"])) + "</span>";
                if (session_use != "") {
                    if (_fnToNull(aResult[i]["INS_PW"]) != "") {
                        vHtml += "                                                                            <button type='button' class='write_del'>삭제</button> ";
                    }
                }
                vHtml += "                                        </div>";
                vHtml += "                                        <div class='del_pw_box'>";
                vHtml += "                                            <div class='del_pw_area'>";
                vHtml += "                                                <input type='password' placeholder='비밀번호' name='Reply_Re_pwd' maxlength='20'/>";
                vHtml += "                                                <button type='button' name='ReDelComment'>확인</button>";
                vHtml += "                                                <button type='button' name='ClosePw'>";
                vHtml += "                                                    <img src='/Images/close_pw.png' />";
                vHtml += "                                                </button>";
                vHtml += "                                            </div>";
                vHtml += "                                        </div>";
                vHtml += "                                    </div>";
                vHtml += "                                </div>";
            }

        });

        vHtml += "</div>";

        $("#Reply_Show").append(vHtml);
    }

}
function fnCommDetail(vJsonData) {
    var vHtml = "";
    var InsUsr = _fnToNull(vJsonData.CONTENT[0].INS_USR);
    var CommUsr = _fnToNull($("#Session_CUST_NAME").val());
    var InsDt = _fnDateFormatAdmin(_fnToNull(vJsonData.CONTENT[0].INS_DT));
    var ViewCnt = _fnToZero(vJsonData.CONTENT[0].VIEW_CNT);
    var Contents = _fnToNull(unescape(vJsonData.CONTENT[0].CONTENT));
    var Topic = _fnToNull(vJsonData.CONTENT[0].TOPIC);
    var Secret = _fnToNull(vJsonData.CONTENT[0].SCREAT_YN);
    var MstNo = _fnToNull(vJsonData.CONTENT[0].MNGT_NO);
    var INS_PW = _fnToNull(vJsonData.CONTENT[0].INS_PW);
    var USR_ID = _fnToNull(vJsonData.CONTENT[0].USR_ID);
    var RE_YN = _fnToNull(vJsonData.CONTENT[0].RE_YN);
    var Session_ID = _fnToNull($("#Session_EMAIL").val());
    var USR_TYPE = _fnToNull(vJsonData.CONTENT[0].USR_TYPE);

    $("#Reply_Show").empty();
    $("#Comm_Mst_no").val(MstNo);
    $("#Comm_Contents").empty();
    $("#Comm_Contents").append(Contents);
    $("#Comm_ID").text(InsUsr);
    $("#Comm_DT").text(InsDt);
    $("#Comm_CNT").html("<img src='/Images/icn_view.png'/>" + ViewCnt + "회");
    $("#Comm_USR").val(CommUsr);
    if (Secret == "N") {
        $("#Comm_title").html(Topic);
    } else {
        $("#Comm_title").html(Topic + " " + "<img src='/Images/icn_lock.png'/>");
    }




    if (INS_PW == "N") {// 비회원 일반
        $(".comment_modify").hide();
        $(".comment_del").hide();
    }
    else {//그 외
        if (USR_TYPE == "N") { // 비회원 비밀글
            $(".comment_modify").show();
            $(".comment_del").show();
        }
        else { //회원 (일반 비밀 모두 PW 존재)
            if (Session_ID == USR_ID) { // 본인
                $(".comment_modify").show();

                if (RE_YN == "N") {
                    // 댓글 플래그 N 일 때만 삭제만 
                    $(".comment_del").show();
                }
                else {
                    $(".comment_del").hide();
                }

            } else { // 다른사람
                $(".comment_modify").hide();
                $(".comment_del").hide();
            }
        }
        
    }

}



$(document).on('click', '#Reply_input', function () {

    if (_fnToNull($("#Comm_USR").val()) == "") {
        _fnAlertMsg("이름을 입력해주세요.");
        return false;
    }

    if (_fnToNull($("#Reply_Contents").val()) == "") {
        _fnAlertMsg("댓글을 입력해주세요.");
        return false;
    }

    var objJsonData = new Object();
    objJsonData.MNGT_NO = _fnSequenceMngt("RECOMMU");
    objJsonData.MST_NO = $(this).siblings("#Comm_Mst_no").val();
    objJsonData.INS_USR = _fnToNull($("#Comm_USR").val());
    objJsonData.CONTENT = _fnToNull($("#Reply_Contents").val());
    objJsonData.USR_ID = _fnToNull($("#Session_EMAIL").val());
    objJsonData.HEAD_ID = "0";

    $.ajax({
        type: "POST",
        url: "/Community/fnInsertReplyList",
        async: false,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {
            if (result.Result[0]["trxCode"] == "Y") {
                fnCommDetail(result);
                fnMakeReply(result);
                fnNotice_Bottom(result);
                $("#Reply_Contents").val("");
            } else if (JSON.parse(result).Result[0]["trxCode"] == "E") {


            }
        }, error: function (error) {
            console.log(error);
        }

    });

})

$(document).on('click', 'button[name="DelComment"]', function () {
    if (_fnToNull($(this).prev("input[name=Reply_pwd").val()) == "") {
        _fnAlertMsg("로그인 비밀번호을 입력해주세요.");
        return false;
    }
    var objJsonData = new Object();
    objJsonData.MNGT_NO = $(this).parent().parent().siblings("input[name = 'Reply_mngt']").val();
    objJsonData.INS_PW = _fnToNull($(this).siblings("input[name='Reply_pwd']").val());
    objJsonData.USR_ID = _fnToNull($("#Session_EMAIL").val());
    objJsonData.MST_NO = _fnGetParam("MNGT_NO");
    objJsonData.PAGE_TYPE = "FRONT";

    $.ajax({
        type: "POST",
        url: "/Community/fnDeleteReplyList",
        async: false,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {
            if (result.Result[0]["trxCode"] == "Y") {
                fnCommDetail(result);
                fnMakeReply(result);
                fnNotice_Bottom(result);
            } else if (result.Result[0]["trxCode"] == "N") {
                _fnAlertMsg("비밀번호가 틀립니다.");
            }
        }, error: function (error) {
            console.log(error);
        }

    });

})

$(document).on('click', 'button[name="ReDelComment"]', function () {
    if (_fnToNull($(this).prev("input[name=Reply_Re_pwd").val()) == "") {
        _fnAlertMsg("로그인 비밀번호을 입력해주세요.");
        return false;
    }
    var objJsonData = new Object();
    objJsonData.MNGT_NO = $(this).parent().parent().siblings("input[name = 'Reply_mngt']").val();
    objJsonData.INS_PW = _fnToNull($(this).siblings("input[name='Reply_Re_pwd']").val());
    objJsonData.USR_ID = _fnToNull($("#Session_EMAIL").val());
    objJsonData.MST_NO = _fnGetParam("MNGT_NO");
    objJsonData.PAGE_TYPE = "FRONT";

    $.ajax({
        type: "POST",
        url: "/Community/fnDeleteReplyList",
        async: false,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {
            if (result.Result[0]["trxCode"] == "Y") {
                fnMakeReply(result);
                fnNotice_Bottom(result);
            } else if (result.Result[0]["trxCode"] == "N") {
                _fnAlertMsg("비밀번호가 틀립니다.");
            }
        }, error: function (error) {
            console.log(error);
        }

    });

})


$(document).on('click', '#Comm_Modify', function () {
    window.location = "/CommunityRegist/Index?MNGT_NO=" + _fnGetParam("MNGT_NO");

})


////수정 버튼 누르면 input text 수정
//$(document).on('click', '.write_modify', function () {
//    var inputElement = $(this).closest(".comment").find("input");
//    inputElement.prop('disabled', false);
//    inputElement.focus();
//    var inputLength = inputElement.val().length;
//    inputElement[0].setSelectionRange(inputLength, inputLength);
//});
//$(document).on('click', '.write_modify_coc', function () {
//    var inputElement = $(this).closest(".coc_area").find("input[type='text']");
//    inputElement.prop('disabled', false);
//    inputElement.focus();
//    var inputLength = inputElement.val().length;
//    inputElement[0].setSelectionRange(inputLength, inputLength);
//})