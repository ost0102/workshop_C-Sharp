var chkCnt = false;
var chkLoading = false;
//window.onload = function () {
//    kakao.maps.load(function () {
//        map = new kakao.maps.Map(document.getElementById("map"), {
//            center: new kakao.maps.LatLng(37.566826, 126.978656), // 초기 지도 중심 좌표 설정
//            level: 3, // 초기 줌 레벨 설정
//        });
//    });
//};

function clearMap() {
    var svg = document.getElementById("koreaMap");
    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }
}

//지도 그리기
function drawMap(target, type) {
    var width = 850; //지도의 넓이
    var height = 10; //지도의 높이
    var initialScale = 8000; //확대시킬 값
    var initialX = -17500; //초기 위치값 x
    var initialY = 5900; //초기 위치값 y
    var labels;

    var projection = d3.geo
        .mercator()
        .scale(initialScale)
        .translate([initialX, initialY]);
    var path = d3.geo.path().projection(projection);
    var zoom = d3.behavior
        .zoom()
        .translate(projection.translate())
        .scale(projection.scale())
        .scaleExtent([height, 1000 * height])
    /*.on('zoom', zoom);*/

    var svg = d3
        .select(target)
        .append('svg')
        .attr('width', width + 'px')
        .attr('height', height + 'px')
        .attr('id', 'map')
        .attr('class', 'map')        
        $("#map")[0].setAttribute('viewBox', '0 0 650 990') //svg 반응형
        

    var states = svg
        .append('g')
        .attr('id', 'states')
        .call(zoom)
        .attr('width', width + 'px')
        .attr('height', height + 'px');
    //states
    //    .append('a')
    //    .attr('id', function (d) {
    //        return 'path-1';
    //    })
    states
        .append('rect')
        .attr('class', 'background')

    //geoJson데이터를 파싱하여 지도그리기
    d3.json('/Content/API/korea.json', function (json) {
        states
            .selectAll('path') //지역 설정
            .data(json.features)
            .enter()
            .append('a')
            .attr('id', 'ss')
            .append('path')
            .attr('d', path);
        labels = states
            .selectAll('text')
            .data(json.features) //라벨표시
            .enter()
            .append('text')
            .attr('transform', translateTolabel)
            .attr('id', function (d) {
                return 'label-' + d.properties.name_eng;
            })
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .text(function (d) {
                return d.properties.name;
            });
        CntRegion(type);
    });

   
    
    
    // 핀안에 텍스트위치
    function CntRegion(type) {
       console.log("pin")
       var objJsonData = new Object();
        objJsonData.ITEM_TYPE = $("#select_itemTpye option:selected").val();
        objJsonData.AREA = $("#select_area option:selected").val();
        objJsonData.MAX_TO = _fnToNull($("#MAX_TO")).val();
        objJsonData.KEYWORD = _fnToNull($("#Keyword")).val();
        objJsonData.TYPE = type;

        $.ajax({
            type: "POST",
            url: "/Home/fnCntRegion",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (result.Result[0]["trxCode"] == "Y") {
                    CntImg(result, type)
                } else {
                    //alert("실패");
                }
            },
            beforeSend: function () {
                $("#ProgressBar_Loading").show(); //프로그래스바
            },
            complete: function () {
                $("#ProgressBar_Loading").hide(); //프로그래스바
            },
            error: function (xhr, error) {
                console.log("[Error - CntRegion()]" + error.meessage);
            }
        });
    }
    $(document).on('click', '.pin, text', function () {
        $("#login_time_area").hide();
    })
    function CntImg(vJsonData, type) {
        
        vResult = vJsonData.Cnt_Table;
        if (type == "ROAD") {
            $.each(vResult, function (i) {
                var textCNT = _fnToNull(vResult[i]["CNT"]);
                var AreaCD = vResult[i]["AREA"];
                states.append("image")
                    .attr("xlink:href", "/Images/ico03.png")
                    .attr("x", vResult[i]["IMG_X"])
                    .attr("y", vResult[i]["IMG_Y"])
                    .attr('class', 'pin')
                    .on(
                        "touchstart", function () {
                            TextClickSearch(AreaCD, type);
                        }
                    )
                    .on(
                        "click", function () {
                            TextClickSearch(AreaCD, type);
                        }
                    )
                
                    if (textCNT.length < 2) {
                        states.append("text")
                            .text(vResult[i]["CNT"])
                            .attr("x", vResult[i]["X"] + 5)
                            .attr("y", vResult[i]["Y"])
                            .on({
                                "touchstart": function () {
                                    TextClickSearch(AreaCD, type);
                                }
                            })
                            .on({
                                "click": function () {
                                    TextClickSearch(AreaCD, type);
                                }
                            })
                    } else if (textCNT.length > 2) {
                        states.append("text")
                            .text(vResult[i]["CNT"])
                            .attr("x", vResult[i]["X"] - 6)
                            .attr("y", vResult[i]["Y"])
                            .on({
                                "touchstart": function () {
                                    TextClickSearch(AreaCD, type);
                                }
                            })
                            .on({
                                "click": function () {
                                    TextClickSearch(AreaCD, type);
                                }
                            })
                    } else {
                        states.append("text")
                            .text(vResult[i]["CNT"])
                            .attr("x", vResult[i]["X"])
                            .attr("y", vResult[i]["Y"])
                            .on({
                                "touchstart": function () {
                                    TextClickSearch(AreaCD, type);
                                }
                            })
                            .on({
                                "click": function () {
                                    TextClickSearch(AreaCD, type);
                                }
                            })
                    }
                
                


            });

        } else if (type == "COMMENT") {
            $.each(vResult, function (i) {
                var textCNT = _fnToNull(vResult[i]["CNT"]);
                var AreaCD = vResult[i]["AREA"];
                states.append("image")
                    .attr("xlink:href", "/Images/ico01.png")
                    .attr("x", vResult[i]["IMG_X"])
                    .attr("y", vResult[i]["IMG_Y"])
                    .attr('class', 'pin')
                    .on(
                        "touchstart", function () {
                            TextClickSearch(AreaCD, type);
                        }
                    )
                    .on(
                        "click", function () {
                            TextClickSearch(AreaCD, type);
                        }
                    )

                if (textCNT.length < 2) {
                    states.append("text")
                        .text(vResult[i]["CNT"])
                        .attr("x", vResult[i]["X"] + 5)
                        .attr("y", vResult[i]["Y"])
                        .on({
                            "touchstart": function () {
                                TextClickSearch(AreaCD, type);
                            }
                        })
                        .on({
                            "click": function () {
                                TextClickSearch(AreaCD, type);
                            }
                        })
                } else if (textCNT.length > 2) {
                    states.append("text")
                        .text(vResult[i]["CNT"])
                        .attr("x", vResult[i]["X"] - 6)
                        .attr("y", vResult[i]["Y"])
                        .on({
                            "touchstart": function () {
                                TextClickSearch(AreaCD, type);
                            }
                        })
                        .on({
                            "click": function () {
                                TextClickSearch(AreaCD, type);
                            }
                        })
                } else {
                    states.append("text")
                        .text(vResult[i]["CNT"])
                        .attr("x", vResult[i]["X"])
                        .attr("y", vResult[i]["Y"])
                        .on({
                            "touchstart": function () {
                                TextClickSearch(AreaCD, type);
                            }
                        })
                        .on({
                            "click": function () {
                                TextClickSearch(AreaCD, type);
                            }
                        })
                }
            });

        }
    }


    //텍스트 위치 조절 - 하드코딩으로 위치 조절을 했습니다.
    function translateTolabel(d) {
        var arr = path.centroid(d);
        if (d.properties.code == 31) {
            //서울 경기도 이름 겹쳐서 경기도 내리기
            arr[1] +=
                d3.event && d3.event.scale
                    ? d3.event.scale / height + 20
                    : initialScale / height - 750;
        }
        //else if (d.properties.code == 34) {
        //    //충남은 조금 더 내리기
        //    arr[1] +=
        //        d3.event && d3.event.scale
        //            ? d3.event.scale / height + 10
        //            : initialScale / height + 10;
        //}
        return 'translate(' + arr + ')';
    }

    function zoom() {
        projection.translate(d3.event.translate).scale(d3.event.scale);
        states.selectAll('path').attr('d', path);
        labels.attr('transform', translateTolabel);
    }
};

