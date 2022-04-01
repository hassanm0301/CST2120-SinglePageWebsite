$(document).ready(() => {
    $("#criteriaForm").submit((event) => {
      event.preventDefault();
      var formData = {
        sorting: $("#sorting").val(),
        search: $("#search").val(),
      };
  
      $.ajax({
        type: "POST",
        url: "http://localhost:42069/search",
        data: formData,
        dataType: "json",
        encode: true,
      }).done((data) => {
        console.log(data);
      });
    });
});