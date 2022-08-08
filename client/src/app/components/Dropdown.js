import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import DropDownPicker from "react-native-dropdown-picker";

const Dropdown = (props) => {

    let value = null;
    let setValue = null;

    if (props.selected !== undefined) {
        value = props.selected[0];
        setValue = props.selected[1];
    }

    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);

    let data = [];

    if (props.plots !== undefined && props.plots.length !== 0) {
        data = props.plots;
    } else if (props.gardens !== undefined && props.gardens.length !== 0) {
        data = props.gardens;
    } else if (props.plants !== undefined && props.plants.length !== 0) {
        data = props.plants;
    }

    function updateItems(data) {
        if (data.length !== 0) {
            setItems(data);
        }
    }

    useEffect(() => {
        updateItems(data)
    }, [props]);

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
    }
});

export default Dropdown;