const mongoose = require('mongoose');
const cities=require('./cities');
const {places,descriptors}=require('./seedhelpers')
const Campground = require('../models/campground');
require('dotenv').config();


mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to the database');
});

const sample=array => array[Math.floor(Math.random()*array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});

    for (let i=0;i<50;i++){
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp=new Campground({
            author:'68d3f4b1653b0002f3e6cf81',
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            // image: `https://picsum.photos/800/600?random=${i}`,
            description:'Exploring nature in unfamiliar locations also promotes mindfulness and a stronger connection to the environment. Observing untouched landscapes,local wildlife, and the rhythms of natural life encourages respect for conservation and sustainable living.'
        })
        images:[{
          url:'https://jnfjhvnjv dkmvnvhdvdv',
          filename:'duplicate yelpcamp/ k njvnvndvvvvdvn'

        }]
        await camp.save();
    }
};
 
seedDB().then(() => {
  console.log('Seeding complete');
  mongoose.connection.close();
});
