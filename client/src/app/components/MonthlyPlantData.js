import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

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

//Function to generate and fill month circles for monthly infographics
function generateInfographic(monthArray) {
    let output = [];
    let circle = null;
    for (let i = 1; i < 13; i++) {
        if (monthArray.includes(i)) {
            circle = (
                <View style={styles.filledCircle} />
            )
        } else {
            circle = (
                <View style={styles.emptyCircle} />
            )
        }
        output[i] = ({ "key": i, circle });
    }

    return (
        <View>
            {output.circle}
        </View>
    )
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
    let infographic = generateInfographic(array);

    return (infographic);
}

const styles = StyleSheet.create({
    emptyCircle: {
        width: 44,
        height: 44,
        borderRadius: 44 / 2,
        borderColor: "black"
    },
    filledCircle: {
        width: 44,
        height: 44,
        borderRadius: 44 / 2,
        borderColor: "black",
        color: "green"
    }
});

export default Infographic;