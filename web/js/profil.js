$(document).ready(function(){

	var baseurl = $("input[name='baseurl']").val();
	var path_messages = $("input[name='path_messages']").val();
	var page_type = $("input[name='page_type']").val();
		
	$("#send_messages").on("click",function(){
		if($("#new_messages").val() == ""){
			alert("Un message vide ne peux être envoyé");
			return;
		}

		$.ajax({type:"POST", data: {userId :  $(this).attr("userid") ,body : $("#new_messages").val()}, url: baseurl + "messages_new",
			success: function(data){
				var dialog = bootbox.dialog({
					message: 'Votre message a bien été envoyé'
				});
				setTimeout(function(){ window.location.replace(path_messages); }, 1000);
			},
			error: function(data){
				console.log(data.responseText);
			}
		});
	})
	
	switch (page_type) {
	    case "own_profil_edit":
	        own_profil_edit();
	        break;
	    case "own_profil_view":
	    	$(".only_view").css("display", "inline");
	    	$(".only_view").css("visibility", "visible");
	    	break;
	    case "other_profil":
	    	$(".only_other_profil").css("display", "inline");
	    	$(".only_other_profil").css("visibility", "visible");
	        break;
	    case "unsigned":
	    	$(".only_unsigned").css("display", "inline");
	       	$(".only_unsigned").css("visibility", "visible");
	}

	function own_profil_edit() {
    	$(".only_edit").css("display", "inline");
        $(".only_edit").css("visibility", "visible");
    	$.fn.editable.defaults.mode = 'popup';
    	$.fn.editable.defaults.showbuttons = "bottom";
    	$.fn.editable.defaults.placement = "right";
    	$.fn.editable.defaults.ajaxOptions = {type: "POST"};
    	var finalURL = baseurl + 'profil/edit';
    	$('#userFirstName').editable({type: 'text', pk: 1, url: finalURL, title: 'Prénom', validate: requiered});
    	$('#userLastName').editable({type: 'text', pk: 1, url: finalURL, title: 'Nom', validate: requiered});
    	$('#userLocation').editable({type: 'text', pk: 1, url: finalURL, title: 'Localisation', validate: requiered});
    	$('#userEmail').editable({type: 'text', pk: 1, url: finalURL, title: 'Email', validate: requiered});
    	$('#userTarif').editable({type: 'text', pk: 1, url: finalURL, title: 'Tarif', validate: requiered});
    	$('#userStyles').editable({type: 'text', pk: 1, url: finalURL, title: 'Styles'});
    	$('#userPresentation').editable({type: 'textarea', pk: 1, url: finalURL, title: 'Présentation', inputclass: 'for_prez', rows: 7, mode: "inline", validate: requiered});
    	$('#userDisponibilite').editable({type: 'text', pk: 1, url: finalURL, title: 'Disponibilité', validate: requiered});
    	$('#changePlaylist').editable({type: 'text', pk: 1, url: finalURL, title: 'Lien de la playlist SoundClood', validate: requiered});
	}
	
	function requiered(value) {
		if ($.trim(value) == '') {
	        return 'Le champ est vide';
	    } 
		if (value.length > 250) {
		    return 'Le champ dépasse le nombre de caractères autorisé';	
	    }
	}
	
	$("#prez_edit").click(function(e){
//		var prez = prezTest = $.trim($('#presentation').val());
		var form = $("#style-form").serialize();
//		if (prezTest.length == 0){
//			return;
//		}
		$.ajax({type:"POST", data: {name : "style",value : form}, url: baseurl + "profil/edit",
			success: function(data){
				console.log(data.responseText);
				var dialog = bootbox.dialog({
					message: 'Vos informations ont bien été enregistré'
				});
				setTimeout(function(){
					dialog.modal('hide')
				}, 1500);
			},
			error: function(data){
				console.log(data.responseText);
			}
		});
//		return false;
	});

	$('#fileToUpload').change(function(){
		var file = this.files[0];
		var name = file.name;
		var size = file.size;
		var type = file.type;

		var reader = new FileReader();
		reader.onload = function (e) {
			$('#user_image').attr('src', e.target.result);
		}
		reader.readAsDataURL($('#fileToUpload')[0].files[0]);
		//Your validation
	});
	$("#formImgUpld").submit(function(event ){
		event.preventDefault();
		var formData = new FormData($('#formImgUpld')[0]);
		$.ajax({
			url: baseurl + 'profil/edit/picture',  //Server script to process data
			type: 'POST',
			dataType: 'json',
			//Ajax events
			success: function(data){
				if (data.success == "true"){
					var dialog = bootbox.dialog({
						message: 'Vos informations ont bien été enregistré'
					});
					setTimeout(function(){dialog.modal('hide')},1500);
				}
			},
			error: function(data){
				console.log(data.responseText);
			},
			// Form data
			data:new FormData(this),
			//Options to tell jQuery not to process data or worry about content-type.
			cache: false,
			contentType: false,
			processData: false
		});
	});

	$("#remove_user").click(function(e){
		bootbox.confirm("Etes vous sur de vouloir supprimer votre compte?", function(result) {
			if (result) {
				$.ajax({type:"POST", url: baseurl + "profil/remove",
					success: function(data){
						if (data.success == "true") {
							setTimeout(function() {
								window.location.href = baseurl;
							}, 1000);
						}
					}, error: function(data) {
						console.log(data.responseText);
					}
				});
				return false;
			} 
		});
	});
	
	$("#add_comment").click(function(e){
		var comment = $.trim($('#my_comment').val());
		if (comment.length == 0){
			return;
		}

		$.ajax({type:"POST", data: {
			content : comment,
			userpage : $("input[name='user_id']").val(),
			response : null
		}, url: baseurl + "profil/addcomment",
		success: function(data){
			var mes = "";
			if (data.success == "true") {
				mes = "Votre avis a bien été envoyé"

			}
			else 
				mes = "une erreur s'est produite";
			var dialog = bootbox.dialog({
				message: mes
			});
			setTimeout(function(){dialog.modal('hide')},1500);
			location.reload();
		},
		error: function(data){
			console.log(data.responseText);
		}
		});

	});

	/*
	var websocket = WS.connect("ws://127.0.0.1:1337");
	websocket.on("socket/connect", function(session){
		session.subscribe("acme/chat/dev_room/123", function(uri, payload){
			console.log("Received message", payload.msg);
		});

//		session.call("sample/sum", {"term1": 2, "term2": 5}).then(
//		function(result)
//		{
//		console.log("RPC Valid!", result);
//		},
//		function(error, desc)
//		{
//		console.log("RPC Error", error, desc);
//		}
//		);

		session.publish("acme/chat/dev_room/123", {msg: "This is a message!"});

		session.publish("acme/chat/dev_room/123", {msg: "I'm leaving, I will not see the next message"});

		session.unsubscribe("acme/chat/dev_room/123");

		session.publish("acme/chat/dev_room/123", {msg: "I won't see this"});

		session.subscribe("acme/chat/dev_room/123", function(uri, payload){
			console.log("Received message", payload.msg);
		});
		session.publish("acme/chat/dev_room/123", {msg: "I'm back!"});
	});

	websocket.on("socket/disconnect", function(error){
		//error provides us with some insight into the disconnection: error.reason and error.code

		console.log("Disconnected for " + error.reason + " with code " + error.code);
	});
	*/
})