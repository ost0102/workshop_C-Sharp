

var objJsonData = new Object();

$(function () {
    


    //#region 조회 영역



    
    var TITLE_AREA = $("#TITLE_AREA").dxTextBox({
        value: "",
        width: 800,
    }).dxTextBox('instance');

    var INS_PW = $("#INS_PW").dxTextBox({
        value: "",
        width: 200,
        visible: false,
    }).dxTextBox('instance');


    var SCREAT_YN = $("#SCREAT_YN").dxTextBox({
        value: "",
        width: 200,
        visible:false,
    }).dxTextBox('instance');



    //#endregion


    //#region 그리드 영역


    //#region 마크업 그리기
    var markup = ``;
    //#endregion

    ////에디터
    var HTMLEDITER = $("#editTest").dxHtmlEditor({
        height: 784,
        width:1028,
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

    initBtnSetting();
    fnSearchDtlInfo(getParameter("MNGT_NO")); // 최초 조회
    

    //저장
    $("#commu_save_ad").on('click', function (e) {

        console.log(HTMLEDITER.option('value'));

        fnSaveCommuAdmin(HTMLEDITER.option('value'));
    });

    //목록으로 돌아가기
    $("#commu_move_list").on('click', function (e) {
        var result = DevExpress.ui.dialog.confirm("<i>작성된 내용은 저장되지 않습니다.</br>목록으로 돌아가시겠습니까?</i>", "");
        result.done(function (dialogResult) {
            window.location = "/Admin/Community/";
        });

    });

    //#endregion


    //#region 함수 영역

    //게시글 저장
    function fnSaveCommuAdmin(markup) {
        var saveObj = new Object();

        saveObj.CONTENT = escape(markup);
        saveObj.TOPIC = TITLE_AREA.option('value');
        saveObj.USER = $("#Session_AD_CUST_NAME").val();
        saveObj.INS_PW = INS_PW.option('value');
        saveObj.USR_TYPE = "M";
        saveObj.MNGT_NO = _fnSequenceMngt("COMMU");
        saveObj.SCREAT_YN = SCREAT_YN.option('value');
        saveObj.HEAD_ID = _fnGetParam("MNGT_NO");
        saveObj.PAGE_TYPE = "BACK";
        saveObj.USR_ID = $("#Session_AD_EMAIL").val();

        $.ajax({
            type: "POST",
            url: "/Community/fnSaveAdminCommu",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(saveObj) },
            success: function (result) {
                
                //#region 메인 리스트 바인딩
                var result = DevExpress.ui.dialog.alert("저장이 완료되었습니다.", '');
                result.done(function () {
                    window.location = "/Admin/Community";
                });
                //#endregion

            },
            error: function (xhr, status, error) {
                console.log("왓더퍽");
                console.log(error);
            }
        });

    }

    function initBtnSetting() {
        var flag = _fnGetParam("FLAG");
        if (flag == "I") { // 신규
            $("#commu_save_ad").text("저장");
            $("#commu_del_ad").hide(); // 삭제 숨기기
        }
        else if (flag == "U") { // 수정
            $("#commu_save_ad").text("수정");
            $("#commu_del_ad").show(); // 삭제 숨기기
        }
        $(".ad_btn_area").show();
    }

    /// 게시글 조회 및 바인딩
    function fnSearchDtlInfo(mngt_no) {
        var DtlObj = new Object();

        DtlObj.MST_NO = mngt_no;

        $.ajax({
            type: "POST",
            url: "/Community/fnGetContentDtl",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(DtlObj) },
            success: function (result) {

                
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    var resultContent = JSON.parse(result).CONTENT;


                    //#region 플래그값 
                    INS_PW.option('value', resultContent[0]["INS_PW"]);

                    SCREAT_YN.option('value', resultContent[0]["SCREAT_YN"]);

                    //#endregion

                    //#region 제목 바인딩
                    var title = "";
                    
                    if (_fnGetParam("FLAG") == "I") {
                        title = "re: " + resultContent[0]["TOPIC"];
                        markup = unescape(resultContent[0]["ANS_CONTENT"]) + "</br><p>===========================답글=========================</p></br>";
                    }
                    else {
                        title = "re: " + resultContent[0]["TOPIC"];
                        markup = unescape(resultContent[0]["ANS_CONTENT"]) ;
                    }

                    TITLE_AREA.option('value', title);

                    HTMLEDITER.option('value', markup);

                    //#endregion
                    
                }

            },
            error: function (xhr, status, error) {
                console.log("메인 조회 에러,,.");
                console.log(error);
            }
        });


    }

    //#endregion




});