function TextClickSearch(result, type) {
    window.location.href = '#result_map';
    
    try {
        var objJsonData = new Object();

        objJsonData.AREA = result;
        objJsonData.ITEM_TYPE = $("#select_itemTpye option:selected").val();
        objJsonData.MAX_TO = _fnToNull($("#MAX_TO")).val();
        objJsonData.KEYWORD = _fnToNull($("#Keyword")).val();
        objJsonData.TYPE = type;
        objJsonData.PAGE = 1;
        $.ajax({
            type: "POST",
            url: "/Home/TextClickSearch",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (result.Result[0]["trxCode"] == "Y") {
                    if (type == "ROAD") {
                        $("#recommend_area").empty();
                        fnMakeRoadList(result, type);
                    } else if (type == "SEARCH") {
                        $("#location_area").empty();
                        fnMakeSechList(result, type);
                    } else {
                        $("#time_area").empty();
                       fnMakeCommentList(result)
                    }
                } else if (result.Result[0]["trxCode"] == "N") {
                    _fnAlertMsg("검색값이 없습니다.")
                    console.log("[Fail - TextClickSearch()]" + result.Result[0]["trxCode"]);
                } else if (result.Result[0]["trxCode"] == "E") {
                    _fnAlertMsg("담당자에게 문의해주세요.")
                    console.log("[Fail - TextClickSearch()]" + result.Result[0]["trxCode"]);
                }
            }
        })
    } catch (err) {
        console.log("[Error - TextClickSearch()]" + err.meessage);
    }
}


