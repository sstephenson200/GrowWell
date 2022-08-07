import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

//Function to get an array of in season months
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

        let array = getMonthArray(month1, month2);

        let date = new Date();
        let currentMonth = date.getMonth() + 1;

        if (array.includes(currentMonth)) {
            return true;
        }
    }

    return false;
}

function EmptyCircle(props) {

    if (props.plantPage == true) {
        return (
            <View style={styles.circleLarge}>
                <FontAwesome name="circle" size={15} color="#E2E2E1" />
            </View>
        );
    } else {
        return (
            <View style={styles.circle}>
                <FontAwesome name="circle" size={10} color="#E2E2E1" />
            </View>
        );
    }
}

function FilledCircle(props) {

    if (props.plantPage == true) {
        return (
            <View style={styles.circleLarge}>
                <FontAwesome name="circle" size={15} color="#81BF63" />
            </View>
        );
    } else {
        return (
            <View style={styles.circle}>
                <FontAwesome name="circle" size={10} color="#81BF63" />
            </View>
        );
    }
}

//Function to generate and fill month circles for monthly infographics
function generateCircles(monthArray, plantPage) {
    let monthCircles = [];

    for (let i = 1; i < 13; i++) {
        if (monthArray.includes(i)) {
            monthCircles.push(
                <FilledCircle key={"circle_" + i} plantPage={plantPage} />
            );
        } else {
            monthCircles.push(
                <EmptyCircle key={"circle_" + i} plantPage={plantPage} />
            );
        }
    }

    return monthCircles;
}

//Function to generate monthly labels
const InfographicLabels = (props) => {
    const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
    let labels = [];

    for (let i = 0; i < months.length; i++) {
        if (props.plantPage == true) {
            labels.push(
                <Text key={"label_" + i} style={styles.labelTextLarge}>{months[i]}</Text>
            );
        } else {
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

const GeneralInfographic = (props) => {

    let month1 = props.schedule[0];
    let month2 = props.schedule[1];

    let array = getMonthArray(month1, month2);

    if (props.plantPage == true) {
        return (
            <View style={styles.monthCirclesLarge}>
                {generateCircles(array, props.plantPage)}
            </View>
        );
    } else {
        return (
            <View style={styles.monthCircles}>
                {generateCircles(array, props.plantPage)}
            </View>
        );
    }
}

const PlantListInfographic = (props) => {

    if (props.plantPage == undefined) {
        props.plantPage = false;
    }

    if (props.sow.length !== 0) {
        return (
            <View style={styles.monthInfographic}>
                <InfographicLabels plantPage={props.plantPage} />
                <GeneralInfographic schedule={props.sow} plantPage={props.plantPage} />
            </View>
        );
    } else {
        return (
            <View style={styles.monthInfographic}>
                <InfographicLabels plantPage={props.plantPage} />
                <GeneralInfographic schedule={props.plant} plantPage={props.plantPage} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    monthInfographic: {
        marginTop: 15,
        flexDirection: "column",
        flex: 2
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