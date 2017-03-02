
// React
import React from "react"
import { connect } from "react-redux"
import JSONTree from "react-json-tree"
import { hashHistory } from "react-router"
import { Grid, Cell, Card, CardTitle, CardText, CardActions} from "react-mdl"

// Autonomia
// / <reference path="../../../../Autonomia-Helpers-JavaScript/Autonomia-Helpers-JavaScript.d.ts" />
// / <reference path="../../../../Autonomia-REST-JavaScript/Autonomia-REST-JavaScript.d.ts" />
let Logging = Autonomia.Helpers.Logging;

// App
import VideoPlayer from "../components/VideoPlayer"
import { DevicesReducer, DevicesReducerMessages } from "../reducers/DevicesReducer"
import { Globals } from "../components/Globals"

@connect((store) => {
    return {
        Devices: store.DevicesReducer
    };
})
export default class Home extends React.Component {

    // @ Autonomia Device Events
    // ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~

    DeviceConnected(deviceId) {
        var thisRef = this;

        Logging.Console().Log(new Logging.LogEntity(Logging.LogType.Debug,
            "Device " + deviceId + " Connected"
        ));

        this.setState({
            ...this.state,
            VideoStream: this._device.Cameras[0].StreamUrl,
            DeviceStatus: "" + (new Date()).toLocaleString() + " | " + "Connected",
            DeviceErrors: ""
        });

        setInterval(() => {
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
    DeviceDisconnected(messageObject) {
        Logging.Console().Log(new Logging.LogEntity(Logging.LogType.Debug,
            "Device " + messageObject.DeviceId + " Disconnected"
        ));

        this.setState({
            ...this.state, 
            DeviceStatus: ""+(new Date()).toLocaleString()+" | " + "Disconnected. Reason: " + messageObject.Reason
        });
    }
    DeviceConnectionError(deviceId, error) {
        Logging.Console().Log(new Logging.LogEntity(Logging.LogType.Error,
            "Connection Error " + deviceId + " -> " + error
        ));

        this.setState({
            ...this.state, 
            DeviceErrors: ""+(new Date()).toLocaleString()+" | " + error
        });
    }
    DeviceMessage(deviceId, message) {
        Logging.Console().Log(new Logging.LogEntity(Logging.LogType.Debug,
            "Message From " + deviceId + " -> " + JSON.stringify(message)
        ));

        this.setState({
            ...this.state, 
            DeviceMessages: message,
            DeviceMessagesTimeStamp: (new Date()).toLocaleString()
        });
    }
    DeviceInvalidMessage(data) {
        Logging.Console().Log(new Logging.LogEntity(Logging.LogType.Debug,
            "Ivalid Message -> " + data
        ));

        this.setState({
            ...this.state, 
            DeviceErrors: ""+(new Date()).toLocaleString()+" | " + data
        });
    }

    // @ React Overrides
    // ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~

    constructor() {
        super();

        this.state = {
            VideoStream: "",
            VideoStreamWidth: "100%",
            VideoStreamHeight: "500px",

            DeviceSetup: "",
            DeviceStatus: "",
            DeviceMessages: {},
            DeviceErrors: "",

            DeviceMessagesTimeStamp: ""
        };

        var settingsContainer = {};
        let settings = new Autonomia.Helpers.Persisters.LocalStoragePersister(Globals.SettingsKey);

        Autonomia.Helpers.Tasks.Run()
            .This((done) => {
                settings.Read(settingsContainer, done);
            })
            .Then((done) => {
                if (
                    Autonomia.Helpers.IsNullOrEmpty(settingsContainer.data)
                    || Autonomia.Helpers.IsNullOrEmpty(settingsContainer.data.AppKey)
                    || Autonomia.Helpers.IsNullOrEmpty(settingsContainer.data.AppSecret)
                    || Autonomia.Helpers.IsNullOrEmpty(settingsContainer.data.Server)
                ) {
                    setTimeout(()=>{
                        done.abort();
                    },0);

                    // This will redirect to the "Config" page
                    hashHistory.push("/Config");
                }
            })
            .Then((done) => {
                constructorHelper(settings);
                done();
            })
            .OnError((error) => {
                Logging.Console().Log(new Logging.LogEntity(
                    Logging.LogType.Error,
                    error
                ));
            });
    }

    constructorHelper(settings) {

        // If we get here means we have settings

        var thisRef = this;


        this._device = null;

        this._videoContanerId = Autonomia.Helpers.NewGuid();
        this._videoId = Autonomia.Helpers.NewGuid();

        this._autonomiaConfig = new Autonomia.Config();
        this._autonomiaConfig.AppKey = settings.AppKey;
        this._autonomiaConfig.AppSecret = settings.AppSecret;
        this._autonomiaConfig.Server = settings.Server;

        this._autonomia = new Autonomia.Api(this._autonomiaConfig);

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
                        </CardText>
                    </Card>
                    
                    <br/>
                    <Card shadow={6} style={{width: "100%"}}>
                        <CardTitle>Setup</CardTitle>
                        <CardText style={{fontSize: "1.3em", lineHeight: "1.3em"}}>
                            <pre>{this.state.DeviceSetup}</pre>
                        </CardText>
                    </Card>

                    <br/>
                    <Card shadow={6} style={{width: "100%"}}>
                        <CardTitle>Status</CardTitle>
                        <CardText style={{fontSize: "1.5em", lineHeight: "1.2em", color: "blue"}}>
                            {this.state.DeviceStatus}
                        </CardText>
                    </Card>

                    <br/>
                    <Card shadow={6} style={{width: "100%"}}>
                        <CardTitle>Errors</CardTitle>
                        <CardText style={{fontSize: "1.5em", lineHeight: "1.2em", color: "red"}}>
                            {this.state.DeviceErrors}
                        </CardText>
                    </Card>
                </Cell>
                <Cell col={6}>
                    <Card shadow={6} style={{width: "100%", height: "100%"}}>
                        <CardTitle>
                            Messages 
                        </CardTitle>
                        <CardText>
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
                            }}></JSONTree>
                        </CardText>
                        <CardActions border>
                            Updated &nbsp; @ &nbsp; {this.state.DeviceMessagesTimeStamp}
                        </CardActions>
                    </Card>
                </Cell>
            </Grid>
        )
    }

