var objJsonData = new Object();
var tab_nm = "CONF";
var bkg = "";
var objJsonArray = new Array();
var mod_amt = 0;
var tot_conf = 0;
var tot_meal = 0;
var tot_room = 0;
var tot_svc = 0;
var mod_tot_amt = 0; // 초기 합산 값
var modtot_prc = 0; // 최종수정값
var first_connect = true;
var BkgStatus = "";


$(function () {


    DevExpress.ui.dxDateBox.defaultOptions({
        options: {
            showClearButton: false,
            type: "date",
            displayFormat: "yyyy-MM-dd"
        }
    });

    //#region GET 파라미터

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

    //#region  팝업
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
               $("<div id='test'>")
                        .dxDataGrid({
                            allowColumnResizing: true,
                            showRowLines: true,
                         columns: [
                         {
                             dataField: 'INSFLAG',
                                 allowEditing: false,
                                 visible: false
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
                             allowEditing: false,
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
                                             if (gridBookingHeader.cellValue(0, "INSFLAG") == "Q") {
                                                 gridBookingHeader.cellValue(0, "INSFLAG", "U");
                                             }
                                             
                                             gridBookingHeader.cellValue(0, "ITEM_CD", cellInfo.data.ITEM_CD);
                                             gridBookingHeader.cellValue(0, "ITEM_NM", cellInfo.data.ITEM_NM);
                                             gridBookingHeader.cellValue(0, "AREA", cellInfo.data.AREA);
                                             //saveQuotation("ITEM");

                                             

                                             svaeBKGHD("ITEM");

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
                             caption: '홈페이지 주소'
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

    //#endregion


    //#region 그리드
    var gridBookingHeader = $("#gridItem").dxDataGrid({
        hoverStateEnabled: true,
        allowColumnResizing: true,
        showRowLines: true,
        height: 510,
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
        scrolling: {
            mode: 'virtual',
        },
        selection: {
            mode: 'single',
        },
        paging: {
            enabled: false,
        },
        columns: [
            {
                dataField: 'BKG_NO',
                allowEditing: false,
                width: 180,
                fixed: true,
                fixedPosition: "left",
            },
            {
                dataField: 'BKG_STATUS',
                caption: '예약상태',
                allowEditing: false,
                width: 100,
                fixed: true,
                fixedPosition: "left",
                cellTemplate: function (container, options) {
                    if (options.data.BKG_STATUS == "Y") {
                        $("<div/>").addClass("bkg_end").text("예약").appendTo(container);
                    }
                    else if (options.data.BKG_STATUS == "N") {
                        $("<div/>").addClass("bkg_req").text("요청").appendTo(container);
                    }
                    else if (options.data.BKG_STATUS == "F") {
                        $("<div/>").addClass("end_process").text("확정").appendTo(container);
                    }
                    else if (options.data.BKG_STATUS == "M") {
                        $("<div/>").addClass("bkg_mod").text("수정").appendTo(container);
                    }
                    else {
                        $("<div/>").addClass("bkg_cancel").text("취소").appendTo(container);
                    }
                },
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    if (s == "Y") {
                        s = "예약"
                    } else if (s == "N") {
                        s = "요청"
                    } else if (s == "F") {
                        s = "확정"
                    }
                    else if (s == "M") {
                        s = "수정"
                    }
                    else {
                        s = "취소"
                    }

                    return s;
                }
            },
            {
                dataField: 'EMAIL_YN',
                caption: '예약확인서 발송여부',
                width: 160,
                fixed: true,
                fixedPosition: "left",
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
                caption: '예약확인서 업로드',
                allowEditing: false,
                alignment: "center",
                width: 140,
                cellTemplate: function (container, options) {
                    var check_disable = false;
                    if (BkgStatus == "F") {
                        check_disable = true;
                    }
                        $("<div/>").attr("id","upload_btn")
                            .dxFileUploader({
                                selectButtonText: '업로드',
                                labelText: '',
                                multiple: false,
                                disabled: check_disable,
                                value: [],
                                uploadMode: "instantly",
                                uploadFailedMessage: "파일 업로드를 처리 하지 못했습니다.",
                                uploadUrl: "/Admin/UploadHandler",
                                onValueChanged: function (e) {
                                },
                                onUploaded: function (e) {
                                    if (JSON.parse(e.request.responseText).rec_cd == "Y") {
                                        gridBookingHeader.cellValue(options.rowIndex, "FILE_NM", e.file.name);
                                        if (gridBookingHeader.cellValue(options.rowIndex, "INSFLAG") == "Q") {
                                            gridBookingHeader.cellValue(options.rowIndex, "INSFLAG", "U");
                                        }
                                        gridBookingHeader.cellValue(options.rowIndex, "FILE_PATH", JSON.parse(e.request.responseText).res_msg);
                                        //var result = DevExpress.ui.dialog.confirm("<i>예약확인서를 업로드하시겠습니까?</i>", "");
                                        //result.done(function (dialogResult) {
                                        //saveQuotation("FILE");
                                        svaeBKGHD("FILE");
                                        //});

                                    } else {

                                    }
                                },
                            }).appendTo(container);
                }
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
                dataField: 'ITEM_BTN',
                caption: '상품선택',
                allowEditing: false,
                alignment: "center",
                width: 120,
                cellTemplate: function (cellElement, cellInfo) {
                    //if (_fnToNull(cellInfo.value) == "") {
                    //    $('<a/>').addClass('dx-link')
                    //    .text("상품불러오기")
                    //    .on('dxclick', function () {
                    //        $("#popup").dxPopup("instance").show();
                    //     })
                    //    .appendTo(cellElement);
                    var check_disable = false;
                    if (BkgStatus == "F") {
                        check_disable = true;
                    }
                    if (_fnToNull(cellInfo.value) == "") {
                        var Btn1 = $('<div/>').attr("id","item_btn").dxButton({
                            text: "상품찾기",
                            disabled: check_disable,
                            onClick: function () {
                                $("#popup").dxPopup("instance").show();
                            }
                        }).appendTo(cellElement);
                    } else {
                        return cellInfo.value;
                    }
                }
            },
            {
                dataField: 'AREA',
                caption: '지역',
                allowEditing: false,
                width: 90
            },
            {
                dataField: 'ITEM_NM',
                caption: '상품명',
                width: 140,
                alignment: "center",
                allowEditing: false,
                cellTemplate: function (cellElement, cellInfo) {
                    $('<a/>').addClass('dx-link')
                        .text(cellInfo.value)
                        .on('dxclick', function () {
                            window.open("/Admin/infoPop?itemCD=" + cellInfo.key.ITEM_CD, '_blank', 'width=600,height=630, scrollbars=no');
                        }).appendTo(cellElement);
                }
            },
            {
                dataField: 'TOT_AMT',
                caption: '총 금액',
                width: 140,
                dataType: 'number',
                format: "fixedpoint"
            },
            {
                dataField: 'CHANGE_AMT',
                caption: '수정 금액',
                width: 140,
                allowEditing: false,
                dataType: 'number',
                format: "fixedpoint"
            },
            {
                dataField: 'MIL_POINT',
                caption: '마일리지',
                width: 140,
                dataType: 'number',
                format: "fixedpoint"
            },
            {
                dataField: 'STRT_DT',
                caption: '시작날짜',
                width:90,
                allowEditing: false,
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
                dataField: 'END_DT',
                caption: '종료날짜',
                width: 90,
                allowEditing: false,
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
                dataField: 'HEAD_CNT',
                caption: '예상 인원',
                width: 100,
                dataType: 'number',
                format: "fixedpoint"
            },
            
            {
                dataField: 'CUST_NM',
                caption: '요청자명',
                width:120,
                allowEditing: false
            },
            {
                dataField: 'CUST_EMAIL',
                caption: '요청자 이메일',
                width: 150,
                allowEditing: false
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
                }
            },

            {
                dataField: 'RMK',
                caption: '비고',
                width: 300,
                allowEditing: false
            },
            {
                dataField: 'FILE_PATH',
                caption: '파일 경로',
                allowEditing: false,
                visible: false
            },
            {
                dataField: 'INSFLAG',
                visible: false
            },
            {
                dataField: 'ITEM_CD',
                caption: '상품코드',
                allowEditing: false,
                visible: false
            },
        ],
        toolbar: {
            items: [
                {
                    widget: 'dxButton',
                    options: {
                        text: '목록',
                        onClick(e) {
                            location.href = "/Admin/bkgList";

                        }
                    },

                },
            {
            name: 'saveButton',
            showText: 'always',
            options: {
                text: '저장',
                onClick(e) {
                   
                    var price = _fnToNull(gridBookingHeader.cellValue(0, 9));
                    var tot = _fnToNull(gridBookingHeader.cellValue(0, 8));
                    if (price != "" && price != "0" && price != tot) {
                        var confirm_alert = DevExpress.ui.dialog.confirm("수정금액으로 저장하시겠습니까?", "");
                        confirm_alert.done(function (dialogalert) {
                            if (dialogalert) { // 수정일 경우
                                gridBookingHeader.cellValue(0, 8, price);
                                fnSaveBKG();
                            }
                            else {
                                fnSaveBKG();
                            }
                        })
                    }
                    else {
                        fnSaveBKG();
                    }
                    
                }
            },
            },
            {
                widget: 'dxButton',
                options: {
                    text: '이메일 보내기',
                    onClick(e) {
                        gridBookingHeader.saveEditData();
                        //arrCntr = gridBookingHeader.option('dataSource');
                        arrCntr = gridBookingHeader.getSelectedRowsData();
                        var arrReqno = {};
                        if (arrCntr.length > 0) {
                            for (var i = 0; i < arrCntr.length; i++) {
                                if (_fnToNull(arrCntr[i]["BKG_NO"]) != '') {
                                    arrReqno = { id: i + 1 };
                                    arrReqno["BKG_NO"] = arrCntr[i]["BKG_NO"];
                                    arrReqno["TYPE"] = "BKG";
                                    arrReqno["FILE_PATH"] = arrCntr[i]["FILE_PATH"];
                                    arrReqno["FILE_NM"] = arrCntr[i]["FILE_NM"];
                                }
                                objJsonArray.push(arrReqno);
                            }
                            sendEmail(objJsonArray);
                        }
                        else {
                            DevExpress.ui.dialog.alert("<i>메일 발송할 예약건을 선택해 주세요.</i>", "");
                        }
                        
                    }
                },

                },
                {
                    widget: 'dxButton',
                    options: {
                        text: '확정',
                        disabled : true,
                        onClick(e) {
                            gridBookingHeader.saveEditData();
                            //arrCntr = gridBookingHeader.option('dataSource');
                            arrCntr = gridBookingHeader.getSelectedRowsData();
                            var arrReqno = {};
                            if (arrCntr.length > 0) {
                                ConfirmBKG("F");
                            }
                            else {
                                DevExpress.ui.dialog.alert("<i>예약건을 선택해주세요.</i>", "");
                            }

                        }
                    },

                },
                {
                    widget: 'dxButton',
                    options: {
                        text: '예약',
                        onClick(e) {
                            gridBookingHeader.saveEditData();
                            //arrCntr = gridBookingHeader.option('dataSource');
                            arrCntr = gridBookingHeader.getSelectedRowsData();
                            var arrReqno = {};
                            if (arrCntr.length > 0) {
                                ConfirmBKG("Y");
                            }
                            else {
                                DevExpress.ui.dialog.alert("<i>예약건을 선택해주세요.</i>", "");
                            }


                        }
                    },
                },
                {
                    widget: 'dxButton',
                    options: {
                        text: '취소',
                        onClick(e) {
                            gridBookingHeader.saveEditData();
                            //arrCntr = gridBookingHeader.option('dataSource');
                            arrCntr = gridBookingHeader.getSelectedRowsData();
                            var arrReqno = {};
                            if (arrCntr.length > 0) {
                                ConfirmBKG("C");
                            }
                            else {
                                DevExpress.ui.dialog.alert("<i>예약건을 선택해주세요.</i>", "");
                            }


                        }
                    },
                },
            ],
        },
        onContentReady: function (e) {
            // Set the focused cell
            e.component.selectRowsByIndexes([0]); // 로드시 첫 인덱스 선택
        },
        onCellPrepared: function onCellPrepared(e) {
            if (e.column.dataField == "BKG_NO" || e.column.dataField == "AREA" || e.column.dataField == "CUST_NM"
                || e.column.dataField == "EMAIL_YN" || e.column.dataField == "CUST_EMAIL" || e.column.dataField == "CUST_TEL"
                || e.column.dataField == "STRT_YMD" || e.column.dataField == "END_YMD" || e.column.dataField == "BKG_STATUS"
            ) { // css 셋팅*/
                e.cellElement.css("text-align", "center");
            }

            

        },
        onEditorPreparing: function (e) {
            
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
            console.log(selectedItems);
            if (first_connect) {
                gridBookingHeader.cellValue(0, 9, mod_tot_amt);
                first_connect = false;

            }
            else {
                gridBookingHeader.cellValue(0, 9, modtot_prc);
            }
            
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
    }).dxDataGrid('instance');

    //#region DTL 그리드

    var gridConference = $("#gridConference").dxDataGrid({
        dataSource: [],
        showBorders: true,
        allowColumnResizing: true,
        showRowLines: true,
        height: 300,
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
                allowEditing: false,
                visible: false
            },
            {
                dataField: 'BKG_NO',
                caption: '상품관리번호',
                allowEditing: false,
                visible: false
            },
            {
                dataField: 'BKG_SEQ',
                allowEditing: false,
                visible: false
            },
            {
                dataField: 'CONF_TYPE',
                caption: '세미나실 명',
                lookup: {
                    dataSource: {
                        load: function () {
                            objJsonData.ITEM_CD = gridBookingHeader.cellValue(0, "ITEM_CD");
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
                    disabled:false,
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
            e.data.BKG_NO = bkg;
            e.data.CONF_NM = '';
            e.data.BKG_SEQ = '';
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
        allowColumnResizing: true,
        showRowLines: true,
        height: 300,
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
                allowEditing: false,
                visible: false
            },
            {
                dataField: 'BKG_SEQ',
                allowEditing: false,
                visible: false
            },
            {
                dataField: 'BKG_NO',
                caption: '상품관리번호',
                allowEditing: false,
                visible: false
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
                dataField: 'ROOM_NM',
                caption: '객실 명',
                lookup: {
                    dataSource: {
                        load: function () {
                            objJsonData.ITEM_CD = gridBookingHeader.cellValue(0, "ITEM_CD");
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
                    disabled: false,
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
            e.data.BKG_NO = bkg;
            e.data.CONF_NM = '';
            e.data.CONF_CNT = '';
            e.data.PRC = '0';
            e.data.BKG_SEQ = '';
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
        onEditorPreparing: function (e) {
            if (e.parentType == "dataRow" && e.dataField == "ROOM_NM") {
                e.editorOptions.searchEnabled = false;
            }
        },
        scrolling: {
            mode: 'virtual',
        },
    }).dxDataGrid('instance');

    var gridMeal = $("#gridMeal").dxDataGrid({
        showBorders: true,
        showRowLines: true,
        allowColumnResizing: true,
        height: 300,
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
                allowEditing: false,
                visible: false
            },
            {
                dataField: 'BKG_SEQ',
                allowEditing: false,
                visible: false
            },
            {
                dataField: 'BKG_NO',
                caption: '상품관리번호',
                allowEditing: false,
                visible: false
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
                dataField: 'MEAL_CD',
                caption: '식사코드',
                visible: false
            },
            {
                dataField: 'MEAL_NM',
                caption: '식사 명',
                lookup: {
                    dataSource: {
                        load: function () {
                            objJsonData.ITEM_CD = gridBookingHeader.cellValue(0, "ITEM_CD");
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
                    disabled: false,
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
            e.data.BKG_NO = bkg;
            e.data.BKG_SEQ = '';
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
        onEditorPreparing: function (e) {
            if (e.parentType == "dataRow" && e.dataField == "MEAL_NM") {
                e.editorOptions.searchEnabled = false;
            }
        },
        scrolling: {
            mode: 'virtual',
        },
    }).dxDataGrid('instance');

    var gridEtc = $("#gridEtc").dxDataGrid({
        showBorders: true,
        allowColumnResizing: true,
        showRowLines: true,
        height: 300,
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
                allowEditing: false,
                visible: false
            },
            {
                dataField: 'BKG_SEQ',
                allowEditing: false,
                visible: false
            },
            {
                dataField: 'BKG_NO',
                caption: '상품관리번호',
                allowEditing: false,
                visible: false
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
                visible: false
            },
            {
                dataField: 'SVC_NM',
                caption: '부가서비스',
                lookup: {
                    dataSource: {
                        load: function () {
                            objJsonData.ITEM_CD = gridBookingHeader.cellValue(0, "ITEM_CD");
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
                    disabled: false,
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
            e.data.BKG_NO = bkg;
            e.data.BKG_SEQ = '';
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
        onEditorPreparing: function (e) {
            if (e.parentType == "dataRow" && e.dataField == "SVC_NM") {
                e.editorOptions.searchEnabled = false;
            }
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

    //#endregion

    //#endregion

    //#endregion


    //#region 함수

    //팝업 상품 조회 로직
    function searchItem() {
        objJsonData.ITEM_NM = _fnToNull($("#POP_ITEM_NM").find('input').val());
        objJsonData.AREA = _fnToNull($("#POP_AREA").find('input').val());
        objJsonData.TAG = _fnToNull($("#POP_TAG").find('input').val());

        $.ajax({
            type: "POST",
            url: "/Admin/fnGetItemInfo",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                //데이터바인딩
                var resultData = JSON.parse(result).Table1;
                console.log(resultData);

                var dataGrid = $("#test").dxDataGrid("instance");
                dataGrid.option("dataSource", resultData);
            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });

    }


    
    //#region ※※조회※※

    //예약 전체 조회
    function SearchData() {
        objJsonData.BKG_NO = _fnToNull(BKG_NO.option('value'));
        var url = "";
        var pageType = _fnToNull(BKG_TYPE.option('value'));

        if (pageType == "MANAGE") { //예약 수정 테이블 조회
            url = "/Bkg/fnGetBkgManageDetail";
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
                var resultConf = JSON.parse(result).CONF;
                var resultRoom = JSON.parse(result).ROOM;
                var resultMeal = JSON.parse(result).MEAL;
                var resultEtc = JSON.parse(result).SVC;

                bkg = resultItem[0]["BKG_NO"].toString();

                //Data Binding
                gridBookingHeader.beginUpdate();
                gridBookingHeader.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridBookingHeader.option('dataSource', resultItem);
                gridBookingHeader.endUpdate();


                //#region 헤더 버튼 컨트롤
                if (resultItem[0]["BKG_STATUS"] == "Y") { //확정
                    BkgStatus = "Y";
                    gridBookingHeader.option("toolbar.items[4].options.disabled", true);
                    gridBookingHeader.option("toolbar.items[3].options.disabled", false);
                }
                if (resultItem[0]["BKG_STATUS"] == "F") { //최종확정
                    BkgStatus = "F";
                    gridBookingHeader.option("toolbar.items[5].options.disabled", true);
                    gridBookingHeader.option("toolbar.items[4].options.disabled", true);
                    gridBookingHeader.option("toolbar.items[3].options.disabled", true);
                    gridBookingHeader.option("toolbar.items[2].options.disabled", true);

                    gridBookingHeader.option("editing.allowUpdating", false);//업데이트 막기
                    gridBookingHeader.option("columns[3].options.disable", true);
                    gridBookingHeader.option("columns[5].cellTemplate.disabled", true);
                    
                    
                    
                    
                    gridConference.option('disabled', true);
                    gridRoom.option('disabled', true);
                    gridMeal.option('disabled', true);
                    gridEtc.option('disabled', true);

                }

                if (resultItem[0]["BKG_STATUS"] == "N") { //미확정
                    gridBookingHeader.option("toolbar.items[3].options.disabled", true);
                }

                //#endregion

                gridConference.beginUpdate();
                gridConference.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridConference.option('dataSource', resultConf);
                gridConference.endUpdate();
                if (resultConf.length > 0) {
                    tot_conf = resultConf[0]["SUM_PRC"];
                }


                gridRoom.beginUpdate();
                gridRoom.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridRoom.option('dataSource', resultRoom);
                gridRoom.endUpdate();
                if (resultRoom.length > 0) {
                    tot_room = resultRoom[0]["SUM_PRC"];
                }
                

                gridMeal.beginUpdate();
                gridMeal.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridMeal.option('dataSource', resultMeal);
                gridMeal.endUpdate();
                if (resultMeal.length > 0) {
                    tot_meal = resultMeal[0]["SUM_PRC"];
                }
                

                gridEtc.beginUpdate();
                gridEtc.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridEtc.option('dataSource', resultEtc);
                gridEtc.endUpdate();
                if (resultEtc.length > 0) {
                    tot_svc = resultEtc[0]["SUM_PRC"];
                }
                mod_tot_amt = parseInt(tot_conf) + parseInt(tot_meal) + parseInt(tot_room) + parseInt(tot_svc);
                

                
            }, error: function (xhr, status, error) {
                console.log(error);
            }
        });
    }

    //#endregion

    function svaeBKGHD(type) {
        gridBookingHeader.saveEditData();
        var arrCntr = new Array();
        arrCntr = gridBookingHeader.option('dataSource');
        var url = "";
        if (type == "FILE") {
            url = "/Bkg/fnUpdateBkgfile"
        }
        else {
            url = "/Bkg/fnChangeItem"
        }

        for (var i = -1; ++i < arrCntr.length;) {
            var curRow = arrCntr[i];
            
            

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
                if (JSON.parse(result).rec_cd == "Y") {
                    SearchData();
                    if (type == "FILE") {
                        DevExpress.ui.dialog.alert("<i>예약확인서가 업로드 되었습니다.</i>", "");
                    }
                }

            }, error: function (xhr, status, error) {
                console.log(error);
            }
        });
    }

    // 예약 헤더 저장
    function fnSaveBKG() {
        gridBookingHeader.saveEditData();
        var arrCntr = new Array();
        arrCntr = gridBookingHeader.option('dataSource');
        var quot_no = "";

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

                if (_fnToNull(curRow.MIL_POINT) != "0" || _fnToNull(curRow.MIL_POINT) != "" ) {
                    curRow.TOT_AMT -= curRow.MIL_POINT;
                }

                if (!curRow.hasOwnProperty("INSFLAG") || curRow.INSFLAG == "Q") {    // INSFLAG가 생성된 것만 처리
                    arrCntr.splice(i, 1);
                    i--;    //배열의 전체 길이가 줄어들기때문에 i값도 변경한다.
                }

                if (curRow.INSFLAG == "I") {
                    quot_no = "BKG" + _fnNow();
                    curRow.QUOT_NO = quot_no;
                }
            }
        }

        $.ajax({
            type: "POST",
            url: "/Bkg/fnSaveBkgList",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(arrCntr) },
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    var resultItem = JSON.parse(result).Table1;
                    gridBookingHeader.beginUpdate();
                    gridBookingHeader.saveEditData();
                    gridBookingHeader.option('dataSource', resultItem);
                    gridBookingHeader.endUpdate();
                    
                    gridBookingHeader.cellValue(0, 9, modtot_prc);
                    DevExpress.ui.dialog.alert("<i>저장 되었습니다.</i>", "");
                    /*openAddButton();*/
                }

            }, error: function (xhr, status, error) {
                console.log(error);
            }
        });


    }

    function ConfirmBKG(status) {
        gridBookingHeader.saveEditData();
        var arrCntr = new Array();
        arrCntr = gridBookingHeader.option('dataSource');
        var quot_no = "";


        for (var i = -1; ++i < arrCntr.length;) {
            var curRow = arrCntr[i];
            curRow.STATUS = _fnToNull(status);
 
        }
        
        

        $.ajax({
            type: "POST",
            url: "/Bkg/fnFlagUpDateBkg",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(arrCntr) },
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    var resultItem = JSON.parse(result).Table1;
                    gridBookingHeader.beginUpdate();
                    gridBookingHeader.saveEditData();
                    gridBookingHeader.option('dataSource', resultItem);
                    gridBookingHeader.endUpdate();

                    if (_fnToNull(status) == "C") {
                        gridConference.option('disabled', true);
                        gridRoom.option('disabled', true);
                        gridMeal.option('disabled', true);
                        gridEtc.option('disabled', true);
                    }
                    if (_fnToNull(status) == "F") {
                        gridConference.option('disabled', true);
                        gridRoom.option('disabled', true);
                        gridMeal.option('disabled', true);
                        gridEtc.option('disabled', true);
                        gridBookingHeader.option("toolbar.items[1].options.disabled", false);
                        gridBookingHeader.option("toolbar.items[2].options.disabled", false);
                        gridBookingHeader.option("toolbar.items[3].options.disabled", false);
                        gridBookingHeader.option("toolbar.items[4].options.disabled", false);
                    }
                    if (_fnToNull(status) == "Y") {
                        gridBookingHeader.option("toolbar.items[3].options.disabled", false);
                    }
                    DevExpress.ui.dialog.alert("<i>저장 되었습니다.</i>", "예약관리");
                    /*openAddButton();*/
                }

            }, error: function (xhr, status, error) {
                console.log(error);
            }
        });

    }



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
                console.log(error);
            }
        });


    }

    //#endregion

    function sendEmail(arrReqno) {
        console.log(arrReqno);
        if (arrReqno.length > 0) {
            if (_fnToNull(arrReqno[0]["FILE_PATH"]) == "" || _fnToNull(arrReqno[0]["FILE_NM"]) == "") {
                DevExpress.ui.dialog.alert("<i>예약 확인서를 업로드해주세요.</i>", "");
                objJsonArray = new Array();
            }
            else {
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
                        if (JSON.parse(result).Result[0].trxCode == "Y") {
                            gridBookingHeader.beginUpdate();
                            gridBookingHeader.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                            gridBookingHeader.option('dataSource', resultData);
                            gridBookingHeader.endUpdate();
                            objJsonArray = new Array();
                            DevExpress.ui.dialog.alert("<i>예약 확인서를 전송하였습니다</i>", "");
                        }
                        else {
                            DevExpress.ui.dialog.alert("<i>메일 전송에 실패했습니다.</i>", "");
                            objJsonArray = new Array();
                        }

                    }, error: function (xhr, status, error) {
                        console.log(error);
                    }
                });
            }
        }
    }


    

    //dtl 업데이트

    function fnUpdateDetailData() {
        var url = "";
        var UpdateObj = new Object();


        var arrDtl = new Array();

        var past_prc = 0;

        if (tab_nm == "CONF") {
            url = "/Bkg/fnUpdateBkgConf";
            gridConference.saveEditData();
            arrDtl = gridConference.option('dataSource');
            past_prc = parseInt(tot_conf);
        }
        else if (tab_nm == "ROOM") {
            url = "/Bkg/fnUpdateBkgRoom";
            gridRoom.saveEditData();
            arrDtl = gridRoom.option('dataSource');
            past_prc = parseInt(tot_room);
        }
        else if (tab_nm == "MEAL") {
            url = "/Bkg/fnUpdateBkgMeal";
            gridMeal.saveEditData();
            arrDtl = gridMeal.option('dataSource');
            past_prc = parseInt(tot_meal);
        }
        else if (tab_nm == "SVC") {
            url = "/Bkg/fnUpdateBkgSvc";
            gridEtc.saveEditData();
            arrDtl = gridEtc.option('dataSource');
            past_prc = parseInt(tot_svc);
        }

        mod_amt = 0;

        for (var i = -1; ++i < arrDtl.length;) {
            var dtlDr = arrDtl[i];
            if (!dtlDr.hasOwnProperty("INSFLAG") || dtlDr.INSFLAG != "D") { // 삭제 건은 제외
                mod_amt += _fnToZero(dtlDr.PRC); //디테일 수정 금액
            }
            if (!dtlDr.hasOwnProperty("INSFLAG") || dtlDr.INSFLAG == "Q") {
                arrDtl.splice(i, 1);
                i--;
            }
        }

         modtot_prc = parseInt(_fnToZero(gridBookingHeader.cellValue(0, 9))) + parseInt(mod_amt - past_prc);
        
        
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

                    gridBookingHeader.cellValue(0, 9, modtot_prc);
                    var pop_text = "";

                    if (tab_nm == "CONF") {
                        gridConference.beginUpdate();
                        gridConference.saveEditData();
                        gridConference.option('dataSource', DtlTable);
                        gridConference.endUpdate();
                        pop_text = "세미나실 정보";
                        if (DtlTable.length > 0) {
                            tot_conf = DtlTable[0]["SUM_PRC"];
                        }
                    }


                    if (tab_nm == "ROOM") {
                        gridRoom.beginUpdate();
                        gridRoom.saveEditData();
                        gridRoom.option('dataSource', DtlTable);
                        gridRoom.endUpdate();
                        pop_text = "숙박 정보";
                        if (DtlTable.length > 0) {
                            tot_room = DtlTable[0]["SUM_PRC"];
                        }
                    }
                    if (tab_nm == "MEAL") {
                        gridMeal.beginUpdate();
                        gridMeal.saveEditData();
                        gridMeal.option('dataSource', DtlTable);
                        gridMeal.endUpdate();
                        pop_text = "식사 정보";
                        if (DtlTable.length > 0) {
                            tot_meal = DtlTable[0]["SUM_PRC"];
                        }
                    }

                    if (tab_nm == "SVC") {
                        gridEtc.beginUpdate();
                        gridEtc.saveEditData();
                        gridEtc.option('dataSource', DtlTable);
                        gridEtc.endUpdate();
                        pop_text = "부가서비스 정보";
                        if (DtlTable.length > 0) {
                            tot_svc = DtlTable[0]["SUM_PRC"];
                        }
                    }

                    DevExpress.ui.dialog.alert("<i>저장되었습니다.</i>", pop_text);

                }

            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });
    }


    //#endregion


    // Run 
    if (_fnToNull(BKG_NO.option('value')) != "") {
        SearchData();
    }

});