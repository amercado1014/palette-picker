const express = require('express'); // requires Express from node_modules
const app = express(); // sets up Express application
const bodyParser = require('body-parser'); // requires Body Parser from node_modules
const environment = process.env.NODE_ENV || "development"; // sets environment
const configuration = require("./knexfile")[environment]; // sets the correct configuration with environment
const database = require("knex")(configuration); // sets database with configuration given

app.use(bodyParser.json()); // middleware that parses incoming bodies before handlers
app.use(bodyParser.urlencoded({ extended: true })); // middleware that parses incoming bodies before handlers
app.use(express.static('public')); // defines path to static assets

app.set('port', process.env.PORT || 3000); // lets heroku set port or defaults to localhost 3000
app.locals.title = 'Palette Picker'; // set variable title to Palette Picker

app.get('/api/v1/projects', (request, response) => { // get projects 
  database('projects').select() // select all projects
    .then(projects => response.status(200).json(projects)) // send response status and projects
    .catch(error => response.status(500).json(error)) // send error 
});

app.get('/api/v1/palettes', (request, response) => { // get palettes
  database('palettes').select() // select all palettes
    .then(palettes => response.status(200).json(palettes)) // send response status and palettes
    .catch(error => response.status(500).json(error)) // send error
});

app.get('/api/v1/palettes/:id', (request, response) => { // get palette by id
  database('palettes').where('id', request.params.id) // select palette with requested id
    .then(palette => {
      if (palette.length) { // if the palette exists
        response.status(200).json(palette); // send response status and palette
      } else {
        response.status(404).json({ // if palette doesn't exist send status and error message
          error: `Could not find palette with id ${request.params.id}` 
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error }); // send error
    });
});

app.post('/api/v1/projects', (request, response) => { // post project
  const project = request.body; // assign the request body to project

  for (let requiredParameter of ['project_name']) { // set project_name as a required parameter
    if (!project[requiredParameter]) { // if missing required parameter
      return response // send response with error stating missing required parameter
        .status(422) 
        .send({ error: `Expected format: { project_name: <String> }. You're missing a ${requiredParameter} property.`});
    }
  }

  database('projects').insert(project, 'id') // insert project into table
    .then(project=> response.status(201).json({ id: project[0]})) // send response status and newly inserted project id
    .catch(error => response.status(500).json({ error })); // send error
});

app.post('/api/v1/palettes', (request, response) => { // post palette
    const palette = request.body; // assign the request body to palette

  for (let requiredParameter of ['palette_name', 'project_id', 'colors_array']) { // set required parameters
    if (!palette[requiredParameter]) { // if missing required parameter
      return response // send response with error stating missing required parameter
        .status(422)
        .send({
          error: `You're missing a ${requiredParameter} property.`
        });
    }
  }

  database('palettes').insert(palette, 'id') // insert palette into table
    .then(palette => response.status(201).json({ id: palette[0]})) // send response status and newly inserted palette id 
    .catch(error => response.status(500).json({ error })); // send error
});

app.delete('/api/v1/palettes', (request, response) => { // delete palette 
  const id = request.body.id // assign request body id to id

  if (!id) { // if missing id
    return response // send response status and error 
      .status(422)
      .send({ error: `You're missing an id property.` });
  }

  database('palettes').where('id', id).del() // delete palette from table
    .then(palette => response.status(200).json({ message: `Deleted palette with id ${request.body.id}`})) // send status and message with deleted palette id
    .catch(error => response.status(500).json({ error })) // send error
});

app.listen(app.get('port'), () => { // listen for port set at the top 
  console.log(`${app.locals.title} is running on ${app.get('port')}.`); // console log when title and port 
});

module.exports = app; // export app for testing