    componentDidMount() {
        var thisRef = this;

        var foundDevices = [];

        Autonomia.Helpers.Tasks.Run()
            .This((done) => {
                this.setState({
                    ...this.state, 
                    DeviceSetup: this.state.DeviceSetup + "" + (new Date()).toLocaleString() + " | " + "Connect()"
                });

                thisRef._autonomia.Connect(done);
            })
            .Then((done) => {
                this.setState({
                    ...this.state, 
                    DeviceSetup: this.state.DeviceSetup + "\r\n" + (new Date()).toLocaleString() + " | " + "GetDevices()"
                });

                thisRef._autonomia.GetDevices(done, foundDevices);
            })
            .Then((done) => {
                Logging.Console().Log(new Logging.LogEntity(Logging.LogType.Debug,
                    "Devices Found:"
                ));

                foundDevices.forEach((device) => {
                    Logging.Console().Log(new Logging.LogEntity(Logging.LogType.Debug,
                        "    Id: " + device.Id + ", Type: " + device.Type + ", IsConnected: " + device.IsConnected
                    ));
                });

                // Pick One
                foundDevices.forEach((device) => {
                    if (device.Id === "70AFEE092C5E1") {
                        thisRef._device = device;
                    }
                });

                this.setState({
                    ...this.state, 
                    DeviceSetup: this.state.DeviceSetup + "\r\n" + (new Date()).toLocaleString() + " | " + "GetNotificationsForDevices([" + JSON.stringify(thisRef._device.Id) + "])"
                });

                thisRef._autonomia.GetNotificationsForDevices([thisRef._device]);
            })
            .OnError((error) => {
                this.setState({
                    ...this.state, 
                    DeviceSetup: this.state.DeviceSetup + "\r\n" + (new Date()).toLocaleString() + " | " + "OnError()" + error
                });

                Logging.Console().Log(new Logging.LogEntity(
                    Logging.LogType.Error,
                    error
                ));
            });
    }
}
