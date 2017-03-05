
import React from "react"
import { Grid, Cell, Card, CardTitle, CardText, CardActions, CardMenu, Button, FABButton, Icon } from "react-mdl"


export default class About extends React.Component {

    // @ Helpers
    // ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~

    shareClicked() {
        window.open("https://twitter.com/AutonomiaIO", "_blank");
    }
    getStartedClicked() {
        window.open("https://developer.autonomia.io", "_blank");
    }

    // @ React Overrides
    // ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~

    render() {
        const contentStyle = {
            height: "500px",
            width: "100%",
            backgroundImage: "url('images/connect-small.jpg')", 
            backgroundPosition: "center", 
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat"
        };

        return (
            <div>
                <br/><br/><br/><br/><br/>
                <Grid>
                    <Cell col={1}></Cell>
                    <Cell col={10}>
                        <Card shadow={3} style={{width: "100%"}}>
                            <CardTitle style={contentStyle}></CardTitle>
                            <CardText style={{width: "97%", fontSize: "2em", lineHeight: "1.2em", textAlign: "right"}}>
                                <div>Device and Video Cloud Management Platform for Mobility Applications.</div>
                                <div>Robotics. Security. IoT. Self Driving Cars.</div>
                                <div>Where Video Meets Data.</div>
                            </CardText>
                            <CardActions border>
                                <Grid>
                                    <Cell col={10}>
                                        <FABButton colored ripple onClick={this.shareClicked.bind(this)}><Icon name="share" /></FABButton>
                                    </Cell>
                                    <Cell col={2}>
                                        <Button raised colored ripple style={{position: "absolute", right: "20px"}} onClick={this.getStartedClicked.bind(this)}>Get Started</Button>
                                    </Cell>
                                </Grid>
                            </CardActions>
                        </Card>
                    </Cell>
                    <Cell col={1}></Cell>
                </Grid>
            </div>
        );
    }
}
