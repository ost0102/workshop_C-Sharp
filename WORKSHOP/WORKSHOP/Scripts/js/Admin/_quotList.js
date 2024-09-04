var objJsonData = new Object();

$(function () {
    SearchData();

    DevExpress.ui.dxDateBox.defaultOptions({
        options: {
            showClearButton: false,
            type: "date",
            displayFormat: "yyyy-MM-dd"
        }
    });

    var STRT_YMD = $("#STRT_YMD").dxDateBox({
        value: "",
        width: 200,
        value: new Date()
    }).dxDateBox('instance');

    var END_YMD = $("#END_YMD").dxDateBox({
        value: "",
        width: 200,
        value: new Date()
    }).dxDateBox('instance');


    var ITEM_NM = $("#ITEM_NM").dxTextBox({
        value: "",
        width: 200
    }).dxTextBox('instance');

    var STATUS = $("#STATUS").dxSelectBox({
        dataSource: [{ CODE: "N", NAME: "견적요청" }, { CODE: "Y", NAME: "견적완료" }],
        width: 200,
        displayExpr: "NAME",
        valueExpr: "CODE",
    }).dxSelectBox('instance');

    var btnSearch = $("#btnSearch").dxButton({
        text: "검색",
        onClick: function () {
            SearchData();
        }
    }).dxButton('instance');


    var GRP_CD = $("#GRP_CD").dxSelectBox({
        width: 150,
        displayExpr: "COMM_NM",
        valueExpr: "COMM_CD",
        acceptCustomValue: true,
        dataSource: layoutGRP_CD.option('dataSource')
    }).dxSelectBox('instance');

    var  pop = $("#popup").dxPopup({
        showTitle: true,
        title: '견적정보',
        contentTemplate: function () {
            return $("<div>").dxDataGrid({
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
        showBorders: true,
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
        columns: [
            {
                dataField: 'INSFLAG',
            },
            {
                dataField: 'TEST',
                caption: '견적구분',
                cellTemplate: function (cellElement, cellInfo) {
                    $('<a/>').addClass('dx-link')
                        .text(cellInfo.value)
                        .on('dxclick', function () {
                            if (parseInt(cellInfo.value) > 1) {
                                $("#popup").dxPopup("instance").show();
                            } else {
                                alert("haha");
                            }
                        })
                        .appendTo(cellElement);
                }

            },
            {
                dataField: '',
                caption: '견적상태',
            },
            {
                dataField: '',
                caption: '지역',
            },
            {
                dataField: '',
                caption: '상품명',
            },
            {
                dataField: '',
                caption: '시작날짜'
            },
            {
                caption: '종료날짜',
                dataField: '',
            },
            {
                dataField: '',
                caption: '예산최소금액'
            },
            {
                dataField: '',
                caption: '예산최대금액'
            },
            {
                dataField: '',
                caption: '비고',
            },
            {
                dataField: '',
                caption: '요청자명',
            },
            {
                dataField: '',
                caption: '요청자 이메일',
            },
            {
                dataField: '',
                caption: '요청자 연락처',
            },

        ],
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
    }).dxDataGrid('instance');

    function SearchData() {

        $.ajax({
            type: "POST",
            url: "/Admin/fnGetQuotList",
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
            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });
    }


});
