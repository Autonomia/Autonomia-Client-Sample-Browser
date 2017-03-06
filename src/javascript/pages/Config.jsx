
import React from "react"
import { Grid, Cell, Card, CardTitle, CardText, CardActions, Button, Textfield, FABButton, Icon, ProgressBar } from "react-mdl"
import { Globals } from "../components/Globals"

let AutonomiaSdk = Autonomia.Client.Sdk;
let AutonomiaLogging = AutonomiaSdk.Helpers.Logging;

export default class Config extends React.Component {
    constructor() {
        super();

        this.state = {
            AppKey: "",
            AppSecret: "",
            Server: "",
            IsSaving: false
        };

        this.stateMirror = {};

        this.LocalStorageKey = "Autonomia-Samples-App-Starter-Config";
    }

    // @ Helpers
    // ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~

    AppKeyChanged(e) {
        this.setState({
            ...this.state,
            AppKey: e.target.value
        });
    }
    AppSecretChanged(e) {
        this.setState({
            ...this.state,
            AppSecret: e.target.value
        });
    }
    ServerChanged(e) {
        this.setState({
            ...this.state,
            Server: e.target.value
        });
    }

    SaveConfig(e) {
        var thisRef = this;

        var settingsContainer = {};
        let settings = new AutonomiaSdk.Helpers.Persisters.LocalStoragePersister(Globals.SettingsKey);

        AutonomiaSdk.Helpers.Tasks.Run()
            .This((done) => {
                thisRef.setState({
                    ...thisRef.state,
                    IsSaving: true
                });

                settings.Save({
                    ...thisRef.state, 
                    IsSaving: false
                }, done);
            })
            .Then((done) => {
                setTimeout(()=>{
                    done();
                }, 3000);
            })
            .Then((done) => {
                thisRef.setState({
                    ...thisRef.state,
                    IsSaving: false
                });
            })
            .OnError((error) => {
                Logging.Console().Log(new Logging.LogEntity(
                    Logging.LogType.Error,
                    error
                ));
            });
    }

    RevertConfig(e) {
        this.setState({
            ...this.stateMirror,
            IsSaving: false
        });
    }

    // @ React Overrides
    // ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~

    render() {
        return (
            <div>
                <br/><br/><br/><br/><br/>
                <Grid>
                    <Cell col={2}></Cell>
                    <Cell col={8}>
                        <Card shadow={3} style={{width: "100%"}}>
                            <CardTitle>Config</CardTitle>
                            <CardText style={{width: "100%"}}>

                                <Grid><Cell col={12}>
                                    <Textfield
                                        onChange={this.AppKeyChanged.bind(this)} 
                                        required
                                        label="AppKey" 
                                        floatingLabel 
                                        value={this.state.AppKey} 
                                        style={{width: "98%", fontSize: "40px"}} />
                                </Cell><Cell col={0}></Cell></Grid>

                                <Grid><Cell col={12}>
                                    <Textfield 
                                        onChange={this.AppSecretChanged.bind(this)}
                                        required
                                        label="AppSecret" 
                                        floatingLabel 
                                        value={this.state.AppSecret} 
                                        style={{width: "98%"}} />
                                </Cell><Cell col={0}></Cell></Grid>

                                <Grid><Cell col={12}>
                                    <Textfield
                                        onChange={this.ServerChanged.bind(this)}
                                        required
                                        label="Server"
                                        floatingLabel
                                        value={this.state.Server}
                                        style={{width: "98%"}} />
                                </Cell><Cell col={0}></Cell></Grid>

                            </CardText>
                            <CardActions border>
                                <Grid>
                                    <Cell col={1}>
                                        <FABButton colored ripple onClick={this.RevertConfig.bind(this)}>
                                            <Icon name="refresh" />
                                        </FABButton>
                                    </Cell>
                                    <Cell col={8}>
                                    </Cell>
                                    <Cell col={3}>
                                        {this.state.IsSaving ? (
                                            <ProgressBar indeterminate style={{ width: "100%" }} />
                                        ) : (
                                            <Button primary raised colored ripple onClick={this.SaveConfig.bind(this)} style={{height: "4em", width: "100%"}}>
                                                <Icon name="save" /> &nbsp;
                                                Save Changes
                                            </Button>
                                        )}
                                    </Cell>
                                </Grid>
                            </CardActions>
                        </Card>
                    </Cell>
                    <Cell col={2}></Cell>
                </Grid>
            </div>
        );
    }

    componentDidMount() {
        var thisRef = this;

        var settingsContainer = {};
        let settings = new AutonomiaSdk.Helpers.Persisters.LocalStoragePersister(Globals.SettingsKey);

        AutonomiaSdk.Helpers.Tasks.Run()
            .This((done) => {
                settings.Read(settingsContainer, done);
            })
            .Then((done) => {
                if (!AutonomiaSdk.Helpers.IsNullOrEmpty(settingsContainer.data)) {
                    thisRef.setState(settingsContainer.data);

                    thisRef.stateMirror = {...thisRef.state};
                }

                done();
            })
            .OnError((error) => {
                Logging.Console().Log(new Logging.LogEntity(
                    Logging.LogType.Error,
                    error
                ));
            });
    }
}