var objJsonData = new Object();
var objJsonArray = new Array();
$(function () {
    DevExpress.ui.dxDateBox.defaultOptions({
        options: {
            showClearButton: false,
            type: "date",
            displayFormat: "yyyy-MM-dd"
        }
    });


    var btnWrite = $("#btnWrite").dxButton({
        text: "글쓰기",
        onClick: function () {
            window.location = "/AdminNotice/Write";
        }
    }).dxButton('instance');


    var STRT_YMD = $("#STRT_YMD").dxDateBox({
        width: 200,
        value: new Date(Date.parse(new Date()) - 6 * 1000 * 60 * 60 * 24 * 10),
    }).dxDateBox('instance');

    var END_YMD = $("#END_YMD").dxDateBox({
        width: 200,
        value: new Date(Date.parse(new Date()) + 6 * 1000 * 60 * 60 * 24),
    }).dxDateBox('instance');


    var S_TITLE = $("#S_TITLE").dxTextBox({
        value: "",
        width: 200
    }).dxTextBox('instance');


    var S_CONTENT = $("#S_CONTENT").dxTextBox({
        value: "",
        width: 200
    }).dxTextBox('instance');

    var btnSearch = $("#btnSearch").dxButton({
        text: "검색",
        onClick: function () {
            SearchData();
        }
    }).dxButton('instance');


    SearchData();

    var gridNotice = $("#gridNoticeList").dxDataGrid({
        showBorders: true,
        showRowLines: true,
        allowColumnResizing: true,
        loadPanel: {
            enabled: true,
        },
        columns: [
            {
                dataField: 'NOTICE_ID',
                visible : false,
            },
            {
                dataField: 'NUM',
                caption: "순번",
                alignment: "center",
                width: 60,
            },
            {
                dataField: 'TITLE',
                caption: '제목',
                cellTemplate: function (cellElement, cellInfo) {
                    $('<a/>').addClass('dx-link')
                        .text(cellInfo.value)
                        .on('dxclick', function () {
                            location.href = "/AdminNotice/Write?id=" + cellInfo.data.NOTICE_ID;
                        })
                        .appendTo(cellElement);
                }
            },
            {
                dataField: 'CNT',
                caption: '조회수',
                alignment: "center",
                width:100,

            },
            {
                dataField: 'USE_YN',
                caption: '사용여부',
                alignment: "center",
                width: 100,
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    if (s == "y") return "사용";
                    else return "미사용";
                }
            },
            {
                dataField: 'REGDT',
                caption: '등록일',
                alignment: "center",
                width: 150,

            },
          
        ],
        scrolling: {
            mode: 'virtual',
        },

    }).dxDataGrid('instance');

    function SearchData() {
        objJsonData.STRT_YMD = _fnToNull(STRT_YMD.option('text').replace(/-/gi, ""));
        objJsonData.END_YMD = _fnToNull(END_YMD.option('text').replace(/-/gi, ""));
        objJsonData.TITLE = _fnToNull(S_TITLE.option('text').replace(/-/gi, ""));
        objJsonData.CONTENT = _fnToNull(S_CONTENT.option('text').replace(/-/gi, ""));
        $.ajax({
            type: "POST",
            url: "/AdminNotice/fnGetNoticeList",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                //데이터바인딩
                var resultData = JSON.parse(result).Table1;
                console.log(resultData);
                //Data Binding
                gridNotice.beginUpdate();
                gridNotice.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridNotice.option('dataSource', resultData);
                gridNotice.endUpdate();

            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });
    }

});
