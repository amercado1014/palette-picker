const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(projects => response.status(200).json(projects))
    .catch(error => response.status(500).json(error))
});

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then(palettes => response.status(200).json(palettes))
    .catch(error => response.status(500).json(error))
});

app.get('/api/v1/palettes/:id', (request, response) => {
  database('palettes').where('id', request.params.id)
    .then(palette => {
      if (palette.length) {
        response.status(200).json(palette);
      } else {
        response.status(404).json({
          error: `Could not find palette with id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for (let requiredParameter of ['project_name']) {
    if (!project[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { project_name: <String> }. You're missing a ${requiredParameter} property.`});
    }
  }

  database('projects').insert(project, 'id')
    .then(project=> response.status(201).json({ id: project[0]}))
    .catch(error => response.status(500).json({ error }));
});

app.post('/api/v1/palettes', (request, response) => {
    const palette = request.body;

  for (let requiredParameter of ['palette_name', 'project_id', 'colors_array']) {
    if (!palette[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `You're missing a ${requiredParameter} property.`});
    }
  }

  database('palettes').insert(palette, 'id')
    .then(palette => response.status(201).json({ id: palette[0]}))
    .catch(error => response.status(500).json({ error }));
});

app.delete('/api/v1/palettes', (request, response) => {
  const id = request.body.id

  if (!id) {
    return response
      .status(422)
      .send({ error: `You're missing an id property.` });
  }

  database('palettes').where('id', id).del()
    .then(palette => response.status(200).json({ message: `Deleted palette with id ${request.body.id}`}))
    .catch(error => response.status(500).json({ error }))
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;


