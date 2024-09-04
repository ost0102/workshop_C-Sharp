$(function () {
	$('#hamberger, .total_menu .dim, .total_menu .close').on('click', function (e) {
		e.preventDefault();
		if (matchMedia("screen and (max-width: 1200px)").matches) { // 모바일

			if ($('.total_menu').css("display") != 'block') {
				$('.total_menu, .dim').show();
				$('body').addClass("layer_on");

				noScrollRun();

				$('body').on('scroll touchmove mousewheel', function (event) {
					event.preventDefault();

					event.stopPropagation();
					return false;
				});

				$(".total_nav").stop().animate({ right: 0 }, 300);

			} else {
				$(".total_nav").stop().animate({ right: "-78%" }, 200, function () {
					$('body').removeClass("layer_on");
					noScrollClear();
					$('body').off('scroll touchmove mousewheel');
					$('.total_menu, .dim').fadeOut(300);
				});
			}
		} else {
			if (!$('#header').hasClass("active")) {
				$('#header').addClass("active");
				$('#hamberger').addClass("show");
				$('#navi_bg').stop().slideDown();
				$('.lnb .depth').stop().slideDown();
				//$("#header .inner").css("background", "rgb(255,255,255)"); /*header 마스크 */
			} else {
				$('#navi_bg').stop().slideUp(200);
				$('.lnb .depth').stop().slideUp(200);

				$('#header').delay(100).queue(function (next) {
					$(this).removeClass("active");
					next();
				});

				$('#hamberger').removeClass("show");
				//$("#header .inner").css("background", "rgba(33,33,33,0.2)"); /*header 마스크 */

			}
		}
	});

	$("#header .lnb").on('mouseenter focusin', function () {
		if (!matchMedia("screen and (max-width: 767px)").matches) {
			if (!$('#header').hasClass("active")) {
				$('#header').addClass("active");
				$('#hamberger').addClass("show");
				$('.lnb').addClass("active");
				$('#navi_bg').stop().slideDown();
				$('.lnb .depth').stop().slideDown();
				//$("#header .inner").css("background", "rgb(255,255,255)"); /*header 마스크 */
			}
		}
	});

	$("#header").on('mouseleave focusout', function () {
		if (!matchMedia("screen and (max-width: 767px)").matches) {
			if ($('#header').hasClass("active")) {
				$('#navi_bg').stop().slideUp(200);
				$('.lnb .depth').stop().slideUp(200);

				$('#header').delay(100).queue(function (next) {
					$(this).removeClass("active");
					next();
				});

				$('#hamberger').removeClass("show");
				//$("#header .inner").css("background", "rgba(33,33,33,0.2)"); /*header 마스크 */
			}
		}
	});


	$('.location .depth').hover(function () {
		$(this).addClass("on");
		$(this).find(".sub_list").stop().slideDown(300);
	}, function () {
		$(this).removeClass("on");
		$(this).find(".sub_list").stop().slideUp(300);
	});

	/* aeo_pop */
	$('.tab.aeo_pop > li').on("click", function () {
		var $panel = $('.tab_panel.aeo_pop .panel').eq($(this).index());
		$('.tab.aeo_pop > li').removeClass("on");
		$(this).addClass("on");
		$('.tab.aeo_pop > li').eq($(this).index()).addClass("on");
		$('.tab_panel.aeo_pop .panel').hide();
		$panel.show();
	});

	$('.top').on("click", function () {
		$('html, body').animate({ scrollTop: 0 }, 400);
		return false;
	});

	$('.btn_scroll').click(function (e) {
		e.preventDefault();
		$('html, body').animate({ scrollTop: $(this.hash).offset().top }, 500);
	});

	$(window).resize(function () {
		if ($('#header').hasClass("active")) {
			$('#header').removeClass("active");
			$('#hamberger').removeClass("show");
			$('#navi_bg').stop().slideUp(200);
			$('.lnb .depth').stop().slideUp(200);
		}

		if ($('.total_menu').css("display") == 'block') {
			$(".total_nav").stop().animate({ right: "-78%" }, 200, function () {
				$('body').removeClass("layer_on");
				noScrollClear();
				$('body').off('scroll touchmove mousewheel');
				$('.total_menu, .dim').fadeOut(300);
			});
		}
	});

	// 달력플러그인 Type1 - 단독
	var calDate = $(".cal_date");
	if (calDate.length > 0) {
		calDate.each(function (index, item) {
			var $this = $(this);
			$this.datetimepicker({
				timepicker: false,
				format: 'Y.m.d',
				/*startDate:'2018.02.01',*/
				onSelectDate: function (dp, $input) {
					var str = $input.val();
					var m = str.substr(0, 10);

					$this.find(".date").val(m);
				}
			});
		});
	}
	// 달력플러그인 Type2 - 시작일~종료일
	// 달력플러그인
	var sDate = $(".start_date");
	if (sDate.length > 0) {
		sDate.datetimepicker({
			timepicker: false,
			format: 'Y-m-d',
			onShow: function (ct) {
				this.setOptions({
					//maxDate: eDate.find(".date").val() ? eDate.find(".date").val() : false
				});
			},
			/*startDate:'2018.02.01',*/
			onSelectDate: function (dp, $input) {
				var str = $input.val();
				var m = str.substr(0, 10);
				sDate.find(".date").val(m);
			}
		});
	}
	if ($('.cal_date').hasClass('no_past') === false) {
		sDate.datetimepicker({
			minDate: 0
		})
	}
	if ($('.cal_date').hasClass('no-past') === true) {
		sDate.datetimepicker({
			minDate: 0
		})
	}
	var eDate = $(".end_date");
	if (eDate.length > 0) {
		eDate.datetimepicker({
			timepicker: false,
			format: 'Y-m-d',
			onShow: function (ct) {
				this.setOptions({
					minDate: sDate.find(".date").val() ? sDate.find(".date").val() : false
				});
			},
			/*startDate:'2018.02.01',*/
			onSelectDate: function (dp, $input) {
				var str = $input.val();
				var m = str.substr(0, 10);
				eDate.find(".date").val(m);
			}
		});
	}

	////////////

	// 달력플러그인 Type1 - 단독
	var calDate_R = $(".cal_date_R");
	if (calDate_R.length > 0) {
		calDate_R.each(function (index, item) {
			var $this = $(this);
			$this.datetimepicker({
				timepicker: false,
				format: 'Y.m.d',
				/*startDate:'2018.02.01',*/
				onSelectDate: function (dp, $input) {
					var str = $input.val();
					var m = str.substr(0, 10);

					$this.find(".date_R").val(m);
				}
			});
		});
	}
	// 달력플러그인 Type2 - 시작일~종료일
	// 달력플러그인
	var sDate_R = $(".start_date_R");
	if (sDate_R.length > 0) {
		sDate_R.datetimepicker({
			timepicker: false,
			format: 'Y-m-d',
			onShow: function (ct) {
				this.setOptions({
					maxDate: eDate_R.find(".date_R").val() ? eDate_R.find(".date_R").val() : false
				});
			},
			/*startDate:'2018.02.01',*/
			onSelectDate: function (dp, $input) {
				var str = $input.val();
				var m = str.substr(0, 10);
				sDate_R.find(".date_R").val(m);
			}
		});
	}

	var eDate_R = $(".end_date_R");
	if (eDate_R.length > 0) {
		eDate_R.datetimepicker({
			timepicker: false,
			format: 'Y-m-d',
			onShow: function (ct) {
				this.setOptions({
					minDate: sDate_R.find(".date_R").val() ? sDate_R.find(".date_R").val() : false
				});
			},
			/*startDate:'2018.02.01',*/
			onSelectDate: function (dp, $input) {
				var str = $input.val();
				var m = str.substr(0, 10);
				eDate_R.find(".date_R").val(m);
			}
		});
	}

});
$(document).ready(function () {
    var slider = $('.slider');

    // 슬라이더 초기화
    slider.on('init', function () {
        // 이미지가 로드된 후 슬라이더를 초기화합니다.
        slider.slick();
    });
});
$(window).scroll(function(){
	goSchedule();
});

