$('.generate-button').on('click', generatePalette);
generatePalette();

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
  console.log(colorsArray)
  return colorsArray;
}

function generatePalette() {
  const colorsArray = getRandomColors();
  colorsArray.map((color, index) => {
    $(`.color${index}`).css('background-color',`${color}`)
  });
}