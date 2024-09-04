var pageindex = 1;
$(function () {
    $('.company_info_area').hide();

    fnSearchCommu(pageindex);

});

function goPage(pageIndex) {
    fnSearchCommu(pageIndex);
};

$(document).on('click', 'button[name="ClosePw"]', function (e) {
    e.stopPropagation();
    $(this).siblings('input[name="Checked_Content"]').val("");
    var PwBox = $(this).parents('.del_pw_box');
    PwBox.hide();
})

$(document).on("click", '#CommuDetail', function () {
    $('input[name="Checked_Content"]').val("");

    var MNGT_NO = $(this).find('input[name=Mngt_no]').val();
    var Pwd = $(this).find('input[name=Pwd]').val();
    var Usr_type = $(this).find('input[name=Usr_type]').val();
    var Screat_yn = $(this).find('input[name=Screat_yn]').val();

    if (Pwd == "Y" || Usr_type == "M") {
        if (Screat_yn == "N") {
            window.location = "/Community/Index?MNGT_NO=" + _fnToNull(MNGT_NO);
        } else {
            $(this).find('.del_pw_box').show();
        }
    } else {
        window.location = "/Community/Index?MNGT_NO=" + _fnToNull(MNGT_NO);
    }

    $(".del_pw_box").not($(this).closest("#CommuDetail").find(".del_pw_box")).hide();
    
});

$(document).on("click", 'button[name="Checked_Pwd"]', function () {
    if ($(this).siblings('input[name=Checked_Content]').val() == "") {
        _fnAlertMsg("비밀번호를 입력해주세요.");
        return false;
    }


    var objJsonData = new Object();
    objJsonData.INS_PW = $(this).siblings('input[name=Checked_Content]').val();
    objJsonData.MNGT_NO = $(this).parent().parent().parent().siblings('input[name=Mngt_no]').val();

    $.ajax({
        type: "POST",
        url: "/Community/fnChecked_Pwd",
        async: false,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {
            if (result.Result[0]["trxCode"] == "Y") {
                window.location = "/Community/Index?MNGT_NO=" + result.COMMUNITY[0]['MNGT_NO'];
            } else if (result.Result[0]["trxCode"] == "N") {
                _fnAlertMsg("비밀번호가 틀립니다.");
            }
        }, error: function (error) {
            console.log(error);
        }
    });
});


$(document).on('click', ".write_btn", function () {
    window.location = "/CommunityRegist/Index";

});

function fnSearchCommu(pageidx) {
    var objJsonData = new Object();
    objJsonData.PAGE = pageidx
    objJsonData.PAGE_TYPE = "FRONT";

    $.ajax({
        type: "POST",
        url: "/Community/fnGetTopicList",
        async: false,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {
            if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                fnCommShow(JSON.parse(result), pageidx);
            } else if (JSON.parse(result).Result[0]["trxCode"] == "E") {


            }
        }, error: function (error) {
            console.log(error);
        }
    });
}

