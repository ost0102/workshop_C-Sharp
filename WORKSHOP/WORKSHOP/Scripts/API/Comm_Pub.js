////////////////////전역 변수//////////////////////////
////////////////////jquery event///////////////////////
//$(function () {
//    
//});

//브라우저 Resize시 메뉴 창 닫기
$(window).resize(function (e) {
    if (!matchMedia("screen and (min-width: 1025px)").matches) {
        $(".nav-mobile__bg").hide();
        $(".nav-mobile").removeClass("active");
    }
});

//X박스 버튼 클릭 시
$(document).on("click", ".input-box .delete-btn", function () {
    var intBox = $(this).closest(".input-box");
    intBox.find("input").val('').focus();
    intBox.find(".delete-btn").hide();
    intBox.removeClass("has_del");
    intBox.find(".input_hidden").val("");
});

$(document).on("change keyup input", ".input-box input[type='text'],input[type='password']", function () {
    var intBox = $(this).closest(".input-box");
    intBox.addClass("has_del");
    intBox.find(".delete-btn").toggle(Boolean($(this).val()));
});

// 스케줄 +, - 버튼 컨트롤
$(document).on('click', '.btn_rel', function () {
    $relatedInfo = $(this).parents(".sch_row").next("tr");
    $btn_rel_i = $(this).parents('.sch_row').find('.btn_rel i');

    if ($relatedInfo.css("display") == "none") {
        $relatedInfo.show();
        $btn_rel_i.removeClass('xi-plus');
        $btn_rel_i.addClass('xi-minus');
    } else {
        $relatedInfo.hide();
        $btn_rel_i.removeClass('xi-minus');
        $btn_rel_i.addClass('xi-plus');
    }
})

////////////////////////function///////////////////////
/////////////////function MakeList/////////////////////
////////////////////////API////////////////////////////
