$(document).ready(function () {
    $('.simple-estimate').hide();
    $('.company_info').hide();
    $('#header').css('border-bottom', '1px solid #00c4bd');
});

//아이디찾기
$(document).on('click', '#SendEmail_GetID', function () {
    $("#FindID_Result")[0].innerHTML = "";
    fnGetFindID();
});
//아이디찾기 엔터키검색
$(document).on('keyup', '#FindID_HP', function (e) {
    if (e.keyCode == 13) {
        var id = $("#FindID_Name").val();
        var pw = $("#FindID_HP").val();

        if (id.length < 2) {
            $("#Span_Waning_ID").show();
        } else {
            $("#Span_Waning_ID").hide();
            fnGetFindID();
        }
    }
});
//아이디찾기 엔터탭이동
$(document).on('keyup', '#FindID_Name', function (e) {
    if (e.keyCode == 13) {
        $("#FindID_HP").focus();
    }
});

//비밀번호 초기화
$(document).on('click', '#SendEmail_GetConfirmKey', function () {
    /*_fnLayerConfirmMsg("비밀번호 초기화 메일을 전송하시겠습니까?");*/
    SendResetPassword();
});

//아이디찾기함수
function fnGetFindID() {
    try {

        var objJsonData = new Object();
        if ($("#FindID_Name").val().length < 2) {
            $("#Span_Waning_ID").show();
            //$("#Span_Waning_ID").html("두자리 이상 입력하세요");
            $('#FindID_Name').focus();
            //$("#Span_Waning_ID").show();
            return false;
        } else {
            $("#Span_Waning_ID").hide();
        }

        if ($("#FindID_HP").val().length == 0) {
/*            $("#Span_Waning_PW").html("휴대폰번호를 입력하세요");*/
            $("#Span_Waning_PW").show();
            return false;
        } else {
            $("#Span_Waning_PW").hide();
        }

            objJsonData.CUST_NAME = $("#FindID_Name").val();
            objJsonData.TELNO = $("#FindID_HP").val();

            $.ajax({
                type: "POST",
                url: "/Find/FindID",
                async: false,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {

                    if (result.Result[0]["trxCode"] == "Y") {
                        $(".error").hide();

                        var vHTML = "";
                        vHTML += "ID: ";
                        $.each(result.Table[0], function (i) {
                            if (0 < i) {
                                vHTML += " , " + fnSetEmailHidden(result.Table[0]["EMAIL"].trim());
                            } else {
                                vHTML += fnSetEmailHidden(result.Table[0]["EMAIL"].trim());
                            }
                        });
                        vHTML += " 입니다";
                        $(".id-result").show();
                        $("#FindID_Result")[0].innerHTML = vHTML;
                    } else if (result.Result[0]["trxCode"] == "N") {
                        $(".id-result").show();
                        $("#FindID_Result")[0].innerHTML = "아이디가 존재하지 않습니다.";
                        $("#FindID_HP").val("");
                        $("#FindID_HP").focus();
                        $('.login_box .login_pop.find_account .find-flex > div:first-child').css('padding-bottom', '20px');
                    } else if (result.Result[0]["trxCode"] == "E") {
                        $(".error").html("오류가 발생 하였습니다. 관리자에게 문의 하세요.");
                        $(".error").show();
                    }
                }, error: function (error) {
                    console.log(error);
                }
            });
    }
    catch (err) {
        console.log("[Error - fnGetFindID()]" + err.meessage);
    }
}

//비밀번호 초기화(임시비밀번호 발급)
function SendResetPassword() {
    try {
        if ($("#FindPW_Email").val() == "") {
            $("#Span_Waning_Email").html("이메일을 입력 해 주세요.");
            $("#Span_Waning_Email").show();
            $("#FindPW_Email").focus();
        }
        else {
            $("#Span_Waning_Email").hide();

            var objJsonData = new Object();
            objJsonData.EMAIL = $("#FindPW_Email").val();

            $.ajax({
                type: "POST",
                url: "/Find/GetNewPW",
                async: false,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {
                    //성공시 메일전송
                    if (result.Result[0]["trxCode"] == "Y") {

                        //메일보내기 함수
                        fnSendMail(result.NewPSWD[0]["SEND_EMAIL"].trim(), result.NewPSWD[0]["EMAIL"].trim(), "임시 비밀번호 입니다.", "임시 비밀번호 입니다.", "임시 비밀번호 ", result.NewPSWD[0]["PSWD"]);
                        _fnAlertMsg("임시비밀번호가 전송되었습니다.");
                        $(document).on('click', '#findpwalert', function () {
                             location.href = window.location.origin;
                        })
                    } else if (result.Result[0]["trxCode"] == "N") {
                        _fnAlertMsg("일치하는 아이디가 없습니다.");
                        console.log("[Fail - SendResetPassword()]" + JSON.parse(result).Result[0]["trxCode"]);
                    } else if (result.Result[0]["trxCode"] == "E") {
                        _fnAlertMsg("담당자에게 문의해주세요.")
                        console.log("[Fail - SendResetPassword()]" + JSON.parse(result).Result[0]["trxCode"]);
                    }
                }, error: function (error) {
                    _fnAlertMsg("담당자에게 문의해주세요.");
                    console.log(error);
                }
            });     
        }
    }
    catch (err) {
        console.log(err.meessage);
    }
}

//이메일 텍스트 hidden (value => 텍스트 값 / hiddenNum => 얼마나 가릴지) 
function fnSetEmailHidden(value) {

    if (value.indexOf("@") != -1) {
        var vValue = value.split("@");

        if (vValue[0].length < 4) {
            var vResult = vValue[0];
            vResult = vResult.substring(0, vResult.length - 1);
            vResult += "＊@";
            vResult += vValue[1];

            return vResult;
        }
        else {
            var vResult = vValue[0];
            vResult = vResult.substring(0, vResult.length - 3);
            vResult += "＊＊＊@";
            vResult += vValue[1];

            return vResult;
        }
    }
    else {
        _fnAlertMsg("이메일을 찾을 수 없습니다.\n@누락");
        console.log("@가 없습니다.");
    }
}

//메일 보내기 함수
function fnSendMail(vFrom, vTo, vSubject, vTitle, vTh, vTb) {
    try {

        var objJsonData = new Object();
        objJsonData.FROM = vFrom.trim();
        objJsonData.TO = vTo.trim();
        objJsonData.SUBJECT = vSubject.trim();
        objJsonData.TITLE = vTitle.trim();
        objJsonData.CONTENT = vTh.trim();
        objJsonData.SAMPLE_PW = vTb.trim();

        //ajax로 메일 보내기
        $.ajax({
            type: "POST",
            url: "/Find/SendEmail",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                console.log(result);
            }, error: function (error) {
                _fnAlertMsg("담당자에게 문의 하세요.");
                console.log(error);
            }
        });

    }
    catch (err) {
        console.log("[Error - fnSendMail]" + err.message);
    }
}