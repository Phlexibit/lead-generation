const { 
    getSiteVisits
} = require('./controller');
const express = require('express')
const router = express.Router()

// site visits list
router.route('/site-visits').get(getSiteVisits)

module.exports = router 