
// React & Small libs
import React from "react"
import JSONTree from "react-json-tree"
import { hashHistory } from "react-router"

// React-MDL
import { Grid, Cell,
    Card, CardTitle, CardText, CardActions, 
    List, ListItem, ListItemContent, ListItemAction,
    DataTable, TableHeader,
    Checkbox, Radio, Switch, IconButton, Button, Icon,
    Tabs, Tab
} from "react-mdl"

// Autonomia
let AutonomiaSdk = Autonomia.Client.Sdk;
let AutonomiaLogging = AutonomiaSdk.Helpers.Logging;

// App
import VideoPlayer from "../components/VideoPlayer"
import { Globals } from "../components/Globals"

export default class Home extends React.Component {

    // @ Helpers
    // ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~

    ShowPropertiesForDevice(deviceId) {
        var thisRef = this;

        thisRef.state.Devices.forEach((device) => {
            if (device.Id === deviceId) {
                thisRef.ActiveDevice = AutonomiaSdk.Helpers.CloneObject(device);
            }
        });

        var videoUrl = thisRef.ActiveDevice.Cameras[0].StreamUrl;
        var lastFrameUrl = thisRef.ActiveDevice.Cameras[0].LastPicUrl;
        thisRef.setState({
            ...thisRef.state,
            VideoStream: videoUrl,
            LastPictureUrl: lastFrameUrl,
            Logs: [{
                When: (new Date()).toLocaleString(),
                What: "Displaying: " + thisRef.ActiveDevice.Id + ", Video: " + videoUrl + ", Last Frame: " + lastFrameUrl
            }].concat(thisRef.state.Logs),
        });

        clearInterval(thisRef._intervalId);
        thisRef._intervalId = setInterval(() => {
            var elementWidth = document.getElementById(thisRef._videoContanerId).offsetWidth;

            var videoWidth = elementWidth;
            var videoHeight = Math.round((videoWidth/16)*9);

            thisRef.setState({
                ...thisRef.state, 
                VideoStreamWidth: videoWidth + "px",
                VideoStreamHeight: videoHeight + "px"
            });
        }, 1000);
    }

    RemoteExecuteCommand(deviceId) {
        this._autonomia.Execute(deviceId, {
            Method: "get_info",
            Params: {}
        });
    }


    // @ Autonomia Device Events
    // ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~

    DeviceConnected(deviceId) {
        var thisRef = this;

        var devicesClone = AutonomiaSdk.Helpers.CloneObject(thisRef.state.Devices);
        devicesClone.forEach((device) => {
            if (device.Id === deviceId) {
                device.IsConnected = true;
            }
        });

        thisRef.setState({
            ...thisRef.state,
            Logs: [{
                When: (new Date()).toLocaleString(),
                What: "Connected: " + deviceId
            }].concat(thisRef.state.Logs),
            Devices: devicesClone
        });
    }
    DeviceDisconnected(messageObject) {
        var thisRef = this;

        var devicesClone = AutonomiaSdk.Helpers.CloneObject(thisRef.state.Devices);
        devicesClone.forEach((device) => {
            if (device.Id === messageObject.DeviceId) {
                device.IsConnected = false;
            }
        });

        thisRef.setState({
            ...thisRef.state,
            Logs: [{
                When: (new Date()).toLocaleString(),
                What: "Disconnected: " + messageObject.DeviceId + ", Reason: " + messageObject.Reason
            }].concat(thisRef.state.Logs),

            Devices: devicesClone
        });
    }
    DeviceConnectionError(deviceId, error) {
        var thisRef = this;

        thisRef.setState({
            ...thisRef.state,
            Logs: [{
                When: (new Date()).toLocaleString(),
                What: "ConnectionError: " + deviceId + " -> " + error
            }].concat(thisRef.state.Logs)
        });
    }
    DeviceMessage(deviceId, message) {
        var thisRef = this;

        if (message.hasOwnProperty("jsonrpc")) {
            console.log(JSON.stringify(message));

            this.setState({
                ...thisRef.state, 
                DeviceRpcResult: message.result
            });
        }
        else {
            if (thisRef.ActiveDevice.Id === deviceId) {
                this.setState({
                    ...this.state, 
                    DeviceMessages: message,
                    DeviceMessagesTimeStamp: (new Date()).toLocaleString()
                });
            }
        }
    }
    DeviceInvalidMessage(data) {
        var thisRef = this;

        thisRef.setState({
            ...this.state, 
            Logs: [{
                When: (new Date()).toLocaleString(),
                What: "Ivalid Message -> " + data
            }].concat(thisRef.state.Logs)
        });
    }


    // @ React Overrides
    // ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~

