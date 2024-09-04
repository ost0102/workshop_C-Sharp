$(function () {


    var getParameter = function (param) {
        var returnValue = '';
        // 파라미터 파싱
        var url = location.href;
        var params = (url.slice(url.indexOf('?') + 1, url.length)).split('&');
        for (var i = 0; i < params.length; i++) {
            var varName = params[i].split('=')[0];
            //파라미터 값이 같으면 해당 값을 리턴한다
            if (varName.toUpperCase() == param.toUpperCase()) {
                returnValue = _fnToNull(params[i].split('=')[1]);
                return decodeURIComponent(returnValue);
            }
        }

        return returnValue;
    }

    var item_cd = getParameter("ItemCD");
    
    function searchItem() {
        var searchObj = new Object();
        searchObj.ITEM_CD = item_cd;

        $.ajax({
            type: "POST",
            url: "/Admin/fnItemInfoData",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(searchObj) },
            success: function (result) {
                var resultData = JSON.parse(result).Table1;

                console.log(resultData);
                fnMakeInfo(resultData);
            },
            error: function (xhr, status, error) {
                console.log("Error - searchItem : ", error);
            }
        });
    }

    function fnMakeInfo(item_info) {
        var vHtml = "";

        $(".item_info_area").empty();

        vHtml += "<div class='item_row'>";
        vHtml += "  <div class='title'>상품명 : </div>";
        vHtml += "  <div class='data_info'>"+_fnToNull(item_info[0]["ITEM_NM"])+"</div>";
        vHtml += "</div>";
        vHtml += "<div class='item_row'>";
        vHtml += "  <div class='title'>지역 : </div>";
        vHtml += "  <div class='data_info'>" + _fnToNull(item_info[0]["AREA"]) + "</div>";
        vHtml += "</div>";
        vHtml += "<div class='item_row'>";
        vHtml += "  <div class='title'>주소 : </div>";
        vHtml += "  <div class='data_info'>" + _fnToNull(item_info[0]["ADDR1"]) + " " + _fnToNull(item_info[0]["ADDR2"]) + "</div>";
        vHtml += "</div>";
        vHtml += "<div class='item_row'>";
        vHtml += "  <div class='title'>담당자 : </div>";
        vHtml += "  <div class='data_info'>" + _fnToNull(item_info[0]["HOTEL_PIC"])  + "</div>";
        vHtml += "</div>";
        vHtml += "<div class='item_row'>";
        vHtml += "  <div class='title'>연락처 : </div>";
        vHtml += "  <div class='data_info'>" + _fnToNull(item_info[0]["HOTEL_TEL"]) + "</div>";
        vHtml += "</div>";
        vHtml += "<div class='item_row'>";
        vHtml += "  <div class='title'>홈페이지 : </div>";
        if (_fnToNull(item_info[0]["HOME_URL"]) != "") {
            vHtml += "  <div class='data_info  item_url' Onclick=\"window.open('" + _fnToNull(item_info[0]["HOME_URL"]) + "','_blank','fullscreen')\">" + _fnToNull(item_info[0]["HOME_URL"]) + "</div>";
        }
        vHtml += "</div>";


        $(".item_info_area").append(vHtml);

    }

    searchItem();


    
});


