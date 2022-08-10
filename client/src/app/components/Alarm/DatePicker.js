import React, { useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import ButtonStyles from "../../styles/ButtonStyles";

//Date picker to allow user to select date/time for upcoming alarms
const DatePicker = (props) => {

    let tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1);

    let date = null;
    let setDate = null;

    //Initialise datepicker date, as provided from create alarm screen 
    if (props.date !== undefined) {
        date = props.date[0];
        setDate = props.date[1];
    }

    const [mode, setMode] = useState("date");
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
        showMode("date");
    };

    const showTimepicker = () => {
        showMode("time");
    };

    return (
        <View style={{ margin: 5 }}>

            <TouchableOpacity style={ButtonStyles.largeButton} onPress={showDatepicker}>
                <Text style={ButtonStyles.buttonText}>SELECT DATE</Text>
            </TouchableOpacity>

            <TouchableOpacity style={ButtonStyles.largeButton} onPress={showTimepicker}>
                <Text style={ButtonStyles.buttonText}>SELECT TIME</Text>
            </TouchableOpacity>

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

export default DatePicker;