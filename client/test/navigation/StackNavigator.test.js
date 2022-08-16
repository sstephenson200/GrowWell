import React from "react";
import { act, create } from "react-test-renderer";
import { NavigationContainer } from "@react-navigation/native";

import StackNavigator from "../../src/app/navigation/StackNavigator";
import AuthContext from "../../src/app/context/AuthContext";

describe("<StackNavigator />", () => {

    it("shows login, signup and password reset screens when logged out", async () => {

        let expectedNumberOfScreens = 3;

        let tree;
        await act(async () => {
            tree = create(
                <AuthContext.Provider value={{ loggedIn: false }}>
                    <NavigationContainer>
                        <StackNavigator />
                    </NavigationContainer>
                </AuthContext.Provider>
            );
        });

        let screens = tree.root.findByProps({ testID: "stackNavigator" }).props.children.props.children;
        let actualNumberOfScreens = screens.length;

        let loginScreen = screens[0].props.testID;
        let signUpScreen = screens[1].props.testID;
        let passwordResetScreen = screens[2].props.testID;

        expect(loginScreen).toEqual("loginScreen");
        expect(signUpScreen).toEqual("signUpScreen");
        expect(passwordResetScreen).toEqual("passwordResetScreen");
        expect(actualNumberOfScreens).toEqual(expectedNumberOfScreens);
    });


    it("hides login, signup and password reset screens when logged in", async () => {

        let expectedNumberOfScreens = 6;

        let tree;
        await act(async () => {
            tree = create(
                <AuthContext.Provider value={{ loggedIn: true }}>
                    <NavigationContainer>
                        <StackNavigator />
                    </NavigationContainer>
                </AuthContext.Provider>
            );
        });

        let loginScreen = tree.root.findAll(n => n.props.testID === "loginScreen" && n.type === "Stack.Screen").length;
        let signUpScreen = tree.root.findAll(n => n.props.testID === "signUpScreen" && n.type === "Stack.Screen").length;
        let passwordResetScreen = tree.root.findAll(n => n.props.testID === "passwordResetScreen" && n.type === "Stack.Screen").length;
        let actualNumberOfScreens = tree.root.findByProps({ testID: "stackNavigator" }).props.children.props.children.length;

        expect(loginScreen).toEqual(0);
        expect(signUpScreen).toEqual(0);
        expect(passwordResetScreen).toEqual(0);
        expect(actualNumberOfScreens).toEqual(expectedNumberOfScreens);
    });

});