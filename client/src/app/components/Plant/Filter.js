import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";

import InputStyles from "../../styles/InputStyles";

//Filter for use in plant list screen
const Filter = (props) => {

    //Initialise filter state for use in plant list screen
    let filterOptions = props.filterData[0];
    let setFilterOptions = props.filterData[1];

    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        //Menu headings
        { label: "Plant Type", value: "plantTypeTitle", disabled: "disabled" },
        { label: "Actions", value: "actionsTitle", disabled: "disabled" },
        //Filter options
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
            style={InputStyles.userSelect}
            listMode="SCROLLVIEW"
            placeholder="Filter Plants"
            mode="BADGE"
            badgeDotColors={["#9477B4", "#80C1E3", "#D26E8D", "#81BF63", "#E3B453", "#9477B4", "#80C1E3"]}
            disabledItemLabelStyle={{ fontWeight: "bold" }}
            open={open}
            value={filterOptions}
            items={items}
            setOpen={setOpen}
            setValue={setFilterOptions}
            setItems={setItems}
            multiple={true}
        />
    );
}

export default Filter;