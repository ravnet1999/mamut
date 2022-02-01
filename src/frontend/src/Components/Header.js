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
                                <li><Link to='/representatives-search' className={props.currentPage.includes('/representatives-search') || props.currentPage.includes('/representatives-search')  ? 'active' : ''}>Reprezentanci</Link></li>
                                <li><Link to='/clients' className={props.currentPage.includes('/clients') || props.currentPage.includes('/representatives') &&  props.currentPage !== '/representatives-search' ? 'active' : ''}>Klienci</Link></li>
                                <li><Link to='/tasks/general' className={props.currentPage.includes('/tasks/general') ? 'active' : ''}>ToDo ({props.generalTasksCount})</Link></li>
                                <li><Link to='/tasks' className={props.currentPage.includes('/tasks') && !props.currentPage.includes('/tasks/general') ? 'active' : ''}>W trakcie</Link></li>
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