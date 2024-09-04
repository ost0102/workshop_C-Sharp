
var grp_cd = '';
$(function () {



    var GRP_NM = $("#GRP_NM").dxTextBox({ // 상품명
        value: "",
        width: 200,
    }).dxTextBox('instance');


    var btnSearch = $("#btnSearch").dxButton({
        text: "검색",
        onClick: function () {
            SearchData();
        }
    }).dxButton('instance');


    SearchData();

    var gridGroup = $("#GroupList").dxDataGrid({
        hoverStateEnabled: true, 
        showBorders: true,
        showRowLines: true,
        selection: {
            mode: 'single',
        },
        keyExpr: 'GRP_CD',
        paging: {
            enabled: false,
        },
        editing: {
            mode: 'batch',
            allowAdding: true,
            allowUpdating: false,
            allowDeleting: true,
            texts: {
                deleteRow: "삭제",
                undeleteRow: "삭제취소"
            }
        },
        columns: [

            {
                dataField: 'GRP_CD',
                caption: '그룹코드',
                maxLength: 5,
                visible : false,

            },
            {
                dataField: 'GRP_NM',
                caption: '그룹명',
                maxLength : 20
            },
            {
                dataField: 'INSFLAG',
                visible: false
            },
            {
                dataField: 'INS_USR',
                visible: false
            },
        ],
        toolbar: {
            items: [{
                name: 'addRowButton',
                showText: 'always',
                options: {
                    text: '추가',
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

        },
        onSelectionChanged(selectedItems) {
            const data = selectedItems.selectedRowsData[0];
            if (_fnToNull(data) != "") {
                if (data.GRP_CD != "") {
                    grp_cd = data.GRP_CD;
                    fnSearchCommDetail(data.GRP_CD);
                }
            }
            
        },
        onInitNewRow: function (e) {
            e.data.INSFLAG = 'I';
            e.data.GRP_CD = '';
            e.data.GRP_NM = '';
            e.data.INS_USR = _fnToNull($("#Session_CUST_NAME").val());
        },
        onRowUpdating: function (e) {
            if (e.data.INSFLAG == "Q") {
                e.data.INSFLAG = "U";
                e.data.INS_USR = _fnToNull($("#Session_CUST_NAME").val());
            }
        },
        onRowRemoving: function (e) {
            e.cancel = true;
            e.data.INSFLAG = 'D'; 
        },
    }).dxDataGrid('instance');


    var gridCommon = $("#CommonList").dxDataGrid({
        keyboardNavigation: { //넥스트 포커스
            enterKeyAction: 'moveFocus',
            enterKeyDirection: 'row',
            editOnKeyPress: true,

        },
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
                deleteRow: "삭제",
                undeleteRow: "삭제취소"
            }
        },
        columns: [

            {
                dataField: 'GRP_CD',
                caption: '그룹코드',
                allowEditing : false
            },
            {
                dataField: 'COMM_CD',
                caption: '공통코드'
            },
            {
                dataField: 'COMM_NM',
                caption: '공통코드 명'
            },
            {
                dataField: 'SEQ',
                caption: 'SEQ',
                dataType: "number",
            },
            {
                dataField: 'OPTION1',
                caption: 'Data1'
            },
            {
                dataField: 'OPTION2',
                caption: 'Data2'
            },
            {
                dataField: 'IMG_PATH',
                caption: '파일 등록',
                allowEditing: false,
                visible : false,
                cellTemplate: function (container, options) {
                    $("<div/>")
                        .dxFileUploader({
                        selectButtonText: '파일찾기',
                        labelText: '',
                        multiple: false,
                        allowedFileExtensions: ['.jpg', '.jpeg', '.gif', '.png'],
                        value: [],
                        uploadMode: "instantly",
                        uploadFailedMessage: "파일 업로드를 처리 하지 못했습니다.",
                        uploadUrl: "/Admin/UploadHandler",
                        onValueChanged: function (e) {
                        },
                        onUploaded: function (e) {
                            if (JSON.parse(e.request.responseText).rec_cd == "Y") {
                              //  $(".dx-fileuploader-files-container").hide();
                                gridCommon.cellValue(options.rowIndex, "FILE_NM", e.file.name);
                                if (gridCommon.cellValue(options.rowIndex, "INSFLAG") == "Q") {
                                    gridCommon.cellValue(options.rowIndex, "INSFLAG", "U");
                                }
                                gridCommon.cellValue(options.rowIndex, "FILE_PATH", JSON.parse(e.request.responseText).res_msg);
                            } else {

                            }
                        },
                    }).appendTo(container);
                }
            },
            {
                dataField: 'FILE_NM',
                caption: '파일 명',
                visible: false,
            },
            {
                dataField: 'FILE_PATH',
                caption: '파일 경로',
                visible: false,
            },
            {
                dataField: 'INSFLAG',
                visible : false,
            },
            {
                dataField: 'USE_YN',
                caption: '사용여부',
                lookup: { dataSource: [{ CODE: "Y", NAME: "사용" }, { CODE: "N", NAME: "미사용" }], valueExpr: "CODE", displayExpr: "NAME" }
            },
            {
                dataField: 'INS_USR',
                visible : false
            },
            //{
            //    dataField: 'OPTION3',
            //    caption: 'Data3'
            //},
            //{
            //    dataField: 'OPTION4',
            //    caption: 'Data4'
            //},
            //{
            //    dataField: 'OPTION5',
            //    caption: 'Data5'
            //}
        ],
        toolbar: {
            items: [{
                name: 'addRowButton',
                showText: 'always',
                options: {
                    text: '추가',
                    disabled : true,
                },
                onClick(e) {
                    //gridCommon.cellValue(e.rowIndex, "FILE_NM", e.file.name);
                    if (grp_cd == "") {
                        alert("그룹을 선택하세요");
                    }
                    $(".test").click();
                },

            },
            {
                name: 'saveButton',
                showText: 'always',
                options: {
                    text: '저장',
                    onClick(e) {
                        saveCommonDetail();
                    }
                },

            }],
        },
        scrolling: {
            mode: 'virtual',
        },
        onInitNewRow: function (e) {
            //e.component.focus(e.component.getCellElement(1, "GRP_CD"))
            if (grp_cd == "") {
                gridCommon.deleteRow();
            } else {
                e.data.INSFLAG = "I";
                e.data.SEQ = 0;
                e.data.GRP_CD = grp_cd;
                e.data.USE_YN = 'Y';
                e.data.COMM_CD = '';
                e.data.COMM_NM = '';
                e.data.OPTION1 = '';
                e.data.OPTION2 = '';
                e.data.FILE_NM = '';
                e.data.FILE_PATH = '';
                e.data.IMG_PATH = '';
                e.data.INS_USR = _fnToNull($("#Session_CUST_NAME").val());
            }
        },
        onRowUpdating: function (e) {
            if (e.key.INSFLAG == "Q") {
                e.key.INSFLAG = "U";
                e.key.INS_USR = _fnToNull($("#Session_CUST_NAME").val());
            }
        },
        onRowRemoving: function (e) {
            e.cancel = true;
            e.data.INSFLAG = 'D';
        },
        onEditorPrepared: function (e) {
            if (e.dataField == "OPTION1") {
                setTimeout(function () {
                    e.component.focus();
                }, 100);
            }
        },
        //onEditorPreparing: function (e) {
        //    alert("here");
        //    //if (e.dataField === "IMG_PATH" && e.parentType === "dataRow") {
        //    //    $("td").removeClass("dx-cell-modified");
        //    //    e.editorOptions.disabled = e.row.data;
        //    //}
        //}
        //onEditorPreparing: function (e) {   // 대문자입력    
        //    var grid = e.component;

        //    var oldOnValueChanged = e.editorOptions.onValueChanged;
        //    e.editorOptions.onValueChanged = function (args) {
        //        oldOnValueChanged.apply(this, arguments);
        //        grid.cellValue(e.row.rowIndex, "INSFLAG", "U");
        //    }
            
        //}
        //onEditorPreparing: function (e) {
        //    var grid = e.component;
        //    if (e.parentType == 'dataRow') {
        //        if (e.dataField == 'GRP_CD') {
        //            e.editorOptions.readOnly = true;
        //        }
        //    }

        //},
    }).dxDataGrid('instance');
    //function onClick(e) {  
    //        var dxFormData = $("#docUploadForm").dxForm("instance").option("formData");  
    //        var formData = new FormData();  
    //        for (var i = 0; i < dxFormData.files.length; i++) {  
    //            var file = dxFormData.files[i];  
    //            formData.append('files[]', file, file.name);  
    //        }  
    //        formData.append('id', dxFormData.id);  
    //        $.ajax({  
    //            type: "POST",  
    //            url: "/Home/AsyncUpload",  
    //            data: formData,  
    //            contentType: false,  
    //            processData: false  
    //        });  
    //}  

    function fnSearchCommDetail(grp_cd) {
        var objJsonData = new Object();
        objJsonData.GRP_CD = grp_cd;

        $.ajax({
            type: "POST",
            url: "/Admin/fnGetGrpCommDetail",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                //데이터바인딩
                var resultData = JSON.parse(result).Table1;
                console.log(resultData);
                //Data Binding
                gridCommon.beginUpdate();
                gridCommon.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridCommon.option('dataSource', resultData);
                gridCommon.endUpdate();
                gridCommon.option("toolbar.items[0].options.disabled", false)
            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });
    }


    function SearchData() {

        var objJsonData = new Object();
        objJsonData.GRP_CD = _fnToNull(GRP_NM.option("value"));
        $.ajax({
            type: "POST",
            url: "/Admin/fnGetGrpComm",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                //데이터바인딩
                var resultData = JSON.parse(result).Table1;
                //Data Binding
                gridGroup.beginUpdate();
                gridGroup.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridGroup.option('dataSource', resultData);
                gridGroup.endUpdate();
            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });
    }




    function saveCommGrp() {
        gridGroup.saveEditData();
        var arrCntr = new Array();
        arrCntr = gridGroup.option('dataSource');

        for (var i = -1; ++i < arrCntr.length;) {
            var curRow = arrCntr[i]
            if (!curRow.hasOwnProperty("INSFLAG") || curRow.INSFLAG == "Q") {    // INSFLAG가 생성된 것만 처리
                arrCntr.splice(i, 1);
                i--;    //배열의 전체 길이가 줄어들기때문에 i값도 변경한다.
            }
        }
        $.ajax({
            type: "POST",
            url: "/Admin/fnSaveCommGrp",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(arrCntr) },
            success: function (result) {
                if (JSON.parse(result).Result[0].trxCode == "Y") {
                    //데이터바인딩
                    var resultData = JSON.parse(result).Table1;
                    //Data Binding
                    gridGroup.beginUpdate();
                    gridGroup.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridGroup.option('dataSource', resultData);
                    gridGroup.endUpdate();

                    gridCommon.option('dataSource', []);
                    DevExpress.ui.dialog.alert("<i>저장되었습니다.</i>", "");
                } else {
                    DevExpress.ui.dialog.alert("<i>중복된 그룹명은 사용하실수 없습니다.</i>", "");
                    return false;
                }
            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });

    }


    function saveCommonDetail() {

        gridCommon.saveEditData();
        var arrCntr = new Array();
        arrCntr = gridCommon.option('dataSource');

        for (var i = -1; ++i < arrCntr.length;) {
            var curRow = arrCntr[i]
            if (!curRow.hasOwnProperty("INSFLAG") || curRow.INSFLAG == "Q") {    // INSFLAG가 생성된 것만 처리
                arrCntr.splice(i, 1);
                i--;    //배열의 전체 길이가 줄어들기때문에 i값도 변경한다.
            }
        }
        $.ajax({
            type: "POST",
            url: "/Admin/fnSaveCommonDetail",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(arrCntr) },
            success: function (result) {
                //데이터바인딩
                var resultData = JSON.parse(result).Table1;
                //Data Binding
                gridCommon.beginUpdate();
                gridCommon.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridCommon.option('dataSource', resultData);
                gridCommon.endUpdate();
                DevExpress.ui.dialog.alert("<i>저장되었습니다.</i>", "");
            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });

    }


});