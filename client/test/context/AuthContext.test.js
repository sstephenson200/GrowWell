import React from "react";
import { act, create } from "react-test-renderer";
import axios from "axios";

import SplashScreen from "../../src/app/screens/SplashScreen";
import { AuthContextProvider } from "../../src/app/context/AuthContext";

jest.mock("axios");

describe("<AuthContextProvider />", () => {

    it('Shows Splash Screen before LoggedIn is initialised', async () => {

        const resp = {
            status: 200,
            data: null
        };

        axios.get.mockResolvedValue(resp);

        let expectedResult = create(<SplashScreen />).toJSON();
        let tree;

        await act(async () => {
            tree = create(<AuthContextProvider></AuthContextProvider>);
        });

        let actualResult = tree.toJSON();

        expect(actualResult).toEqual(expectedResult);
    });

    it('Shows AuthContextProvider children when LoggedIn is initialised', async () => {

        const resp = {
            status: 200,
            data: true
        };

        axios.get.mockResolvedValue(resp);

        let children = "created";

        let expectedResult = "created";
        let tree;

        await act(async () => {
            tree = create(<AuthContextProvider>{children}</AuthContextProvider>);
        })

        let actualResult = tree.toJSON();

        expect(actualResult).toEqual(expectedResult);
    });

});