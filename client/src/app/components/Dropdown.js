import React, { useState, useEffect } from "react";
import DropDownPicker from "react-native-dropdown-picker";

import InputStyles from "../styles/InputStyles";

//Dropdown is used in multiple locations to list plots, gardens and plants.
const Dropdown = (props) => {

    let value = null;
    let setValue = null;

    //Set value for selected item
    if (props.selected !== undefined) {
        value = props.selected[0];
        setValue = props.selected[1];
    }

    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);

    let data = [];

    //Set data from implementing screen
    if (props.plots !== undefined && props.plots.length !== 0) {
        data = props.plots;
    } else if (props.gardens !== undefined && props.gardens.length !== 0) {
        data = props.gardens;
    } else if (props.plants !== undefined && props.plants.length !== 0) {
        data = props.plants;
    }

    useEffect(() => {
        updateItems(data)
    }, [props]);

    //Function to update items when a dataset is provided by implementing screen
    function updateItems(data) {
        setItems(data);
    }

    return (
        <DropDownPicker
            testID="dropdown"
            style={InputStyles.userSelect}
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

export default Dropdown;