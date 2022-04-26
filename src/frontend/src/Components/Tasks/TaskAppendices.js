import React, { useEffect } from 'react';
import AppendixHandler from '../../Handlers/AppendixHandler';
import TaskHandler from '../../Handlers/TaskHandler';
import { Container, Row, Col, Button, Form, Card, CardColumns } from '../bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';
import { WithContexts } from '../../HOCs/WithContexts';
import { TaskAppendicesContext } from '../../Contexts/TaskAppendicesContext';
import { TaskAppendicesTagsContext } from '../../Contexts/TaskAppendicesTagsContext';
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
      onAppendicesChange, onAppendixDownload, onAppendixRemove,       
      appendicesUploading, setAppendicesUploading,
      appendicesDownloading, setAppendicesDownloading,
      appendicesRemoving, setAppendicesRemoving,
      appendixRemoveModal, setAppendixRemoveModal,
      appendixRemoveModalVisible, setAppendixRemoveModalVisible,     
      updateAppendicesOnTagCreate,
      updateAppendicesOnTagRemove,

      tagToCreate, setTagToCreate, 
      tagsToCreate, setTagsToCreate, 
      tagToCreateKey, setTagToCreateKey,
      tagToCreateFocus, setTagToCreateFocus, 
      tagsConfirmed, setTagsConfirmed,
      onTagToCreateChange, 
      afterTagToCreateConfirmed,
      onTagToCreateConfirm,
      onTagConfirmedRemove,

      tags, setTags, onTagRemove, onTagChange, onTagCreate,
      tag, setTag, tagKey, setTagKey,
      tagsFocus, setTagsFocus
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

    useEffect(() => {
      ReactTooltip.rebuild();
    }, [tagsConfirmed, appendices.map(appendix => appendix.tagi)]);

    const onAppendicesUpload = (taskId) => {
      setAppendicesUploading(true);
  
      const formData = new FormData();
  
      for (let i = 0; i < selectedAppendices.length; i++) {
        formData.append(`task-appendices[${i}]`, selectedAppendices[i]);
        formData.append(`tags`, tagsConfirmed);
      }
  
      TaskHandler.addAppendices(taskId, formData, tagsConfirmed).then((result) => {
        setAppendicesKey(Math.random().toString(36)); 
        setAppendices([...result.resources, ...appendices]);
        setResponse(result);
      }).catch((err) => {
        console.log(err);
        setResponse(err);
      }).finally(() => {
        setSelectedAppendices(null);
        setAppendicesUploading(false);
        setTagsConfirmed([]);
      });
    };

    return (
      <>
      <Alert response={response}></Alert>
      <div className="form-group task-appendices-container margin-bottom-default">
      <Row>
        <Col>
          <label for="task-appendices"><strong>Załączniki:</strong></label><br/>
          <div className="task-appendices-content">
            <div className={'margin-bottom-default'}>
              <CardColumns style={{columnCount: "1"}}>
                <Card style={{width: "fit-content"}}>
                  <Card.Body>
                    <Card.Text>
                      <Card style={{width: "fit-content"}}>
                        <Card.Body>
                          <Card.Text>
                            <input className={'form-control'} id="tag-to-create" key={tagToCreateKey} value={tagToCreate} onChange={e=>onTagToCreateChange(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && onTagToCreateConfirm(e, setResponse)} autoFocus={tagToCreateFocus}  placeholder="Wpisz tag" data-tip="Wpisz tag (min. 3 znaki) i wciśnij ENTER"></input>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                      { tagsConfirmed.length > 0 }
                        { tagsConfirmed.map((tag) => {
                          return <Card style={{width: "fit-content"}}>
                            <Card.Body>
                              <Card.Text>
                                <Button onClick={e=>onTagConfirmedRemove(tag)} data-tip="Usuń">{ tag }</Button>                        
                              </Card.Text>
                            </Card.Body>
                          </Card>
                      })}                          
                    </Card.Text>
                  </Card.Body>
                </Card>
              </CardColumns>
            </div>

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
                      <div>
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

                        <div className={'margin-top-default'} >
                          <Card style={{width: "fit-content"}}>
                            <Card.Body>
                              <Card.Text>
                                <input className={'form-control'} key={tagKey} value={tag} onChange={e=>onTagChange(appendix, e.target.value, setResponse)} onKeyPress={(e) => e.key === 'Enter' && onTagCreate(appendix, updateAppendicesOnTagCreate, setResponse)} autoFocus={tagsFocus[appendix.id]} placeholder="Wpisz tag" data-tip="Wpisz tag (min. 3 znaki) i wciśnij ENTER"></input>
                              </Card.Text>
                            </Card.Body>
                          </Card>
                          { appendix.tagi && Object.entries(appendix.tagi).map((tag) => {
                            return <Card style={{width: "fit-content"}}>
                                <Card.Body>
                                  <Card.Text>
                                    <Button onClick={e=>onTagRemove(appendix, tag[0], updateAppendicesOnTagRemove, setResponse)} data-tip="Usuń">{ tag[1] }</Button>
                                  </Card.Text>
                                </Card.Body>
                              </Card>
                          })}                           
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

export default WithContexts(TaskAppendices, [TaskAppendicesContext, TaskAppendicesTagsContext]);