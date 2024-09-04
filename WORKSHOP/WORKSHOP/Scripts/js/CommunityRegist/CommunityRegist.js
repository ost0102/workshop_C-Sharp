

var Name_Ck = _fnToNull($("#Session_CUST_NAME").val());
var Email_Ck = _fnToNull($("#Session_EMAIL").val());

$(function () {

   
    $('.company_info_area').hide();
    $("#Comm_Name").val(Name_Ck);

    if (Email_Ck != "") {
        $("#Comm_Name").hide();
    } else {
        $("#Comm_Name").show();
    }
    

    //#region 조회 영역


    //#endregion


    //#region 그리드 영역


    //#region 마크업 그리기
    var markup = ``;
    //#endregion

    //에디터 //예시 값 불러오기 var content=  encode(HTMLEDITER.option('value'))
    var HTMLEDITER = $("#html_editor").dxHtmlEditor({
        height: 490,
        value: markup,
        imageUpload: {
            tabs: ['file', 'url'],
            fileUploadMode: 'base64',
        },
        toolbar: {
            items: [
                'undo', 'redo', 'separator',
                {
                    name: 'size',
                    acceptedValues: ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'],
                    options: { inputAttr: { 'aria-label': 'Font size' } },
                },
                {
                    name: 'font',
                    acceptedValues: ['Arial', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 'Verdana'],
                    options: { inputAttr: { 'aria-label': 'Font family' } },
                },
                'separator', 'bold', 'italic', 'strike', 'underline', 'separator',
                'alignLeft', 'alignCenter', 'alignRight', 'alignJustify', 'separator',
                'orderedList', 'bulletList', 'separator',
                {
                    name: 'header',
                    acceptedValues: [false, 1, 2, 3, 4, 5],
                    options: { inputAttr: { 'aria-label': 'Header' } },
                }, 'separator',
                'color', 'background', 'separator',
                'link', 'image', 'separator',
                'clear', 'codeBlock', 'blockquote', 'separator',
                'insertTable', 'deleteTable',
                'insertRowAbove', 'insertRowBelow', 'deleteRow',
                'insertColumnLeft', 'insertColumnRight', 'deleteColumn',
            ],
        },
        mediaResizing: {
            enabled: true,
        },
    }).dxHtmlEditor('instance');






    //#endregion


    //#region 이벤트 영역
    $(document).on('click', '#Comm_Save', function () {
        if (_fnToNull($("#Comm_Name").val()) == "") {
            _fnAlertMsg("닉네임을 입력해주세요.");
            return false;
        }
        if (_fnToNull($("#Comm_Title").val()) == "") {
            _fnAlertMsg("제목을 입력해주세요.");
            return false;
        }
        if (_fnToNull(HTMLEDITER.option('value')) == "") {
            _fnAlertMsg("내용을 입력해주세요.");
            return false;
        }

        if ($("#use").is(':checked')) {
            if (Name_Ck == "") {
            if (_fnToNull($("#Regi_pwd").val()) == "") {
                _fnAlertMsg("비밀번호를 입력해주세요.");
                return false;
                }
            }
        }
        

        var objJsonData = new Object();
        objJsonData.PAGE_TYPE = "FRONT";
        if (_fnToNull(_fnGetParam("MNGT_NO")) == "") {//인서트
            objJsonData.MNGT_NO = _fnSequenceMngt("COMMU");
        }
        else {// 업데이트
            objJsonData.MNGT_NO = _fnToNull(_fnGetParam("MNGT_NO"));
        }
        objJsonData.HEAD_ID = "0";
        if ($('input:radio[id=use]').is(":checked")) {
            objJsonData.SCREAT_YN = "Y"
            objJsonData.INS_PW = _fnToNull($("#Regi_pwd").val());
        } else {
            objJsonData.SCREAT_YN = "N"
            objJsonData.INS_PW = "N"
        }
        objJsonData.TOPIC = _fnToNull($("#Comm_Title").val());
        objJsonData.CONTENT = _fnToNull(escape(HTMLEDITER.option('value')));
        if (Name_Ck == "") {
            objJsonData.USR_TYPE = "N";
        }
        else {
            objJsonData.USR_TYPE = "A";
        }
        
        objJsonData.USR_ID = _fnToNull($("#Session_EMAIL").val());
        objJsonData.USER = _fnToNull($("#Comm_Name").val());


        $.ajax({
            type: "POST",
            url: "/Community/fnSaveAdminCommu",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (JSON.parse(result).rec_cd== "Y") {
                    window.location ="/CommunityList/Index" ;
                    
                } else if (JSON.parse(result).rec_cd == "E") {


                }
            }, error: function (error) {
                console.log(error);
            }

        }) 
    });

 
    //#endregion


    //#region 함수 영역


    //#endregion


    $('input[type = radio]').click(function () {               
        
        if ($(this).val() == 'Y') {
            if (Email_Ck != "") {
                $('.del_pw_box').hide();
            }
            else {
                // .del_pw_box를 표시
                $('.del_pw_box').show();
            }
        } else {
            // .del_pw_box를 숨김
            $('.del_pw_box').hide();
        }
    })



    $(document).on('click', '#ClosePw', function () {
        $("#Regi_pwd").val("");
        $('.del_pw_box').hide();
    })


    $(document).on('click', '#DelComment', function () {
        if (_fnToNull($("#Regi_pwd").val()) == "") {
            _fnAlertMsg("비밀번호를 입력해주세요.");
            return false;
        } else {
            $('.del_pw_box').hide();
        }

    })


    // use 라디오 버튼 클릭 이벤트 핸들러
    $(document).on('click', '#use', function () {
        $('#use').attr('checked', 'checked');
        $('#notuse').removeAttr('checked');
    });

    // notuse 라디오 버튼 클릭 이벤트 핸들러
    $(document).on('click', '#notuse', function () {
        $('#notuse').attr('checked', 'checked');
        $('#use').removeAttr('checked');
    });


    function fnGetData() {
        var objJsonData = new Object();
        objJsonData.MST_NO = _fnGetParam("MNGT_NO");

        $.ajax({
            type: "POST",
            url: "/Community/fnCommModify",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (result.Result[0]["trxCode"] == "Y") {
                    fnCommDetail(result);
                } else if (result.Result[0]["trxCode"] == "N") {
                }
            }, error: function (error) {
                console.log(error);
            }
        })

    }

    function fnCommDetail(vJsonData) {
        var vHtml = "";
        var InsUsr = _fnToNull(vJsonData.CONTENT[0].INS_USR);
        var Contents = _fnToNull(unescape(vJsonData.CONTENT[0].CONTENT));
        var Topic = _fnToNull(vJsonData.CONTENT[0].TOPIC);
        var Secret = _fnToNull(vJsonData.CONTENT[0].SCREAT_YN);


        $("#Comm_Name").attr("disabled", true);
        $("#Comm_Name").val(InsUsr);
        $("#Comm_Title").val(Topic);
//        $("#html_editor").empty();
        HTMLEDITER.option('value', Contents);
        if (Secret == "N") {
            $('#notuse').attr('checked', 'checked');
            $('#use').removeAttr('checked');
        } else {
            $('#use').attr('checked', 'checked');
            $('#notuse').removeAttr('checked');
        }


    }

 
    if (_fnToNull(_fnGetParam("MNGT_NO")) != "") {
        fnGetData();
    }
});


//$(document).on('click', 'input[type="radio"][name="secret"]', function () {
//    if ($(this).val() === 'Y') {
//        // .del_pw_box를 표시
//        $('.del_pw_box').show();
//    } else {
//        // .del_pw_box를 숨김
//        $('.del_pw_box').hide();
//    }
//});