    constructor() {
        super();

        var thisRef = this;

        this.state = {
            VideoStream: "",
            VideoStreamWidth: "100%",
            VideoStreamHeight: "500px",

            LastPictureUrl: "",

            DeviceId: "",
            Logs: [],
            DeviceMessages: {},

            DeviceMessagesTimeStamp: "",

            Devices: [],

            DeviceRpcResult: "",
            
            ActiveTab: 0
        };

        this._intervalId = null;
        this.ActiveDevice = {};

        this.readSettings();
    }

    readSettings() {
        var thisRef = this;

        var settingsContainer = {};
        let settings = new AutonomiaSdk.Helpers.Persisters.LocalStoragePersister(Globals.SettingsKey);

        AutonomiaSdk.Helpers.Tasks.Run()
            .This((done) => {
                settings.Read(settingsContainer, done);
            })
            .Then((done) => {
                if (
                    AutonomiaSdk.Helpers.IsNullOrEmpty(settingsContainer.data)
                    || AutonomiaSdk.Helpers.IsNullOrEmpty(settingsContainer.data.AppKey)
                    || AutonomiaSdk.Helpers.IsNullOrEmpty(settingsContainer.data.AppSecret)
                    || AutonomiaSdk.Helpers.IsNullOrEmpty(settingsContainer.data.Server)
                ) {
                    setTimeout(() => {
                        done.abort();
                    },0);

                    // This will redirect to the "Config" page
                    hashHistory.push("/Config");
                }
                else {
                    done();
                }
            })
            .Then((done) => {
                thisRef.connectToAutonomia(settingsContainer.data);
                done();
            })
            .OnError((error) => {
                AutonomiaLogging.Console().Log(new Logging.LogEntity(
                    Logging.LogType.Error,
                    error
                ));
            });
    }

    connectToAutonomia(settings) {
        var thisRef = this;

        this._videoContanerId = AutonomiaSdk.Helpers.NewGuid();
        this._videoId = AutonomiaSdk.Helpers.NewGuid();

        this._autonomiaConfig = new AutonomiaSdk.Config();
        this._autonomiaConfig.AppKey = settings.AppKey;
        this._autonomiaConfig.AppSecret = settings.AppSecret;
        this._autonomiaConfig.Server = settings.Server;

        this._autonomia = new AutonomiaSdk.Client(this._autonomiaConfig);

        this._autonomia.Events.DeviceConnected.OnHappen((deviceId) => {
            thisRef.DeviceConnected(deviceId);
        });
        this._autonomia.Events.DeviceDisconnected.OnHappen((messageObject) => {
            thisRef.DeviceDisconnected(messageObject);
        });
        this._autonomia.Events.DeviceConnectionError.OnHappen((messageObject) => {
            thisRef.DeviceConnectionError(messageObject.DeviceId, messageObject.Error);
        });
        this._autonomia.Events.DeviceMessage.OnHappen((messageObject) => {
            thisRef.DeviceMessage(messageObject.DeviceId, messageObject.Message);
        });
        this._autonomia.Events.DeviceInvalidMessage.OnHappen((data) => {
            thisRef.DeviceInvalidMessage(data);
        });

        var foundDevices = [];
        AutonomiaSdk.Helpers.Tasks.Run()
            .This((done) => {
                thisRef.setState({
                    ...thisRef.state, 
                    Logs: [{
                        When: (new Date()).toLocaleString(),
                        What: "Connect()"
                    }].concat(thisRef.state.Logs)
                });

                thisRef._autonomia.Connect(done);
            })
            .Then((done) => {
                thisRef.setState({
                    ...thisRef.state, 
                    Logs: [{
                        When: (new Date()).toLocaleString(),
                        What: "GetDevices()"
                    }].concat(thisRef.state.Logs),
                });

                thisRef._autonomia.GetDevices(done, foundDevices);
            })
            .Then((done) => {
                var logLines = thisRef.state.Logs;

                foundDevices.forEach((device) => {
                    logLines.unshift({
                        When: (new Date()).toLocaleString(),
                        What: "Found -> " + device.Id
                    });
                });

                logLines.unshift({
                    When: (new Date()).toLocaleString(),
                    What: "GetNotificationsForDevices()"
                });

                thisRef.setState({
                    ...thisRef.state, 
                    Devices: foundDevices,
                    Logs: logLines
                });

                thisRef._autonomia.GetNotificationsForDevices(foundDevices);
            })
            .OnError((error) => {
                thisRef.setState({
                    ...thisRef.state, 
                    Logs: [{
                        When: (new Date()).toLocaleString(),
                        What: "OnError()" + error
                    }].concat(thisRef.state.Logs)
                });
            });
    }

