import React from 'react';
import { Row, Col, Button } from '../bootstrap';

const Pagination = (props) => {

    let pageUrls = [];

    if(props.limit > 0) {
        let pages = Math.ceil(props.count / props.limit);
    
        for(let i=0; i < pages; i++) {
            pageUrls[i] = <Button key={i} onClick={(e) => props.setPage(i)} className={`small pagination-page ${props.page == i ? 'active' : ''}`} disabled={props.page == i}>{i + 1}</Button>;
        }
    } else {
        pageUrls[0] = <Button key={0} onClick={(e) => props.setPage(0)} className={`small pagination-page ${props.page == 0 ? 'active' : ''}`} disabled={props.page == 0}>{1}</Button>;
    }

    const changeLimit = (value) => {
        props.setLimit(value);
        props.setPage(0);
    }

    const buildResultCountSelect = () => {
        return (
            <select className="form-control" value={props.limit} onChange={(e) => changeLimit(e.target.value)}>
                <option value={5}>5</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={0}>Wszystkie</option>
            </select>
        );
    }

    return (
        <Row className="margin-top-default margin-bottom-default pagination-row">
            <Col>
                <div className="pagination-pages-container">
                    <Row>
                        <Col xs="6">
                            Wyników na stronie: { buildResultCountSelect() }
                        </Col>
                        <Col xs="6" className="text-right">
                            Strony: {pageUrls}
                        </Col>
                    </Row>
                </div>
            </Col>
        </Row>
    );
}

export default Pagination;