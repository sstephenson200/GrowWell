<!-- HEADING -->
<br />
<div align="center">
  <a href="https://github.com/sstephenson200/GrowWelle">
    <img src="client/src/app/assets/images/logo.png" alt="Logo" width="120" height="120">
  </a>
  <h1 align="center">Grow Well: Garden Manager</h1>
</div>

<!-- CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#technology">Technology</a></li>
      </ul>
    </li>
    <li>
      <a href="#getStarted">Get Started</a>
      <ul>
        <li><a href="#requirements">Requirements</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li>
      <a href="#contribute">Contribute</a>
      <ul>
        <li><a href="#Code Structure">Code Structure</a></li>
        <li><a href="#Expo Go">Expo Go</a></li>
        <li><a href="#Generate APK">Generate APK</a></li>
      </ul>
    </li>
    <li>
      <a href="#apis">APIs</a>
      <ul>
        <li><a href="#alarm">Alarm</a></li>
        <li><a href="#garden">Garden</a></li>
        <li><a href="#plant">Plant</a></li>
        <li><a href="#note">Note</a></li>
        <li><a href="#user">User</a></li>
      </ul>
    </li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project


Grow Well: Garden Manager is a mobile application designed to enhance the gardening experience. It provides preliminary information on various plant species for beginner gardeners, and assists more experienced users with the management of more complex projects through the use of note and alarm creation. 

<p align="center">
<img width="500" height="500" src="https://user-images.githubusercontent.com/22751349/186003280-3f8d8b83-f8c3-4c98-ac36-d81efd59ca53.png">
</p>

Grow Well is currently tested for Android devices but should also be compatible with Apple OS.

### Technology

This project was built with the following technology, with the server code being hosted on Heroku.

* MongoDB
* Express
* React Native
* Node JS

<!-- GET STARTED -->
## Get Started

Currently, this application is only available for Android devices. However, an Apple compatible application package could be easily generated and tested in the future. 

### Requirements

The following steps may be required to allow successful download of the Android Package Kit.

#### Enable USB File Transfer

If transferring the downloaded APK from a PC to an Android device, USB preferences must be updated.

1.	Connect device to PC via USB cable.
2.	Tap the <strong>Charging this device via USB</strong> notification.
3.	Under <strong>Use USB for</strong>, select <strong>File Transfer</strong>.

####	Enable Third Party Apps

As the APK is not currently available through standard app stores, the device must have third party app installation enabled.

1.	Open device <strong>Settings</strong>. 
2.	Tap <strong>Apps</strong>.
3.	Tap <strong>Special app access</strong>.
4.	Tap <strong>Install unknown apps</strong>.
5.	Tap <strong>Files</strong>.
6.	Enable <strong>Allow from this source</strong>.

### Installation

To install the application on an Android device, please complete the following steps.

1.	Download the Android Package Kit onto your Android device: [LINK].
2.	Open <strong>Downloads</strong>.
3.	Tap the Grow Well APK file.
4.	Tap <strong>Install</strong>. 

<!-- USAGE -->
## Usage

<!-- CONTRIBUTE -->
## Contribute

Server-side code is hosted on a live Heroku instance. This can be debugged by running locally. The client-side code must be run through Expo Go or by installing an APK on the device.

####	Code Structure

####	Expo Go

To continue development, you will need to download Expo Go onto an Android device.

#####	Run the App

The app can be run in two modes: <strong>expo start</strong> or <strong>expo start --no-dev –minify</strong>. <strong>expo start --no-dev --minify</strong> is a better representation of production mode. This should be used to check for errors before generating an APK. In the event of invisible errors, this mode will prevent the application from fully loading.  

1.	Open the client folder in an IDE.
2.	Execute <strong>expo start</strong> or <strong>expo start --no-dev –minify</strong>.
3.	Open Expo Go.
4.	Scan the generated QR code to open the app.

#####	Run the App in Debug Mode

To debug the client-side code, debugging mode must be enabled on your device and through Expo Go. After the below set-up, breakpoints can be added and the code can be debugged as normal.

1.	Open device <strong>Settings</strong>. 
2.	Tap <strong>About phone</strong>.
3.	Tap <strong>Build number 7</strong> times until Developer mode enabled is displayed.
4.	Return to <strong>Settings</strong>.
5.	Tap <strong>System</strong>.
6.	Tap <strong>Developer options</strong>.
7.	Enable <strong>USB debugging</strong> and/or <strong>Wireless debugging</strong>.
8.	Open the app in Expo Go.
9.	Shake device to reveal developer menu, or press <strong>Ctrl</strong> + <strong>M</strong> if using an emulator.
10.	Tap <strong>Debug JS Remotely</strong>.

#####	Common Issues

*	If the exponent bundle is regenerated, the stated entry point in the app.json file may be automatically updated. This will prevent the app from correctly rendering. Please ensure the following is included in app.json: 

```
{
  "expo": {
    "entryPoint": "./index.js"
  }
}
```
* Expo may produce invisible errors which are not visible in debug mode. Regularly run the code with <strong>expo start --no-dev –minify</strong> to ensure the app is still able to render correctly.

####	Generate APK

To continue, you will need to sign up for an Expo account: https://expo.dev. You may be prompted to login during the following steps.

1.	Open a terminal and navigate to the client folder.
2.	Execute <strong>expo build: android</strong>. 
3.	Select build type: <strong>apk</strong>.
4.	Open Expo in a browser and navigate to <strong>Projects</strong> > <strong>Grow Well: Garden Manager</strong> > <strong>Builds</strong>.
5.	Click on the latest build and download the APK upon completion.
6.	Install the APK onto a new Android device.

<!-- APIs -->
## APIs

####	Alarm

####	Garden

####	Plant

####	Note

####	User
