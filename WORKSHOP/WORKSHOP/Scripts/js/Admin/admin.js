// 파일 리스트 번호
var fileIndex = 0;
// 등록할 전체 파일 사이즈
var totalFileSize = 0;
// 파일 리스트
var fileList = new Array();
// 파일 사이즈 리스트
var fileSizeList = new Array();
// 등록 가능한 파일 사이즈 MB
var uploadSize = 50;
// 등록 가능한 총 파일 사이즈 MB
var maxUploadSize = 500;
var layoutGRP_CD = "";
var layoutGRP_KIND = "";
var layoutSearchGRP_CD = "";
var layoutGRPGRD = "";
var layoutITEMTYPE = "";
var layoutobjJsonData = new Object();
var alert_index = 0;
$(function () {
    // 파일 드롭 다운
    fileDropDown();

    var layoutGrpData = "";
    var layoutSearchGrp = "";
    layoutGRP_CD = $("#layoutGRP_CD").dxSelectBox({
        width: 150,
        displayExpr: "COMM_NM",
        valueExpr: "COMM_CD",
        acceptCustomValue: true,
    }).dxSelectBox('instance');


    layoutSearchGRP_CD = $("#layoutSearchGRP_CD").dxSelectBox({
        width: 150,
        displayExpr: "COMM_NM",
        valueExpr: "COMM_CD",
        acceptCustomValue: true,
    }).dxSelectBox('instance');

    layoutobjJsonData.GRP_CD = "A1";

    $.ajax({
        type: "POST",
        url: "/Admin/fnGetGrpInfo",
        async: false,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(layoutobjJsonData) },
        success: function (result) {
            //데이터바인딩
            layoutGrpData = JSON.parse(result).GRP_INFO;
            layoutGRP_CD.option('dataSource', layoutGrpData);
            layoutSearchGrp = JSON.parse(result).GRP_INFO;
            layoutSearchGrp.unshift({ "COMM_CD": "ALL", "COMM_NM": "전체" });
            layoutSearchGRP_CD.option('dataSource', layoutSearchGrp);
            //Data Binding
            
        }, error: function (xhr, status, error) {
            console.log("에러");
            console.log(error);
        }
    });

    layoutGRP_KIND = $("#layoutGRP_KIND").dxSelectBox({
        width: 150,
        displayExpr: "COMM_NM",
        valueExpr: "COMM_CD",
    }).dxSelectBox('instance');

    layoutSearchGRP_KIND = $("#layoutSearchGRP_KIND").dxSelectBox({
        width: 150,
        displayExpr: "COMM_NM",
        valueExpr: "COMM_NM",
        acceptCustomValue: true,
    }).dxSelectBox('instance');


    layoutobjJsonData.GRP_CD = "A2";

    $.ajax({
        type: "POST",
        url: "/Admin/fnGetGrpInfo",
        async: false,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(layoutobjJsonData) },
        success: function (result) {
            //데이터바인딩
            layoutGrpData = JSON.parse(result).GRP_INFO;
            layoutGRP_KIND.option('dataSource', layoutGrpData);
            layoutSearchGrp = JSON.parse(result).GRP_INFO;
            layoutSearchGrp.unshift({ "COMM_CD": "ALL", "COMM_NM": "전체" });
            layoutSearchGRP_KIND.option('dataSource', layoutSearchGrp);
            //Data Binding
            
        }, error: function (xhr, status, error) {
            console.log("에러");
            console.log(error);
        }
    });

    layoutITEMTYPE = $("#layoutITEMTYPE").dxSelectBox({
        width: 150,
        displayExpr: "COMM_NM",
        valueExpr: "COMM_CD",
        acceptCustomValue: true,
    }).dxSelectBox('instance');

    layoutSearchITEMTYPE = $("#layoutSearchITEMTYPE").dxSelectBox({
        width: 150,
        displayExpr: "COMM_NM",
        valueExpr: "COMM_CD",
        acceptCustomValue: true,
    }).dxSelectBox('instance');

    layoutobjJsonData.GRP_CD = "A3";

    $.ajax({
        type: "POST",
        url: "/Admin/fnGetGrpInfo",
        async: false,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(layoutobjJsonData) },
        success: function (result) {
            //데이터바인딩
            layoutGrpData = JSON.parse(result).GRP_INFO;
            layoutITEMTYPE.option('dataSource', layoutGrpData);
            layoutSearchGrp = JSON.parse(result).GRP_INFO;
            layoutSearchGrp.unshift({ "COMM_CD": "ALL", "COMM_NM": "전체" });
            layoutSearchITEMTYPE.option('dataSource', layoutSearchGrp);
        }, error: function (xhr, status, error) {
            console.log("에러");
            console.log(error);
        }
    });

    layoutGRPGRD = $("#layoutGRPGRD").dxSelectBox({
        width: 150,
        displayExpr: "COMM_NM",
        valueExpr: "COMM_CD",
        acceptCustomValue: true,
    }).dxSelectBox('instance');

    layoutSearchGRPGRD = $("#layoutSearchGRPGRD").dxSelectBox({
        width: 150,
        displayExpr: "COMM_NM",
        valueExpr: "COMM_CD",
        acceptCustomValue: true,
    }).dxSelectBox('instance');

    layoutobjJsonData.GRP_CD = "A4";

    $.ajax({
        type: "POST",
        url: "/Admin/fnGetGrpInfo",
        async: false,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(layoutobjJsonData) },
        success: function (result) {
            //데이터바인딩
            layoutGrpData = JSON.parse(result).GRP_INFO;
            layoutGRPGRD.option('dataSource', layoutGrpData);
            layoutSearchGrp = JSON.parse(result).GRP_INFO;
            layoutSearchGrp.unshift({ "COMM_CD": "ALL", "COMM_NM": "전체" });
            layoutSearchGRPGRD.option('dataSource', layoutSearchGrp);

        }, error: function (xhr, status, error) {
            console.log("에러");
            console.log(error);
        }
    });

    var faqObj = new Object();
    faqObj.STATUS = "A";


    //$.ajax({
    //    type: "POST",
    //    url: "/adFAQ/fnGetFAQList",
    //    async: true,
    //    dataType: "json",
    //    data: { "vJsonData": _fnMakeJson(faqObj) },
    //    success: function (result) {
    //        var resultData = JSON.parse(result).Table1;
    //        $("#FaqCnt").text(_fnToZero(resultData[0].TOTCNT));

    //    },
    //    error: function (xhr, status, error) {
    //        console.log("메인 조회 에러,,.");
    //        console.log(error);
    //    }
    //});

});

