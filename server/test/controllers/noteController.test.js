const { getNotes, getNotesByPlot, getNotesByPlant, getNotesByMonth } = require('../../controllers/noteController');

jest.mock("../../repositories/noteRepository");
jest.mock("../../repositories/gardenRepository");

describe("Note Controller", () => {

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

    describe("Get Notes Request", () => {

        it("successfully gets all notes", async () => {

            let expectedStatus = 200;
            let expectedNotesLength = 2;
            let expectedNote1 = "Test1";
            let expectedNote2 = "Test2";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de"
            }

            await getNotes(request, response);
            let actualNotesLength = message.notes.length;
            let actualNote1 = message.notes[0].title;
            let actualNote2 = message.notes[1].title;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualNotesLength).toEqual(expectedNotesLength);
            expect(actualNote1).toEqual(expectedNote1);
            expect(actualNote2).toEqual(expectedNote2);
        });
    });

    describe("Get Notes By Plot Request", () => {

        it("successfully gets all notes for a given plot when valid information is provided", async () => {

            let expectedStatus = 200;
            let expectedNotesLength = 1;
            let expectedNote1 = "Test1";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    garden_id: "62fffa28c2fc2e3c8cbaa5de",
                    plot_number: 1
                }
            }

            await getNotesByPlot(request, response);
            let actualNotesLength = message.notes.length;
            let actualNote1 = message.notes[0].title;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualNotesLength).toEqual(expectedNotesLength);
            expect(actualNote1).toEqual(expectedNote1);
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

            await getNotesByPlot(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when invalid plot_number is provided", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Invalid plot number.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    garden_id: "62fffa28c2fc2e3c8cbaa5de",
                    plot_number: 45
                }
            }

            await getNotesByPlot(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });
    });

    describe("Get Notes By Plant Request", () => {

        it("successfully gets all notes for a given plant when valid information is provided", async () => {

            let expectedStatus = 200;
            let expectedNotesLength = 1;
            let expectedNote1 = "Test1";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    plant_id: "62fffa28c2fc2e3c8cbaa5de"
                }
            }

            await getNotesByPlant(request, response);
            let actualNotesLength = message.notes.length;
            let actualNote1 = message.notes[0].title;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualNotesLength).toEqual(expectedNotesLength);
            expect(actualNote1).toEqual(expectedNote1);
        });

        it("produces an error message when invalid plant_id is provided", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Invalid plant ID.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    plant_id: "invalidID"
                }
            }

            await getNotesByPlant(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });
    });

    describe("Get Notes By Month Request", () => {

        it("successfully gets all notes for a given month when valid information is provided", async () => {

            let expectedStatus = 200;
            let expectedNotesLength = 1;
            let expectedNote1 = "Test1";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    date: "2022-04-05"
                }
            }

            await getNotesByMonth(request, response);
            let actualNotesLength = message.notes.length;
            let actualNote1 = message.notes[0].title;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualNotesLength).toEqual(expectedNotesLength);
            expect(actualNote1).toEqual(expectedNote1);
        });
    });

});