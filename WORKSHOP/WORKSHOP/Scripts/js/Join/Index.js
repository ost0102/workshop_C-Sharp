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
    var chk01 = $('#essential').is(':checked');
    var chk02 = $('#service').is(':checked');
    checked_cnt = $('.check-group .chk:checked').length;

    if (checked_cnt < chkGroup_cnt) {
        $('#agree').attr('checked', false);
    } else if (checked_cnt == chkGroup_cnt) {
        $('#agree').attr('checked', true);
    }
    if (chk01 && chk02) {
        $('#agree').prop('checked', true);
    } else if (chk01 || chk02) {
        $('#agree').attr('checked', false);
    }
});

$(document).on('click', '#show_policy', function () {
    $('.policy_text').slideDown();
    $(this).text('접기');
    $(this).addClass('on')
})
$(document).on('click', '#show_policy.on', function () {
    $('.policy_text').slideUp();
    $(this).text('보기');
    $(this).removeClass('on');
})
$(document).on('click', '#show_service', function () {
    $('.service_text').slideDown();
    $(this).text('접기');
    $(this).addClass('on')
})
$(document).on('click', '#show_service.on', function () {
    $('.service_text').slideUp();
    $(this).text('보기');
    $(this).removeClass('on');
})

//function _fnMakePhoneForm(value) {
//    var vTel = "";
//    var vValue = value;
//    vValue = vValue.replace(/-/gi, "");

//    //자동 하이픈
//    if (vValue.length < 4) {
//        vTel = vValue;
//    }
//    else if (vValue.length < 7) {
//        vTel += vValue.substr(0, 3);
//        vTel += "-";
//        vTel += vValue.substr(3);
//    }
//    else if (vValue.length < 11) {
//        vTel += vValue.substr(0, 3);
//        vTel += "-";
//        vTel += vValue.substr(3, 3);
//        vTel += "-";
//        vTel += vValue.substr(6);
//    } else {
//        vTel += vValue.substr(0, 3);
//        vTel += "-";
//        vTel += vValue.substr(3, 4);
//        vTel += "-";
//        vTel += vValue.substr(7);
//    }

//    return vTel;
//}

$(document).on("click", ".btns.icon.delete", function () {
    $(this).parent().siblings('.check_val').val("false");
    $(this).siblings(".input_text").css('border-color', "");
});

$("input").focusout(function (e) {

    var $this = $(e.target);
    var vValue = "";
    if ($this.attr('id') == "RES_EMAIL") {
        vValue = $("#RES_EMAIL").val();

        if (vValue == "") {
            fnShowWarning("RES_EMAIL", "Email_Warning", "#f44336");
        }
        else if (_vEmail_Check == "true") {
            fnCheckID_RealTime(vValue);
        }
    }
});

