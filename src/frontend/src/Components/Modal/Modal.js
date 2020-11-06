import React from 'react';
import { Row, Col, Button } from '../bootstrap';

const Modal = (props) => {

    const buildButtons = (buttons) => {
        return buttons.map((button, key) => {
            return <Col className={key == 0 ? 'text-left' : 'text-center'}><Button key={key} onClick={(e) => button.method()}>{button.name}</Button></Col>;
        })
    }

    if(!props.visible) return '';

    return (
        <div className="mamut-modal">
            <Row>
                <Col>
                    <h4>{props.title}</h4>
                    <p>{props.description}</p>
                </Col>
            </Row>
            <Row>
                {buildButtons(props.buttons)}
                <Col className="text-right">
                    <Button onClick={(e) => props.onClose()}>Anuluj</Button>
                </Col>
            </Row>
        </div>
    );
}

export default Modal;