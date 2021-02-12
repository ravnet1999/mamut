import React, { useEffect, useState } from 'react';
import './Tasks.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { Row, Col, Button, Tabs, Tab } from '../bootstrap';
import moment from 'moment';
import TaskHandler from '../../Handlers/TaskHandler';

const TaskPreview = (props) => {

    const [task, setTask] = useState(null);
    const [episodeDates, setEpisodeDates] = useState([]);

    useEffect(() => {
        TaskHandler.getTaskDetails(props.task.id).then((result) => {
            let fetchedTask = result.resources[0];
            let stamps = fetchedTask.stamps;
            let stampTimes = [];
            for(let i = stamps.length - 1; i >= 0; i--) {
                if(i == stamps.length - 1 || stamps[i].nazwa == 'Zmiana przypisania') {
                    stampTimes.push(stamps[i].godzina);
                }
            }
            setTask(fetchedTask);
            setEpisodeDates(stampTimes);
            console.log(stampTimes);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    const buildEpisodeTabs = () => {
        let episodeTabs = [];
        let counter = 0;

        for(let i = task.episodes.length - 1; i >= 0; i--) {
            let episode = task.episodes[i];
            episodeTabs.push(
                <Tab key={counter} eventKey={episode.id} title={`Etap ${task.episodes.length - i}`}>
                    <div className="task-preview-episode task-preview-episode-row">
                        <Row>
                            <Col xs="6">
                                <strong>Informatyk:</strong> <span className="initials">{episode.informatyk.imie[0]}{episode.informatyk.nazwisko[0]}</span> {episode.informatyk.imie} {episode.informatyk.nazwisko}
                            </Col>
                            <Col xs="6">
                                <strong>Data rozpoczęcia etapu:</strong> {moment(episodeDates[(task.episodes.length - 1) - i]).utcOffset(0).format('DD-MM-YYYY HH:mm:ss')} 
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <strong>Rozwiązanie:</strong><br />
                                {episode.rozwiazanie}
                            </Col>
                        </Row>
                    </div>
                </Tab>
            )
            counter++;
        }

        return episodeTabs;
    }
    
    if(!task) return '';

    return (
        <div className="task-preview">
            <Row className="bottom-separator margin-bottom-default">
                <Col xs="9">
                    <div className="task-preview-header">Zgłoszenie: <strong>{task.id}</strong></div>
                </Col>
                <Col xs="3" className="text-right">
                    <Button onClick={(e) => props.onClose()}><FontAwesomeIcon icon={faWindowClose}></FontAwesomeIcon></Button>
                </Col>
            </Row>
            <Row className="margin-bottom-default task-preview-details-row">
                <Col>
                    <div className="task-preview-details">
                        <strong>Klient:</strong> {task.klient}<br />
                        <strong>Użytkownik:</strong> {task.zglaszajacy}<br />
                        <strong>Telefon:</strong> {task.telefon}<br />
                        <strong>Email:</strong> {task.adres_email}<br />
                        {console.log(task.stamps)}
                        <strong>Data przyjęcia:</strong> {moment(task.stamps[task.stamps.length - 1].godzina).utcOffset(0).format('DD-MM-YYYY HH:mm:ss')}<br />
                        <strong>Opis problemu:</strong> {task.opis}<br />
                        <strong>Typ błędu:</strong> {task.service.nazwa}<br />
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Tabs defaultActiveKey={task.episodes[0].id} id="uncontrolled-tab-example">
                        { buildEpisodeTabs() }
                    </Tabs>
                </Col>
            </Row>
        </div>
    );
}

export default TaskPreview;