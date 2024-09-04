$(function () {

    fnSearchNotice(1);
    fnSearchReview(1);
    $("#From_Date_Office").val(_fnPlusDate(-15));
    $("#To_Date_Office").val(_fnPlusDate(15));
});
$(document).ready(function () {
    $('.simple-estimate').hide();
    $('.company_info').hide();
    if (sessionStorage.getItem("review") == "Y") {
        $("#review_show").click();
        sessionStorage.setItem("review", "");
    }
});


$(document).on('click', '#search_Office', function () {
   
    if ($("#notice_show").hasClass("on")) {
        fnListNotice(1);
    } else {
        fnListReview(1);
    }

});

$(document).on('click', '.notice_box', function () {
    
    if (!$(this).hasClass("on")) {
        if ($("#notice_show").hasClass("on")) {
            fnCntNotice(this);
        } else if ($("#review_show").hasClass("on")) {
            fnCntReview(this);
        }
        
    }
    var i = $(this).children('.notice_cont').children('.notice_content');
    var hidebtn = $(this).children('.notice_cont').children('.notice_title').children('#hide_notice');
    var showbtn = hidebtn.siblings('#show_notice');
    i.slideDown();
    showbtn.hide();
    hidebtn.show();
    $(this).addClass('on');
})
$(document).on('click', '.notice_box.on', function () {
    var i = $(this).children('.notice_cont').children('.notice_content');
    var hidebtn = $(this).children('.notice_cont').children('.notice_title').children('#hide_notice');
    var showbtn = hidebtn.siblings('#show_notice');
    i.slideUp();
    showbtn.show();
    hidebtn.hide();
    $(this).removeClass('on');
})

$(document).on('click', '#notice_show', function () {
    $(this).addClass('on')
    $('#review_show').removeClass('on');
    $('#notice').show();
    $('#review').hide();
})
$(document).on('click', '#review_show', function () {
    if (_fnToNull($("#Session_EMAIL").val()) != "") {
        $(this).addClass('on')
        $('#notice_show').removeClass('on');
        $('#review').show();
        $('#notice').hide();
    }
    else {
        _fnAlertMsg("로그인 서비스입니다.");
        $(document).on("click", "#findpwalert", function () {
            location.href = "/Login/index";
        })
    }
})
function goPage(pageIndex) {
    if ($("#notice_show").hasClass('on')) {
        fnSearchNotice(pageIndex)
    } else if ($("#review_show").hasClass('on')) {

        fnSearchReview(pageIndex);
    }
        

}

function fnListNotice(pageIndex) {
    var objJsonData = new Object();
    objJsonData.From_Date = _fnToNull($("#From_Date_Office").val()).replace(/-/gi, ""); //시작
    objJsonData.To_Date = _fnToNull($("#To_Date_Office").val()).replace(/-/gi, ""); //종료일
    objJsonData.STATUS = _fnToNull($("#ResStatus option:selected").val());
    objJsonData.KEYWORD = _fnToNull($("#Keyword_Office").val());
    objJsonData.PAGE = pageIndex;
    $.ajax({
        type: "POST",
        url: "/Service/fnListNotice",
        async: false,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {
            if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                makeNoticeList(result, pageIndex);
            } else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                console.log("[Fail - fnListNotice()]" + result.Result[0]["trxCode"]);
            }
        },
        error: function (result) {
            console.log(error);
        }
    });
}

function fnListReview(pageIndex) {
    var objJsonData = new Object();
    objJsonData.From_Date = _fnToNull($("#From_Date_Office").val()).replace(/-/gi, ""); //시작
    objJsonData.To_Date = _fnToNull($("#To_Date_Office").val()).replace(/-/gi, ""); //종료일
    objJsonData.STATUS = _fnToNull($("#ResStatus option:selected").val());
    objJsonData.KEYWORD = _fnToNull($("#Keyword_Office").val());
    objJsonData.PAGE = pageIndex;
    $.ajax({
        type: "POST",
        url: "/Service/fnListReview",
        async: false,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {
            if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                makeReviewList(result, pageIndex);
            } else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                console.log("[Fail - makeReviewList()]" + result.Result[0]["trxCode"]);
            }
        },
        error: function (result) {
            console.log(error);
        }
    });
}
function fnCntNotice(args) {
    var objJsonData = new Object();


    objJsonData.CNT = parseInt($(args).children('div').find('input[name=Notice_CNT]').val()) + 1;
    objJsonData.NOTICE_ID = $(args).find('input[name=Notice_ID]').val();
    objJsonData.PAGE = 1;

    $.ajax({
        type: "POST",
        url: "/Service/fnCntNotice",
        async: false,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {
            console.log(JSON.parse(result).NoticeCnt[0]["CNT"]);
            $(args).find('span[name=NotiCnt]').text(JSON.parse(result).NoticeCnt[0]["CNT"]);
            $(args).children('div').find('input[name=Notice_CNT]').val(JSON.parse(result).NoticeCnt[0]["CNT"])
            
        }, error: function (error) {
            console.log(error);
        }
    });
}
function fnCntReview(args) {
    var objJsonData = new Object();


    objJsonData.CNT = parseInt($(args).children('div').find('input[name=Review_CNT]').val()) + 1;
    objJsonData.REVIEW_ID = $(args).find('input[name=Review_ID]').val();
    objJsonData.PAGE = 1;

    $.ajax({
        type: "POST",
        url: "/Service/fnCntReview",
        async: false,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {
            $(args).find('span[name=ReviewCnt]').text(JSON.parse(result).ReviewCnt[0]["CNT"]);
            $(args).children('div').find('input[name=Review_CNT]').val(JSON.parse(result).ReviewCnt[0]["CNT"])

        }, error: function (error) {
            console.log(error);
        }
    });
}
function fnSearchNotice(pageIndex) {
    try {
        var objJsonData = new Object();
        objJsonData.PAGE = pageIndex;
        $.ajax({
            type: "POST",
            url: "/Service/fnSearchNotice",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    makeNoticeList(result, pageIndex);
                } else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    console.log("[Fail - fnGetSearchList()]" + result.Result[0]["trxCode"]);
                    _fnAlertMsg("검색값이 없습니다.");
                } else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    console.log("[Fail - fnGetSearchList()]" + result.Result[0]["trxCode"]);
                }
            }, error: function (error) {
                console.log(error);
            }
        });
    }
    catch (err) {
        console.log("[Error - fnSearchNotice]" + err.message);
    }
}

