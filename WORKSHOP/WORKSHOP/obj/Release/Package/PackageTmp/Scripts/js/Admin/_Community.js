
var objJsonData = new Object();
const pageType = "BACK"; // 사용자 관리자 페이지 구분 값
$(function () {
    
    
    initDtl();
    //#region 조회 영역

    //조건 종류
    var SELECT_TOPIC = $("#SELECT_TOPIC").dxSelectBox({
        width: 90,
        value: "A",
        displayExpr: "NAME",
        valueExpr: "CODE",
        value : "ALL",
        dataSource: [{ CODE: "ALL", NAME: "전체" },{ CODE: "TOPIC", NAME: "제목" }, { CODE: "CONTENT", NAME: "내용" }, { CODE: "INS_USR", NAME: "작성자" }],
    }).dxSelectBox('instance');

    var TEXT_AREA = $("#TEXT_AREA").dxTextBox({
        value: "",
        width : 200,
    }).dxTextBox('instance');


    var MNGT_NO = $("#MNGT_NO").dxTextBox({
        value: "",
        width: 200,
        visible:false,
    }).dxTextBox('instance');


    var btnSearch = $("#btnSearch").dxButton({
        text: "검색",
        onClick: function () {
            SearchData();
        }
    }).dxButton('instance');



    //#endregion


    //#region 그리드 영역


    var gridCommuList = $("#gridItem").dxDataGrid({
        hoverStateEnabled: true,
        height: 760,
        width: 760,
        showRowLines: true,
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
            allowAdding: false,
            allowUpdating: false,
            allowDeleting: false,
            texts: {
                deleteRow: "삭제",
                undeleteRow: "삭제 취소"
            }
        },
        columns: [

            {
                dataField: 'MNGT_NO',
                caption: '관리번호',
                width: 100,
                allowEditing: false,
                visible:false,
            },
            {
                dataField: 'USR_TYPE',
                caption: '작성자 유저정보',
                width: 100,
                allowEditing: false,
                visible: false,
            },
            {
                dataField: 'SCREAT_YN',
                caption: '',
                width: 30,
                allowEditing: false,
                cellTemplate(container, options) {
                    if (_fnToNull(options.value) == 'Y') {
                        $('<div>')
                            .append($('<img>', { src: '/Images/secret.png' }))
                            .appendTo(container);
                    }
                   
                },
                //customizeText: function (cellInfo) {
                //    var s = _fnToNull(cellInfo.value);
                //    var view_txt = "";

                //    if (s == "Y") {
                //        view_txt = "비밀글";
                //    }
                //    else {
                //        view_txt = "일반글";
                //    }

                //    return view_txt;
                //}
            },
            {
                dataField: 'TOPIC',
                caption: '제목',
                width: 400,
                visible: true,
            },
            {
                dataField: 'INS_USR',
                caption: '작성자',
                width: 80,
                visible: true,
            },
            {
                dataField: 'WRITE_DT',
                caption: '작성일',
                width: 100,
                visible: true,
                customizeText: function (cellInfo) {
                    var s = _fnToNull(cellInfo.value);
                    return s.replace(/(\d{4})(\d{2})(\d{2})/,'$1.$2.$3');
                }
            },
            {
                dataField: 'VIEW_CNT',
                caption: '조회수',
                width: 100,
                visible: true,

            },
        ],
        onCellPrepared: function onCellPrepared(e) {
            if (e.columnIndex == 0||e.columnIndex == 2 || e.columnIndex == 3 || e.columnIndex == 4 || e.columnIndex == 6) { // css 셋팅*/
                e.cellElement.css("text-align", "center");
            }
        },
        onSelectionChanged(selectedItems) {
            const data = selectedItems.selectedRowsData[0];
            if (_fnToNull(data) != "") {
                fnSearchDtlInfo(data.MNGT_NO);
            }
        },
    }).dxDataGrid('instance');


    //#endregion

    
    //#region 이벤트 영역


    //답글 클릭
    $(document).on('click', ".comment_modify.ans", function () {
        if (_fnToNull(MNGT_NO.option('value')) != "") {
            window.location = "/Admin/CommunityRegist?MNGT_NO=" + _fnToNull(MNGT_NO.option('value')) + "&FLAG=I"; // 신규
        }
        else {
            // 선택한 글이 없습니다.
        }
    });

    //수정 클릭
    $(document).on('click', ".comment_modify.mod", function () {
        if (_fnToNull(MNGT_NO.option('value')) != "") {
            window.location = "/Admin/CommunityRegist?MNGT_NO=" + _fnToNull(MNGT_NO.option('value'))+"&FLAG=U"; // 업데이트
        }
        else {
            // 선택한 글이 없습니다.
        }
    });


    $(document).on('click', "#Commu_del", function () {
        var mngt_no = MNGT_NO.option("value");
        var result = DevExpress.ui.dialog.confirm("<i>해당 게시글을 삭제하시겠습니까?</i>", "");
        result.done(function (dialogResult) {
            fnDeleteCommu(mngt_no);
        });
        

    });

    //댓글 , 대댓글 삭제
    $(document).on('click', "button[name='btn_del']", function () {
        var mngt_no = $(this).siblings("input[name='reply_mngt_no']").val();
        var result = DevExpress.ui.dialog.confirm("<i>해당 댓글을 삭제하시겠습니까?</i>", "");

        result.done(function (dialogResult) {
            fnDeleteReply(mngt_no);
        });
        

    });

    //#endregion


    //#region 함수 영역

    //게시글 저장
    //function fnSaveCommuAdmin(markup) {
    //    var saveObj = new Object();

    //    saveObj.CONTENT = escape(markup);
    //    saveObj.CONTENT_LEN = Math.ceil(saveObj.CONTENT.length / 4000);
    //    saveObj.TOPIC = "test";
    //    saveObj.USER = $("#Session_AD_CUST_NAME").val();
    //    saveObj.INS_PW = "N";
    //    saveObj.USR_TYPE = "M";
    //    saveObj.MNGT_NO = _fnSequenceMngt("COMMU");
    //    saveObj.SCREAT_YN = "Y";
    //    saveObj.PAGE_TYPE = "BACK";

    //    $.ajax({
    //        type: "POST",
    //        url: "/Community/fnSaveAdminCommu",
    //        async: false,
    //        dataType: "json",
    //        data: { "vJsonData": _fnMakeJson(saveObj) },
    //        success: function (result) {
                
    //            //#region 메인 리스트 바인딩
    //            //#endregion

    //        },
    //        error: function (xhr, status, error) {
    //            console.log("왓더퍽");
    //            console.log(error);
    //        }
    //    });

    //}


    //커뮤니티 제목 조회 (제목 , 작성자 , 조회수 )


    function SearchData() {
        var SchObj = new Object();

        initDtl();

        SchObj.AD_TYPE = SELECT_TOPIC.option('value');
        SchObj.DATA = _fnToNull(TEXT_AREA.option('value'));
        SchObj.USR_TYPE = "M";
        SchObj.PAGE_TYPE = pageType;

        $.ajax({
            type: "POST",
            url: "/Community/fnGetTopicList",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(SchObj) },
            success: function (result) {
                var resultData = JSON.parse(result).COMMUNITY;
                $("#total_cnt").text('총 ' + resultData.length+' 건');

                //#region 메인 리스트 바인딩
                gridCommuList.beginUpdate();
                gridCommuList.saveEditData();    //수정된 내용을 저장해야 새로 갱신됨
                gridCommuList.option('dataSource', resultData);
                gridCommuList.endUpdate();
                //#endregion

            },
            error: function (xhr, status, error) {
                console.log("메인 조회 에러,,.");
                console.log(error);
            }
        });

    }

    function initDtl() {
        $("#btn_area").hide(); // 버튼영역
        $(".commu_tit").empty(); // 제목
        $(".commu_tit_etc").empty(); // 세부사항
        $(".commu_txt").empty();
        $(".commu_comments_list_box").empty(); // 댓글
    }

    //세부 데이터 조회
    function fnSearchDtlInfo(mngt_no) {
        var DtlObj = new Object();

        

        DtlObj.MST_NO = mngt_no;

        $.ajax({
            type: "POST",
            url: "/Community/fnGetContentDtl",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(DtlObj) },
            success: function (result) {

                
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    var resultContent = JSON.parse(result).CONTENT;
                    var resultReply = JSON.parse(result).REPLY;

                    fnMakeCommuContent(resultContent, resultReply);


                }
                
                //#region 메인 리스트 바인딩
                
                //#endregion

            },
            error: function (xhr, status, error) {
                console.log("메인 조회 에러,,.");
                console.log(error);
            }
        });
    }

    //댓글, 대댓글 삭제 쿼리
    function fnDeleteReply(mngt_no) {
        var delObj = new Object();

        delObj.MNGT_NO = mngt_no;
        delObj.PAGE_TYPE = pageType;
        delObj.AD_OPTION = "D";
        delObj.MST_NO = MNGT_NO.option('value');

        $.ajax({
            type: "POST",
            url: "/Community/fnDeleteReplyList",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(delObj) },
            success: function (result) {

                if (_fnToNull(result.Result[0]["trxCode"]) == "Y") {
                    DevExpress.ui.dialog.alert("<i>댓글이 삭제되었습니다.</i>", "");
                    fnMakeReplyList(result.REPLY);
                }
                
            },
            error: function (xhr, status, error) {
                console.log("메인 조회 에러,,.");
                console.log(error);
            }
        });
    }

    function fnDeleteCommu(mngt_no) {
        var CommuDelObj = new Object();
        CommuDelObj.MNGT_NO = mngt_no;
        CommuDelObj.AD_OPTION = "D";
        CommuDelObj.PAGE_TYPE = pageType;

        $.ajax({
            type: "POST",
            url: "/Community/fnDeleteCommuList",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(CommuDelObj) },
            success: function (result) {

                if (_fnToNull(result.Result[0]["trxCode"]) == "Y") {
                    SearchData();
                }

            },
            error: function (xhr, status, error) {
                console.log("메인 조회 에러,,.");
                console.log(error);
            }
        });


    }


    function fnMakeCommuContent(content, reply) {

        initDtl();

        MNGT_NO.option('value', content[0]["MNGT_NO"]);
        var vHtml = "";
        //제목
        vHtml += (_fnToNull(content[0]["TOPIC"]));
        if (_fnToNull(content[0]["SCREAT_YN"]) == "Y") {
            vHtml += "<img src='/Images/icn_lock.png'>";
        }
        $(".commu_tit").append(vHtml);

        var rHtml = "";
        // 작성자 
        rHtml += "<span class=\"etc_tit\">" + _fnToNull(content[0]["INS_USR"])+"</span>";
        rHtml += "<span class=\"etc_date\">" + _fnToNull(content[0]["WRITE_DT"]).replace(/(\d{4})(\d{2})(\d{2})/,'$1.$2.$3')+ "</span>";
        rHtml += "<span class=\"etc_show\"><img src='/Images/icn_view.png'>" + _fnToZero(content[0]["VIEW_CNT"])+ "</span >";
        
        $(".commu_tit_etc").append(rHtml);

        // 내용 
        rHtml = "";
        var cont = unescape(_fnToNull(content[0]["ANS_CONTENT"]));

        $(".commu_txt").append(cont);


        //댓글 그리기 함수
        fnMakeReplyList(reply);


        //버튼 체크
        var text = "";
        if (_fnToNull(content[0]["ANS_YN"]) == "Y") {

            text = "수정";
            $(".comment_modify").removeClass("ans");
            $(".comment_modify").addClass("mod");
        }
        else {
            text = "답글";
            $(".comment_modify").removeClass("mod");
            $(".comment_modify").addClass("ans");
        }
        //문구 변경
        $(".comment_modify").children().text(text);

        $("#btn_area").show();
    }

    function fnMakeReplyList(reply) {
        var rHtml = "";

        $(".commu_comments_list_box").empty();

        rHtml += "<div class=\"commu_comments_list_tit\">댓글목록</div>";

        if (reply.length > 0) {
            
            var cnt = reply.length;


            $.each(reply, function (i) {
                if (_fnToNull(reply[i]["HEAD_ID"]) != "0") { // 대댓글일 경우
                    rHtml += "<div class='coc_box'>";
                    rHtml += "      <div class='coc_area comment_rel'>";
                    rHtml += "          <div class='coc_left'>";
                    rHtml += "              <img src ='/Images/coc.png'>";
                    rHtml += "              <span class='writer'>" + _fnToNull(reply[i]["INS_USR"]) + "</span>";
                    rHtml += "              <span class='write_cont'><input tpye='text' value='"+_fnToNull(reply[i]["CONTENT"])+"' disabled></span>";
                    rHtml += "          </div>";
                    rHtml += "          <div class='coc_right'>";
                    rHtml += "              <span class='write_date'>" + _fnToNull(reply[i]["WRITE_DT"]).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + "</span>";
                    rHtml += "              <button type='button' class='write_del' name='btn_del'>삭제</button>";
                    rHtml += "              <input type='hidden' name='reply_mngt_no' value = '"+_fnToNull(reply[i]["MNGT_NO"])+"'>";
                    rHtml += "          </div>";
                    rHtml += "      </div>";
                    rHtml += "</div>";
                }
                else { // 댓글일 경우
                    if (i == 0) { // 최초
                        rHtml += "<div class='coc'>";
                    }
                    else { // 이후
                        rHtml += "</div> <div class='coc'>";
                    }

                    rHtml += "<div class='comment comment_rel'>";
                    rHtml += "      <div class='comment_left'>";
                    rHtml += "          <div class='writer'>" + _fnToNull(reply[i]["INS_USR"]) + "</div>";
                    rHtml += "          <div class='write_cont'><input type='text' value='" +_fnToNull(reply[i]["CONTENT"])+"' disabled></div>";
                    rHtml += "      </div>";
                    rHtml += "      <div class='comment_right'>";
                    rHtml += "          <div class='write_etc'>";
                    rHtml += "              <span class='write_date'>" + _fnToNull(reply[i]["WRITE_DT"]).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + "</span>";
                    rHtml += "              <button type='button' class='write_del' name='btn_del'>삭제</button>";
                    rHtml += "              <input type='hidden' name='reply_mngt_no' value = '" + _fnToNull(reply[i]["MNGT_NO"]) + "'>";
                    rHtml += "          </div>";
                    rHtml += "      </div>";
                    rHtml += "</div>";

                }

            });

            rHtml += "</div>";

        }
        $(".commu_comments_list_box").append(rHtml);


    }

    //#endregion

    SearchData();


});