$(document).on("change","#file", function(e){
	e.preventDefault();
	file_up();
	$('#file').val('');
});

$(document).on("change","#catalog", function(e){
	e.preventDefault();
	doc_up();
	$('#catalog').val('');
});

function file_up() {
	$('#img_loding').html('업로드중 입니다.');
	$.ajaxFileUpload({
		type:'POST',		
		secureuri:false,
		fileElementId:'file',
		url: "<?=RT_PATHS?>/fileupload/boardAjaxFile2",
		dataType: 'json',
		success:function(data){
			$('#img_loding').html('');
			
			if($('#img_temp').val()){
				var $img_value = $('#img_temp').val();
				$('#img_temp').val($img_value + ',' + data.temp_no);
			}else{
				$('#img_temp').val(data.temp_no);
			}
			

			var $img = '<div class="up_image_list" data-no="'+data.temp_no+'">'
				+'	<img src="'+data.img['imageurl']+'" class="img-rounded">'
				+ '<p><a href="#" type="button" class="btn  btn-default btn-xs _file_old_del"><i class="fa fa-times"></i></a> '+ data.img['filename'] +'</p>'
				+'</div>';
			
			$('#img_file_view').append($img);
			
		}		
	});	
}

function doc_up() {
	$len = $(".up_image_list").size();
	$('#doc_loding').text('업로드중 입니다.');
		
	$.ajaxFileUpload({
		type:'POST',		
		secureuri:false,
		fileElementId:'catalog',
		url: "<?=RT_PATHS?>/fileupload/docFile",
		dataType: 'json',
		success:function(data){
			$('#doc_loding').text('');
			
			if($('#doc_temp').val()){
				var $doc_value = $('#doc_temp').val();
				$('#doc_temp').val($doc_value + ',' + data.temp_no);
			}else{
				$('#doc_temp').val(data.temp_no);
			}
			
		
		var $doc = '<div class="doc_list" data-no="'+data.temp_no+'">'			
				+ '<i class="fa fa-file-o"></i> '+ data.img['filename'] +'&nbsp;&nbsp;<a href="#" type="button" class="btn  btn-default btn-xs _doc_old_del"><i class="fa fa-times"></i></a>'
				+'</div>';
			
			$('#catalog_view').append($doc);
			
		}		
	});	
}



$('._file_del').ajaxUpfileDel('._file_del','#img_temp','data-no','.up_image_list');
$('._file_old_del').ajaxUpfileDel('._file_old_del','#img_old','data-no','.up_image_list');


$('._doc_del').ajaxUpfileDel('._doc_del','#doc_temp','data-no','.doc_list');
$('._doc_old_del').ajaxUpfileDel('._doc_old_del','#doc_old','data-no','.doc_list');