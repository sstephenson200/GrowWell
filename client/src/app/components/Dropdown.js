import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import DropDownPicker from "react-native-dropdown-picker";

const Dropdown = (props) => {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);

    let data = null;

    if (props.plots !== undefined) {
        data = props.plots
    }

    const [items, setItems] = useState(data);

    if (props.styling == "largeDropdown") {
        return (
            <DropDownPicker
                style={styles.largeDropdown}
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
    } else {
        return (
            <DropDownPicker
                style={styles.smallDropdown}
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
}

const styles = StyleSheet.create({
    largeDropdown: {
        width: "90%",
        alignSelf: "center",
        margin: 10
    },
    smallDropdown: {
        width: "50%",
        marginHorizontal: 10,
        borderColor: "grey",
        color: "white"
    }
});

export default Dropdown;