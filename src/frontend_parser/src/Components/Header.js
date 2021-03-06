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