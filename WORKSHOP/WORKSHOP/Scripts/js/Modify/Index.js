//#region 전역변수 체크,데이터값

var _chkpwd = true;
var objLogin_info = new Object();

//#endregion

$(function () {
    if (_fnToNull($("#Session_EMAIL").val()) == "") {
        location.href = window.location.origin;
    }
    else {
        fnGetUserInfo();
    }
});

//#region input박스 포커스아웃 오류메시지
$(document).on("focusout", "input", function (e) {
    var $this = $(e.target);
    var vValue = "";

    if ($this.attr('id') == "modif_PWD") {
        vValue = $("#modif_PWD").val();

        if (vValue != "") {
            fnChkNowPSWD();
        }
    }
    else if ($this.attr('id') == "modif_NAME") {
        vValue = $("#modif_NAME").val();

        if (vValue == "") {
            fnShowWarning("modif_NAME", "NAME_Empty", "#f44336");
        }
    }
    else if ($this.attr('id') == "modif_TELNO") {
        vValue = $("#modif_TELNO").val();

        if (vValue == "") {
            fnShowWarning("modif_TELNO", "TEL_Empty", "#f44336");
        }
    }
})
//#endregion

//input 실시간 - Validation
$(document).on("keyup", "input", function (e) {
    var $this = $(e.target);
    var vValue = "";
    var vCompare = "";

    if ($this.attr('id') == "modif_PWD") {

        vValue = $("#modif_PWD").val();

        //데이터 없을 때 **********************************수정
        if (vValue == "") {
            fnShowWarning("modif_PWD", "NOWPWD_Empty", "#f44336");
            fnOnOffWarning("NOWPWD_Wrong", "false");
        } else {
            $("#modif_PWD").css("border-color", "");
            fnOnOffWarning("NOWPWD_Empty", "false");
            fnOnOffWarning("NOWPWD_Wrong", "false");
        }
        if (e.keyCode == 13) {
            $("#modif_NEWPWD1").focus();
        }
    }
    else if ($this.attr('id') == "modif_NEWPWD1") {

        vValue = $("#modif_NEWPWD1").val();
        vCompare = $("#modif_NEWPWD2").val();

        //값이 없을 경우
        if (_fnToNull($("#modif_NEWPWD1").val()) == "") {
            $("#modif_NEWPWD1").css("border-color", "");
            fnOnOffWarning("PW1_OverSix", "false"); //*****************************수정
            fnOnOffWarning("PW1_Regular", "false");
            return false;
        }

        var vBoolean_LessSix = "false";
        var vBoolean_Regular = "false";
        var vBoolean_Different = "false";

        if (vValue.length <= 7) {
            vBoolean_LessSix = "false";
            fnOnOffWarning("PW1_OverSix", "true");
        } else {
            vBoolean_LessSix = "true";
            fnOnOffWarning("PW1_OverSix", "false");
        }

        //대문자 소문자 체크
        var vCheck = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{6,17}$/;
        if (!vCheck.test(vValue)) {
            vBoolean_Regular = "false";
            fnOnOffWarning("PW1_Regular", "true");
        } else {
            vBoolean_Regular = "true";
            fnOnOffWarning("PW1_Regular", "false");
        }
        //비교문 체크
        vBoolean_Different = fnPwCompare(vValue, vCompare);

        //마지막 체크
        if (vBoolean_LessSix == "false" || vBoolean_Regular == "false" || vBoolean_Different == "false") {
            fnWarningBorder("modif_NEWPWD1", "#f44336");
            if (vBoolean_Different == "false" && $("#modif_NEWPWD2").val() != "") {
                fnWarningBorder("modif_NEWPWD2", "#f44336");
            }
        } else {
            fnWarningBorder("modif_NEWPWD1", "#4caf50");
            //만약 비밀번호 확인이 오류면 변경 해주는 로직. (확인이 필요함)
            if ($("#modif_NEWPWD2").css("border-top-color") == "rgb(244, 67, 54)") {
                if ($("#PW2_Empty").css("display") != "inline-block" && $("#PW2_Compare").css("display") != "inline-block") {
                    $("#modif_NEWPWD2").css("border-color", "#4caf50");
                }
            }
        }
        if (e.keyCode == 13) {
            $("#modif_NEWPWD2").focus();
        }
    } //RES_PWD end
    //RES_PWD2 start 
    else if ($this.attr('id') == "modif_NEWPWD2") {

        vValue = $("#modif_NEWPWD2").val();
        vCompare = $("#modif_NEWPWD1").val();

        //값이 없을 경우
        if (_fnToNull($("#modif_NEWPWD2").val()) == "") {
            $("#modif_NEWPWD2").css("border-color", "");
            fnOnOffWarning("PW2_OverSix", "false");
            fnOnOffWarning("PW2_Regular", "false");
            fnOnOffWarning("PW2_Compare", "false");
            return false;
        }

        var vBoolean_LessSix = "false";
        var vBoolean_Regular = "false";
        var vBoolean_Different = "false";

        fnOnOffWarning("PW2_Empty", "false");

        if (vValue.length <= 7) {
            vBoolean_LessSix = "false";
            fnOnOffWarning("PW2_OverSix", "true");
        } else {
            vBoolean_LessSix = "true";
            fnOnOffWarning("PW2_OverSix", "false");
        }

        //대문자 소문자 체크
        var vCheck = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{6,17}$/;
        if (!vCheck.test(vValue)) {
            vBoolean_Regular = "false";
            fnOnOffWarning("PW2_Regular", "true");
        } else {
            vBoolean_Regular = "true";
            fnOnOffWarning("PW2_Regular", "false");
        }
        //비교문 체크
        vBoolean_Different = fnPwCompare(vValue, vCompare);

        //마지막 체크
        if (vBoolean_LessSix == "false" || vBoolean_Regular == "false" || vBoolean_Different == "false") {
            fnWarningBorder("modif_NEWPWD2", "#f44336");
            if (vBoolean_Different == "false" && $("#RES_PWD").val() != "") {
                fnWarningBorder("modif_NEWPWD1", "#f44336");
            }
        } else {
            fnWarningBorder("modif_NEWPWD2", "#4caf50");
            //만약 비밀번호 확인이 오류면 변경 해주는 로직. (확인이 필요함)
            if ($("#modif_NEWPWD1").css("border-top-color") == "rgb(244, 67, 54)") {
                if ($("#PW1_Empty").css("display") != "inline-block") {
                    $("#modif_NEWPWD1").css("border-color", "#4caf50");
                }
            }
        }
        if (e.keyCode == 13) {
            $("#modif_NAME").focus();
        }
    } //RES_PWD2 end ********************
    else if ($this.attr('id') == "modif_NAME") {
        $("#modif_NAME").val($("#modif_NAME").val().replace(" ", ""))
        vValue = $("#modif_NAME").val().replace(" ", "").trim();
        var check = /[ㄱ-ㅎ|ㅏ-ㅣ]/; //한글 자음 체크
        var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
        if (regExp.test(vValue)) {
            $("#modif_NAME").val(vValue.replace(regExp, ""));
        }
        //데이터 없을 때
        if (vValue == "") {
            fnShowWarning("modif_NAME", "NAME_Empty", "#f44336");
            fnOnOffWarning("NAME_OverTwo", "false");
        } else {
            fnShowWarning("modif_NAME", "NAME_Empty", "#4caf50");
        }

        //2개 이상
        if (vValue != "") {
            if (vValue.length < 2) {
                fnShowWarning("modif_NAME", "NAME_OverTwo", "#f44336");
            } else {
                fnShowWarning("modif_NAME", "NAME_OverTwo", "#4caf50");
            }
        }
        if (e.keyCode == 13) {
            $("#modif_TELNO").focus();
        }
    }
    //RES_NAME end
    //RES_TEL Strat
    else if ($this.attr('id') == "modif_TELNO") {
        $("#modif_TELNO").val($("#modif_TELNO").val().replace(" ", ""))
        vValue = $("#modif_TELNO").val().replace(" ", "").trim();
        var vKorCheck = /[ㄱ-ㅎ|ㅏ-ㅣ]/; //한글 자음 체크
        var vEngCheck = /[a-z | A-Z]/;

        //Phone 하이픈 넣기
        if (vValue != "") {
            $(this).val(_fnMakePhoneForm(vValue));
        }


        //값이 없을 때
        if (vValue == "") {
            fnShowWarning("modif_TELNO", "TEL_Empty", "#f44336");
            fnOnOffWarning("TEL_NotNumber", "false");
        } else {
            fnShowWarning("modif_TELNO", "TEL_Empty", "#4caf50");
        }

        //숫자가 아닐 때
        if (vKorCheck.test(vValue) || vEngCheck.test(vValue)) {
            fnShowWarning("modif_TELNO", "TEL_NotNumber", "#f44336");
        } else {
            fnOnOffWarning("TEL_NotNumber", "false");
        }
        if (e.keyCode == 13) {
            $("#modif_COM").focus();
        }
    } else if ($this.attr('id') == "modif_COM") {
        if (e.keyCode == 13) {
            $("#modif_DEPT").focus();
        }
    }
});

