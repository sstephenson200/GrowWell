import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { DataTable } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

//Function to print each array entry on its own line and render the list
function printArrayMultipleLines(array, keyIdentifier) {

    let arrayString = "";

    if (array != null) {
        for (let i = 0; i < array.length; i++) {
            arrayString += array[i];
            if (i !== array.length - 1) {
                arrayString += "\n";
            }
        }

        //Render list
        return (
            <View style={styles.row}>
                <Text testID={`tableList${keyIdentifier}`}>{arrayString}</Text>
            </View>
        );
    } else {
        return null;
    }
}

//Function to format schedules according to their length, as a string or as a range of numbers
//This function also renders the schuedle with accompanying link to the create alarm screen
function formatSchedules(props, scheduleTitle, array, keyIdentifier) {

    let arrayString = "";

    if (array.length == 1) {
        //Schedules which are not arrays can be printed as is - e.g., "weekly", "after flowering"
        arrayString += array[0];
        return (
            <DataTable.Cell testID={`singleSchedule${keyIdentifier}`}>{arrayString}</DataTable.Cell>
        );
    }

    if (array.length == 2) {
        let day1 = array[0];
        let day2 = array[1];

        //Convert array schedules into days or weeks for use in display
        if ((day1 % 7 == 0) && (day2 % 7 == 0)) {
            day1 = day1 / 7;
            day2 = day2 / 7;

            if (day1 == day2) {
                if (day1 == 1) {
                    arrayString += "Weekly"
                } else {
                    //e.g. "5 weeks"
                    arrayString += day1 + " weeks";
                }
            } else {
                //e.g. "3-5 weeks"
                arrayString += day1 + " - " + day2 + " weeks";
            }

        } else {
            if (day1 == day2) {
                //e.g. "10 days"
                arrayString += day1 + " days";
            } else {
                //e.g. "10-14 days"
                arrayString += day1 + " - " + day2 + " days";
            }
        }
    }

    //Initialise data to pass to create alarm page
    let alarmTitle = scheduleTitle + props.name;
    let alarmSchedule = array[0];
    let alarmDuration = null;

    //Calculate number of alarm repeats required from plant to harvest for use in recurring alarm creation
    if (props.sow_date.length == 0) {
        alarmDuration = calculateAlarmDuration(props.harvest_date[1], props.plant_date[0]);
    } else {
        alarmDuration = calculateAlarmDuration(props.harvest_date[1], props.sow_date[0]);
    }

    alarmDuration = alarmDuration * 30;

    //Render schedule with accompanying create alarm screen link
    return (
        <View style={styles.row}>
            <DataTable.Cell testID={`rangedSchedule${keyIdentifier}`}>
                {arrayString}
                <TouchableOpacity style={styles.icon}>
                    <Ionicons testID={`alarmLink${keyIdentifier}`} name="ios-alarm" size={hp("4%")} color="black" onPress={() => props.navigation.navigate("StackNavigator", { screen: "CreateAlarm", params: { alarmTitle: alarmTitle, alarmSchedule: alarmSchedule, alarmDuration: alarmDuration } })} />
                </TouchableOpacity>
            </DataTable.Cell>
        </View>
    );
}

//Calculate number of alarm repeats required for use in recurring alarm creation
function calculateAlarmDuration(end, start) {
    let duration = null;
    if (end < start) {
        duration = 12 - start + end;
    } else {
        duration = end - start;
    }
    return duration;
}

//Function to format spacing parameter as inches or ft
function formatSpacing(array) {
    let arrayString = "";
    let spacing1 = array[0];
    let spacing2 = array[1];

    if ((spacing1 % 12 == 0) && (spacing2 % 12 == 0)) {
        spacing1 = spacing1 / 12;
        spacing2 = spacing2 / 12;

        if (spacing1 == spacing2) {
            //e.g. "3 ft"
            arrayString += spacing1 + " ft";
        } else {
            //e.g. "1-2 ft"
            arrayString += spacing1 + " - " + spacing2 + " ft";
        }

    } else {
        if (spacing1 == spacing2) {
            //e.g. "2 in"
            arrayString += spacing1 + " in"
        } else {
            //e.g. "1-2 in"
            arrayString += spacing1 + " - " + spacing2 + " in"
        }
    }

    //Render spacing parameter
    return (
        <DataTable.Cell testID="spacing">{arrayString}</DataTable.Cell>
    );
}

const CareRequirementsTable = (props) => {

    return (
        <View style={styles.table}>
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
                        printArrayMultipleLines(props.sun_condition, "+sun_condition")
                    }
                </DataTable.Row>

                <DataTable.Row>
                    <DataTable.Cell>Soil Type</DataTable.Cell>
                    {
                        printArrayMultipleLines(props.soil_type, "+soil_type")
                    }
                </DataTable.Row>

                <DataTable.Row>
                    <DataTable.Cell>Soil pH</DataTable.Cell>
                    {
                        printArrayMultipleLines(props.soil_ph, "+soil_ph")
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
                                formatSchedules(props, "Water the ", props.water_schedule, "+water_schedule")
                            }
                        </DataTable.Row>

                        : null
                }

                {
                    props.prune_schedule !== undefined && props.prune_schedule.length !== 0 ?

                        <DataTable.Row>
                            <DataTable.Cell>Pruning</DataTable.Cell>
                            {
                                formatSchedules(props, "Prune the ", props.prune_schedule, "+prune_schedule")
                            }
                        </DataTable.Row>

                        : null
                }

                {
                    props.feed_schedule !== undefined && props.feed_schedule.length !== 0 ?

                        <DataTable.Row>
                            <DataTable.Cell>Feeding</DataTable.Cell>
                            {
                                formatSchedules(props, "Feed the ", props.feed_schedule, "+feed_schedule")
                            }
                        </DataTable.Row>

                        : null
                }

                {
                    props.indoor_schedule !== undefined && props.indoor_schedule.length !== 0 ?

                        <DataTable.Row>
                            <DataTable.Cell>Indoors</DataTable.Cell>
                            {
                                formatSchedules(props, "Plant the ", props.indoor_schedule, "+indoor_schedule")
                            }
                        </DataTable.Row>

                        : null
                }

                {
                    props.plant_problem !== undefined && props.plant_problem.length !== 0 ?

                        <DataTable.Row>
                            <DataTable.Cell>Common Problems</DataTable.Cell>
                            {
                                printArrayMultipleLines(props.plant_problem, "+plant_problem")
                            }
                        </DataTable.Row>

                        : null
                }

                {
                    props.companion_plant !== undefined && props.companion_plant.length !== 0 ?

                        <DataTable.Row>
                            <DataTable.Cell>Good Companion Plants</DataTable.Cell>
                            {
                                printArrayMultipleLines(props.companion_plant, "+companion_plant")
                            }
                        </DataTable.Row>

                        : null
                }

                {
                    props.incompatible_plant !== undefined && props.incompatible_plant.length !== 0 ?

                        <DataTable.Row>
                            <DataTable.Cell>Poor Companion Plants</DataTable.Cell>
                            {
                                printArrayMultipleLines(props.incompatible_plant, "+incompatible_plant")
                            }
                        </DataTable.Row>

                        : null
                }

            </DataTable>
        </View>
    );
}

const styles = StyleSheet.create({
    table: {
        paddingBottom: 10
    },
    row: {
        width: wp("46%"),
        justifyContent: "center"
    },
    icon: {
        paddingLeft: 10
    }
});

export default CareRequirementsTable;