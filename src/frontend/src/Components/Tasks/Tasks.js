import React from 'react';
import { Container, Row, Col, Button } from '../bootstrap';

const Tasks = (props) => {

    return (
        <Container>
            <Row>
                <Col className="text-center">
                    <Button className="large">Stop</Button>
                </Col>
            </Row>
        </Container>
    );
}

export default Tasks;