function makeNoticeList(result, pageIndex) {
    $("#notice").empty();
    var NoticeJson = JSON.parse(result).Table1;
    var vHtml = "";
    var totPageCnt = "";
    if (NoticeJson.length > 0) {
        $.each(NoticeJson, function (i) {
            totPageCnt = NoticeJson[i].TOTCNT;
            vHtml += "	<div class='notice_box'>	 ";
            vHtml += "        <div class='notice_date'> ";
            vHtml += NoticeJson[i].REGDT;
            vHtml += "        </div> ";
            vHtml += "        <div class='notice_cont'> ";
            vHtml += "            <div class='notice_title'> ";
            vHtml += "                <h3>" + NoticeJson[i].TITLE + "</h3> ";
            vHtml += "                <h3 class='hits'>조회수  <span name='NotiCnt'>"+ NoticeJson[i].CNT + "</span>회</h3> ";
            vHtml += "                 <input type='hidden' name ='Notice_ID' value='" + NoticeJson[i].NOTICE_ID + "'>";
            vHtml += "                 <input type='hidden' name ='Notice_CNT' value='" + NoticeJson[i].CNT + "'>";
            vHtml += "                <img src='/Images/show_detail.png' id='show_notice' /> ";
            vHtml += "                <img src='/Images/hide_detail.png' id='hide_notice' /> ";
            vHtml += "            </div> ";
            vHtml += "            <div class='notice_content'> ";
            vHtml += NoticeJson[i].CONTENT;
            vHtml += "            </div> ";
            vHtml += "        </div> ";
            vHtml += "    </div>";
        });
        vHtml += fnPaging(totPageCnt, 10, 5, pageIndex);

    } else {
        vHtml += "<div class='notice_box'><div class='no_service'>데이터가 없습니다</div></div>";
    }
    $("#notice").append(vHtml);
}


function fnSearchReview(pageIndex) {

    try {
        var objJsonData = new Object();
        objJsonData.PAGE = pageIndex;
        $.ajax({
            type: "POST",
            url: "/Service/fnSearchReview",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    makeReviewList(result, pageIndex);
                } else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    console.log("[Fail - fnGetSearchList()]" + result.Result[0]["trxCode"]);
                    _fnAlertMsg("검색값이 없습니다.");
                } else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    console.log("[Fail - fnGetSearchList()]" + result.Result[0]["trxCode"]);
                }
            }, error: function (error) {
                console.log(error);
            }
        });
    }
    catch (err) {
        console.log("[Error - fnSearchNotice]" + err.message);
    }
}

