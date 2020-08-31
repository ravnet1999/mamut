import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from '../bootstrap';
import Page from '../Page';

const Task = (props) => {

    const [operators, setOperators] = useState([]);

    useEffect(() => {
        
    }, []);

    return (
        <Page>
            <Row>
                <Col className="text-center">
                    <Button className="large">Stop</Button>
                </Col>
            </Row>
        </Page>
    );
}

export default Task;