// 파일 드롭 다운
function fileDropDown() {
    var dropZone = $("#dropZone");
    //Drag기능 
    dropZone.on('dragenter', function (e) {
        e.stopPropagation();
        e.preventDefault();
        // 드롭다운 영역 css
        dropZone.css('background-color', '#E3F2FC');
    });
    dropZone.on('dragleave', function (e) {
        e.stopPropagation();
        e.preventDefault();
        // 드롭다운 영역 css
        dropZone.css('background-color', '#FFFFFF');
    });
    dropZone.on('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
        // 드롭다운 영역 css
        dropZone.css('background-color', '#E3F2FC');
    });
    dropZone.on('drop', function (e) {
        e.preventDefault();
        // 드롭다운 영역 css
        dropZone.css('background-color', '#FFFFFF');

        var files = e.originalEvent.dataTransfer.files;
        if (files != null) {
            if (files.length < 1) {
                /* alert("폴더 업로드 불가"); */
                console.log("폴더 업로드 불가");
                return;
            } else {
                selectFile(files)
            }
        } else {
            alert("ERROR");
        }
    });
}

// 파일 선택시
function selectFile(fileObject) {
    var files = null;

    if (fileObject != null) {
        // 파일 Drag 이용하여 등록시
        files = fileObject;
    } else {
        // 직접 파일 등록시
        files = $('#multipaartFileList_' + fileIndex)[0].files;
    }

    // 다중파일 등록
    if (files != null) {

        if (files != null && files.length > 0) {
            $("#fileDragDesc").hide();
            $("fileListTable").show();
        } else {
            $("#fileDragDesc").show();
            $("fileListTable").hide();
        }

        for (var i = 0; i < files.length; i++) {
            // 파일 이름
            var fileName = files[i].name;
            var fileNameArr = fileName.split("\.");
            // 확장자
            var ext = fileNameArr[fileNameArr.length - 1];

            var fileSize = files[i].size; // 파일 사이즈(단위 :byte)
            console.log("fileSize=" + fileSize);
            if (fileSize <= 0) {
                console.log("0kb file return");
                return;
            }

            var fileSizeKb = fileSize / 1024; // 파일 사이즈(단위 :kb)
            var fileSizeMb = fileSizeKb / 1024;    // 파일 사이즈(단위 :Mb)

            var fileSizeStr = "";
            if ((1024 * 1024) <= fileSize) {    // 파일 용량이 1메가 이상인 경우 
                console.log("fileSizeMb=" + fileSizeMb.toFixed(2));
                fileSizeStr = fileSizeMb.toFixed(2) + " Mb";
            } else if ((1024) <= fileSize) {
                console.log("fileSizeKb=" + parseInt(fileSizeKb));
                fileSizeStr = parseInt(fileSizeKb) + " kb";
            } else {
                console.log("fileSize=" + parseInt(fileSize));
                fileSizeStr = parseInt(fileSize) + " byte";
            }

            /* if ($.inArray(ext, [ 'exe', 'bat', 'sh', 'java', 'jsp', 'html', 'js', 'css', 'xml' ]) >= 0) {
                // 확장자 체크
                alert("등록 불가 확장자");
                break; */
            if ($.inArray(ext, ['hwp', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'png', 'pdf', 'jpg', 'jpeg', 'gif', 'zip']) <= 0) {
                // 확장자 체크
                /* alert("등록이 불가능한 파일 입니다.");
                break; */
                alert("등록이 불가능한 파일 입니다.(" + fileName + ")");
                $("#fileDragDesc").show();
                $("fileListTable").hide();
            } else if (fileSizeMb > uploadSize) {
                // 파일 사이즈 체크
                alert("용량 초과\n업로드 가능 용량 : " + uploadSize + " MB");
                $("#fileDragDesc").show();
                $("fileListTable").hide();

                break;
            } else {
                // 전체 파일 사이즈
                totalFileSize += fileSizeMb;

                // 파일 배열에 넣기
                fileList[fileIndex] = files[i];

                // 파일 사이즈 배열에 넣기
                fileSizeList[fileIndex] = fileSizeMb;

                // 업로드 파일 목록 생성
                addFileList(fileIndex, fileName, fileSizeStr);

                // 파일 번호 증가
                fileIndex++;
            }
        }
    } else {
        alert("ERROR");
    }
}