function goSchedule(){
	if($(this).scrollTop() > 130){
		$('.sched_wrap').fadeIn(500);
	}else{
		$('.sched_wrap').fadeOut(500);
	}
}

function lock(v1, v2){
	$(".lnb > li").eq(v1).addClass("on");
}

/* 레이어팝업 */
var layerPopup = function (obj) {
	var $laybtn = $(obj),
		$glayer_zone = $(".layer_zone");
	if ($glayer_zone.length === 0) { return; }

	$glayer_zone.hide();
	$("body").addClass("layer_on");
	$laybtn.fadeIn(200);	

	//$glayer_zone.on("click", ".loginChk", function (e) {
	//	var $this = $(this),
	//		t_layer = $this.parents(".layer_zone");
	//	$("body").removeClass("layer_on");
	//	t_layer.fadeOut(300);
	//});

	//$glayer_zone.on("click", function (e) {
	//	var $this = $(this),
	//		$t_item = $this.find(".layer_cont");
	//	if($(e.target).parents(".layer_cont").length>0){
	//		return;
	//	}

	//	$("body").removeClass("layer_on");
	//	$this.fadeOut(300);
	//});
};

/* 레이어팝업 닫기 */
var layerClose = function(obj){
	var $laybtn = $(obj);
	$("body").removeClass("layer_on");
	$laybtn.hide();
	var layerFocus = $(".loginChk").attr('class').split(" ");
	if (_fnToNull(layerFocus[4]) != "") {
		$("#" + layerFocus[4]).focus();
	}
};

