import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { DataTable } from 'react-native-paper';

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
            <View>
                <Text>{arrayString}</Text>
            </View>
        );
    } else {
        return null;
    }
}

const CareRequirementsTable = (props) => {

    return (
        <View>
            <DataTable>

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

                <DataTable.Row>
                    <DataTable.Cell>Composting</DataTable.Cell>
                    <DataTable.Cell>Test</DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                    <DataTable.Cell>Watering</DataTable.Cell>
                    <DataTable.Cell>Test</DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                    <DataTable.Cell>Pruning</DataTable.Cell>
                    <DataTable.Cell>Test</DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                    <DataTable.Cell>Feeding</DataTable.Cell>
                    <DataTable.Cell>Test</DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                    <DataTable.Cell>Indoors</DataTable.Cell>
                    <DataTable.Cell>Test</DataTable.Cell>
                </DataTable.Row>

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
});

export default CareRequirementsTable;