$(document).ready(function () {
    $('.simple-estimate').hide();
    $('.company_info').hide();
    $('#header').css('border-bottom', '1px solid #00c4bd');
});

$('#agree').on('click', function () {
    var checked = $(this).is(':checked');

    if (checked) {
        $(this).closest('.agreement-container').find('.chk').prop('checked', true);
    } else {
        $(this).closest('.agreement-container').find('.chk').prop('checked', false);
    }
});
$('.agreement-container .chk').on('click', function () {
    var chkGroup = $(this).closest('.agreement-container').find('.check-group');
    var chkGroup_cnt = chkGroup.length;
    checked_cnt = $('.check-group .chk:checked').length;

    if (checked_cnt < chkGroup_cnt) {
        $('#agree').prop('checked', false);
    } else if (checked_cnt == chkGroup_cnt) {
        $('#agree').prop('checked', true);
    }
});

$(document).on('click', '#show_policy', function () {
    $('.policy_text').show();
})
$(document).on('click', '#show_service', function () {
    $('.service_text').show();
})

$(document).on('click', '#modify_enter', function () {
    fnModifyUser();
})

//회원정보 수정
function fnModifyUser() {
    try {

        if (fnModifyUser_Validation()) {

            var objJsonData = new Object();
            objJsonData.EMAIL = _fnToNull($("#modif_EMAIL").val());
            //현재 비밀번호
            objJsonData.PSWD = $("#modif_PWD").val();
            //변경 비밀번호
            objJsonData.CHAR_PSWD = $("#modif_NEWPWD1").val();
            //담당자성함
            objJsonData.CUST_NAME = $("#modif_NAME").val();
            //연락처
            objJsonData.TELNO = $("#modif_TELNO").val().replace(/-/gi, "");
            //회사단체명
            objJsonData.COMPANY = $("#modif_COM").val();
            //소속부서
            objJsonData.DEPARTURE = $("#modif_DEPT").val();

            $.ajax({
                type: "POST",
                url: "/Modify/ModifyUser",
                async: false,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {
                    if (result["rec_cd"] == "Y") {
                        _fnAlertMsg("회원정보가 수정되었습니다.");
                        location.href = window.location.origin;
                    } else if (result["rec_cd"] == "N") {
                        _fnAlertMsg("회원정보가 수정되지 않았습니다.");
                    } else if (result["rec_cd"] == "E") {
                        _fnAlertMsg("담당자에게 문의해주세요.");
                    }
                }, error: function (error) {
                    _fnAlertMsg("담당자에게 문의해주세요.");
                    console.log(error);
                }
            });
        }
    }
    catch (err) {
        console.log("[Error - fnModifyUser()]" + err.meessage);
    }
}

