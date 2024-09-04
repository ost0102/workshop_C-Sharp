////////////////////전역 변수//////////////////////////

////////////////////jquery event///////////////////////
//Enter key 입력 했을 때 이동 및 검색을 위한 이벤트
//엔터키 이벤트
$(document).keyup(function (e) {

    if (e.keyCode == 13) {//키가 13이면 실행 (엔터는 13)
        if ($(e.target).attr('data-index') != undefined) {

        }

    }
    else if (e.keyCode == 9) {//키가 9이면 실행 (탭은 9)
        if ($(e.target).attr('data-index').indexOf("Main_Login") > -1) {
            var vIndex = $(e.target).attr('data-index').replace("Main_Login", "");

            if (vIndex == 1) {
                $('[data-index="Main_Login' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
            }

            //else if (vIndex == 2) {
            //    $("#btn_SEASchedule_Search").click();
            //}
        }
    }
});
////////////////////////function///////////////////////

/////////////////function MakeList/////////////////////

////////////////////////API////////////////////////////

