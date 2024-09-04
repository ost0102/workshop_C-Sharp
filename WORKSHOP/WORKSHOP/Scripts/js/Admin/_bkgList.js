
var objJsonData = new Object();
var now = new Date();
var bkgUpdateObj = new Object();
var list_bkg_no = "";
var view_type = "LIST";
var detailbkg_no = "";
var dtl_prc = 0;
var detail_cnt;





$(function () {
  
    var bkgYMD = now.getFullYear() + _fnPad(now.getMonth() + 1, 2);

    

    var data = new Array();


    // 달력 항목별 색상 설정
    const priorityData = [{
        text: 'Y',//예약
        id: 1,
        color: '#5accc8',
    }, {//요청
        text: 'N',
        id: 2,
        color: '#949fa7',
        }, {//취소
        text: 'C',
        id: 3,
        color: '#f6bc5a',
        }, {//완료
        text: 'F',
        id: 4,
        color: '#006e6a',
        }, {//수정
            text: 'M',
            id: 5,
            color: '#ff860f',
        }


    ];


    var BkgData = {};


    //#region  조회 영역

    var BKG_STATUS = $("#BKG_STATUS").dxSelectBox({
        dataSource: [{ CODE: "ALL", NAME: "전체" }, { CODE: "N", NAME: "요청" }, { CODE: "Y", NAME: "예약" }, { CODE: "F", NAME: "확정" }, { CODE: "M", NAME: "수정" }, { CODE: "C", NAME: "취소" }],
        width: 200,
        value: "ALL",
        displayExpr: "NAME",
        valueExpr: "CODE",
    }).dxSelectBox('instance');



    var ITEM_NM = $("#ITEM_NM").dxTextBox({
        value: "",
        width: 200,

    }).dxTextBox('instance');


    var CUST_NM = $("#CUST_NM").dxTextBox({
        value: "",
        width: 200,
    }).dxTextBox('instance');

    var btnSearch = $("#btnSearch").dxButton({
        text: "검색",
        onClick: function () {
            SearchData();
        }
    }).dxButton('instance');

    //#endregion 






    //#region ※※팝업※※
    const popContentTemplate = function () {
        return  $("<div>").append($("<div class='dx-field-set'>"),
            $("    <div class='dx-field-label' style='width:25%;text-align:right;clear:both;'>예약번호: </div>"),
            $("    <div class='dx-field-value-static' style='width:75%;'>" + _fnToNull(BkgData.bkg_no)  + "</div> "),
            $("    <div class='dx-field-label' style='width:25%;text-align:right;clear:both;'>예약자명: </div>"),
            $("    <div class='dx-field-value-static' style='width:75%'>" + _fnToNull(BkgData.cust_nm) + "</div> "),
            $("    <div class='dx-field-label' style='width:25%;text-align:right;clear:both;'>예약자 연락처: </div>"),
            $("    <div class='dx-field-value-static' style='width:75%'>" + _fnToNull(BkgData.cust_tel) + "</div> "),
            $("    <div class='dx-field-label' style='width:25%;text-align:right;clear:both;'>예약자 이메일: </div>"),
            $("    <div class='dx-field-value-static' style='width:75%'>" + _fnToNull(BkgData.cust_email) + "</div> "),
            $("    <div class='dx-field-label' style='width:25%;text-align:right;clear:both;'>상품명: </div>"),
            $("    <div class='dx-field-value-static' style='width:75%'>" + _fnToNull(BkgData.item_nm)  + "</div> "),
            $("    <div class='dx-field-label' style='width:25%;text-align:right;clear:both;'>지역: </div>"),
            $("    <div class='dx-field-value-static' style='width:75%'>" + _fnToNull(BkgData.area) + "</div> "),
            $("    <div class='dx-field-label' style='width:25%;text-align:right;clear:both;'>예약일자: </div>"),
            $("    <div class='dx-field-value-static' style='width:75%'>" + _fnToNull(BkgData.dtlStDate) + " ~ " + _fnToNull(BkgData.dtlEdDate) + "</div> "),
            $("    <div class='dx-field-label' style='width:25%;text-align:right;clear:both;'>예약 금액: </div>"),
            $("    <div class='dx-field-value-static' style='width:75%'>" + _fnToZero(BkgData.tot_amt).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</div> "),
            $("    <div class='dx-field-label' style='width:25%;text-align:right;clear:both;'>비고: </div>"),
            $("    <div class='dx-field-value-static' style='width:75%'>" + _fnToNull(BkgData.rmk)  + "</div>"),
            $("</div>")
        );
    };
    var pop = $("#popup").dxPopup({
        showTitle: true,
        title: '예약정보',
        width: 600,
        height: 500,
        contentTemplate: popContentTemplate,
        toolbarItems: [{
            widget: 'dxButton',
            toolbar: 'bottom',
            options: {
                text: '상세보기',
                visible: true,
                onClick() {
                    location.href = "/Admin/bkgRegist?bkgNo=" + BkgData.bkg_no + "&&bkgType=MANAGE";
                },
            },
        },
        {
            widget: 'dxButton',
            toolbar: 'bottom',
            options: {
                visible: true,
                text: '예약',
                onClick() {
                    fnUpdateBkg("Y", view_type);
                    //DevExpress.ui.dialog.alert("<i>예약 확정되었습니다.</i>", "");
                },
            },
        },
        {
            widget: 'dxButton',
            toolbar: 'bottom',
            options: {
                visible: true,
                text: '취소',
                onClick() {
                    fnUpdateBkg("C",view_type);
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
                    pop.hide();
                },
            },
        }],
    }).dxPopup('instance');

    const confirmPopContent = function () {
        return $("<div>").append($("<div class='dx-field-set'>"),
            $("    <div class='dx-field-label' style='width:100%;text-align:center;clear:both;'>해당 예약을 어떻게 하실건가요?</div>"),
            $("    <div class='dx-field-value-static' style='display:none;'>" + _fnToNull(list_bkg_no) + "</div> "),
            $("</div>")
        );
    };
    var confirm_pop = $("#confirm_popup").dxPopup({
        showTitle: true,
        title: '예약관리',
        width: 600,
        height: 200,
        contentTemplate: confirmPopContent,
        toolbarItems: [{
            widget: 'dxButton',
            toolbar: 'bottom',
            options: {
                text: '상세보기',
                visible: true,
                onClick() {
                    location.href = "/Admin/bkgRegist?bkgNo=" + list_bkg_no + "&&bkgType=MANAGE";
                },
            },
        },
        {
            widget: 'dxButton',
            toolbar: 'bottom',
            options: {
                visible: true,
                text: '예약',
                onClick() {
                    fnUpdateBkg("Y", view_type);
                    //DevExpress.ui.dialog.alert("<i>예약 확정되었습니다.</i>", "");
                },
            },
        },
        {
            widget: 'dxButton',
            toolbar: 'bottom',
            options: {
                visible: true,
                text: '취소',
                onClick() {
                    fnUpdateBkg("C", view_type);
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

    var tabs = $("#gridTabs").dxTabs({
        dataSource: [{ id: 1, text: "리스트" } ,{ id: 0, text: "캘린더" }],
        selectedIndex: 0,
        onItemClick(e) {
            SearchData(bkgYMD);
            if (e.itemData.id == 0) {
                view_type = "CALC";

                $("#bkgCalendar").show();
                //$("#bkgList").hide();
                //$("#bkgDetail").hide();
                $("#list_area").hide();
                
                //bkgCal.beginUpdate();
                /*bkgCal.saveEditData();*/
                //bkgCal.endUpdate();
            } else {
                view_type = "LIST";
                $("#bkgCalendar").hide();
                //$("#bkgList").show();
                //$("#bkgDetail").show();
                $("#list_area").show();
                gridBkgList.beginUpdate();
                gridBkgList.saveEditData();
                gridBkgList.endUpdate();

                bkgDetail.beginUpdate();
                bkgDetail.saveEditData();
                bkgDetail.option('dataSource', '');
                bkgDetail.endUpdate();
            }
        }
    }).dxTabs('instance');

    var bkgCal = $('#bkgCalendar').dxScheduler({
        timeZone: 'Asia/Seoul',
        dataSource: data,
        editing: false,
        views: [{
            type:'month',
        }],
        currentView: 'month',
        currentDate: new Date(),
        startDayHour: 9,
        height: 730,
        width:1650,
        resources: [{
            fieldExpr: 'priorityId',
            allowMultiple: false,
            dataSource: priorityData,
            label: 'Priority',
        }],
        onOptionChanged: function (e) {
            //월이 바꼈을 때 재조회
            if (e.name == "currentDate") {
                var this_time = new Date(e.value);
                bkgYMD = this_time.getFullYear() + "" + _fnPad(this_time.getMonth() + 1, 2);
                SearchData(bkgYMD);
            }
        },
        onAppointmentClick(e) {
            e.cancel = true;
            
            BkgData = e.appointmentData;
            pop.option({ contentTemplate: () => popContentTemplate() }); // 팝업 데이터 초기화

            //#region 버튼 컨트롤
            // [0 : 상세 / 1 : 확정 / 2 : 예약취소 / 3 : 닫기] 
            if (BkgData.status == "Y") { // 확정 건
                pop.option("toolbarItems[0].options.visible", true);
                pop.option("toolbarItems[1].options.visible", false);
                pop.option("toolbarItems[2].options.visible", true);
            }
            if (BkgData.status == "N") { // 미확정 건
                pop.option("toolbarItems[0].options.visible", true);
                pop.option("toolbarItems[1].options.visible", true);
                pop.option("toolbarItems[2].options.visible", true);
            }
            if (BkgData.status == "C") { // 취소 건
                pop.option("toolbarItems[1].options.visible", false);
                pop.option("toolbarItems[0].options.visible", false);
                pop.option("toolbarItems[2].options.visible", false);
            }
            if (BkgData.status == "F") { // 취소 건
                pop.option("toolbarItems[1].options.visible", false);
                pop.option("toolbarItems[2].options.visible", false);
            }
            //#endregion

            pop.show();
        },
        onAppointmentDblClick(e) {
            e.cancel = true;
        },
        onAppointmentFormOpening: function (data) { // 기본 팝업 없애기
            $(".dx-popup-cancel-visible").css("display", 'none');
        },
    }).dxScheduler('instance');


    var gridBkgList = $("#bkgList").dxDataGrid({
        showBorders: true,
        allowColumnResizing: true,
        showRowLines: true,
        width: 1300,
        selection: {
            mode: 'single',
        },
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
                visible:false,
            },

            {
                dataField: 'BKG_STATUS_BTN',
                caption: '예약상태',
                alignment: "center",
                width: 95,
                cellTemplate: function (container, options) {
                    if (options.data.BKG_STATUS == "N") {
                        $("<div/>").dxButton({
                            text: "요청",
                            type: "none",
                            onClick: function () {
                                confirm_pop.option("toolbarItems[0].options.visible", true);
                                confirm_pop.option("toolbarItems[1].options.visible", true);
                                confirm_pop.option("toolbarItems[2].options.visible", true);
                                list_bkg_no = options.data.BKG_NO;
                                confirm_pop.show();
                            }
                        }).addClass("none")
                            .appendTo(container);
                    }
                    else if (options.data.BKG_STATUS == "Y") {
                        $("<div/>").dxButton({
                            text: "예약",
                            type: "complete",
                            onClick: function () {
                                confirm_pop.option("toolbarItems[0].options.visible", true);
                                confirm_pop.option("toolbarItems[1].options.visible", false);
                                confirm_pop.option("toolbarItems[2].options.visible", true);


                                list_bkg_no = options.data.BKG_NO;
                                confirm_pop.show();
                            }
                        }).addClass("complete")
                            .appendTo(container);
                    }
                    else if (options.data.BKG_STATUS == "C") {
                        $("<div/>").addClass("cancel")
                            .text("취소")
                            .appendTo(container);
                    }
                    else if (options.data.BKG_STATUS == "M") {
                        $("<div/>").addClass("modify")
                            .text("수정")
                            .appendTo(container);
                    }
                    else if (options.data.BKG_STATUS == "F") {
                        $("<div/>").dxButton({
                            text: "확정",
                            type: "final",
                            onClick: function () {
                                confirm_pop.option("toolbarItems[0].options.visible", true);
                                confirm_pop.option("toolbarItems[1].options.visible", false);
                                confirm_pop.option("toolbarItems[2].options.visible", false);


                                list_bkg_no = options.data.BKG_NO;
                                confirm_pop.show();
                            }
                        }).addClass("final")
                            .appendTo(container);
                    }
                }
            },
            {
                //값만 저장
                dataField: 'BKG_STATUS',
                caption: '예약상태',
                visible:false,
            },
            {
                dataField: 'AREA',
                caption: '지역',
                width: 60,
                alignment: "center",
            },
            {
                dataField: 'ITME_CD',
                caption: '지역',
                width: 60,
                alignment: "center",
                visible:false,
            },
            {
                dataField: 'ITEM_NM',
                width: 170,
                caption: '상품명',
                cellTemplate: function (cellElement, cellInfo) {
                    $('<a/>').addClass('dx-link')
                        .text(cellInfo.value)
                        .on('dxclick', function () {
                            window.open("/Admin/infoPop?itemCD=" + cellInfo.key.ITEM_CD, '_blank', 'width=600,height=630, scrollbars=no');
                        }).appendTo(cellElement);
                }
            },
            {
                dataField: 'STRT_DT',
                caption: '시작날짜',
                alignment: "center",
                width:100,
                customizeText: function (cellInfo) {
                    var date = _fnToNull(cellInfo.value);

                    return date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
                },
            },
            {
                dataField: 'END_DT',
                caption: '종료날짜',
                alignment: "center",
                width: 100,
                customizeText: function (cellInfo) {
                    var date = _fnToNull(cellInfo.value);

                    return date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
                },
            },
            {
                dataField: 'TOT_AMT',
                caption: '견적 금액',
                width: 150,
                dataType: 'number',
                format : "fixedpoint"
            },
            {
                dataField: 'CUST_NM',
                caption: '요청자명',
                alignment: "center",
                width: 100,
            },
            {
                dataField: 'CUST_EMAIL',
                caption: '요청자 이메일',
                width: 150,
            },
            {
                dataField: 'CUST_TEL',
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
                dataField: 'BKG_NO',
                caption: "예약번호",
                width: 170,
            },
            {
                dataField: 'RMK',
                width: 170,
                caption: '비고',
            },
        ],
        toolbar: {
            items: [{
                name: '',
                showText: 'always',
                options: {
                    text: "저장",
                    onclick(e) {

                    }
                },
            },]
        },
        onInitNewRow: function (e) { // 신규로우 생성
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
        onSelectionChanged(selectedItems) {
            const data = selectedItems.selectedRowsData[0];
            if (_fnToNull(data) != "") {
                if (data.BKG_NO != "") {
                    var BKG_NO = data.BKG_NO;
                    var BKG_STATUS = data.BKG_STATUS;
                    detailbkg_no = data.BKG_NO;
                    //if (data.BKG_STATUS == "F") { // 최종확정일 때
                    //    bkgDetail.option('dataSource', '');
                    //    bkgDetail.option("toolbar.items[0].options.disabled", true);
                    //} else {
                    fnSearchAllDetail(BKG_NO, BKG_STATUS);
                    
                    //}
                }
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


    var bkgDetail = $("#bkgDetail").dxDataGrid({
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
                dataField: 'BKG_NO',
                caption: '예약관리번호',
                visible: false,
            },
            {
                dataField: 'BKG_SEQ',
                caption: '예약관리순번',
                visible: false,
            },
            {
                dataField: 'REQ_STATUS',
                caption: '종류',
                allowEditing : false,
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
                },
                width:80,
            },
            {
                dataField: 'REQ_CONTENT',
                caption: '선택상품',
                allowEditing: false,
                width: 120,
            },
            {
                dataField: 'REQ_NUM',
                caption: '수량',
                width: 80,
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
                        date = date.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
                    }

                    return date;
                },

            },

        ],
        toolbar: {
            items: [{
                widget: 'dxButton',
                toolbar: 'bottom',
                options: {
                    visible: true,
                    text: '확정',
                    onClick() {
                        //detailbkg_no = bkgDetail.cellValue(0, "BKG_NO");
                        fnUpdateBkg("F","DETAIL")
                        
                    },
                },
            },{
                name: 'saveButton',
                showText: 'always',
                disabled:true,
                options: {
                    text: "저장",
                    onClick(e) {
                        upDateDetailPrc();
                    }
                },
            },]
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


    function SearchData(date) {
        objJsonData.DATE = date;
        objJsonData.BKG_STATUS = _fnToNull(BKG_STATUS.option("value"));
        objJsonData.ITEM_NM = _fnToNull(ITEM_NM.option('value'));
        objJsonData.CUST_NM = _fnToNull(CUST_NM.option('value'));

        $.ajax({
            type: "POST",
            url: "/Bkg/fnGetListData",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                //데이터바인딩
                var resultData = JSON.parse(result).Table1;

                //#region 달력 바인딩
                var bkg_list = new Object();
                data = new Array(); 
                for (var i = 0; i < resultData.length; i++) {
                    var color_code = "";
                    if (_fnToNull(resultData[i]["BKG_STATUS"]) == "Y") {
                        color_code = 1;
                    }
                    else if (_fnToNull(resultData[i]["BKG_STATUS"]) == "C") {
                        color_code = 3;
                    }
                    else if (_fnToNull(resultData[i]["BKG_STATUS"]) == "N") {
                        color_code = 2;
                    }
                    else if (_fnToNull(resultData[i]["BKG_STATUS"]) == "F") {
                        color_code = 4;
                    }
                    else if (_fnToNull(resultData[i]["BKG_STATUS"]) == "M") {
                        color_code = 5;
                    }
                    //else {
                    //    color_code = 2; 
                    //}

                    bkg_list = new Object();

                    
                    bkg_list.text = _fnToNull(resultData[i]["CUST_NM"]) + "-" + _fnToNull(resultData[i]["ITEM_NM"]); // 표기 제목
                    bkg_list.status = _fnToNull(resultData[i]["BKG_STATUS"]); // 상태
                    bkg_list.startDate = new Date(_fnToNull(resultData[i]["STRT_DT"]).substring(0,8).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')); // 시작일
                    bkg_list.endDate = new Date(_fnToNull(resultData[i]["END_DT"]).substring(0, 8).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')); // 종료일
                    bkg_list.dtlStDate = _fnToNull(resultData[i]["STRT_DT"]).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
                    bkg_list.dtlEdDate = _fnToNull(resultData[i]["END_DT"]).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
                    bkg_list.bkg_no = _fnToNull(resultData[i]["BKG_NO"]);
                    bkg_list.tot_amt = _fnToZero(resultData[i]["TOT_AMT"]);
                    bkg_list.cust_nm = _fnToNull(resultData[i]["CUST_NM"]);
                    bkg_list.cust_email = _fnToNull(resultData[i]["CUST_EMAIL"]);
                    bkg_list.cust_tel = _fnToNull(resultData[i]["CUST_TEL"]);
                    bkg_list.item_nm = _fnToNull(resultData[i]["ITEM_NM"]);
                    bkg_list.area = _fnToNull(resultData[i]["AREA"]);
                    bkg_list.rmk = _fnToNull(resultData[i]["RMK"]);
                    bkg_list.priorityId = color_code;
                    data.push(bkg_list);
                    
                }


                bkgCal.beginUpdate();
                bkgCal.option('dataSource', data);
                bkgCal.endUpdate();

                //#endregion

                //#region 리스트 바인딩
                gridBkgList.beginUpdate();
                gridBkgList.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridBkgList.option('dataSource', resultData);
                gridBkgList.endUpdate();

                //#region 디테일 초기화
                bkgDetail.beginUpdate();
                bkgDetail.saveEditData();
                bkgDetail.option('dataSource', []);
                bkgDetail.endUpdate();
                bkgDetail.option("disabled", true);
                $("#total_sub_price").hide();
                //#endregion

                //#endregion
            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });
    }



    function fnSearchAllDetail(bkg_no,status) {
        var objData = new Object();
        objData.BKG_NO = bkg_no;
        dtl_prc = 0;
        detail_cnt = 0;
        $.ajax({
            type: "POST",
            url: "/Bkg/fnGetBkgAllDetail",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objData) },
            success: function (result) {
                //데이터바인딩
                var resultData = JSON.parse(result).Table1;
                detail_cnt = resultData.length;
                for (var i = 0; i < resultData.length; i++) {
                    dtl_prc += _fnToZero(resultData[i]["PRC"]);
                }
                //Data Binding
                bkgDetail.beginUpdate();
                bkgDetail.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                bkgDetail.option('dataSource', resultData);
                bkgDetail.endUpdate();
                if (status != "F" && status != "C") {
                    bkgDetail.option("disabled", false);
                    bkgDetail.option("toolbar.items[0].options.disabled", false); // 저장 버튼 열기
                }
                else {
                    bkgDetail.option("disabled", true);
                }
                $("#total_sub_price").text("총금액 : " + dtl_prc.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","));
                $("#total_sub_price").show();

            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });


    }

    function upDateDetailPrc() {
        
        bkgDetail.saveEditData();

        var arrCntr = new Array();
        arrCntr = bkgDetail.option('dataSource');

        var Objdtl = new Object();

        for (var i = -1; ++i < arrCntr.length;) {
            var curRow = arrCntr[i]
            if (!curRow.hasOwnProperty("INSFLAG") || curRow.INSFLAG == "Q") {    // INSFLAG가 생성된 것만 처리
                arrCntr.splice(i, 1);
                i--;    //배열의 전체 길이가 줄어들기때문에 i값도 변경한다.
            }
        }

        Objdtl.MAIN = arrCntr;


        if (arrCntr.length > 0) {
            $.ajax({
                type: "POST",
                url: "/BKG/fnUpdateDetailPrc",
                async: true,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(Objdtl) },
                success: function (result) {
                    if (JSON.parse(result).Result[0].trxCode == "Y") {
                        DevExpress.ui.dialog.alert("<i>저장되었습니다.</i>", "");
                        SearchData(bkgYMD);
                    } else {
                        DevExpress.ui.dialog.alert("<i>저장 실패되었습니다.</i>", "");
                        return false;
                    }
                },
                error: function (xhr, status, error) {
                    console.log("에러");
                    console.log(error);
                }
            })
        }

    }

    //플래그 변경
    function fnUpdateBkg(flag, type) {

        bkgUpdateObj = new Object();

        bkgUpdateObj.STATUS = flag;

        if (type == "CALC") {
            bkgUpdateObj.BKG_NO = BkgData.bkg_no.toString();
        }
        else if (type == "DETAIL") {
            bkgUpdateObj.BKG_NO = detailbkg_no;
        }
        else {
            bkgUpdateObj.BKG_NO = list_bkg_no;
        }
        
        bkgUpdateObj.DATE = bkgYMD;

        $.ajax({
            type: "POST",
            url: "/Bkg/fnUpdateBkg",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(bkgUpdateObj) },
            success: function (result) {
                //데이터바인딩
                var resultData = JSON.parse(result).Table1;


                pop.hide();
                confirm_pop.hide();

                //#region 달력바인딩
                var bkg_list = new Object();
                data = new Array();
                for (var i = 0; i < resultData.length; i++) {
                    var color_code = "";
                    if (_fnToNull(resultData[i]["BKG_STATUS"]) == "Y") {
                        color_code = 1;
                    }
                    else if (_fnToNull(resultData[i]["BKG_STATUS"]) == "C") {
                        color_code = 3;
                    }
                    else if (_fnToNull(resultData[i]["BKG_STATUS"]) == "N") {
                        color_code = 2;
                    }
                    else if (_fnToNull(resultData[i]["BKG_STATUS"]) == "F") {
                        color_code = 4;
                    }
                    else if (_fnToNull(resultData[i]["BKG_STATUS"]) == "M") {
                        color_code = 5;
                    }

                    bkg_list = new Object();

                    
                    bkg_list.text = _fnToNull(resultData[i]["CUST_NM"]) + "-" + _fnToNull(resultData[i]["ITEM_NM"]); // 표기 제목
                    bkg_list.status = _fnToNull(resultData[i]["BKG_STATUS"]); // 상태
                    bkg_list.startDate = new Date(_fnToNull(resultData[i]["STRT_DT"]).substring(0, 8).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')); // 시작일
                    bkg_list.endDate = new Date(_fnToNull(resultData[i]["END_DT"]).substring(0, 8).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')); // 종료일
                    bkg_list.dtlStDate = _fnToNull(resultData[i]["STRT_DT"]).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
                    bkg_list.dtlEdDate = _fnToNull(resultData[i]["END_DT"]).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
                    bkg_list.bkg_no = _fnToNull(resultData[i]["BKG_NO"]);
                    bkg_list.tot_amt = _fnToZero(resultData[i]["TOT_AMT"]);
                    bkg_list.cust_nm = _fnToNull(resultData[i]["CUST_NM"]);
                    bkg_list.cust_email = _fnToNull(resultData[i]["CUST_EMAIL"]);
                    bkg_list.cust_tel = _fnToNull(resultData[i]["CUST_TEL"]);
                    bkg_list.item_nm = _fnToNull(resultData[i]["ITEM_NM"]);
                    bkg_list.area = _fnToNull(resultData[i]["AREA"]);
                    bkg_list.rmk = _fnToNull(resultData[i]["RMK"]);
                    bkg_list.priorityId = color_code;
                    data.push(bkg_list);

                    //#endregion
                }


                bkgCal.beginUpdate();
                bkgCal.option('dataSource', data);
                bkgCal.endUpdate();


                //#region 리스트 바인딩
                gridBkgList.beginUpdate();
                gridBkgList.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridBkgList.option('dataSource', resultData);
                gridBkgList.endUpdate();
                //#endregion

                if (flag == "Y") {
                    DevExpress.ui.dialog.alert("<i>예약 되었습니다.</i>", "");
                }
                else if (flag == "F") {
                    DevExpress.ui.dialog.alert("<i>예약 확정되었습니다.</i>", "");
                }
                else {
                    DevExpress.ui.dialog.alert("<i>예약 취소되었습니다.</i>", "");
                }
                

            }, error: function (xhr, status, error) {
                console.log("에러");
                console.log(error);
            }
        });


    }


    function fnSummeryDetailPrc() {
        dtl_prc = 0;
        if (detail_cnt > 0) {
            for (var i = 0; i < detail_cnt; i++) {
                dtl_prc += bkgDetail.cellValue(i, 3);
            }
            $("#total_sub_price").text("총금액 : " + dtl_prc.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","));
        }
    }

    SearchData(bkgYMD);
    $("#bkgCalendar").hide();
    $("#bkgDetail").find('.dx-toolbar-items-container').append("<label id='total_sub_price' style='display:none'>총금액 : 0</label>"); //라벨 강제로 넣어주기



    $("#bkgDetail").keyup(function (e) {
            if (e.keyCode == 13) {
                fnSummeryDetailPrc();
            }
    });

    $("#bkgDetail").on("click", function () {
        fnSummeryDetailPrc();
    });

});