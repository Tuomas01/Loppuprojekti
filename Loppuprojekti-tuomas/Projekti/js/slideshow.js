'use strict';
const next = document.getElementById('next');
const prev = document.getElementById('previous');
const modaldiv = document.getElementById('modaldiv');
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

prev.addEventListener('click', function() {
  seuraava(-1);
});

for (let i = 0; i < slides.length; i++) {
  modaldiv.innerHTML += `<div class="modal" id="modal${i}" style="display: none">
                            <a id="x${i}" class="x">X</a>
                            <figure>
                            <img class="modalcontent" id="img${i}">
                            <figcaption class="caption">Kuva${i+1}</figcaption>
                            </figure>
                         </div>`
}
const modal = document.getElementsByClassName('modal');
const x = document.getElementsByClassName('x');
for (let i = 0; i < slides.length; i++) {
  slides[i].addEventListener('click', function() {
    if (modal[i].style.display === "none") {
      modal[i].style.display = "block";
    }
    x[i].addEventListener('click', function() {
      console.log('hei');
      if (modal[i].style.display === "block") {
        modal[i].style.display = "none";
      } else {
        modal[i].style.display = "none";
      }
    });
    const modalimg = document.getElementById(`img${i}`);
    modalimg.src = "kuvat/parkkipaikka" + i + ".jpg";
  });
}



