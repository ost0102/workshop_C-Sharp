

var objJsonData = new Object();
var item_cd = "";
var item_mngtno = "";
var tab_nm = "CONF";
var path = "";
var SearchObj = new Object();

$(function () {
    //#region ☆☆☆☆☆☆☆ DevExtreme 바인딩 영역 ☆☆☆☆☆☆☆
    //#region ※※조회영역※※
    DevExpress.ui.dxDateBox.defaultOptions({
        options: {
            showClearButton: false,
            type: "date",
            displayFormat: "yyyy-MM-dd"
        }
    });


    var STRT_YMD = $("#STRT_YMD").dxDateBox({
        value: "",
        width: 200,
        value: new Date(Date.parse(new Date()) - 6 * 1000 * 60 * 60 * 24),
    }).dxDateBox('instance');

    var END_YMD = $("#END_YMD").dxDateBox({
        value: "",
        width: 200,
        value: new Date(Date.parse(new Date()) + 6 * 1000 * 60 * 60 * 24),
    }).dxDateBox('instance');


    var MNGT_NO = $("#MNGT_NO").dxTextBox({
        value: "",
        visible : false
    }).dxTextBox('instance');

    var MNGT_SEQ = $("#MNGT_SEQ").dxTextBox({
        value: "",
        visible: false
    }).dxTextBox('instance');


    var STATUS = $("#STATUS").dxSelectBox({
        width: 150,
        value : "A",
        displayExpr: "NAME",
        valueExpr: "CODE",
        dataSource: [{ CODE: "A", NAME: "전체" }, { CODE: "N", NAME: "미답변" }, { CODE: "Y", NAME: "답변" }],
    }).dxSelectBox('instance');

    var CUST_NM = $("#CUST_NM").dxTextBox({
        value: "",
    }).dxTextBox('instance');


    var CUST_H_NM = $("#CUST_H_NM").dxTextBox({
        value: "",
    }).dxTextBox('instance');

    var ITEM_NM = $("#ITEM_NM").dxTextBox({
        value: "",
    }).dxTextBox('instance');


    var btnSearch = $("#btnSearch").dxButton({
        text: "검색",
        onClick: function () {
            SearchData();
        }
    }).dxButton('instance');


    var btnSave = $("#btnSave").dxButton({
        text: "저장",
        onClick: function () {
            saveData();
        }
    }).dxButton('instance');
    var btnHistory = $("#btnHistory").dxButton({
        text: "지난대화 보기",
        visible : false,
        onClick: function () {
            talkBox();
            $('.chat_box').show();
            $('.chat_box').css('position', 'fixed');
        }
    }).dxButton('instance');

    function talkBox() {
        var objJsonData = new Object();
        objJsonData.QUOT_NO = MNGT_NO.option('value');
        $.ajax({
            type: "POST",
            url: "/Estimate/SearchQuotInquire",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                TalkData(result);
            },
            error: function (error) {
                alert("에러");
            }
        });
    };
    changeTalkInput(true);

    function TalkData(vJsonData) {

        var vHtml = "";
        var vResult = vJsonData;

        $("#talk_box").empty();

        vHtml += "                                                    <div class='chat ch2'>";
        vHtml += "                                                        <div class='icon'><i class='fa-solid fa-user'></i></div>";
        vHtml += "                                                        <div class='talk_area'>";
        vHtml += "                                                            <div class='textbox'>문의사항 남겨주세요.</div>";
        vHtml += "                                                        </div>";
        vHtml += "                                                    </div>";
        $.each(vResult, function (i) {
            if (_fnToNull(vResult[i]["USER_TYPE"]) == "U") {
                vHtml += "                                                    <div class='chat ch1'>";
            }
            else {
                vHtml += "                                                    <div class='chat ch2'>";
            }
            /*vHtml += "                                                    <div class='chat ch1'>";*/
            vHtml += "                                                        <div class='icon'><i class='fa-solid fa-user'></i></div>";
            vHtml += "                                                        <div class='talk_area'>";
            vHtml += "                                                            <div class='textbox'>" + _fnToNull(vResult[i]['INQ_CONTENT']) + "</div>";
            vHtml += "                                                            <p class='talk_date'>" + _fnDateFormating(_fnToNull(vResult[i]['INQ_YMD'])) + "</p>";
            vHtml += "                                                        </div>";
            vHtml += "                                                    </div>";
            //if (_fnToNull(vResult[i]['ANSWER']) != "") {
            //    /*vHtml += "                                                    <div class='chat ch2'>";*/
            //    vHtml += "                                                        <div class='icon'><i class='fa-solid fa-user'></i></div>";
            //    vHtml += "                                                        <div class='talk_area'>";
            //    vHtml += "                                                            <div class='textbox'>" + _fnToNull(vResult[i]['ANSWER']) + "</div>";
            //    vHtml += "                                                            <p class='talk_date'>" + _fnToNull(_fnDateFormating(vResult[i]['ANS_YMD'])) + "</p>";
            //    vHtml += "                                                        </div>";
            //    vHtml += "                                                    </div>";
            //}
        });

        $("#talk_box").append(vHtml);
        $("#InquiryText").val('');
    }
    //#endregion 

    SearchData();

    //#region  ※※메인 그리드※※
    var gridFAQ = $("#gridFAQ").dxDataGrid({
        hoverStateEnabled: true,
        allowColumnResizing: true,
        showRowLines: true,
        showBorders: true,
        width: 830,
        selection: {
            mode: 'single',
        },
        paging: {
            enabled: false,

        },
        editing: {
            mode: 'batch',
            allowAdding: false,
            allowUpdating: false,
            allowDeleting: false,
            texts: {
                deleteRow: "삭제"
            }
        },
        scrolling: {
            mode: 'virtual',
        },
        columns: [

            {
                dataField: 'MNGT_SEQ',
                width: 180,
                visible : false
            },
            {
                dataField: 'REQ_NO',
                width: 180,
                visible: false
            },
            {
                dataField: '구분',
                width: 100,
                alignment: "center",
                cellTemplate: function (container, options) {
                    if (_fnToNull(options.data.INQ_TYPE) == "A") {
                        $("<div/>").addClass('success')
                            .text("견적문의")
                            .appendTo(container);
                    } else {
                        $("<div/>").addClass('wait')
                            .text("예약문의")
                            .appendTo(container);
                    }
                }
            },
            {
                dataField: 'AREA',
                caption: '지역',
                width: 100,
                alignment: "center",
            },
            {
                dataField: 'ITEM_NM',
                width: 150,
                /*alignment: "center",*/
                caption: '상품명',
                cellTemplate: function (cellElement, cellInfo) {
                    $('<a/>').addClass('dx-link')
                        .text(cellInfo.value)
                        .on('dxclick', function () {
                            window.open("/Admin/infoPop?itemCD=" + cellInfo.key.ITEM_CD, '_blank', 'width=600,height=630 scrollbars=no');
                        }).appendTo(cellElement);
                }
            },
            {
                dataField: 'STRT_YMD',
                caption: '시작날짜',
                dataType: "string",
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    if (s.length != 8) return s;

                    var y = s.substring(0, 4) // year
                    var m = s.substring(4, 6) // month
                    var d = s.substring(6, 8) // day

                    return [y, m, d].join('-');
                },
                width: 100,
                alignment: "center"
            },
            {
                dataField: 'END_YMD',
                caption: '종료날짜',
                dataType: "string",
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    if (s.length != 8) return s;

                    var y = s.substring(0, 4) // year
                    var m = s.substring(4, 6) // month
                    var d = s.substring(6, 8) // day

                    return [y, m, d].join('-');
                },
                width: 100,
                alignment: "center"
            },
            {
                dataField: 'MIN_PRC',
                caption: '예산최소금액',
                dataType: 'number',
                width: 100,
                format: "fixedpoint"
            },
            {
                dataField: 'MAX_PRC',
                caption: '예산최대금액',
                dataType: 'number',
                width: 100,
                format: "fixedpoint"
            },
            {
                dataField: 'HEAD_CNT',
                dataType: 'number',
                width: 100,
                caption: '예상인원'
            },
            {
                dataField: 'INQ_USR',
                width: 100,
                alignment: "center",
                caption: '요청자명',
            },
            {
                dataField: 'REQ_EMAIL',
                width: 150,
                alignment: "center",
                caption: '요청자 이메일',
            },
            {
                dataField: 'REQ_TEL',
                width: 150,
                alignment: "center",
                caption: '요청자 연락처',
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    if (s.length != 11) return s;

                    var y = s.substring(0, 3) // year
                    var m = s.substring(3, 7) // month
                    var d = s.substring(7, 11) // day

                    return [y, m, d].join('-');
                }
            },
            {
                dataField: 'SVC_NM',
                width: 100,
                caption: '부가서비스'
            },
            {
                dataField: 'RMK',
                width: 100,
                caption: '비고',
            },
          
            {
                dataField: 'STATUS',
                width: 150,
                alignment: "center",
                caption: '상태값',
                visible : false,
            },
            {
                dataField: 'MNGT_NO',
                caption: '상품관리번호',
                width: 200,
            },
            {
                dataField: 'ITEM_CD',
                width: 150,
                alignment: "center",
                caption: '상품코드',
                visible:false,
            },
        ],
        onSelectionChanged(selectedItems) {
            const data = selectedItems.selectedRowsData[0];
            if (_fnToNull(data) != "") {
                //기존 조회 로직
                //searchContent(data.MNGT_NO, data.MNGT_SEQ)

                //변경로직
                searchDtlTalkList(data.MNGT_NO, data.MNGT_SEQ);

                if (data.STATUS == "Y") {
                    changeTalkInput(false);
                }
                else {
                    changeTalkInput(false);
                }

            }
        },
        onRowRemoving: function (e) {
            e.cancel = true;
            e.data.INSFLAG = 'D';
        },
    }).dxDataGrid('instance');
    //#endregion

    //#region ※※DTL※※
    var gridtl = $("#gridFAQDetail").dxDataGrid({
        hoverStateEnabled: true,
        allowColumnResizing: true,
        showBorders: true,
        showRowLines: true,
        width: 830,
        height: 200,
        selection: {
            mode: 'single',
        },
        paging: {
            enabled: false,

        },
        editing: {
            mode: 'batch',
            allowAdding: false,
            allowUpdating: false,
            allowDeleting: false,
            texts: {
                deleteRow: "삭제"
            }
        },
        scrolling: {
            mode: 'virtual',
        },
        columns: [

            {
                dataField: 'INSFLAG',
                visible: false,
            },
            {
                dataField: 'REQ_NO',
                caption: '상품관리번호',
                visible: false,
            },
            {
                dataField: 'MNGT_NO',
                caption: '관리번호',
                visible: false,
            },
            {
                dataField: 'MNGT_SEQ',
                caption: '관리순번',
                visible: false,
            },
            {
                dataField: 'ITEM_TYPE',
                caption: '상품종류',
                allowEditing: false,
                customizeText: function (cellInfo) {
                    var data = _fnToNull(cellInfo.value);
                    var s = "";
                    if (data == "CONF") {
                        s = "세미나";
                    }
                    if (data == "MEAL") {
                        s = "식사";
                    }
                    if (data == "ROOM") {
                        s = "숙박";
                    }
                    if (data == "SVC") {
                        s = "부가서비스";
                    }
                    return s;
                }
            },
            {
                dataField: 'ITEM_NM',
                caption: '선택상품',
                allowEditing: false,
            },
            {
                dataField: 'ITEM_CNT',
                caption: '수량',
                width: 80,
                allowEditing: false,
                customizeText: function (cellInfo) {
                    var date = _fnToNull(cellInfo.value);
                    if (date == "0") {
                        date = "";
                    }
                    else {
                        date = date.toString();
                    }

                    return date;
                },
            },
            {
                dataField: 'PRC',
                caption: '금액',
                dataType: 'number',
                customizeText: function (cellInfo) {
                    var date = _fnToNull(cellInfo.value);
                    if (date == "0") {
                        date = "";
                    }
                    else {
                        date = date.toString();
                    }

                    return date;
                },

            },

        ],
        //onSelectionChanged(selectedItems) {
        //    const data = selectedItems.selectedRowsData[0];
        //    if (_fnToNull(data) != "") {
        //        //기존 조회 로직
        //        //searchContent(data.MNGT_NO, data.MNGT_SEQ)

        //        //변경로직
        //        searchDtlTalkList(data.MNGT_NO, data.MNGT_SEQ);

        //        if (data.STATUS == "Y") {
        //            changeTalkInput(true);
        //        }
        //        else {
        //            changeTalkInput(false);
        //        }

        //    }
        //},
        onRowRemoving: function (e) {
            e.cancel = true;
            e.data.INSFLAG = 'D';
        },
    }).dxDataGrid('instance');


    var DTL_CONTENT = $("#DetailContents").dxTextArea({
        readOnly : true
    }).dxTextArea('instance');
    var DTL_WRITER = $("#DetailWriter").dxTextArea({
    }).dxTextArea('instance');

    //#endregion


    //#region ※※함수 영역※※
    //전체 조회 함수
    function SearchData() {
        _mSearchObj = new Object();
        _mSearchObj.STRT_YMD = _fnToNull(STRT_YMD.option('text').replace(/-/gi, ""));
        _mSearchObj.END_YMD = _fnToNull(END_YMD.option('text').replace(/-/gi, ""));
        _mSearchObj.STATUS = STATUS.option('value');


        $.ajax({
            type: "POST",
            url: "/adFAQ/fnGetFAQList",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(_mSearchObj) },
            success: function (result) {
                var resultData = JSON.parse(result).Table1;
                //#region 리스트 바인딩
                gridFAQ.beginUpdate();
                gridFAQ.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridFAQ.option('dataSource', resultData);
                gridFAQ.endUpdate();
                //#endregion

                gridtl.beginUpdate();
                gridtl.saveEditData();
                gridtl.option('dataSource', []);
                gridtl.endUpdate();
                $("#talk_box").empty();
                changeTalkInput(true);
                //btnHistory.option('visible', false); 없앤 버튼

            },
            error: function (xhr,status,error) {
                console.log("메인 조회 에러,,.");
                console.log(error);
            }
        });

    }


    //#region 기존 로직
    
    function searchContent(mngt_no,mngt_seq) {
        _mSearchObj = new Object();

        _mSearchObj.MNGT_NO = _fnToNull(mngt_no);
        _mSearchObj.MNGT_SEQ = _fnToNull(mngt_seq);


        $.ajax({
            type: "POST",
            url: "/adFAQ/fnGetFAQDetail",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(_mSearchObj) },
            success: function (result) {
                var resultData = JSON.parse(result).Table1;
                DTL_CONTENT.option('value', resultData[0].INQ_CONTENT);
                DTL_WRITER.option('value', resultData[0].ANSWER);
                MNGT_NO.option('value', resultData[0].MNGT_NO);
                MNGT_SEQ.option('value', resultData[0].MNGT_SEQ);
                if (parseInt(resultData[0].MNGT_SEQ) > 1) {
                    btnHistory.option('visible', true);
                } else {
                    btnHistory.option('visible', false);
                }
            },
            error: function (xhr, status, error) {
                console.log("메인 조회 에러,,.");
                console.log(error);
            }
        });

    }


    function saveData() {
        if (_fnToNull(DTL_WRITER.option('value')) == "") {
            DevExpress.ui.dialog.alert("<i>답변을 입력해주세요.</i>");
            return false;
        }
        _mSearchObj = new Object();
        _mSearchObj.MNGT_SEQ = _fnToNull(MNGT_SEQ.option('value'));
        _mSearchObj.MNGT_NO = _fnToNull(MNGT_NO.option('value'));
        _mSearchObj.ANSWER = _fnToNull(DTL_WRITER.option('value'));
        _mSearchObj.INS_USR = "ADMIN";


        $.ajax({
            type: "POST",
            url: "/adFAQ/fnUpdateFAQ",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(_mSearchObj) },
            success: function (result) {
                DevExpress.ui.dialog.alert("<i>답변을 저장하였습니다</i>", "");
                SearchData();

                DTL_CONTENT.option('value', '');
                DTL_WRITER.option('value', '');
            },
            error: function (xhr, status, error) {
                console.log("메인 조회 에러,,.");
                console.log(error);
            }
        });

    }
    //#endregion

    //#region 변경된 로직



    function searchDtlTalkList(mngt_no, seq) {
        _mSearchObj = new Object();

        _mSearchObj.MNGT_NO = _fnToNull(mngt_no); //관리번호 (견적번호 or 예약번호)
        _mSearchObj.MNGT_SEQ = _fnToNull(seq); // SEQ 해당 관리번호의 SEQ

        $.ajax({
            type: "POST",
            url: "/AdFAQ/fnGetFAQTalkList",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(_mSearchObj) },
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    var resultData = JSON.parse(result).TalkList;
                    TalkData(resultData);

                    var detailData = JSON.parse(result).DetailData;

                    gridtl.beginUpdate();
                    gridtl.saveEditData();
                    gridtl.option('dataSource', detailData);
                    gridtl.endUpdate();


                    //#region 값 바인딩
                    MNGT_NO.option('value', mngt_no);
                    MNGT_SEQ.option('value', seq);
                    //#endregion
                }
            },
            error: function (xhr, status, error) {
                console.log("메인 조회 에러,,.");
                console.log(error);
            }
        });
    }

    function UpdateAnswer(Answer) {

        if (Answer == "") {
            DevExpress.ui.dialog.alert("답변을 입력해 주세요", "");
         
        }
        else {
            //#region 파라미터 생성
            _mSearchObj = new Object();
            _mSearchObj.MNGT_NO = _fnToNull(MNGT_NO.option('value')); // 관리번호(견적번호 or 예약번호)
            _mSearchObj.MNGT_SEQ = _fnToNull(MNGT_SEQ.option('value')); // SEQ 해당 관리번호의 SEQ
            _mSearchObj.ANSWER = Answer; // 관리자 답변값
            _mSearchObj.INS_USR = "ADMIN";
            _mSearchObj.USER_TYPE = "A";
            //#endregion

            $.ajax({
                type: "POST",
                url: "/AdFAQ/fnUpdateAnswer",
                async: true,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(_mSearchObj) },
                success: function (result) {
                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                        var resultData = JSON.parse(result).Table1;
                        TalkData(resultData);

                        changeTalkInput(false);
                    }
                    else {
                        DevExpress.ui.dialog.alert("[조회 실패] 관리자에게 문의하세요.", "");
                    }
                    
                },
                error: function (xhr, status, error) {
                    console.log("디테일 조회 에러,,.");
                    console.log(error);
                }
            });

        }
        
    }

    function changeTalkInput(status) {
        var boolean = status;

        $("#InquiryText").attr("disabled", boolean);
        $("#btn_talk").attr("disabled", boolean);
    }
    //#endregion

    //#endregion


    $(document).on('click', "#btn_talk", function () {
        var answer = _fnToNull($("#InquiryText").val()); //답변영역

        UpdateAnswer(answer);
    });

    $(document).on('click', '#talk_close', function () {
        $('.chat_box').hide();
    });

});