//input 실시간 - Validation
$("input").keyup(function (e) {
    try {
        var $this = $(e.target);
        var vValue = "";
        var vCompare = "";

        //Input => E-mail
        if ($this.attr('id') == "RES_EMAIL") {
            $("#RES_EMAIL").val($("#RES_EMAIL").val().replace(" ", "").replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/gi,''))
            vValue = $("#RES_EMAIL").val().replace(" ", "").trim();
            //Color Error => #f44336 / Success => #4caf50
            
            //특수문자 체크
            if (fnCheckSC(vValue)) {
                fnShowWarning("RES_EMAIL", "Email_Warning", "#4caf50");
                fnOnOffWarning("Email_SCWarning", "false");
            } else {
                fnShowWarning("RES_EMAIL", "Email_Warning", "#f44336");
            }

            //공백 값 체크
            if (vValue == "") {
                fnShowWarning("RES_EMAIL", "Email_Empty", "#f44336");
                fnOnOffWarning("Email_Warning", "false");
                fnOnOffWarning("Email_CheckID", "false");
                fnOnOffWarning("Email_SCWarning", "false");
            }
            else {
                //fnShowWarning("RES_EMAIL", "Email_Empty", "#4caf50");
                fnOnOffWarning("Email_Empty", "false");
                fnOnOffWarning("Email_CheckID", "false");
                fnOnOffWarning("Email_SCWarning", "false");
            }

            var regExp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (vValue != "") {

                var vMatch = "true";
                var vSC = "true";


                //null이면 경고 , null이 아니면 가능
                if (vValue.match(regExp) == null) {
                    fnShowWarning("RES_EMAIL", "Email_Warn#ng", "#f44336");
                    vMatch = "false";
                    _vEmail_Check = "false";
                } else {
                    fnShowWarning("RES_EMAIL", "Email_Warning", "#4caf50");
                    _vEmail_Check = "true";
                }

                //true면 경고 false면 가능
                if (fnCheckSC(vValue)) {
                    fnShowWarning("RES_EMAIL", "Email_SCWarning", "#f44336");
                    vSC = "false";
                } else {
                    fnShowWarning("RES_EMAIL", "Email_SCWarning", "#4caf50");
                }

                if (vMatch == "false" || vSC == "false") {
                    fnShowWarning("RES_EMAIL", "Email_Warning", "#f44336");
                } else {
                    fnShowWarning("RES_EMAIL", "Email_SCWarning", "#4caf50");
                }
            }


            //Check Warning - true false
            if ($("#Email_Empty").css("display") != "none" || $("#Email_Warning").css("display") != "none" || $("#Email_CheckID").css("display") != "none") {
                $("#Email_Hidden").val("false");
            } else {
                $("#Email_Hidden").val("true");
            }

            if (e.keyCode == 13) {
                $("#RES_PWD").focus();
            }

        } //Res_Email End
        //RES_PWD start
        else if ($this.attr('id') == "RES_PWD") {

            vValue = $("#RES_PWD").val();
            vCompare = $("#RES_PWD2").val();

            var vBoolean_LessSix = "false";
            var vBoolean_Regular = "false";
            var vBoolean_Different = "false";

            //값 없을 시 경고메시지
            if (vValue == "") {
                fnShowWarning("RES_PWD", "PW1_Empty", "#f44336");
                fnOnOffWarning("PW1_OverSix", "false");
            }
            else {
                fnOnOffWarning("PW1_Empty", "false");

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
            }

            //마지막 체크
            if (vBoolean_LessSix == "false" || vBoolean_Regular == "false" || vBoolean_Different == "false") {
                fnWarningBorder("RES_PWD", "#f44336");
                if (vBoolean_Different == "false" && $("#RES_PWD2").val() != "") {
                    fnWarningBorder("RES_PWD2", "#f44336");
                }
            } else {
                fnWarningBorder("RES_PWD", "#4caf50");
                //만약 비밀번호 확인이 오류면 변경 해주는 로직. (확인이 필요함)
                if ($("#RES_PWD2").css("border-top-color") == "rgb(244, 67, 54)") {
                    if ($("#PW2_Empty").css("display") != "inline-block" && $("#PW2_Compare").css("display") != "inline-block") {
                        $("#RES_PWD2").css("border-color", "#4caf50");
                    }
                }
            }

            //Check Warning - true false
            if ($("#PW1_Empty").css("display") == "block" || $("#PW1_OverSix").css("display") == "block" || $("#PW1_Regular").css("display") == "block") {
                /*if ($("#PW2_Empty").css("display") == "block" || $("#PW2_OverSix").css("display") == "block" || $("#PW2_Compare").css("display") == "block" || $("#PW2_Regular").css("display") == "block") {*/
                    $("#PW1_Hidden").val("false");
                } else {
                    $("#PW1_Hidden").val("true");
                }
            //} else {
            //    $("#PW1_Hidden").val("true");
            //   /* $("#PW2_Hidden").val("true");*/
            //}
            if (e.keyCode == 13) {
                $("#RES_PWD2").focus();
            }
        } //RES_PWD end
        //RES_PWD2 start 
        else if ($this.attr('id') == "RES_PWD2") {

            vValue = $("#RES_PWD2").val();
            vCompare = $("#RES_PWD").val();

            var vBoolean_LessSix = "false";
            var vBoolean_Regular = "false";
            var vBoolean_Different = "false";

            //값 없을 시 경고메시지
            if (vValue == "") {
                fnShowWarning("RES_PWD2", "PW2_Empty", "#f44336");
                fnOnOffWarning("PW2_OverSix", "false");
            }
            else {
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
            }

            //마지막 체크
            if (vBoolean_LessSix == "false" || vBoolean_Regular == "false" || vBoolean_Different == "false") {
                fnWarningBorder("RES_PWD2", "#f44336");
                if (vBoolean_Different == "false" && $("#RES_PWD").val() != "") {
                    fnWarningBorder("RES_PWD", "#f44336");
                }
            } else {
                fnWarningBorder("RES_PWD2", "#4caf50");
                //만약 비밀번호 확인이 오류면 변경 해주는 로직. (확인이 필요함)
                if ($("#RES_PWD").css("border-top-color") == "rgb(244, 67, 54)") {
                    if ($("#PW1_Empty").css("display") != "inline-block") {
                        $("#RES_PWD").css("border-color", "#4caf50");
                    }
                }
            }

            //Check Warning - true false
            if ($("#PW2_Empty").css("display") == "block" || $("#PW2_OverSix").css("display") == "block" || $("#PW2_Compare").css("display") == "block" || $("#PW2_Regular").css("display") == "block") {
                $("#PW2_Hidden").val("false");
            } else {
                $("#PW2_Hidden").val("true");
            }
            if (e.keyCode == 13) {
                $("#RES_NAME").focus();
            }
        } //RES_PWD2 end
        else if ($this.attr('id') == "RES_NAME") {
            $("#RES_NAME").val($("#RES_NAME").val().replace(" ", ""))
            vValue = $("#RES_NAME").val().replace(" ", "").trim();
            //var check = /[ㄱ-ㅎ|ㅏ-ㅣ]/; //한글 자음 체크
            var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
            if (regExp.test(vValue)) {
                $("#RES_NAME").val(vValue.replace(regExp, ""));
            }
            //데이터 없을 때
            if (vValue == "") {
                fnShowWarning("RES_NAME", "NAME_Empty", "#f44336");
                fnOnOffWarning("NAME_OverTwo", "false");
            } else {
                fnShowWarning("RES_NAME", "NAME_Empty", "#4caf50");
            }

            //2개 이상
            if (vValue != "") {
                if (vValue.length < 2) {
                    fnShowWarning("RES_NAME", "NAME_OverTwo", "#f44336");
                } else {
                    fnShowWarning("RES_NAME", "NAME_OverTwo", "#4caf50");
                }
            }

            //Check Warning - true false
            if ($("#NAME_Empty").css("display") == "inline-block" || $("#NAME_OverTwo").css("display") == "inline-block" || $("#NAME_CheckKorean").css("display") == "inline-block") {
                $("#NAME_Hidden").val("false");
            } else {
                $("#NAME_Hidden").val("true");
            }
            if (e.keyCode == 13) {
                $("#RES_TEL").focus();
            }
        } else if ($this.attr('id') == "CUST_NM") {
        //    vValue = $("#CUST_NM").val();
        //    //var check = /[ㄱ-ㅎ|ㅏ-ㅣ]/; //한글 자음 체크
        //    //                var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
        //    //                if (regExp.test(vValue)) {
        //    //                    $("#CUST_NM").val(vValue.replace(regExp, ""));
        //    //                }
        //    //데이터 없을 때
        //    if (vValue == "") {
        //        fnShowWarning("CUST_NM", "CUST_Empty", "#f44336");
        //    } else {
        //        fnShowWarning("CUST_NM", "CUST_Empty", "#4caf50");
        //    }

        //    //Check Warning - true false
        //    if ($("#CUST_Empty").css("display") == "inline-block") {
        //        $("#CustNAME_Hidden").val("false");
        //    } else {
        //        $("#CustNAME_Hidden").val("true");
        //    }
            if (e.keyCode == 13) {
                $("#DEPT_NM").focus();
            }

        } //RES_NAME end
        //RES_TEL Strat
        else if ($this.attr('id') == "RES_TEL") {
            $("#RES_TEL").val($("#RES_TEL").val().replace(" ", ""))
            vValue = $("#RES_TEL").val().replace(" ","").trim();
            var vKorCheck = /[ㄱ-ㅎ|ㅏ-ㅣ]/; //한글 자음 체크
            var vEngCheck = /[a-z | A-Z]/;

            //111111111,22222222이런식으로 넣을때 리플레이스
            if (this.value.toString().replace(/-/gi, '').length > 11) {
                vValue = this.value.substr(0, 11);
            }

            //Phone 하이픈 넣기
            if (vValue != "") {
                $(this).val(_fnMakePhoneForm(vValue));
            }

            //값이 없을 때
            if (vValue == "") {
                fnShowWarning("RES_TEL", "TEL_Empty", "#f44336");
                fnOnOffWarning("TEL_NotNumber", "false");
            } else {
                fnShowWarning("RES_TEL", "TEL_Empty", "#4caf50");
            }

            //숫자가 아닐 때
            if (vKorCheck.test(vValue) || vEngCheck.test(vValue)) {
                fnShowWarning("RES_TEL", "TEL_NotNumber", "#f44336");
            } else {
                fnOnOffWarning("TEL_NotNumber", "false");
            }

            //번호 10개이상
            if (vValue != "") {
                if (vValue.length < 11) {
                    fnShowWarning("RES_TEL", "TEL_Empty", "#f44336");
                    fnOnOffWarning("TEL_NotNumber", "false");
                } else {
                    fnShowWarning("RES_TEL", "TEL_Empty", "#4caf50");
                }
            }

            //Check Warning - true false
            if ($("#TEL_Empty").css("display") == "block" || $("#TEL_NotNumber").css("display") == "inline-block") {
                $("#TEL_Hidden").val("false");
            } else {
                $("#TEL_Hidden").val("true");
            }
            if (e.keyCode == 13) {
                $("#CUST_NM").focus();
            }
        } //RES_TEL end
        //DEPT_NM Start

        //else if ($this.attr('id') == "DEPT_NM") {

        //    vValue = $("#DEPT_NM").val().trim();

        //    var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
        //    if (regExp.test(vValue)) {
        //        $("#DEPT_NM").val(vValue.replace(regExp, ""));
        //    }
        //    //데이터 없을 때
        //    if (vValue == "") {
        //        fnShowWarning("DEPT_NM", "DEPT_Empty", "#f44336");
        //        fnOnOffWarning("NAME_OverTwo", "false");
        //    } else {
        //        fnShowWarning("DEPT_NM", "DEPT_Empty", "#4caf50");
        //    }

        //    //Check Warning - true false
        //    if ($("#DEPT_Empty").css("display") == "inline-block") {
        //        $("#DeptNAME_Hidden").val("false");
        //    } else {
        //        $("#DeptNAME_Hidden").val("true");
        //    }
        //}
    } catch (err) {
        console.log(err.message);
    }

});

