const jwt = require("jsonwebtoken");

//Function to check validity of JWT
function auth(request, response, next) {

    try {
        let token = request.cookies.token;

        if (!token) {
            return response.status(200).json({ errorMessage: "Unauthorized" });
        }

        let verified = jwt.verify(token, process.env.JWT_SECRET);

        request.user = verified.user;

        next();

    } catch (error) {
        console.error(error);
        response.status(200).json({ errorMessage: "Unauthorized" });
    }
}

module.exports = auth;