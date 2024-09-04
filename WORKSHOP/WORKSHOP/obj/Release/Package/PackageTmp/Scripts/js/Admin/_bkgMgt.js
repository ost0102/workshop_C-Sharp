var objJsonData = new Object();
var tot_conf = 0;
var tot_room = 0;
var tot_meal = 0;
var tot_svc = 0;

var mod_amt = 0; // 수정값
var dtl_amt = 0; // 디테일 저장시 입력 값


$(function () {

    var tab_nm = "CONF"


    //#region 상단 미변경 헤더

    var BKG_NO = $("#BKG_NO").dxTextBox({
        value: "",
        width: 200,
        disabled: true
    }).dxTextBox('instance');



    var BKG_MOD_NO = $("#BKG_MOD_NO").dxTextBox({
        value: "",
        width: 200,
        disabled: true,
        visible: false
    }).dxTextBox('instance');

    /*BKG_NO.option('value', getParameter('bkgNO'));*/

    var CUST_NM = $("#CUST_NM").dxTextBox({
        value: "",
        width: 200,
        disabled: true
    }).dxTextBox('instance');


    var CUST_TEL = $("#CUST_TEL").dxTextBox({
        value: "",
        width: 200,
        disabled: true
    }).dxTextBox('instance');


    var CUST_EMAIL = $("#CUST_EMAIL").dxTextBox({
        value: "",
        width: 200,
        disabled: true
    }).dxTextBox('instance');
    //SearchData();

    var CONFIRM_BTN = $("#btnSearch").dxButton({
        text: "수정 확정",
        onClick: function () {
            confirm_pop.show();
        }
    }).dxButton('instance');


    //#endregion

    //#region 팝업
    const confirmPopContent = function () {
        return $("<div>").append($("<div class='dx-field-set'>"),
            $("    <div class='dx-field-label' style='width:100%;text-align:center;clear:both;'>해당 수정사항을 어떻게 하시겠습니까?</div>"),
            $("</div>")
        );
    };
    var confirm_pop = $("#mod_confirm_pop").dxPopup({
        showTitle: true,
        title: '예약수정',
        width: 600,
        height: 200,
        contentTemplate: confirmPopContent,
        toolbarItems: [
        {
            widget: 'dxButton',
            toolbar: 'bottom',
            options: {
                visible: true,
                text: '수정 확정',
                onClick() {
                    fnUpdateMod("Y");
                    //DevExpress.ui.dialog.alert("<i>예약 확정되었습니다.</i>", "");
                },
            },
        },
        {
            widget: 'dxButton',
            toolbar: 'bottom',
            options: {
                visible: true,
                text: '수정 취소',
                onClick() {
                    fnUpdateMod("C");
                    //DevExpress.ui.dialog.alert("<i>예약 취소되었습니다.</i>", "");
                },
            },
        },
        {
            widget: 'dxButton',
            toolbar: 'bottom',
            options: {
                text: '닫기',
                visible: true,
                onClick() {
                    confirm_pop.hide();
                },
            },
        }],
    }).dxPopup('instance');

    //#endregion


    //#region 헤드 그리드

    var gridItem1 = $("#gridHdOrg").dxDataGrid({
        hoverStateEnabled: true,
        showBorders: true,
        allowColumnResizing: true,
        height:180,
        selection: {
            mode: 'single',
        },
        paging: {
            enabled:false,
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
                allowEditing: false,
            },
            {
                dataField: 'BKG_STATUS',
                caption: '예약상태',
                alignment: "center",
                width:150,
                allowEditing: false,
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    var view_text = "";
                    if (s == "N") {
                        view_text = "미승인";
                    }
                    if (s == "Y") {
                        view_text = "예약확정";
                    }
                    return view_text;
                }
            },
            {
                dataField: 'BKG_NO',
                caption: '예약번호',
                alignment: "center",
                visible:false,
            },
            {
                dataField: 'AREA',
                caption: '지역',
                width: 100,
                alignment: "center",
                allowEditing: false,
            },
            {
                dataField: 'ITEM_CD',
                caption: '상품코드',
                alignment: "center",
                allowEditing: false,
                visible:false,
            },
            {
                dataField: 'ITEM_NM',
                caption: '상품명',
                width:250,
                allowEditing: false,
            },
            {
                dataField: 'HEAD_CNT',
                caption: '총 인원',
                width: 100,
                dataType: 'number',
                format: "fixedpoint",
            },
            {
                dataField: 'STRT_DT',
                caption: '시작날짜',
                width: 120,
                alignment: "center",
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    return s.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
                }
            },
            {
                dataField: 'END_DT',
                caption: '종료날짜',
                width: 120,
                alignment: "center",
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    return s.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
                }
            },
            {
                dataField: 'TOT_AMT',
                caption: '총 금액',
                dataType: 'number',
                width: 150,
                format: "fixedpoint",
            },
            {
                dataField: 'MOD_AMT',
                caption: '수정 금액',
                width: 150,
                dataType: 'number',
                format: "fixedpoint",
                allowEditing: false,
            },
            //{
            //    dataField: 'MIN_PRC',
            //    caption: '최소 금액',
            //    width: 120,
            //    dataType: 'number',
            //    format: "fixedpoint",
            //    allowEditing: false,
            //},
            //{
            //    dataField: 'MAX_PRC',
            //    caption: '최대 금액',
            //    width: 120,
            //    dataType: 'number',
            //    format: "fixedpoint",
            //    allowEditing: false,
            //},
            {
                dataField: 'RMK',
                caption: '비고',
                width : 500,
                allowEditing: false,
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
                        var confirm_alert = DevExpress.ui.dialog.confirm("수정금액으로 저장하시겠습니까?", "");
                        confirm_alert.done(function (dialogAlert) {
                            if (dialogAlert) {
                                var org = _fnToZero(gridItem1.cellValue(0, 6));
                                var mod = _fnToZero(gridItem1.cellValue(0, 7));
                                if (org != mod && mod != "0") {
                                    gridItem1.cellValue(0, 6, mod);
                                }
                                UpdateBkgHeader();
                            }
                            else {
                                UpdateBkgHeader();
                            }
                        })
                        
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
        //onSelectionChanged(selectedItems) {
        //    const data = selectedItems.selectedRowsData[0];
        //    if (data.GRP_CD != "") {
        //        grp_cd = data.GRP_CD;
        //        fnSearchCommDetail(data.GRP_CD);
        //    }
        //},
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
    }).dxDataGrid('instance');


    var gridItem2 = $("#gridHdMod").dxDataGrid({
        hoverStateEnabled: true,
        showBorders: true,
        showColumnHeaders: false,
        allowColumnResizing: true,
        height:90,
        selection: {
            mode: 'single',
        },
        paging: {
            enabled: false,
        },
        columns: [
            {
                dataField: 'INSFLAG',
                visible: false
            },
            {
                dataField: 'BKG_STATUS',
                caption: '예약상태',
                width: 150,
                alignment: "center",
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    var view_text = "요청사항";
                    return view_text;
                }
            },
            {
                dataField: 'AREA',
                caption: '지역',
                width: 100,
                alignment: "center",
            },
            {
                dataField: 'ITEM_CD',
                caption: '상품코드',
                alignment: "center",
                visible:false,
            },
            {
                dataField: 'ITEM_NM',
                caption: '상품명',
                width:250,
            },
            {
                dataField: 'HEAD_CNT',
                caption: '총 인원',
                width: 100,
                dataType: 'number',
                format: "fixedpoint",
            },
            {
                dataField: 'STRT_DT',
                caption: '시작날짜',
                alignment: "center",
                width: 120,
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    return s.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
                }
            },
            {
                dataField: 'END_DT',
                caption: '종료날짜',
                alignment: "center",
                width: 120,
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    return s.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
                }
            },
            {
                dataField: 'TOT_AMT',
                caption: '총 금액',
                dataType: 'number',
                width: 150,
                format: "fixedpoint",
            },
            {
                dataField: 'MOD_AMT',
                caption: '수정 금액',
                dataType: 'number',
                width: 150,
                format: "fixedpoint",
                allowEditing: false,
            },
            //{
            //    dataField: 'MIN_PRC',
            //    caption: '최소 금액',
            //    width: 120,
            //    dataType: 'number',
            //    format: "fixedpoint",
            //    allowEditing: false,
            //},
            //{
            //    dataField: 'MAX_PRC',
            //    caption: '최대 금액',
            //    width: 120,
            //    dataType: 'number',
            //    format: "fixedpoint",
            //    allowEditing: false,
            //},
            {
                dataField: 'RMK',
                caption: '비고',
                width: 500,
                allowEditing: false,
            },
        ],

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
        //onSelectionChanged(selectedItems) {
        //    const data = selectedItems.selectedRowsData[0];
        //    if (data.GRP_CD != "") {
        //        grp_cd = data.GRP_CD;
        //        fnSearchCommDetail(data.GRP_CD);
        //    }
        //},
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
    }).dxDataGrid('instance');

    //#endregion

    //#region 디테일 그리드

    var gridConf1 = $("#orgConference").dxDataGrid({
        dataSource: [],
        showBorders: true,
        allowColumnResizing: true,
        showRowLines: true,
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
                dataField: 'BKG_SEQ',
                caption : "순번",
                allowEditing: false,
            },
            {
                dataField: 'BKG_NO',
                caption: '예약번호',
                visible: false,
                allowEditing: false,
            },

            {
                dataField: 'CONF_TYPE',
                caption: '세미나실 명',
                lookup: {
                    dataSource: {
                        load: function () {
                            objJsonData.ITEM_CD = gridItem1.cellValue(0, "ITEM_CD");
                            return $.ajax({
                                url: "/Admin/fnGetConfDetail/",
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
                    valueExpr: "CONF_TYPE",  // The value field in the data source
                    displayExpr: "CONF_CD"  // The display field in the data source
                }
            },
            {
                dataField: 'PRC',
                caption: '금액',
                dataType: 'number',
                format: "fixedpoint",
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

            }],
        },
        scrolling: {
            mode: 'virtual',
        },
        onInitNewRow: function (e) {
            e.data.INSFLAG = "I";
            e.data.BKG_NO = BKG_NO.option("value");
            e.data.BKG_SEQ = 0;
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
            if (e.parentType == 'dataRow') {
                //숫자값 4자리 최대 설정
                if (e.dataType == 'number') {
                    e.editorOptions.max = 9999999999;
                }
            }
            if (e.parentType == "dataRow" && e.dataField == "CONF_TYPE") {
                e.editorOptions.searchEnabled = false;
            }
        },
    }).dxDataGrid('instance');

    var gridConf2 = $("#modConference").dxDataGrid({
        dataSource: [],
        hoverStateEnabled: true,
        allowColumnResizing: true,
        showBorders: true,
        showRowLines: true,
        selection: {
            mode: 'single',
        },
        paging: {
            enabled: false,
        },
        columns: [
            {
                dataField: 'INSFLAG',
                allowEditing: false,
                visible: false
            },
            {
                dataField: 'BKG_CONF_SEQ',
                caption: "순번",
                allowEditing: false,
            },
            {
                dataField: 'BKG_NO',
                caption: '상품관리번호',
                visible: false,
                allowEditing: false,
            },
            {
                dataField: 'CONF_TYPE',
                caption: '세미나실 명',
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

            }],
        },
        scrolling: {
            mode: 'virtual',
        },
        onInitNewRow: function (e) {
            e.data.INSFLAG = "I";
            e.data.BKG_NO = '';
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
            if (e.parentType == "dataRow" && e.dataField == "CONF_TYPE") {
                e.editorOptions.searchEnabled = false;
            }
        },
    }).dxDataGrid('instance');


    var gridRoom1 = $("#orgRoom").dxDataGrid({
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
                allowEditing: false,
                visible: false
            },
            {
                dataField: 'BKG_SEQ',
                caption: '순번',
                allowEditing: false,
            },
            {
                dataField: 'BKG_NO',
                caption: '상품관리번호',
                visible: false,
                allowEditing: false,
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
                dataField: 'ROOM_NM',
                caption: '객실 명',
                lookup: {
                    dataSource: {
                        load: function () {
                            objJsonData.ITEM_CD = gridItem1.cellValue(0, "ITEM_CD");
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
                format: "fixedpoint",

            },

        ],
        toolbar: {
            items: [{
                name: 'addRowButton',
                showText: 'always',
                visible: true,
                options: {
                    text: '추가',
                    disabled: false,
                },

            },
            {
                name: 'saveButton',
                showText: 'always',
                visible: true,
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
            e.data.BKG_NO = BKG_NO.option("value");
            e.data.ROOM_NM = '';
            e.data.ROOM_CNT = '';
            e.data.PRC = '0';
            e.data.BKG_SEQ = 0;
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
            if (e.parentType == 'dataRow') {
                //숫자값 4자리 최대 설정
                if (e.dataType == 'number') {
                    e.editorOptions.max = 9999999999;
                }
            }
            if (e.parentType == "dataRow" && e.dataField == "ROOM_NM") {
                e.editorOptions.searchEnabled = false;
            }
        },
        scrolling: {
            mode: 'virtual',
        },
    }).dxDataGrid('instance');

    var gridRoom2 = $("#modRoom").dxDataGrid({
        hoverStateEnabled: true,
        showBorders: true,
        showRowLines: true,
        allowColumnResizing: true,
        selection: {
            mode: 'single',
        },
        paging: {
            enabled: false,
        },
        columns: [
            {
                dataField: 'INSFLAG',
                allowEditing: false,
                visible: false
            },
            {
                dataField: 'BKG_ROOM_SEQ',
                caption: '순번',
                allowEditing: false,
            },
            {
                dataField: 'BKG_NO',
                caption: '상품관리번호',
                visible: false,
                allowEditing: false,
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
                dataField: 'ROOM_NM',
                caption: '객실 명',
            },
            {
                dataField: 'ROOM_CNT',
                caption: '객실 수'
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
            e.data.BKG_NO = "";
            e.data.CONF_NM = '';
            e.data.CONF_CNT = '';
            e.data.PRC = '0';
            e.data.BKG_SEQ = 0;
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

    var gridMeal1 = $("#orgMeal").dxDataGrid({
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
                allowEditing: false,
                visible: false
            },
            {
                dataField: 'BKG_SEQ',
                caption: '순번',
                allowEditing: false,
            },
            {
                dataField: 'BKG_NO',
                caption: '상품관리번호',
                visible: false,
                allowEditing: false,
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
                dataField: 'MEAL_CD',
                caption: '식사코드',
                visible: false,
            },
            {
                dataField: 'MEAL_NM',
                caption: '식사 명',
                lookup: {
                    dataSource: {
                        load: function () {
                            objJsonData.ITEM_CD = gridItem1.cellValue(0, "ITEM_CD");
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
                format: "fixedpoint",
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
            e.data.BKG_NO = BKG_NO.option("value");
            e.data.BKG_SEQ = 0;
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
            if (e.parentType == 'dataRow') {
                //숫자값 4자리 최대 설정
                if (e.dataType == 'number') {
                    e.editorOptions.max = 9999999999;
                }
            }
            if (e.parentType == "dataRow" && e.dataField == "MEAL_NM") {
                e.editorOptions.searchEnabled = false;
            }
        },
        scrolling: {
            mode: 'virtual',
        },
    }).dxDataGrid('instance');
    var gridMeal2 = $("#modMeal").dxDataGrid({
        hoverStateEnabled: true,
        showBorders: true,
        showRowLines: true,
        allowColumnResizing: true,
        selection: {
            mode: 'single',
        },
        paging: {
            enabled: false,
        },
        columns: [
            {
                dataField: 'INSFLAG',
                allowEditing: false,
                visible: false
            },
            {
                dataField: 'BKG_MEAL_SEQ',
                caption: '순번',
                allowEditing: false,
            },
            {
                dataField: 'BKG_NO',
                caption: '상품관리번호',
                visible: false,
                allowEditing: false,
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
                dataField: 'MEAL_CD',
                caption: '식사코드',
                visible: false,
            },
            {
                dataField: 'MEAL_NM',
                caption: '식사 명',
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
            e.data.BKG_NO = "";
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

    var gridEtc1 = $("#orgEtc").dxDataGrid({
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
                allowEditing: false,
                visible: false
            },
            {
                dataField: 'BKG_SEQ',
                caption: '순번',
                allowEditing: false,
            },
            {
                dataField: 'BKG_NO',
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
                            objJsonData.ITEM_CD = gridItem1.cellValue(0, "ITEM_CD");
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
                format: "fixedpoint",
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
            e.data.BKG_NO = BKG_NO.option("value");
            e.data.BKG_SEQ = 0;
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
            if (e.parentType == 'dataRow') {
                //숫자값 4자리 최대 설정
                if (e.dataType == 'number') {
                    e.editorOptions.max = 9999999999;
                }
            }
            if (e.parentType == "dataRow" && e.dataField == "SVC_NM") {
                e.editorOptions.searchEnabled = false;
            }
        },
        scrolling: {
            mode: 'virtual',
        },
    }).dxDataGrid('instance');
    var gridEtc2 = $("#modEtc").dxDataGrid({
        hoverStateEnabled: true,
        showBorders: true,
        showRowLines: true,
        allowColumnResizing: true,
        selection: {
            mode: 'single',
        },
        paging: {
            enabled: false,
        },
        columns: [
            {
                dataField: 'INSFLAG',
                allowEditing: false,
                visible: false
            },
            {
                dataField: 'BKG_SVC_SEQ',
                caption: '순번',
                allowEditing: false,
            },
            {
                dataField: 'BKG_NO',
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
                visible:false,
            },
            {
                dataField: 'SVC_NM',
                caption: '부가서비스',
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
            e.data.BKG_NO = "";
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

    //#endregion


    var tabs = $("#gridTabs").dxTabs({
        dataSource: [{ id: 0, text: "세미나실 정보" }, { id: 1, text: "숙박 정보" }, { id: 2, text: "식사 정보" }, { id: 3, text: "부가서비스 정보" }],
        selectedIndex: 0,
        onItemClick(e) {
            $(".gridGrp").hide();
            if (e.itemData.id == 0) {


                tab_nm = "CONF";

                $("#orgConference").show();
                $("#modConference").show();
                gridConf1.beginUpdate();
                gridConf1.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridConf1.endUpdate();
                gridConf2.beginUpdate();
                gridConf2.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridConf2.endUpdate();

            } else if (e.itemData.id == 1) {
                tab_nm = "ROOM";
                $("#orgRoom").show();
                $("#modRoom").show();
                gridRoom1.beginUpdate();
                gridRoom1.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridRoom1.endUpdate();
                gridRoom2.beginUpdate();
                gridRoom2.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridRoom2.endUpdate();



            } else if (e.itemData.id == 2) {
                tab_nm = "MEAL";

                $("#orgMeal").show();
                $("#modMeal").show();
                gridMeal1.beginUpdate();
                gridMeal1.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridMeal1.endUpdate();
                gridMeal2.beginUpdate();
                gridMeal2.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridMeal2.endUpdate();


            } else if (e.itemData.id == 3) {
                tab_nm = "SVC";
                $("#orgEtc").show();
                $("#modEtc").show();
                gridEtc1.beginUpdate();
                gridEtc1.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridEtc1.endUpdate();
                gridEtc2.beginUpdate();
                gridEtc2.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridEtc2.endUpdate();



            }
        }
    }).dxTabs('instance');


    //#region 함수 영역


    function fnSearchData(param1, param2,param3) {
        var SObj = new Object();
        SObj.BKG_NO = param1;
        SObj.BKG_MOD_NO = param2;
        SObj.BKG_MOD_SEQ = param3;

        tot_conf = 0;
        tot_meal = 0;
        tot_room = 0;
        tot_svc = 0;

        $.ajax({
            type: "POST",
            url: "/Bkg/fnOrdModSearch",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(SObj) },
            success: function (result) {
                //데이터바인딩
                var resultData = JSON.parse(result);

                

                //#region 상단 미변경 데이터 바인딩
                BKG_NO.option('value', resultData["ORG_MAIN"][0]["BKG_NO"]);
                CUST_NM.option('value', resultData["ORG_MAIN"][0]["CUST_NM"]);
                CUST_TEL.option('value', resultData["ORG_MAIN"][0]["CUST_TEL"]);
                CUST_EMAIL.option('value', resultData["ORG_MAIN"][0]["CUST_EMAIL"]);
                BKG_MOD_NO.option('value', getParameter("modNO"));
                //#endregion 


                //#region 헤더 그리드 바인딩

                //#region ORG
                gridItem1.beginUpdate();
                gridItem1.saveEditData();
                gridItem1.option('dataSource', resultData["ORG_MAIN"]);
                gridItem1.endUpdate();

                //#endregion

                //#region MOD

                gridItem2.beginUpdate();
                gridItem2.saveEditData();
                gridItem2.option('dataSource', resultData["MOD_HD"]);
                gridItem2.endUpdate();

                //#endregion


                //#endregion


                //#region 디테일 그리드 바인딩


                //#region ORG
                gridMeal1.beginUpdate();
                gridMeal1.saveEditData();
                gridMeal1.option('dataSource', resultData["ORG_MEAL"]);
                gridMeal1.endUpdate();

                if (resultData["ORG_MEAL"].length > 0) {
                    tot_meal = parseInt(_fnToZero(resultData["ORG_MEAL"][0].SUM_PRC));
                }



                gridConf1.beginUpdate();
                gridConf1.saveEditData();
                gridConf1.option('dataSource', resultData["ORG_CONF"]);
                gridConf1.endUpdate();


                if (resultData["ORG_CONF"].length > 0) {
                    tot_conf = parseInt(_fnToZero(resultData["ORG_CONF"][0].SUM_PRC));
                }
                

                gridRoom1.beginUpdate();
                gridRoom1.saveEditData();
                gridRoom1.option('dataSource', resultData["ORG_ROOM"]);
                gridRoom1.endUpdate();

                if (resultData["ORG_ROOM"].length > 0) {
                    tot_room = parseInt(_fnToZero(resultData["ORG_ROOM"][0].SUM_PRC));
                }

                gridEtc1.beginUpdate();
                gridEtc1.saveEditData();
                gridEtc1.option('dataSource', resultData["ORG_SVC"]);
                gridEtc1.endUpdate();


                if (resultData["ORG_SVC"].length > 0) {
                    tot_svc = parseInt(_fnToZero(resultData["ORG_SVC"][0].SUM_PRC));
                }
                mod_amt = tot_conf + tot_room + tot_meal + tot_svc;
                //gridItem1.cellValue(0,7, mod_amt);

                //#endregion

                //#region MOD
                gridConf2.beginUpdate();
                gridConf2.saveEditData();
                gridConf2.option('dataSource', resultData["MOD_CONF"]);
                gridConf2.endUpdate();

                gridMeal2.beginUpdate();
                gridMeal2.saveEditData();
                gridMeal2.option('dataSource', resultData["MOD_MEAL"]);
                gridMeal2.endUpdate();


                gridRoom2.beginUpdate();
                gridRoom2.saveEditData();
                gridRoom2.option('dataSource', resultData["MOD_ROOM"]);
                gridRoom2.endUpdate();

                gridEtc2.beginUpdate();
                gridEtc2.saveEditData();
                gridEtc2.option('dataSource', resultData["MOD_SVC"]);
                gridEtc2.endUpdate();
                //#endregion

                //#endregion

            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });

    }

    //#endregion

    fnSearchData(getParameter('bkgNo'), getParameter('modNo'), getParameter('modSEQ'));


    function fnUpdateDetailData() {
        var url = "";

        var UpdateObj = new Object();


        var Dtlarr = new Array();
        var past_amt = 0;

        if (tab_nm == "CONF") {
            url = "/Bkg/fnUpdateBkgConf";
            gridConf1.saveEditData();
            Dtlarr = gridConf1.option('dataSource');
            past_amt = parseInt(_fnToZero(tot_conf));
        }
        else if (tab_nm == "ROOM") {
            url = "/Bkg/fnUpdateBkgRoom";
            gridRoom1.saveEditData();
            Dtlarr = gridRoom1.option('dataSource');
            past_amt = parseInt(_fnToZero(tot_room));
        }
        else if (tab_nm == "MEAL") {
            url = "/Bkg/fnUpdateBkgMeal";
            gridMeal1.saveEditData();
            Dtlarr = gridMeal1.option('dataSource');
            past_amt = parseInt(_fnToZero(tot_meal));
        }
        else if (tab_nm == "SVC") {
            url = "/Bkg/fnUpdateBkgSvc";
            gridEtc1.saveEditData();
            Dtlarr = gridEtc1.option('dataSource');
            past_amt = parseInt(_fnToZero(tot_svc));
        }

        var now_amt = 0;

        for (var i = -1; ++i < Dtlarr.length;) {
            var dtlDr = Dtlarr[i];
            delete dtlDr.__KEY__;
            if (_fnToNull(dtlDr.PRC) == "") {
                dtlDr.PRC = "0";
            }

            if (tab_nm == "CONF") {
                delete dtlDr.SUM_PRC;
                delete dtlDr.ITEM_CD;
                delete dtlDr.ITEM_SEQ;
            }
            if (!dtlDr.hasOwnProperty("INSFLAG") || dtlDr.INSFLAG != "D") { // 삭제건 제외
                now_amt += parseInt(_fnToZero(Dtlarr[i].PRC));
            }
            //if (!dtlDr.hasOwnProperty("INSFLAG") || dtlDr.INSFLAG == "D") { // 삭제건
            //    now_amt -= parseInt(_fnToZero(Dtlarr[i].PRC));
            //}

            if (!dtlDr.hasOwnProperty("INSFLAG") || dtlDr.INSFLAG == "Q") {
                Dtlarr.splice(i, 1);
                i--;
            }
        }

        mod_amt += (now_amt - past_amt);
        gridItem1.cellValue(0, 7, mod_amt);

        $.ajax({
            type: "POST",
            url: url,
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(Dtlarr) },
            success: function (result) {

                var resultData = JSON.parse(result);

                if (resultData["Result"][0].trxCode == "Y") {
                    var DtlTable = resultData.Table1;

                    var alert_text = "";
                    if (tab_nm == "CONF") {
                        gridConf1.beginUpdate();
                        gridConf1.saveEditData();
                        gridConf1.option('dataSource', DtlTable);
                        gridConf1.endUpdate();
                        alert_text = "세미나실 정보";
                        if (DtlTable.length > 0) {
                            tot_conf = DtlTable[0].SUM_PRC;
                        }
                        else {
                            tot_conf = 0;
                        }
                        
                    }


                    if (tab_nm == "ROOM") {
                        gridRoom1.beginUpdate();
                        gridRoom1.saveEditData();
                        gridRoom1.option('dataSource', DtlTable);
                        gridRoom1.endUpdate();
                        alert_text = "숙박 정보";
                        if (DtlTable.length > 0) {
                            tot_room = DtlTable[0].SUM_PRC;
                        }
                        else {
                            tot_room = 0;
                        }
                        
                    }
                    if (tab_nm == "MEAL") {
                        gridMeal1.beginUpdate();
                        gridMeal1.saveEditData();
                        gridMeal1.option('dataSource', DtlTable);
                        gridMeal1.endUpdate();
                        alert_text = "식사 정보";
                        if (DtlTable.length > 0) {
                            tot_meal = DtlTable[0].SUM_PRC;
                        }
                        else {
                            tot_meal = 0;
                        }
                    }

                    if (tab_nm == "SVC") {
                        gridEtc1.beginUpdate();
                        gridEtc1.saveEditData();
                        gridEtc1.option('dataSource', DtlTable);
                        gridEtc1.endUpdate();
                        alert_text = "부가서비스 정보";
                        if (DtlTable.length > 0) {
                            tot_svc = DtlTable[0].SUM_PRC;
                        }
                        else {
                            tot_svc = 0;
                        }
                    }

                    DevExpress.ui.dialog.alert("<i>수정되었습니다.</i>", alert_text);

                }

            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });

    }


    function UpdateBkgHeader() {

        gridItem1.saveEditData();

        var arrDtl = new Array();

        arrDtl = gridItem1.option('dataSource');

        for (var i = -1; ++i < arrDtl.length;) {
            var confDr = arrDtl[i];
            if (!confDr.hasOwnProperty("INSFLAG") || confDr.INSFLAG == "Q") {
                arrDtl.splice(i, 1);
                i--;
            }
        }

        $.ajax({
            type: "POST",
            url: "/Bkg/UpdateHeader",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(arrDtl) },
            success: function (result) {
                var data = JSON.parse(result);
                if (data.Result[0].trxCode == "Y") {
                    
                    gridItem1.beginUpdate();
                    gridItem1.saveEditData();
                    gridItem1.option('dataSource', data.ORG_MAIN);
                    gridItem1.endUpdate();

                    DevExpress.ui.dialog.alert("수정사항이 반영되었습니다.");
                }
                

            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });

    }

    function fnUpdateMod(flag) {
        var UpModObj = new Object();

        UpModObj.BKG_MOD_NO = getParameter("modNO");
        UpModObj.BKG_MOD_SEQ = getParameter("modSEQ");
        UpModObj.BKG_MOD_FLAG = flag;

        $.ajax({
            type: "POST",
            url: "/Bkg/UpDateMOD_FLAG",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(UpModObj) },
            success: function (result) {
                location.href = "/admin/bkgModList";

            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });
    }
});