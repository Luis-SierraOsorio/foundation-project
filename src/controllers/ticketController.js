// importing service layer
const service = require("../services/ticketService");

function submitTicket(req, res) {
    console.log("Received POST request to submit ticket");
}

function getTicketByStatus(req, res) {
    console.log("Received GET request to see ticket by status");

}

function getTicketByEmployeeId(req, res) {
    console.log("Received GET request to see tickets by employee id");

}

function updateTicketStatus(req, res) {
    console.log("Received POST request to update ticket status");

}

module.exports = {
    submitTicket,
    getTicketByEmployeeId,
    getTicketByStatus,
    updateTicketStatus
};