/* 레이어팝업 닫기 */
var layerCloseLayer = function (obj) {
	var $laybtn = $(obj);
	$("body").removeClass("layer_on");
	FocusData = true;

	$laybtn.hide();
};

function BrowserVersionCheck() {
    var agent = navigator.userAgent.toLowerCase();
    if (agent.indexOf("kakaotalk") != -1 || agent.indexOf("iphone") != -1 || agent.indexOf("ipad") != -1 || agent.indexOf("ipod") != -1 || agent.indexOf("safari") != -1) {
		return true;
    }else{
    	return false
    }
}

var posY;

function noScrollRun() {
	if(BrowserVersionCheck()){
	    posY = $(window).scrollTop();
	    $('body').addClass('noscroll');
	    $("#wrap").css("top",-posY);
   }
}

function noScrollClear() {
	if(BrowserVersionCheck()){
	    $('body').removeClass('noscroll');
	    posY = $(window).scrollTop(posY);
	    $("#wrap").attr("style","");
	}
}

function fnPrePare() {

	alert("준비중 입니다.");

}
$(function () {
	// input X버튼
	$(".int_box .delete").on("click", function () {
		var intBox = $(this).closest(".int_box");
		intBox.find("input[type='text'], input[type='password']").val('').focus();
		intBox.find(".delete").hide();
		intBox.removeClass("has_del");
		intBox.find(".input_hidden").val("");
	});
	$(".int_box input").bind("change keyup input", function (event) {
		var intBox = $(this).closest(".int_box");
		intBox.addClass("has_del");
		intBox.find(".delete").toggle(Boolean($(this).val()));
	});
})

$(document).on('click', '#login_btn', function () {
	$('#alert09').show();
});

$(document).on('click', '#layer_login_btn3', function () { /*상단로그인 id*/
	var id = _fnToNull($(this).parent().siblings('.login_id').find('input[name=id_login]').val());
	var pw = _fnToNull($(this).parent().siblings('.login_pw').find('input[name=pw_login]').val());
	_fnLogin(id, pw);
});

