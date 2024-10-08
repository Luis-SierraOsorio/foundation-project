// imports
const express = require("express");
const ticketController = require("../controllers/ticketController");
const { validateTicketsBodyParams } = require("../middleware/validateTicketsBodyParams");
const { validateJWTAccess } = require("../middleware/validateJWTAccess");

// creating instance of Router class
const router = express.Router();

// submit new ticket route, uses middleware to check body params and to validate JWT
router.post("/submit", validateTicketsBodyParams, validateJWTAccess, ticketController.submitTicket);

// query ticket by status route, middleware to check JWT, Expects URI params
router.get("", validateJWTAccess, ticketController.getTicketsByStatus);

// ticket history route, middleware to check JWT
router.get("/history", validateJWTAccess, ticketController.getTicketsByEmployeeId);

// update ticket route, middleware to check JWT, expects body params
router.patch("/:ticketId", validateJWTAccess, ticketController.updateTicketStatus);

module.exports = router;