//회원정보수정 밸리데이션
function fnModifyUser_Validation() {
    try {
        var vNowPwd = $("#modif_PWD").val();
        var vNewPwd = $("#modif_NEWPWD1").val();
        var vCheckNewPwd = $("#modif_NEWPWD2").val();
        var vCheck = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{6,17}$/; //비밀번호 유효성 검사
        var vCustName = $("#modif_NAME").val();
        var vCustTel = $("#modif_TELNO").val();

        console.log("_chkpwd:" + _chkpwd);

        //필수값 비밀번호
        if (_fnToNull(vNowPwd) == "") {
            _fnAlertMsg("비밀번호를 입력해주세요");
            $(document).on('click', '#findpwalert', function () {
                $("#modif_PWD").focus();
            })
            return false;
        }

        if (_chkpwd) {
            _fnAlertMsg("현재 비밀번호가 다릅니다. 다시 확인해주세요.");
            $(document).on('click', '#findpwalert', function () {
                $("#modif_PWD").focus();
            })
            return false;
        }
        //비밀번호 밸리데이션
        if (_fnToNull(vNewPwd) != "" || _fnToNull(vCheckNewPwd) != "") {
            if (vNewPwd != vCheckNewPwd) {
                _fnAlertMsg("새 비밀번호와 확인비밀번호가 다릅니다");
                $(document).on('click', '#findpwalert', function () {
                    $("#modif_NEWPWD1").focus();
                })
                return false;
            }
            if (vNewPwd.length <= 7) {
                _fnAlertMsg("비밀번호 변경의 자리수는 8자리 이상 입력해주세요.")
                $(document).on('click', '#findpwalert', function () {
                    $("#modif_NEWPWD1").focus();
                })
                return false;
            }
            if (!vCheck.test(vNewPwd)) {
                _fnAlertMsg("비밀번호 영문,숫자,특수문자 조합으로 입력해주세요.");
                $(document).on('click', '#findpwalert', function () {
                    $("#modif_NEWPWD1").focus();
                })
                return false;
            }
        }
        if (_fnToNull(vCustName) == "") {
            _fnAlertMsg("담당자 성함을 입력해주세요.");
            $(document).on('click', '#findpwalert', function () {
                $("#modif_NAME").focus();
            })
            return false;
        }
        if (_fnToNull(vCustTel) == "") {
            _fnAlertMsg("연락처를 입력해주세요.");
            $(document).on('click', '#findpwalert', function () {
                $("#modif_TELNO").focus();
            })
            return false;
        }
            

        return true;

    }
    catch (err) {
        console.log("[Error - fnModifyUser_Validation]" + err.meessage);
    }
}
//비밀번호 체크
function fnChkNowPSWD() {
    try {

        var objJsonData = new Object();
        objJsonData.EMAIL = $("#modif_EMAIL").val();
        objJsonData.PSWD = $("#modif_PWD").val();

        $.ajax({
            type: "POST",
            url: "/Modify/ChkNowPSWD",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (result["rec_cd"] == "Y") {
                    console.log("fnChkNowPSWD()");
                    _chkpwd = false;
                    fnShowWarning("modif_PWD", "NOWPWD_Wrong", "#4caf50");
                } else if (result["rec_cd"] == "N") {
                    _chkpwd = true;
                    fnShowWarning("modif_PWD", "NOWPWD_Wrong", "#f44336");
                } else if (result["rec_cd"] == "E") {
                    _fnAlertMsg("담당자에게 문의 해주세요.");
                }
            }, error: function (error) {
                _fnAlertMsg("담당자에게 문의 해주세요.");
                console.log(error);
            }
        });

    }
    catch (err) {
        console.log("[Error - fnChkNowPSWD]" + err.message);
    }
}