$(document).on('keyup', '#top_id', function (e) { //상단로그인 엔터키포커스
	if (e.keyCode == 13) {
		//var id = _fnToNull($(this).parent().siblings('.login_id').find('input[name=id_login]').val());
		//var pw = _fnToNull($(this).parent().siblings('.login_pw').find('input[name=pw_login]').val());
		$("#top_pw").focus();
	}
});

$(document).on('keyup', '#top_pw', function (e) { /*상단로그인id*/
	if (e.keyCode == 13) {
		var id = $("#top_id").val();
		var pw = $("#top_pw").val();

		if (id.length < 2) {
			$("#Span_Waning_ID").html("두자리 이상 입력하세요");
			$("#Span_Waning_ID").show();
		} else {
			//$("#Span_Waning_ID").hide();
			_fnLogin(id, pw);
        }
	}
});

$(document).on('click', '#Estimate_login_btn', function () { /*견적문의로그인 id*/
	var id = _fnToNull($(this).parent().siblings('.login_info_box').find('input[name=id_login]').val());
	var pw = _fnToNull($(this).parent().siblings('.login_info_box').find('input[name=pw_login]').val());
	_fnLogin(id, pw);
});

$(document).on('keyup', '#Estimate_pw', function (e) {
	if (e.keyCode == 13) {
		var id = $("#Estimate_id").val();
		var pw = $("#Estimate_pw").val();

		if (id.length < 2) {
			$("#Span_Waning_EstID").html("두자리 이상 입력하세요");
	        $("#Span_Waning_EstID").show();
        } else {
	        $("#Span_Waning_EstID").hide();
	        _fnLogin(id, pw);
        }
    }
});

function _fnLogin(id, pw) {
	try {
		//로그인 체크
		if (id == "") {
			$("#Span_Waning_PW").hide();
			$("#Span_Waning_ID").show();
			$("#id_input").focus();
			return false;
		}
		else {
			$("#Span_Waning_ID").hide();
		}
		if (pw == "") {
			$("#Span_Waning_ID").hide();
			$("#Span_Waning_PW").show();
			$("pw_input").focus();
			return false;
		}
		else {
			$("#Span_Waning_PW").hide();
		}

		var objJsonData = new Object();
		objJsonData.EMAIL = id;
		objJsonData.PSWD = pw;

		$.ajax({
			type: "POST",
			url: "/Home/fnLogin",
			async: false,
			dataType: "json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {
				console.log(result);
				if (result.Result[0]["trxCode"] == "Y") {
					$('#alert09').hide();
					if (result.Table[0].APV_YN == "Y") { //******************************************************** 나중에 Y로 변경해야함
						//아이디 저장 체크 일 경우 쿠키에 저장
						if ($('input[name=login_keep]')[0].checked) {
							_fnSetCookie("Prime_CK_USR_ID_REMEMBER_WORKSHOP", result.Table[0].EMAIL, "168");
						} else {
							_fnDelCookie("Prime_CK_USR_ID_REMEMBER_WORKSHOP");
						}
						$.ajax({
							type: "POST",
							url: "/Home/SaveLogin",
							async: false,
							data: { "vJsonData": _fnMakeJson(result) },
							success: function (result) {
								if (_fnToNull(result) == "Y") {
									sessionStorage.setItem("Login", "Y");
									window.location = "/Home/Index";
								}
							}, error: function (error) {
								_fnAlertMsg("담당자에게 문의해주세요.");
								console.log(error);
							}
						})
					} else if (result.Table[0].APV_YN == "N") {
						_fnAlertMsg("가입 승인이 되지않았습니다. <br> 담당자에게 문의 해주세요.");
					}
				} else {
					//_fnAlertMsg("이메일 혹은 비밀번호가 틀립니다.");
					_fnLayerAlertMsg("이메일 혹은 비밀번호가 틀립니다.");
				}
			}
		})
	}
	catch (err) {
		console.log("[Error - _fnLogin]" + err.message);
	}
}