// 업로드 파일 목록 생성
function addFileList(fIndex, fileName, fileSizeStr) {
    /* if (fileSize.match("^0")) {
        alert("start 0");
    } */

    var html = "";
    html += "<tr id='fileTr_" + fIndex + "'>";
    html += "    <td id='dropZone' class='left' >";
    html += fileName + " (" + fileSizeStr + ") "
        //+ "<a href='#' onclick='deleteFile(" + fIndex + "); return false;' class='btn small bg_02'> 삭제</a>"

        + "<input class='file_delete' value='삭제' type='button' href='#' onclick='deleteFile(" + fIndex + "); return false;'>"
    html += "    </td>"
    html += "</tr>"

    $('#fileTableTbody').append(html);
}

// 업로드 파일 삭제
function deleteFile(fIndex) {
    console.log("deleteFile.fIndex=" + fIndex);
    // 전체 파일 사이즈 수정
    totalFileSize -= fileSizeList[fIndex];

    // 파일 배열에서 삭제
    delete fileList[fIndex];

    // 파일 사이즈 배열 삭제
    delete fileSizeList[fIndex];

    // 업로드 파일 테이블 목록에서 삭제
    $("#fileTr_" + fIndex).remove();

    console.log("totalFileSize=" + totalFileSize);

    if (totalFileSize > 0) {
        $("#fileDragDesc").hide();
        $("fileListTable").show();
    } else {
        $("#fileDragDesc").show();
        $("fileListTable").hide();
    }
}

// 파일 등록
function uploadFile() {
    // 등록할 파일 리스트
    var uploadFileList = Object.keys(fileList);

    // 파일이 있는지 체크
    if (uploadFileList.length == 0) {
        // 파일등록 경고창
        alert("파일이 없습니다.");
        return;
    }

    // 용량을 500MB를 넘을 경우 업로드 불가
    if (totalFileSize > maxUploadSize) {
        // 파일 사이즈 초과 경고창
        alert("총 용량 초과\n총 업로드 가능 용량 : " + maxUploadSize + " MB");
        return;
    }

    if (confirm("등록 하시겠습니까?")) {
        // 등록할 파일 리스트를 formData로 데이터 입력
        var form = $('#uploadForm');
        var formData = new FormData(form);
        for (var i = 0; i < uploadFileList.length; i++) {
            formData.append('files', fileList[uploadFileList[i]]);
        }

        $.ajax({
            url: "업로드 경로",
            data: formData,
            type: 'POST',
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            dataType: 'json',
            cache: false,
            success: function (result) {
                if (result.data.length > 0) {
                    alert("성공");
                    location.reload();
                } else {
                    alert("실패");
                    location.reload();
                }
            }
        });
    }
}

function _fnMakeJson(data) {
    if (data != undefined) {
        var str = JSON.stringify(data);
        if (str.indexOf("[") == -1) {
            str = "[" + str + "]";
        }
        return str;
    }
}


function _fnToNull(data) {
    // undifined나 null을 null string으로 변환하는 함수. 
    if (String(data) == 'undefined' || String(data) == 'null') {
        return ''
    } else {
        return data
    }
}

//Null 값 0으로
function _fnToZero(data) {
    // undifined나 null을 null string으로 변환하는 함수. 
    if (String(data) == 'undefined' || String(data) == 'null' || String(data) == '' || String(data) == 'NaN') {
        return '0'
    } else {
        return data
    }
}
var ExcelToJSON = function () {

    this.parseExcel = function (file) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });

            workbook.SheetNames.forEach(function (sheetName) {
                // Here is your object
                var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                console.log(XL_row_object);
                var json_object = JSON.stringify(XL_row_object);

                jQuery('#xlx_json').val(json_object);

            })

        };

        reader.onerror = function (ex) {
            console.log(ex);
        };

        reader.readAsBinaryString(file);
    };
};

function hiddenGridRow(ctrl) {

    $(ctrl).parent().children().empty();
    $(ctrl).parent().children().css({ 'border': '0' });     //<td
    $(ctrl).parent().children().css({ 'border-color': 'transparent' });
    $(ctrl).parent().children().css({ 'visibility': 'hidden' });    // 체크박스를 위해서 추가함
    $(ctrl).parent().children().css({ 'padding': '0' });
    $(ctrl).parent().css({ 'line-height': '0px' }); //<tr    


}

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

function _fnSequenceMngt(prefix) {
    var mngt = prefix + _fnNow();
    return mngt;

}