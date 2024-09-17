// imports
const express = require("express");

// creating instance of Router class
const router = express.Router();

// route to submit a new ticket, expects amount and description in the body
router.post("/submit", submitTicket);

// route to get tickets based on a given status in the url param
router.get("/staus/:status", getTicketsWithStatus);

// route to handle seeing an employee's ticket history, will get employee_id with jwt-tokens
router.get("/:employee_id", getTicketsByEmployee);

// route to handle the changing of a ticket status
router.patch("/:ticket_id/status", updateTicketStatus);

module.exports = router;