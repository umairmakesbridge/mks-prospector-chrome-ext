import React,{Component}
       from 'react';
import request
       from 'superagent';
import {encodeHTML,decodeHTML}
       from '../../common/Encode_Method';
import ToggleDisplay
       from 'react-toggle-display';
import Moment
       from 'moment';
import LoadingMask
       from '../../common/Loading_Mask';
import {ErrorAlert,SuccessAlert}
       from '../../common/Alerts';
class Notes extends Component{
           constructor(props){
               super(props);
               this.state = {
                 notesLists : null,
                 comment : '',
                 showLoading : false,
                 loadingMsg : '',
                 commentId : null,
                 showAddBtn : 'show',
                 showUpdate : 'hide',
                 collapseMsg : 'Click to expand',
                 collapseExpand : 'expand',
                 setFullHeight : '',
                 noNotesFound : false,
                 showCollapse : ''
               }
               this.baseUrl = this.props.baseUrl;
               // preserve the initial state in a new object
               this.baseState = this.state;
           }
          toggleHeight(){
            if(this.state.setFullHeight){
              this.setState({setFullHeight : '',collapseMsg: 'Click to expand',collapseExpand:'expand'});
            }else{
              this.setState({setFullHeight : 'heighAuto',collapseMsg: 'Click to collapse',collapseExpand:'collapse'});
            }
          }
          getNotesLists(){
            let lists = [];
            console.log('Notes com');
            var Url = this.baseUrl
                            +'/io/subscriber/comments/?BMS_REQ_TK='
                            + this.props.users_details[0].bmsToken +'&type=getComments&subNum='+this.props.contact.subNum+'&ukey='+this.props.users_details[0].userKey
                            +'&isMobileLogin=Y&orderBy=updationTime&order=desc&userId='+this.props.users_details[0].userId;
            request
                  .get(Url)
                   .set('Content-Type', 'application/x-www-form-urlencoded')
                   .then((res) => {
                      if(res.status==200){
                        let jsonResponse =  JSON.parse(res.text);
                        if (jsonResponse[0] == "err"){
                            if(jsonResponse[1] == "SESSION_EXPIRED"){
                              ErrorAlert({message:jsonResponse[1]});
                              jQuery('.mksph_logout').trigger('click');
                            }
                          return false;
                        }
                        if(parseInt(jsonResponse.totalCount) > 0){
                          this.setState({
                            showLoading : false,
                            loadingMsg : ''
                          })
                          jQuery.each(jsonResponse['comments'][0],function(key,list){
                                  lists.push(list[0]);
                          });
                          this.setState({
                            notesLists : lists,
                            showCollapse : ''
                          });
                        }else{
                          this.setState({
                            noNotesFound : true,
                            showCollapse : 'hide'
                          })
                        }
                      }
                    });
          }
          componentDidMount(){
            this.getNotesLists();
          }
          setStateDefault(){
              this.setState(this.baseState);
          }
          addNewNote(){
            if(!this.state.comment){
              return false;
            }
            this.setState({
              showLoading : true,
              loadingMsg : 'Creating new note...'

            })
            request.post(this.baseUrl+'/io/subscriber/comments/?BMS_REQ_TK='+this.props.users_details[0].bmsToken+'&type=add')
               .set('Content-Type', 'application/x-www-form-urlencoded')
               .send({
                         subNum: this.props.contact.subNum
                        ,comments:encodeHTML(this.state.comment)
                        ,ukey:this.props.users_details[0].userKey
                        ,isMobileLogin:'Y'
                        ,userId:this.props.users_details[0].userId
                      })
               .then((res) => {
                  console.log(res.status);

                  var jsonResponse =  JSON.parse(res.text);
                  console.log(jsonResponse);
                  if(jsonResponse[0]=="err"){
                    ErrorAlert({message : jsonResponse[1]});
                  }

                  else{


                  //  this.props.parentProps.toggleLoadingMask();
                    SuccessAlert({message:jsonResponse.success});
                    this.setState({comment : ""});

                      this.getNotesLists();
                    //this.props.addContactToList();
                    //this.setState(this.baseState);
                  }
                });
          }
          handleOnEnter(event){
            if(event.which==13){

              (this.state.commentId) ? this.updateNote() : this.addNewNote();

            }
          }
          editNote(commentid,ecomment){
            console.log('Time to edit note',commentid);
            this.setState({
              comment : ecomment,
              commentId : commentid,
              showUpdate : 'show',
              showAddBtn : 'hide'
            });
            // Show cancel or update btn

          }
          updateNote(){
            if(!this.state.comment){
              return false;
            }
            this.setState({
              showLoading : true,
              loadingMsg : 'Updating note...'

            })
            request.post(this.baseUrl+'/io/subscriber/comments/?BMS_REQ_TK='+this.props.users_details[0].bmsToken+'&type=update')
               .set('Content-Type', 'application/x-www-form-urlencoded')
               .send({
                         subNum: this.props.contact.subNum
                        ,updatedComment:encodeHTML(this.state.comment)
                        ,commentId:this.state.commentId
                        ,ukey:this.props.users_details[0].userKey
                        ,isMobileLogin:'Y'
                        ,userId:this.props.users_details[0].userId
                      })
               .then((res) => {
                  console.log(res.status);

                  var jsonResponse =  JSON.parse(res.text);
                  console.log(jsonResponse);
                  if(jsonResponse[0]=="err"){
                    ErrorAlert({message : jsonResponse[1]});
                  }

                  else{
                  //  this.props.parentProps.toggleLoadingMask();
                    SuccessAlert({message:jsonResponse.success});
                    this.setState({comment : "",commentId : null,showUpdate : 'hide',showAddBtn : 'show'});

                      this.getNotesLists();
                    //this.props.addContactToList();
                    //this.setState(this.baseState);
                  }
                });
          }
          deleteNote(commentid){
            this.setState({
              showLoading : true,
              loadingMsg : 'deleting note...'
            });
            request.post(this.baseUrl+'/io/subscriber/comments/?BMS_REQ_TK='+this.props.users_details[0].bmsToken+'&type=delete')
               .set('Content-Type', 'application/x-www-form-urlencoded')
               .send({
                         subNum: this.props.contact.subNum
                        ,commentIds:commentid
                        ,ukey:this.props.users_details[0].userKey
                        ,isMobileLogin:'Y'
                        ,userId:this.props.users_details[0].userId
                      })
               .then((res) => {
                  console.log(res.status);

                  var jsonResponse =  JSON.parse(res.text);
                  console.log(jsonResponse);
                  if(jsonResponse[0]=="err"){
                    ErrorAlert({message : jsonResponse[1]});
                  }

                  else{
                    SuccessAlert({message:jsonResponse.success});
                    this.setState({comment : "",commentId : null,showUpdate : 'hide',showAddBtn : 'show'});

                      this.getNotesLists();
                    //this.props.addContactToList();
                    //this.setState(this.baseState);
                  }
                });
          }
          cancelNote(){
              this.setState({comment : "",commentId : null,showUpdate : 'hide',showAddBtn : 'show'});
          }
          generateNotes(){
            console.log(this.state.notesLists);

            if(!this.state.notesLists){
              return (<div className="contacts-wrap">
              <div id="NoContact" className="tabcontent mksph_cardbox">
                    <h3>Notes</h3>
                      <p className="not-found">Loading...</p>
                  </div>
                      </div>);
            }
            if(this.state.noNotesFound){
              return(
                <div className="contacts-wrap">
                <div id="NoContact" className={`tabcontent mksph_cardbox ${this.state.showCreateCardBox}`}>
                      <h3>Notes</h3>
                        <p className="not-found">Notes not found on Makesbridge</p>
                    </div>
                        </div>
              )
            }
            let ListItems = this.state.notesLists.map((list,key) => {
              var _date = Moment(decodeHTML(list.updationDate),'YYYY-M-D H:m');
              var format = {date: _date.format("DD MMM YYYY"), time: _date.format("hh:mm A")};
              return (
                <li className="_mks_item" key={key}>
                  <div className="cf_silhouette">
                    <div className="mks-notestEdit-wrap cf_silhouette_text c_txt_s pclr8 hide" onClick={this.editNote.bind(this,list['commentId.encode'],decodeHTML(list.comment))}>
                      <i className="mksicon-Edit mks-task-icons"></i>
                    </div>
                    <div className="mks-notestDel-wrap cf_silhouette_text c_txt_s pclr12 hide" onClick={this.deleteNote.bind(this,list['commentId.encode'])}>
                      <i className="mksicon-Delete mks-task-icons"></i>
                    </div>
                    <div className="mks-notestNote-wrap cf_silhouette_text c_txt_s pclr15">
                      <i className="mksicon-Notepad mks-task-icons"></i>
                      </div>
                    </div>
                    <div className="cf_email_wrap">
                      <div className="cf_email">
                        <span className="mkb_text_break mkb_elipsis" title={decodeHTML(list.comment)}>{decodeHTML(list.comment)}</span>
                            <p><strong>You</strong> made a note at {format.time},{format.date}</p>
                      </div>

                    </div>
                </li>

              )
            }
          );

            return ListItems;

          }
           render(){
             return(
               <div className="_mks_NotesWrap">
                 <LoadingMask message={this.state.loadingMsg} showLoading={this.state.showLoading} />
                 <a className={`mkb_btn mkb_cf_btn pull-right mkb_greenbtn ${this.state.showAddBtn}`}  onClick={this.addNewNote.bind(this) } style={{"color" : "#fff","top" : "-38px","right":"-1px"}}>save</a>
                 <a className={`mkb_btn mkb_cf_btn pull-right c_txt_s_blue ${this.state.showUpdate}`}  onClick={this.updateNote.bind(this) } style={{"color" : "#fff","top" : "-38px","right":"56px"}}>update</a>
                 <a className={`mkb_btn mkb_cf_btn pull-right mks_cc_action_gray ${this.state.showUpdate}`}  onClick={this.cancelNote.bind(this) } style={{"color" : "#fff","top" : "-38px","right":"-1px"}}>cancel</a>
                 <textarea
                   value={this.state.comment}
                   onChange={event=> { this.setState({comment: event.target.value }) } }
                   onKeyPress = {this.handleOnEnter.bind(this)}
                   placeholder="Add your notes here"
                  />
                <div className={`height90 height210 ${this.state.setFullHeight} notes_lists_wrap`}>
                      <ul>
                        {this.generateNotes()}
                      </ul>

                  </div>
                  <div className={`${this.state.collapseExpand} ${this.state.showCollapse}`} onClick={this.toggleHeight.bind(this)}>
                    <span>{this.state.collapseMsg}</span>
                    <span className="mksicon-ArrowNext"></span>
                  </div>
               </div>
             )
           }

       }


export default Notes;
