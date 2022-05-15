const seeder = require('mongoose-seed');
const axios = require('axios');
const config = require('../config/config');

const generateData = async () => {
  const documents = [];
  for (let power = 1; power <= 5; power += 1) {
    for (const element of ['water', 'fire', 'wood', 'earth']) {
      const response = await axios.get('https://picsum.photos/200');
      documents.push({
        image_url: response.request.res.responseUrl,
        name: `Lv. ${power} ${element}`,
        power,
        element,
        price: power,
      });
    }
  }

  return [
    {
      model: 'Card',
      documents,
    },
  ];
};

// Connect to MongoDB via Mongoose
seeder.connect(config.mongoose.url, () => {
  // Load Mongoose models
  seeder.loadModels(['src/models/card.model.js']);

  // Clear specified collections
  seeder.clearModels(['Card'], async () => {
    // Callback to populate DB once collections have been cleared
    seeder.populateModels(await generateData(), () => {
      seeder.disconnect();
    });
  });
});
