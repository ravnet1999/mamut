import React, { useEffect } from 'react';
import AppendixHandler from '../../Handlers/AppendixHandler';
import { Container, Row, Col, Button, Form, Card, CardColumns } from '../bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';
import { WithContexts } from '../../HOCs/WithContexts';
import { TaskAppendicesContext } from '../../Contexts/TaskAppendicesContext';
import ClipLoader from "react-spinners/ClipLoader";
import Modal from '../Modal/Modal';
import Alert from '../Alert/Alert';
import ReactTooltip from 'react-tooltip';

const TaskAppendices = (props) => {
    const { 
      task,
      response, setResponse,
      appendices, setAppendices,
      selectedAppendices, setSelectedAppendices, 
      appendicesKey, setAppendicesKey,
      appendicesUploading, setAppendicesUploading,
      appendicesDownloading, setAppendicesDownloading,
      appendicesRemoving, setAppendicesRemoving,
      appendixRemoveModal, setAppendixRemoveModal,
      appendixRemoveModalVisible, setAppendixRemoveModalVisible,
      onAppendicesChange,
      onAppendicesUpload,
      onAppendixDownload,
      onAppendixRemove,
      tags, setTags, onTagRemove, onTagChange, onTagCreate,
      tagsToCreate, setTagsToCreate, tagsConfirmed, setTagsConfirmed, onTagToCreateChange, onTagToCreateConfirm, onTagConfirmedRemove, tagToCreate, setTagToCreate, tagToCreateKey, setTagToCreateKey, tag, setTag, tagKey, setTagKey,
      tagsFocus, setTagsFocus, tagToCreateFocus, setTagToCreateFocus
    } = props;

    useEffect(() => {
      if(!task) return;
  
      AppendixHandler.getByTaskId(task.id).then(result => {
        setAppendices(result.resources);
      });
    }, [task]);

    useEffect(() => {
      if(!selectedAppendices) {
        return;
      }
  
      onAppendicesUpload(task.id);
    }, [selectedAppendices]);

    return (
      <>
      <Alert response={response}></Alert>
      <div className="form-group task-appendices-container margin-bottom-default">
      <Row>
        <Col>
          <label for="task-appendices"><strong>Załączniki:</strong></label><br/>
          <div className="task-appendices-content">
            <input id="tag-to-create" key={tagToCreateKey} value={tagToCreate} onChange={e=>onTagToCreateChange(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && onTagToCreateConfirm(e)} autoFocus={tagToCreateFocus} placeholder="Wpisz tag i wciśnij ENTER"></input>
            
            { tagsConfirmed && tagsConfirmed.map((tag) => {
              return <Card style={{width: "fit-content"}}>
                  <Card.Body>
                    <Card.Text>
                      { tag } <span onClick={e=>onTagConfirmedRemove(tag)}>x</span>
                    </Card.Text>
                  </Card.Body>
                </Card>
            })}             
            
            <input id="task-appendices" name="task-appendices" key={appendicesKey||''} multiple className={'form-control', 'margin-top-reduced',  'margin-bottom-default'} type="file" onChange={onAppendicesChange} disabled={appendicesUploading || appendicesDownloading.length>0 || appendicesRemoving.length>0 || tagsConfirmed.length == 0 }/>  
            {/* {!appendicesUploading && 
              <Button data-tip="Dodaj" disabled={!selectedAppendices || appendicesDownloading.length>0 || appendicesRemoving.length>0} className="appendices-add-button" onClick={e=>onAppendicesUpload(task.id)}>
                <FontAwesomeIcon className="fa-sm" icon={faUpload}></FontAwesomeIcon>
              </Button>
            } */}            
            <span className="clip-loader"><ClipLoader loading={appendicesUploading} size={20} /></span>        
            { appendices.length > 0 && <CardColumns style={{columnCount: "1"}}>
              { appendices.map((appendix, key) => {
              // let url = `${appConfig.URLs.domain}/${appConfig.URLs.appendices}/${appendix.id}/file`;
              // return <a href={url} target="_blank" download={appendix.nazwa_oryginalna}>{appendix.nazwa_oryginalna}</a>;
                return <Card style={{width: "fit-content"}}>
                  <Card.Body>
                    <Card.Text>
                      <div style={{whiteSpace: "nowrap"}}>
                        {appendix.nazwa_oryginalna}
                        
                        {!appendicesDownloading.includes(appendix.id) && 
                          <Button data-tip="Pobierz" disabled={appendicesUploading || appendicesDownloading.length>0 || appendicesRemoving.length>0} className="appendix-download-button" onClick={e=>onAppendixDownload(appendix)}>
                            <FontAwesomeIcon className="fa-sm" icon={faDownload}></FontAwesomeIcon>
                          </Button>
                        }
                        <span className="clip-loader">
                          <ClipLoader loading={appendicesDownloading.includes(appendix.id)} size={20} />
                        </span>

                        {!appendicesRemoving.includes(appendix.id) &&
                          <>
                            <Modal title={appendixRemoveModal.title} description={appendixRemoveModal.description} buttons={appendixRemoveModal.buttons} visible={appendixRemoveModalVisible} onClose={() => setAppendixRemoveModalVisible(false)}></Modal>
                            <Button data-tip="Usuń" disabled={appendicesUploading || appendicesDownloading.length>0 || appendicesRemoving.length>0} className="appendix-remove-button" onClick={e=>onAppendixRemove(appendix)}>
                              <FontAwesomeIcon className="fa-sm" icon={faTrash}></FontAwesomeIcon>
                            </Button>
                          </>
                        }
                        <span className="clip-loader">
                          <ClipLoader loading={appendicesRemoving.includes(appendix.id)} size={20} />
                        </span>
                        <ReactTooltip />
                        <div>
                          { appendix.tagi && Object.entries(appendix.tagi).map((tag) => {
                            return <Card style={{width: "fit-content"}}>
                                <Card.Body>
                                  <Card.Text>
                                    { tag[1] } <span onClick={e=>onTagRemove(appendix, tag[0])}>x</span>
                                  </Card.Text>
                                </Card.Body>
                              </Card>
                          })} 
                          <Card style={{width: "fit-content"}}>
                            <Card.Body>
                              <Card.Text>
                                <input key={tagKey} value={tag} onChange={e=>onTagChange(appendix, e.target.value)} onKeyPress={(e) => e.key === 'Enter' && onTagCreate(appendix.id)} autoFocus={tagsFocus[appendix.id]} placeholder="Wpisz tag i wciśnij ENTER"></input>
                              </Card.Text>
                            </Card.Body>
                          </Card>
                        </div>                        
                      </div>
                    </Card.Text>
                  </Card.Body>
                </Card>
                })
              }
              </CardColumns> 
            }
          </div>
        </Col>
      </Row>  
      </div> 
      </>
    );
}

export default WithContexts(TaskAppendices, [TaskAppendicesContext]);