function makeReviewList(result, pageIndex) {
    $("#review").empty();
    var ReviewJson = JSON.parse(result).Table1;
    var vHtml = "";
    var totPageCnt = ""; 

    if (ReviewJson.length > 0) {
        $.each(ReviewJson, function (i) {
            totPageCnt = ReviewJson[i].TOTCNT;
            vHtml += "	<div class='notice_box'> ";
            vHtml += "        <div class='notice_date'> ";
            vHtml += "           " + _fnDateFormatingDash(ReviewJson[i].INS_DT) + " ";
            vHtml += "        </div> ";
            vHtml += "        <div class='notice_cont'> ";
            vHtml += "            <div class='notice_title'> ";
            vHtml += "                <h3>" + _fnToNull(ReviewJson[i].CMT_SUBJECT) + "</h3> ";
            vHtml += "              <div class='review_flex'>";
            vHtml += "                <h3 class='hits'>조회수 <span name='ReviewCnt'>" + ReviewJson[i].CNT + "</span>회</h3> ";
            vHtml += "                 <input type='hidden' name ='Review_ID' value='" + ReviewJson[i].MNGT_NO + "'>";
            vHtml += "                 <input type='hidden' name ='Review_CNT' value='" + ReviewJson[i].CNT + "'>";
            vHtml += "                <div class='review_rating'> ";
            for (var j = 0; j < parseInt(ReviewJson[i].CMT_SCORE); j++) {
                vHtml += "                    <img src='/Images/review_rating_color.png' /> ";
            }
            vHtml += "                </div> ";
            vHtml += "              </div> ";
            vHtml += "                <img src='/Images/show_detail.png' id='show_notice' /> ";
            vHtml += "                <img src='/Images/hide_detail.png' id='hide_notice' /> ";
            vHtml += "            </div> ";
            vHtml += "            <div class='notice_content'> ";
            vHtml += _fnToNull(ReviewJson[i].CMT_CONTENTS);
            vHtml += "                <div class='review_img_area'> ";
            vHtml += "                    <div class='review_img_box'> ";
            if (_fnToNull(ReviewJson[i].CMT_IMG1_PATH) != "") {
                vHtml += "                        <img src='" + _fnToNull(ReviewJson[i].CMT_IMG1_PATH) + "' /> ";
            }
            if (_fnToNull(ReviewJson[i].CMT_IMG2_PATH) != "") {
                vHtml += "                        <img src='" + _fnToNull(ReviewJson[i].CMT_IMG2_PATH) + "' /> ";
            }
            if (_fnToNull(ReviewJson[i].CMT_IMG3_PATH) != "") {
                vHtml += "                        <img src='" + _fnToNull(ReviewJson[i].CMT_IMG3_PATH) + "' /> ";
            }
            if (_fnToNull(ReviewJson[i].CMT_IMG4_PATH) != "") {
                vHtml += "                        <img src='" + _fnToNull(ReviewJson[i].CMT_IMG4_PATH) + "' /> ";
            }
            vHtml += "                    </div> ";
            vHtml += "                </div> ";
            vHtml += "            </div>                                                 ";
            vHtml += "        </div> ";
            vHtml += "    </div>";
        });
        vHtml += fnPaging(totPageCnt, 10, 5, pageIndex);
    } else {
        vHtml += "<div class='notice_box'><div class='no_service'>데이터가 없습니다</div></div>";
    }

    $("#review").append(vHtml);
}




function fnPaging(totalData, dataPerPage, pageCount, currentPage) {

    var totalPage = Math.ceil(totalData / dataPerPage);    // 총 페이지 수
    var pageGroup = Math.ceil(currentPage / pageCount);    // 페이지 그룹
    if (pageCount > totalPage) pageCount = totalPage;
    var last = pageGroup * pageCount;    // 화면에 보여질 마지막 페이지 번호
    if (last > totalPage) last = totalPage;
    var first = last - (pageCount - 1);    // 화면에 보여질 첫번째 페이지 번호
    var next = last + 1;
    var prev = first - 1;

    var prevPage;
    var nextPage;
    if (currentPage - 1 < 1) { prevPage = 1; } else { prevPage = currentPage - 1; }
    if (last < totalPage) { nextPage = currentPage + 1; } else { nextPage = last; }

    var html = "";

    html += "<div class='paging-area'> ";
    html += "<ul> ";
    html += "	<li><a href='#' onclick='goPage(1)' class='prev-first'><span>맨앞으로</span></a></li>";
    html += "	<li><a href='#' onclick='goPage(" + prevPage + ")' class='prev'><span>이전으로</span></a></li>";
    //html += "	<span class='number'> ";

    for (var i = first; i <= last; i++) {

        if (i == currentPage) {
            //html += "		<span class='on'>" + i + "</span> ";
            html += "	<li><a href='javascript:void(0)' class='active'>" + i + "</a></li>";
        } else {
            //html += "		<a href='#' onclick='goPage(" + i + ")'>" + i + "</a> ";
            html += "	<li><a href='#' onclick='goPage(" + i + ")' class='prevt'>" + i + "</a></li>";
        }
    }

    //html += "	</span> ";
    html += "	<li><a href='#' onclick='goPage(" + nextPage + ")' class='next'><span>다음으로</span></a></li>";
    html += "	<li><a href='#' onclick='goPage(" + totalPage + ")' class='next-last'><span>맨뒤로</span></a></li>";
    //html += "	<a href='#' onclick='goPage(" + nextPage + ")' class='page next'><span class='blind'>다음페이지로 가기</span></a> ";
    //html += "	<a href='#' onclick='goPage(" + totalPage + ")' class='page last'><span class='blind'>마지막페이지로 가기</span></a> ";
    html += "</ul> ";
    html += "</div> ";

    return html;
}
