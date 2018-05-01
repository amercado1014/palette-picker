window.onload = () => {
  generatePalette();
}

$('.generate-button').on('click', generatePalette);

function getRandomColors() {
  const colorsArray = [];
  for (let i = 0; i < 5; i++) {
    let letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (let j = 0; j < 6; j++) {
      color += letters[Math.round(Math.random() * 15)];
    }
    colorsArray.push({ color, locked: false });
  }
 
  return colorsArray;
}

function generatePalette() {
  const colorsArray = getRandomColors();
  colorsArray.map((colorObj, index) => {
    $(`.color${index}`).css('background-color', colorObj.color);
    $(`.color${index}`).children('span').text(colorObj.color);
  });
}