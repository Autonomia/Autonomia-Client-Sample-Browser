
// React
import React from "react"

// Autonomia
let AutonomiaSdk = Autonomia.Client.Sdk;

export default class VideoPlayer extends React.Component {

    constructor() {
        super();

        this._domId = AutonomiaSdk.Helpers.NewGuid();
    }

    startVideoStreaming() {
        var thisRef = this;

        $f(this._domId, "http://releases.flowplayer.org/swf/flowplayer-3.2.18.swf", {
            clip: {
                url: this.props.rtmp,
                live: true,
                scaling: 'fit',
                provider: 'hddn', // configure clip to use hddn as our provider, referring to our flowplayer rtmp plugin
                bufferLength: 0,
                bufferTime: 0,
                autoPlay: true,
                onBegin: function () {
                    if (thisRef.props.muted === "true") {
                        this.setVolume(0);
                    }
                    else { 
                        this.setVolume(100);
                    }
                }
            },
            plugins: {
                controls: { display: 'none' },
                hddn: {
                    url: "flowplayer.rtmp-3.2.13.swf",
                    netConnectionUrl: this.props.rtmp,
                }
            },
            canvas: {
                backgroundGradient: 'none'
            }
        });
    }

    // React Overrides
    // ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~
    render() {
        const style = {
            width: this.props.width,
            height: this.props.height,
        };

        return (
            <div id={this._domId} style={style}></div>
        )
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            this.props.rtmp !== nextProps.rtmp
            || this.props.width !== nextProps.width
            || this.props.height !== nextProps.height
        );
    }

    componentDidMount() {
        this.startVideoStreaming();
    }

    componentDidUpdate() {
        this.startVideoStreaming();
    }
}
