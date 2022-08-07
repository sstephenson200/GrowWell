import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePicker = (props) => {

    let tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1);

    let date = null;
    let setDate = null;

    if (props.date !== undefined) {
        date = props.date[0];
        setDate = props.date[1];
    }

    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    return (
        <View style={styles.datePicker}>

            <View style={styles.selectButtons}>
                <TouchableOpacity style={styles.button} onPress={showDatepicker}>
                    <Text style={styles.buttonText}>SELECT DATE</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={showTimepicker}>
                    <Text style={styles.buttonText}>SELECT TIME</Text>
                </TouchableOpacity>
            </View>

            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    onChange={onChange}
                    minimumDate={new Date()}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    datePicker: {
        marginTop: 10,
        marginBottom: 10
    },
    selectButtons: {
        flexDirection: "row",
        flex: 2,
        justifyContent: "center",
        marginTop: 5
    },
    button: {
        backgroundColor: "#9477B4",
        height: 45,
        width: 120,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 10
    },
    buttonText: {
        color: "white",
        fontSize: 16
    }
});

export default DatePicker;