$("#RES_TEL").keyup(function (event) {
    if (!(event.keyCode >= 37 && event.keyCode <= 40)) {
        var inputVal = $(this).val();
        $(this).val(inputVal.replace(/[^0-9 | -]/gi, ''));
    }
});

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

//Border를 초록 혹은 빨강으로 변경 시켜주는 함수
function fnWarningBorder(InputID, Color) {
    $("#" + InputID).css("border-color", Color);
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


//Check 경고 메시지가 있는지 없는지 검증
function fnIsWarningMSG() {
    var vEmail_Hidden = $("#Email_Hidden").val();
    var vPW1_Hidden = $("#PW1_Hidden").val();
    var vPW2_Hidden = $("#PW2_Hidden").val();
    var NAME_Hidden = $("#NAME_Hidden").val();
    var TEL_Hidden = $("#TEL_Hidden").val();
    //var CustName_Hidden = $("#CustNAME_Hidden").val();
    //var DeptNAME_Hidden = $("#DeptNAME_Hidden").val();
    var vBooleant = "true";
    var vBooleanf = "false";

    if (vEmail_Hidden == "true" && vPW1_Hidden == "true" && vPW2_Hidden == "true" && NAME_Hidden == "true" && TEL_Hidden == "true") {
        //return true;
        return vBooleant;
    } else {
        //return false;
        if (vEmail_Hidden == "false") {
            return "RES_EMAIL";
        } else if (vPW1_Hidden == "false") {
            return "RES_PWD";
        } else if (vPW2_Hidden == "false") {
            return "RES_PWD2";
        } else if (NAME_Hidden == "false") {
            return "RES_NAME";
        } else if (TEL_Hidden == "false") {
            return "RES_TEL";
        }
    }
}

//특수 문자가 있는지 확인
function fnCheckSC(value) {

    var vValue = value;
    var vObj_SC = new Object();

    //특수문자 아스키 코드

    vObj_SC.Asterisk = String.fromCharCode("42"); // *
    vObj_SC.PercentSign = String.fromCharCode("37"); //%
    vObj_SC.Ampersand = String.fromCharCode("38"); //&
    vObj_SC.Plus = String.fromCharCode("43"); // +
    vObj_SC.BackSlash = String.fromCharCode("92");  //\
    vObj_SC.Colon = String.fromCharCode("58"); // :
    vObj_SC.Grave = String.fromCharCode("96"); // '
    vObj_SC.LAngle = String.fromCharCode("60"); // <
    vObj_SC.RAngle = String.fromCharCode("62"); // >
    vObj_SC.Slash = String.fromCharCode("47"); // /

    if (vValue.indexOf(vObj_SC.Asterisk) != -1 || vValue.indexOf(vObj_SC.PercentSign) != -1 || vValue.indexOf(vObj_SC.Ampersand) != -1 || vValue.indexOf(vObj_SC.Plus) != -1 || vValue.indexOf(vObj_SC.BackSlash) != -1 || vValue.indexOf(vObj_SC.Colon) != -1 || vValue.indexOf(vObj_SC.Grave) != -1 || vValue.indexOf(vObj_SC.LAngle) != -1 || vValue.indexOf(vObj_SC.RAngle) != -1 || vValue.indexOf(vObj_SC.Slash) != -1) {
        return true;
    } else {
        return false;
    }
}


//비밀번호 텍스트 hidden (비밀번호 정보 보여주기 위함 ) 
function fnSetPwdHidden(value) {

    var vValue = value;
    var vResult = vValue.substr(0, Math.floor(vValue.length / 5));
    for (var i = 0; i < vValue.length - Math.floor(vValue.length / 5); i++) {
        vResult += "*";
    }

    return vResult;
}

//비밀번호 1번 key 입력 이벤트
$(document).on("keyup", "#RES_PWD", function (e) {

    var vPw1 = $(this).val();
    var vPw2 = $("#RES_PWD2").val();

    //6개 이상
    if (vPw1 == "") {
        $("#PW1_OverSix").hide();
    } else {
        if (vPw1.length <= 7) {
            $("#PW1_OverSix").show();
        } else {
            $("#PW1_OverSix").hide();
        }
    }

    //6개 이상
    if (vPw1 == "") {
        $("#PW2_Compare").hide();
    } else {
        if (vPw1 != "" && vPw2 != "") {
            if (vPw1 != vPw2) {
                //데이터를 입력 해 주세요.
                $("#PW2_Compare").show();
            } else if (vPw1 == vPw2) {
                $("#PW2_Compare").hide();
            }
        }
    }

});

//비밀번호 2번 key 입력 이벤트
$(document).on("keyup", "#RES_PWD2", function (e) {
    var vPw1 = $("#RES_PWD").val();
    var vPw2 = $(this).val();

    //6개 이상
    if (vPw2 == "") {
        $("#PW2_OverSix").hide();
    } else {
        if (vPw2.length <= 7) {
            $("#PW2_OverSix").show();
        } else {
            $("#PW2_OverSix").hide();
        }
    }

    if (vPw2 == "") {
        $("#PW2_Compare").hide();
    } else {
        if (vPw1 != "" && vPw2 != "") {
            if (vPw1 != vPw2) {
                //데이터를 입력 해 주세요.
                $("#PW2_Compare").show();
            } else if (vPw1 == vPw2) {
                $("#PW2_Compare").hide();
            }
        }
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

//submit - 회원가입 버튼 이벤트
$(document).on("click", ".join_enter", function () {
    if (fnValidation()) {
        //if (!fnIsWarningMSG()) return false;
        var test = fnIsWarningMSG();
        if (test != "true") {
            _fnAlertMsg("필수값 확인이 필요합니다.", test);
        } else {
             if ($('#agree').attr('checked') == 'checked') {
                    fnRegister();
                } else {
                    $("#alertagree").show();
                }
            }
    } else {
        _fnAlertMsg("필수체크값 확인이 필요합니다.", test);
    }
    //_fnAlertMsg("필수체크값 확인이 필요합니다.");
});

$(document).on("click", "#Join_confirm", function () {
    location.href = window.location.origin;
});


//동의하고 가입하기 함수
function fnRegister() {
    try {
        var objJsonData = new Object();

        objJsonData.MNGT_NO = _fnSequenceMngt("USER");
        objJsonData.EMAIL = $("#RES_EMAIL").val();
        objJsonData.PSWD = $("#RES_PWD").val();
        objJsonData.CUST_NAME = $("#RES_NAME").val();
        objJsonData.TELNO = $("#RES_TEL").val().replace(/-/gi, "");
        objJsonData.COMPANY = $("#CUST_NM").val();
        objJsonData.DEPARTURE = $("#DEPT_NM").val();
        objJsonData.USER_TYPE = "A";
        objJsonData.APV_YN = "Y";

                $.ajax({
                    type: "POST",
                    url: "/Join/fnRegister",
                    async: true,
                    dataType: "json",
                    data: { "vJsonData": _fnMakeJson(objJsonData) },
                    success: function (result) {
                        if (result == null) {
                            _fnAlertMsg("오류가 발생 하였습니다. 담당자에게 문의 해주세요.");
                        } else {
                            if (result["rec_cd"] == "Y") {
                                _fnAlertMsg("가입이 완료되었습니다.");
                                $(document).on('click', '#findpwalert', function () {
                                    location.href = window.location.origin;
                                })
                            }
                            else if (result["rec_cd"] == "N") {
                                console.log(result["res_msg"]);
                            }
                            else if (result["rec_cd"] == "E") {
                                _fnAlertMsg("담당자에게 문의 하세요.");
                                console.log(JSON.parse(result).Result[0]["trxMsg"]);
                            }
                        }
                    }, error: function (xhr, status, error) {
                        _fnAlertMsg("담당자에게 문의 하세요.");
                        console.log(error);
                        $("#ProgressBar_Loading").hide();
                    },
                    beforeSend: function () {
                        $("#ProgressBar_Loading").show(); //프로그래스 바
                    },
                    complete: function () {
                        $("#ProgressBar_Loading").hide(); //프로그래스 바
                    }
                });
    }
    catch (err) {
        console.log("[Error - fnRegister]" + err.message);
    }
}

//동의하고 가입하기 벨리데이션 체크
function fnValidation() {

    try {
        var vMail = $("#RES_EMAIL").val().trim();
        var vPW = $("#RES_PWD").val();
        var vPW2 = $("#RES_PWD2").val();
        //value
        var vPwd = $('#RES_PWD').val();
        var vName = $('#RES_NAME').val();
        var vTel = $('#RES_TEL').val();
        //var vCustNm = $('#CUST_NM').val();
        //var vDeptNm = $('#DEPT_NM').val();

        if (vMail == "") {
            fnShowWarning("RES_EMAIL", "Email_Empty", "#f44336"); return false;
            $("#RES_EMAIL").focus();
        }
        if (vPW == "") {
            fnShowWarning("RES_PWD", "PW1_Empty", "#f44336"); return false;
            $("#RES_PWD").focus();
        }
        if (vPW2 == "") {
            fnShowWarning("RES_PWD2", "PW2_Empty", "#f44336"); return false;
            $("#RES_PWD2").focus();
        }
        if (vName == "") {
            fnShowWarning("RES_NAME", "NAME_Empty", "#f44336"); return false;
            $('#RES_NAME').focus();
        }
        if (vTel == "") {
            fnShowWarning("RES_TEL", "TEL_Empty", "#f44336"); return false;
            $('#RES_TEL').focus();
        }
        //if (vCustNm == "") {
        //    fnShowWarning("CUST_NM", "CUST_Empty", "#f44336"); return false;
        //}
        //if (vDeptNm == "") {
        //    fnShowWarning("DEPT_NM", "DEPT_Empty", "#f44336"); return false;
        //}

        if (vMail == "" || vPW == "" || vPW2 == "" || vName == "" || vTel == "") {
            return false;
        } else {
            return true;
        }

    } catch (err) {
        console.log(err.message);
    }
}

function fnCheckID_RealTime(value) {
    try {
        var objCHECK_INFO = new Object();
        objCHECK_INFO.EMAIL = value;

        if (value.lastIndexOf(",") + 1 == value.length) {
            return;
        }
        else {
            $.ajax({
                type: "POST",
                url: "/Join/isCheckID",
                async: false,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(objCHECK_INFO) },
                success: function (result) {
                    rtnJson = result;
                    if (rtnJson["rec_cd"] == "N") {
                        fnShowWarning("RES_EMAIL", "Email_CheckID", "#f44336");
                        $("#Email_Hidden").val("false");
                    }
                }, error: function (xhr) {
                    console.log("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
                    console.log(xhr);
                    return;
                }
            });
        }
    } catch (err) {
        console.log("[Error - fnCheckID_RealTime]" + err.message);
    }
}