'use strict';
const next = document.getElementById('next');
let slides = document.getElementsByClassName("slides");
let index = 1;

showslides(index);

function seuraava(n) {
  showslides(index += n);
}

function showslides(n) {
  // jatka kuvien näyttäminen alusta, jos kuvat loppuvat kesken
  if (n > slides.length) {
    index = 1
  }
  if (n < 1) {
    index = slides.length
  }
  // käy läpi kuvien divit
  for (let i = 0; i < slides.length; i++) {
    // anna kaikille kuva diveille displayksi none
    slides[i].style.display = "none";
  }
  // näytä tietyssä indeksissä oleva kuva muuttamalla sen display blockiksi
  slides[index-1].style.display = "block";
}
// lisää nappulaan funktio, joka näyttää kuvia
next.addEventListener('click', function() {
  seuraava(1);
});