

var objJsonData = new Object();
var item_cd = "";
var item_mngtno = "";
var tab_nm = "CONF";
var path = "";
var SearchObj = new Object();

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



    var TAG = $("#TAG").dxTextBox({
        value: "",
        width: 200
    }).dxTextBox('instance');

    var btnSearch = $("#btnSearch").dxButton({
        text: "검색",
        onClick: function () {
            SearchData();
        }
    }).dxButton('instance');


    //#endregion 

    SearchData();

    //#region  ※※메인 그리드※※
    var gridReview = $("#gridReview").dxDataGrid({
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
        editing: {
            mode: 'batch',
            allowAdding: false,
            allowUpdating: true,
            allowDeleting: true,
            texts: {
                deleteRow: "삭제"
            }
        },
        toolbar: {
            items: [
                {
                    name: 'saveButton',
                    showText: 'always',
                    options: {
                        text: '수정',
                        onClick(e) {
                            fnUpdateRvList();
                        }
                    }
                },
            ]
        },
        scrolling: {
            mode: 'virtual',
        },
        columns: [
            {
                dataField: 'INSFLAG',
                /*visible: false,*/
                allowEditing: false,
                visible:false
            },
            {
                dataField: 'EMAIL',
                /*visible: false,*/
                allowEditing: false,
            },
            {
                dataField: 'ITEM_NO',
                /*visible: false,*/
                allowEditing: false,
                visible: false
            },
            {
                dataField: 'MNGT_NO',
                caption: "관리번호",
                /*visible:false,*/
                allowEditing: false,
            },
            {
                dataField: 'BKG_NO',
                caption: "예약번호",
                /*visible:false,*/
                allowEditing: false,
            },
            {
                dataField: 'QUOT_NO',
                caption: "견적 번호",
                /*visible:false,*/
                allowEditing: false,
            },
            {
                dataField: 'ITEM_NM',
                caption: "상품명",
                /*visible:false,*/
                allowEditing: false,
            },
            {
                dataField: 'CUST_NAME',
                caption: "회원명",
                /*visible:false,*/
                allowEditing: false,
                alignment: "center",
                width: 120,
            },
            {
                dataField: 'CMT_SUBJECT',
                caption: "후기 제목",
                /*visible:false,*/
                allowEditing: false,
                width: 300,
            },
            {
                dataField: 'CMT_SCORE',
                caption: "리뷰점수",
                /*visible:false,*/
                allowEditing: false,
                alignment: "center",
                width: 80,
            },
            {
                dataField: 'CMT_CONTENTS',
                caption: "리뷰내용",
                visible:false,
                allowEditing: false,
                width: 80,
            },
            {
                dataField: 'INS_DT',
                caption: "작성일",
                /*visible:false,*/
                allowEditing: false,
                alignment: "center",
                customizeText: function (cellInfo) {
                    var date = _fnToNull(cellInfo.value);

                    date = date.substr(0,8);
                    return date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
                },
                width: 120,
            },
            {
                dataField: 'CMT_IMG1_PATH',
                caption: "이미지1",
                /*visible:false,*/
                allowEditing: false,
                visible: false,
                width: 80,
            },
            {
                dataField: 'CMT_IMG2_PATH',
                caption: "이미지2",
                /*visible:false,*/
                allowEditing: false,
                visible: false,
                width: 80,
            },
            {
                dataField: 'CMT_IMG3_PATH',
                caption: "이미지3",
                /*visible:false,*/
                allowEditing: false,
                visible: false,
                width: 80,
            },
            {
                dataField: 'CMT_IMG4_PATH',
                caption: "이미지4",
                /*visible:false,*/
                allowEditing: false,
                visible: false,
                width: 80,
            },
            {
                dataField: 'FULL_PATH',
                caption: "경로",
                /*visible:false,*/
                allowEditing: false,
                visible: false,
                width: 80,
            },
        ],
        onSelectionChanged(selectedItems) {
            const data = selectedItems.selectedRowsData[0];
            console.log(data);
            if (_fnToNull(data) != "") {
                var DetailObj = new Object;
                DetailObj.CUST_NAME = data.CUST_NAME;
                DetailObj.SUBJECT = data.CMT_SUBJECT;
                DetailObj.CONTENT = data.CMT_CONTENTS;
                DetailObj.DATE = data.INS_DT.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5:$6');
                var ImgLIST = data.FULL_PATH.split("|");


                var arrImg = new Array();

                for (var i = 0; i < ImgLIST.length; i++) {
                    if (ImgLIST[i].trim() != "") {
                        var listObj = new Object();
                        listObj.SEQ = i + 1;
                        listObj.IMG_NM = ImgLIST[i];
                        arrImg.push(listObj);
                    }
                }

                

                DetailObj.IMG_LIST = arrImg;
                /*SearchDetail(data.ITEM_CD);*/
                fnBindDetail(DetailObj);
            }
            else {
                initDetail();
            }
        },
        onRowRemoving: function (e) {
            e.cancel = true;
            e.data.INSFLAG = 'D';
        },
    }).dxDataGrid('instance');
    //#endregion

    //#region ※※DTL※※
    var DTL_TITLE = $("#DetailTitle").dxAutocomplete({
        disabled : true,
    }).dxAutocomplete('instance');
    var DTL_CONTENT = $("#DetailContents").dxTextArea({
        disabled: true,
    }).dxTextArea('instance');
    var DTL_WRITER = $("#DetailWriter").dxAutocomplete({
        disabled: true,
    }).dxAutocomplete('instance');

    var DTL_DATE = $("#DetailDate").dxAutocomplete({
        disabled: true,
    }).dxAutocomplete('instance');
    var DTL_IMG = $("#RvImgList").dxDataGrid({
        hoverStateEnabled: true,
        showBorders: true,
        width: 430,
        selection: {
            mode: 'single',
        },
        paging: {
            enabled: false,

        },
        editing: {
            mode: 'batch',
            allowAdding: false,
            allowUpdating: false,
            allowDeleting: false,
        },
        columns: [
            {
                dataField: 'SEQ',
                caption: "순번",
                /*visible:false,*/
                allowEditing: false,
                width: 80,
            },
            {
                dataField: 'IMG_NM',
                caption: "파일명",
                /*visible:false,*/
                allowEditing: false,
                //width: 150,
                cellTemplate: function (cellElement, cellInfo) {
                    $('<a/>').addClass('dx-link')
                        .text(cellInfo.value)
                        .on('dxclick', function () {    //dxdblclick
                            window.open(cellInfo.data.IMG_NM);
                        })
                        .appendTo(cellElement);
                }
            },
        ],
    }).dxDataGrid('instance');
    //#endregion
    

    //#endregion


    //#region ※※함수 영역※※
    //전체 조회 함수
    function SearchData() {
        _mSearchObj = new Object();
        _mSearchObj.START_YMD = _fnToNull(STRT_YMD.option('text').replace(/-/gi, ""));
        _mSearchObj.END_YMD = _fnToNull(END_YMD.option('text').replace(/-/gi, ""));


        $.ajax({
            type: "POST",
            url: "/AdReviewMgt/fnGetRvList",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(_mSearchObj) },
            success: function (result) {
                var resultData = JSON.parse(result).MAINLIST;
                gridReview.beginUpdate();
                gridReview.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridReview.option('dataSource', resultData);
                gridReview.endUpdate();

            },
            error: function (xhr,status,error) {
                console.log("메인 조회 에러,,.");
                console.log(error);
            }
        });

    }

    //리스트 업데이트
    function fnUpdateRvList() {
        paramObj = new Object();
        sch = new Object();

        sch.START_YMD = _fnToNull(STRT_YMD.option('text').replace(/-/gi, ""));
        sch.END_YMD = _fnToNull(END_YMD.option('text').replace(/-/gi, ""));

        // 재조회용 파라미터
        var scharr = new Array();

        scharr[0] = sch;

        paramObj.SearchParam = scharr;


        gridReview.saveEditData();
        var arrMst = new Array();
        var ReviewMngt = "";

        arrMst = gridReview.option('dataSource');

        for (var i = -1; ++i < arrMst.length;) {
            var itemDr = arrMst[i];
            if (!itemDr.hasOwnProperty("INSFLAG") || itemDr.INSFLAG == "Q") {
                arrMst.splice(i, 1);
                i--;
            }
            if (itemDr.INSFLAG == "I") { //신규일 경우 관리번호 채번
                var time = new Date().getTime();
                ItemMNGT = "Rvw";
                ItemMNGT += time;
                itemDr.MNGT_NO = ItemMNGT;
                itemDr.ITEM_CD = ItemMNGT;
            }
        }

        paramObj.LIST = arrMst;


        $.ajax({
            type: "POST",
            url: "/AdReviewMgt/fnUpdateRvList",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(paramObj) },
            success: function (result) {
                var rtData = JSON.parse(result).Table1;
                gridReview.beginUpdate();
                gridReview.saveEditData();
                gridReview.option('dataSource', rtData);
                gridReview.endUpdate();
                
            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }

        });

    }


    // 클릭시 세부데이터 바인딩
    function fnBindDetail(content) {
        console.log(content.SUBJECT);
        DTL_TITLE.option('value', content.SUBJECT);
        DTL_CONTENT.option('value', content.CONTENT);
        DTL_WRITER.option('value', content.CUST_NAME);
        DTL_DATE.option('value', content.DATE);
        DTL_IMG.option('dataSource', content.IMG_LIST);

    }

    function initDetail() {
        DTL_TITLE.option('value', "");
        DTL_CONTENT.option('value', "");
        DTL_WRITER.option('value', "");
        DTL_DATE.option('value', "");
        DTL_IMG.option('dataSource', "");
    }


    //#endregion

});