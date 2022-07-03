import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { circle } from 'react-native/Libraries/Animated/Easing';
import { render } from 'react-dom';
import { TextInput } from 'react-native-gesture-handler';


//Function to get an array of in season months
function getMonthArray(month1, month2) {

    let monthArray = [];

    if (month1 > month2) {
        for (let i = 1; i < (month2 + 1); i++) {
            monthArray.push(i);
        }

        for (let i = month1; i < 12; i++) {
            monthArray.push(i);
        }

    } else {
        for (let i = month1; i < (month2 + 1); i++) {
            monthArray.push(i);
        }
    }

    return monthArray;
}

function EmptyCircle() {
    return (
        <View style={styles.circle}>
            <FontAwesome name="circle" size={10} color="#E2E2E1" />
        </View>
    )
}

function FilledCircle() {
    return (
        <View style={styles.circle}>
            <FontAwesome name="circle" size={10} color="#81BF63" />
        </View>
    )
}

//Function to generate and fill month circles for monthly infographics
function generateInfographic(monthArray) {
    let monthCircles = [];

    for (let i = 1; i < 13; i++) {
        if (monthArray.includes(i)) {
            monthCircles.push(
                <FilledCircle key={"circle_" + i} />
            );
        } else {
            monthCircles.push(
                <EmptyCircle key={"circle_" + i} />
            );
        }
    }

    return monthCircles;
}

const InfographicLabels = () => {
    const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
    let labels = [];

    for (let i = 0; i < months.length; i++) {
        labels.push(
            <Text key={"label_" + i} style={styles.labelText}>{months[i]}</Text>
        );
    }

    return labels;
}

const Infographic = (monthlyDates) => {

    let month1 = null;
    let month2 = null;

    if (monthlyDates.sow.length !== 0) {
        month1 = monthlyDates.sow[0];
        month2 = monthlyDates.sow[1];
    } else {
        month1 = monthlyDates.plant[0];
        month2 = monthlyDates.plant[1];
    }

    let array = getMonthArray(month1, month2);

    return (
        <View style={styles.monthInfographic}>
            <View style={styles.monthLabels}>
                <InfographicLabels />
            </View>
            <View style={styles.monthCircles}>
                {generateInfographic(array)}
            </View>
        </View>
    );
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
    labelText: {
        marginHorizontal: 3.5,
        fontSize: 12
    },
    monthCircles: {
        flexDirection: "row",
        flex: 12,
        marginBottom: 20
    },
    circle: {
        marginHorizontal: 3
    }
});

export default Infographic;