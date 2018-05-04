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

  if (!projectName) {
    $('.project-error').show();  
  }

  if (!projectExist && projectName) {
    const project = { project_name: projectName };
    const postedProject = await postProject(project);
    $('.project-error').hide();
    $('.projects').prepend(`
      <article class='project'>
        <h2 class=${projectName} data-id=${postedProject.id}>${projectName}</h2>
        <div class=${postedProject.id}></div>
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
  const colors = $.map($('span'), element => $(element).text());

  const paletteData = {
    palette_name: paletteName,
    project_id: projectId,
    colors_array: colors
  }

  if (projectName === 'default' || !paletteName ) {
    $('.palette-error').show();
  }

  if (projectName !== 'default' && paletteName) {
  const postedPalette = await postPalette(paletteData);
  $('.palette-error').hide();

  const paletteColors = colors.map(color => {
    return (`
      <div class="palette-colors"
        style="background-color:${color}">
      </div>
    `)
  })

  $(`.${projectId}`).prepend(`
    <article data-id=${postedPalette.id}>
      <p class="palette-name">${paletteName}</p>
      ${paletteColors.join('')}
      <img class="delete-palette" 
        src="../images/waste-bin.svg" 
        alt="trash can"/>
    </article>
  `)
  $('.palette-input').val('');
  }
}

function deletePalette(event) {
  event.target.closest('article').remove();
  const id = { id: $(this).parent().data('id') };
  deletePaletteFromDb(id);
}

async function setMainPaletteColors() {
  const id = $(this).parent().data('id');
  const palette = await getPaletteById(id);
  
  palette[0].colors_array.map((color, index) => {
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
      <article class="project">
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

async function getPaletteById(id) {
  const url = `/api/v1/palettes/${id}`;

  try {
    const response = await fetch(url);
    const palette = await response.json();
    return palette
  } catch (error) {
    console.log(error);
  }
}

async function postProject(projectName) {
  const url = '/api/v1/projects';

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(projectName),
      headers: { 'Content-Type': 'application/json' }
    });
    const projectId = await response.json();
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
    const paletteId = await response.json();
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
    const status = await response.json();
  } catch (error) {
    console.log(error);
  }
}