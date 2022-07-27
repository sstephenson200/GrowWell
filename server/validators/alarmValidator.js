//Check if entered date is in future
function checkDateInFuture(date) {
    if (Date.parse(date) >= Date.now()) {
        return true;
    }
}

//Check if input is a Date
function checkValidDate(date) {
    if (Date.parse(date)) {
        return true;
    }
}

module.exports = {
    checkDateInFuture,
    checkValidDate
}