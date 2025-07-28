const { 
    wsLead,
    getLeads
} = require('./controller');
const express = require('express')
const router = express.Router()

// member list public
router.route('/lead-ws').get(wsLead)
router.route('/leads').get(getLeads)

module.exports = router

