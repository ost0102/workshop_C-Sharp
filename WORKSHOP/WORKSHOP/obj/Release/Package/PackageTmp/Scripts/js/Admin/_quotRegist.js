var objJsonData = new Object();
var tab_nm = "CONF";
var quot = "";
var objJsonArray = new Array();
var first_online_save = true;
var row_cnt = 0;
var mng_yn = "N"; // 견적이 등록 되었는 지 

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

    //var STRT_YMD = $("#STRT_YMD").dxDateBox({
    //    value: "",
    //    width: 200,
    //    value: new Date()
    //}).dxDateBox('instance');

    //var END_YMD = $("#END_YMD").dxDateBox({
    //    value: "",
    //    width: 200,
    //    value: new Date()
    //}).dxDateBox('instance');


    var ITEM_NM = $("#ITEM_NM").dxTextBox({
        value: "",
        width: 200,
        visible:false,
    }).dxTextBox('instance');



    //var STATUS = $("#STATUS").dxSelectBox({
    //    dataSource: [{ CODE: "N", NAME: "견적요청" }, { CODE: "Y", NAME: "견적완료" }],
    //    width: 200,
    //    displayExpr: "NAME",
    //    valueExpr: "CODE",
    //}).dxSelectBox('instance');

    //var btnSearch = $("#btnSearch").dxButton({
    //    text: "검색",
    //    onClick: function () {
    //        SearchData();
    //    }
    //}).dxButton('instance');


    //var GRP_CD = $("#GRP_CD").dxSelectBox({
    //    width: 150,
    //    displayExpr: "COMM_NM",
    //    valueExpr: "COMM_CD",
    //    acceptCustomValue: true,
    //    dataSource: layoutGRP_CD.option('dataSource')
    //}).dxSelectBox('instance');


    //#endregion

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
                                             //saveQuotation("ITEM");

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
            allowAdding: false,
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
                visible : false
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
                dataField: 'QUOT_TYPE',
                caption: '견적구분',
                allowEditing: false,
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    if (s == "A") return "간편견적";
                    else return "온라인견적";
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
                    if (_fnToNull(options.data.EMAIL_YN)!= "N") {
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
                                        if (gridQuotation.cellValue(options.rowIndex, "INSFLAG") == "Q") {
                                            gridQuotation.cellValue(options.rowIndex, "INSFLAG", "U");
                                        }
                                        gridQuotation.cellValue(options.rowIndex, "FILE_PATH", JSON.parse(e.request.responseText).res_msg);
                                        /*var result = DevExpress.ui.dialog.confirm("<i>견적서를 업로드하시겠습니까?</i>", "");*/
                                        /*result.done(function (dialogResult) {*/
                                        saveQuotation("FILE");
                                        /*});*/

                                    } else {

                                    }
                                },
                            }).appendTo(container);
                    }
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
                visible : false
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
                                        arrReqno["REQGIST"] = mng_yn;
                                        arrReqno["QUOT_NO"] = arrData[i]["QUOT_NO"];
                                    }

                                }
                                objJsonArray.push(arrReqno);
                            }
                            sendEmail(objJsonArray);
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
        onSelectionChanged(selectedItems, e) {
            const data = selectedItems.selectedRowsData[0];
            if (_fnToNull(data) != "") {
                if (data.INSFLAG != "M") {
                    openAddButton();
                    if (selectedItems.selectedRowKeys.length > 0) {
                        row_cnt = selectedItems.component.getRowIndexByKey(selectedItems.selectedRowKeys[0]);
                    }
                    
                    quot = data.QUOT_NO;
                    fnSearchDetailData(quot);
                }
                else {
                    blockAddButton();
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
            e.data.TOT_AMT = '';
        },
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

    var gridConference = $("#gridConference").dxDataGrid({
        dataSource: [],
        showBorders: true,
        showRowLines: true,
        allowColumnResizing: true,
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
                    valueExpr: "CONF_CD",  // The value field in the data source
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
        //onEditorPreparing: function (e) {
        //    getSelectBox(e, e.dataField);
        //},
    }).dxDataGrid('instance');
    var gridRoom = $("#gridRoom").dxDataGrid({
        showBorders: true,
        showRowLines: true,
        allowColumnResizing: true,
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
    }).dxDataGrid('instance');


    var gridMeal = $("#gridMeal").dxDataGrid({
        showBorders: true,
        showRowLines: true,
        allowColumnResizing: true,
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
    }).dxDataGrid('instance');


    var gridEtc = $("#gridEtc").dxDataGrid({
        showBorders: true,
        showRowLines: true,
        allowColumnResizing: true,
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



    //상품 조회
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


    

    //견적 최초 조회
    function SearchData() {
        objJsonData.REQ_NO = _fnToNull(REQ_NO.option('value'));
        var url = "";
        var pageType = _fnToNull(QUOT_TYPE.option('value'));
        if (pageType == "EASY_QUOT") { // 간편 견적 (견적조회-> 등록) 최초 조회
            url = "/Quotation/fnGetNewQuotMst";
        }
        else if (pageType == "ONLINE_QUOT") { //온라인 견적 (견적관리 -> 등록) 최초 조회
            url = "/Quotation/fnGetOnlineQuotMst";
        }
        else if (pageType == "COMPARE") { //비교견적 (견적관리 -> 등록) 최초 조회
            url = "/Quotation/fnGetQuotMst";
        } else if (pageType == "MANAGE") { //관리에서  (견적관리 -> 등록) 최초 조회
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



                if (pageType == "COMPARE" || pageType == "ONLINE_QUOT") { //비교견적 시에 바인딩

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

                    
                    

                    if (first_online_save && pageType != "MANAGE") { // 최초 검색시 사용 막기
                        gridConference.option('disabled', true);
                        gridRoom.option('disabled', true);
                        gridMeal.option('disabled', true);
                        gridEtc.option('disabled', true);
                    }


                }

            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });
    }



    // 견적 등록  [간편 견적 - 헤더만 MNG 저장 || 온라인 견적 - 헤더 + 디테일 MNG 저장]
    function fnSaveQuotation() {
        gridQuotation.saveEditData();
        var arrCntr = new Array();
        arrCntr = gridQuotation.option('dataSource');
        var quot_no = "";
        var pageType = _fnToNull(QUOT_TYPE.option('value'));
        var quotUpObj = new Object();

        var ulr = "";

        if (pageType == "ONLINE_QUOT" && first_online_save) {
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
                if (curRow.INSFLAG == "I"){
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
     
    //상품 업데이트 
    function saveQuotation(type) {
        gridQuotation.saveEditData();
        var arrCntr = new Array();
        arrCntr = gridQuotation.option('dataSource');
        var url = "";
        if (type == "FILE") {
            url = "/Quotation/fnSaveQuotation"
        }
        else {
            url = "/Quotation/fnSaveItem"
        }
        

        for (var i = -1; ++i < arrCntr.length;) {
            var curRow = arrCntr[i]
            if (!curRow.hasOwnProperty("INSFLAG") || curRow.INSFLAG == "Q") {    // INSFLAG가 생성된 것만 처리
                arrCntr.splice(i, 1);
                i--;    //배열의 전체 길이가 줄어들기때문에 i값도 변경한다.
            }
        }
        $.ajax({
            type: "POST",
            url: url,
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(arrCntr) },
            success: function (result) {
                if (JSON.parse(result).Result[0].trxCode == "Y") {
                    SearchData();
                    if (type == "FILE") {
                        DevExpress.ui.dialog.alert("<i>견적서가 업로드 되었습니다.</i>", "");
                    }
                }
                
            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });

    }


    //비교견적 등록
    function ConfirmQuotation() {
        gridQuotation.saveEditData();
        var arrCntr = new Array();
        arrCntr = gridQuotation.option('dataSource');

        for (var i = -1; ++i < arrCntr.length;) {
            var curRow = arrCntr[i];
            if (_fnToNull(curRow.ITEM_CD) == "") {
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
            }
        }
        $.ajax({
            type: "POST",
            url: "/Quotation/fnConfirmQuotation",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(arrCntr) },
            success: function (result) {
                if (JSON.parse(result).rec_cd == "Y") {
                    SearchData();
                    openAddButton();
                }

            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });

    }




    // dtl 테이블 추가 버튼 활성 함수
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

    function sendEmail(arrReqno) {
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
                url: "/Quotation/fnSendEmail",
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
        else{
            DevExpress.ui.dialog.alert("<i>메일 발송할 견적을 선택해주세요.</i>", "");
            objJsonArray = new Array(); // 초기화
        }
    }

    if (_fnToNull(REQ_NO.option('value')) != "") {
        SearchData();
    }


    //function SearchDataAll() {


    //    $.ajax({
    //        type: "POST",
    //        url: "/Quotation/fnGetAllList",
    //        async: true,
    //        dataType: "json",
    //        data: { "vJsonData": _fnMakeJson(arrCntr) },
    //        success: function (result) {
    //            if (JSON.parse(result).rec_cd == "Y") {
    //                gridQuotation.beginUpdate();
    //                gridQuotation.saveEditData();
    //                gridQuotation.option('dataSource', resultItem);
    //                gridQuotation.endUpdate();
    //            }

    //        }, error: function (xhr, status, error) {
    //            console.log("에러");
    //            console.log(error);
    //        }
    //    });


    //}



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

                if (tab_nm == "CONF") {
                    gridConference.beginUpdate();
                    gridConference.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridConference.option('dataSource', resultData);
                    gridConference.endUpdate();
                }
                else if (tab_nm == "ROOM") {
                    gridRoom.beginUpdate();
                    gridRoom.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridRoom.option('dataSource', resultData);
                    gridRoom.endUpdate();
                }
                else if (tab_nm == "MEAL") {
                    gridMeal.beginUpdate();
                    gridMeal.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridMeal.option('dataSource', resultData);
                    gridMeal.endUpdate();
                }
                else if (tab_nm == "SVC") {
                    gridEtc.beginUpdate();
                    gridEtc.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridEtc.option('dataSource', resultData);
                    gridEtc.endUpdate();
                }
                else if (tab_nm = "IMG") {
                    gridDoc.beginUpdate();
                    gridDoc.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridDoc.option('dataSource', resultData);
                    gridDoc.endUpdate();
                }

                DevExpress.ui.dialog.alert("<i>저장되었습니다.</i>", "");
                //#endregion
            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });
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


    //dtl 업데이트

    function fnUpdateDetailData(quot_no) {
        var url = "";
        var UpdateObj = new Object();


        var arrDtl = new Array();


        if (tab_nm == "CONF") {
            url = "/Quotation/fnUpdateConfDetail";
            gridConference.saveEditData();
            arrDtl = gridConference.option('dataSource');
        }
        else if (tab_nm == "ROOM") {
            url = "/Quotation/fnUpdateRoomDetail";
            gridRoom.saveEditData();
            arrDtl = gridRoom.option('dataSource');
        }
        else if (tab_nm == "MEAL") {
            url = "/Quotation/fnUpdateMealDetail";
            gridMeal.saveEditData();
            arrDtl = gridMeal.option('dataSource');
        }
        else if (tab_nm == "SVC") {
            url = "/Quotation/fnUpdateSvcDetail";
            gridEtc.saveEditData();
            arrDtl = gridEtc.option('dataSource');
        }

        

        for (var i = -1; ++i < arrDtl.length;) {
            var dtlDr = arrDtl[i];
            if (!dtlDr.hasOwnProperty("INSFLAG") || dtlDr.INSFLAG == "Q") {
                arrDtl.splice(i, 1);
                i--;
            }
        }

        $.ajax({
            type: "POST",
            url: url,
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(arrDtl) },
            success: function (result) {

                var resultData = JSON.parse(result);

                if (resultData["Result"][0].trxCode == "Y") {
                    var DtlTable = resultData.Table1;


                    if (tab_nm == "CONF") {
                        gridConference.beginUpdate();
                        gridConference.saveEditData();
                        gridConference.option('dataSource', DtlTable);
                        gridConference.endUpdate();
                    }


                    if (tab_nm == "ROOM") {
                        gridRoom.beginUpdate();
                        gridRoom.saveEditData();
                        gridRoom.option('dataSource', DtlTable);
                        gridRoom.endUpdate();
                    }
                    if (tab_nm == "MEAL") {
                        gridMeal.beginUpdate();
                        gridMeal.saveEditData();
                        gridMeal.option('dataSource', DtlTable);
                        gridMeal.endUpdate();
                    }

                    if (tab_nm == "SVC") {
                        gridEtc.beginUpdate();
                        gridEtc.saveEditData();
                        gridEtc.option('dataSource', DtlTable);
                        gridEtc.endUpdate();
                    }

                    DevExpress.ui.dialog.alert("<i>저장되었습니다.</i>", "");

                }

            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });
    }

});