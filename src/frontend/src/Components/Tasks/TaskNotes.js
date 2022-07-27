import React, { useEffect} from 'react';
import { WithContexts } from '../../HOCs/WithContexts';
import { TaskNotesContext } from '../../Contexts/TaskNotesContext';
import TaskNoteHandler from '../../Handlers/TaskNoteHandler';

const TaskNotes = (props) => {
    const { 
      task,
      notes, setNotes
    } = props;
    
    useEffect(() => {
      if(!task) return;
  
      TaskNoteHandler.getNotesByTaskId(task.id).then(result => {
        console.log('resources', result.resources);
        setNotes(result.resources);  
      });
    }, [task]);

    return (
      <>
      <Alert response={response}></Alert>
      <div className="form-group task-appendices-container margin-bottom-default">
      <Row>
        <Col>
          <label for="task-appendices"><strong>Załączniki:</strong></label><br/>

          <div className="task-appendices-content">
            <div className={'margin-bottom-default'}>
              {tagsSelectDefaultOptions.length && <AsyncCreatableSelect
              defaultOptions={tagsSelectDefaultOptions}          
              loadOptions={tagsSelectPromiseOptions}
              onChange={newAppendicesTagsSelectHandleChange(setResponse)}
              isMulti={true}
              placeholder={tagsSelectPlaceholder}
              formatCreateLabel={tagsSelectFormatCreateLabel}
              styles={newAppendicesTagsSelectStyles}
              value={newAppendicesTags}
              isValidNewOption={isValidNewOption}
              isClearable={false}
              />}  
            </div>

            <input id="task-appendices" name="task-appendices" key={appendicesKey||''} multiple className="form-control, margin-top-reduced, margin-bottom-default" type="file" onChange={onAppendicesChange} disabled={appendicesUploading || appendicesDownloading.length>0 || appendicesRemoving.length>0 || newAppendicesTags.length == 0 }/>  
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
                        { ['development', 'staging'].includes(process.env.NODE_ENV) &&
                          <>[ {appendix.id} ]</>
                        }

                        {appendix.nazwa_oryginalna}<br/><br/>

                        { ['development', 'staging'].includes(process.env.NODE_ENV) &&
                          <div style={{fontSize: "12px"}}>
                            {appendix.kompresja == 1 &&
                            <>
                              <b>JAKOŚĆ KOMPRESJI:</b> {appendix.kompresja_jakosc}<br/>                            
                            </>}

                            {appendix.kompresja == 0 &&
                            <>
                              <b>KOMPRESJA:</b> NIE<br/>
                              {appendix.skalowanie == 0 &&
                              <>                            
                                  <b>SKALOWANIE:</b> NIE<br/>
                              </>}
                              <br/>
                            </>}

                            <b>ROZMIAR ORYG.:</b> {appendix.rozmiar}<br/>
                            {appendix.kompresja == 1 &&
                            <>
                              <b>ROZMIAR PO KOMPRESJI:</b> {appendix.kompresja_rozmiar}<br/>
                              <b>ROZMIAR PO KOMPRESJI / ROZMIAR ORYG.:</b> { Math.round(appendix.kompresja_rozmiar/appendix.rozmiar * 10000) / 100 }%<br/>
                              <b>CZAS OPERACJI:</b> {appendix.kompresja_czas_wykonania}s<br/><br/>
                            </>}
                            
                            {appendix.szerokosc && appendix.wysokosc &&
                            <>
                              <b>WYMIARY ORYG:</b> {appendix.szerokosc} x {appendix.wysokosc}<br/>

                              {appendix.skalowanie == 1 &&
                              <>                            
                                <b>DOCELOWY WYMIAR:</b> {appendix.skalowanie_konfiguracja_szerokosc} x {appendix.skalowanie_konfiguracja_wysokosc}<br/>
                                <b>WYLICZONA SKALA:</b> {appendix.skalowanie_wyliczona_skala}<br/> 
                                <b>WYMIARY PO PRZESKALOWANIU:</b> {appendix.skalowanie_szerokosc} x {appendix.skalowanie_wysokosc}<br/>
                                <b>ROZMIAR PO PRZESKALOWANIU:</b> {appendix.skalowanie_rozmiar}<br/>
                                <b>ROZMIAR PO PRZESKALOWANIU / ROZMIAR PO KOMPRESJI.:</b> { Math.round(appendix.skalowanie_rozmiar/appendix.kompresja_rozmiar * 10000) / 100 }%<br/>
                                <b>ROZMIAR PO PRZESKALOWANIU / ROZMIAR ORYG.:</b> { Math.round(appendix.skalowanie_rozmiar/appendix.rozmiar * 10000) / 100 }%<br/>
                                <b>CZAS OPERACJI:</b> {appendix.skalowanie_czas_wykonania}s<br/><br/>
                              </>}                                                        
                            </>}

                            {appendix.skalowanie == 0 && appendix.kompresja == 1 &&
                            <>                            
                                <b>SKALOWANIE:</b> NIE<br/><br/>
                            </>}
                            
                            {appendix.archiwizacja == 1 &&
                            <>
                              <b>TYP ARCHIWIZACJI:</b> {appendix.archiwizacja_typ}<br/> 
                              <b>ROZMIAR PO ARCHIWIZACJI:</b> {appendix.archiwizacja_rozmiar}<br/>                          
                              {appendix.kompresja == 1 && appendix.skalowanie == 1 &&
                              <>                            
                              <b>ROZMIAR PO ARCHIWIZACJI / ROZMIAR PO KOMPRESJI I PRZESKALOWANIU:</b> { Math.round(appendix.archiwizacja_rozmiar/appendix.skalowanie_rozmiar * 10000) / 100 }%<br/>
                              </>}
                              {appendix.kompresja == 1 && appendix.skalowanie == 0 &&
                              <>                            
                              <b>ROZMIAR PO ARCHIWIZACJI / ROZMIAR PO KOMPRESJI:</b> { Math.round(appendix.archiwizacja_rozmiar/appendix.kompresja_rozmiar * 10000) / 100 }%<br/>
                              </>}
                              <b>ROZMIAR PO ARCHIWIZACJI / ROZMIAR ORYG.:</b> { Math.round(appendix.archiwizacja_rozmiar/appendix.rozmiar * 10000) / 100 }%<br/>
                              <b>CZAS OPERACJI:</b> {appendix.archiwizacja_czas_wykonania}s<br/><br/>
                            </>}

                            {appendix.archiwizacja == 0 &&
                            <>
                              <b>ARCHIWIZACJA:</b> NIE<br/><br/>
                            </>}

                            {(appendix.kompresja == 1 || appendix.skalowanie == 1 || appendix.archiwizacja == 1) &&
                            <>
                              <b>ŁĄCZNY CZAS OPERACJI:</b> {appendix.czas_wykonania}s<br/><br/>
                            </>
                            }
                          </div>
                        }

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
                                {tagsSelectDefaultOptions.length && savedAppendicesTagsLoaded && <AsyncCreatableSelect
                                cacheOptions  
                                defaultOptions={tagsSelectDefaultOptions}          
                                loadOptions={tagsSelectPromiseOptions}
                                onChange={savedAppendicesTagsSelectHandleChange(appendix, appendices, setAppendices, setResponse)}
                                isMulti={true}
                                placeholder={tagsSelectPlaceholder}
                                formatCreateLabel={tagsSelectFormatCreateLabel}
                                styles={tagsSelectStyles}
                                value={savedAppendicesTags[appendix.id]}
                                isValidNewOption={isValidNewOption}
                                isClearable={false}
                                />}                                
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

export default WithContexts(TaskNotes, [TaskNotesContext]);