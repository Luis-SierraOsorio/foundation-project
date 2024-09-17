// imports
const express = require("express");
const {
    submitTicket,
    getTicketByStatus,
    getTicketByEmployeeId,
    updateTicketStatus
} = require("../controllers/ticketController");

// creating instance of Router class
const router = express.Router();

// route to submit a new ticket, expects amount and description in the body
router.post("/submit", submitTicket);

// route to get tickets based on a given status in the url param
router.get("/staus/:status", getTicketByStatus);

// route to handle seeing an employee's ticket history, will get employee_id with jwt-tokens
router.get("/:employee_id", getTicketByEmployeeId);

// route to handle the changing of a ticket status
router.patch("/:ticket_id/status", updateTicketStatus);

module.exports = router;