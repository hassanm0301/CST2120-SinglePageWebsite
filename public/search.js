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
        data.forEach(element => {
            createGameBox(element)
        });
      });
    });
});

function createGameBox(gameData){
    let parentNode = $("#searchResults");
    let childNode = `
    <div id="game${gameData.game_id}">
        <h2>${gameData.Name}</h2>
        <div class="detailBox">
            <p>
                Number of reviews ${gameData.rating_number}<br>
                Rating ${gameData.ave_rating}<br>
                Description ${gameData.Description}<br>
            </p>
        </div>
        <img src="/img/down.png" alt="downArrow" onclick="displayReview('${gameData.game_id}')" height="50" width="50">
    </div>
    `;
    parentNode.append(childNode);
}