let magicCard = document.getElementsByClassName("card");



Array.from(magicCard).forEach(function(element){
  fetch(`https://api.scryfall.com/cards/random`)
  .then(res=>res.json())
  .then(response =>{
    element.src = response.image_uris.normal
  })
})

let videos = ["video/magic.mp4", "video/magic2.mp4", "video/magic3.mp4", "video/magic4.mp4"]

let videoM = document.getElementById("magicVid");

function randomVideo(){
  let num = Math.random();
  console.log(num);
  if(num <= 0.25){
    videoM.setAttribute("src", videos[0]);
  }else if(num > 0.25 && num < 0.5){
    videoM.setAttribute("src", videos[1]);
  }else if(num > 0.5 && num < 0.75){
    videoM.setAttribute("src", videos[2]);
  }else{
    videoM.setAttribute("src", videos[3]);
  }
}randomVideo();
