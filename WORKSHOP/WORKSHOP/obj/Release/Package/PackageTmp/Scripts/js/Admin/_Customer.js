var objJsonData = new Object();
$(function () {



    var GRP_CD = $("#GRP_CD").dxSelectBox({ // 지역
        width: 150,
        displayExpr: "COMM_NM",
        valueExpr: "COMM_NM",
        acceptCustomValue: true,
        dataSource: layoutSearchGRP_KIND.option('dataSource'),
        value: "전체"
    }).dxSelectBox('instance');


    var CUST_NAME = $("#CUST_NAME").dxTextBox({ // 상품명
        value: "",
        width: 150,
    }).dxTextBox('instance');


    var COMPANY = $("#COMPANY").dxTextBox({ // 상품명
        value: "",
        width: 150,
    }).dxTextBox('instance');


    var DEPARTURE = $("#DEPARTURE").dxTextBox({ // 상품명
        value: "",
        width: 150,
    }).dxTextBox('instance');


    var USE_YN = $("#USE_YN").dxSelectBox({ // 사용여부
        width: 150,
        displayExpr: "NAME",
        valueExpr: "CODE",
        acceptCustomValue: true,
        value: "A",
        dataSource: [{ CODE: "A", NAME: "전체" }, { CODE: "Y", NAME: "승인" }, { CODE: "N", NAME: "미승인" }],
    }).dxSelectBox('instance');


    var ADMIN_YN = $("#ADMIN_YN").dxSelectBox({ // 사용여부
        width: 150,
        displayExpr: "NAME",
        valueExpr: "CODE",
        value: "A",
        acceptCustomValue: true,
        dataSource: [{ CODE: "A", NAME: "전체" }, { CODE: "N", NAME: "회원" }, { CODE: "Y", NAME: "관리자" }],
    }).dxSelectBox('instance');


    var btnSearch = $("#btnSearch").dxButton({
        text: "검색",
        onClick: function () {
            SearchData();
        }
    }).dxButton('instance');


    SearchData();

    var gridCustomer = $("#customer_info").dxDataGrid({
        showBorders: true,
        showRowLines: true,
        allowColumnResizing: true,
        keyboardNavigation: {
            enterKeyAction: 'moveFocus',
            enterKeyDirection: 'row',
            editOnKeyPress: true,
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
                dataField: 'EMAIL',
                caption: '*이메일',
                //validationRules: [{
                //    type: 'required',
                //}, {
                //        type: 'email',
                //    }, {
                //        type: 'async',
                //        message: 'Email address is not unique',
                //    validationCallback(params) {
                //        const d = $.Deferred();
                //            if (params.data.INSFLAG == "I") {
                //                var objCHECK_INFO = new Object();
                //                objCHECK_INFO.EMAIL = params.data.EMAIL;
                //                $.ajax({
                //                    url: '/Admin/isCheckID', // 이메일 중복체크 넣기
                //                    type: 'POST',
                //                    dataType: "json",
                //                    data: { "vJsonData": _fnMakeJson(objCHECK_INFO) },
                //                    success: function (result) {
                //                        if (result.rec_cd != "Y") {
                //                            d.reject("중복된 이메일입니다.");
                                 
                //                        } else {
                //                            d.resolve();
                //                        }
                //                    },
                //                    error: function (error) {
                //                        _fnLayerAlertMsg("담당자 문의 하십시오.");
                //                    }
                //                });

                //            } else {
                //                d.resolve();
                //            }
                //            return d.promise();

                //    }
                //}],

            },
            {
                dataField: 'GRP_CD',
                caption: '그룹코드',
                readOnly : true,
                lookup: {
                    dataSource: layoutGRP_KIND.option('dataSource'),
                    displayExpr: "COMM_NM",
                    valueExpr: "COMM_NM",
                }
            },
            {
                dataField: 'PSWD',
                caption: '*비밀번호',
                editorOptions: {
                    mode: "password"
                },
                customizeText: function (e) {
                    return '******';
                }
                
                        //                         gridCustomer.cellValue(0, "INSFLAG", "I");
            },
            {
                dataField: 'CUST_NAME',
                caption: '*담당자명'
            },
            {
                caption: '*연락처',
                dataField: 'TELNO',
            },
            {
                dataField: 'COMPANY',
                caption: '회사명'
            },
            {
                dataField: 'DEPARTURE',
                caption: '소속부서'
            },
            {
                dataField: 'APV_YN',
                caption: '승인여부',
                lookup: { dataSource: [{ CODE: "N", NAME: "미승인" }, { CODE: "Y", NAME: "승인" }], valueExpr: "CODE", displayExpr: "NAME" }
            },
            {
                dataField: 'ADMIN_YN',
                caption: '관리자여부',
                lookup: { dataSource: [{ CODE: "N", NAME: "회원" }, { CODE: "Y", NAME: "관리자" }], valueExpr: "CODE", displayExpr: "NAME" }
            },
            {
                dataField: 'INSFLAG',
                visible: false
            },
            {
                dataField: 'EMAIL_YN',
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
                        saveData();
                    }
                },
               
            },
                {
                widget: 'dxButton',
                showText: 'always',
                options: {
                    icon: 'export',
                    text: '엑셀 내보내기',
                    onClick(e) {
                        //pdf
                        //const doc = new jsPDF();
                        //DevExpress.pdfExporter.exportDataGrid({
                        //    jsPDFDocument: doc,
                        //    component: gridCustomer
                        //}).then(function () {
                        //    doc.save('Customers.pdf');
                        //});
                        var workbook = new ExcelJS.Workbook();
                        var worksheet = workbook.addWorksheet('Main sheet');
                        DevExpress.excelExporter.exportDataGrid({
                            worksheet: worksheet,
                            component: gridCustomer,
                            customizeCell: function (options) {
                                options.excelCell.font = { name: 'Arial', size: 12 };
                                options.excelCell.alignment = { horizontal: 'left' };
                            }
                        }).then(function () {
                            workbook.xlsx.writeBuffer().then(function (buffer) {
                                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Customer List.xlsx');
                            });
                        });
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
                        window.location = "/Files/CustomerList.xlsx";

                    }
                },
            },
            ],
        },
        onInitNewRow: function (e) {
            e.data.INSFLAG = 'I';
            e.data.APV_YN = "N";
            e.data.ADMIN_YN = "N";
            e.data.GRP_CD = '';
            e.data.EMAIL = '';
            e.data.USER_TYPE = '';
            e.data.PSWD = '';
            e.data.CUST_NAME = '';
            e.data.TELNO = '';
            e.data.COMPANY = '';
            e.data.DEPARTURE = '';
            e.data.EMAIL_YN = 'N';
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
                e.cellElement.css("text-align", "center");
        },
        onEditorPreparing: function (e) {
            if (e.dataField == "EMAIL" && e.parentType == "dataRow") {
                if (e.row.isNewRow) {
                    e.editorOptions.disabled = false; //enabled only when new record

                }
                else {
                    e.editorOptions.disabled = true; //disabled when existing
                }

            }
            if (e.parentType == "dataRow" && (e.editorName == "dxSelectBox")) {

                e.editorOptions.searchEnabled = false; //셀렉트 박스 입력 막기

            }
            if (e.dataField == "PSWD" && e.parentType == "dataRow") {
                if (e.row.isNewRow) {
                    e.editorOptions.disabled = false; //enabled only when new record

                }
                else {
                    e.editorOptions.disabled = true; //disabled when existing
                }

            }

        },
    }).dxDataGrid('instance');



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
            data: { "vJsonData": xl2Json},
            success: function (result) {
                if (JSON.parse(result).Result[0].trxCode == "Y") {
                    SearchData();
                    if (JSON.parse(result).Result[0].trxMsg != "") {
                        DevExpress.ui.dialog.alert("<i>" + JSON.parse(result).Result[0].trxMsg + " 번째 행은 저장되지 않았습니다.</i>");
                    }
                } else {

                }
            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });
    }

    function SearchData() {
        var SearchObj = new Object();
        SearchObj.S_GRP_CD = _fnToNull(GRP_CD.option("value"));
        SearchObj.S_CUST_NAME = _fnToNull(CUST_NAME.option('value'));
        SearchObj.S_COMPANY = _fnToNull(COMPANY.option('value'));
        SearchObj.S_DEPARTURE = _fnToNull(DEPARTURE.option('value'));
        SearchObj.S_USE_YN = _fnToNull(USE_YN.option('value'));
        SearchObj.S_ADMIN_YN = _fnToNull(ADMIN_YN.option('value'));

        $.ajax({
            type: "POST",
            url: "/Admin/fnGetCustInfo",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(SearchObj) },
            success: function (result) {
                console.log("성공");
                console.log(result);
                //데이터바인딩
                var resultData = JSON.parse(result).CUST_INFO;
                console.log(resultData);
                //Data Binding
                gridCustomer.beginUpdate();
                gridCustomer.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridCustomer.option('dataSource', resultData);
                gridCustomer.endUpdate();
            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });
    }

    function saveData() {
        //gridCustomer.saveEditData();
        //gridCustomer.editCell(0, 0);
        //gridCustomer.closeEditCell();  // 이 두줄은 에디트값이 바로 반영되지 않는 오류 방지용

        var isValid = false;
        //var rowCount = $("#customer_info .dx-data-row").length;
        var rowCount = $("#customer_info").dxDataGrid('instance').getVisibleRows().length;
        for (i = 0; i < rowCount; i++) {
            if (_fnToNull(gridCustomer.cellValue(i, gridCustomer.columnOption("EMAIL", "visibleIndex"))) == "") {
                DevExpress.ui.dialog.alert("이메일이 입력되지 않았습니다.", "Message");
                return false;
            } else {
                var email = _fnToNull(gridCustomer.cellValue(i, gridCustomer.columnOption("EMAIL", "visibleIndex")));
                var regExp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                if (regExp.test(email) == false) {
                    DevExpress.ui.dialog.alert("이메일 형식에 맞지 않습니다.", "Message");
                    return false;
                } 
            }

            if (_fnToNull(gridCustomer.cellValue(i, gridCustomer.columnOption("PSWD", "visibleIndex"))) == "") {
                DevExpress.ui.dialog.alert("비밀번호가 입력되지 않았습니다.", "Message");
                return false;
            }
            if (_fnToNull(gridCustomer.cellValue(i, gridCustomer.columnOption("CUST_NAME", "visibleIndex"))) == "") {
                DevExpress.ui.dialog.alert("담당자명이 입력되지 않았습니다.", "Message");
                return false;
            }
            if (_fnToNull(gridCustomer.cellValue(i, gridCustomer.columnOption("TELNO", "visibleIndex"))) == "") {
                DevExpress.ui.dialog.alert("연락처가 입력되지 않았습니다.", "Message");
                return false;
            }
            gridCustomer.refresh();
        }


        gridCustomer.saveEditData();

        var arrCntr = new Array();
        arrCntr = gridCustomer.option('dataSource')
        for (var i = -1; ++i < arrCntr.length;) {
            console.log(arrCntr);
            var curRow = arrCntr[i]
            if (!curRow.hasOwnProperty("INSFLAG") || curRow.INSFLAG == "Q") {    // INSFLAG가 생성된 것만 처리
                arrCntr.splice(i, 1);
                i--;    //배열의 전체 길이가 줄어들기때문에 i값도 변경한다.
            }
        }
        $.ajax({
            type: "POST",
            url: "/Admin/fnSaveCustomer",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(arrCntr) },
            success: function (result) {
                //데이터바인딩
                var resultData = JSON.parse(result).CUST_INFO;
                if (JSON.parse(result).Result[0].trxCode == "Y") {
                    //Data Binding
                    gridCustomer.beginUpdate();
                    gridCustomer.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridCustomer.option('dataSource', resultData);
                    gridCustomer.endUpdate();

                    DevExpress.ui.dialog.alert("<i>저장되었습니다.</i>", "");
                } else if (JSON.parse(result).Result[0].trxCode == "E") {
                    gridCustomer.beginUpdate();
                    gridCustomer.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                    gridCustomer.option('dataSource', resultData);
                    gridCustomer.endUpdate();
                    DevExpress.ui.dialog.alert("<i>중복된 이메일입니다 다시 입력해주세요.</i>", "");
                }
            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });
    };


//======


});