function fnCommShow(vJsonData, pageidx) {
    var vHtml = "";
    var vResult = vJsonData.COMMUNITY;
    var totPageCnt = "";
    if (vResult.length > 0) {
    totPageCnt = _fnToNull(vResult[0]["TOTCNT"]);
        vHtml += "                                    <div class='write_txt'>";
        vHtml += "                                        <button type='button' class='write_btn'>글쓰기</button>";
        vHtml += "                                    </div>";
        vHtml += "                                    <div class='tb-scroll'>";
        vHtml += "                                    <table class='commu_tb'>";
        vHtml += "                                        <thead>";
        vHtml += "                                            <tr>";
        vHtml += "                                                <th>번호</th>";
        vHtml += "                                                <th>제목</th>";
        vHtml += "                                                <th>글쓴이</th>";
        vHtml += "                                                <th>날짜</th>";
        vHtml += "                                                <th>조회</th>";
        vHtml += "                                            </tr>";
        vHtml += "                                        </thead>";
        vHtml += "                                        <tbody >";
        $.each(vResult, function (i) {
            vHtml += "                                            <tr id = 'CommuDetail'>";
            if (_fnToNull(vResult[i]["COMM_NUM"]) == "0") {
                vHtml += "                                                <td></td>";
            } else {
                vHtml += "                                                <td>" + _fnToNull(vResult[i]["RNUM"]) + "</td>";
            }
            if (_fnToNull(vResult[i]["USR_TYPE"]) == "M") {
                if (_fnToNull(vResult[i]["SCREAT_YN"]) == "Y") {
                    vHtml += "                                                <td class='manager_comment'><img src='/Images/coc.png' /><span>" + _fnToNull(vResult[i]["TOPIC"]) + "</span> <img src='/Images/icn_lock.png'><div class='del_pw_box'><div class='del_pw_area'><input type='password' placeholder='비밀번호' name = 'Checked_Content'/><button type='button' name ='Checked_Pwd'>확인</button><button type='button' name='ClosePw'><img src='/Images/close_pw.png' /></button></div></div></td>";
                } else {
                    vHtml += "                                                <td class='manager_comment'><img src='/Images/coc.png' /><span>" + _fnToNull(vResult[i]["TOPIC"]) + "</span></td>";
                }
            } else if (_fnToNull(vResult[i]["USR_TYPE"]) == "A") {
                if (_fnToNull(vResult[i]["SCREAT_YN"]) == "Y") {
                    vHtml += "                                                <td class='user_notice'>" + _fnToNull(vResult[i]["TOPIC"]) + "<img src='/Images/icn_lock.png'><div class='del_pw_box'><div class='del_pw_area'><input type='password' placeholder='비밀번호' name = 'Checked_Content'/><button type='button' name ='Checked_Pwd'>확인</button><button type='button' name='ClosePw'><img src='/Images/close_pw.png' /></button></div></div> </td>";
                } else {
                    vHtml += "                                                <td>" + _fnToNull(vResult[i]["TOPIC"]) + "</td>";
                }
            } else {
                if (_fnToNull(vResult[i]["SCREAT_YN"]) == "Y") {
                    vHtml += "                                                <td class='user_notice'>" + _fnToNull(vResult[i]["TOPIC"]) + "<img src='/Images/icn_lock.png'><div class='del_pw_box'><div class='del_pw_area'><input type='password' placeholder='비밀번호' name = 'Checked_Content'/><button type='button' name ='Checked_Pwd'>확인</button><button type='button' name='ClosePw'><img src='/Images/close_pw.png' /></button></div></div> </td>";
                } else {
                    vHtml += "                                                <td>" + _fnToNull(vResult[i]["TOPIC"]) + "</td>";
                }
            }
            vHtml += "                                                <td>" + _fnToNull(vResult[i]["INS_USR"]) + "</td>";
            vHtml += "                                                <input type ='hidden' name='Mngt_no' value='" + _fnToNull(vResult[i]["MNGT_NO"]) + "'/> ";
            vHtml += "                                                <input type ='hidden' name='Pwd' value='" + _fnToNull(vResult[i]["SCREAT_YN"]) + "'/> ";
            vHtml += "                                                <input type ='hidden' name='Usr_type' value='" + _fnToNull(vResult[i]["USR_TYPE"]) + "'/> ";
            vHtml += "                                                <input type ='hidden' name='Screat_yn' value='" + _fnToNull(vResult[i]["SCREAT_YN"]) + "'/> ";
            vHtml += "                                                <td>" + _fnDateFormatingDash(_fnToNull(vResult[i]['INS_DT'])) + "</td>";
            vHtml += "                                                <td>" + _fnToNull(vResult[i]['VIEW_CNT']) + "</td>";
            vHtml += "                                            </tr>";
        })
        vHtml += "                                        </tbody>";
        vHtml += "                                    </table>";
        vHtml += "                                    </div>";
        vHtml += fnPaging(totPageCnt, 20, 5, pageidx);
    } else {
        vHtml += "                                    <div class='write_txt'>";
        vHtml += "                                        <button type='button' class='write_btn'>글쓰기</button>";
        vHtml += "                                    </div>";
        vHtml += "<div class='notice_box'><div class='no_service'>데이터가 없습니다.</div></div>";
    }
    $("#CommShow")[0].innerHTML = vHtml;
};







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