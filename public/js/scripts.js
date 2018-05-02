window.onload = () => {
  generatePalette();
}

$('.generate-button').on('click', generatePalette);
$('.colors').on('click', toggleLock);
$('.save-project').on('click', prependProject);
$('.save-palette').on('click', prependPalette);
$('.projects').on('click', '.delete-palette', deletePalette);

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

function prependProject() {
  const project = $('#project-input').val();
  $(".projects").prepend(`
    <article>
      <h2>${project}</h2>
      <div class=${project}></div>
    </article>
  `);
  $('#select-project').prepend(`
    <option value=${project}>${project}</option>
  `)
  $('#project-input').val('');
}

function prependPalette() {
  const paletteName = $('.palette-input').val();
  const projectName = $('#select-project').val();
  const colors = $.map($('span'), element => $(element).text());

  const paletteColors = colors.map(color => {
    return (`
      <div class="project-colors"
        style="background-color:${color}">
      </div>
    `)
  })

  $(`.${projectName}`).prepend(`
    <article>
      <p>${paletteName}</p>
      ${paletteColors.join('')}
      <img class="delete-palette" 
        src="../images/waste-bin.svg" 
        alt="trash can"/>
    </article>
  `)
  $('.palette-input').val('');
}

function deletePalette(event) {
  event.target.closest('article').remove();
}

