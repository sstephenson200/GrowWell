<!-- HEADING -->
<br />
<div align="center">
  <a href="https://github.com/sstephenson200/GrowWell">
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
      <a href="#get-started">Get Started</a>
      <ul>
        <li><a href="#requirements">Requirements</a></li>
          <ul>
            <li><a href="#enable-usb-file-transfer">Enable USB File Transfer</a></li>
            <li><a href="#enable-third-party-apps">Enable Third Party Apps</a></li>
          </ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li>
      <a href="#contribute">Contribute</a>
      <ul>
        <li><a href="#code-structure">Code Structure</a></li>
          <ul>
            <li><a href="#client">Client</a></li>
            <li><a href="#server">Server</a></li>
          </ul>
        <li><a href="#expo-go">Expo Go</a></li>
          <ul>
            <li><a href="#run-the-app">Run the App</a></li>
            <li><a href="#run-the-app-in-debug-mode">Run the App in Debug Mode</a></li>
            <li><a href="#common-issues">Common Issues</a></li>
          </ul>
        <li><a href="#generate-apk">Generate APK</a></li>
      </ul>
    </li>
    <li><a href="#apis">APIs</a></li>
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

The following steps may be required to allow successful download of the Android Package Kit (APK).

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

1.	Download the Android Package Kit onto your Android device: https://drive.google.com/file/d/1vN6bu-oYhNX62iB0l7JSDOkBgIXXLYsq/view?usp=sharing.
2.	Open <strong>Downloads</strong>.
3.	Tap the Grow Well APK file.
4.	Tap <strong>Install</strong>. 

<!-- USAGE -->
## Usage

Grow Well: Garden Manager is a mobile application used to enhance the gardening experience. Some of the core features include:

<h4 align="center">Log in to your account and manage your user settings at any time.</h4>

<p align="center">
<img width="500" height="500" src="https://user-images.githubusercontent.com/22751349/186523566-b0fff34e-c439-4e6d-8a79-dce512a02f2d.png">
</p>

<h4 align="center">Browse plant species and filter by name, plant type and season. View more detailed care data to learn how to grow each plant!</h4>

<p align="center">
<img width="500" height="500" src="https://user-images.githubusercontent.com/22751349/186003280-3f8d8b83-f8c3-4c98-ac36-d81efd59ca53.png">
</p>

<h4 align="center">Create notes on the plants you’re growing and keep track of the tasks you’ve completed. See quick summaries of your created notes on your calendar and view them to see your added photos and further details.</h4>

<p align="center">
<img width="500" height="500" src="https://user-images.githubusercontent.com/22751349/186523286-d361b93d-de03-41be-b656-5faa9ad1e8ed.png">
</p>

<h4 align="center">View your notes by plant and by garden plot.</h4>

<p align="center">
<img width="500" height="500" src="https://user-images.githubusercontent.com/22751349/186523380-0493ecb7-92e3-44ea-9f20-7c6408772a1d.png">
</p>

<h4 align="center">Never forget to water your plants again! Create task reminders which link to your device’s notification system. Make single or recurring alarms, turn them on and off as suits, and mark them as complete to keep track.</h4>

<p align="center">
<img width="500" height="500" src="https://user-images.githubusercontent.com/22751349/186624993-a698c82f-5cc9-4d4f-878b-9db6272a3606.png">
</p>

<h4 align="center">See what you’re growing in each plot and keep track of what you’ve grown there previously.</h4>

<p align="center">
<img width="500" height="500" src="https://user-images.githubusercontent.com/22751349/186625251-ec247307-2eef-4563-be6f-4ccd42d22dcc.png">
</p>

<!-- CONTRIBUTE -->
## Contribute

Server-side code is hosted on a live Heroku instance. This can be debugged by running locally with the command <strong>npm run start</strong>. The server code utilises nodemon to automatically restart the server when a change is detected. The client-side code must be run through Expo Go or by installing an APK on the device.

####	Code Structure

Project code is divided into client and server folders, covering front-end and back-end, respectively.

#####	Client

The client handles content which is rendered on the app. Where possible, components and screens have been divided into Alarm, Garden, Plant, Note and User folders. The main technology used in this section is React Native. Code is divided as follows:

* 	.vscode – Contains launch.json file for use in debug configuration.
* 	src/app/assets – Shared fonts and images.
*   src/app/components – Shared elements, i.e. dropdown menus, cards, etc.
*   src/app/context – Client-side authentication.
*   src/app/navigation – Navigation, through use of a Stack and Tab Navigator.
*   src/app/notifications – Push notification set-up, link to device OS, and scheduling for use in alarm task reminders.
*   src/app/requests – Shared endpoints and result manipulation.
*   src/app/screens – Main app screens, including pre-defined components and requests.
*   src/app/styles – Shared styles.
*   Test – Client integration tests.
*   App.js – Core application structure.
*   app.json – Environment variables, plugins, etc.

Tests are placed in the test folder which mirrors the hierarchy of the client folder. For example, tests for alarm components should be placed in test/components/Alarm, with testable code being found in src/app/components/Alarm. 

#####	Server

The server defines requests to the database, with endpoints being focused on Alarm, Garden, Plant, Note and User. Specific endpoints are further defined in the API section, below. The main technology used in this section is Express. Code is divided as follows:

* models – Mongoose schema definitions.
* routers – Database route definitions with validation.
* controllers – Endpoint definitions, with accompanying validation and business logic.
* repositories – Mongoose queries for use in production and accompanying mocked data for use in testing.  
*	mailer – Nodemailer set-up for use in password reset function.
*	middleware – Server-side authentication and image upload processing.
*	validators – Repeated validation and business logic methods.
*	test – Server-side unit tests.
*	index.js – Server entry point, handling the database connection.

To add a new request, create a new method in the relevant controller and link to the router file. 

Testing is not exhaustive at this stage and more methods may need to be added to the repository and accompanying mock repository files to expand testing. Tests are placed in the test folder which mirrors the hierarchy of the server folder. For example, tests for controllers should be placed in test/controllers, with testable code being found in the controllers folder. 

####	Expo Go

To continue development, you will need to download Expo Go onto an Android device.

#####	Run the App

The app can be run in two modes: <strong>expo start</strong> or <strong>expo start --no-dev –minify</strong>. <strong>expo start --no-dev --minify</strong> mimics production mode. This should be used to check for errors before generating an APK. In the event of invisible errors, this mode will prevent the application from fully loading.  

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

API documentation, including a full list of all available endpoints, is provided here: https://documenter.getpostman.com/view/19379045/VUquKExX.
