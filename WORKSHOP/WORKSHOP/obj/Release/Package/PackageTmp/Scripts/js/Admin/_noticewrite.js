$(function () {

    $('#infile').bind('change', function () {
        //파일 사이즈 제한 - 김은빈
        if ($("#infile").val() != "") {
            if (this.files[0].size > 10485759) {
                _fnAlertMsg("10MB 이상되는 파일은 업로드 할 수 없습니다.");
                $("#infile").val("");
            }
        }
    });

    $('#infile1').bind('change', function () {
        //파일 사이즈 제한 - 김은빈
        if ($("#infile1").val() != "") {
            if (this.files[0].size > 10485759) {
                _fnAlertMsg("10MB 이상되는 파일은 업로드 할 수 없습니다.");
                $("#infile1").val("");
            }
        }
    });

    $('#infile2').bind('change', function () {
        //파일 사이즈 제한 - 김은빈
        if ($("#infile2").val() != "") {
            if (this.files[0].size > 10485759) {
                _fnAlertMsg("10MB 이상되는 파일은 업로드 할 수 없습니다.");
                $("#infile2").val("");
            }
        }
    });

    //게시글 삭제
    $("._btn_del").on('click', function (e) {
        if ($("#notice_id").val() != "") {  //아이디가 있어야함
            var Notice_ID = $("#notice_id").val();
            var result = confirm("정말로 삭제하시겠습니까?");
            //var obj = new Object();
            //obj.Notice_ID = Notice_ID;                                                                                        
            if (result) {
                $.ajax({
                    type: "POST",
                    url: "/AdminNotice/Notice_DelAjax?Notice_ID=" + Notice_ID,
                    success: function (result) {
                        alert("삭제되었습니다");
                        location.href = "/AdminNotice/Index";
                    }, error: function (xhr) {
                        console.log("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
                        console.log(xhr);
                        return;
                    }
                });
            }
        }
    });    
});

//신규 등록
$(document).on("click", "#Notice_Btn_Reg", function (e) {
    
    e.preventDefault();

    //alert(CKEDITOR.instances.content.getData().length);
    //return false;

    if (check_msg('title', '제목', 'required') == false) return false;

    //if (CKEDITOR.instances.content.getData().length > 1999) {
    //    alert("공지사항 내용은 2000자를 넘을 수 없습니다.\n 현재 글자수 : " + CKEDITOR.instances.content.getData().length);
    //    return false;
    //}

    //제목에 '가 있을 경우 `로 치환
    $("#title").val($("#title").val().replace(/'/gi, "`"));

    //$.ajax({
    //    type: "POST",
    //    url: "/Admin/NoticeModify",
    //    dataType: "json",
    //    data: formData,
    //    async: false,
    //    contentType: false,
    //    processData: false,
    //    success: function (result) {

    //        location.href = "/Admin/Notice";

    //        //if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
    //        //    location.href = "/Admin/Notice";
    //        //    //_fnAlertMsg("저장이 완료 되었습니다.");
    //        //}
    //        //else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
    //        //    console.log("[Fail : NoticeModify()]" + JSON.parse(result).Result[0]["trxMsg"]);
    //        //    _fnAlertMsg("저장을 실패 하였습니다.");
    //        //}
    //        //else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
    //        //    console.log("[Error : NoticeModify()]" + JSON.parse(result).Result[0]["trxMsg"]);
    //        //    _fnAlertMsg("관리자에게 문의하세요.");
    //        //}            

    //    }, error: function (xhr) {
    //        console.log("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
    //        console.log(xhr);
    //        return;
    //    }
    //});
    
    $("#ajax_form").submit();
    return false;
});

$(document).on("click", "#Notice_Btn_Modi", function (e) {
    e.preventDefault();
    if (check_msg('title', '제목', 'required') == false) return false;

    //$.ajax({
    //    type: "POST",
    //    url: "/Admin/NoticeModify",
    //    dataType: "json",
    //    data: formData,
    //    async: false,
    //    contentType: false,
    //    processData: false,
    //    success: function (result) {

    //        location.href = "/Admin/Notice";

    //        //if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
    //        //    location.href = "/Admin/Notice";
    //        //    //_fnAlertMsg("저장이 완료 되었습니다.");
    //        //}
    //        //else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
    //        //    console.log("[Fail : NoticeModify()]" + JSON.parse(result).Result[0]["trxMsg"]);
    //        //    _fnAlertMsg("저장을 실패 하였습니다.");
    //        //}
    //        //else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
    //        //    console.log("[Error : NoticeModify()]" + JSON.parse(result).Result[0]["trxMsg"]);
    //        //    _fnAlertMsg("관리자에게 문의하세요.");
    //        //}            

    //    }, error: function (xhr) {
    //        console.log("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
    //        console.log(xhr);
    //        return;
    //    }
    //});

    $("#ajax_form").submit();
    return false;
});

function fnInputForm() {
    var notice_id = $("notice_id").val();
    var title = $("title").val();
    var notice_yn = $(":input:radio[name=notice_yn]:checked").val();
    var content = $("content").val();
}

/* check_msg 유효성검사 */
// 추가
// 기본형 if(check_msg('id','msg','required') == false) return false;
function check_msg(element_id, msg, patton) {
    var array_is = /[,]/;
    var val_is;
    var element_id1 = false;
    var element_id2 = false;

    if (array_is.test(element_id) == true) {
        element = element_id.split(",");
        if (element[0]) element_id = element[0];
        if (element[1]) element_id1 = element[1];
        if (element[2]) element_id2 = element[2];
    }

    if ($('#' + element_id).val() == '') val_is = false;
    else val_is = true;

    //var re_id = /^[a-z0-9_-]{3,16}$/;												// 아이디 검사식
    var re_pw = /^[a-z0-9_-]{4,18}$/;												// 비밀번호 검사식
    var re_mail = /^([\w\.-]+)@([a-z\d\.-]+)\.([a-z\.]{2,6})$/;						// 이메일 검사식
    var re_url = /^(https?:\/\/)?([a-z\d\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/;	// URL 검사식
    var re_tel = /^[0-9]{8,11}$/;													// 전화번호 검사식
    var re_jumin = /^\d{6}[1234]\d{6}$/;											// 주민번호
    var re_num = /^[0-9]{1,}/;														// 숫자만 alphabet
    var re_alpha = /^[a-z_-]{1,}$/;													// 영문만 alphabet

    if (patton != undefined) {
        var patton_arr = patton.split(":");
        for (i = 0; i < patton_arr.length; i++) {

            if (patton_arr[i] == 'required') {
                if (val_is == false) {
                    alert(msg + ' 항목을 입력해 주세요.');
                    //alert(msg); 
                    $('#' + element_id).focus();
                    return false;
                }
            }


            if (patton_arr[i] == 'password' && val_is == true) {
                var pw_error = false;
                var error_msg = '';
                if ($('#password').val().length < 4 || $('#password').val().length > 26) {
                    error_msg = '패스워드가 4자 이상 26자 이하 이어야 합니다.';
                    pw_error = true;

                }
                //                else if($('#password').val() != $('#re_password').val()){
                //					error_msg = "패스워드가 일치하지 않습니다.\n다시 확인해서 입력해 주세요.";
                //					pw_error = true;
                //				}

                if (pw_error == true) {
                    alert(error_msg);
                    $('#password').val('');
                    //$('#passwd_re').val('');
                    $('#password').focus();
                    return false;
                }
            }

            if (patton_arr[i] == 'email') {
                if (element_id1) {
                    var $email = $('#' + element_id);
                    var $email1 = $('#' + element_id1);
                    if ($email.val() != '') {
                        var $email_val = $email.val() + '@' + $email1.val();

                        if (re_mail.test($email_val) != true) {
                            alert('이메일 형식이 틀렸습니다. 다시 입력해 주세요.');

                            $email.val('');
                            $email1.val('');
                            $email.focus();

                            return false;
                        }
                    }
                } else {
                    var $email = $('#' + element_id);

                    if (re_mail.test($email.val()) != true) {
                        alert('이메일 형식이 틀렸습니다. 다시 입력해 주세요.');

                        $email.val('');
                        $email.focus();

                        return false;
                    }
                }

            }

            if (patton_arr[i] == 'select') {
                var $selects = $('select[name=' + element_id + ']');
                if ($selects.val() == '') {
                    alert(msg + ' 항목을 입력해 주세요.');
                    $selects[0].focus();
                    return false;
                }
            }

            if (patton_arr[i] == 'radio') {
                var $radios = $('input:radio[name=' + element_id + ']');
                if (!$radios.is(":checked")) {
                    alert(msg + ' 항목을 입력해 주세요.');
                    $radios[0].focus();
                    return false;
                }
            }

            if (patton_arr[i] == 'checkbox') {
                var $checkClass = $('.' + element_id);
                if (!$checkClass.is(":checked")) {
                    if (msg == '') alert('선택된 항목이 없습니다.');
                    else alert(msg);

                    $checkClass[0].focus();

                    return false;
                }

            }


            if (patton_arr[i] == 'agree1') {
                if (!($("#agree1").is(":checked"))) {
                    alert(msg);
                    $("#agree1").focus();
                    return false;
                }
            }

            if (patton_arr[i] == 'agree3') {
                if (!($("#agree3").is(":checked"))) {
                    alert(msg);
                    $("#agree3").focus();
                    return false;
                }
            }

            if (patton_arr[i] == 'alphabet' && val_is == true) {
                if (re_alpha.test($('#' + element_id).val()) != true) {
                    alert('영문과 하이폰만 입력 가능합니다.');
                    $('#' + element_id).focus();
                    return false;
                }
            }

            if (patton_arr[i] == 'number' && val_is == true) {
                if (re_num.test($('#' + element_id).val()) != true) {
                    alert('숫자만 입력 하시기 바랍니다.');
                    $('#' + element_id).focus();
                    $('#' + element_id).val('');
                    return false;
                }
            }

            if (patton_arr[i] == 'homepage' && val_is == true) {
                if (re_url.test($('#' + element_id).val()) != true) {
                    alert('홈페이지 주소를 바르게 입력해 주세요.');

                    $('#' + element_id).focus();
                    return false;
                }
            }

            if (patton_arr[i] == 'jumin' && val_is == true) {
                $jumin = $('#register_no1').val() + $('#register_no2').val();

                if (re_jumin.test($jumin) != true) {

                    alert('주민번호 형식이 틀렸습니다. 다시 입력해 주세요.');
                    $('#register_no1').val('');
                    $('#register_no2').val('');
                    $('#register_no1').focus();

                    return false;
                }

            }

        }
    }
}