const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generator = require("generate-password");

const { createUser, login, checkLoggedIn, logout, getUser, deleteUser, updateEmail, updatePassword, resetPassword } = require('../../controllers/userController');

jest.mock("../../repositories/userRepository");
jest.mock("../../repositories/gardenRepository");
jest.mock("../../repositories/noteRepository");
jest.mock("../../repositories/alarmRepository");

jest.mock("bcrypt");
jest.mock("generate-password");

describe("User Controller", () => {

    let message;
    let actualStatus;

    let response = {
        json: function (data) {
            message = data;
        },
        status: function (responseStatus) {
            actualStatus = responseStatus;
            return this;
        },
        cookie: function (data) {
            cookie = data;
            return this;
        },
        send: function (data) {
            sendMessage = data;
        }
    }

    describe("Create User Request", () => {

        it("successfully creates user when valid information is given", async () => {

            process.env.JWT_SECRET = "testSecret";

            jest.spyOn(bcrypt, 'genSalt').mockImplementation(() => {
                return "a1b2c3d"
            });

            jest.spyOn(bcrypt, 'hash').mockImplementation(() => {
                return "hashedPassword"
            });

            let expectedMessage = "User created successfully.";

            let request = {
                body: {
                    email: "nonExisting@email.com",
                    password: "password",
                    passwordVerify: "password"
                }
            }

            await createUser(request, response);
            let actualMessage = sendMessage.message;
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when provided passwords don't match", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Entered passwords must match.";

            let request = {
                body: {
                    email: "nonExisting@email.com",
                    password: "password",
                    passwordVerify: "password1"
                }
            }

            await createUser(request, response);
            let actualMessage = message.errorMessage;
            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when an account already exists for provided email", async () => {

            let expectedStatus = 200;
            let expectedMessage = "An account already exists for this email.";

            let request = {
                body: {
                    email: "existing@email.com",
                    password: "password",
                    passwordVerify: "password"
                }
            }

            await createUser(request, response);
            let actualMessage = message.errorMessage;
            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });
    });

    describe("Login Request", () => {

        it("successfully logins the user into their account when valid information is given", async () => {

            process.env.JWT_SECRET = "testSecret";

            let expectedMessage = "User created successfully.";

            let request = {
                body: {
                    email: "existing@email.com",
                    password: "password"
                }
            }

            await login(request, response);
            let actualMessage = sendMessage.message;
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when an account doesn't exist for provided email", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Invalid credentials.";

            let request = {
                body: {
                    email: "nonExisting@email.com",
                    password: "password"
                }
            }

            await login(request, response);
            let actualMessage = message.errorMessage;
            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when an invalid password is provided", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Invalid credentials.";

            let request = {
                body: {
                    email: "existing@email.com",
                    password: "invalidPassword"
                }
            }

            await login(request, response);
            let actualMessage = message.errorMessage;
            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });
    });

    describe("Check Logged In Request", () => {

        it("returns true when a valid token is provided", async () => {

            process.env.JWT_SECRET = "testSecret";

            const token = jwt.sign({
                user: "62fffa28c2fc2e3c8cbaa5de"
            }, process.env.JWT_SECRET);

            let expectedMessage = true;

            let request = {
                cookies: {
                    token: token
                }
            }

            await checkLoggedIn(request, response);
            let actualMessage = sendMessage;
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("returns false when no token is provided", async () => {

            let expectedMessage = false;

            let request = {
                cookies: {}
            }

            await checkLoggedIn(request, response);
            let actualMessage = message;
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("returns false when an invalid token is provided", async () => {

            process.env.JWT_SECRET = "testSecret";

            let expectedMessage = false;

            let request = {
                cookies: {
                    token: "invalidToken"
                }
            }

            await checkLoggedIn(request, response);
            let actualMessage = message;
            expect(actualMessage).toEqual(expectedMessage);
        });
    });

    describe("Logout Request", () => {

        it("successfully clears JWT and logs out user from account", async () => {

            let expectedMessage = "User logged out successfully.";

            let request = {}

            await logout(request, response);
            let actualMessage = sendMessage.message;
            expect(actualMessage).toEqual(expectedMessage);
        });
    });

    describe("Get User Request", () => {

        it("successfully returns user when valid user_id is provided", async () => {

            let expectedStatus = 200;
            let expectedUser = "email";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de"
            }

            await getUser(request, response);
            let actualUser = message.user.email;
            expect(actualStatus).toEqual(expectedStatus);
            expect(actualUser).toEqual(expectedUser);
        });
    });

    describe("Delete User Request", () => {

        it("successfully returns user when valid user_id is provided", async () => {

            jest.spyOn(bcrypt, 'compare').mockImplementation(() => {
                return true;
            });

            let expectedStatus = 200;
            let expectedMessage = "User deleted successfully.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    password: "password"
                }
            }

            await deleteUser(request, response);
            let actualMessage = message.message;
            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when an invalid password is provided", async () => {

            jest.spyOn(bcrypt, 'compare').mockImplementation(() => {
                return false;
            });

            let expectedStatus = 200;
            let expectedMessage = "Invalid credentials.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    password: "invalidPassword"
                }
            }

            await deleteUser(request, response);
            let actualMessage = message.errorMessage;
            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });
    });

    describe("Update Email Request", () => {

        it("successfully updates user email when valid information is provided", async () => {

            jest.spyOn(bcrypt, 'compare').mockImplementation(() => {
                return true;
            });

            let expectedStatus = 200;
            let expectedMessage = "Email updated successfully.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    email: "nonExisting@email.com",
                    password: "password"
                }
            }

            await updateEmail(request, response);
            let actualMessage = message.message;
            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when an invalid password is provided", async () => {

            jest.spyOn(bcrypt, 'compare').mockImplementation(() => {
                return false;
            });

            let expectedStatus = 200;
            let expectedMessage = "Invalid credentials.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    email: "nonExisting@email.com",
                    password: "invalidPassword"
                }
            }

            await updateEmail(request, response);
            let actualMessage = message.errorMessage;
            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when an account already exists for provided email", async () => {

            jest.spyOn(bcrypt, 'compare').mockImplementation(() => {
                return true;
            });

            let expectedStatus = 200;
            let expectedMessage = "An account already exists for this email.";

            let request = {
                body: {
                    email: "existing@email.com",
                    password: "password"
                }
            }

            await updateEmail(request, response);
            let actualMessage = message.errorMessage;
            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });
    });

    describe("Update Password Request", () => {

        it("successfully updates user password when valid information is provided", async () => {

            jest.spyOn(bcrypt, 'compare').mockImplementation(() => {
                return true;
            });

            let expectedStatus = 200;
            let expectedMessage = "Password updated successfully.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    newPassword: "passwordUpdate",
                    newPasswordVerify: "passwordUpdate",
                    oldPassword: "password"
                }
            }

            await updatePassword(request, response);
            let actualMessage = message.message;
            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when an invalid password is provided", async () => {

            jest.spyOn(bcrypt, 'compare').mockImplementation(() => {
                return false;
            });

            let expectedStatus = 200;
            let expectedMessage = "Invalid credentials.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    newPassword: "passwordUpdate",
                    newPasswordVerify: "passwordUpdate",
                    oldPassword: "invalidPassword"
                }
            }

            await updatePassword(request, response);
            let actualMessage = message.errorMessage;
            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when provided new passwords don't match", async () => {

            jest.spyOn(bcrypt, 'compare').mockImplementation(() => {
                return true;
            });

            let expectedStatus = 200;
            let expectedMessage = "Entered passwords must match.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    newPassword: "passwordUpdate",
                    newPasswordVerify: "passwordUpdate1",
                    oldPassword: "invalidPassword"
                }
            }

            await updatePassword(request, response);
            let actualMessage = message.errorMessage;
            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });
    });

    describe("Reset Password Request", () => {

        it("successfully updates user password when valid information is provided", async () => {

            jest.spyOn(bcrypt, 'genSalt').mockImplementation(() => {
                return "a1b2c3d"
            });

            jest.spyOn(bcrypt, 'hash').mockImplementation(() => {
                return "hashedPassword"
            });

            jest.spyOn(generator, 'generate').mockImplementation(() => {
                return "generatedPassword"
            });

            let expectedStatus = 200;
            let expectedMessage = "Password updated successfully.";

            let request = {
                body: {
                    email: "existing@email.com"
                }
            }

            await resetPassword(request, response);
            let actualMessage = message.message;
            expect(actualMessage).toEqual(expectedMessage);
            expect(actualStatus).toEqual(expectedStatus);
        });

        it("produces an error message when an account doesn't exist for provided email", async () => {

            let expectedStatus = 200;
            let expectedMessage = "No account exists for this email.";

            let request = {
                body: {
                    email: "nonExisting@email.com",
                }
            }

            await resetPassword(request, response);
            let actualMessage = message.errorMessage;
            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

    });
});