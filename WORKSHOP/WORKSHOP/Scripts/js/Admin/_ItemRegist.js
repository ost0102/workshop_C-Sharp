
var objJsonData = new Object();
var item_cd = "";
var item_mngtno = "";
var tab_nm = "HOTEL";
var path = "";
var SearchObj = new Object();

var row = "";
var col = "";


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


    //var STRT_YMD = $("#STRT_YMD").dxDateBox({
    //    value: "",
    //    width: 200,
    //    value: new Date(Date.parse(new Date()) - 6 * 1000 * 60 * 60 * 24),
    //}).dxDateBox('instance');

    //var END_YMD = $("#END_YMD").dxDateBox({
    //    value: "",
    //    width: 200,
    //    value: new Date()
    //}).dxDateBox('instance');


    var ITEM_NM = $("#ITEM_NM").dxTextBox({ // 상품명
        value: "",
        width: 200,
    }).dxTextBox('instance');

    

    //var TAG = $("#TAG").dxTextBox({
    //    value: "",
    //    width: 200
    //}).dxTextBox('instance');

    var ITEM_TYPE = $("#ITEM_TYPE").dxSelectBox({ // 상품구분
        width: 150,
        displayExpr: "COMM_NM",
        valueExpr: "COMM_NM",
        value: "전체",
        acceptCustomValue: true,
        dataSource: layoutSearchITEMTYPE.option('dataSource'),
    }).dxSelectBox('instance');

    

    var ITEM_GRD = $("#ITEM_GRD").dxSelectBox({ // 등급
        width: 150,
        displayExpr: "COMM_NM",
        valueExpr: "COMM_NM",
        value: "전체",
        acceptCustomValue: true,
        dataSource: layoutSearchGRPGRD.option('dataSource'),
    }).dxSelectBox('instance');




    var GRP_CD = $("#GRP_CD").dxSelectBox({ // 지역
        width: 150,
        displayExpr: "COMM_NM",
        valueExpr: "COMM_NM",
        acceptCustomValue: true,
        value: "전체",
        dataSource: layoutSearchGRP_CD.option('dataSource')
    }).dxSelectBox('instance');


    var USE_YN = $("#USE_YN").dxSelectBox({ // 사용여부
        width: 150,
        value: "A",
        valueExpr: "CODE",
        displayExpr: "NAME",
        acceptCustomValue: true,
        dataSource: [{ CODE: "A", NAME: "전체" }, { CODE: "Y", NAME: "사용" }, { CODE: "N", NAME: "미사용" }],
    }).dxSelectBox('instance');


    var DOC_TYPE = $("#pic_type_select").dxSelectBox({
        width: 150,
        value: "I",
        valueExpr: "CODE",
        displayExpr: "NAME",
        acceptCustomValue: true,
        dataSource: [{ CODE: "A", NAME: "행사사진" }, { CODE: "I", NAME: "시설사진" }],
    }).dxSelectBox('instance');

    $(".sch_input .dx-texteditor-input").attr("readonly", true);

    var btnSearch = $("#btnSearch").dxButton({
        text: "검색",
        onClick: function () {
            SearchData();
        }
    }).dxButton('instance');

    //#endregion 

    SearchData();

    //#region  ※※메인 그리드※※
    var gridItem = $("#gridItem").dxDataGrid({
        hoverStateEnabled: true,
        height: 450,
        showRowLines : true,
        /*allowColumnResizing: true,*/
        showBorders: true,
        selection: {
            mode: 'single',
        },
        scrolling: {
            mode: 'virtual',
        },
        //paging: {
        //    enabled: false,
        //},
        editing: {
            mode: 'batch',
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
            texts: {
                deleteRow: "삭제",
                undeleteRow: "삭제 취소"
            }
        },
        columns: [
  
            {
                dataField: 'MNGT_NO',
                caption: '상품관리번호',
                width: 180,
                fixed: true,
                fixedPosition: "left",
                allowEditing: false,
                
            },
            {
                dataField: 'REC_YN',
                caption: '추천여부',
                /*visible: false,*/
                dataType: "boolean",
                width: 75,
                visible: true,
                setCellValue: function (rowData, value) {

                    var newValue = (value == true ? 1 : 0);
                    this.defaultSetCellValue(rowData, newValue);
                }
            },
            {
                dataField: 'USE_YN',
                caption: '사용여부',
                width: 90,
                visible: true,
                lookup: {
                    dataSource: [{ CODE: "Y", NAME: "사용" }, { CODE: "N", NAME: "미사용" }],
                    valueExpr: "CODE",
                    displayExpr: "NAME",

                },
            },

            {
                dataField: 'AREA',
                caption: '지역',
                width: 80,
                visible: true,
                lookup: {
                    dataSource: layoutGRP_CD.option('dataSource'),
                    displayExpr: "COMM_NM",
                    valueExpr: "COMM_NM",
                },
                //onValueChanged: function (e) {
                //    const previousValue = e.previousValue;
                //    alert(e.value);
                //    const newValue = e.value;
                //}
            },
            {
                dataField: 'ITEM_TYPE',
                caption: '상품구분',
                width: 90,
                visible:true,
                lookup: {
                    dataSource: layoutITEMTYPE.option('dataSource'),
                    displayExpr: "COMM_NM",
                    valueExpr: "COMM_NM",
                }
            },
            {
                dataField: 'ITEM_NM',
                caption: '상품명',
                width: 300,
                visible: true,
            },
            {
                dataField: 'ITEM_GRD',
                caption: '등급',
                width: 90,
                lookup: {
                    dataSource: layoutGRPGRD.option('dataSource'),
                    displayExpr: "COMM_NM",
                    valueExpr: "COMM_NM",
                }
            },
            {
                dataField: 'MIN_TO',
                caption: '최소인원',
                width: 75,
                dataType: 'number',
                format: "fixedpoint",
            },
            {
                dataField: 'MAX_TO',
                caption: '최대인원',
                width: 75,
                dataType: 'number',
                format: "fixedpoint",
            },
            {
                dataField: 'ADDR1',
                caption: '기본주소',
                width: 300,
            },
            {
                dataField: 'ADDR2',
                caption: '상세주소',
                width: 300,
            },
            {
                dataField: 'ZIPCODE',
                caption: '우편번호',
                width: 80,
            },
            {
                dataField: 'HOME_URL',
                caption: '홈페이지 주소',
                width: 250,
            },
            {
                dataField: 'TAG',
                caption: '태그',
                width: 300,
                allowEditing: true,
            },
            {
                dataField: 'USE_CNT',
                caption: '이용횟수',
                dataType: 'number',
                width: 100,
                allowEditing: true,
            },
            {
                dataField: 'RMK',
                caption: '비고',
                width: 300,
            },
            {
                dataField: 'INSFLAG',
                allowEditing: false,
                visible: false

            },
            {
                dataField: 'ITEM_SEQ',
                width: 180,
                visible: false,
                allowEditing: false
            },
            {
                dataField: 'ITEM_CD',
                caption: '상품코드',
                visible: false,
                allowEditing: false
            },
            {
                dataField: 'MAP_X',
                width: 180,
                visible: false,
                allowEditing: false
            },
            {
                dataField: 'MAP_Y',
                width: 180,
                visible: false,
                allowEditing: false
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
                            saveItemMst();
                        }
                    },
                },
                {

                    widget: 'dxButton',
                    showText: 'always',
                    options: {
                        icon: 'import',
                        text: '엑셀업로드',
                        onClick(e) {
                            $('#imgupload').trigger('click');

                        }
                    },
                },
                {

                    widget: 'dxButton',
                    showText: 'always',
                    options: {
                        icon: 'xlsxfile',
                        text: '엑셀양식',
                        onClick(e) {
                            window.location = "/Files/ItemList.xlsx";

                        }
                    },
                },
            ],
        },
        onEditorPreparing: function (e) {
            if (e.parentType == 'dataRow') {
                //숫자값 4자리 최대 설정
                if (e.dataType == 'number') {
                    e.editorOptions.max = 9999;
                }
                if (e.dataField == 'ITEM_NM' || e.dataField == 'ADDR1' || e.dataField == 'ADDR2' || e.dataField == 'TAG' || e.dataField == 'RMK' || e.dataField == 'HOME_URL' || e.dataField == 'ZIPCODE') {
                    e.editorOptions.maxLength = 50;
                }
            }
            if ((e.dataField == "RMK" || e.dataField == "TAG") && e.parentType === "dataRow") {
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
            if (e.parentType == "dataRow" && (e.editorName == "dxSelectBox")) {
                
                e.editorOptions.searchEnabled = false; //셀렉트 박스 입력 막기
                
            }

            var oldOnValueChanged = e.editorOptions.onValueChanged;
            e.editorOptions.onValueChanged = function (args) {
                oldOnValueChanged.apply(this, arguments);   //입력한 값 반영
            };
        },
        onInitNewRow: function (e) {
            e.data.INSFLAG = 'I';
            e.data.MNGT_NO = "ITEM" + _fnNow();
            e.data.REC_YN = false;
            e.data.ITEM_CD = '';
            e.data.ITEM_SEQ = "";
            e.data.AREA = '';
            e.data.ITEM_TYPE = '';
            e.data.ITEM_NM = '';
            e.data.ITEM_GRD = '';
            e.data.MIN_TO = '';
            e.data.MAX_TO = '';
            e.data.ADDR1 = '';
            e.data.ADDR2 = '';
            e.data.ZIPCODE = '';
            e.data.HOME_URL = '';
            e.data.TAG = '';
            e.data.RMK = '';
            e.data.USE_CNT = '';
            e.data.MAP_X = '';
            e.data.MAP_Y = '';
            e.data.USE_YN = "Y";
        },
        onRowUpdating: function (e) {
            console.log(e);
            if (e.key.INSFLAG == "Q") {
                e.key.INSFLAG = "U";
            }
        },
        onRowRemoving: function (e) {
            e.cancel = true;
            e.data.INSFLAG = 'D';
        },
        keyboardNavigation: { //넥스트 포커스
            enterKeyAction: 'moveFocus',
            enterKeyDirection: 'row',
            editOnKeyPress: true,
            
        },
        onCellPrepared: function onCellPrepared(e) {
            if (e.columnIndex == 2 || e.columnIndex == 3 || e.columnIndex == 4 || e.columnIndex == 6) { // css 셋팅*/
                e.cellElement.css("text-align", "center");
            }
        },

        onSelectionChanged(selectedItems) {
            const data = selectedItems.selectedRowsData[0];
            if (_fnToNull(data) != "") {
                if (data.ITEM_CD != "") {
                    item_cd = data.ITEM_CD;
                    item_mngtno = data.MNGT_NO;
                    fnSearchItemConfDetail(data.ITEM_CD, tab_nm);
                }
            }
        },
        onFocusedCellChanged: function (e) {
            // 태그 컬럼일 때  키이벤트 체크
            col = e.columnIndex;  // 13 => Tag 컬럼
            row = e.rowIndex;
            //checkSpace(col,row);

            //if (col != 0) {
            //    console.log(e.column.dataField);
            //    e.component.editCell(row, e.column.dataField);
            //    //e.component.editCell(row, "USE_YN");
            //}
        },
    }).dxDataGrid('instance');

    //#endregion

    //#region ※※DTL 그리드※※


    document.getElementById('imgupload').addEventListener('change', handleFileSelect, false);
    function handleFileSelect(evt) {
        var files = evt.target.files; // FileList object
        var xl2json = new ExcelToJSON();
        console.log("xl2" + xl2json);
        var str = xl2json.parseExcel(files[0]);
        console.log("str" + str);
        console.log("xlx" + $('#xlx_json').val());
        var result = DevExpress.ui.dialog.confirm("<i>저장하시겠습니까??</i>");
        result.done(function (dialogResult) {
            if (dialogResult) {
                saveExcel($("#xlx_json").val());
            }
        });
    }

    function saveExcel(xl2Json) {

        $.ajax({
            type: "POST",
            url: "/AdItemRegist/fnSaveExcel",
            async: true,
            dataType: "json",
            data: { "vJsonData": xl2Json },
            success: function (result) {
                if (JSON.parse(result).Result[0].trxCode == "Y") {
                    SearchData();
                    DevExpress.ui.dialog.alert("<i>저장되었습니다.</i>", "");
                  
                } else {

                }
            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });
    }


    var gridHotel = $("#gridHotel").dxDataGrid({
        dataSource: [],
        showBorders: true,
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
                dataField: 'MNGT_NO',
                caption: '상품관리번호',
                visible: false,
            },
            {
                dataField: 'ITEM_CD',
                caption: '상품코드',
                visible: false,
            },
            {
                dataField: 'HOTEL_NM',
                caption: '상호명'
            },
            {
                dataField: 'CEO',
                caption: '대표자명'
            },
            {
                dataField: 'CRN',
                caption: '사업자번호'
            },
            {
                dataField: 'HOTEL_ADDR',
                caption: '사업장주소'
            },
            {
                dataField: 'HOTEL_PIC',
                caption: '담당자 명'
            },
            {
                dataField: 'HOTEL_TEL',
                caption: '담당자 연락처'
            },
            {
                dataField: 'HOTEL_EMAIL',
                caption: '담당자 이메일'
            },
            {
                dataField: 'RMK',
                caption: '비고'
            },
            {
                dataField: 'ITEM_SEQ',
                caption: '상품 시퀀스',
                visible: false,
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
                    if (item_cd == "") {
                        /*DevExpress.ui.dialog.alert("<i>상품을 선택해주세요.</i>", "");*/
                        return false;
                    }
                },
            },
            {
                name: 'saveButton',
                showText: 'always',
                options: {
                    text: '저장',
                    onClick(e) {
                        saveDTL(tab_nm);
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

    var gridConference = $("#gridConference").dxDataGrid({
        dataSource:[],
        showBorders: true,
        height: 300,
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
                deleteRow: "삭제",
                undeleteRow: "삭제취소",
            }
        },
        columns: [

            {
                dataField: 'CONF_TYPE',
                caption: '세미나실 명'
            },
            {
                dataField: 'MAX_NUM',
                caption: '최대인원',
                dataType: 'number',
                format: "fixedpoint"
            },
            {
                dataField: 'USE_YN',
                caption: '사용여부',
                lookup: {
                    dataSource: [{ CODE: "Y", NAME: "사용" }, { CODE: "N", NAME: "미사용" }],
                    valueExpr: "CODE",
                    displayExpr: "NAME"
                }
            },
            {
                dataField: 'INSFLAG',
                visible: false,
            },
            {
                dataField: 'MNGT_NO',
                caption: '상품관리번호',
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

        ],
        toolbar: {
            items: [{
                name: 'addRowButton',
                showText: 'always',
                options: {
                    text: '추가',
                    disabled : true
                },
                onClick(e) {
                    if (item_cd == "") {
                        /*DevExpress.ui.dialog.alert("<i>상품을 선택해주세요.</i>", "");*/
                        return false;
                    }
                },
            },
            {
                name: 'saveButton',
                showText: 'always',
                options: {
                    text: '저장',
                    onClick(e) {
                        saveDTL(tab_nm);
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


    var gridRoom = $("#gridRoom").dxDataGrid({
        dataSource: [],
        showBorders: true,
        height: 300,
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
                deleteRow: "삭제",
                undeleteRow: "삭제취소",
            }
        },
        columns: [

            {
                dataField: 'ROOM_NM',
                caption: '객실 명'
            },
            {
                dataField: 'MIN_NUM',
                caption: '기준인원',
                dataType: 'number',
                format: "fixedpoint"
            },
            {
                dataField: 'MAX_NUM',
                caption: '최대인원',
                dataType: 'number',
                format: "fixedpoint"
            },
            {
                dataField: 'USE_YN',
                caption: '사용여부',
                lookup: {
                    dataSource: [{ CODE: "Y", NAME: "사용" }, { CODE: "N", NAME: "미사용" }],
                    valueExpr: "CODE",
                    displayExpr: "NAME"
                }
            },
            {
                dataField: 'INSFLAG',
                visible: false,
            },
            {
                dataField: 'MNGT_NO',
                caption: '상품관리번호',
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
                    if (item_cd == "") {
                        return false;
                    }
                },

            },
            {
                name: 'saveButton',
                showText: 'always',
                options: {
                    text: '저장',
                    onClick(e) {
                        saveDTL(tab_nm);
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
                e.data.ROOM_NM = "";
                e.data.MIN_NUM = "";
                e.data.MAX_NUM = "";
                e.data.USE_YN = "Y";
            }
            else {
                return false
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
        scrolling: {
            mode: 'virtual',
        },
    }).dxDataGrid('instance');



    var gridMeal = $("#gridMeal").dxDataGrid({
        dataSource: [],
        showBorders: true,
        height: 300,
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
                deleteRow: "삭제",
                undeleteRow: "삭제취소",
            }
        },
        columns: [

            {
                dataField: 'MEAL_NM',
                caption: '식사종류'
            },
            {
                dataField: 'USE_YN',
                caption: '사용여부',
                lookup: {
                    dataSource: [{ CODE: "Y", NAME: "사용" }, { CODE: "N", NAME: "미사용" }],
                    valueExpr: "CODE",
                    displayExpr: "NAME"
                }
            },
            {
                dataField: 'INSFLAG',
                visible: false,
            },
            {
                dataField: 'MNGT_NO',
                caption: '상품관리번호',
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
                dataField: 'MEAL_CD',
                caption: '식사코드',
                visible: false,
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
                    if (item_cd == "") {
                        /*alert("상품을 선택하세요");*/
                        return false;
                    }
                },
            },
            {
                name: 'saveButton',
                showText: 'always',
                options: {
                    text: '저장',
                    onClick(e) {
                        saveDTL(tab_nm);
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
                e.data.MEAL_CD = "";
                e.data.MEAL_NM = "";
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
        scrolling: {
            mode: 'virtual',
        },
    }).dxDataGrid('instance');


    var gridEtc = $("#gridEtc").dxDataGrid({
        dataSource: [],
        showBorders: true,
        height: 300,
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
                deleteRow: "삭제",
                undeleteRow: "삭제취소",
            }
        },
        columns: [
            {
                dataField: 'SVC_NM',
                caption: '부가서비스',
            },
            {
                dataField: 'USE_YN',
                caption: '사용여부',
                lookup: {
                    dataSource: [{ CODE: "Y", NAME: "사용" }, { CODE: "N", NAME: "미사용" }],
                    valueExpr: "CODE",
                    displayExpr: "NAME"
                }
            },
            {
                dataField: 'INSFLAG',
                visible: false,
            },
            {
                dataField: 'MNGT_NO',
                caption: '상품관리번호',
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
                caption: 'SVC CODE',
                visible: false,
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
                    if (item_cd == "") {
/*                        alert("상품을 선택하세요");*/
                        return false;
                    }
                },
            },
            {
                name: 'saveButton',
                showText: 'always',
                options: {
                    text: '저장',
                    onClick(e) {
                        saveDTL(tab_nm);
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
                e.data.SVC_CD = "";
                e.data.SVC_NM = "";
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
        onEditorPreparing: function (e) {
            if (e.parentType == "dataRow" && (e.editorName == "dxSelectBox")) { // 셀렉트 박스 입력 막기
                e.editorOptions.searchEnabled = false;
            }
        },
        onRowRemoving: function (e) {
            e.cancel = true;
            e.data.INSFLAG = 'D';
        },
        keyboardNavigation: {
            enterKeyAction: 'moveFocus',
            enterKeyDirection: 'row',
            editOnKeyPress: true,
        },
        scrolling: {
            mode: 'virtual',
        },
    }).dxDataGrid('instance');


    var fileUploader = $("#file-uploader").dxFileUploader({
        selectButtonText: '파일선택...',
        labelText: '또는 파일을 끌어다 놓으십시오.',
        multiple: false,
        allowedFileExtensions: ['.jpg', '.jpeg', '.gif', '.png'],
        value: [],
        uploadMode: "instantly",
        uploadFailedMessage: "파일 업로드를 처리 하지 못했습니다.",
        //uploadUrl: "../file_upload/" + sessionStorage.getItem('OfficeCode') + "/",
        uploadUrl: "/AditemRegist/UploadHandler",
        onUploaded: function (e) {
            $(".dx-fileuploader-files-container").hide();
            //업로드가 완료되면 그리드에 Row 추가
            if (item_cd != "") {
                if (JSON.parse(e.request.responseText).rec_cd == "Y") {
                    path = JSON.parse(e.request.responseText).res_msg;
                    gridDoc.addRow();
                }
            }
            else {
                DevExpress.ui.dialog.alert("<i>상품을 선택해주세요.</i>", "");
            }
            
        },
        onUploadError: function (e) {
            consol.log("파일업로드 실패");
        }
    }).dxFileUploader("instance");


    var gridDoc = $("#gridDoc").dxDataGrid({
        dataSource: [],
        showBorders: true,
        height: 300,
        showRowLines: true,
        paging: {
            enabled: false,
        },
        editing: {
            mode: 'batch',
            allowAdding: false,
            allowUpdating: true,
            allowDeleting: true,
            texts: {
                deleteRow: "삭제",
                undeleteRow: "삭제취소",
            }
        },
        columns: [
            {
                dataField: "MNGT_NO",
                cation: "관리번호",
                width: 60,
                dataType: "string",
                visible: false,

            },
            {
                dataField: "ITEM_SEQ",
                caption: "순번",
                width: 60,
                dataType: "string",
                allowEditing:false,
            },
            {
                dataField: "ITEM_CD",
                cation: "상품코드",
                width: 60,
                dataType: "string",
                visible: false,

            },
            {
                dataField: "IMG_TYPE",
                caption: "종류",
                width: 100,
                dataType: "string",
                allowEditing: false,
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    var view_text = "";

                    if (s == "A") {
                        view_text = "행사사진";
                    }
                    else if (s == "I") {
                        view_text = "시설사진";
                    }
                    return view_text;

                }
            },
            {
                dataField: "IMG_NM",
                caption: "파일명",
                dataType: "string",
                allowEditing: false,
                width: 240,
                cellTemplate: function (cellElement, cellInfo) {
                    $('<a/>').addClass('dx-link')
                        .text(cellInfo.value)
                        .on('dxclick', function () {    //dxdblclick
                            window.open(cellInfo.data.IMG_PATH + "/" + cellInfo.data.IMG_NM);
                        })
                        .appendTo(cellElement);
                }
            },
            {
                dataField: 'USE_YN',
                caption: '사용여부',
                width: 120,
                lookup: {
                    dataSource: [{ CODE: "Y", NAME: "사용" }, { CODE: "N", NAME: "미사용" }],
                    valueExpr: "CODE",
                    displayExpr: "NAME"
                },
            },
            {
                dataField: 'INSFLAG',
            },
            {
                dataField: "IMG_PATH",
                caption: "Location",
                dataType: "string",
                visible: false,
                width: 400
            },
            //{
            //    dataField: "IMG_REPLACE_NM",
            //    caption: "Server File Name",
            //    dataType: "string",
            //    visible: true,
            //    width: 400
            //}
        ],
        toolbar: {
            items: [
                {
                    name: 'saveButton',
                    showText: 'always',
                    options: {
                        text: '저장',
                        onClick(e) {
                            saveDTL(tab_nm);
                        }
                    },
                },
            ],
        },
        width: 800,
        columnAutoWidth: false,
        rowAlternationEnabled: true,
        showBorders: true,
        dataSource: [],
        loadPanel: { enabled: false },
        onContentReady: function (e) {
            // addDeleteAllButton(e, this, 0);
        },
        //onCellPrepared: function (e) {
        //    //Delete 상태를 보이지 않게 함
        //    if (e.rowType === "data" && e.column.command === "edit" && e.row.removed) {
        //        hiddenGridRow(e.cellElement[0]);
        //    }
        //},
        onInitNewRow: function (e) {
            
            e.data.MNGT_NO = item_mngtno;
            e.data.ITEM_CD = item_cd;
            e.data.ITEM_SEQ = 0 //checkSEQ(tab_nm);
            
            e.data.IMG_NM = fileUploader.option('value')[0].name;
            e.data.IMG_TYPE = _fnToNull(DOC_TYPE.option('value'));
            e.data.IMG_PATH = path;
            e.data.USE_YN = "Y";
            e.data.INSFLAG = "I";
        },
        onRowInserting: function (e) {
            e.data.INSFLAG = "I";
        },
        onRowUpdating: function (e) {
            if (e.key.INSFLAG == "Q") {
                e.key.INSFLAG = "U"
            }
            else {
                e.newData.INSFLAG = "U";
            }

        },
        onRowRemoving: function (e) {
            e.cancel = true;
            e.data.INSFLAG = 'D';
        },
        scrolling: {
            mode: 'virtual',
        },
        //onEditorPreparing: function (e) {
        //    if (e.parentType == 'dataRow') {
        //        e.editorOptions.onKeyUp = function (args) {
        //            setIntpuToUpperCase($(this)[0]);
        //            //var ctrl = $(this)[0];
        //            //ctrl.option('value', ctrl.option('text').toUpperCase());
        //        }
        //    }
        //}
     
    }).dxDataGrid('instance');


    

    // TAB EVNET
    var tabs = $("#gridTabs").dxTabs({
        dataSource: [{ id: 0, text: "담당자 정보" } , { id: 1, text: "세미나실 정보" }, { id: 2, text: "숙박 정보" }, { id: 3, text: "식사 정보" }, { id: 4, text: "부가서비스 정보" }, { id: 5, text: "호텔 이미지 등록" } ],
        selectedIndex: 0,
        onItemClick(e) {
            $(".gridGrp").hide();
            if (e.itemData.id == 0) {
                $("#pic_type_select").hide();
                $("#pic_type").hide();
                $("#gridHotel").show();
                tab_nm = "HOTEL";
                gridHotel.beginUpdate();
                gridHotel.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridHotel.endUpdate();
            }
            else if (e.itemData.id == 1) {
                $("#gridConference").show();
                $("#pic_type_select").hide();
                $("#pic_type").hide();
                tab_nm = "CONF";
                gridConference.beginUpdate();
                gridConference.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridConference.endUpdate();
            } else if (e.itemData.id == 2) {
                $("#gridRoom").show();
                $("#pic_type_select").hide();
                $("#pic_type").hide();
                tab_nm = "ROOM";
                gridRoom.beginUpdate();
                gridRoom.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridRoom.endUpdate();
            } else if (e.itemData.id == 3) {
                $("#gridMeal").show();
                $("#pic_type_select").hide();
                $("#pic_type").hide();
                tab_nm = "MEAL";
                gridMeal.beginUpdate();
                gridMeal.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridMeal.endUpdate();
            } else if (e.itemData.id == 4) {
                $("#pic_type_select").hide();
                $("#pic_type").hide();
                $("#gridEtc").show();
                gridEtc.beginUpdate();
                gridEtc.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridEtc.endUpdate();
                tab_nm = "SVC";
            } else if (e.itemData.id == 5) {
                $("#file-uploader").show();
                $("#gridDoc").show();
                $("#pic_type_select").show();
                $("#pic_type").show();
                gridDoc.beginUpdate();
                gridDoc.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridDoc.endUpdate();
                tab_nm = "IMG";
            }
        }
    }).dxTabs('instance');




    //#endregion
    

    //#endregion

    function ReplaceCellData() {
        console.log("start ReplaceCellData");
        console.log("ROW :" + row + ", COL : " + col)
        var old_data = gridItem.cellValue(row, col);

        console.log("this data : " + old_data);

        console.log("end ReplaceCellData");
    }

    //#region ※※함수 영역※※

    // MST 조회 함수
    function SearchData() {

        SearchObj = new Object();
        //SearchObj.START_YMD = _fnToNull(STRT_YMD.option('text').replace(/-/gi,""));
        //SearchObj.END_YMD = _fnToNull(END_YMD.option('text').replace(/-/gi, ""));
        SearchObj.GRP_CD = _fnToNull(GRP_CD.option("value"));
        SearchObj.ITEM_NM = _fnToNull(ITEM_NM.option('value'));
        SearchObj.ITEM_TYPE = _fnToNull(ITEM_TYPE.option('value'));
        SearchObj.ITEM_GRD = _fnToNull(ITEM_GRD.option('value'));
        SearchObj.USE_YN = _fnToNull(USE_YN.option('value'));
        /*SearchObj.TAG = _fnToNull(TAG.option('value').replace(/#/gi,"%"));*/


        $.ajax({
            type: "POST",
            url: "/AdItemRegist/fnGetItemInfo",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(SearchObj) },
            success: function (result) {
                //데이터바인딩
                var resultData = JSON.parse(result).Table1;
                console.log(resultData);
                //Data Binding
                gridItem.beginUpdate();
                gridItem.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridItem.option('dataSource', resultData);
                gridItem.endUpdate();

                gridHotel.beginUpdate();
                gridHotel.saveEditData();
                gridHotel.option('dataSource', []);
                gridHotel.endUpdate();


                gridConference.beginUpdate();
                gridConference.saveEditData();
                gridConference.option('dataSource', []);
                gridConference.endUpdate();

                gridMeal.beginUpdate();
                gridMeal.saveEditData();
                gridMeal.option('dataSource', []);
                gridMeal.endUpdate();

                gridRoom.beginUpdate();
                gridRoom.saveEditData();
                gridRoom.option('dataSource', []);
                gridRoom.endUpdate();


                gridEtc.beginUpdate();
                gridEtc.saveEditData();
                gridEtc.option('dataSource', []);
                gridEtc.endUpdate();


                gridDoc.beginUpdate();
                gridDoc.saveEditData();
                gridDoc.option('dataSource', []);
                gridDoc.endUpdate();

            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });
    }

    //MST 저장 함수
     function saveItemMst() {

        var isValid = false;
        

        /*var rowCount = $("#gridItem .dx-data-row").length;*/
        var rowCount = $("#gridItem").dxDataGrid('instance').getVisibleRows().length;
        for (i = 0; i < rowCount; i++) {

            //#region Null 값 체크

            // 상품명
            console.log(_fnToNull(gridItem.cellValue(i, gridItem.columnOption("ITEM_NM", "visibleIndex"))))

            if (_fnToNull(gridItem.cellValue(i, gridItem.columnOption("ITEM_NM", "visibleIndex"))) == "") {
                DevExpress.ui.dialog.alert("상품명이 비어있습니다.", "Message");
                return false;
            }

            //#endregion
        }
        gridItem.refresh();


        gridItem.saveEditData();
        var arrMst = new Array();
        var ItemMNGT = "";
        arrMst = gridItem.option('dataSource');

        for (var i = -1; ++i < arrMst.length;) {
            var itemDr = arrMst[i];
            if (!itemDr.hasOwnProperty("INSFLAG") || itemDr.INSFLAG == "Q") {
                arrMst.splice(i, 1);
                i--;
            }
            if (itemDr.INSFLAG == "I") { //신규일 경우 관리번호 채번
                var time = new Date().getTime();
                ItemMNGT = _fnSequenceMngt("ITEM");

                itemDr.MNGT_NO = ItemMNGT;
                itemDr.ITEM_CD = itemDr.MNGT_NO;
                //if (itemDr.ADDR1 != "" || itemDr.ADDR2 != "") {
                //    var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
                //        mapOption = {
                //            center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
                //            level: 3 // 지도의 확대 레벨
                //        };
                //    var map = new kakao.maps.Map(mapContainer, mapOption);
                //    var geocoder = new kakao.maps.services.Geocoder();

                //    geocoder.addressSearch(itemDr.ADDR1 + ' ' + itemDr.ADDR2, function (result, status) {

                //        // 정상적으로 검색이 완료됐으면 
                //        if (status === kakao.maps.services.Status.OK) {
                //            itemDr.MAP_X = result[0].y;
                //            itemDr.MAP_Y = result[0].x;
                //        }
                //    });
                //}
            }
            //if (itemDr.INSFLAG == "U") { 
            //    if (itemDr.ADDR1 != "" || itemDr.ADDR2 != "") {
            //        var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
            //            mapOption = {
            //                center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
            //                level: 3 // 지도의 확대 레벨
            //            };
            //        var map = new kakao.maps.Map(mapContainer, mapOption);
            //        var geocoder = new kakao.maps.services.Geocoder();
            //        geocoder.addressSearch(itemDr.ADDR1 + ' ' + itemDr.ADDR2, function (result, status) {

            //            // 정상적으로 검색이 완료됐으면 
            //            if (status === kakao.maps.services.Status.OK) {
            //                itemDr.MAP_X = _fnToZero(result[0].y);
            //                itemDr.MAP_Y = _fnToZero(result[0].x);
            //            }
            //        });
            //    }
            //}
            if (itemDr.INSFLAG == "D") {
                itemDr.ITEM_SEQ = "MST";
            }
           
        }
         console.log(arrMst);
        $.ajax({
            type: "POST",
            url: "/AditemRegist/fnSaveItemMST",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(arrMst) },
            success: function (result) {

                //데이터바인딩
                SearchData();

                DevExpress.ui.dialog.alert("<i>상품정보가 저장되었습니다.</i>", "");
            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });

    }


    //디테일 정보 통합 조회 함수
    function fnSearchItemConfDetail(item_cd,tab_nm) {
        objJsonData = new Object();
        objJsonData.ITEM_CD = item_cd;
        objJsonData.MNGT_NO = item_mngtno;
        var control_url = "/AditemRegist/fnGetItemDteilAll";

        //#region 단건으로 할때  (미사용)
        //if (tab_nm == "CONF") {
        //    control_url= "/AditemRegist/fnGetItemConfDetail"
        //}
        //else if (tab_nm == "ROOM") {
        //    control_url= "/AditemRegist/fnGetItemRoomDetail"
        //}
        //else if (tab_nm == "SVC") {
        //    control_url= "/AditemRegist/fnGetItemSvcDetail"
        //}
        //else if (tab_nm == "IMG") {
        //    control_url= "/AditemRegist/fnGetItemImgDetail"
        //}
        //#endregion

        $.ajax({
            type: "POST",
            url: control_url,
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                //데이터바인딩
                var resultData = JSON.parse(result);
                //#region Data Binding

                //호텔담당자
                gridHotel.beginUpdate();
                gridHotel.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridHotel.option('dataSource', resultData["HOTEL"]);
                gridHotel.endUpdate();
                gridHotel.option("toolbar.items[0].options.disabled", false) // 선택시 추가 버튼 활성화
               
                //세미나
                gridConference.beginUpdate();
                gridConference.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
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

                //이미지
                gridDoc.beginUpdate();
                gridDoc.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridDoc.option('dataSource', resultData["IMG"]);
                gridDoc.endUpdate();


                //#endregion
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
        var rowCnt;
        var dataGrid;
        var column_type = "";

        //#region  Controller연결 정보 셋팅
        if (tab_nm == "HOTEL") {
            control_url = "/AditemRegist/fnSaveHotelDtl"
            rowCnt = $("#gridHotel").dxDataGrid('instance').getVisibleRows().length;
            dataGrid = gridHotel;
            column_type = "HOTEL_NM";
        }
        else if (tab_nm == "CONF") {
            control_url = "/AditemRegist/fnSaveConfDtl"
            rowCnt = $("#gridConference").dxDataGrid('instance').getVisibleRows().length;
            dataGrid = gridConference;
            column_type = "CONF_TYPE";
        }
        else if (tab_nm == "ROOM") {
            control_url = "/AditemRegist/fnSaveRoomDtl"
            rowCnt = $("#gridRoom").dxDataGrid('instance').getVisibleRows().length;
            dataGrid = gridRoom;
            column_type = "ROOM_NM";
        }
        else if (tab_nm == "MEAL") {
            control_url = "/AditemRegist/fnSaveMealDtl"
            rowCnt = $("#gridMeal").dxDataGrid('instance').getVisibleRows().length;
            dataGrid = gridMeal;
            column_type = "MEAL_NM";
        }
        else if (tab_nm == "SVC") {
            control_url = "/AditemRegist/fnSaveSvcDtl"
            rowCnt = $("#gridEtc").dxDataGrid('instance').getVisibleRows().length;
            dataGrid = gridEtc;
            column_type = "SVC_NM";
        }
        else if (tab_nm == "IMG") {
            control_url = "/AditemRegist/fnSaveImgDtl"
            dataGrid = gridDoc;
            
        }


        if (rowCnt > 0) {
            for (i = 0; i < rowCnt; i++) {
                //#region Null 값 체크
                // 상품명

                if (_fnToNull(dataGrid.cellValue(i, dataGrid.columnOption(column_type, "visibleIndex"))) == "") {
                    DevExpress.ui.dialog.alert("상품명이 비어있습니다.", "Message");
                    return false;
                }
        }
            

            //#endregion
        }

        dataGrid.saveEditData();
        arrDtl = dataGrid.option('dataSource')




        //#endregion

        for (var i = -1; ++i < arrDtl.length;) {
            var confDr = arrDtl[i];
            delete confDr.__KEY__;
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
                console.log("["+tab_nm+" Save] - 성공");
                console.log(result);
                //데이터바인딩
                var resultData = JSON.parse(result).Table1;
                //#region Data Binding

                if (tab_nm == "HOTEL") {
                    gridHotel.beginUpdate();
                    gridHotel.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridHotel.option('dataSource', resultData);
                    gridHotel.endUpdate();
                    DevExpress.ui.dialog.alert("<i>저장되었습니다.</i>", "호텔담당자 정보");
                }
                else if (tab_nm == "CONF") {
                    gridConference.beginUpdate();
                    gridConference.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridConference.option('dataSource', resultData);
                    gridConference.endUpdate();
                    DevExpress.ui.dialog.alert("<i>저장되었습니다.</i>", "세미나 정보");
                }
                else if (tab_nm == "ROOM") {
                    gridRoom.beginUpdate();
                    gridRoom.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridRoom.option('dataSource', resultData);
                    gridRoom.endUpdate();
                    DevExpress.ui.dialog.alert("<i>저장되었습니다.</i>", "숙박 정보");
                }
                else if (tab_nm == "MEAL") {
                    gridMeal.beginUpdate();
                    gridMeal.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridMeal.option('dataSource', resultData);
                    gridMeal.endUpdate();
                    DevExpress.ui.dialog.alert("<i>저장되었습니다.</i>", "식사 정보");
                }
                else if (tab_nm == "SVC") {
                    gridEtc.beginUpdate();
                    gridEtc.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridEtc.option('dataSource', resultData);
                    gridEtc.endUpdate();
                    DevExpress.ui.dialog.alert("<i>저장되었습니다.</i>", "부가서비스 정보");
                }
                else if (tab_nm = "IMG") {
                    gridDoc.beginUpdate();
                    gridDoc.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridDoc.option('dataSource', resultData);
                    gridDoc.endUpdate();
                    DevExpress.ui.dialog.alert("<i>저장되었습니다.</i>", "이미지 정보");
                }

                
                //#endregion
            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });
    }

    function checkSpace(col,row,keyCode) {
        var value = gridItem.getCellElement(row, col).text();
        console.log("Tag value : "+value);
        /*var rep = value.toString() + "#";*/
    }

    //주소 입력에 따른 좌표 설정
    $("#gridItem").keyup(function (e) {
        if (e.keyCode == 13 ||e.keyCode==19) { // 엔터일 때
            if (col == 11) {
                if (_fnToNull(gridItem.cellValue(row, "ADDR1")) != "" && _fnToNull(gridItem.cellValue(row, "ADDR2")) != "") {
                    var addr = gridItem.cellValue(row, "ADDR1") + " " + gridItem.cellValue(row, "ADDR2");

                    var mapContainer = document.getElementById('map'), // 지도를 표시할 div
                        mapOption = {
                            center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
                            level: 3 // 지도의 확대 레벨
                        };


                    var map = new kakao.maps.Map(mapContainer, mapOption);

                    var geocoder = new kakao.maps.services.Geocoder();

                    geocoder.addressSearch(addr, function (result, status) {
                        // 정상적으로 검색이 완료됐으면
                        if (status === kakao.maps.services.Status.OK) {
                            gridItem.cellValue(row, "MAP_X", _fnToZero(result[0].y));
                            gridItem.cellValue(row, "MAP_Y", _fnToZero(result[0].x));
                            //var MAP_Y = _fnToZero(result[0].x);
                        }
                    });
                }
            }
            
        }
    });

    //#endregion




});