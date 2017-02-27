
import React from 'react'
import { Grid, Row, Col, Modal } from 'react-bootstrap';

const About = () => (
    <div>
    <br/><br/><br/><br/><br/>
    <Grid>
        <Row md={10}>
            <Modal.Dialog class="about-dialog-position">
                <Modal.Header>
                    <Modal.Title>Autonomia</Modal.Title>
                </Modal.Header>
                <Modal.Body class="about-dialog">
                </Modal.Body>
                <Modal.Footer>
                    Device and Video Cloud Management Platform for Mobility Applications.
                    <br/>Robotics. Security. IoT. Self Driving Cars.
                    <br/>Where Video Meets Data.
                </Modal.Footer>
            </Modal.Dialog>                
        </Row>
    </Grid>
    </div>
)

module.exports = About