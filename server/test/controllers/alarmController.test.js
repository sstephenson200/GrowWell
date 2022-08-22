const app = require("../../index");
const supertest = require("supertest");
const request = supertest(app);

const { createAlarm, getAllAlarms, getAlarmByID, deleteAlarm, deleteAlarmsByParent, updateCompletionStatus, updateActiveStatus, updateNotificationID } = require('../../controllers/alarmController');

jest.mock("../../repositories/alarmRepository");

describe("Alarm Controller", () => {

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

    describe("Create Alarm Request", () => {

        it("successfully creates alarm when valid required information is given", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Alarm created successfully.";
            let expectedAlarm = "Test title";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    title: expectedAlarm,
                    due_date: "2022-09-02",
                    notification_id: "123"
                }
            }

            await createAlarm(request, response);
            let actualMessage = message.message;
            let actualAlarm = message.alarm.title;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
            expect(actualAlarm).toEqual(expectedAlarm);
        });

        it("successfully creates alarm when valid required and optional information is given", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Alarm created successfully.";
            let expectedAlarm = "Test title";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    title: expectedAlarm,
                    due_date: "2022-09-02",
                    garden_id: "63011b289163a66dd9b721f9",
                    plot_number: 1,
                    isParent: false,
                    parent: null,
                    notification_id: "123"
                }
            }

            await createAlarm(request, response);
            let actualMessage = message.message;
            let actualAlarm = message.alarm.title;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
            expect(actualAlarm).toEqual(expectedAlarm);
        });

        it("produces an error message when invalid user_id is provided", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Invalid user ID.";

            let request = {
                user: "invalidID",
                body: {
                    title: "Test title",
                    due_date: "2022-09-02",
                    notification_id: "123"
                }
            }

            await createAlarm(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when invalid garden_id is provided", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Invalid garden ID.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    title: "Test title",
                    due_date: "2022-09-02",
                    garden_id: "invalidID",
                    notification_id: "123"
                }
            }

            await createAlarm(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when garden_id is not linked to existing garden", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Invalid garden ID.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    title: "Test title",
                    due_date: "2022-09-02",
                    garden_id: "62fffa28c2fc2e3c8cbaa5de",
                    notification_id: "123"
                }
            }

            await createAlarm(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when invalid due_date is provided", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Invalid due date.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    title: "Test title",
                    due_date: "invalidDate",
                    notification_id: "123"
                }
            }

            await createAlarm(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when past due_date is provided", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Date must be in the future.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    title: "Test title",
                    due_date: "2021-05-02",
                    notification_id: "123"
                }
            }

            await createAlarm(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when plot_number is provided without garden_id", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Plot number must be provided with garden ID.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    title: "Test title",
                    plot_number: 2,
                    due_date: "2022-09-02",
                    notification_id: "123"
                }
            }

            await createAlarm(request, response);
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
                    title: "Test title",
                    garden_id: "63011b289163a66dd9b721f9",
                    plot_number: 7,
                    due_date: "2022-09-02",
                    notification_id: "123"
                }
            }

            await createAlarm(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when an invalid parent is provided", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Invalid parent ID.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    title: "Test title",
                    due_date: "2022-09-02",
                    notification_id: "123",
                    parent: "invalidParent"
                }
            }

            await createAlarm(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when a parent is provided which doesn't exist", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Invalid parent ID.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    title: "Test title",
                    due_date: "2022-09-02",
                    notification_id: "123",
                    parent: "62fffa28c2fc2e3c8cbaa5de"
                }
            }

            await createAlarm(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });
    });

    describe("Get All Alarms Request", () => {

        it("successfully gets all alarms", async () => {

            let expectedStatus = 200;
            let expectedAlarmsLength = 3;
            let expectedAlarm1 = "Test1";
            let expectedAlarm2 = "Test2";
            let expectedAlarm3 = "Test3";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de"
            }

            await getAllAlarms(request, response);
            let actualAlarmsLength = message.alarms.length;
            let actualAlarm1 = message.alarms[0].title;
            let actualAlarm2 = message.alarms[1].title;
            let actualAlarm3 = message.alarms[2].title;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualAlarmsLength).toEqual(expectedAlarmsLength);
            expect(actualAlarm1).toEqual(expectedAlarm1);
            expect(actualAlarm2).toEqual(expectedAlarm2);
            expect(actualAlarm3).toEqual(expectedAlarm3);
        });
    });

    describe("Get Alarm By ID Request", () => {

        it("successfully gets alarm when valid alarm_id is provided", async () => {

            let expectedStatus = 200;
            let expectedAlarm = "SingleAlarm";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    alarm_id: "630127959eb4f06a9fa11923"
                }
            }

            await getAlarmByID(request, response);
            let actualAlarm = message.alarm.title;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualAlarm).toEqual(expectedAlarm);
        });

        it("produces an error message when invalid alarm_id is provided", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Invalid alarm ID.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    alarm_id: "invalidID"
                }
            }

            await getAlarmByID(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });
    });

    describe("Delete Alarm Request", () => {

        it("successfully deletes the alarm when a valid alarm_id is provided", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Alarm deleted successfully.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    alarm_id: "630127969eb4f06a9fa11927"
                }
            }

            await deleteAlarm(request, response);
            let actualMessage = message.message;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when invalid alarm_id is provided", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Invalid alarm ID.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    alarm_id: "invalidID"
                }
            }

            await deleteAlarm(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });
    });

    describe("Delete Alarms By Parent Request", () => {

        it("successfully deletes alarms when parent alarm ID is provided", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Alarms deleted successfully.";
            let expectedAlarmsLength = 3;
            let expectedAlarm1 = "Test1";
            let expectedAlarm2 = "Test2";
            let expectedAlarm3 = "Test3";


            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    parent: "validParent"
                }
            }

            await deleteAlarmsByParent(request, response);
            let actualMessage = message.message;
            let actualAlarmsLength = message.alarms.length;
            let actualAlarm1 = message.alarms[0].title;
            let actualAlarm2 = message.alarms[1].title;
            let actualAlarm3 = message.alarms[2].title;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
            expect(actualAlarmsLength).toEqual(expectedAlarmsLength);
            expect(actualAlarm1).toEqual(expectedAlarm1);
            expect(actualAlarm2).toEqual(expectedAlarm2);
            expect(actualAlarm3).toEqual(expectedAlarm3);
        });
    });

    describe("Update Completion Status Request", () => {

        it("successfully updates completion_status when valid information is given", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Alarm completion status updated successfully.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    alarm_id: "630241aab5c4a2e109ddfb04"
                }
            }

            await updateCompletionStatus(request, response);
            let actualMessage = message.message;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when an invalid alarm_id is provided", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Invalid alarm ID.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    alarm_id: "invalidID"
                }
            }

            await updateCompletionStatus(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when an alarm_id is provided which doesn't exist", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Invalid alarm ID.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    alarm_id: "62fffa28c2fc2e3c8cbaa5de",
                }
            }

            await updateCompletionStatus(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });
    });

    describe("Update Active Status Request", () => {

        it("successfully updates active_status when valid information is given", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Alarm active status updated successfully.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    alarm_id: "630241aab5c4a2e109ddfb04"
                }
            }

            await updateActiveStatus(request, response);
            let actualMessage = message.message;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when an invalid alarm_id is provided", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Invalid alarm ID.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    alarm_id: "invalidID"
                }
            }

            await updateActiveStatus(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when an alarm_id is provided which doesn't exist", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Invalid alarm ID.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    alarm_id: "62fffa28c2fc2e3c8cbaa5de"
                }
            }

            await updateActiveStatus(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });
    });

    describe("Update Notification ID Request", () => {

        it("successfully updates notification_id when valid information is given", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Alarm notification ID updated successfully.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    alarm_id: "630241aab5c4a2e109ddfb04",
                    notification_id: "12345"
                }
            }

            await updateNotificationID(request, response);
            let actualMessage = message.message;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when an invalid alarm_id is provided", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Invalid alarm ID.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    alarm_id: "invalidID",
                    notification_id: "12345"
                }
            }

            await updateNotificationID(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });

        it("produces an error message when an alarm_id is provided which doesn't exist", async () => {

            let expectedStatus = 200;
            let expectedMessage = "Invalid alarm ID.";

            let request = {
                user: "62fffa28c2fc2e3c8cbaa5de",
                body: {
                    alarm_id: "62fffa28c2fc2e3c8cbaa5de",
                    notification_id: "12345"
                }
            }

            await updateNotificationID(request, response);
            let actualMessage = message.errorMessage;

            expect(actualStatus).toEqual(expectedStatus);
            expect(actualMessage).toEqual(expectedMessage);
        });
    });

});
