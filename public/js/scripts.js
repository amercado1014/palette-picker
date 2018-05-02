window.onload = () => {
  generatePalette();
}

$('.generate-button').on('click', generatePalette);
$('.colors').on('click', toggleLock);
$('.save-project').on('click', saveProject)

function getRandomColors() {
  const colorsArray = [];
  for (let i = 0; i < 5; i++) {
    let letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (let j = 0; j < 6; j++) {
      color += letters[Math.round(Math.random() * 15)];
    }
    colorsArray.push(color);
  }
 
  return colorsArray;
}

function generatePalette() {
  const colorsArray = getRandomColors();
  colorsArray.map((color, index) => {
    if (!$(`.color${index}`).hasClass('lock')) {
      $(`.color${index}`).css('background-color', color);
      $(`.color${index}`).children('span').text(color); 
    }
  });
}

function toggleLock() {
  $(this).find('img').toggle();
  $(this).toggleClass('lock');
}

function saveProject() {
  const project = $('#project-input').val();
  $('#project-input').val('');
}