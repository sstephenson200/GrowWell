import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { RadioButton } from 'react-native-paper';
import axios from 'axios';
import { unescape } from 'underscore';
import { Ionicons } from '@expo/vector-icons';

import { ScheduleNotification, CancelNotification } from '../../notifications/PushNotification';

import GetGardenByID from '../../requests/Garden/GetGardenByID';

const AlarmCard = (props) => {

    //Initialise parameters provided from alarm page
    let alarm_id = props.alarm.alarm_id;
    let date = props.alarm.notificationDate;
    let notification_id = props.alarm.notification_id;
    let time = props.alarm.time;
    let title = props.alarm.title;
    title = unescape(title);
    let garden_id = props.alarm.garden_id;
    let plot_number = props.alarm.plot_number;
    let isParent = props.alarm.isParent;
    let parent = props.alarm.parent;
    let completion_status = props.alarm.completion_status;
    let active_status = props.alarm.active_status;

    let setDeleteCard = props.deleteCard;

    const [gardenName, setGardenName] = useState(null);
    const [isEnabled, setIsEnabled] = useState(active_status);
    const [complete, setComplete] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [radioChecked, setRadioChecked] = useState('single');

    useEffect(() => {
        if (garden_id !== undefined) {
            //If alarm is linked to a specific garden plot
            getGarden(garden_id);
        }
        setComplete(completion_status);
    }, [props.alarm]);

    //Turn alarm on/off by updating alarm active_status
    const toggleSwitch = () => {
        updateActiveStatus();
        setIsEnabled(previousState => !previousState);

        //Cancel or schedule notifications based on active_status
        if (isEnabled) {
            CancelNotification(notification_id);
        } else {
            updateNotification();
        }
    }

    //Show/hide modal for processing recurring alarm deletion
    const toggleModal = () => {
        setModalVisible(!modalVisible);
    }

    //Function to get garden name for alarm display
    async function getGarden() {
        setGardenName(await (GetGardenByID(garden_id)));
    }

    //Function to update alarm's completion status - mark as done/done
    async function updateCompletionStatus() {
        try {
            const response = await axios.put("/alarm/updateCompletionStatus", {
                "alarm_id": alarm_id
            }, { responseType: 'json' });

            let status = response.status;

            if (status == 200) {

                let markCompleted = !complete;
                setComplete(markCompleted);

                if ((markCompleted && isEnabled) || (!markCompleted && !isEnabled)) {
                    toggleSwitch();
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    //Function to update alarm's active status - on/off
    async function updateActiveStatus() {
        try {
            const response = await axios.put("/alarm/updateActiveStatus", {
                "alarm_id": alarm_id
            }, { responseType: 'json' });
        } catch (error) {
            console.log(error);
        }
    }

    //Function to delete a single alarm
    async function deleteAlarm(alarm) {
        try {
            const response = await axios.delete("/alarm/deleteAlarm", {
                data: {
                    "alarm_id": alarm
                }
            }, { responseType: 'json' });

            //Cancel local notifications
            await CancelNotification(notification_id);
            setDeleteCard(true);
        } catch (error) {
            console.log(error);
        }
    }

    //Function to delete all recurring alarms based on shared parent ID
    async function deleteRecurringAlarms(alarm) {
        try {
            const response = await axios.delete("/alarm/deleteAlarmsByParent", {
                data: {
                    "parent": alarm
                }
            }, { responseType: 'json' });

            let status = response.status;

            if (status == 200) {
                if (response.data.alarms !== undefined && response.data.alarms.length !== 0) {
                    for (let i = 0; i < response.data.alarms.length; i++) {
                        let id = response.data.alarms[i].notification_id;
                        await CancelNotification(id);
                    }
                }
                //Trigger alarm screen refresh when alarm is removed
                setDeleteCard(true);
            }
        } catch (error) {
            console.log(error);
        }
    }

    //Function to process deletion of recurring alarms based on user selection - delete single/delete all
    async function processAlarmDeletion() {

        if (radioChecked == "single") {
            deleteAlarm(alarm_id);
        } else if (radioChecked == "multiple") {
            if (isParent !== false) {
                deleteAlarm(alarm_id);
                deleteRecurringAlarms(alarm_id);
            } else {
                deleteAlarm(parent);
                deleteRecurringAlarms(parent);
            }
        }
        setModalVisible(false);
    }

    //Function to re-schedule local notifications which have previously been disabled
    async function updateNotification() {

        let selectedPlot = null;

        if (gardenName !== null) {
            let label = gardenName + ": Plot " + plot_number;
            selectedPlot = garden_id + ":" + plot_number + ":" + label;
        }

        notification_id = await ScheduleNotification(title, selectedPlot, date);

        try {
            const response = await axios.put("/alarm/updateNotificationID", {
                "alarm_id": alarm_id,
                "notification_id": notification_id
            },
                { responseType: 'json' });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View>

            <Modal
                isVisible={modalVisible}
                backdropOpacity={0.5}
                onBackdropPress={toggleModal}
                style={styles.modal}
            >
                <View>

                    <Text style={styles.warning}>This is a recurring alarm. Please select:</Text>

                    <RadioButton.Group
                        onValueChange={(value) => setRadioChecked(value)}
                        value={radioChecked}
                    >
                        <RadioButton.Item label="Delete single alarm" value="single" />
                        <RadioButton.Item label="Delete all related alarms" value="multiple" />
                    </RadioButton.Group>

                    <View style={styles.navigationButtons}>
                        <TouchableOpacity style={styles.cancelButton} onPress={toggleModal}>
                            <Text style={styles.buttonText}>CANCEL</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cancelButton} onPress={processAlarmDeletion}>
                            <Text style={styles.buttonText}>DELETE</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>

            <View style={styles.card}>
                <View style={styles.cardContent}>

                    <View>
                        <Text style={styles.time}>{time}</Text>
                        <Text>{title}</Text>

                        {
                            gardenName !== null ?
                                <Text>{gardenName}, Plot {plot_number + 1}</Text>
                                : null
                        }
                    </View>

                    <View>
                        <View style={styles.iconControl}>

                            <TouchableOpacity style={styles.icon}>
                                {
                                    isParent == true || parent !== null ?
                                        <Ionicons name="ios-trash-outline" size={26} color="red" onPress={toggleModal} />
                                        :
                                        <Ionicons name="ios-trash-outline" size={26} color="red" onPress={() => {
                                            deleteAlarm(alarm_id);
                                        }} />
                                }
                            </TouchableOpacity>

                            <Switch
                                trackColor={{ false: "#767577", true: "#80C1E3" }}
                                thumbColor={isEnabled ? "#f4f3f4" : "#f4f3f4"}
                                onValueChange={toggleSwitch}
                                value={isEnabled}
                            />

                        </View>

                        {
                            complete ?
                                <TouchableOpacity onPress={() => updateCompletionStatus()} >
                                    <Text style={styles.done}>Done <Ionicons name="checkmark-circle-outline" size={18} color="grey" /></Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => updateCompletionStatus()} >
                                    <Text style={styles.markAsDone}>Mark as done <Ionicons name="checkmark-circle-outline" size={18} color="green" /></Text>
                                </TouchableOpacity>
                        }

                    </View>

                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    modal: {
        alignSelf: "stretch",
        flex: 0,
        justifyContent: "center",
        borderRadius: 15,
        elevation: 5,
        marginHorizontal: 15,
        marginVertical: 8,
        height: "40%",
        backgroundColor: "white"
    },
    warning: {
        textAlign: "center",
        marginHorizontal: 10,
        fontSize: 18,
        fontWeight: "bold",
        color: "red"
    },
    navigationButtons: {
        flexDirection: "row",
        flex: 2,
        justifyContent: "center",
        marginTop: 10
    },
    cancelButton: {
        backgroundColor: "red",
        height: 40,
        width: 100,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        margin: 10
    },
    buttonText: {
        color: "white",
        fontSize: 16
    },
    card: {
        alignSelf: "stretch",
        borderRadius: 15,
        elevation: 5,
        marginHorizontal: 15,
        marginVertical: 8,
        backgroundColor: "white"
    },
    cardContent: {
        marginHorizontal: 18,
        marginVertical: 20,
        flexDirection: "row",
        flex: 2,
        justifyContent: "space-between"
    },
    time: {
        fontSize: 15,
        fontWeight: "bold"
    },
    iconControl: {
        flexDirection: "row",
        flex: 2,
        alignSelf: "flex-end",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    icon: {
        marginRight: 8
    },
    markAsDone: {
        color: "green",
        alignItems: "center",
        justifyContent: "flex-end"
    },
    done: {
        color: "grey",
        alignItems: "center",
        justifyContent: "flex-end"
    }
});

export default AlarmCard;