import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import DropDownPicker from "react-native-dropdown-picker";

const Dropdown = (props) => {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState(props.plots);

    return (
        <DropDownPicker
            style={styles.dropdown}
            listMode="SCROLLVIEW"
            placeholder={props.placeholder}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
        />
    );
}

const styles = StyleSheet.create({
    dropdown: {
        margin: 10,
        width: 350,
        alignSelf: "center"
    }
});

export default Dropdown;