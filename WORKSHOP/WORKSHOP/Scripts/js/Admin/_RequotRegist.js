var objJsonData = new Object();
var tab_nm = "CONF";
var quot = "";
var objJsonArray = new Array();
var selectedList = new Array();
var first_connect = true;
var row_cnt = 0;
var mng_yn = "N"; // 견적이 등록 되었는 지 

var tot_conf = 0;
var tot_room = 0;
var tot_meal = 0;
var tot_svc = 0;

var mod_amt = 0; // 수정값
var dtl_amt = 0; // 디테일 저장시 입력 값

var reqQuotObj = new Object();
var mod_cell = 9;


$(function () {

    DevExpress.ui.dxDateBox.defaultOptions({
        options: {
            showClearButton: false,
            type: "date",
            displayFormat: "yyyy-MM-dd"
        }
    });

    //#region 파라미터 영역

    var REQ_NO = $("#REQ_NO").dxTextBox({
        value: "",
        width: 200,
        visible:false,
    }).dxTextBox('instance');

    REQ_NO.option('value', getParameter('quotNo'));


    var QUOT_TYPE = $("#QUOT_TYPE").dxTextBox({
        value: "",
        width: 200,
        visible: false,
    }).dxTextBox('instance');

    QUOT_TYPE.option('value', getParameter('quotType'));



    var ITEM_NM = $("#ITEM_NM").dxTextBox({
        value: "",
        width: 200,
        visible:false,
    }).dxTextBox('instance');



  


    //#endregion


    //#region View 영역

    var pop = $("#popup").dxPopup({
        showTitle: true,
        title: '상품정보',
        contentTemplate: function (container) {
            container.append(
                $("<div id='popItem' style='display:flex'>"),
            )
            $("#popItem").append(
                $("<div>")
                    .addClass("ad_label")
                    .text("상품명"),
                $("<div id='POP_ITEM_NM'>")
                    .dxTextBox({}),
                $("<div>")
                    .addClass("ad_label")
                    .text("지역"),
                $("<div id='POP_AREA'>")
                    .dxTextBox({}),
                $("<div>")
                    .addClass("ad_label")
                    .text("태그"),
                $("<div id='POP_TAG'>")
                    .dxTextBox({}),
                $("<div style='margin-left:10px'>")
                    .dxButton({
                        text: "검색",
                        onClick: function () {
                            searchItem();
                        }
                    })
            );
                container.append(
                    $("<div id='test' >")
                        .dxDataGrid({
                            allowColumnResizing: true,
                            showRowLines: true,
                         columns: [
                         {
                             dataField: 'INSFLAG',
                             visible : false
                         },
                         {
                             dataField: 'MNGT_NO',
                             caption: '상품관리번호',
                             allowEditing: false,
                             visible: false
                         },
                         {
                             dataField: 'ITEM_CD',
                             caption: '상품코드',
                             visible: false
                         },
                         {
                             dataField: 'AREA',
                             caption: '지역',
     
                         },
                         {
                             dataField: 'ITEM_TYPE',
                             caption: '호텔/리조트',
        
                         },
                         {
                             dataField: 'ITEM_NM',
                             caption: '상품명',
                             cellTemplate: function (cellElement, cellInfo) {
                                 $('<a/>').addClass('dx-link')
                                     .text(cellInfo.value)
                                     .on('dxclick', function () {
                                         var result = DevExpress.ui.dialog.confirm("<i>상품을 변경하시겠습니까?</i>", "");
                                         result.done(function (dialogResult) {
                                             if (gridQuotation.cellValue(0, "INSFLAG") == "M") {
                                                 gridQuotation.cellValue(0, "INSFLAG", "I");
                                             }
                                             else{
                                                 gridQuotation.cellValue(0, "INSFLAG", "U");
                                             }
                                             
                                             gridQuotation.cellValue(0, "ITEM_CD", cellInfo.data.ITEM_CD);
                                             gridQuotation.cellValue(0, "ITEM_NM", cellInfo.data.ITEM_NM);
                                             gridQuotation.cellValue(0, "AREA", cellInfo.data.AREA);


                                             //#region 디테일 뷰 초기화
                                             //세미나
                                             gridConference.beginUpdate();
                                             gridConference.saveEditData();
                                             gridConference.option('dataSource', []);
                                             gridConference.endUpdate();
                                             gridConference.option("toolbar.items[0].options.disabled", true) // 선택시 추가 버튼 활성화

                                             //숙박
                                             gridRoom.beginUpdate();
                                             gridRoom.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                                             gridRoom.option('dataSource', []);
                                             gridRoom.endUpdate();
                                             gridRoom.option("toolbar.items[0].options.disabled", true) // 선택시 추가 버튼 활성화

                                             //식사
                                             gridMeal.beginUpdate();
                                             gridMeal.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                                             gridMeal.option('dataSource', []);
                                             gridMeal.endUpdate();
                                             gridMeal.option("toolbar.items[0].options.disabled", true) // 선택시 추가 버튼 활성화

                                             //부가서비스
                                             gridEtc.beginUpdate();
                                             gridEtc.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                                             gridEtc.option('dataSource', []);
                                             gridEtc.endUpdate();
                                             gridEtc.option("toolbar.items[0].options.disabled", true) // 선택시 추가 버튼 활성화

                                             headerUpdate("ITEM"); //mng에 merge

                                             //#endregion

                                             $("#popup").dxPopup("instance").hide();
                                         });
                                     })
                                     .appendTo(cellElement);
                             }
                         },
                         {
                             dataField: 'ITEM_GRD',
                             caption: '등급',
    
                         },
                         {
                             dataField: 'MIN_NUM',
                             caption: '최소인원'
                         },
                         {
                             dataField: 'MAX_NUM',
                             caption: '최대인원'
                         },
                         {
                             dataField: 'ADDR1',
                             caption: '기본주소'
                         },
                         {
                             dataField: 'ADDR2',
                             caption: '상세주소'
                         },
                         {
                             dataField: 'ZIPCODE',
                             caption: '우편번호'
                         },
                         {
                             dataField: 'HOME_URL',
                             caption: '홈페이지 주소',
                             visible: false
                         },
                         {
                             dataField: 'TAG',
                             caption: '태그'
                         },
                         {
                             dataField: 'RMK',
                             caption: '비고'
                         },

                     ],
                })
            )
        }
    }).dxPopup('instance');
  
    var gridQuotation = $("#gridItem").dxDataGrid({
        hoverStateEnabled: true,
        allowColumnResizing: true,
        showRowLines: true,
        editing: {
            mode: 'batch',
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: false,
            texts: {
                deleteRow: "삭제",
                undeleteRow: "삭제취소",
            }
        },
        showBorders: true,
        selection: {
            mode: 'multiple',
        },
        paging: {
            enabled: false,
        },
        columns: [
            {
                dataField: 'INSFLAG',
                width:100,
                /*visible : false*/
            },
            {
                dataField: 'REQ_NO',
                caption: '관리번호',
                allowEditing: false,
                width: 180,
                fixed: true,
                fixedPosition: "left",
            },
            {
                dataField: 'QUOT_NO',
                caption: '견적번호',
                allowEditing: false,
                width: 200,
                fixed: true,
                fixedPosition: "left",
            },
            {
                dataField: 'QUOT_TYPE',
                caption: '견적구분',
                alignment: "center",
                allowEditing: false,
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    if (s == "A") return "상품 견적";
                    else return "상품 견적";
                },
                width : 100
            },
            {
                dataField: 'STATUS',
                caption: '견적상태',
                width: 120,
                allowEditing: false,
                visible : false
            },
            {
                dataField: 'AREA',
                caption: '지역',
                width: 90,
                allowEditing: false
            },
            {
                dataField: 'ITEM_CD',
                caption: '상품코드',
                allowEditing: false,
                visible : false
            },
            {
                dataField: 'ITEM_BTN',
                caption: '상품선택',
                alignment: "center",
                allowEditing: false,
                cellTemplate: function (cellElement, cellInfo) {
                    if (_fnToNull(cellInfo.value) == "") {
                        $('<div/>').dxButton({

                            text: "상품 찾기",
                            onClick: function () {
                                $("#popup").dxPopup("instance").show();
                            }
                        }).appendTo(cellElement);
                          
                            
                        //$('<a/>').addClass('dx-link')
                        //.text("상품불러오기")
                        //.on('dxclick', function () {
                        //        $("#popup").dxPopup("instance").show();

                        //})
                        //.appendTo(cellElement);
                    } else {
                        return cellInfo.value;
                    }
                },
                width: 120
            },
            {
                dataField: 'ITEM_NM',
                caption: '상품명',
                allowEditing: false,
                width : 140
            },
            {
                dataField: 'TOT_AMT',
                caption: '총 금액',
                dataType: 'number',
                format: "fixedpoint",
                width : 140,
            },
            {
                dataField: 'TOT_DTL',
                caption: '수정 금액',
                dataType: 'number',
                format: "fixedpoint",
                allowEditing: false,
                width: 140,
            },
            {
                dataField: 'EMAIL_YN',
                caption: '견적서 발송여부',
                width: 160,
                allowEditing: false,
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    if (s == "Y") {
                        s = "발송"
                    } else {
                        s = "미발송"
                    }

                    return s;
                }
            },
            {
                dataField: 'QUOT_PATH',
                caption: '견적서 업로드',
                allowEditing: false,
                cellTemplate: function (container, options) {

                        //보여주기
                        $("<div/>")
                            .dxFileUploader({
                                selectButtonText: '업로드',
                                labelText: '',
                                multiple: false,
                                value: [],
                                uploadMode: "instantly",
                                uploadFailedMessage: "파일 업로드를 처리 하지 못했습니다.",
                                uploadUrl: "/Admin/UploadHandler",
                                onValueChanged: function (e) {
                                },
                                onUploaded: function (e) {
                                    if (JSON.parse(e.request.responseText).rec_cd == "Y") {
                                        //  $(".dx-fileuploader-files-container").hide();
                                        gridQuotation.cellValue(options.rowIndex, "FILE_NM", e.file.name);
                                        if (gridQuotation.cellValue(options.rowIndex, "INSFLAG") == "M") {
                                            gridQuotation.cellValue(options.rowIndex, "INSFLAG", "I");
                                        }
                                        if (gridQuotation.cellValue(options.rowIndex, "INSFLAG") == "Q") {
                                            gridQuotation.cellValue(options.rowIndex, "INSFLAG", "U");
                                        }
                                        gridQuotation.cellValue(options.rowIndex, "FILE_PATH", JSON.parse(e.request.responseText).res_msg);
                                        /*var result = DevExpress.ui.dialog.confirm("<i>견적서를 업로드하시겠습니까?</i>", "");*/
                                        /*result.done(function (dialogResult) {*/
                                        //saveQuotation("FILE");
                                        headerUpdate("FILE"); //mng에 merge
                                        /*});*/

                                    } else {

                                    }
                                },
                            }).appendTo(container);
                    
                },
                width: 140
            },
            {
                dataField: 'FILE_NM',
                caption: '파일 명',
                allowEditing: false,
                width: 140,
                cellTemplate: function (cellElement, cellInfo) {
                    $('<a/>').addClass('dx-link')
                        .text(cellInfo.value)
                        .on('dxclick', function () {
                            window.location = "/Estimate/DownloadFile?FILE_NM=" + cellInfo.value + "&FILE_PATH=" + cellInfo.data.FILE_PATH;
                        })
                        .appendTo(cellElement);
                }
               
            },
            {
                dataField: 'STRT_YMD',
                caption: '시작날짜',
                allowEditing: false,
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    if (s.length != 8) return s;

                    var y = s.substring(0, 4) // year
                    var m = s.substring(4, 6) // month
                    var d = s.substring(6, 8) // day

                    return [y, m, d].join('-');
                },
                width : 100
            },
            {
                dataField: 'END_YMD',
                caption: '종료날짜',
                allowEditing: false,
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    if (s.length != 8) return s;

                    var y = s.substring(0, 4) // year
                    var m = s.substring(4, 6) // month
                    var d = s.substring(6, 8) // day

                    return [y, m, d].join('-');
                },
                width: 100
            },
            {
                dataField: 'MIN_PRC',
                caption: '예산최소금액',
                allowEditing: false,
                dataType: 'number',
                format: "fixedpoint",
                width: 100
            },
            {
                dataField: 'MAX_PRC',
                caption: '예산최대금액',
                allowEditing: false,
                dataType: 'number',
                format: "fixedpoint",
                width: 100
            },
            {
                dataField: 'HEAD_CNT',
                caption: '예상인원',
                allowEditing: false,
                dataType: 'number',
                format: "fixedpoint",
                width: 80
            },
            {
                dataField: 'REQ_NM',
                caption: '요청자명',
                width: 100,
                allowEditing: false
            },
            {
                dataField: 'REQ_EMAIL',
                caption: '요청자 이메일',
                width: 150,
                allowEditing: false
            },
            {
                dataField: 'REQ_TEL',
                caption: '요청자 연락처',
                width: 150,
                allowEditing: false,
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
                dataField: 'RMK',
                caption: '비고',
                width: 200,
                allowEditing: false
            },
            {
                dataField: 'FILE_PATH',
                caption: '파일 경로',
                allowEditing: false,
                visible : false,
            },


        ],
        toolbar: {
            items: [
                //{
                //    name: 'addRowButton',
                //    showText: 'always',
                //    options: {
                //        text: '추가',
                //        disabled: true,
                //    },
                //    onClick(e) {

                //    },

                //},
                {
                    widget: 'dxButton',
                    options: {
                        text: '목록',
                        onClick(e) {
                            location.href = "/Quotation/quotList";

                        }
                    },

                },
            {
            name: 'saveButton',
            showText: 'always',
            options: {
                text: '저장',
                onClick(e) {
                    if ((_fnToNull(QUOT_TYPE.option('value')) != "ONLINE_QUOT") || (_fnToNull(QUOT_TYPE.option('value')) == "ONLINE_QUOT" && !first_connect)) {
                        
                        var check_mod = false;
                        if (selectedList.length > 0 || (_fnToNull(QUOT_TYPE.option('value')) == "ONLINE_QUOT" && !first_connect)) {
                            check_mod = true;
                        }
                        if (check_mod) {
                            
                            var confirm_alert = DevExpress.ui.dialog.confirm("수정금액으로 저장하시겠습니까?", "");
                            confirm_alert.done(function (dialogAlert) {
                                if (dialogAlert) {
                                    if (selectedList.length > 0) {
                                        for (var i = 0; i < selectedList.length; i++) {
                                            var price = _fnToZero(gridQuotation.cellValue(selectedList[i], mod_cell));
                                            gridQuotation.cellValue(selectedList[i], mod_cell-1, price);
                                        }
                                    }
                                        fnSaveQUOT();
                                }
                                else {
                                    fnSaveQUOT();
                                }
                            });
                        }
                    }
                    else {
                        fnSaveQUOT();
                    }
                }
            },
            },
            {
                widget: 'dxButton',
                options: {
                    text: '이메일 보내기',
                    onClick(e) {
                        var arrData = gridQuotation.getSelectedRowsData();
                        var arrReqno = {};
                        if (arrData.length > 0) {
                            for (var i = 0; i < arrData.length; i++) {
                                if (_fnToNull(arrData[i]["REQ_NO"]) != '') {
                                    if (_fnToNull(arrData[i]["FILE_NM"]) == '') {
                                        DevExpress.ui.dialog.alert("<i>견적서를 업로드 해주세요.</i>", "");
                                        return false;
                                    } else {

                                        arrReqno = { id: i + 1 };
                                        arrReqno["MNGT_NO"] = arrData[i]["REQ_NO"];
                                        arrReqno["TYPE"] = "QUOT";
                                        arrReqno["FILE_PATH"] = arrData[i]["FILE_PATH"];
                                        arrReqno["FILE_NM"] = arrData[i]["FILE_NM"];
                                        arrReqno["PAGE_TYPE"] = _fnToNull(QUOT_TYPE.option('value'));
                                        arrReqno["QUOT_NO"] = arrData[i]["QUOT_NO"];
                                    }

                                }
                                objJsonArray.push(arrReqno);
                            }
                            //sendEmail(objJsonArray);
                            sendQuotEmail(objJsonArray);
                        }
                        else {
                            DevExpress.ui.dialog.alert("<i>메일 발송할 견적건을 선택해 주세요.</i>", "");
                        }
                        
                    }
                },

            },
            ],
        },
        scrolling: {
            mode: 'virtual',
        },
        onContentReady: function (e) {
            // Set the focused cell

                if (_fnToNull(QUOT_TYPE.option('value')) == "MANAGE") {
                    first_connect = false;
                }
                else {
                    e.component.selectRowsByIndexes([0]); // 로드시 첫 인덱스 선택
                }
            
            
        },
        onEditorPreparing: function (e) {

            var grid = e.component;

            if (e.parentType == 'dataRow') {
                if (e.dataType == 'number') {
                    e.editorOptions.max = 9999999999;
                }
            }

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
        onSelectionChanged(selectedItems, e) {
            var len = selectedItems.selectedRowsData.length - 1;
            const data = selectedItems.selectedRowsData[len];
            selectedList = new Array();
            if (_fnToNull(data) != "") {
                if (data.INSFLAG != "M") { // 요청견적이 아닌 건
                    ControlAddButton(false); 
                    if (selectedItems.selectedRowKeys.length > 0) {
                        for (var i = 0; i < len + 1; i++) {
                            row_cnt = selectedItems.component.getRowIndexByKey(selectedItems.selectedRowKeys[i]);
                            selectedList.push(row_cnt);
                        }
                        
                        console.log(selectedList);
                    }
                    else {
                        selectedList = new Array();
                    }
                    quot = data.QUOT_NO;
                    fnSearchDetailData(quot);
                }
                else {
                    //bindingDTL();
                    ControlAddButton(true);
                }
            }

        },
        //onInitNewRow: function (e) {

        //    e.data.INSFLAG = 'M';
        //    e.data.REQ_NO = getParameter("quotNo");
        //    e.data.QUOT_TYPE = reqQuotObj.MAIN[0]["QUOT_TYPE"];
        //    e.data.AREA = reqQuotObj.MAIN[0]["AREA"];
        //    e.data.ITEM_NM = reqQuotObj.MAIN[0]["ITEM_NM"];
        //    e.data.TOT_AMT = '';
        //    e.data.EMAIL_YN = 'N';
        //    e.data.FILE_NM = '';
        //    e.data.STRT_YMD = reqQuotObj.MAIN[0]["STRT_YMD"];
        //    e.data.END_YMD = reqQuotObj.MAIN[0]["END_YMD"];
        //    e.data.MIN_PRC = reqQuotObj.MAIN[0]["MIN_PRC"];
        //    e.data.MAX_PRC = reqQuotObj.MAIN[0]["MAX_PRC"];
        //    e.data.HEAD_CNT = reqQuotObj.MAIN[0]["HEAD_CNT"];
        //    e.data.REQ_NM = reqQuotObj.MAIN[0]["REQ_NM"];
        //    e.data.REQ_EMAIL = reqQuotObj.MAIN[0]["REQ_EMAIL"];
        //    e.data.REQ_TEL = reqQuotObj.MAIN[0]["REQ_TEL"];
        //    e.data.RMK = reqQuotObj.MAIN[0]["RNK"];

        //},
        onRowUpdating: function (e) {
            if (e.key.INSFLAG == "Q") {
                e.key.INSFLAG = "U";
            }
            if (e.key.INSFLAG == "M") { // 헤더일땐 인서트 플레그
                e.key.INSFLAG = "I";
            }
        },
        onRowRemoving: function (e) {
            e.cancel = true;
            e.data.INSFLAG = 'D';
        },
        onCellPrepared: function onCellPrepared(e) {
            if (e.column.dataField == "REQ_NO" || e.column.dataField == "AREA" || e.column.dataField == "REQ_NM"
                || e.column.dataField == "EMAIL_YN" || e.column.dataField == "REQ_EMAIL" || e.column.dataField == "REQ_TEL"
                || e.column.dataField == "STRT_YMD" || e.column.dataField == "END_YMD" 
            ) { // css 셋팅*/
                e.cellElement.css("text-align", "center");
            }
        },
    }).dxDataGrid('instance');


    //#region DTL 그리드
    var gridConference = $("#gridConference").dxDataGrid({
        dataSource: [],
        showBorders: true,
        paging: {
            enabled: false,
        },
        editing: {
            mode: 'batch',
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
            texts: {
                deleteRow: "삭제"
            }
        },
        columns: [
            {
                dataField: 'INSFLAG',
                visible : false
            },
            {
                dataField: 'QUOT_NO',
                caption: '상품관리번호',
                allowEditing: false,
                visible: false,
            },
            {
                dataField: 'QUOT_SEQ',
                visible: false,
            },
            {
                dataField: 'CONF_TYPE',
                caption: '세미나실 명',
                lookup: {
                    dataSource: {
                        load: function () {
                            objJsonData.ITEM_CD = gridQuotation.cellValue(row_cnt, "ITEM_CD");
                             return $.ajax({
                                url: "/Admin/fnGetConfDetail/",
                                type: "POST",
                                data: { "vJsonData": _fnMakeJson(objJsonData) },
                                dataType: "json",
                            });
                        },
                        byKey: function (key,extra) {
                            var d = new jQuery.Deferred();
                            d.resolve();
                            return d.promise();
                        },
                    },
                    valueExpr: "CONF_TYPE",  // The value field in the data source
                    displayExpr: "CONF_CD"  // The display field in the data source
                }
            },
            {
                dataField: 'PRC',
                caption: '금액',
                dataType: 'number',
                format: "fixedpoint"
            },
        ],
        toolbar: {
            items: [{
                name: 'addRowButton',
                showText: 'always',
                options: {
                    text: '추가',
                    disabled:true,
                },
                onClick(e) {
                 
                },

            },
            {
                name: 'saveButton',
                showText: 'always',
                options: {
                    text: '저장',
                    onClick(e) {
                        fnUpdateDetailData();
                    }
                },

            }],
        },
        scrolling: {
            mode: 'virtual',
        },
        onInitNewRow: function (e) {
            e.data.INSFLAG = "I";
            e.data.QUOT_NO = quot;
            e.data.CONF_NM = '';
            e.data.QUOT_SEQ = '';
            e.data.PRC = '0';
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
        onEditorPreparing: function (e) { // 셀렉트 박스 텍스트 입력 막기
            if (e.parentType == "dataRow" && (e.editorName == "dxSelectBox")) { // 셀렉트 박스 입력 막기
                e.editorOptions.searchEnabled = false;
            }
        },
    }).dxDataGrid('instance');

    var gridRoom = $("#gridRoom").dxDataGrid({
        showBorders: true,
        editing: {
            mode: 'batch',
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
            texts: {
                deleteRow: "삭제",
                undeleteRow: "삭제취소",
            }
        },
        columns: [
            {
                dataField: 'INSFLAG',
                visible : false
            },
            {
                dataField: 'QUOT_SEQ',
                visible: false,
            },
            {
                dataField: 'QUOT_NO',
                caption: '상품관리번호',
                allowEditing: false,
                visible: false,
            },
            {
                dataField: 'ITEM_CD',
                caption: '상품코드',
                visible : false,
            },
            {
                dataField: 'ITEM_SEQ',
                caption: '상품 시퀀스',
                visible : false,
            },
            {
                dataField: 'MIN_NUM',
                caption: '기준인원',
                visible: false,
            },
            {
                dataField: 'MAX_NUM',
                caption: '최대인원',
                visible: false,
            },
            {
                dataField: 'ROOM_NM',
                caption: '객실 명',
                lookup: {
                    dataSource: {
                        load: function () {
                            objJsonData.ITEM_CD = gridQuotation.cellValue(row_cnt, "ITEM_CD");
                            return $.ajax({
                                url: "/Admin/fnGetRoomDetail/",
                                type: "POST",
                                data: { "vJsonData": _fnMakeJson(objJsonData) },
                                dataType: "json",
                            });
                        },
                        byKey: function (key, extra) {
                            var d = new jQuery.Deferred();
                            d.resolve();
                            return d.promise();
                        },
                    },
                    valueExpr: "ROOM_NM",  // The value field in the data source
                    displayExpr: "ROOM_NM"  // The display field in the data source
                }
            },
            {
                dataField: 'ROOM_CNT',
                caption: '객실 수'
            },
            {
                dataField: 'PRC',
                caption: '금액',
                dataType: 'number',
                format: "fixedpoint"
            },

        ],
        toolbar: {
            items: [{
                name: 'addRowButton',
                showText: 'always',
                options: {
                    text: '추가',
                    disabled: true,
                },

            },
            {
                name: 'saveButton',
                showText: 'always',
                options: {
                    text: '저장',
                    onClick(e) {
                        fnUpdateDetailData();
                    }
                },

            },
            ],
        },
        onInitNewRow: function (e) {
            e.data.INSFLAG = "I";
            e.data.QUOT_NO = quot;
            e.data.CONF_NM = '';
            e.data.CONF_CNT = '';
            e.data.PRC = '0';
            e.data.QUOT_SEQ = '';
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
        scrolling: {
            mode: 'virtual',
        },
        onEditorPreparing: function (e) { // 셀렉트 박스 텍스트 입력 막기
            if (e.parentType == "dataRow" && (e.editorName == "dxSelectBox")) { // 셀렉트 박스 입력 막기
                e.editorOptions.searchEnabled = false;
            }
        },
    }).dxDataGrid('instance');

    var gridMeal = $("#gridMeal").dxDataGrid({
        showBorders: true,
        editing: {
            mode: 'batch',
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
            texts: {
                deleteRow: "삭제",
                undeleteRow: "삭제취소",
            }
        },
        columns: [
            {
                dataField: 'INSFLAG',
                visible: false,
            },
            {
                dataField: 'QUOT_SEQ',
                visible: false,
            },
            {
                dataField: 'QUOT_NO',
                caption: '상품관리번호',
                allowEditing: false,
                visible: false,
            },
            {
                dataField: 'ITEM_CD',
                caption: '상품코드',
                visible : false,
            },
            {
                dataField: 'ITEM_SEQ',
                caption: '상품 시퀀스',
                visible: false,
            },
            {
                dataField: 'MEAL_NM',
                caption: '식사 명',
                lookup: {
                    dataSource: {
                        load: function () {
                            objJsonData.ITEM_CD = gridQuotation.cellValue(row_cnt, "ITEM_CD");
                            return $.ajax({
                                url: "/Admin/fnGetMealDetail/",
                                type: "POST",
                                data: { "vJsonData": _fnMakeJson(objJsonData) },
                                dataType: "json",
                            });
                        },
                        byKey: function (key, extra) {
                            var d = new jQuery.Deferred();
                            d.resolve();
                            return d.promise();
                        },
                    },
                    valueExpr: "MEAL_NM",  // The value field in the data source
                    displayExpr: "MEAL_NM"  // The display field in the data source
                }
            },
            {
                dataField: 'PRC',
                caption: '금액',
                dataType: 'number',
                format: "fixedpoint"
            },
        ],
        toolbar: {
            items: [{
                name: 'addRowButton',
                showText: 'always',
                options: {
                    text: '추가',
                    disabled: true,
                },

            },
            {
                name: 'saveButton',
                showText: 'always',
                options: {
                    text: '저장',
                    onClick(e) {
                        fnUpdateDetailData();
                    }
                },

            },
            ],
        },
        onInitNewRow: function (e) {
            e.data.INSFLAG = "I";
            e.data.QUOT_NO = quot;
            e.data.QUOT_SEQ = '';
            e.data.MEAL_CD = '';
            e.data.MEAL_NM = '';
            e.data.PRC = '0';
            
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
        scrolling: {
            mode: 'virtual',
        },
        onEditorPreparing: function (e) { // 셀렉트 박스 텍스트 입력 막기
            if (e.parentType == "dataRow" && (e.editorName == "dxSelectBox")) { // 셀렉트 박스 입력 막기
                e.editorOptions.searchEnabled = false;
            }
        },
    }).dxDataGrid('instance');

    var gridEtc = $("#gridEtc").dxDataGrid({
        showBorders: true,
        editing: {
            mode: 'batch',
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
            texts: {
                deleteRow: "삭제",
                undeleteRow: "삭제취소",
            }
        },
        columns: [
            {
                dataField: 'INSFLAG',
                visible: false,
            },
            {
                dataField: 'QUOT_SEQ',
                visible: false,
            },
            {
                dataField: 'QUOT_NO',
                caption: '상품관리번호',
                allowEditing: false,
                visible: false,
            },
            {
                dataField: 'ITEM_CD',
                caption: '상품코드',
                visible: false,
            },
            {
                dataField: 'ITEM_SEQ',
                caption: '상품 시퀀스',
                visible: false,
            },
            {
                dataField: 'SVC_CD',
                caption: '부가서비스 코드',
                visible: false,
            },
            {
                dataField: 'SVC_NM',
                caption: '부가서비스',
                lookup: {
                    dataSource: {
                        load: function () {
                            objJsonData.ITEM_CD = gridQuotation.cellValue(row_cnt, "ITEM_CD");
                            return $.ajax({
                                url: "/Admin/fnGetSvcDetail/",
                                type: "POST",
                                data: { "vJsonData": _fnMakeJson(objJsonData) },
                                dataType: "json",
                            });
                        },
                        byKey: function (key, extra) {
                            var d = new jQuery.Deferred();
                            d.resolve();
                            return d.promise();
                        },
                    },
                    valueExpr: "SVC_NM",  // The value field in the data source
                    displayExpr: "SVC_NM"  // The display field in the data source
                }
            },
            {
                dataField: 'PRC',
                caption: '금액',
                dataType: 'number',
                format: "fixedpoint"
            },
        ],
        toolbar: {
            items: [{
                name: 'addRowButton',
                showText: 'always',
                options: {
                    text: '추가',
                    disabled: true,
                },

            },
            {
                name: 'saveButton',
                showText: 'always',
                options: {
                    text: '저장',
                    onClick(e) {
                        fnUpdateDetailData();
                    }
                },

            },
            ],
        },
        onInitNewRow: function (e) {
            e.data.INSFLAG = "I";
            e.data.QUOT_NO = quot;
            e.data.QUOT_SEQ = '';
            e.data.SVC_CD = '';
            e.data.SVC_NM = '';
            e.data.PRC = '0';
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
        scrolling: {
            mode: 'virtual',
        },
        onEditorPreparing: function (e) { // 셀렉트 박스 텍스트 입력 막기
            if (e.parentType == "dataRow" && (e.editorName == "dxSelectBox")) { // 셀렉트 박스 입력 막기
                e.editorOptions.searchEnabled = false;
            }
        },
    }).dxDataGrid('instance');

    var tabs = $("#gridTabs").dxTabs({
        dataSource: [{ id: 0, text: "세미나실 정보" }, { id: 1, text: "숙박 정보" }, { id: 2, text: "식사 정보" }, { id: 3, text: "부가서비스 정보" }],
        selectedIndex: 0,
        onItemClick(e) {
            $(".gridGrp").hide();
            if (e.itemData.id == 0) {
                $("#gridConference").show();
                tab_nm = "CONF";
                gridConference.beginUpdate();
                gridConference.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridConference.endUpdate();
            } else if (e.itemData.id == 1) {
                $("#gridRoom").show();
                tab_nm = "ROOM";
                gridRoom.beginUpdate();
                gridRoom.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridRoom.endUpdate();
            } else if (e.itemData.id == 2) {
                $("#gridMeal").show();
                tab_nm = "MEAL";
                gridMeal.beginUpdate();
                gridMeal.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridMeal.endUpdate();
            } else if (e.itemData.id == 3) {
                $("#gridEtc").show();
                gridEtc.beginUpdate();
                gridEtc.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridEtc.endUpdate();
                tab_nm = "SVC";
            }
        }
    }).dxTabs('instance');


    //#endregion

    //#endregion


    //#region ※※※※함수 영역※※※※

    //#region 팝업 상품 조회
    function searchItem() {
        objJsonData.ITEM_NM = _fnToNull($("#POP_ITEM_NM").find('input').val());
        objJsonData.AREA = _fnToNull($("#POP_AREA").find('input').val());
        objJsonData.TAG = _fnToNull($("#POP_TAG").find('input').val());
        $.ajax({
            type: "POST",
            url: "/Admin/fnGetItemInfo",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                //데이터바인딩
                var resultData = JSON.parse(result).Table1;

                var dataGrid = $("#test").dxDataGrid("instance");
                dataGrid.option("dataSource", resultData);
            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });

    }
    //#endregion


    // dtl 테이블 ADD 버튼 컨트롤 - 完
    function ControlAddButton(bool) { // true(막기) : false(열기)
        gridConference.option("toolbar.items[0].options.disabled", bool)
        gridRoom.option("toolbar.items[0].options.disabled", bool)
        gridMeal.option("toolbar.items[0].options.disabled", bool)
        gridEtc.option("toolbar.items[0].options.disabled", bool)
    }


    //#region 조회
    //견적 최초 조회 - 完
    function SearchFirstData() {

        var pageType = _fnToNull(QUOT_TYPE.option('value'));

        if (pageType == "MANAGE") {
            objJsonData.MNGT_NO = _fnToNull(REQ_NO.option('value'));
        }
        else {
            objJsonData.REQ_NO = _fnToNull(REQ_NO.option('value'));
        }

        var url = "";


        if (pageType == "EASY_QUOT") { // 간편 견적 (견적조회-> 등록) 최초 조회  (헤더만 조회)
            url = "/Quotation/fnGetNewQuotMst";
        }
        else if (pageType == "ONLINE_QUOT") { //상품 견적 (견적관리 -> 등록) 최초 조회 (디테일 까지 전체 조회)
            url = "/Quotation/fnGetOnlineQuotMst";
        }
        else if (pageType == "MANAGE") { //관리에서  (견적관리 -> 등록) 최초 조회
            url = "/Quotation/fnGetQuotManageDetail";
        }

        $.ajax({
            type: "POST",
            url: url,
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                //데이터바인딩
                var resultItem = JSON.parse(result).MAIN;


                //Data Binding
                gridQuotation.beginUpdate();
                gridQuotation.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridQuotation.option('dataSource', resultItem);
                gridQuotation.endUpdate();

                reqQuotObj.MAIN = resultItem;

                if (pageType == "ONLINE_QUOT") { //상품 견적 시 디테일 바인딩

                    var resultConf = JSON.parse(result).CONFERENCE;
                    var resultRoom = JSON.parse(result).ROOM;
                    var resultMeal = JSON.parse(result).MEAL;
                    var resultEtc = JSON.parse(result).SERVICE;

                    gridConference.beginUpdate();
                    gridConference.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridConference.option('dataSource', resultConf);
                    gridConference.endUpdate();

                    gridRoom.beginUpdate();
                    gridRoom.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridRoom.option('dataSource', resultRoom);
                    gridRoom.endUpdate();

                    gridMeal.beginUpdate();
                    gridMeal.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridMeal.option('dataSource', resultMeal);
                    gridMeal.endUpdate();

                    gridEtc.beginUpdate();
                    gridEtc.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridEtc.option('dataSource', resultEtc);
                    gridEtc.endUpdate();
                }

                // 견적 등록 버튼으로 접근 시 디테일 에딧팅 막기
                if (first_connect && pageType != "MANAGE") {
                    gridConference.option('disabled', true);
                    gridRoom.option('disabled', true);
                    gridMeal.option('disabled', true);
                    gridEtc.option('disabled', true);
                }

            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });
    }


    //헤더 클릭시 디테일 조회
    function fnSearchDetailData(quot_no) {
        var DtlObj = new Object();

        DtlObj.QUOT_NO = quot_no;
        tot_conf = 0;
        tot_meal = 0;
        tot_room = 0;
        tot_svc = 0;


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

                    if (resultData["CONF"].length > 0) {
                        tot_conf = parseInt(_fnToZero(resultData["CONF"][0].TOT_PRC));
                    }
                    

                    //숙박
                    gridRoom.beginUpdate();
                    gridRoom.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridRoom.option('dataSource', resultData["ROOM"]);
                    gridRoom.endUpdate();
                    gridRoom.option("toolbar.items[0].options.disabled", false) // 선택시 추가 버튼 활성화

                    if (resultData["ROOM"].length > 0) {
                        tot_room = parseInt(_fnToZero(resultData["ROOM"][0].TOT_PRC));
                    }
                    

                    //식사
                    gridMeal.beginUpdate();
                    gridMeal.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridMeal.option('dataSource', resultData["MEAL"]);
                    gridMeal.endUpdate();
                    gridMeal.option("toolbar.items[0].options.disabled", false) // 선택시 추가 버튼 활성화
                    if (resultData["MEAL"].length > 0) {
                        tot_meal = parseInt(_fnToZero(resultData["MEAL"][0].TOT_PRC));
                    }

                    //부가서비스
                    gridEtc.beginUpdate();
                    gridEtc.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridEtc.option('dataSource', resultData["SVC"]);
                    gridEtc.endUpdate();
                    gridEtc.option("toolbar.items[0].options.disabled", false) // 선택시 추가 버튼 활성화
                    if (resultData["SVC"].length > 0) {
                        tot_svc = parseInt(_fnToZero(resultData["SVC"][0].TOT_PRC));
                    }

                    mod_amt = tot_conf + tot_room + tot_meal + tot_svc;

                    gridQuotation.cellValue(row_cnt, mod_cell, mod_amt);

                }

            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });


    }

    //#endregion



    //#region 저장

    //견적 등록 함수 (헤더 저장버튼)
    function fnSaveQUOT() {
        gridQuotation.saveEditData();
        var arrCntr = new Array();
        arrCntr = gridQuotation.option('dataSource'); //헤더 그리드 바인딩

        var pageType = _fnToNull(QUOT_TYPE.option('value')); // 페이지 타입

        var url = ""; // 컨트롤러

        var quotUpObj = new Object(); //ajax 오브젝트

        quotUpObj.PAGE_TYPE = [{ "PAGE": _fnToNull(pageType) }];

        //#region 페이지 타입별 컨트롤 분개 처리
        if (pageType == "MANAGE") {
            url = "/Quotation/QuotUpdateHeader";
        }
        else {
            if (first_connect) { // 첫등록시
                url = "/Quotation/QuotFirstSave";
            }
            else {
                url = "/Quotation/QuotUpdateHeader";
            }
                
        }
        //#endregion


        //#region 필수 정보 등록 validation
        for (var i = -1; ++i < arrCntr.length;) {
            var curRow = arrCntr[i];
            if (_fnToNull(curRow.ITEM_NM) == "") {
                DevExpress.ui.dialog.alert("<i>상품정보를 입력해주세요</i>", "");
                return false;
            }
            else if (_fnToNull(curRow.TOT_AMT.toString()) == "") {
                DevExpress.ui.dialog.alert("<i>총 금액을 입력해주세요</i>", "");
                return false;
            } else {
                if (!curRow.hasOwnProperty("INSFLAG") || curRow.INSFLAG == "Q") {    // INSFLAG가 I , U 만 담기
                    arrCntr.splice(i, 1);
                    i--;    //배열의 전체 길이가 줄어들기때문에 i값도 변경한다.
                }
                if (curRow.INSFLAG == "I") {
                    quot_no = "QUOT" + _fnNow();
                    curRow.QUOT_NO = quot_no;
                }
            }
        }
        //#endregion


        quotUpObj.MAIN = arrCntr;



        //#region 최초 온라인 견적시 DTL 바인딩
        if (first_connect) { 
            
            if (pageType == "ONLINE_QUOT") {

                gridConference.saveEditData();
                arrCntr = gridConference.option('dataSource');

                for (var i = -1; ++i < arrCntr.length;) {
                    var curRow = arrCntr[i];
                    curRow.QUOT_NO = quot_no;
                    curRow.PRC = '';
                }

                quotUpObj.CONF = arrCntr;

                gridMeal.saveEditData();
                arrCntr = gridMeal.option('dataSource');

                for (var i = -1; ++i < arrCntr.length;) {
                    var curRow = arrCntr[i];
                    curRow.QUOT_NO = quot_no;
                    curRow.PRC = '';
                }

                quotUpObj.MEAL = arrCntr;



                gridRoom.saveEditData();
                arrCntr = gridRoom.option('dataSource');

                for (var i = -1; ++i < arrCntr.length;) {
                    var curRow = arrCntr[i];
                    curRow.QUOT_NO = quot_no;
                    curRow.PRC = '';
                }

                quotUpObj.ROOM = arrCntr;


                gridEtc.saveEditData();
                arrCntr = gridEtc.option('dataSource');

                for (var i = -1; ++i < arrCntr.length;) {
                    var curRow = arrCntr[i];
                    curRow.QUOT_NO = quot_no;
                    curRow.PRC = '';
                }

                quotUpObj.SVC = arrCntr;

            }
            
        }
        //#endregion 온라인 견적시 DTL 바인딩
        $.ajax({
            type: "POST",
            url: url,
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(quotUpObj) },
            success: function (result) {

                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    var resultItem = JSON.parse(result).MAIN;
                    gridQuotation.beginUpdate();
                    gridQuotation.saveEditData();
                    gridQuotation.option('dataSource', resultItem);
                    gridQuotation.endUpdate();

                    //#region 온라인 견적시 디테일 뷰


                    gridConference.beginUpdate();
                    gridConference.saveEditData();
                    gridConference.option('dataSource', '');
                    gridConference.endUpdate();


                    
                    gridRoom.beginUpdate();
                    gridRoom.saveEditData();
                    gridRoom.option('dataSource', '');
                    gridRoom.endUpdate();

                    

                    gridMeal.beginUpdate();
                    gridMeal.saveEditData();
                    gridMeal.option('dataSource', '');
                    gridMeal.endUpdate();



                    gridEtc.beginUpdate();
                    gridEtc.saveEditData();
                    gridEtc.option('dataSource', '');
                    gridEtc.endUpdate();


                    if (pageType == "ONLINE_QUOT") {
                        var resultConf = JSON.parse(result).CONF;

                        gridConference.beginUpdate();
                        gridConference.saveEditData();
                        gridConference.option('dataSource', resultConf);
                        gridConference.endUpdate();


                        var resultRoom = JSON.parse(result).ROOM;

                        gridRoom.beginUpdate();
                        gridRoom.saveEditData();
                        gridRoom.option('dataSource', resultRoom);
                        gridRoom.endUpdate();

                        var resultMeal = JSON.parse(result).MEAL;

                        gridMeal.beginUpdate();
                        gridMeal.saveEditData();
                        gridMeal.option('dataSource', resultMeal);
                        gridMeal.endUpdate();


                        var resultSVC = JSON.parse(result).SVC;

                        gridEtc.beginUpdate();
                        gridEtc.saveEditData();
                        gridEtc.option('dataSource', resultSVC);
                        gridEtc.endUpdate();

                        first_connect = false;

                        if (!first_connect) { // 헤더 최초 등록시 열기
                            //gridQuotation.option("toolbar.items[0].options.disabled", false);
                            gridConference.option('disabled', false);
                            gridRoom.option('disabled', false);
                            gridMeal.option('disabled', false);
                            gridEtc.option('disabled', false);
                        }
                        //#endregion
                        mng_yn = "Y" // 견적 완료 플래그

                    }
                }

            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });

    }



    //dtl 정보 저장 함수 
    function saveDTL(tab_nm) {

        var arrDtl = new Array();
        var control_url = "";
        //#region  Controller연결 정보 셋팅
        if (tab_nm == "CONF") {
            gridConference.saveEditData();
            arrDtl = gridConference.option('dataSource');
            control_url = "/AditemRegist/fnSaveConfDtl"
        }
        else if (tab_nm == "ROOM") {
            gridRoom.saveEditData();
            arrDtl = gridRoom.option('dataSource');
            control_url = "/AditemRegist/fnSaveRoomDtl"
        }
        else if (tab_nm == "MEAL") {
            gridMeal.saveEditData();
            arrDtl = gridMeal.option('dataSource');
            control_url = "/AditemRegist/fnSaveMealDtl"
        }
        else if (tab_nm == "SVC") {
            gridEtc.saveEditData();
            arrDtl = gridEtc.option('dataSource');
            control_url = "/AditemRegist/fnSaveSvcDtl"
        }
        else if (tab_nm == "IMG") {
            gridDoc.saveEditData();
            arrDtl = gridDoc.option('dataSource');
            control_url = "/AditemRegist/fnSaveImgDtl"
        }

        //#endregion

        for (var i = -1; ++i < arrDtl.length;) {
            var confDr = arrDtl[i];
            if (!confDr.hasOwnProperty("INSFLAG") || confDr.INSFLAG == "Q") {
                arrDtl.splice(i, 1);
                i--;
            }
        }

        $.ajax({
            type: "POST",
            url: control_url,
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(arrDtl) },
            success: function (result) {
                console.log("[" + tab_nm + " Save] - 성공");
                console.log(result);
                //데이터바인딩
                var resultData = JSON.parse(result).Table1;
                //#region Data Binding
                var alert_text = "";
                if (tab_nm == "CONF") {
                    gridConference.beginUpdate();
                    gridConference.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridConference.option('dataSource', resultData);
                    gridConference.endUpdate();
                    alert_text = "세미나 정보";
                }
                else if (tab_nm == "ROOM") {
                    gridRoom.beginUpdate();
                    gridRoom.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridRoom.option('dataSource', resultData);
                    gridRoom.endUpdate();
                    alert_text = "숙박 정보";
                }
                else if (tab_nm == "MEAL") {
                    gridMeal.beginUpdate();
                    gridMeal.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridMeal.option('dataSource', resultData);
                    gridMeal.endUpdate();
                    alert_text = "식사 정보";
                }
                else if (tab_nm == "SVC") {
                    gridEtc.beginUpdate();
                    gridEtc.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridEtc.option('dataSource', resultData);
                    gridEtc.endUpdate();
                    alert_text = "부가서비스 정보";
                }
                else if (tab_nm = "IMG") {
                    gridDoc.beginUpdate();
                    gridDoc.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridDoc.option('dataSource', resultData);
                    gridDoc.endUpdate();
                }

                DevExpress.ui.dialog.alert("<i>저장되었습니다.</i>", alert_text);
                //#endregion
            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });
    }


    //#endregion 저장

    //메일 전송 함수
    function sendQuotEmail(arrReqno) {
        if (arrReqno.length > 0) {

            for (var i = 0; i < arrReqno.length; i++) {
                if (_fnToNull(arrReqno[i]["FILE_NM"]) == "") {
                    DevExpress.ui.dialog.alert("<i>견적서를 업로드해주세요.</i>", "");
                    objJsonArray = new Array(); // 초기화
                    return false;
                }
            }
            $.ajax({
                type: "POST",
                url: "/Quotation/fnQRegistSendEmail",
                async: true,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(arrReqno) },
                success: function (result) {
                    //데이터바인딩
                    var resultData = JSON.parse(result).MAIN;
                    //Data Binding
                    gridQuotation.beginUpdate();
                    gridQuotation.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridQuotation.option('dataSource', resultData);
                    gridQuotation.endUpdate();


                    objJsonArray = new Array(); // 초기화


                    DevExpress.ui.dialog.alert("<i>견적서를 전송하였습니다</i>", "");


                }, error: function (xhr, status, error) {
                    console.log("에러");
                    console.log(error);
                }
            });

        }
        else {
            DevExpress.ui.dialog.alert("<i>메일 발송할 견적을 선택해주세요.</i>", "");
            objJsonArray = new Array(); // 초기화
        }
    }



    //dtl 업데이트
    function fnUpdateDetailData(quot_no) {
        var url = "";
        var UpdateObj = new Object();


        var arrDtl = new Array();

        var past_amt = 0;


        if (tab_nm == "CONF") {
            url = "/Quotation/fnUpdateConfDetail";
            gridConference.saveEditData();
            arrDtl = gridConference.option('dataSource');
            past_amt = parseInt(_fnToZero(tot_conf));
        }
        else if (tab_nm == "ROOM") {
            url = "/Quotation/fnUpdateRoomDetail";
            gridRoom.saveEditData();
            arrDtl = gridRoom.option('dataSource');
            past_amt = parseInt(_fnToZero(tot_room));
        }
        else if (tab_nm == "MEAL") {
            url = "/Quotation/fnUpdateMealDetail";
            gridMeal.saveEditData();
            arrDtl = gridMeal.option('dataSource');
            past_amt = parseInt(_fnToZero(tot_meal));
        }
        else if (tab_nm == "SVC") {
            url = "/Quotation/fnUpdateSvcDetail";
            gridEtc.saveEditData();
            arrDtl = gridEtc.option('dataSource');
            past_amt = parseInt(_fnToZero(tot_svc));
        }


        var now_amt = 0;

        for (var i = -1; ++i < arrDtl.length;) {
            var dtlDr = arrDtl[i];
            if (!dtlDr.hasOwnProperty("INSFLAG") || dtlDr.INSFLAG != "D") { // 삭제건 제외
                now_amt += parseInt(_fnToZero(arrDtl[i].PRC));
            }
            
            if (!dtlDr.hasOwnProperty("INSFLAG") || dtlDr.INSFLAG == "Q") {
                arrDtl.splice(i, 1);
                i--;
            }
        }

        if (tab_nm == "CONF") {
            tot_conf = now_amt;
        }
        else if (tab_nm == "ROOM") {
            tot_room = now_amt;
        }
        else if (tab_nm == "MEAL") {
            tot_meal = now_amt;
        }
        else if (tab_nm == "SVC") {
            tot_svc = now_amt;
        }


        mod_amt += (now_amt - past_amt);

        gridQuotation.cellValue(row_cnt, mod_cell, mod_amt);

        $.ajax({
            type: "POST",
            url: url,
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(arrDtl) },
            success: function (result) {

                var resultData = JSON.parse(result);

                if (resultData["Result"][0].trxCode == "Y") {
                    var DtlTable = resultData.Table1;

                    var alert_text = "";

                    if (tab_nm == "CONF") {
                        gridConference.beginUpdate();
                        gridConference.saveEditData();
                        gridConference.option('dataSource', DtlTable);
                        gridConference.endUpdate();
                        alert_text = "세미나실 정보";
                    }


                    if (tab_nm == "ROOM") {
                        gridRoom.beginUpdate();
                        gridRoom.saveEditData();
                        gridRoom.option('dataSource', DtlTable);
                        gridRoom.endUpdate();
                        alert_text = "숙박 정보";
                    }
                    if (tab_nm == "MEAL") {
                        gridMeal.beginUpdate();
                        gridMeal.saveEditData();
                        gridMeal.option('dataSource', DtlTable);
                        gridMeal.endUpdate();
                        alert_text = "식사 정보";
                    }

                    if (tab_nm == "SVC") {
                        gridEtc.beginUpdate();
                        gridEtc.saveEditData();
                        gridEtc.option('dataSource', DtlTable);
                        gridEtc.endUpdate();
                        alert_text = "부가서비스 정보";
                    }

                    DevExpress.ui.dialog.alert("<i>저장되었습니다.</i>", alert_text);

                }

            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });
    }




    function headerUpdate(type) {

        gridQuotation.saveEditData();
        var arrCntr = new Array();
        arrCntr = gridQuotation.option('dataSource');
        var rowObject = new Object();
        var pageType = _fnToNull(QUOT_TYPE.option('value'))
        var url = "";
        
        if (type == "FILE") { // 파일 저장시
            url = "/Quotation/QuotFirstSave";
        }
        else if (type == "ITEM") { //상품 저장시
            url = "/Quotation/MNGITEMUpdate";
        }

        rowObject.PAGE_TYPE = [{ "PAGE": _fnToNull(pageType) }];


        for (var i = -1; ++i < arrCntr.length;) {
            var curRow = arrCntr[i]
            if (!curRow.hasOwnProperty("INSFLAG") || curRow.INSFLAG == "Q") {    // INSFLAG가 생성된 것만 처리
                arrCntr.splice(i, 1);
                i--;    //배열의 전체 길이가 줄어들기때문에 i값도 변경한다.
            }
            if (curRow.INSFLAG == "I") {
                quot_no = "QUOT" + _fnNow();
                curRow.QUOT_NO = quot_no;
            }
        }

        rowObject.MAIN = arrCntr;


        //#region 최초 온라인 견적시 DTL 바인딩
        if (first_connect) {

            if (pageType == "ONLINE_QUOT") {

                gridConference.saveEditData();
                arrCntr = gridConference.option('dataSource');

                for (var i = -1; ++i < arrCntr.length;) {
                    var curRow = arrCntr[i];
                    curRow.QUOT_NO = quot_no;
                    curRow.PRC = '';
                }

                rowObject.CONF = arrCntr;

                gridMeal.saveEditData();
                arrCntr = gridMeal.option('dataSource');

                for (var i = -1; ++i < arrCntr.length;) {
                    var curRow = arrCntr[i];
                    curRow.QUOT_NO = quot_no;
                    curRow.PRC = '';
                }

                rowObject.MEAL = arrCntr;



                gridRoom.saveEditData();
                arrCntr = gridRoom.option('dataSource');

                for (var i = -1; ++i < arrCntr.length;) {
                    var curRow = arrCntr[i];
                    curRow.QUOT_NO = quot_no;
                    curRow.PRC = '';
                }

                rowObject.ROOM = arrCntr;


                gridEtc.saveEditData();
                arrCntr = gridEtc.option('dataSource');

                for (var i = -1; ++i < arrCntr.length;) {
                    var curRow = arrCntr[i];
                    curRow.QUOT_NO = quot_no;
                    curRow.PRC = '';
                }

                rowObject.SVC = arrCntr;


            }

        }

        $.ajax({
            type: "POST",
            url: url,
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(rowObject) },
            success: function (result) {
                if (JSON.parse(result).Result[0].trxCode == "Y") {
                    first_connect = false;


                    var resultItem = JSON.parse(result).MAIN;
                    gridQuotation.beginUpdate();
                    gridQuotation.saveEditData();
                    gridQuotation.option('dataSource', resultItem);
                    gridQuotation.endUpdate();

                    //#region 온라인 견적시 디테일 뷰

                    if (pageType == "ONLINE_QUOT") {
                        var resultConf = JSON.parse(result).CONF;

                        gridConference.beginUpdate();
                        gridConference.saveEditData();
                        gridConference.option('dataSource', resultConf);
                        gridConference.endUpdate();


                        var resultRoom = JSON.parse(result).ROOM;

                        gridRoom.beginUpdate();
                        gridRoom.saveEditData();
                        gridRoom.option('dataSource', resultRoom);
                        gridRoom.endUpdate();

                        var resultMeal = JSON.parse(result).MEAL;

                        gridMeal.beginUpdate();
                        gridMeal.saveEditData();
                        gridMeal.option('dataSource', resultMeal);
                        gridMeal.endUpdate();


                        var resultSVC = JSON.parse(result).SVC;

                        gridEtc.beginUpdate();
                        gridEtc.saveEditData();
                        gridEtc.option('dataSource', resultSVC);
                        gridEtc.endUpdate();

                        first_connect = false;

                        if (!first_connect) { // 헤더 최초 등록시 열기
                            gridConference.option('disabled', false);
                            gridRoom.option('disabled', false);
                            gridMeal.option('disabled', false);
                            gridEtc.option('disabled', false);
                        }


                        if (type == "FILE") {
                            DevExpress.ui.dialog.alert("<i>견적서가 업로드 되었습니다.</i>", "");
                        }
                        if (type == "ITEM") {
                            DevExpress.ui.dialog.alert("<i>상품이 변경되었습니다 </i>", "");
                        }
                    }
                }
            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });

    }






    //#endregion



    // 견적 등록  [간편 견적 - 헤더만 MNG 저장 || 온라인 견적 - 헤더 + 디테일 MNG 저장]
    function fnSaveQuotation() {
        gridQuotation.saveEditData();
        var arrCntr = new Array();
        arrCntr = gridQuotation.option('dataSource');
        var quot_no = "";
        var pageType = _fnToNull(QUOT_TYPE.option('value'));
        var quotUpObj = new Object();

        var ulr = "";

        if (pageType == "ONLINE_QUOT" && first_connect) {
            url = "/Quotation/fnSaveOnLineQUOT";


        }
        else if (pageType == "EASY_QUOT") {
            url = "/Quotation/fnSaveQuotationList"; // 완료
        }


        for (var i = -1; ++i < arrCntr.length;) {
            var curRow = arrCntr[i];
            if (_fnToNull(curRow.ITEM_NM) == "") {
                DevExpress.ui.dialog.alert("<i>상품정보를 입력해주세요</i>", "");
                return false;
            }
            else if (_fnToNull(curRow.TOT_AMT) == "") {
                DevExpress.ui.dialog.alert("<i>총 금액을 입력해주세요</i>", "");
                return false;
            } else {
                if (!curRow.hasOwnProperty("INSFLAG") || curRow.INSFLAG == "Q") {    // INSFLAG가 생성된 것만 처리
                    arrCntr.splice(i, 1);
                    i--;    //배열의 전체 길이가 줄어들기때문에 i값도 변경한다.
                }
                if (curRow.INSFLAG == "I") {
                    quot_no = "QUOT" + _fnNow();
                    curRow.QUOT_NO = quot_no;
                }
            }
        }


        quotUpObj.MAIN = arrCntr;



        //#region 온라인 견적시 DTL 바인딩
        if (pageType == "ONLINE_QUOT") {

            gridConference.saveEditData();
            arrCntr = gridConference.option('dataSource');

            for (var i = -1; ++i < arrCntr.length;) {
                var curRow = arrCntr[i];
                curRow.QUOT_NO = quot_no;
                curRow.PRC = '';
            }

            quotUpObj.CONF = arrCntr;

            gridMeal.saveEditData();
            arrCntr = gridMeal.option('dataSource');

            for (var i = -1; ++i < arrCntr.length;) {
                var curRow = arrCntr[i];
                curRow.QUOT_NO = quot_no;
                curRow.PRC = '';
            }

            quotUpObj.MEAL = arrCntr;



            gridRoom.saveEditData();
            arrCntr = gridRoom.option('dataSource');

            for (var i = -1; ++i < arrCntr.length;) {
                var curRow = arrCntr[i];
                curRow.QUOT_NO = quot_no;
                curRow.PRC = '';
            }

            quotUpObj.ROOM = arrCntr;


            gridEtc.saveEditData();
            arrCntr = gridEtc.option('dataSource');

            for (var i = -1; ++i < arrCntr.length;) {
                var curRow = arrCntr[i];
                curRow.QUOT_NO = quot_no;
                curRow.PRC = '';
            }

            quotUpObj.SVC = arrCntr;


        }

        //#endregion

        $.ajax({
            type: "POST",
            url: url,
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(quotUpObj) },
            success: function (result) {

                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    var resultItem = JSON.parse(result).MAIN;
                    gridQuotation.beginUpdate();
                    gridQuotation.saveEditData();
                    gridQuotation.option('dataSource', resultItem);
                    gridQuotation.endUpdate();

                    //#region 온라인 견적시 디테일 뷰

                    if (pageType == "ONLINE_QUOT") {
                        var resultConf = JSON.parse(result).CONF;

                        gridConference.beginUpdate();
                        gridConference.saveEditData();
                        gridConference.option('dataSource', resultConf);
                        gridConference.endUpdate();


                        var resultRoom = JSON.parse(result).ROOM;

                        gridRoom.beginUpdate();
                        gridRoom.saveEditData();
                        gridRoom.option('dataSource', resultRoom);
                        gridRoom.endUpdate();

                        var resultMeal = JSON.parse(result).MEAL;

                        gridMeal.beginUpdate();
                        gridMeal.saveEditData();
                        gridMeal.option('dataSource', resultMeal);
                        gridMeal.endUpdate();


                        var resultSVC = JSON.parse(result).SVC;

                        gridEtc.beginUpdate();
                        gridEtc.saveEditData();
                        gridEtc.option('dataSource', resultSVC);
                        gridEtc.endUpdate();

                        first_online_save = false;

                        if (!first_online_save) { // 헤더 최초 등록시 열기
                            gridConference.option('disabled', false);
                            gridRoom.option('disabled', false);
                            gridMeal.option('disabled', false);
                            gridEtc.option('disabled', false);
                        }

                        mng_yn = "Y" // 견적 완료 플래그

                    }

                    //#endregion
                    /*openAddButton();*/
                }

            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });
    }



//#region load Page
    if (_fnToNull(REQ_NO.option('value')) != "") {
        SearchFirstData();
    }
//#endregion

});