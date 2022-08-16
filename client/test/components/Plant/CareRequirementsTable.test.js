import React from "react";
import { create } from "react-test-renderer";

import CareRequirementsTable from "../../../src/app/components/Plant/CareRequirementsTable";

jest.mock("@expo/vector-icons");

describe("<CareRequirementsTable />", () => {

    let plant = {
        name: "Parsnip",
        sow_date: [3, 5],
        plant_date: [],
        transplant_date: [],
        harvest_date: [10, 2],
        sun_condition: ["Partial Shade", "Full Sun"],
        soil_type: ["Chalk", "Clay", "Loam", "Sand"],
        soil_ph: ["Acid", "Neutral"],
        water_schedule: [14, 21],
        compost_schedule: "Previous Autumn",
        prune_schedule: [],
        feed_schedule: [],
        indoor_schedule: ["No"],
        spacing: [4, 6],
        plant_problem: ["Carrot Fly", "Parsnip Canker"],
        companion_plant: ["Onion", "Garlic", "Pea"],
        incompatible_plant: ["Carrot", "Celery", "Dill"]
    }

    it("renders list items on separate lines", () => {

        let expectedResult = plant.sun_condition.join("\n");
        let tree = create(<CareRequirementsTable
            name={plant.name}
            sow_date={plant.sow_date}
            plant_date={plant.plant_date}
            harvest_date={plant.harvest_date}
            spacing={plant.spacing}
            sun_condition={plant.sun_condition}
            soil_type={plant.soil_type}
            soil_ph={plant.soil_ph}
            water_schedule={plant.water_schedule}
            compost_schedule={plant.compost_schedule}
            prune_schedule={plant.prune_schedule}
            feed_schedule={plant.feed_schedule}
            indoor_schedule={plant.indoor_schedule}
            plant_problem={plant.plant_problem}
            companion_plant={plant.companion_plant}
            incompatible_plant={plant.incompatible_plant}
        />);
        let actualResult = tree.root.findByProps({ testID: "tableList+sun_condition" }).props.children;
        expect(actualResult).toEqual(expectedResult);
    });

    it("renders non-range schedules as strings", () => {
        let expectedResult = plant.indoor_schedule[0];
        let tree = create(<CareRequirementsTable
            name={plant.name}
            sow_date={plant.sow_date}
            plant_date={plant.plant_date}
            harvest_date={plant.harvest_date}
            spacing={plant.spacing}
            sun_condition={plant.sun_condition}
            soil_type={plant.soil_type}
            soil_ph={plant.soil_ph}
            water_schedule={plant.water_schedule}
            compost_schedule={plant.compost_schedule}
            prune_schedule={plant.prune_schedule}
            feed_schedule={plant.feed_schedule}
            indoor_schedule={plant.indoor_schedule}
            plant_problem={plant.plant_problem}
            companion_plant={plant.companion_plant}
            incompatible_plant={plant.incompatible_plant}
        />);
        let actualResult = tree.root.findByProps({ testID: "singleSchedule+indoor_schedule" }).props.children;
        expect(actualResult).toEqual(expectedResult);
    });

    it("renders ranged schedules as arrays with units", () => {

        let expectedResult = (plant.water_schedule[0] / 7) + " - " + (plant.water_schedule[1] / 7) + " weeks"
        let tree = create(<CareRequirementsTable
            name={plant.name}
            sow_date={plant.sow_date}
            plant_date={plant.plant_date}
            harvest_date={plant.harvest_date}
            spacing={plant.spacing}
            sun_condition={plant.sun_condition}
            soil_type={plant.soil_type}
            soil_ph={plant.soil_ph}
            water_schedule={plant.water_schedule}
            compost_schedule={plant.compost_schedule}
            prune_schedule={plant.prune_schedule}
            feed_schedule={plant.feed_schedule}
            indoor_schedule={plant.indoor_schedule}
            plant_problem={plant.plant_problem}
            companion_plant={plant.companion_plant}
            incompatible_plant={plant.incompatible_plant}
        />);
        let actualResult = tree.root.findByProps({ testID: "rangedSchedule+water_schedule" }).props.children[0];
        expect(actualResult).toEqual(expectedResult);
    });

    it("renders plant spacing as arrays with units", () => {

        let expectedResult = (plant.spacing[0]) + " - " + (plant.spacing[1]) + " in"
        let tree = create(<CareRequirementsTable
            name={plant.name}
            sow_date={plant.sow_date}
            plant_date={plant.plant_date}
            harvest_date={plant.harvest_date}
            spacing={plant.spacing}
            sun_condition={plant.sun_condition}
            soil_type={plant.soil_type}
            soil_ph={plant.soil_ph}
            water_schedule={plant.water_schedule}
            compost_schedule={plant.compost_schedule}
            prune_schedule={plant.prune_schedule}
            feed_schedule={plant.feed_schedule}
            indoor_schedule={plant.indoor_schedule}
            plant_problem={plant.plant_problem}
            companion_plant={plant.companion_plant}
            incompatible_plant={plant.incompatible_plant}
        />);
        let actualResult = tree.root.findByProps({ testID: "spacing" }).props.children;
        expect(actualResult).toEqual(expectedResult);
    });

    it("does not render table row if data is undefined", () => {

        let expectedResult = 0;
        let tree = create(<CareRequirementsTable
            name={plant.name}
            sow_date={plant.sow_date}
            plant_date={plant.plant_date}
            harvest_date={plant.harvest_date}
            spacing={plant.spacing}
            sun_condition={plant.sun_condition}
            soil_type={plant.soil_type}
            soil_ph={plant.soil_ph}
            water_schedule={plant.water_schedule}
            compost_schedule={plant.compost_schedule}
            prune_schedule={plant.prune_schedule}
            feed_schedule={plant.feed_schedule}
            indoor_schedule={plant.indoor_schedule}
            plant_problem={plant.plant_problem}
            companion_plant={plant.companion_plant}
            incompatible_plant={plant.incompatible_plant}
        />);
        let singleResult = tree.root.findAll(n => n.props.testID === "singleSchedule+prune_schedule" && n.type === "DataTable.Cell").length;
        let multipleResult = tree.root.findAll(n => n.props.testID === "rangedSchedule+prune_schedule" && n.type === "DataTable.Cell").length;
        let actualResult = singleResult + multipleResult;
        expect(actualResult).toEqual(expectedResult);
    });

    it("lets user navigate to Alarm screen with calculated alarm data", async () => {

        let expectedAlarmTitle = "Water the " + plant.name;
        let expectedAlarmSchedule = plant.water_schedule[0];
        let expectedAlarmDuration = (12 - plant.sow_date[0] + plant.harvest_date[1]) * 30;

        const navigation = {
            navigate: jest.fn()
        }

        let tree = create(<CareRequirementsTable
            navigation={navigation}
            name={plant.name}
            sow_date={plant.sow_date}
            plant_date={plant.plant_date}
            harvest_date={plant.harvest_date}
            spacing={plant.spacing}
            sun_condition={plant.sun_condition}
            soil_type={plant.soil_type}
            soil_ph={plant.soil_ph}
            water_schedule={plant.water_schedule}
            compost_schedule={plant.compost_schedule}
            prune_schedule={plant.prune_schedule}
            feed_schedule={plant.feed_schedule}
            indoor_schedule={plant.indoor_schedule}
            plant_problem={plant.plant_problem}
            companion_plant={plant.companion_plant}
            incompatible_plant={plant.incompatible_plant}
        />);

        const button = tree.root.findByProps({ testID: "alarmLink+water_schedule" }).props;
        button.onPress();

        expect(navigation.navigate).toBeCalledWith("StackNavigator", { screen: "CreateAlarm", params: { alarmTitle: expectedAlarmTitle, alarmSchedule: expectedAlarmSchedule, alarmDuration: expectedAlarmDuration } });
    });

});