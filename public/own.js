let trash = document.getElementsByClassName("trash");
let cardColors = document.getElementsByClassName("cardColor");

Array.from(trash).forEach(function(element) {
      element.addEventListener("click", function(){
        let objectId = this.getAttribute("data-delete");
        console.log("data: ", objectId)
        fetch("magic", {
          method: "delete",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "allan": objectId
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});

document.getElementById("cardSearch").addEventListener("click", function(e){
  e.preventDefault();
  var cardName = document.getElementById("nameCard").value;
  fetch(`https://api.magicthegathering.io/v1/cards?name=${cardName}`)
  .then(res=>res.json())
  .then(response =>{
    let searchCard = document.getElementById("magic");
    searchCard.src = response.cards[0].imageUrl
    console.log(response);
  })
});