////로그아웃 (세션 , 쿠키 삭제)
function _fnLogout() {
	$.ajax({
		type: "POST",
		url: "/Home/LogOut",
		async: false,
		success: function (result) {
			sessionStorage.setItem("Login", "N");
			//$("#Session_MNGT_NO").val("");
			//$("#Session_EMAIL").val("");
			//$("#Session_GRP_CD").val("");
			//$("#Session_CUST_NAME").val("");
			//$("#Session_TELNO").val("");
			//$("#Session_COMPANY").val("");
			//$("#Session_DEPARTURE").val("");
			//$("#Session_USER_TYPE").val("");
			//$("#Session_APV_YN").val("");

			location.href = window.location.origin;
		}
	});
}

$(function () {
	//로그인 아이디 저장 체크가 되어있을 시 데이터 넣는 로직
	var userInputId = _fnGetCookie("Prime_CK_USR_ID_REMEMBER_WORKSHOP");
	if (_fnToNull(userInputId) != "") {
		$("#top_id").val(userInputId);
		$("#main_id").val(userInputId);
		$("#id_keep").attr("checked", true);
		$("#id_keep2").attr("checked", true);
		//$("#login_keep").replaceWith("<input type='checkbox' id='login_keep' name='login_keep' class='chk' checked>");
	} else {
		$("#top_id").focus();
    }
})
// 메인페이지 tab_area로 자동 스크롤
function fnMovePage(vId) {
	var offset = $("#" + vId).offset();
	//클릭시 window width가 몇인지 체크
	var windowWidth = $(window).width();
	var vHeaderHeight = $("#header").height();

	if (windowWidth < 1025) {
		$('html, body').animate({ scrollTop: offset.top - vHeaderHeight - (-50) }, 10);

	}
	else {
		$('html, body').animate({ scrollTop: $("#" + vId).offset().top - (-10) }, 30);
	}

}


$('html').click(function (e) {
	if ($(e.target).parents('.stay_form_area').length < 1) {
		$('.stay_form_area').hide();
	}
});
//$('html').click(function (e) {
//	if ($(e.target).parents('.feed_area').length < 1) {
//		alert("d")
//		$('.feed_area').hide();
//	}
//});

//$(document).on('click', '#feed', function () {
//	$('.feed_area').show();
//});

$(document).on('click', '#close_feed > img', function () {
	$('.feed_area').hide();
});

//마이보드 후기전체보기
$(document).on('click', '#show_review', function () {
	sessionStorage.setItem("review", "Y");
	location.href = '/Service/index';

});
//상단 회원가입, 로그인 메뉴이동
$(document).on('click', '.user > li:first-child, p.join', function () {
	location.href = '/Join/index';
});
$(document).on('click', '.logo', function () {
	location.href = '/Home/index';
});

$(document).on("click", '.seminar', function () {
	$(this).addClass("on");
})
$(document).on("click", '.seminar.on', function () {
	$(this).removeClass("on");
})


//$(document).on('click', '#feed', function () {
//	if (!$('#feed').hasClass('on')) {
//		alert("1");
//		$('.feed_area').hide();
//	} else {
//		alert("2");
//		$('.feed_area').addClass('active');
//		$('#wrap').addClass('active');
//    }
//});

