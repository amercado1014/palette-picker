window.onload = () => {
  generatePalette();
  getProjects();
  getPalettes();
}

$('.generate-button').on('click', generatePalette);
$('.colors').on('click', toggleLock);
$('.save-project').on('click', prependProject);
$('.save-palette').on('click', prependPalette);
$('.projects').on('click', '.delete-palette', deletePalette);
$('.projects').on('click', '.palette-colors', setMainPaletteColors);
$('.projects').on('click', '.palette-name', setMainPaletteColors);

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

async function prependProject() {
  const projectName = $('#project-input').val();
  const projectsArray = $.map($('h2'), element => $(element).text());
  const projectExist = projectsArray.find(project => project === projectName)

  if (!projectExist) {
    const project = { project_name: projectName };
    const projectId = await postProject(project);
    $(".projects").prepend(`
      <article>
        <h2 class=${projectName} data-id=${projectId.id}>${projectName}</h2>
        <div class=${projectId.id}></div>
      </article>
    `);
    $('#select-project').prepend(`
      <option value=${projectName}>${projectName}</option>
    `)
  }
  $('#project-input').val('');
}

async function prependPalette() {
  const paletteName = $('.palette-input').val();
  const projectName = $('#select-project').val();
  const projectId = $(`.${projectName}`).data('id');
  console.log({projectId})
  const colors = $.map($('span'), element => $(element).text());

  const paletteData = {
    palette_name: paletteName,
    project_id: projectId,
    colors_array: colors
  }

  const paletteId = await postPalette(paletteData);
  console.log({paletteId})

  const paletteColors = colors.map(color => {
    return (`
      <div class="palette-colors"
        style="background-color:${color}">
        <p class="color-text">${color}</p>
      </div>
    `)
  })

  $(`.${projectId}`).prepend(`
    <article data-id=${paletteId.id}>
      <p class="palette-name">${paletteName}</p>
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
  const id = { id: $(this).parent().data('id') };
  deletePaletteFromDb(id);
}

function setMainPaletteColors() {
  const paletteColors = $.map($('.color-text'), element => $(element).text());
  
  paletteColors.map((color, index) => {
    $(`.color${index}`).css('background-color', color);
    $(`.color${index}`).children('span').text(color);
  })
}

async function getProjects() {
  const url = '/api/v1/projects';

  try {
    const response = await fetch(url);
    const projects = await response.json();
    prependProjectsFromDb(projects);
  } catch (error) {
    console.log(error);
  }
}

function prependProjectsFromDb(projects) {
  projects.forEach(project => {
    const { project_name , id } = project;
    $('.projects').prepend(`
      <article>
        <h2 class=${project_name} data-id=${id}>${project_name}</h2>
        <div class=${id}></div>
      </article>
    `);
    $('#select-project').prepend(`
      <option value=${project_name}>${project_name}</option>
    `);
  });
}

async function getPalettes() {
  const url = '/api/v1/palettes';

  try {
    const response = await fetch(url);
    const palettes = await response.json();
    prependPalettesFromDb(palettes);
  } catch (error) {
    console.log(error);
  }
}

function prependPalettesFromDb(palettes) {
  palettes.forEach(palette => {
    const { colors_array, id, palette_name, project_id } = palette;

    const paletteColors = colors_array.map(color => {
      return (`
        <div class="palette-colors"
          style="background-color:${color}">
          <p class="color-text">${color}</p>
        </div>
      `)
    });

    $(`.${project_id}`).prepend(`
    <article data-id=${id}>
      <p class="palette-name">${palette_name}</p>
      ${paletteColors.join('')}
      <img class="delete-palette" 
        src="../images/waste-bin.svg" 
        alt="trash can"/>
    </article>
  `);
  })
}

async function postProject(projectName) {
  const url = '/api/v1/projects';

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(projectName),
      headers: { 'Content-Type': 'application/json' }
    });
    const projectId = response.json();
    return projectId; 
  } catch (error) {
    console.log(error);
  }
}

async function postPalette(paletteData) {
  const url = "/api/v1/palettes";

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(paletteData),
      headers: { 'Content-Type': 'application/json' }
    });
    const paletteId = response.json();
    return paletteId
  } catch (error) {
    console.log(error);
  }
}

async function deletePaletteFromDb(paletteId) {
  const url = "/api/v1/palettes";

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      body: JSON.stringify(paletteId),
      headers: { 'Content-Type': 'application/json' }
    });
    const status = response.json();
    console.log(status)
  } catch (error) {
    console.log(error);
  }
}