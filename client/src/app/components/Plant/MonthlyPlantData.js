import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import ContainerStyles from "../../styles/ContainerStyles";

//Function to get all months between a given start and end month
function getMonthArray(month1, month2) {

    let monthArray = [];

    if (month1 > month2) {
        for (let i = 1; i < (month2 + 1); i++) {
            monthArray.push(i);
        }

        for (let i = month1; i < 13; i++) {
            monthArray.push(i);
        }

    } else {
        for (let i = month1; i < (month2 + 1); i++) {
            monthArray.push(i);
        }
    }
    return monthArray;
}

//Function to check if the current date is during a given schedule period
function MonthFilter(schedule) {

    if (schedule.length !== 0) {

        let month1 = schedule[0];
        let month2 = schedule[1];

        //Get all months between schedule start and end
        let array = getMonthArray(month1, month2);

        let date = new Date();
        let currentMonth = date.getMonth() + 1;

        if (array.includes(currentMonth)) {
            return true;
        }
    }
    return false;
}

//Function to generate a circle icon for use in monthly infographic display
function Circle(props) {

    //Months in inactive season are filled in grey
    let color = "#E2E2E1";
    if (props.color !== undefined && props.color == "filled") {
        //Months in the active season are filled in green
        color = "#81BF63";
    }

    if (props.plantPage == true) {
        //Large circle for plant screen
        return (
            <View style={styles.circleLarge}>
                <FontAwesome name="circle" size={15} color={color} />
            </View>
        );
    } else {
        //Smaller circle for plant list screen cards
        return (
            <View style={styles.circle}>
                <FontAwesome name="circle" size={10} color={color} />
            </View>
        );
    }
}

//Function to generate circle icons based on provided month array
function generateCircles(monthArray, plantPage) {
    let monthCircles = [];

    for (let i = 1; i < 13; i++) {
        if (monthArray.includes(i)) {
            //Produce filled circles for active months
            monthCircles.push(
                <Circle key={"circle_" + i} plantPage={plantPage} color={"filled"} />
            );
        } else {
            //Produce empty circles for inactive months
            monthCircles.push(
                <Circle key={"emptyCircle_" + i} plantPage={plantPage} />
            );
        }
    }
    return monthCircles;
}

//Function to generate month labels for monthly infographic display
function InfographicLabels(props) {
    const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
    let labels = [];

    for (let i = 0; i < months.length; i++) {
        if (props.plantPage == true) {
            //Large label for plant screen
            labels.push(
                <Text key={"label_" + i} style={styles.labelTextLarge}>{months[i]}</Text>
            );
        } else {
            //Smaller label for plant list screen cards
            labels.push(
                <Text key={"label_" + i} style={styles.labelText}>{months[i]}</Text>
            );
        }
    }

    if (props.plantPage == true) {
        return (
            <View style={styles.monthLabelsLarge}>
                {labels}
            </View>
        );
    } else {
        return (
            <View style={styles.monthLabels}>
                {labels}
            </View>
        );
    }
}

//Function to render the monthly infographic based on provided styling guides
function GeneralInfographic(props) {

    let month1 = props.schedule[0];
    let month2 = props.schedule[1];

    let array = getMonthArray(month1, month2);

    if (props.plantPage == true) {
        //Produce larger infographic for plant screen
        return (
            <View style={styles.monthCirclesLarge}>
                {generateCircles(array, props.plantPage)}
            </View>
        );
    } else {
        //Produce smaller infographic for plant list screen cards
        return (
            <View style={styles.monthCircles}>
                {generateCircles(array, props.plantPage)}
            </View>
        );
    }
}

//Function to render the monthly infographic for use in the plant list screen cards  
function PlantListInfographic(props) {

    let plantPage = false;
    if (props.plantPage !== undefined) {
        plantPage = true;
    }

    if (props.sow.length !== 0) {
        //If sowing schedule is available, show monthly infographic for sow_schedule
        return (
            <View style={[ContainerStyles.dualRow, styles.monthInfographic]}>
                <InfographicLabels plantPage={props.plantPage} />
                <GeneralInfographic schedule={props.sow} plantPage={props.plantPage} />
            </View>
        );
    } else {
        //If sowing schedule is unavailable, show monthly infographic for plant_dates
        return (
            <View style={[ContainerStyles.dualRow, styles.monthInfographic]}>
                <InfographicLabels plantPage={props.plantPage} />
                <GeneralInfographic schedule={props.plant} plantPage={props.plantPage} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    monthInfographic: {
        marginTop: 15
    },
    monthLabels: {
        flexDirection: "row",
        flex: 12,
        marginBottom: 10
    },
    monthLabelsLarge: {
        flexDirection: "row",
        flex: 12,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 100
    },
    labelText: {
        marginHorizontal: 3.5,
        fontSize: 12
    },
    labelTextLarge: {
        marginHorizontal: 7,
        fontSize: 14
    },
    monthCircles: {
        flexDirection: "row",
        flex: 12,
        marginBottom: 20,
        maringLeft: 10
    },
    monthCirclesLarge: {
        flexDirection: "row",
        flex: 12,
        marginBottom: 4
    },
    circle: {
        marginHorizontal: 3
    },
    circleLarge: {
        marginHorizontal: 5
    }
});

module.exports = {
    PlantListInfographic,
    GeneralInfographic,
    InfographicLabels,
    MonthFilter
}