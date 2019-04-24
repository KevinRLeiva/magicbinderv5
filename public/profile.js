let magicCard = document.getElementsByClassName("card");
var currentIndex = 0;
var maxCards = 0;
var foundCards = [];

Array.from(magicCard).forEach(function(element){
  fetch(`https://api.scryfall.com/cards/random`)
  .then(res=>res.json())
  .then(response =>{
    element.src = response.image_uris.normal
  })
})

// document.getElementById("alotCard").addEventListener("click", function(e){
//   e.preventDefault();
//   fetch(`https://api.scryfall.com/cards/random`)
//   .then(res=>res.json())
//   .then(response =>{
//     let ranCard = document.getElementsByClassName("card");
//     ranCard.src = response.image_uris.normal
// })

  document.getElementById("cardSearch").addEventListener("click", function(e){
    e.preventDefault();
    currentIndex = 0;
    var cardName = document.getElementById("nameCard").value;
    fetch(`https://api.magicthegathering.io/v1/cards?name=${cardName}`)
    .then(res=>res.json())
    .then(response =>{
      let searchCard = document.getElementById("magic");
      searchCard.src = response.cards[0].imageUrl
      console.log(response);
      maxCards = response.cards.length;
      document.getElementById("maxCardCount").innerHTML = maxCards;
      foundCards =  response.cards;
      console.log(response.cards.length)
    })
  });

function cardMinus(){
  if(currentIndex === 0){
    return
  }
  currentIndex -= 1;
  document.getElementById("current").innerHTML= currentIndex;
  updatePhoto();
}

function cardPlus(max){
  if(currentIndex === max){
    return
  }
  currentIndex += 1;
    document.getElementById("current").innerHTML= currentIndex;
    updatePhoto();
}

function updatePhoto(){
  document.getElementById("magic").src = foundCards[currentIndex].imageUrl;
}

document.getElementById("cardPlus").addEventListener("click", function(){
  cardPlus(maxCards);
});

document.getElementById("cardMinus").addEventListener("click", function(){
  cardMinus()
});

  document.getElementById("saveCard").addEventListener("click", function(){
    var mgt = document.getElementById("magic").src;
    console.log(foundCards[0].colors[0]);
    //console.log(mgt);
    fetch("magic", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "url": mgt,
        "colors": foundCards[0].colors[0]
      })
    })
  });
