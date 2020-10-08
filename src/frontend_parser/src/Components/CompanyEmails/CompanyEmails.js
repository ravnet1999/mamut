import React, { useState, useEffect } from 'react';
import valid from 'validator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import './CompanyEmails.css';
import { Row, Col, Button } from '../bootstrap';
import Alert from '../Alert/Alert';
import Page from '../Page';
import CompanyEmailsHandler from '../../Handlers/CompanyEmailsHandler';
import CompanyHandler from '../../Handlers/CompanyHandler';
import AutomationHandler from '../../Handlers/AutomationHandler';
import Pagination from '../Pagination/Pagination';

const CompanyEmails = (props) => {
    const [domains, setDomains] = useState([]);
    const [domainCount, setDomainCount] = useState(0);
    const [currentField, setCurrentField] = useState('');
    const [response, setResponse] = useState(null);
    const [automationEnabled, setAutomationEnabled] = useState(null);
    const [automationResponse, setAutomationResponse] = useState(null);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(15);
    const [sortBy, setSortBy] = useState('companyNameLowerCase');
    const [sortWay, setSortWay] = useState('ASC');

    const fetchAutomationResponse = () => {
        setAutomationResponse({
            error: false,
            messages: ['Pobieram status automatyzacji...'],
            resources: []
        });
        setAutomationEnabled(null);
        AutomationHandler.getStatus().then((response) => {
            setAutomationResponse(null);
            setAutomationEnabled(response.resources[0].automationEnabled);
        }).catch((err) => {
            setAutomationResponse(err);
            setAutomationEnabled(null);
        })
    }

    const fetchDomains = () => {
        CompanyEmailsHandler.getCompanyEmails(limit, page * limit, sortBy, sortWay).then((response) => {
            setDomains(response.resources[0].result);
            setDomainCount(response.resources[0].count);
        }).catch((err) => {
            setResponse(err);
        });
    }

    useEffect(() => {
        fetchDomains();
        fetchAutomationResponse();
    }, [page, limit, sortBy, sortWay]);

    const enableAutomation = () => {
        AutomationHandler.enable().then((response) => {
            fetchAutomationResponse();
        }).catch((err) => {
            setAutomationResponse(err);
        });
    }

    const disableAutomation = () => {
        AutomationHandler.disable().then((response) => {
            fetchAutomationResponse();
        }).catch((err) => {
            setAutomationResponse(err);
        });
    }

    const saveCompanyEmails = () => {
        setResponse({
            error: false,
            messages: ['Zpisuję domeny...'],
            resources: []
        })
        CompanyEmailsHandler.saveCompanyEmails(domains).then((response) => {
            setResponse(response);
        }).catch((err) => {
            setResponse(err);
        });
    }

    const fetchEmails = () => {
        setResponse({
            error: false,
            messages: ['Aktualizuję...'],
            resources: []
        });
        CompanyHandler.parseCompanies().then((response) => {
            setResponse(response);
            fetchDomains();
        }).catch((err) => {
            setResponse(err);
        })
    }

    const validateDomains = () => {
        return domains.filter((domain) => {
            return domain.domains.filter((filteredDomain) => {
                return !valid.isFQDN(filteredDomain.trim()) && filteredDomain != "";
            }).length > 0;
        }).length <= 0;
    }

    const updateDomain = (key, value) => {
        let trimmedValues = value.split(', ').map((part) => {
            return part.trim();
        });

        domains[key].domains = trimmedValues;
        setDomains(domains);
        setCurrentField(trimmedValues);
    }

    const changeSortWay = () => {
        sortWay == 'ASC' ? setSortWay('DESC') : setSortWay('ASC');
    }

    const sortByHeader = (header) => {
        setSortBy(header);
        changeSortWay();
    }

    const buildSortWayArrows = (header) => {
        let sortWayArrows = sortWay == 'ASC' ? <FontAwesomeIcon icon={faArrowDown}></FontAwesomeIcon> : <FontAwesomeIcon icon={faArrowUp}></FontAwesomeIcon>;

        return sortBy == header ? sortWayArrows : '';
    }

    const changeRep = (rep, domainIndex) => {
        domains[domainIndex].selectedRep = Number(rep);
        setCurrentField(rep);
    }

    const buildRepSelect = (domain, domainIndex) => {
        let repOptions = domain.companyRepresentatives.map((rep, key) => {
            return (
                <option key={key} value={rep.repId}>{rep.name}</option>
            );
        });

        return (
            <select className="form-control" value={domain.selectedRep ? domain.selectedRep : 0} onChange={(e) => changeRep(e.target.value, domainIndex)}>
                {repOptions}
            </select>
        );
    }

    const buildDomainList = () => {
        let domainList = domains.map((domain, key) => {

            let inputErrors = domain.domains.filter((filteredDomain) => {
                return !valid.isFQDN(filteredDomain.trim()) && filteredDomain != "";
            });

            let isError = domain.domains.length > 0 && inputErrors.length > 0;
            let errorClass = isError ? 'error' : '';

            return (
                <Row key={key} className="domain-edit-row">
                    <Col xs="1" className={errorClass}>{domain.companyId}</Col>
                    <Col className={errorClass}>{domain.companyName}</Col>
                    <Col>
                        { buildRepSelect(domain, key) }
                    </Col>
                    <Col>
                        <textarea className={`form-control ${errorClass}`} value={domain.domains ? domain.domains.join(', ') : ''} onChange={(e) => updateDomain(key, e.target.value)}></textarea>
                    </Col>
                </Row>
            );
        });

        return (
            <Row>
                <Col>
                    <div className="table-header-container margin-bottom-default">
                        <Row className="text-left text-bold table-header-row">
                            <Col xs="1" onClick={(e) => sortByHeader('companyId')}>ID {buildSortWayArrows('companyId')}</Col>
                            <Col onClick={(e) => sortByHeader('companyNameLowerCase')}>Nazwa {buildSortWayArrows('companyNameLowerCase')}</Col>
                            <Col onClick={(e) => sortByHeader('companyNameLowerCase')}>Reprezentant</Col>
                            <Col onClick={(e) => sortByHeader('domains')}>Domeny (oddzielone przecinkiem ze spacją) {buildSortWayArrows('domains')}</Col>
                        </Row>
                    </div>
                    {domainList}
                </Col>
            </Row>
        );
    }

    const buildSaveButton = () => {
        return (
            <Row className="margin-bottom-default">
                <Col>
                    <Alert response={automationResponse}></Alert>
                    <Row>
                        <Col>
                            <div className={`margin-bottom-default automation-info ${automationEnabled ? 'success' : 'warning'}`}>
                                Status automatyzacji: {automationEnabled ? 'Aktywna' : 'Nieaktywna'}
                                <Button onClick={(e) => enableAutomation() }>Włącz</Button>
                                <Button onClick={(e) => disableAutomation() }>Wyłącz</Button>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button onClick={(e) => fetchEmails()}>Aktualizuj firmy</Button>
                        </Col>
                        <Col className="text-right">
                            <Button onClick={(e) => saveCompanyEmails()} disabled={!validateDomains()}>Zapisz</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }

    return (
        <Page>
            <Alert response={response}></Alert>
            <Pagination count={domainCount} limit={limit} page={page} setPage={setPage} setLimit={setLimit}></Pagination>
            { buildSaveButton() }
            { buildDomainList() }
            { buildSaveButton() }
            <Pagination count={domainCount} limit={limit} page={page} setPage={setPage} setLimit={setLimit}></Pagination>
        </Page>
    );
}

export default CompanyEmails;