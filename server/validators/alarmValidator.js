//Check if entered date is in future
function checkDateInFuture(date) {
    if (Date.parse(date) >= Date.now()) {
        return true;
    }
}

module.exports = {
    checkDateInFuture,
}