$(document).on('click', '#close_stay', function () {
	$('.stay_form_area').hide();
});
$(document).on('click', '.choice_stay1', function () {
	$(this).css('background', '#c7e9e8');
	$('.choice_stay2').css('background', '#eeeff0');
	$('.stay_form_area').show();
});
$(document).on('click', '.choice_stay2', function () {
	$(this).css('background', '#c7e9e8');
	$('.choice_stay1').css('background', '#eeeff0');
})
$(document).on("click", '.stay_form', function () {
	//alert($(this).find('input').val())
	$(this).addClass("on");
	$(this).children().find('input').val("1");
	$(".choice_stay1").css("background", "rgb(199, 233, 232)")
})
$(document).on("click", '.stay_form.on', function () {
	$(this).removeClass("on");
	$(this).children().find('input').val("0");
	var cnt = 0;
	bool = false;
	$(".stay_form").each(function (i) {
		if ($(this).hasClass("on")) {
		} else {
			cnt += 1;
		}
	});
	if (cnt == $(".stay_form").length) {
		bool = true;
	}
	if (bool) {
		$(".choice_stay1").css("background", "rgb(238, 239, 240)")
	}
})
$(document).on("click", '.count_btn > .minus', function () {
	var i = $(this).parents('.stay_form');
	
	i.removeClass("on");
	if ($(this).siblings('input').val() > 1) {
		i.addClass('on');
	}
})
$(document).on("click", '.count_btn > input', function () {
	var i = $(this).parents('.stay_form');
	i.removeClass("on");
	i.addClass('on');
})
$(document).on("click", '.count_btn > .plus', function () {
	var i = $(this).parents('.stay_form');
	i.removeClass("on");
	i.addClass('on');
})

$(document).on("click", '.option.feed_btn', function () {
	//$(this).addClass('on');
	//$(this).attr('checked', true);
	$('.feed_area').show();
})

$(document).on("click", ".option", function () {
	if (!$(this).hasClass("feed_btn")) {
		$(this).addClass('on');
		$(this).attr('checked', true);
	}
	//$('.feed_area').show();
})
$(document).on("click", '.option.etc_form.on', function () {
	$(this).removeClass('on');
	$(this).attr('checked', false);
})

$(document).on("click", '.feed', function () {
	//if (!$('.feed').hasClass('on')) {
	//	$('.feed_area').hide();
	//} else {

	$(this).addClass("on");
	$(".feed_btn").addClass("on");
	$(".feed_btn").attr('checked', true);

	//}
})
$(document).on("click", '.feed.on', function () {
	var cnt = 0;
	var bool = false;
	$(this).removeClass("on");
	$(".feed").each(function (i) {
		if ($(this).hasClass("on")) {
		} else {
			cnt += 1;
		}
	});
	if (cnt == $(".feed").length) {
		bool = true;
	}
	if (bool) {
		$(".feed_btn").removeClass("on");
		$(".feed_btn").attr('checked', false);
	}
})
//수량 증감 버튼
$(document).on('click', '.count_btn > button', function (e) {
	e.stopImmediatePropagation();

	var $count = $(this).parent('.count_btn').find('#count');
	var now = parseInt($count.val());
	var min = 0;
	var max = 9999;
	var num = now;

	if (isNaN(num)) {
		num = 0;
	}

	if ($(this).hasClass('minus')) {
		var type = 'm';
	} else if ($(this).hasClass('plus')) {
		var type = 'p';
	}
	var cnt = 0;
	bool = false;
	if (type == 'm') {
		if (now > min) {
			num = now - 1;
		}
		if (num == 0) {
			$(this).closest().closest(".stay_form").addClass("on");
			$(".stay_form").each(function (i) {
				if ($(this).hasClass("on")) {
				} else {
					cnt += 1;
				}
			});
			if (cnt == $(".stay_form").length) {
				bool = true;
			}
			if (bool) {
				$(".choice_stay1").css("background", "rgb(238, 239, 240)")
			}
		}
	} else if (type == 'p') {
		if (now < max) {
			num = now + 1;
			$(".choice_stay1").css("background", "rgb(199, 233, 232)")

		}
	}
	if (num != now) {
		$count.val(num);
	}
});

$(document).on('click', '.protect', function () {
	$('#protect').show();
})
$(document).on('click', '.refusal', function () {
	$('#refusal').show();
})