//function SetMainMap(result) {
//    try {
//        var southWest = L.latLng(33.0, 124.0); // 대한민국 남서쪽 좌표
//        var northEast = L.latLng(38.5, 132.0); // 대한민국 북동쪽 좌표
//        var bounds = L.latLngBounds(southWest, northEast);

//        var map = L.map('map', {
//            zoomDelta: 0.25,
//            zoomSnap: 0,
//            center: [36.5, 127.5],
//            zoom: 7,
//            //minZoom: 7,
//           // maxBounds: bounds
//        }).setView([36.5, 127.5], 7);

//        var positron = L.tileLayer('http://mt0.google.com/vt/lyrs=m&hl=kr&x={x}&y={y}&z={z}', {
//            attribution: 'Map data &copy; Copyright Google Maps<a target="_blank" href="https://maps.google.com/maps?ll=24.53279,56.62833&amp;z=13&amp;t=m&amp;hl=ko-KR&amp;gl=US&amp;mapclient=apiv3"></a>' //화면 오른쪽 하단 attributors
//        }).addTo(map);

//        var mcg = L.markerClusterGroup({
//            chunkedLoading: true,
//            //singleMarkerMode: true,
//            spiderfyOnMaxZoom: false
//        });

//        //for (var i = 0; i < addressPoints.length; i++) {
//           // var a = addressPoints[i];
//           // var title = a[2];
//        for (var i = 0; i < result.length; i++) {
//            var marker = L.marker(new L.LatLng(result[i].MAP_X, result[i].MAP_Y), { title: result[i].AREA });
//            marker.bindPopup(result[i].AREA);
//            mcg.addLayer(marker);
//        }
//        //}

//        map.addLayer(mcg);
//    }
//    catch (err) {
//        console.log("[Error - SetMainMap()]" + err.message);
//    }
//}


//function googleapisView() {
//    var address = encodeURIComponent('광주광역시 광산구 첨단내촌로 1');
//    var geocode = "http://maps.googleapis.com/maps/api/geocode/json?address=" + address;
//    jQuery.ajax({
//        url: geocode,
//        type: 'POST',
//        success: function (myJSONResult) {
//            if (myJSONResult.status == 'OK') {
//                var tag = "";
//                var i;
//                for (i = 0; i < myJSONResult.results.length; i++) {
//                    tag += "주소 : " + myJSONResult.results[i].formatted_address + " <br />";
//                    tag += "위도 : " + myJSONResult.results[i].geometry.location.lat + " <br />";
//                    tag += "경도 : " + myJSONResult.results[i].geometry.location.lng + " <br />";
//                }
//                document.getElementById("message").innerHTML = tag;
//            } else if (myJSONResult.status == 'ZERO_RESULTS') {
//                alert("지오코딩이 성공했지만 반환된 결과가 없음을 나타냅니다.\n\n이는 지오코딩이 존재하지 않는 address 또는 원격 지역의 latlng을 전달받는 경우 발생할 수 있습니다.")
//            } else if (myJSONResult.status == 'OVER_QUERY_LIMIT') {
//                alert("할당량이 초과되었습니다.");
//            } else if (myJSONResult.status == 'REQUEST_DENIED') {
//                alert("요청이 거부되었습니다.\n\n대부분의 경우 sensor 매개변수가 없기 때문입니다.");
//            } else if (myJSONResult.status == 'INVALID_REQUEST') {
//                alert("일반적으로 쿼리(address 또는 latlng)가 누락되었음을 나타냅니다.");
//            }
//        }, error: function (error) {
//            console.log(error);
//        }
//    });
//}
var marker;
var test;
var rtnCnt = "";

