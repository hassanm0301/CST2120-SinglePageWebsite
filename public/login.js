function checkLogin(){
	$.get("http://localhost:42069/checkLogin", (res, status) => {
		if(res.loggedin == true){
			// hide login box
			console.log("the user is logged in")
		}
		else{
			console.log("the user is not logged in")
		}
	});
}


// sends login information to server
$(document).ready(function () {
    $("#loginForm").submit(function (event) {
      event.preventDefault();
      var formData = {
        email: $("#emailLogin").val(),
        password: $("#passwordLogin").val(),
      };
  
      $.ajax({
        type: "POST",
        url: "http://localhost:42069/login",
        data: formData,
        dataType: "json",
        encode: true,
      }).done(function (data) {
        console.log(data);
		checkLogin();
      });
    });
  });
