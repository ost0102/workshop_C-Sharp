

$(function () {
    var userInputId = _fnGetCookie("Prime_CK_USR_ID_REMEMBER_WORKSHOP_ADMIN");
    if (_fnToNull(userInputId) != "") {
        $("#ad_top_id").val(userInputId);
        $("#Admin_id_keep").attr("checked", true);
        //$("#login_keep").replaceWith("<input type='checkbox' id='login_keep' name='login_keep' class='chk' checked>");
    } else {
        $("#ad_top_id").focus();
    }

    $("#ad_layer_login_btn").click(function (e) {
        
        if (_fnToNull($("#ad_top_id").val()) == "") {
            $("#Span_Waning_PW").hide();
            $("#Span_Waning_ID").show();
            $("#ad_top_id").focus();
            return true;
        } else if (_fnToNull($("#ad_top_pw").val()) == "") {
            $("#Span_Waning_PW").show();
            $("#Span_Waning_ID").hide();
            $("#ad_top_pw").focus();
            return true;
        }
        else {
            $("#Span_Waning_PW").hide();
        }
        var loginObj = new Object();
        loginObj.ID = $("#ad_top_id").val();
        loginObj.PWD = $("#ad_top_pw").val();

        $.ajax({
            type: "POST",
            url: "/Admin/fnLogin",
            data: { "vJsonData": _fnMakeJson(loginObj) },
            success: function (result) {
                if (JSON.parse(result).Result[0].trxCode == "Y") {
                        //아이디 저장 체크 일 경우 쿠키에 저장
                        if ($('input[name=login_keep]')[0].checked) {
                            _fnSetCookie("Prime_CK_USR_ID_REMEMBER_WORKSHOP_ADMIN", JSON.parse(result).Table[0].EMAIL, "168");
                        } else {
                            _fnDelCookie("Prime_CK_USR_ID_REMEMBER_WORKSHOP_ADMIN");
                        }
                        $.ajax({
                            type: "POST",
                            url: "/Admin/SaveLogin",
                            async: false,
                            data: { "vJsonData": result },
                            success: function (result) {
                                if (_fnToNull(result) == "Y") {
                                    /*location.href = "/Admin/CommonCode";*/
                                    location.href = "/Quotation/quotList";
                                }
                            }, error: function (error) {
                                _fnAlertMsg("담당자에게 문의해주세요.");
                                console.log(error);
                            },
                            beforeSend: function () {
                                $("#ProgressBar_Loading").show(); //프로그래스바
                            },
                            complete: function () {
                                $("#ProgressBar_Loading").hide(); //프로그래스바
                            }
                        })
                } else {
                    _fnAlertMsg("이메일 또는 비밀번호가 틀렸습니다");
                }
            }
        });
        //var $form_data = $("#login_form").serialize()
        //$("#login_form").submit();
    });
    $("#ad_top_id").keypress(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            $("#ad_top_pw").focus();
        }
    });
    $("#ad_top_pw").keypress(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            $("#ad_layer_login_btn").trigger('click');
        }
    });
});
