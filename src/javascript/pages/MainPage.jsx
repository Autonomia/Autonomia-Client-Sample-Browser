
// React
import React from "react"
import { connect } from "react-redux"
import { Grid, Row, Col, Modal } from 'react-bootstrap'
import JSONTree from 'react-json-tree'


// Autonomia
/// <reference path="../../../../Autonomia-Helpers-JavaScript/Autonomia-Helpers-JavaScript.d.ts" />
/// <reference path="../../../../Autonomia-REST-JavaScript/Autonomia-REST-JavaScript.d.ts" />
let Logging = Autonomia.Helpers.Logging;

// App
import VideoPlayer from "../components/VideoPlayer"
import { DevicesReducer, DevicesReducerMessages } from "../reducers/DevicesReducer"

@connect((store) => {
    return {
        Devices: store.DevicesReducer
    };
})
export default class MainPage extends React.Component {
    constructor() {
        super();

        var thisRef = this;

        this.state = {
            VideoStream: "",

            DeviceSetup: "",
            DeviceStatus: "",
            DeviceMessages: "",
            DeviceErrors: "",

            DeviceMessagesTimeStamp: ""
        };

        this._device = null;

        this._autonomiaConfig = new Autonomia.Config();
        this._autonomiaConfig.AppKey = "d0353b75b8fa61889d19";
        this._autonomiaConfig.AppSecret = "f4f51e1e6125dcc873e9";
        this._autonomiaConfig.Server = "api.vederly.com";

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

    // Autonomia Device Events
    DeviceConnected(deviceId) {
        Logging.Console().Log(new Logging.LogEntity(Logging.LogType.Debug,
            "Device " + deviceId + " Connected"
        ));

        this.setState({
            ...this.state,
            VideoStream: this._device.Cameras[0].StreamUrl,
            DeviceStatus: ""+(new Date()).toLocaleString()+" | " + "Connected"
        });
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
            DeviceMessagesTimeStamp: "Updated @ " + (new Date()).toLocaleString()
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

    // @ React Override
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
                <Row>
                    <Col md={6}>
                        <Row>
                            <VideoPlayer
                                class="alignCenter"
                                width="100%"
                                height="400px"
                                rtmp={this.state.VideoStream} />
                        </Row>
                        <Row>
                            <div class="static-modal">
                            <Modal.Dialog>
                                <Modal.Header>
                                    <Modal.Title>Setup</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <pre>{this.state.DeviceSetup}</pre>
                                </Modal.Body>
                            </Modal.Dialog>
                            </div>

                            <div class="static-modal">
                            <Modal.Dialog>
                                <Modal.Header>
                                    <Modal.Title>Status</Modal.Title>
                                </Modal.Header>
                                <Modal.Body style={{color: "blue"}}>
                                    {this.state.DeviceStatus}
                                </Modal.Body>
                            </Modal.Dialog>
                            </div>

                            <div class="static-modal">
                            <Modal.Dialog>
                                <Modal.Header>
                                    <Modal.Title>Errors</Modal.Title>
                                </Modal.Header>
                                <Modal.Body style={{color: "red"}}>
                                    {this.state.DeviceErrors}
                                </Modal.Body>
                            </Modal.Dialog>
                            </div>
                        </Row>
                    </Col>
                    <Col md={6}>
                        <div class="static-modal">
                        <Modal.Dialog>
                            <Modal.Header>
                                <Modal.Title>Messages</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div>{this.state.DeviceMessagesTimeStamp}</div>
                                <JSONTree data={this.state.DeviceMessages} theme={theme} />
                            </Modal.Body>
                        </Modal.Dialog>
                        </div>
                    </Col>
                </Row>
            </Grid>
        )
    }

    // @ React Override
    componentDidMount() {
        var thisRef = this;

        var foundDevices = [];

        Autonomia.Helpers.Tasks.Run()
            .This((done) => {
                this.setState({
                    ...this.state, 
                    DeviceSetup: this.state.DeviceSetup + ""+(new Date()).toLocaleString()+" | " + "Connect()"
                });

                thisRef._autonomia.Connect(done);
            })
            .Then((done) => {
                this.setState({
                    ...this.state, 
                    DeviceSetup: this.state.DeviceSetup + "\r\n"+(new Date()).toLocaleString()+" | " + "GetDevices()"
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
                    DeviceSetup: this.state.DeviceSetup + "\r\n"+(new Date()).toLocaleString()+" | " + "GetNotificationsForDevices([" + JSON.stringify(thisRef._device.Id) + "])"
                });

                thisRef._autonomia.GetNotificationsForDevices([thisRef._device]);
            })
            .OnError((error) => {
                this.setState({
                    ...this.state, 
                    DeviceSetup: this.state.DeviceSetup + "\r\n"+(new Date()).toLocaleString()+" | " + "OnError()" + error
                });

                Logging.Console().Log(new Logging.LogEntity(
                    Logging.LogType.Error,
                    error
                ));
            });
    }
}
