var objJsonData = new Object();

$(function () {
    SearchData();

    var gridCustomer = $("#customer_info").dxDataGrid({
        keyExpr: 'MNGT_NO',
        showBorders: true,
        paging: {
            enabled: false,
        },
        editing: {
            mode: 'batch',
            allowUpdating: true,
            allowAdding: true,
            allowDeleting: true,
            selectTextOnEditStart: true,
            startEditAction: 'click',
        },
        columns: [

            {
                dataField: 'EMAIL',
                caption: '이메일',
                validationRules: [{
                    type: 'required',
                }, {
                    type: 'email',
                }, {
                    type: 'async',
                    message: 'Email address is not unique',
                    validationCallback(params) {
                        return $.ajax({
                            url: 'https://js.devexpress.com/Demos/Mvc/RemoteValidation/CheckUniqueEmailAddress', // 이메일 중복체크 넣기
                            type: 'POST',
                            dataType: 'json',
                            contentType: 'application/json',
                            data: JSON.stringify({
                                id: params.data.ID,
                                email: params.value,
                            }),
                        });
                    },
                }],
            },
            {
                dataField: 'PSWD',
                caption: '비밀번호',
                customizeText: function (e) {
                    return '******';
                }
            },
            {
                dataField: 'CUST_NAME',
                caption: '담당자명'
            },
            {
                dataField: 'TELNO',
                caption: '연락처'
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
        ],
        onInitNewRow: function (e) {
            e.data.APV_YN = "N";
        }
    }).dxDataGrid('instance');
            //#endregion


    function SearchData() {

        $.ajax({
            type: "POST",
            url: "/Admin/fnGetCustInfo",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                console.log("성공");
                console.log(result);
                //데이터바인딩
                var resultData = JSON.parse(result).CUST_INFO;
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
});