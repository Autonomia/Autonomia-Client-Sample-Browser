
// React
import React from "react"
import { Grid, Cell,
    Card, CardTitle, CardText, CardActions, 
    List, ListItem, ListItemContent, ListItemAction,
    DataTable, TableHeader,
    Checkbox, Radio, Switch, IconButton, Button, Icon, Textfield
} from "react-mdl"

let AutonomiaSdk = Autonomia.Client.Sdk;
let AutonomiaLogging = AutonomiaSdk.Helpers.Logging;

// App
import VideoPlayer from "../components/VideoPlayer"

export default class VideoUrlTest extends React.Component {
    rtmpValueChanged(e) {
        this.setState({
            ...this.state,
            RtmpStreamUrl1: e.target.value
        });
    }

    tryRtmpStream() {
        var thisRef = this;

        this.setState({
            ...this.state,
            RtmpStreamUrl2: this.state.RtmpStreamUrl1
        })

        clearInterval(this._intervalId);
        this._intervalId = setInterval(() => {
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


    // @ React Overrides
    // ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~
    constructor () {
        super();

        this.state = {
            RtmpStreamUrl1: "",
            RtmpStreamUrl2: "",

            VideoStreamWidth: "100%",
            VideoStreamHeight: "500px"
        };
    
        this._intervalId = null;
        this._videoContanerId = AutonomiaSdk.Helpers.NewGuid();
        this._videoId = AutonomiaSdk.Helpers.NewGuid();
    }

    render() {
        return (
            <div>
                <br/><br/><br/><br/><br/>
                <Grid>
                    <Cell col={1}></Cell>
                    <Cell col={10} id={this._videoContanerId}>
                        <Card shadow={3} style={{width: "100%"}}>
                            <CardTitle>
                                <Textfield
                                    value={this.state.RtmpStreamUrl1}
                                    onChange={this.rtmpValueChanged.bind(this)}
                                    label="RTMP Stream"
                                    floatingLabel
                                    style={{width: "100%", fontSize: "2em"}} />
                            </CardTitle>
                            <CardText style={{width: "100%", padding: "0"}}>
                                <VideoPlayer
                                    id={this._videoId}
                                    width={this.state.VideoStreamWidth}
                                    height={this.state.VideoStreamHeight}
                                    rtmp={this.state.RtmpStreamUrl2} />
                            </CardText>
                            <CardActions border>
                                <Grid>
                                    <Cell col={11}>
                                    </Cell>
                                    <Cell col={1}>
                                        <Button raised colored ripple onClick={this.tryRtmpStream.bind(this)}>Try It</Button>
                                    </Cell>
                                </Grid>
                            </CardActions>
                        </Card>
                    </Cell>
                    <Cell col={1}></Cell>
                </Grid>
            </div>
        )
    }

    componentWillUnmount() {
        clearInterval(this._intervalId);
    }
}