    render() {
        var thisRef = this;

        const theme = {
            // scheme: 'monokai',
            // author: 'wimer hazenberg (http://www.monokai.nl)',
            base00: '#272822',
            base01: '#383830',
            base02: '#49483e',
            base03: '#75715e',
            base04: '#a59f85',
            base05: '#f8f8f2',
            base06: '#f5f4f1',
            base07: '#f9f8f5',
            base08: '#f92672',
            base09: '#fd971f',
            base0A: '#f4bf75',
            base0B: '#a6e22e',
            base0C: '#a1efe4',
            base0D: '#66d9ef',
            base0E: '#ae81ff',
            base0F: '#cc6633'
        };

        var devices = [];
        thisRef.state.Devices.forEach((device) => {
            if (device.IsConnected) {
                devices.push(
                    <ListItem>
                        <ListItemContent>
                            <image src="images/online.png" class="status-icon" />
                            <span>&nbsp;</span>
                            {device.Id}
                        </ListItemContent>
                        <ListItemAction>
                            <Button raised colored ripple onClick={() => {thisRef.RemoteExecuteCommand(device.Id)}}>
                                <Icon name="flash_on" />
                                <span>&nbsp;</span>
                                R-Exec
                            </Button>

                            <span>&nbsp;</span><span>&nbsp;</span>

                            <Button raised colored ripple onClick={() => {thisRef.ShowPropertiesForDevice(device.Id)}}>
                                <Icon name="bug_report" />
                                <span>&nbsp;</span>
                                Props
                            </Button>
                        </ListItemAction>
                    </ListItem>
                );
            }
            else {
                devices.push(
                    <ListItem>
                        <ListItemContent>
                            <image src="images/offline.png" class="status-icon" />
                            <span>&nbsp;</span>
                            {device.Id}
                        </ListItemContent>
                        <ListItemAction>
                        </ListItemAction>
                    </ListItem>
                );                
            }
        });

        var activeTabContent = "";
        if (this.state.ActiveTab === 0) {
            activeTabContent =
            <div>
                Updated &nbsp; @ &nbsp; {this.state.DeviceMessagesTimeStamp}
                <JSONTree 
                    data={this.state.DeviceMessages} 
                    theme={{
                        extend: theme,
                        valueLabel: {
                            fontSize: "1.8em"
                        },
                        nestedNodeLabel: {
                            fontSize: "1.8em"
                        }   
                    }}>
                </JSONTree>
            </div>
        }
        else if (this.state.ActiveTab === 1) {
            activeTabContent =
            <pre style={{width: "100%", height: "100%"}}>
                {this.state.DeviceRpcResult}
            </pre>
        }

        return (
            <Grid>
                <Cell col={6} id={this._videoContanerId}>
                    <Card shadow={10} style={{width: "100%"}}>
                        <CardText style={{padding: "0", width: "100%"}}>
                            <VideoPlayer
                                id={this._videoId}
                                width={this.state.VideoStreamWidth}
                                height={this.state.VideoStreamHeight}
                                rtmp={this.state.VideoStream} />

                            {/*<img src={this.state.LastPictureUrl} style={{width: "100px", height: "100px"}} />*/}
                        </CardText>
                    </Card>

                    <br/>
                    <Card shadow={6} style={{width: "100%"}}>
                        <CardTitle>Registered Devices</CardTitle>
                        <CardText style={{padding: "0", width: "100%", height: "300px",  overflowY: "scroll", fontSize: "1.3em", lineHeight: "1.3em"}}>
                            <List>
                                {devices}
                            </List>
                        </CardText>
                    </Card>

                    <br/>
                    <Card shadow={6} style={{width: "100%"}}>
                        <CardTitle>Logs</CardTitle>
                        <CardText style={{padding: "0", width: "100%", height: "300px",  overflowY: "scroll", fontSize: "1.3em", lineHeight: "1.3em"}}>
                            <DataTable shadow={0} style={{width: "100%", whiteSpace: "normal", wordWrap: "break-word"}} rows={this.state.Logs}>
                                <TableHeader name="When" style={{display: "none"}}>When</TableHeader>
                                <TableHeader name="What" style={{display: "none"}}>When</TableHeader>
                            </DataTable>
                        </CardText>
                    </Card>
                </Cell>
                <Cell col={6}>
                    <Card shadow={6} style={{width: "100%", height: "100%"}}>
                        <CardText>
                            <Tabs activeTab={this.state.ActiveTab} onChange={(tabId) => this.setState({ ActiveTab: tabId })} ripple>
                                <Tab>Messages &nbsp; @ &nbsp; {this.ActiveDevice.Id}</Tab>
                                <Tab>RPC Result</Tab>
                            </Tabs>
                            <section>
                                {activeTabContent}
                            </section>
                        </CardText>
                    </Card>
                </Cell>
            </Grid>
        )
    }

    componentWillUnmount() {
        clearInterval(this._intervalId);

        if (!AutonomiaSdk.Helpers.IsNullOrEmpty(this._autonomia)) {
            this._autonomia.StopAllDevicesNotifications();
        }
    }
}