function fnGetUserInfo() {
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
                    fnSetUserInfo(result);
                } else if (result.Result[0]["trxCode"] == "N") {
                    _fnAlertMsg("회원 정보가 없습니다. 담당자에게 문의해주세요.");
                    /*location.href = window.location.origin;*/
                } else if (result.Result[0]["trxCode"] == "E") {
                    _fnAlertMsg("담당자에게 문의 해주세요.");
                    /*location.href = window.location.origin;*/
                }
            }, error: function (error) {
                _fnAlertMsg("담당자에게 문의 해주세요.");
                console.log(error);
            }
        });
    }
    catch (err) {
        _fnAlertMsg("담당자에게 문의 해주세요.");
        console.log("[Error - fnGetUserInfo()]" + err.message);
    }
}

//회원정보 데이터 값 넣어주기
function fnSetUserInfo(vJsonData) {
    try {
        vResult = vJsonData.UserInfo;
        var objLogin_Info = new Object();

        objLogin_Info.EMAIL = _fnToNull(vResult[0].EMAIL);
        objLogin_Info.CUST_NAME = _fnToNull(vResult[0].CUST_NAME);
        objLogin_Info.TELNO = _fnToNull(vResult[0].TELNO);
        objLogin_Info.COMPANY = _fnToNull(vResult[0].COMPANY);
        objLogin_Info.DEPARTURE = _fnToNull(vResult[0].DEPARTURE);

        $("#modif_EMAIL").val(_fnToNull(vResult[0].EMAIL));
        $("#modif_NAME").val(_fnToNull(vResult[0].CUST_NAME));
        $("#modif_TELNO").val(_fnToNull(vResult[0].TELNO));
        $("#modif_COM").val(_fnToNull(vResult[0].COMPANY));
        $("#modif_DEPT").val(_fnToNull(vResult[0].DEPARTURE));

    }
    catch (err) {
        console.log("[Error - fnSetUserInfo()]" + err.message);
    }
}
//Warning 메시지 보여주는 부분
function fnShowWarning(InputID, SpanID, Color) {
    var vColor = Color;

    $("#" + InputID).css("border-color", Color);

    if (vColor == "#f44336") {
        $("#" + SpanID).show();
    }
    else if (vColor == "#4caf50") {
        $("#" + SpanID).hide();
    }
}

