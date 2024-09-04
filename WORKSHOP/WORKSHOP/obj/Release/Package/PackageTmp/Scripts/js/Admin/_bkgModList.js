var objJsonData = new Object();
var bkg = "";

$(function () {


    DevExpress.ui.dxDateBox.defaultOptions({
        options: {
            showClearButton: false,
            type: "date",
            displayFormat: "yyyy-MM-dd"
        }
    });

    var STRT_YMD = $("#STRT_YMD").dxDateBox({
        value: "",
        width: 150,
        value: new Date(Date.parse(new Date()) - 6 * 1000 * 60 * 60 * 24),
    }).dxDateBox('instance');

    var END_YMD = $("#END_YMD").dxDateBox({
        value: "",
        width: 150,
        value: new Date(Date.parse(new Date()) + 6 * 1000 * 60 * 60 * 24),
    }).dxDateBox('instance');

    var MOD_YN = $("#MOD_YN").dxSelectBox({
        dataSource: [{ CODE: "ALL", NAME: "전체" }, { CODE: "Y", NAME: "수정완료" }, { CODE: "N", NAME: "수정요청" }],
        width: 120,
        value : "ALL",
        displayExpr: "NAME",
        valueExpr: "CODE",
    }).dxSelectBox('instance');

    var ITEM_NM = $("#ITEM_NM").dxTextBox({
        value: "",
        width: 200
    }).dxTextBox('instance');

    var CUST_NM = $("#CUST_NM").dxTextBox({
        value: "",
        width: 150
    }).dxTextBox('instance');

    var CUST_EMAIL = $("#CUST_EMAIL").dxTextBox({
        value: "",
        width: 200
    }).dxTextBox('instance');
    //#region GET 파라미터



    var btnSearch = $("#btnSearch").dxButton({
        text: "검색",
        onClick: function () {
            SearchData();
        }
    }).dxButton('instance');

    var BKG_NO = $("#BKG_NO").dxTextBox({
        value: "",
        width: 200,
        visible:false,
    }).dxTextBox('instance');

    BKG_NO.option('value', getParameter('bkgNo'));


    var BKG_TYPE = $("#BKG_TYPE").dxTextBox({
        value: "",
        width: 200,
        visible: false,
    }).dxTextBox('instance');

    BKG_TYPE.option('value', getParameter('bkgType'));


    //#endregion


    //#region View 영역




    //#region 그리드
    var gridBookingHeader = $("#gridItem").dxDataGrid({
        hoverStateEnabled: true,
        allowColumnResizing: true,
        showRowLines: true,
        height: 860,
        editing: {
            mode: 'batch',
            allowAdding: false,
            allowUpdating: false,
            allowDeleting: false,
            texts: {
                deleteRow: "삭제",
                undeleteRow: "삭제취소",
            }
        },
        showBorders: true,
        selection: {
            mode: 'single',
        },
        paging: {
            enabled: false,
        },
        columns: [
            {
                dataField: 'INSFLAG',
                visible : false
            },
            {
                dataField: 'BKG_NO',
                width: 180,
                caption: '예약번호',
                allowEditing: false,
                fixed: true,
                visible:false,
                fixedPosition: "left",
                cellTemplate: function (cellElement, cellInfo) {
                    if (_fnToNull(cellInfo.data.MOD_YN) != "Y") { //요청건만 들어갈 수 있게
                        $('<a/>').addClass('dx-link')
                            .text(cellInfo.value)
                            .on('dxclick', function () {
                                location.href = "/admin/bkgMgt?bkgNO=" + cellInfo.data.BKG_NO + "&&modNO=" + cellInfo.data.BKG_MOD_NO + "&&modSEQ=" + cellInfo.data.BKG_MOD_SEQ;
                            })
                            .appendTo(cellElement);
                    }
                    else {
                        $('<p/>').text(cellInfo.value).appendTo(cellElement);
                    }
                    
                }
            },
            {
                dataField: 'MOD_YN',
                caption: '수정 여부',
                allowEditing: false,
                fixed: true,
                visible: false,
                fixedPosition: "left",
                width:100,
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    if (s == "Y") {
                        s = "수정완료"
                    } else {
                        s = "수정요청"
                    }

                    return s;
                },
                alignment: "center"
            },
            {
                dataField: 'MOD_YN_BTN',
                caption: '수정 여부',
                allowEditing: false,
                fixed: true,
                fixedPosition: "left",
                width: 100,
                cellTemplate: function (container, options) {
                    if (options.data.MOD_YN == "Y") {
                        $("<div/>").addClass("end_mod")
                            .text("완료")
                            .appendTo(container);
                    }
                    else {
                        $("<div/>").dxButton({
                            text: "요청",
                            type: "req_mod"

                        }).addClass("req_mod")
                            .on('dxclick', function () {
                                location.href = "/admin/bkgMgt?bkgNO=" + options.data.BKG_NO + "&&modNO=" + options.data.BKG_MOD_NO + "&&modSEQ=" + options.data.BKG_MOD_SEQ;
                        })
                            .appendTo(container);
                    }
                },
                alignment: "center"
            },
            {
                //값만 저장
                dataField: 'REQ_YMD',
                caption: '수정 요청일',
                width: 100,
                fixed: true,
                fixedPosition: "left",
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    if (s.length != 8) return s;

                    var y = s.substring(0, 4) // year
                    var m = s.substring(4, 6) // month
                    var d = s.substring(6, 8) // day

                    return [y, m, d].join('-');
                },
                alignment: "center"
            },
            {
                dataField: 'AREA',
                caption: '지역',
                allowEditing: false,
                alignment: "center",
                width: 100,
            },
            {
                dataField: 'ITEM_NM',
                caption: '상품명',
                allowEditing: false,
                //alignment: "center",
                width: 170,
                cellTemplate: function (cellElement, cellInfo) {
                    $('<a/>').addClass('dx-link')
                        .text(cellInfo.value)
                        .on('dxclick', function () {
                            window.open("/Admin/infoPop?itemCD=" + cellInfo.key.ITEM_CD, '_blank', 'width=600,height=630, scrollbars=no');
                        }).appendTo(cellElement);
                }
            },
            {
                dataField: 'ITEM_CD',
                caption: '상품코드',
                allowEditing: false,
                alignment: "center",
                width: 170,
                visible:false,
            },

            {
                dataField: 'TOT_AMT',
                caption: '총 금액',
                allowEditing: false,
                //alignment: "center",
                dataType: 'number',
                format: "fixedpoint",
                width: 150,
            },
            {
                dataField: 'STRT_YMD',
                caption: '시작날짜',
                dataType: "string",
                width: 100,
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    if (s.length != 8) return s;

                    var y = s.substring(0, 4) // year
                    var m = s.substring(4, 6) // month
                    var d = s.substring(6, 8) // day

                    return [y, m, d].join('-');
                },
                alignment: "center"
            },
            {
                dataField: 'END_YMD',
                caption: '종료날짜',
                dataType: "string",
                width: 100,
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    if (s.length != 8) return s;

                    var y = s.substring(0, 4) // year
                    var m = s.substring(4, 6) // month
                    var d = s.substring(6, 8) // day

                    return [y, m, d].join('-');
                },
                alignment: "center"
            },
            {
                dataField: 'CUST_NM',
                caption: '요청자명',
                allowEditing: false,
                alignment: "center",
                width: 100,
            },
            {
                dataField: 'CUST_EMAIL',
                caption: '요청자 이메일',
                allowEditing: false,
                alignment: "center",
                width: 150,
            },
            {
                dataField: 'CUST_TEL',
                caption: '요청자 연락처',
                allowEditing: false,
                width: 150,
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    if (s.length != 11) return s;

                    var y = s.substring(0, 3) // year
                    var m = s.substring(3, 7) // month
                    var d = s.substring(7, 11) // day

                    return [y, m, d].join('-');
                },
                alignment: "center"
            },
            {
                dataField: 'BKG_MOD_NO',
                caption: '수정요청 번호',
                fixed: true,
                fixedPosition: "left",
                allowEditing: false,
                visible:false,
                width: 220,
            },
            {
                dataField: 'BKG_MOD_SEQ',
                caption: '수정요청 순번 ',
                allowEditing: false,
                alignment: "right",
                fixed: true,
                fixedPosition: "left",
                width: 100,
                visible:false,
            },
            {
                dataField: 'MOD_CONF_YN',
                caption: '세미나 수정요청',
                allowEditing: false,
                alignment: "center",
                width: 120,
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    var view_text = "";
                    if (s == "Y") {
                        view_text = "요청";
                    }
                    else {
                        view_text = "-";
                    }
                    return view_text;
                }
            },
            {
                dataField: 'MOD_ROOM_YN',
                caption: '숙박 수정요청',
                allowEditing: false,
                alignment: "center",
                width: 120,
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    var view_text = "";
                    if (s == "Y") {
                        view_text = "요청";
                    }
                    else {
                        view_text = "-";
                    }
                    return view_text;
                }
            },
            {
                dataField: 'MOD_MEAL_YN',
                caption: '식사 수정요청',
                allowEditing: false,
                alignment: "center",
                width: 120,
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    var view_text = "";
                    if (s == "Y") {
                        view_text = "요청";
                    }
                    else {
                        view_text = "-";
                    }
                    return view_text;
                }
            },
            {
                dataField: 'MOD_SVC_YN',
                caption: '부가서비스 수정요청',
                allowEditing: false,
                alignment: "center",
                width: 120,
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    var view_text = "";
                    if (s == "Y") {
                        view_text = "요청";
                    }
                    else {
                        view_text = "-";
                    }
                    return view_text;
                }
            },
         
        ],
        toolbar: {
            items: [
            {
            name: 'saveButton',
            showText: 'always',
            options: {
                text: '저장',
                onClick(e) {
                    fnSaveQuotation();
                }
            },

            },
            ],
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
            //const data = selectedItems.selectedRowsData[0];
            //if (data.INSFLAG != "M") {
            //    openAddButton();
            //    bkg = data.BKG_NO;
            //    fnSearchDetailData(bkg);
            //}
            //else {
            //    blockAddButton();
            //}
        },
        onRowUpdating: function (e) {
            if (e.key.INSFLAG == "Q") {
                e.key.INSFLAG = "U";
            }
            if (e.key.INSFLAG == "M") { // 헤더일땐 인서트 플레그
                e.key.INSFLAG == "I";
            }
        },
        onRowRemoving: function (e) {
            e.cancel = true;
            e.data.INSFLAG = 'D';
        },
    }).dxDataGrid('instance');



    //#endregion

    //#endregion


    //#region 함수

    
    //#region ※※조회※※

    //예약 헤더 조회 로직
    function SearchData() {
        objJsonData.BKG_NO = _fnToNull(BKG_NO.option('value'));
        objJsonData.STRT_YMD = _fnToNull(STRT_YMD.option('text').replace(/-/gi, ""));
        objJsonData.END_YMD = _fnToNull(END_YMD.option('text').replace(/-/gi, ""));
        objJsonData.MOD_YN = _fnToNull(MOD_YN.option('value'));
        objJsonData.CUST_NM = _fnToNull(CUST_NM.option('value'));
        objJsonData.CUST_EMAIL = _fnToNull(CUST_EMAIL.option('value'));

        var url = "";
        var pageType = _fnToNull(BKG_TYPE.option('value'));

        url = "/Bkg/fnGetModList";


        $.ajax({
            type: "POST",
            url: url,
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                
                //데이터바인딩
                var resultItem = JSON.parse(result).Table1;

                if (resultItem.length > 0) {
                    bkg = _fnToNull(resultItem[0]["BKG_NO"]);
                }
                

                //Data Binding
                gridBookingHeader.beginUpdate();
                gridBookingHeader.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridBookingHeader.option('dataSource', resultItem);
                gridBookingHeader.endUpdate();

               
            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });
    }

    //#endregion








    // dtl 테이블 추가 버튼 활성 함수

    //#region 미사용
    function openAddButton() {
        gridConference.option("toolbar.items[0].options.disabled", false) 
        gridRoom.option("toolbar.items[0].options.disabled", false) 
        gridMeal.option("toolbar.items[0].options.disabled", false) 
        gridEtc.option("toolbar.items[0].options.disabled", false) 
    }

    function blockAddButton() {
        gridConference.option("toolbar.items[0].options.disabled", true)
        gridRoom.option("toolbar.items[0].options.disabled", true)
        gridMeal.option("toolbar.items[0].options.disabled", true)
        gridEtc.option("toolbar.items[0].options.disabled", true)
    }
    //dtl 조회 함수
    function fnSearchDetailData(quot_no) {
        var DtlObj = new Object();

        DtlObj.QUOT_NO = quot_no;


        $.ajax({
            type: "POST",
            url: "/Quotation/fnGetQuotDtl",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(DtlObj) },
            success: function (result) {

                var resultData = JSON.parse(result);

                if (resultData["Result"][0].trxCode == "Y") {
                    //세미나
                    gridConference.beginUpdate();
                    gridConference.saveEditData();
                    gridConference.option('dataSource', resultData["CONF"]);
                    gridConference.endUpdate();
                    gridConference.option("toolbar.items[0].options.disabled", false) // 선택시 추가 버튼 활성화

                    //숙박
                    gridRoom.beginUpdate();
                    gridRoom.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridRoom.option('dataSource', resultData["ROOM"]);
                    gridRoom.endUpdate();
                    gridRoom.option("toolbar.items[0].options.disabled", false) // 선택시 추가 버튼 활성화

                    //식사
                    gridMeal.beginUpdate();
                    gridMeal.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridMeal.option('dataSource', resultData["MEAL"]);
                    gridMeal.endUpdate();
                    gridMeal.option("toolbar.items[0].options.disabled", false) // 선택시 추가 버튼 활성화

                    //부가서비스
                    gridEtc.beginUpdate();
                    gridEtc.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridEtc.option('dataSource', resultData["SVC"]);
                    gridEtc.endUpdate();
                    gridEtc.option("toolbar.items[0].options.disabled", false) // 선택시 추가 버튼 활성화
                }

            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });


    }

    //#endregion

    function sendEmail(arrReqno) {
        console.log(arrReqno);
        if (arrReqno.length > 0) {

            $.ajax({
                type: "POST",
                url: "/Quotation/fnSendEmail",
                async: true,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(arrReqno) },
                success: function (result) {
                    //데이터바인딩
                    var resultData = JSON.parse(result).Table1;
                    //Data Binding
                    gridBookingHeader.beginUpdate();
                    gridBookingHeader.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridBookingHeader.option('dataSource', resultData);
                    gridBookingHeader.endUpdate();

                    DevExpress.ui.dialog.alert("<i>견적서를 전송하였습니다</i>", "");
                }, error: function (xhr, status, error) {
                    console.log("에러");
                    console.log(error);
                }
            });

        }
    }


    


    //#endregion


    // Run 

        SearchData();


});