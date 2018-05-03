exports.seed = function(knex, Promise) {
  return knex('palettes').del() 
    .then(() => knex('projects').del())
    .then(() => {
      return Promise.all([
        knex('projects').insert({
          project_name: 'Project 1'
        }, 'id')
        .then(project => {
          return knex('palettes').insert([
            { 
              palette_name: 'Palette 1',
              project_id: project[0],
              colors_array: ['#877B98','#A5570B','#A225F7', '#3984EC1', '#880625']
            },
            {
              palette_name: 'Palette 2',
              project_id: project[0],
              colors_array: ['#E1931B','#1D4755','#CDEA45', '#658A94', '#2AC995']
            }
          ])
        })
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ]) 
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
