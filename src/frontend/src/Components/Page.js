import React from 'react';
import { Container, Row, Col } from './bootstrap';

const Page = (props) => {
    return (
        <Container className="page-container">
            <Row>
                <Col>
                    {props.children}
                </Col>
            </Row>
        </Container>
    );
}

export default Page;