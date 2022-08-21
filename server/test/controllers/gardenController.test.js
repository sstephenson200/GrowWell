const { createGarden, getAllGardens, getGardenByID, deleteGarden, updatePlotPlant, updatePlotHistory } = require('../../controllers/gardenController');

jest.mock("../../repositories/gardenRepository");
jest.mock("../../repositories/noteRepository");
jest.mock("../../repositories/alarmRepository");

describe("Garden Controller", () => {

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
        send: function (data) { }
    }

    describe("Create Garden Request", () => {

        it("successfully creates garden when valid information is given", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Garden created successfully.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    name: "nonExistingGardenTest",
                    length: 5,
                    width: 5
                }
            }

            await createGarden(request, response);
            let actualMessage = message.message;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when a non unique garden name is provided", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Garden name already in use.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    name: "existingGardenName",
                    length: 5,
                    width: 5
                }
            }

            await createGarden(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });
    });

    describe("Get All Gardens Request", () => {

        it("successfully gets all gardens", async () => {

            let expectedStatus = 200;
            let expectedGardenLength = 3;
            let expectedGarden1 = "Test1";
            let expectedGarden2 = "Test2";
            let expectedGarden3 = "Test3";


            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de"
            }

            await getAllGardens(request, response);
            let actualGardenLength = message.gardens.length;
            let actualGarden1 = message.gardens[0].name;
            let actualGarden2 = message.gardens[1].name;
            let actualGarden3 = message.gardens[2].name;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualGardenLength).toEqual(expectedGardenLength);
            expect(actualGarden1).toEqual(expectedGarden1);
            expect(actualGarden2).toEqual(expectedGarden2);
            expect(actualGarden3).toEqual(expectedGarden3);
        });
    });

    describe("Get Garden By ID Request", () => {

        it("successfully gets garden when valid garden_id is provided", async () => {

            let expectedStatus = 200;
            let expectedGarden = "SingleGarden";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    garden_id: "63011b289163a66dd9b721f9"
                }
            }

            await getGardenByID(request, response);
            let actualGarden = message.garden.name;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualGarden).toEqual(expectedGarden);
        });

        it("produces an error message when invalid garden_id is provided", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Invalid garden ID.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    garden_id: "invalidID"
                }
            }

            await getGardenByID(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });
    });

    describe("Delete Garden Request", () => {

        it("successfully deletes the garden when a valid garden_id is provided", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Garden deleted successfully.";
            let expectedAlarm = "Test1";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    garden_id: "63011b289163a66dd9b721f9",
                    password: "password"
                }
            }

            await deleteGarden(request, response);
            let actualMessage = message.message;
            let actualAlarm = message.alarms.title;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
            expect(actualAlarm).toEqual(expectedAlarm);
        });

        it("produces an error message when invalid garden_id is provided", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Invalid garden ID.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    garden_id: "invalidID",
                    password: "password"
                }
            }

            await deleteGarden(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when invalid password is provided", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Invalid credentials.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    garden_id: "63011b289163a66dd9b721f9",
                    password: "invalidPassword"
                }
            }

            await deleteGarden(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });
    });

    describe("Update Plot Plant Request", () => {

        it("successfully adds plant to plot when valid parameters are provided", async () => {
            let expectedStatus = 200;
            let expectedMessage = "Plot plant updated successfully.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    garden_id: "63011b289163a66dd9b721f9",
                    plot_number: 1,
                    plant_id: "6300178836b78ff7aea6c721"
                }
            }

            await updatePlotPlant(request, response);
            let actualMessage = message.message;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("successfully removes plant from plot when valid parameters are provided", async () => {
            let expectedStatus = 200;
            let expectedMessage = "Plot plant updated successfully.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    garden_id: "63011b289163a66dd9b721f9",
                    plot_number: 1
                }
            }

            await updatePlotPlant(request, response);
            let actualMessage = message.message;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when invalid garden_id is provided", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Invalid garden ID.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    garden_id: "invalidID",
                    plot_number: 1
                }
            }

            await updatePlotPlant(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when invalid plant_id is provided", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Invalid plant ID.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    garden_id: "63011b289163a66dd9b721f9",
                    plot_number: 1,
                    plant_id: "invalidID"
                }
            }

            await updatePlotPlant(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when an invalid plot_number is provided", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Invalid plot number.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    garden_id: "63011b289163a66dd9b721f9",
                    plot_number: 30
                }
            }

            await updatePlotPlant(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });
    });

    describe("Update Plot History Request", () => {

        it("successfully adds plant to plot history when valid parameters are provided", async () => {
            let expectedStatus = 200;
            let expectedMessage = "Plot history updated successfully.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    garden_id: "63011b289163a66dd9b721f9",
                    plot_number: 1,
                    plant_id: "6300178836b78ff7aea6c721",
                    date_planted: "2022-05-03"
                }
            }

            await updatePlotHistory(request, response);
            let actualMessage = message.message;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when invalid garden_id is provided", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Invalid garden ID.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    garden_id: "invalidID",
                    plot_number: 1,
                    plant_id: "6300178836b78ff7aea6c721",
                    date_planted: "2022-05-03"
                }
            }

            await updatePlotHistory(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when invalid plant_id is provided", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Invalid plant ID.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    garden_id: "63011b289163a66dd9b721f9",
                    plot_number: 1,
                    plant_id: "invalidID",
                    date_planted: "2022-05-03"
                }
            }

            await updatePlotHistory(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when an invalid plot_number is provided", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Invalid plot number.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    garden_id: "63011b289163a66dd9b721f9",
                    plot_number: 30,
                    plant_id: "6300178836b78ff7aea6c721",
                    date_planted: "2022-05-03"
                }
            }

            await updatePlotHistory(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when an invalid date is provided", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Invalid date planted.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    garden_id: "63011b289163a66dd9b721f9",
                    plot_number: 1,
                    plant_id: "6300178836b78ff7aea6c721",
                    date_planted: "invalidDate"
                }
            }

            await updatePlotHistory(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });
    });
});