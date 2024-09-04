var objJsonData = new Object();
var tab_nm = "CONF";
$(function () {

    DevExpress.ui.dxDateBox.defaultOptions({
        options: {
            showClearButton: false,
            type: "date",
            displayFormat: "yyyy-MM-dd"
        }
    });

    //#region 조회조건 영역

    var STRT_YMD = $("#STRT_YMD").dxDateBox({
        value: "",
        width: 150,
        value: new Date()
    }).dxDateBox('instance');

    var END_YMD = $("#END_YMD").dxDateBox({
        value: "",
        width: 150,
        value: new Date()
    }).dxDateBox('instance');


    var REQ_NM = $("#REQ_NM").dxTextBox({
        value: "",
        width: 150
    }).dxTextBox('instance');


    var REQ_CUST_NM = $("#REQ_CUST_NM").dxTextBox({
        value: "",
        width: 200
    }).dxTextBox('instance');


    var ITEM_NM = $("#ITEM_NM").dxTextBox({
        value: "",
        width: 200
    }).dxTextBox('instance');

    var QUOT_TYPE = $("#QUOT_TYPE").dxSelectBox({
        dataSource: [{ CODE: "ALL", NAME: "전체" },{ CODE: "A", NAME: "간편견적" }, { CODE: "B", NAME: "상품견적" }],
        width: 100,
        value: "ALL",
        displayExpr: "NAME",
        valueExpr: "CODE",
    }).dxSelectBox('instance');

   

    var btnSearch = $("#btnSearch").dxButton({
        text: "검색",
        onClick: function () {
            SearchData();
        }
    }).dxButton('instance');

    //#endregion


    SearchData();

    var gridQuotation = $("#gridQuotation").dxDataGrid({
        hoverStateEnabled: true,
        showBorders: true,
        allowColumnResizing: true,
        showRowLines: true,
        height: 790,
        selection: {
            mode: 'single',
        },
        paging: {
            enabled: false,
        },
        columns: [
            {
                dataField: 'REQ_NO',
                caption: "관리번호",
                fixed: true,
                fixedPosition: "left",
                width:180,
            },
            {
                dataField: 'QUOT_TYPE',
                caption: '견적 구분',
                alignment: "center",
                width: 130,
                fixed: true,
                fixedPosition: "left",
                cellTemplate: function (container, options) {
                    if (_fnToNull(options.data.QUOT_TYPE) == "A") {
                        $("<div/>").addClass('easy_q')
                            .text("간편 견적")
                            .appendTo(container);
                    } else {
                        $("<div/>").addClass('online_q')
                            .text("상품 견적")
                            .appendTo(container);
                    }
                }
            },
            {
                dataField: 'QUOT_SEQ',
                caption: '견적 건수',
                width: 80,
                fixed: true,
                fixedPosition: "left",
                cellTemplate: function (cellElement, cellInfo) {
                    $('<a/>').addClass('dx-link')
                        .text(cellInfo.value)
                        .on('dxclick', function () {
                            location.href = "/Quotation/quotRegist?quotNo=" + "|" +cellInfo.data.REQ_NO + "&&quotType=MANAGE";
                        })
                        .appendTo(cellElement);
                }
            },
            {
                dataField: '',
                caption: '견적 등록',
                width: 120,
                alignment: "center",
                fixed: true,
                fixedPosition: "left",
                cellTemplate: function (container, options) {
                    $("<div />").dxButton({
                        text: '견적추가',
                        onClick: function (e) {
                            var send_mngt_no = options.data.REQ_NO;
                            _fnInsertMngQuot(send_mngt_no);


                            //if (options.data.QUOT_TYPE == "A") {
                            //    location.href = "/Quotation/quotRegist?quotNo=" + options.data.REQ_NO + "&&quotType=EASY_QUOT";
                            //}
                            //else {
                            //    location.href = "/Quotation/quotRegist?quotNo=" + options.data.REQ_NO + "&&quotType=ONLINE_QUOT";
                            //}

                        }
                    }).appendTo(container);
                }
            },
            {
                dataField: 'AREA',
                caption: '지역',
                width: 100,
            },
            {
                dataField: 'ITEM_CD',
                caption: '상품코드',
                width: 100,
                visible:false,
            },
            {
                dataField: 'ITEM_NM',
                width: 170,
                caption: '상품명',
                cellTemplate: function (cellElement, cellInfo) {
                    $('<a/>').addClass('dx-link')
                        .text(cellInfo.value)
                        .on('dxclick', function () {
                            window.open("/Admin/infoPop?itemCD=" + cellInfo.key.ITEM_CD, '_blank', 'width=600,height=630, scrollbars=no');
                        }).appendTo(cellElement);
                }
            },
            {
                dataField: 'STRT_YMD',
                caption: '시작날짜',
                width: 100,
                alignment: "center",
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    if (s.length != 8) return s;

                    var y = s.substring(0, 4) // year
                    var m = s.substring(4, 6) // month
                    var d = s.substring(6, 8) // day

                    return [y, m, d].join('-');
                }
            },
            {
                dataField: 'END_YMD',
                caption: '종료날짜',
                width: 100,
                alignment: "center",
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    if (s.length != 8) return s;

                    var y = s.substring(0, 4) // year
                    var m = s.substring(4, 6) // month
                    var d = s.substring(6, 8) // day

                    return [y, m, d].join('-');
                }
            },
            {
                dataField: 'REQ_CUST_NM',
                caption: '회사명',
                width: 200,
            },
            {
                dataField: 'REQ_NM',
                caption: '요청자명',
                width:90,
            },
            {
                dataField: 'REQ_EMAIL',
                caption: '요청자 이메일',
                width: 150,
            },
            {
                dataField: 'REQ_TEL',
                caption: '요청자 연락처',
                width: 120,
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    return s.replace(/(\d{3})(\d{4})(\d{4})/,'$1-$2-$3');
                }
            },
            {
                dataField: 'RMK',
                caption: '비고',
                width: 378,
            },

            {
                dataField: 'MNGT_NO',
                visible: false
            },
            {
                dataField: 'INSFLAG',
                visible: false
            },

        ],
        toolbar: {
            items: [{
                name: 'addRowButton',
                showText: 'always',
                options: {
                    text: '추가'
                },
            },
            {
                name: 'saveButton',
                showText: 'always',
                options: {
                    text: '저장',
                    onClick(e) {
                        saveCommGrp();
                    }
                },

            }],
        },
        scrolling: {
            mode: 'virtual',
        },
        onEditorPreparing: function (e) {
            var grid = e.component;
            if (e.parentType == 'dataRow') {
                if (e.dataField == 'GRP_CD') {
                    e.editorOptions.maxLength = 5;
                }
                if (e.dataField == 'GRP_NM') {
                    e.editorOptions.maxLength = 20;
                }
            }
            if (e.dataField == "RMK" && e.parentType === "dataRow") {
                const defaultValueChangeHandler = e.editorOptions.onValueChanged;
                e.editorName = "dxTextArea"; // Change the editor's type
                e.editorOptions.onValueChanged = function (args) {  // Override the default handler
                    // ...
                    // Custom commands go here
                    // ...
                    // If you want to modify the editor value, call the setValue function:
                    // e.setValue(newValue);
                    // Otherwise, call the default handler:
                    defaultValueChangeHandler(args);
                }
            }
        },
        onSelectionChanged(selectedItems) {
            const data = selectedItems.selectedRowsData[0];
            if (_fnToNull(data) != "") {
                if (data.MNGT_NO != "") {
                    //fnSearchItemConfDetail(data.MNGT_NO, tab_nm);
                }
            }
        },
        onInitNewRow: function (e) {
            e.data.INSFLAG = 'I';
            e.data.MNGT_NO = '';
            e.data.ITEM_CD = '';
            e.data.AREA = '';
            e.data.ITEM_TYPE = '';
            e.data.ITEM_NM = '';
            e.data.ITEM_GRD = '';
            e.data.MIN_NUM = '';
            e.data.MAX_NUM = '';
            e.data.ADDR1 = '';
            e.data.ADDR2 = '';
            e.data.ZIPCODE = '';
            e.data.HOME_URL = '';
            e.data.TAG = '';
            e.data.RMK = '';
        },
        onRowUpdating: function (e) {
            if (e.key.INSFLAG == "Q") {
                e.key.INSFLAG = "U";
            }
        },
        onRowRemoving: function (e) {
            e.cancel = true;
            e.data.INSFLAG = 'D';
        },
        onCellPrepared: function onCellPrepared(e) {
            if (e.column.dataField == "USER_TYPE" || e.column.dataField == "AREA" || e.column.dataField == "REQ_NM"
                || e.column.dataField == "EMAIL_YN" || e.column.dataField == "REQ_EMAIL" || e.column.dataField == "REQ_TEL"
                || e.column.dataField == "STRT_YMD" || e.column.dataField == "END_YMD" || e.column.dataField == "REQ_DT"
            ) { // css 셋팅*/
                e.cellElement.css("text-align", "center");
            }
        },
    }).dxDataGrid('instance');




    function SearchData() {
        objJsonData.QUOT_TYPE = _fnToNull(QUOT_TYPE.option('value'));
        objJsonData.REQ_NM = _fnToNull(REQ_NM.option('text'));
        objJsonData.REQ_CUST_NM = _fnToNull(REQ_CUST_NM.option('text'));
        objJsonData.ITEM_NM = _fnToNull(ITEM_NM.option('text'));
        $.ajax({
            type: "POST",
            url: "/Quotation/fnGetQuotManage",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                //데이터바인딩
                var resultItem = JSON.parse(result).Table1;
                //Data Binding
                gridQuotation.beginUpdate();
                gridQuotation.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridQuotation.option('dataSource', resultItem);
                gridQuotation.endUpdate();
            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });
    }


    //#region 관리테이블 이관
    function _fnInsertMngQuot(req_no) {
        var makeMngObj = new Object();


        //#region 파라미터 셋팅
        makeMngObj.REQ_NO = req_no; //요청 번호 셋팅
        makeMngObj.QUOT_NO = _fnSequenceMngt("QUOT"); //셋팅할 견적번호
        //#endregion

        $.ajax({
            type: "POST",
            url: "/Quotation/MoveToREQ_MNG",
            async: true,
            data: { "vJsonData": _fnMakeJson(makeMngObj) },
            success: function (result) {
                if (_fnToNull(JSON.parse(result).rec_cd) == "Y") {// 인서트 완료 시 페이지 이동
                    location.href = "/Quotation/quotRegist?quotNo=" + makeMngObj.QUOT_NO + "|" + makeMngObj.REQ_NO+"&&quotType=ONLINE_QUOT";
                }

            },
            error: function (xhr, status, error) {
                console.log("이관 에러");
                console.log(error);
            }

        });

    }
    //#endregion


});