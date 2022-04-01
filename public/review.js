function displayReview(Game_ID){
    let postData = {Game_ID: Game_ID};
    $.ajax({
        type: "POST",
        url: "http://localhost:42069/displayReview",
        data: postData,
        dataType: "json",
        encode: true,
      }).done(function (data) {
        console.log(data);
      });
};

function postReview(textID, ratingID, Game_ID) {
    var formData = {
        content: $(textID).val(),
        rating: $(ratingID).val(),
        Game_ID: Game_ID
    };

    $.ajax({
      type: "POST",
      url: "http://localhost:42069/postReview",
      data: formData,
      dataType: "json",
      encode: true,
    }).done((data) => {
      if(data.status == "ok"){
        alert("Review posted successfully")
      }
      else{
        alert("Error when uploading review")
      }
    });
};