import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { DataTable } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

//Function to print each array entry on its own line
function printArrayMultipleLines(array) {

    let arrayString = "";

    if (array != null) {
        for (let i = 0; i < array.length; i++) {
            arrayString += array[i];
            if (i !== array.length - 1) {
                arrayString += '\n';
            }
        }

        return (
            <View style={styles.row}>
                <Text>{arrayString}</Text>
            </View>
        );
    } else {
        return null;
    }
}

//Function to format schedules according to their length, as a string or as a range of numbers
function formatSchedules(array) {

    let arrayString = "";

    if (array.length == 1) {
        arrayString += array[0];

        return (
            <DataTable.Cell>{arrayString}</DataTable.Cell>
        );
    }

    if (array.length == 2) {
        let day1 = array[0];
        let day2 = array[1];

        if ((day1 % 7 == 0) && (day2 % 7 == 0)) {
            day1 = day1 / 7;
            day2 = day2 / 7;

            if (day1 == day2) {
                if (day1 == 1) {
                    arrayString += "Weekly"
                } else {
                    arrayString += day1 + " weeks";
                }
            } else {
                arrayString += day1 + " - " + day2 + " weeks";
            }

        } else {
            if (day1 == day2) {
                arrayString += day1 + " days";
            } else {
                arrayString += day1 + " - " + day2 + " days";
            }
        }
    }

    return (
        <View style={styles.row}>
            <DataTable.Cell>
                {arrayString}
                <TouchableOpacity style={styles.icon}>
                    <Ionicons name="ios-alarm" size={22} color="black" onPress={() => alert("Ready to add alarm.")} />
                </TouchableOpacity>
            </DataTable.Cell>
        </View>

    );
}

function formatSpacing(array) {
    let arrayString = "";
    let spacing1 = array[0];
    let spacing2 = array[1];

    if ((spacing1 % 12 == 0) && (spacing2 % 12 == 0)) {
        spacing1 = spacing1 / 12;
        spacing2 = spacing2 / 12;

        if (spacing1 == spacing2) {
            arrayString += spacing1 + " ft";
        } else {
            arrayString += spacing1 + " - " + spacing2 + " ft";
        }

    } else {
        //inches
        if (spacing1 == spacing2) {
            arrayString += spacing1 + " in"
        } else {
            arrayString += spacing1 + " - " + spacing2 + " in"
        }
    }

    return (
        <DataTable.Cell>{arrayString}</DataTable.Cell>
    );
}

const CareRequirementsTable = (props) => {

    return (
        <View>
            <DataTable>

                {
                    props.spacing !== undefined && props.spacing.length !== 0 ?

                        <DataTable.Row>
                            <DataTable.Cell>Plant Spacing</DataTable.Cell>
                            {
                                formatSpacing(props.spacing)
                            }
                        </DataTable.Row>

                        : null
                }

                <DataTable.Row>
                    <DataTable.Cell>Sunlight</DataTable.Cell>
                    {
                        printArrayMultipleLines(props.sun_condition)
                    }
                </DataTable.Row>

                <DataTable.Row>
                    <DataTable.Cell>Soil Type</DataTable.Cell>
                    {
                        printArrayMultipleLines(props.soil_type)
                    }
                </DataTable.Row>

                <DataTable.Row>
                    <DataTable.Cell>Soil pH</DataTable.Cell>
                    {
                        printArrayMultipleLines(props.soil_ph)
                    }
                </DataTable.Row>

                {
                    props.compost_schedule !== null ?

                        <DataTable.Row>
                            <DataTable.Cell>Composting</DataTable.Cell>
                            <DataTable.Cell>{props.compost_schedule}</DataTable.Cell>
                        </DataTable.Row>

                        : null
                }

                {
                    props.water_schedule !== undefined && props.water_schedule.length !== 0 ?

                        <DataTable.Row>
                            <DataTable.Cell>Watering</DataTable.Cell>
                            {
                                formatSchedules(props.water_schedule)
                            }
                        </DataTable.Row>

                        : null
                }

                {
                    props.prune_schedule !== undefined && props.prune_schedule.length !== 0 ?

                        <DataTable.Row>
                            <DataTable.Cell>Pruning</DataTable.Cell>
                            {
                                formatSchedules(props.prune_schedule)
                            }
                        </DataTable.Row>

                        : null
                }

                {
                    props.feed_schedule !== undefined && props.feed_schedule.length !== 0 ?

                        <DataTable.Row>
                            <DataTable.Cell>Feeding</DataTable.Cell>
                            {
                                formatSchedules(props.feed_schedule)
                            }
                        </DataTable.Row>

                        : null
                }

                {
                    props.indoor_schedule !== undefined && props.indoor_schedule.length !== 0 ?

                        <DataTable.Row>
                            <DataTable.Cell>Indoors</DataTable.Cell>
                            {
                                formatSchedules(props.indoor_schedule)
                            }
                        </DataTable.Row>

                        : null
                }

                {
                    props.plant_problem !== undefined && props.plant_problem.length !== 0 ?

                        <DataTable.Row>
                            <DataTable.Cell>Common Problems</DataTable.Cell>
                            {
                                printArrayMultipleLines(props.plant_problem)
                            }
                        </DataTable.Row>

                        : null
                }

                {
                    props.companion_plant !== undefined && props.companion_plant.length !== 0 ?

                        <DataTable.Row>
                            <DataTable.Cell>Good Companion Plants</DataTable.Cell>
                            {
                                printArrayMultipleLines(props.companion_plant)
                            }
                        </DataTable.Row>

                        : null
                }

                {
                    props.incompatible_plant !== undefined && props.incompatible_plant.length !== 0 ?

                        <DataTable.Row>
                            <DataTable.Cell>Poor Companion Plants</DataTable.Cell>
                            {
                                printArrayMultipleLines(props.incompatible_plant)
                            }
                        </DataTable.Row>

                        : null
                }

            </DataTable>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        width: 180,
        justifyContent: "center"
    },
    icon: {
        paddingLeft: 10
    }
});

export default CareRequirementsTable;