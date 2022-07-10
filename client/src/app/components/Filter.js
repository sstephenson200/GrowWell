import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import DropDownPicker from "react-native-dropdown-picker";

const Filter = (props) => {

    let filterOptions = props.filterData[0];
    let setFilterOptions = props.filterData[1];

    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: "Plant Type", value: "plantTypeTitle", disabled: "disabled" },
        { label: "Actions", value: "actionsTitle", disabled: "disabled" },
        { label: "Vegetable", value: "Vegetable", parent: "plantTypeTitle" },
        { label: "Herb", value: "Herb", parent: "plantTypeTitle" },
        { label: "Fruit", value: "Fruit", parent: "plantTypeTitle" },
        { label: "Ready To Harvest", value: "Harvest", parent: "actionsTitle" },
        { label: "Ready To Transplant", value: "Transplant", parent: "actionsTitle" },
        { label: "Ready To Plant", value: "Plant", parent: "actionsTitle" },
        { label: "Ready To Sow", value: "Sow", parent: "actionsTitle" }
    ]);

    return (
        <DropDownPicker
            style={styles.filter}
            listMode="SCROLLVIEW"
            placeholder="Filter Plants"
            open={open}
            value={filterOptions}
            items={items}
            setOpen={setOpen}
            setValue={setFilterOptions}
            setItems={setItems}
            multiple={true}
            min={0}
            max={5}
        />
    );
}

const styles = StyleSheet.create({
    filter: {
        width: "90%",
        alignSelf: "center",
        marginTop: 10,
        borderRadius: 15,
        elevation: 5
    }
});

export default Filter;