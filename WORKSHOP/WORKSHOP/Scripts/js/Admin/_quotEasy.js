var objJsonData = new Object();
var objJsonArray = new Array();
var detail_count = 0;
var dtl_price = 0;


$(function () {
    DevExpress.ui.dxDateBox.defaultOptions({
        options: {
            showClearButton: false,
            type: "date",
            displayFormat: "yyyy-MM-dd"
        }
    });

    //#region 조회 조건
    var STRT_YMD = $("#STRT_YMD").dxDateBox({
        width: 120,
        value: new Date(Date.parse(new Date()) - 6 * 1000 * 60 * 60 * 24),
    }).dxDateBox('instance');

    var END_YMD = $("#END_YMD").dxDateBox({
        width: 120,
        value: new Date(Date.parse(new Date())),
    }).dxDateBox('instance');


    var QUOT_TYPE = $("#QUOT_TYPE").dxSelectBox({
        dataSource: [{ CODE: "ALL", NAME: "전체" }, { CODE: "B", NAME: "상품 견적" }, { CODE: "A", NAME: "간편 견적" }],
        width: 120,
        value : "ALL",
        displayExpr: "NAME",
        valueExpr: "CODE",
    }).dxSelectBox('instance');

    var REQ_NM = $("#REQ_NM").dxTextBox({
        value: "",
        width: 150
    }).dxTextBox('instance');

    var USR_TYPE = $("#USR_TYPE").dxSelectBox({
        dataSource: [{ CODE: "ALL", NAME: "전체" }, { CODE: "B", NAME: "비회원" }, { CODE: "A", NAME: "회원" }],
        value: "ALL",
        width: 150,
        displayExpr: "NAME",
        valueExpr: "CODE",
    }).dxSelectBox('instance');

    var QUOT_YN = $("#QUOT_YN").dxSelectBox({
        dataSource: [{ CODE: "ALL", NAME: "전체" }, { CODE: "0", NAME: "미등록" }, { CODE: "1", NAME: "등록완료" }],
        width: 120,
        value: "0",
        displayExpr: "NAME",
        valueExpr: "CODE",
    }).dxSelectBox('instance');



    var STATUS = $("#STATUS").dxSelectBox({
        dataSource: [{ CODE: "ALL", NAME: "전체" }, { CODE: "N", NAME: "미발송" }, { CODE: "Y", NAME: "발송" }],
        width: 120,
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


    var AREA = $("#AREA").dxSelectBox({
        width: 150,
        displayExpr: "COMM_NM",
        valueExpr: "COMM_NM",
        /*acceptCustomValue: true,*/
        dataSource: layoutSearchGRP_CD.option('dataSource'),
        value : "전체"
    }).dxSelectBox('instance');

    //#endregion

    

    var  pop = $("#popup").dxPopup({
        showTitle: true,
        title: '견적정보',
        contentTemplate: function () {
            return $("<div>").dxDataGrid({
                allowColumnResizing: true,
                showRowLines: true,
                keyExpr: "Code",
                columns: [
                    {
                        caption: '구분',
                    },
                    {
                        caption: '지역',
                    },
                    {
                        dataField: "상품명",
                        //validationRules: [{ type: "required" }],
                    },
                    {
                        dataField: "등급",
                    },
                    {
                        dataField: "총 금액",
                        //validationRules: [
                        //    {
                        //        type: "required",
                        //        message: "Units is required"
                        //    },
                        //    {
                        //        type: "pattern",
                        //        pattern: "^[1-9]{1}$",
                        //        message: "Units must be more than 1 and less than 9"
                        //    },
                        //],
                    },
                    {
                        dataField: "상품명",
                        //validationRules: [{ type: "required" }],
                    },
                ],
            });
        }
    }).dxPopup('instance');

    var gridQuotation = $("#quotList").dxDataGrid({
        width : 1300,
        showBorders: true,
        allowColumnResizing: true,
        showRowLines: true,
        selection: {
            mode: 'multiple',
        },
        loadPanel: {
            enabled: true,
        },
        columns: [
            {
                dataField: 'INSFLAG',
                visible : false,
            },
            {
                dataField: 'REQ_NO',
                width: 180,
                caption: "관리번호",
                visible : false
            },
            {
                dataField: 'QUOT_TYPE',
                width: 130,
                caption: "견적 구분",
                alignment: "center",
                fixed: true,
                fixedPosition: "left",
                cellTemplate: function (container, options) {
                    if (options.data.QUOT_TYPE == "A") {
                        $("<div/>").addClass("easy_q").text("간편견적").appendTo(container);
                    }
                    else if (options.data.QUOT_TYPE == "B") {
                        $("<div/>").addClass("online_q").text("상품견적").appendTo(container);
                    }
                }

            },
            {
                dataField: 'QUOT_YN',
                width: 100,
                caption: "견적 유무",
                alignment: "center",
                fixed: true,
                fixedPosition: "left",

                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                        if (s == "0") {
                            s = "미등록"
                        }
                        else if (s == "-1") {
                            s = "견적불가";
                        }
                        else {
                            s = "등록완료"
                        }
                    
                    return s;
                }

            },
            {
                caption: '견적등록',
                width: 100,
                alignment: "center",
                fixed: true,
                fixedPosition: "left",
                cellTemplate: function (container, options) {
                    if (_fnToNull(options.data.QUOT_TYPE) == "B") { // 상품견적만 버튼
                        if (_fnToNull(options.data.QUOT_YN) != "0") { // 건수 있는지 체크
                            $("<div />").dxButton({
                                text: '견적수정',
                                onClick: function (e) {
                                    if (options.data.QUOT_TYPE == "B") {
                                        location.href = "/Quotation/quotRegist?quotNo=|" + options.data.REQ_NO + "&&quotType=MANAGE";
                                    }
                                }
                            }).appendTo(container);
                        }
                        else {
                            $("<div />").dxButton({
                                text: '견적등록',
                                onClick: function (e) {
                                    //if (options.data.QUOT_TYPE == "A") {
                                    //    location.href = "/Quotation/quotRegist?quotNo=" + options.data.REQ_NO + "&&quotType=EASY_QUOT";
                                    //}
                                    //else {
                                    var send_mngt_no = options.data.REQ_NO;
                                    _fnInsertMngQuot(send_mngt_no);
/*                                        location.href = "/Quotation/quotRegist?quotNo=" + options.data.REQ_NO + "&&quotType=ONLINE_QUOT";*/
                                    //}

                                }
                            }).addClass("quot_btn1").appendTo(container);
                        }
                    }

                    //#region 미사용

                    //if (_fnToNull(options.data.QUOT_YN) != "0") { // 등록 건수 있는지 체크
                    //    $("<div />").dxButton({
                    //        text: '견적수정',
                    //        onClick: function (e) {
                    //            if (options.data.QUOT_TYPE == "A") {
                    //                location.href = "/Quotation/quotRegist?quotNo=" + options.data.REQ_NO + "&&quotType=MANAGE";
                    //            }

                    //        }
                    //    }).appendTo(container);
                    //}
                    //else {
                    //    if (_fnToNull(options.data.USER_TYPE) == "A") {//회원
                    //        $("<div />").dxButton({
                    //            text: '견적등록',
                    //            onClick: function (e) {
                    //                if (options.data.QUOT_TYPE == "A") {
                    //                    location.href = "/Quotation/quotRegist?quotNo=" + options.data.REQ_NO + "&&quotType=EASY_QUOT";
                    //                }
                    //                else {
                    //                    location.href = "/Quotation/quotRegist?quotNo=" + options.data.REQ_NO + "&&quotType=ONLINE_QUOT";
                    //                }

                    //            }
                    //        }).appendTo(container);
                    //    }
                    //    if ((_fnToNull(options.data.USER_TYPE) == "B" || _fnToNull(options.data.USER_TYPE) == "") && _fnToNull(options.data.QUOT_TYPE) == "B") { // 비회원
                    //        $("<div />").dxButton({
                    //            text: '견적등록',
                    //            onClick: function (e) {

                    //                location.href = "/Quotation/quotRegist?quotNo=" + options.data.REQ_NO + "&&quotType=ONLINE_QUOT";


                    //            }
                    //        }).appendTo(container);
                    //    }
                    //}

                    //#endregion
                },
                width: 110
            },
            //ek
            {
                dataField: 'IMG_PATH',
                caption: '견적서 업로드',
                width: 100,
                allowEditing: false,
                cellTemplate: function (container, options) {
                    if (_fnToNull(options.data.FILE_NM) == "" && _fnToNull(options.data.QUOT_TYPE) == "A") {
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
                                        //var result = DevExpress.ui.dialog.confirm("<i>견적서를 업로드하시겠습니까?</i>", "");
                                        //result.done(function (dialogResult) {
                                        saveQuotation();
                                        //});

                                    } else {

                                    }
                                },
                            }).addClass("doc_quot_btn").appendTo(container);
                    }
                },
                width: 120
            },

            //{
            //    dataField: 'TEST',
            //    caption: '견적구분',
            //    cellTemplate: function (cellElement, cellInfo) {
            //        $('<a/>').addClass('dx-link')
            //            .text(cellInfo.value)
            //            .on('dxclick', function () {
            //                if (parseInt(cellInfo.value) > 1) {
            //                    $("#popup").dxPopup("instance").show();
            //                } else {
            //                    alert("haha");
            //                }
            //            })
            //            .appendTo(cellElement);
            //    }

            //},
            //{
            //    dataField: '',
            //    caption: '견적상태',
            //},
            {
                dataField: 'AREA',
                caption: '지역',
                width: 90,
            },
            {
                dataField: 'ITEM_NM',
                caption: '상품명',
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
                dataField: 'REQ_DT',
                caption: '요청날짜',
                width: 100,
                customizeText: function (cellInfo) {
                    var ymd = _fnToNull(cellInfo.value);

                    return ymd.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
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
                alignment : "center"
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
                width:100,
                dataType: 'number',
                format: "fixedpoint"
            },
            {
                dataField: 'MAX_PRC',
                caption: '예산최대금액',
                width: 100,
                dataType: 'number',
                format : "fixedpoint"
            },
            {
                dataField: 'HEAD_CNT',
                caption: '예상인원',
                width: 80,
                dataType: 'number',
                format: "fixedpoint"
            },
            {
                dataField: 'TOPIC',
                caption: '제목',
                width: 170,
            },
            {
                dataField: 'REQ_NM',
                caption: '요청자명',
                width: 90,
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
                    if (s.length != 11) return s;

                    var y = s.substring(0, 3) // year
                    var m = s.substring(3, 7) // month
                    var d = s.substring(7, 11) // day

                    return [y, m, d].join('-');
                }
            },
            {
                dataField: 'USER_TYPE',
                width: 90,
                caption: "회원 구분",
                cellTemplate: function (container, options) {
                    if (_fnToNull(options.data.USER_TYPE) == "B") {
                        $("<div/>").addClass('success')
                            .text("비회원")
                            .appendTo(container);
                    } else if (_fnToNull(options.data.USER_TYPE) == "") {
                        $("<div/>").addClass('wait')
                            .text("비회원")
                            .appendTo(container);
                    } else {
                        $("<div/>").addClass('wait')
                            .text("회원")
                            .appendTo(container);
                    }
                }
            },
            {
                dataField: 'SVC_NM',
                caption: '부가서비스',
                width: 120,
            },


            {
                dataField: 'EMAIL_YN',
                caption: '견적서 발송여부',
                width: 120,
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
                dataField: 'FILE_NM',
                caption: '파일 명',
                width: 200,
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
                dataField: 'FILE_PATH',
                caption: '파일 경로',
                visible : false
            },

            {
                dataField: 'RMK',
                caption: '비고',
                width: 300,
            },

        ],
        toolbar: {
            items: [
                {
                    widget: 'dxButton',
                    options: {
                        text: '이메일 보내기',
                        onClick(e) {
                            var arrData = gridQuotation.getSelectedRowsData();
                            var arrReqno = {};
                            var check_online_quot = false;
                            for (var i = 0; i < arrData.length; i++) {
                                if (_fnToNull(arrData[i]["REQ_NO"]) != '') {
                                    if (_fnToNull(arrData[i]["QUOT_TYPE"]) != 'B') { // 간편견적이면
                                        if (_fnToNull(arrData[i]["QUOT_TYPE"]) == 'A' && _fnToNull(arrData[i]["FILE_NM"]) == '') {
                                            DevExpress.ui.dialog.alert("<i>견적서를 업로드 해주세요.</i>", "");
                                            return false;
                                        } else {
                                            arrReqno = { id: i + 1 };
                                            arrReqno["MNGT_NO"] = arrData[i]["REQ_NO"];
                                            arrReqno["TYPE"] = "QUOT";
                                            arrReqno["S_STRT_YMD"] = _fnToNull(STRT_YMD.option('text').replace(/-/gi, ""));
                                            arrReqno["S_END_YMD"] = _fnToNull(END_YMD.option('text').replace(/-/gi, ""));
                                            /*arrReqno["S_REQ_NM"] = _fnToNull(REQ_NM.option('value'));*/
                                            arrReqno["S_STATUS"] = _fnToNull(STATUS.option('value'));
                                            arrReqno["S_USER_TYPE"] = _fnToNull(USR_TYPE.option('value'));
                                        }
                                    } else { // 온라인 견적이면
                                        //if (_fnToNull(arrData[i]["FILE_NM"]) == '') {
                                        //    DevExpress.ui.dialog.alert("<i>견적서를 업로드 해주세요.</i>", "");
                                        //    return false;
                                        //} else {
                                        //    arrReqno = { id: i + 1 };
                                        //    arrReqno["MNGT_NO"] = arrData[i]["REQ_NO"];
                                        //    arrReqno["TYPE"] = "QUOT";
                                        //    arrReqno["S_STRT_YMD"] = _fnToNull(STRT_YMD.option('text').replace(/-/gi, ""));
                                        //    arrReqno["S_END_YMD"] = _fnToNull(END_YMD.option('text').replace(/-/gi, ""));
                                        //    /*arrReqno["S_REQ_NM"] = _fnToNull(REQ_NM.option('value'));*/
                                        //    arrReqno["S_STATUS"] = _fnToNull(STATUS.option('value'));
                                        //    arrReqno["S_USER_TYPE"] = _fnToNull(USR_TYPE.option('value'));
                                        //}
                                        DevExpress.ui.dialog.alert("<i>상품견적 체크해제 후 이용해 주세요.</i>", "");
                                        check_online_quot = true;
                                        break;
                                    }


                                }
                                objJsonArray.push(arrReqno);
                            }
                            /*console.log(objJsonArray);*/
                            if (!check_online_quot) {
                                sendEmail(objJsonArray);
                            }
                            
                        }
                    },

                },
            ],
        },
        onInitNewRow: function (e) {
            e.data.APV_YN = "N";
            e.data.EMAIL = '';
            e.data.GRP_CD = '';
            e.data.USER_TYPE = '';
            e.data.PSWD = '';
            e.data.CUST_NAME = '';
            e.data.TELNO = '';
            e.data.COMPANY = '';
            e.data.INSFLAG = 'I';
            e.data.DEPARTURE = '';
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
        onCellPrepared: function onCellPrepared(e) {
            if (e.column.dataField == "USER_TYPE" || e.column.dataField == "AREA" || e.column.dataField == "REQ_NM"
                || e.column.dataField == "EMAIL_YN" || e.column.dataField == "REQ_EMAIL" || e.column.dataField == "REQ_TEL"
                || e.column.dataField == "STRT_YMD" || e.column.dataField == "END_YMD" || e.column.dataField == "REQ_DT"
            ) { // css 셋팅*/
                e.cellElement.css("text-align", "center");
            }
        },
        onSelectionChanged(selectedItems) {
            const data = selectedItems.selectedRowsData[0];
            if (_fnToNull(data) != "") {
                if (data.REQ_NO != "") {
                    var REQ_NO = data.REQ_NO;
                    var flag = data.QUOT_YN;
                    if (data.QUOT_TYPE == "A") {
                        quotDetail.option('dataSource', '');
                        quotDetail.option("toolbar.items[0].options.disabled", true); // 선택시 추가 버튼 활성화
                    } else {
                        fnSearchAllDetail(REQ_NO,flag);
                    }
                }
            }
        },
    }).dxDataGrid('instance');

    var quotDetail = $("#quotDetail").dxDataGrid({
        dataSource: [],
        showBorders: true,
        allowColumnResizing: true,
        showRowLines: true,
        paging: {
            enabled: false,
        },
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
                caption: '상품관리번호',
                visible: false,
            },
            {
                dataField: 'REQ_STATUS',
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
                dataField: 'REQ_CONTENT',
                caption: '선택상품',
                allowEditing: false,
            },
            {
                dataField: 'REQ_NUM',
                caption: '수량',
                width : 80,
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
        toolbar: {
            items: [{
                name: 'addRowButton',
                showText: 'always',
                options: {
                    text: '추가',
                    disabled: true
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
                        saveMakeQuoatation();
                    }
                },

            },
            ],
        },
        onInitNewRow: function (e) {
            if (item_cd != "") {
                e.data.INSFLAG = "I";
                e.data.MNGT_NO = item_mngtno;
                e.data.ITEM_CD = item_cd;
                e.data.ITEM_SEQ = "0";
                e.data.CONF_TYPE = "";
                e.data.MAX_NUM = "";
                e.data.USE_YN = "Y";
            }
            else {
                return false;
            }

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
            if (e.parentType == "dataRow" && (e.editorName == "dxSelectBox")) { // 셀렉트 박스 입력 막기
                e.editorOptions.searchEnabled = false;
            }
        },
        keyboardNavigation: {
            enterKeyAction: 'moveFocus',
            enterKeyDirection: 'row',
            editOnKeyPress: true,
        },
        //scrolling: {
        //    mode: 'virtual',
        //    /*mode: 'standard',*/
        //},
    }).dxDataGrid('instance');

    function saveMakeQuoatation() {

        quotDetail.saveEditData();
        var arrCntr = new Array();
        arrCntr = quotDetail.option('dataSource');
        if (arrCntr.length > 0) {

            $.ajax({
                type: "POST",
                url: "/Quotation/fnSaveQuotationAll",
                async: true,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(arrCntr) },
                success: function (result) {
                    if (JSON.parse(result).Result[0].trxCode == "Y") {
                        //////데이터바인딩
                        //var resultData = JSON.parse(result).Table1;
                        ////Data Binding
                        //gridQuotation.beginUpdate();
                        //gridQuotation.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                        //gridQuotation.option('dataSource', resultData);
                        //gridQuotation.endUpdate();

                        //gridCommon.option('dataSource', []);
                        DevExpress.ui.dialog.alert("<i>저장되었습니다.</i>", "");
                        SearchData();
                    } else {
                        DevExpress.ui.dialog.alert("<i>저장 실패되었습니다.</i>", "");
                        return false;
                    }
                }, error: function (xhr, status, error) {
                    console.log("에러");
                    console.log(error);
                }
            });
        } else {
            DevExpress.ui.dialog.alert("<i>간편견적은 이메일 전송만 가능합니다.</i>", "");
        }
    }


    //디테일 정보 조회
    function fnSearchAllDetail(req_no,flag) {
        var objData = new Object();
        objData.REQ_NO = req_no;
        dtl_price = 0
        $.ajax({
            type: "POST",
            url: "/Quotation/fnGetQuotAllDetail",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objData) },
            success: function (result) {
                //데이터바인딩
                var resultData = JSON.parse(result).Table1;
                detail_count = resultData.length;
                for (var i = 0; i < detail_count; i++) {
                    dtl_price += _fnToZero(resultData[i]["PRC"]);
                }

                //Data Binding
                quotDetail.beginUpdate();
                quotDetail.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                quotDetail.option('dataSource', resultData);
                quotDetail.endUpdate();

                if (flag > 0) {
                    quotDetail.option("disabled", true);
                    quotDetail.option("toolbar.items[0].options.disabled", true); // 저장 버튼 열기
                } else {

                    quotDetail.option("disabled", false);
                    quotDetail.option("toolbar.items[0].options.disabled", false); // 저장 버튼 열기
                }

                $("#total_quot_price").text("총금액 : " + dtl_price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","));
                $("#total_quot_price").show();

            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });
    }

    function SearchData() {
        objJsonData.S_STRT_YMD = _fnToNull(STRT_YMD.option('text').replace(/-/gi, ""));
        objJsonData.S_END_YMD = _fnToNull(END_YMD.option('text').replace(/-/gi, ""));
        objJsonData.S_AREA = _fnToNull(AREA.option('value'));
        //objJsonData.S_REQ_NM = _fnToNull(REQ_NM.option('value'));
        objJsonData.S_QUOT_YN = _fnToNull(QUOT_YN.option('value'));
        objJsonData.S_STATUS = _fnToNull(STATUS.option('value'));
        objJsonData.S_USER_TYPE = _fnToNull(USR_TYPE.option('value'));
        objJsonData.S_QUOT_TYPE = _fnToNull(QUOT_TYPE.option('value'));


        $.ajax({
            type: "POST",
            url: "/Quotation/fnGetQuotList",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                //데이터바인딩
                var resultData = JSON.parse(result).Table1;
                console.log(resultData);
                //Data Binding
                gridQuotation.beginUpdate();
                gridQuotation.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridQuotation.option('dataSource', resultData);
                gridQuotation.endUpdate();

                quotDetail.beginUpdate();
                quotDetail.saveEditData();
                quotDetail.option('dataSource', []);
                quotDetail.endUpdate();

            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });
    }



    function saveQuotation() {
        gridQuotation.saveEditData();
        var arrCntr = new Array();
        arrCntr = gridQuotation.option('dataSource');

        for (var i = -1; ++i < arrCntr.length;) {
            var curRow = arrCntr[i]
            if (!curRow.hasOwnProperty("INSFLAG") || curRow.INSFLAG == "Q") {    // INSFLAG가 생성된 것만 처리
                arrCntr.splice(i, 1);
                i--;    //배열의 전체 길이가 줄어들기때문에 i값도 변경한다.
            }
        }
        if (arrCntr.length > 0) { // 상단 조회조건 추가
            arrCntr[0]["S_STRT_YMD"] = _fnToNull(STRT_YMD.option('text').replace(/-/gi, ""));
            arrCntr[0]["S_END_YMD"] = _fnToNull(END_YMD.option('text').replace(/-/gi, ""));
            /*arrCntr[0]["S_REQ_NM"] = _fnToNull(REQ_NM.option('value'));*/
            arrCntr[0]["S_STATUS"] = _fnToNull(STATUS.option('value'));
            arrCntr[0]["S_USER_TYPE"] = _fnToNull(USR_TYPE.option('value'));
            arrCntr[0]["S_QUOT_TYPE"] = _fnToNull(QUOT_TYPE.option('value'));
        }
        $.ajax({
            type: "POST",
            url: "/Quotation/fnSaveQuotation",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(arrCntr) },
            success: function (result) {
                //데이터바인딩
                if (_fnToNull(JSON.parse(result).Result[0]["trxCode"]) == "Y") {
                    var resultData = JSON.parse(result).Table1;
                    //Data Binding
                    //gridQuotation.beginUpdate();
                    //gridQuotation.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    //gridQuotation.option('dataSource', resultData);
                    //gridQuotation.endUpdate();
                    SearchData();

                    DevExpress.ui.dialog.alert("<i>견적서 업로드에 성공하였습니다.</i>", "");
                }

            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });

    }

    function sendEmail(arrReqno) {
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
                    if (JSON.parse(result).Result[0].trxCode == "Y") {
                        //gridQuotation.beginUpdate();
                        //gridQuotation.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨 
                        //gridQuotation.option('dataSource', resultData);
                        //gridQuotation.endUpdate();

                        //objJsonArray = new Array();
                        SearchData();
                        DevExpress.ui.dialog.alert("<i>견적서를 전송하였습니다.</i>", "");
                    } else {
                        objJsonArray = new Array();
                        DevExpress.ui.dialog.alert("<i>메일 전송에 실패했습니다.</i>", "");
                    }
                }, error: function (xhr, status, error) {
                    console.log("에러");
                    console.log(error);
                }

            });
        }
        else {
            DevExpress.ui.dialog.alert("<i>견적을 선택해 주세요.</i>", "");
        }
    }

    function fnSummeryDtlPrc() {
        dtl_price = 0;
        if (detail_count > 0) {
            for (var i = 0; i < detail_count; i++) {
                dtl_price += quotDetail.cellValue(i, 3);
            }
            $("#total_quot_price").text("총금액 : " + dtl_price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","));
        }
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


    SearchData();
    $("#quotList").find("td>.dx-widget.dx-button.dx-button-mode-contained.dx-button-normal.dx-button-has-text").css("background-color", "#949fa7");
    $("#quotDetail").find('.dx-toolbar-items-container').append("<label id='total_quot_price' style='display:none'>총금액 : 0</label>"); //라벨 강제로 넣어주기
    

    $("#quotDetail").keyup(function (e) {
        if (e.keyCode == 13) {
            fnSummeryDtlPrc();
        }
    });

    $("#quotDetail").on("click", function () {
        fnSummeryDtlPrc();
    });

});
