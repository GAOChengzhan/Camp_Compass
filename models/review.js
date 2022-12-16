const { number } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    rating: Number,
    body: String,
});

module.exports = mongoose.model('Review', ReviewSchema);