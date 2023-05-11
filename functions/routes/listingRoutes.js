const express = require('express');
const router = express.Router();
const Listing = require('../controllers/listingController')

router.route('/').get(Listing.getAllListings);

router.route('/:id').get(Listing.getListing);

router.route('/').post(Listing.createListing);

router.route('/:id').delete(Listing.deleteListing);

router.route('/:id').patch(Listing.updateListing);

router.route('/search/:searchTerm').get(Listing.searchListings);

router.route('/user/:id').get(Listing.getUserListings);

router.route('/MyListings/:id').get(Listing.getUserListings);

router.route('/similar/:id/:category').get(Listing.getSimilarListings);






module.exports = router;