var map;
function SetMainMap(result) {

    kakao.maps.load(function () {
        var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
        var options = { //지도를 생성할 때 필요한 기본 옵션
            center: new kakao.maps.LatLng(37.56, 126.983), //지도의 중심좌표.
            level: 5 //지도의 레벨(확대, 축소 정도)
        };
        map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
    });
    var clusterer = new kakao.maps.MarkerClusterer({
        map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
        averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
        minLevel: 10 // 클러스터 할 최소 지도 레벨 ,
    });
  
    var markers = [];
    $(result).map(function (i, position) {

        marker =  new kakao.maps.Marker({
            position: new kakao.maps.LatLng(position.MAP_X, position.MAP_Y),
            clickable : true
        });
        marker.key = position.ITEM_CD;
        markers.push(marker);

        kakao.maps.event.addListener(markers[i], "click", function () {
            itemSearch(markers[i].key);
        });
    });
    if (result.length > 0) {
        if (_fnToNull(result[0].AREA) != "서울") {
            var moveLatLon = new kakao.maps.LatLng(result[0].MAP_X, result[0].MAP_Y);
            map.setCenter(moveLatLon);
        }
    }
    // 클러스터러에 마커들을 추가합니다
    clusterer.addMarkers(markers);

    kakao.maps.event.addListener(map, 'zoom_changed', function () {
        var level = map.getLevel();

        if (!chkCnt) {
            if (level == 9) {
                try {
                    var objJsonData = new Object();

                    objJsonData.AREA_TYPE = "ALL";
                    objJsonData.ITEM_TYPE = $("#select_itemTpye option:selected").val();
                    objJsonData.AREA = $("#select_area option:selected").val();
                    objJsonData.MAX_TO = _fnToNull($("#MAX_TO")).val();
                    objJsonData.KEYWORD = _fnToNull($("#Keyword")).val();
                    objJsonData.TYPE = "SEARCH";
                    objJsonData.PAGE = 1;

                    $.ajax({
                        type: "POST",
                        url: "/Home/fnGetSearchListCount",
                        async: true,
                        dataType: "json",
                        data: { "vJsonData": _fnMakeJson(objJsonData) },
                        success: function (result) {
                            if (result.Result[0]["trxCode"] == "Y") {
                                chkCnt = true;
                                rtnCnt = result.TOTAL;

                                clusterer.clear();
                                markers = [];
                                $(rtnCnt).map(function (i, position) {
                                    marker = new kakao.maps.Marker({
                                        position: new kakao.maps.LatLng(position.MAP_X, position.MAP_Y),
                                        clickable: true
                                    });
                                    marker.key = position.ITEM_CD;
                                    markers.push(marker);

                                    kakao.maps.event.addListener(markers[i], "click", function () {
                                        itemSearch(markers[i].key);
                                    });

                                    clusterer.addMarkers(markers);
                                    chkLoading = true;
                                });
                    
                            } else if (result.Result[0]["trxCode"] == "N") {
                                console.log("[Fail - fnGetSearchList()]" + result.Result[0]["trxCode"]);
                                //_fnAlertMsg("검색값이 없습니다.");
                            } else if (result.Result[0]["trxCode"] == "E") {
                                ``
                                console.log("[Fail - fnGetSearchList()]" + result.Result[0]["trxCode"]);
                            }
                        }, error: function (error) {
                            console.log(error);
                        }, beforeSend: function () {
                            $("#ProgressBar_Loading").show(); //프로그래스 바
                        },
                        complete: function () {
                            $("#ProgressBar_Loading").hide(); //프로그래스 바
                        }
                    });
                }
                catch (err) {
                    alert("srfef")
                    console.log("[Error - fnSearchList]" + err.message);
                }
            }
        }

        //if (chkCnt) {
        //    if (!chkLoading) { 
        //        if (level == 9) {
        //            if (_fnToNull(rtnCnt) != "") {
                       
        //            }
        //        }
        //    }

        //}
    });

}



function itemSearch(marker) {

    try {
        var objJsonData = new Object();

        objJsonData.ITEM_CD = marker;
        $.ajax({
            type: "POST",
            url: "/Home/fnGetSearchItemCode",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (result.Result[0]["trxCode"] == "Y") {
                    $("#location_area").empty();
                    fnMakeSechList(result, "KAKAO");
                } else if (result.Result[0]["trxCode"] == "N") {
                    _fnAlertMsg("검색값이 없습니다.")
                    console.log("[Fail - TextClickSearch()]" + result.Result[0]["trxCode"]);
                } else if (result.Result[0]["trxCode"] == "E") {
                    _fnAlertMsg("담당자에게 문의해주세요.")
                    console.log("[Fail - TextClickSearch()]" + result.Result[0]["trxCode"]);
                }
            }
        })
    } catch (err) {
        console.log("[Error - TextClickSearch()]" + err.meessage);
    }
}