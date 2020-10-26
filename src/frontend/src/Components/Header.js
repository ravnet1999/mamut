import React from 'react';
import { Container, Row, Col } from './bootstrap';
import { Link } from 'react-router-dom';

const Header = (props) => {
    return (
        <header>
            { props.loggedIn ? <Container className="margin-bottom-default">
                <Row>
                    <Col>
                        <nav>
                            <ul>
                                <li><Link to='/clients'>Klienci</Link></li>
                                <li><Link to='/tasks/general'>Kolejka ({props.generalTasksCount})</Link></li>
                                <li><Link to='/tasks'>W trakcie</Link></li>
                                <li><Link to='/logout'>Wyloguj</Link></li>
                            </ul>
                        </nav>
                    </Col>
                </Row>
            </Container> : '' }
        </header>
    );
}

export default Header;