//true => show / false => hide
function fnOnOffWarning(SpanID, IsCheck) {
    var vIsCheck = IsCheck;

    if (vIsCheck == "true") {
        $("#" + SpanID).show();
    }
    else if (vIsCheck == "false") {
        $("#" + SpanID).hide();
    }
}

//패스워드 & 패스워드 확인 비교
function fnPwCompare(value1, value2) {
    var vPw1 = value1;
    var vPw2 = value2;

    //1번 값이 둘다 다를 경우.
    //2번 값이 똑같을 경우.    

    if (vPw1 != "" && vPw2 != "") {
        if (vPw1 != vPw2) {
            fnOnOffWarning("PW2_Compare", "true");

            return "false";
        } else if (vPw1 == vPw2 && 5 < vPw2.length) {
            fnOnOffWarning("PW2_Compare", "false");
            return "true";
        }
    }
    return false;
}

//Border를 초록 혹은 빨강으로 변경 시켜주는 함수
function fnWarningBorder(InputID, Color) {
    $("#" + InputID).css("border-color", Color);
}

// input X버튼
$(document).ready(function () {
    if ($("#modif_NAME").val() != "") {
        var nm = $('#modif_NAME').parents('.int_box');
        var nm_del = nm.children('.btns.icon.delete');
        nm.addClass('has_del');
        nm_del.show();
    };
    if ($("#modif_TELNO").val() != "") {
        var nm = $('#modif_TELNO').parents('.int_box');
        var nm_del = nm.children('.btns.icon.delete');
        nm.addClass('has_del');
        nm_del.show();
    };
    if ($("#modif_COM").val() != "") {
        var nm = $('#modif_COM').parents('.int_box');
        var nm_del = nm.children('.btns.icon.delete');
        nm.addClass('has_del');
        nm_del.show();
    };
    if ($("#modif_DEPT").val() != "") {
    var nm = $('#modif_DEPT').parents('.int_box');
    var nm_del = nm.children('.btns.icon.delete');
    nm.addClass('has_del');
        nm_del.show();
    };
})

$("#modif_TELNO").keyup(function (event) {
    if (!(event.keyCode >= 37 && event.keyCode <= 40)) {
        var inputVal = $(this).val();
        $(this).val(inputVal.replace(/[^0-9 | -]/gi, ''));
    }
});