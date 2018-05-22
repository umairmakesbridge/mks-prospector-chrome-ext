import React, {Component}
       from 'react';
import request
       from 'superagent';
import ToggleDisplay
       from 'react-toggle-display';
import ContactBasicInfo
       from './Contact_Basic_Info';
import ContactDetailInfo
       from './Contact_Details_Info';
import ActivityTimeline
       from './Activity_Timeline';
import {ErrorAlert,SuccessAlert}
       from '../common/Alerts';
import {encodeHTML,decodeHTML}
       from '../common/Encode_Method';
import Dialog
       from '../common/dialog';
import SubscriberLists
       from './subscriberLists';
import ManageSubscriberLists
       from './ManageSubscriberLists';
import LoadingMask
       from '../common/Loading_Mask';
import Workflow
       from './Workflow';
import Salesforce
        from './Salesforce';
import ReactTooltip
        from 'react-tooltip';
import  CourseCorrect
        from './CourseCorrect';

class ContactInfo extends Component{

  constructor(props){
      super(props);

      this.contact_info  = this.props.contact_email;
      this.users_details = this.props.users_details;
      this.baseUrl       = this.props.baseUrl;
      this.state = {
                    subNum        : '',
                    checkSum      : '',
                    email         : '',
                    firstName     : '',
                    lastName      : '',
                    score         : 0,
                    subscriber    : null,
                    diffEmail     : false,
                    showContacts  : true,
                    showActivity  : false,
                    contactActive : 'active',
                    activityActive: '',
                    changeInTagsView    : false,
                    changeInContactBasic: false,
                    contactnotFound  : false,
                    showScore : '',
                    autoFillTags : [],
                    loadingMaskAppear : false,
                    showParticipant : false,
                    showSubscriberAdd : false,
                    showSubscriberManager : false,
                    showLoading : false,
                    showWorkFlowDialog : false,
                    showSFDialog : false,
                    showJumpSF : 'hide',
                    showAddSf : 'hide',
                    showCCDialog : false,
                    isSalesforceUser : "four"
                   }

                   console.log('Salesforce user value : ',this.props.users_details.isSalesforceUser)
  }

  componentDidUpdate(){
    console.log(this.props.contact_email);
    if(this.users_details.length == 0 || !this.props.contact_email){
      this.state['subscriber']=null;
      this.state['firstName']=null;
      this.state['lastName']=null;
      this.state['contactnotFound']=false;
      this.state['email'] ='';
      return;
    }

    console.log("Is user shared ="+  this.props.isShareSearch);
    if(this.state.diffEmail){
      this.searchEmailInMks(this.props.contact_email,this.props.isShareSearch);

    }else if(this.state.changeInTagsView || this.state.changeInContactBasic){
      this.getSubscriberDetails();
    }

  }

  componentWillReceiveProps(nextProps){
    //this.loadSubscriptionData(nextProps.subscriptionId);
    if(nextProps.contact_email && this.state.email != nextProps.contact_email){
        this.setState({diffEmail : true,email : nextProps.contact_email,activityActive:'',showScore:'',contactActive : 'active',showContacts : true,showActivity  : false})
    }else{
        this.setState({diffEmail : false,contactActive : 'active',showContacts : true,showActivity  : false})
    }
  }
  searchEmailInMks(email,isShared){
    let sharedFlag = "";
    if(isShared=="Y"){
        sharedFlag ="&isShareSearch=Y";
    }
    var searchUrl = this.baseUrl
                    +'/io/subscriber/getData/?BMS_REQ_TK='
                    + this.props.users_details[0].bmsToken +'&type=getSAMSubscriberList&offset=0&searchValue='
                    +email+'&orderBy=lastActivityDate&ukey='+this.props.users_details[0].userKey
                    +'&isMobileLogin=Y&userId='+this.props.users_details[0].userId+sharedFlag;


    request
          .get(searchUrl)
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
                                  subNum   : jsonResponse.subscriberList[0].subscriber1[0].subNum,
                                  checkSum : jsonResponse.subscriberList[0].subscriber1[0].checkSum,
                                  email    : jsonResponse.subscriberList[0].subscriber1[0].email,
                                  score    : jsonResponse.subscriberList[0].subscriber1[0].score,
                                  diffEmail: false,
                                });
                    this.getSubscriberDetails();
                    //this.forceUpdate()

                }else{

                this.searchEmailInMksShared(email);

                }
              }
            });
  }

  searchEmailInMksShared(email){
    var searchUrl = this.baseUrl
                    +'/io/subscriber/getData/?BMS_REQ_TK='
                    + this.props.users_details[0].bmsToken +'&type=getSAMSubscriberList&offset=0&searchValue='
                    +email+'&orderBy=lastActivityDate&ukey='+this.props.users_details[0].userKey
                    +'&isMobileLogin=Y&userId='+this.props.users_details[0].userId+'&isShareSearch=Y'

    request
          .get(searchUrl)
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
                                  subNum   : jsonResponse.subscriberList[0].subscriber1[0].subNum,
                                  checkSum : jsonResponse.subscriberList[0].subscriber1[0].checkSum,
                                  email    : jsonResponse.subscriberList[0].subscriber1[0].email,
                                  score    : jsonResponse.subscriberList[0].subscriber1[0].score,
                                  diffEmail: false,
                                });
                    this.getSubscriberDetails();
                    //this.forceUpdate()

                }else{

                  this.setState({
                    contactnotFound : true,
                    diffEmail: false,
                    showScore : 'hide'
                  });
                }
              }
            });
  }




  getSubscriberDetails(){
    var searchUrl = this.baseUrl
                    +'/io/subscriber/getData/?BMS_REQ_TK='
                    + this.props.users_details[0].bmsToken +'&type=getSubscriber&subNum='
                    +this.state.subNum+'&ukey='+this.props.users_details[0].userKey
                    +'&isMobileLogin=Y&userId='+this.props.users_details[0].userId


    var _this = this;
                    request
                          .get(searchUrl)
                           .set('Content-Type', 'application/x-www-form-urlencoded')
                           .then((res) => {
                              if(res.status==200){
                                let jsonResponse =  JSON.parse(res.text);
                                _this.getAllTags();
                                _this.setState({
                                  subscriber : jsonResponse,
                                  changeInTagsView : false,
                                  changeInContactBasic : false,
                                  firstName     : jsonResponse.firstName,
                                  lastName      : jsonResponse.lastName,
                                  suppress      : jsonResponse.supress,
                                  contactnotFound : false,
                                  showJumpSF : (jsonResponse.sfUrl) ? 'show' : 'hide',
                                  showAddSf  : (!jsonResponse.sfUrl) ? 'show': 'hide',
                                  showActionButtons : (this.props.users_details[0].isSalesforceUser) ? "seven" : "five",
                                  showSfActionBtn : (this.props.users_details[0].isSalesforceUser) ? "show" : "hide",
                                  hideRightBorder : (this.props.users_details[0].isSalesforceUser) ? "" : "mks_hideRightBorder"
                                });

                                console.log('1. Getting Subscriber',jsonResponse);
                                if(this.props.isTaskClicked){
                                  setTimeout(function(){
                                    _this.scrollToTask()
                                  },1000)
                                }
                              }else{
                                ErrorAlert({ message : jsonResponse[1] })
                              }
                            });
  }
  getAllTags(){
    var searchUrl = this.baseUrl
                    +'/io/user/getData/?BMS_REQ_TK='
                    + this.props.users_details[0].bmsToken +'&type=allSubscriberTags&ukey='+this.props.users_details[0].userKey
                    +'&isMobileLogin=Y&userId='+this.props.users_details[0].userId
        //https://test.bridgemailsystem.com/pms/io/user/getData/?BMS_REQ_TK=c7jJ1hJuurtB3BmDSvlO1XHDinnjMF&type=allSubscriberTags
    request
           .get(searchUrl)
           .set('Content-Type', 'application/x-www-form-urlencoded')
           .then((res) => {
              if(res.status==200){
                let jsonResponse = JSON.parse(res.text);
                let tagsA = [];
                if (jsonResponse[0] == "err"){
                    if(jsonResponse[1] == "SESSION_EXPIRED"){
                      ErrorAlert({message:jsonResponse[1]});
                      jQuery('.mksph_logout').trigger('click');
                    }
                  return false;
                }
                console.log(jsonResponse);

                if(parseInt(jsonResponse.count) > 0){

                  var i=0;
                  jQuery.each(jsonResponse.tags[0],function(key,value){
                      tagsA.push({id:++i,value:decodeHTML(value[0].tag)});
                  });
                  this.setState({autoFillTags : tagsA});

                }
                /*if(parseInt(jsonResponse.totalCount) > 0){

                    this.setState({
                                  subNum   : jsonResponse.subscriberList[0].subscriber1[0].subNum,
                                  checkSum : jsonResponse.subscriberList[0].subscriber1[0].checkSum,
                                  email    : jsonResponse.subscriberList[0].subscriber1[0].email,
                                  score    : jsonResponse.subscriberList[0].subscriber1[0].score,
                                  diffEmail: false,
                                });
                    this.getSubscriberDetails();
                    //this.forceUpdate()

                }else{
                  this.setState({
                    contactnotFound : true,
                    diffEmail: false,
                    showScore : 'hide'
                  });
                }*/
              }
            });
  }

  updateBasicContactInfo(){
        console.log('Time to get parameter and send for update');
        this.setState({changeInContactBasic:true});
  }
  /*=re-render on change state of tags=*/
  changeTagView(){
    this.setState({
      changeInTagsView : true,
      loadingMaskAppear : true
    })
  }
  suppressContact(){
    let userDetails = this.props.users_details[0];
    var r = confirm("Are you sure you want to Suppress "+ this.state.email);
    var _this = this;
     if (r == true) {
      //https://mks.bridgemailsystem.com/pms/io/subscriber/setData/?BMS_REQ_TK=YpErXBzNUybsRCfCLNDNfOHxLisskQ
      this.setState({showLoading:true,message:"Supprssing Contact"})
      request.post(this.baseUrl+'/io/subscriber/setData/')
         .set('Content-Type', 'application/x-www-form-urlencoded')
         .send({

                   BMS_REQ_TK: userDetails.bmsToken
                  ,type:'suppress'
                  ,subNum: this.state.subNum
                  ,ukey:userDetails.userKey
                  ,isMobileLogin:'Y'
                  ,userId:userDetails.userId
                })
         .then((res) => {
            console.log(res);

            var jsonResponse =  JSON.parse(res.text);
            console.log(jsonResponse);
            if(res.status==200){

              this.setState({showLoading:false,message:""})
              SuccessAlert({message:"Contact created successfully."});
              _this.getSubscriberDetails();
            }else{
              if(jsonResponse[1] == "SESSION_EXPIRED"){
                ErrorAlert({message:jsonResponse[1]});
                jQuery('.mksph_logout').trigger('click');
              }else{
                ErrorAlert({message:jsonResponse[1]});
              }
            }
          });
     }
  }
  addContactToList(){
    let height = jQuery('.makesbridge_plugin').height();
    this.setState({showSubscriberAdd: !this.state.showSubscriberAdd,overlayHeight:height});
    this.refs.childSubscriberList.loadLists();
  }
  closeAddContactToList(){
    this.setState({showSubscriberAdd: false});
    this.refs.childSubscriberList.setStateDefault();
  }
  addContactIntoSubsList(){
    this.refs.childSubscriberList.saveContactIntoList()
  }
  manageContactToList(){
    let height = jQuery('.makesbridge_plugin').height();
    this.setState({showSubscriberManager: !this.state.showSubscriberManager,overlayHeight:height});
    this.refs.childSubscriberManagerList.manageLoadList();
  }
  updateContactIntoLists(){
    this.refs.childSubscriberManagerList.updateContactIntoLists();
  }
  showToWorkFlow(){
    let height = jQuery('.makesbridge_plugin').height();
    this.setState({showWorkFlowDialog: !this.state.showWorkFlowDialog,overlayHeight:height});
    this.refs.childSubscriberWorkflow.wfLoadList();
  }
  closeToWorkflow(){
    this.setState({showWorkFlowDialog: false});
    this.refs.childSubscriberWorkflow.setStateDefault();
  }
  saveWorkflowLists(){
    //alert('Call child save function for workflow');
    this.refs.childSubscriberWorkflow.saveWorkFlow()
  }

  showAddToSalesforce(){
    let height = jQuery('.makesbridge_plugin').height();
    this.setState({showSFDialog: !this.state.showSFDialog,overlayHeight:height});
    this.callSalesforce();
  }
  callSalesforce(){
    if(this.state.subNum){
      this.refs.childSubscriberSalesforce.getSalesforceData();
    }else{
      setTimout(function(){
        console.log('Recurrsive call executed (salesforce)')
        this.callSalesforce();
      }.bind(this),100);
    }

  }
  openNotes(){
    this.refs.ContactDetailInfoView.refs.notesView.cancelNote();
    $('.makesbridge_plugin').animate({
        scrollTop: $("._mks_NotesWrap").offset().top - 100
    }, 800);
      $('#note_textarea').focus()
  }
  scrollToTask(){
    $('.makesbridge_plugin').animate({
        scrollTop: $("#tasks").offset().top - 80
    }, 800);
  }
  saveSalesforce(){
    //alert('Call child save function for SF');
    this.refs.childSubscriberSalesforce.saveSalesForce()
  }
  closeSalesforce(){
    this.setState({showSFDialog: false});
    this.refs.childSubscriberSalesforce.setStateDefault();
  }
  changeSalesforceStatus(){
    this.getSubscriberDetails();
  }
  jumpToSalesforce(event){
    console.log('Time to jump to salesforce');
    var url = this.state.subscriber.sfUrl;
    window.open(decodeHTML(url), 'newwindow', 'scrollbars=yes,resizable=yes');
    event.stopPropagation();
  }

  showCourseCorrect(){

    let height = jQuery('.makesbridge_plugin').height();
    this.setState({showCCDialog: !this.state.showCCDialog,overlayHeight:height});
    this.refs.childSubscriberCC.getCourseCorrect();
    this.refs.dialogCC.hideSaveBtn(true);
  }
  closeCC(){
    console.log('Time to close')
    this.refs.childSubscriberCC.setStateDefault();
    this.setState({showCCDialog: false});
  }
  render(){
        if(!this.props.contact_email){
          return <div>Loading...</div>
        }
        return (
                   <div className={`s_contact_found_wraper new_contact_${this.state.contactnotFound} suppress_${(this.state.subscriber) ? this.state.subscriber.supress : ""}`}>
                             <ContactBasicInfo
                               contactInfo={this.state}
                               contact={this.state.subscriber}
                               updateContactHappened={this.updateBasicContactInfo.bind(this)}
                               baseUrl={this.baseUrl}
                               users_details={this.props.users_details}

                              />
                            <div className="hide SuppressNotify messagebox info animated"><p>This account has been <strong>Suppressed</strong></p></div>

                            <ToggleDisplay show={this.state.showSubscriberAdd}>

                                  <Dialog
                                    saveCallback= {this.addContactIntoSubsList.bind(this)}
                                    showTitle={"Add Contact to List"}
                                    ref="dialogSubscriberList1"
                                    closeCallback = {this.closeAddContactToList.bind(this)}
                                  >
                                      <SubscriberLists
                                        ref="childSubscriberList"
                                        parentProps = {this.refs.dialogSubscriberList1}
                                        baseUrl={this.baseUrl}
                                        users_details={this.props.users_details}
                                        contact={this.state.subscriber}
                                        addContactToList = {this.addContactToList.bind(this)}
                                        type={"add"}

                                      />

                                  </Dialog>
                                  <div className="OverLay" style={{height : (this.state.overlayHeight+"px" )}}></div>
                              </ToggleDisplay>
                                <ToggleDisplay show={this.state.showSubscriberManager}>
                                  <Dialog
                                    saveCallback= {this.updateContactIntoLists.bind(this)}
                                    showTitle={"Manage list subscription"}
                                    ref="dialogManagerList"
                                    closeCallback = {this.manageContactToList.bind(this)}
                                  >
                                  <ManageSubscriberLists
                                    ref="childSubscriberManagerList"
                                    parentProps = {this.refs.dialogManagerList}
                                    baseUrl={this.baseUrl}
                                    users_details={this.props.users_details}
                                    contact={this.state.subscriber}
                                    manageContactToList = {this.manageContactToList.bind(this)}
                                    type={"manage"}
                                  />
                                </Dialog>
                                <div className="OverLay" style={{height : (this.state.overlayHeight+"px" )}}></div>

                                </ToggleDisplay>

                                <ToggleDisplay show={this.state.showWorkFlowDialog}>
                                  <Dialog
                                    saveCallback= {this.saveWorkflowLists.bind(this)}
                                    showTitle={"Add to Sequence"}
                                    ref="dialogWorkflowList"
                                    closeCallback = {this.closeToWorkflow.bind(this)}
                                  >
                                  <Workflow
                                    ref="childSubscriberWorkflow"
                                    parentProps = {this.refs.dialogWorkflowList}
                                    baseUrl={this.baseUrl}
                                    users_details={this.props.users_details}
                                    contact={this.state.subscriber}
                                    showToWorkFlow = {this.showToWorkFlow.bind(this)}
                                  />
                                </Dialog>
                                <div className="OverLay" style={{height : (this.state.overlayHeight+"px" )}}></div>

                                </ToggleDisplay>

                                <ToggleDisplay show={this.state.showSFDialog}>
                                  <Dialog
                                    saveCallback= {this.saveSalesforce.bind(this)}
                                    showTitle={"Add to Salesforce"}
                                    ref="dialogSalesforce"
                                    closeCallback = {this.closeSalesforce.bind(this)}
                                    additionalClass = {"dialog_height_increased"}
                                  >
                                  <Salesforce
                                    ref="childSubscriberSalesforce"
                                    parentProps = {this.refs.dialogSalesforce}
                                    baseUrl={this.baseUrl}
                                    users_details={this.props.users_details}
                                    contact={this.state.subscriber}
                                    showToSalesforce = {this.showAddToSalesforce.bind(this)}
                                    closeSalesforce = {this.closeSalesforce.bind(this)}
                                    changeSalesforceStatus = {this.changeSalesforceStatus.bind(this)}
                                  />
                                </Dialog>
                                <div className="OverLay" style={{height : (this.state.overlayHeight+"px" )}}></div>

                                </ToggleDisplay>

                                <ToggleDisplay show={this.state.showCCDialog}>
                                  <Dialog
                                    showTitle={"Course Correct"}
                                    ref="dialogCC"
                                    closeCallback = {this.closeCC.bind(this)}
                                    additionalClass = {"dialog_height_increased"}
                                    hideSaveBtn = {true}
                                  >
                                    <CourseCorrect
                                      ref="childSubscriberCC"
                                      parentProps = {this.refs.dialogCC}
                                      baseUrl={this.baseUrl}
                                      users_details={this.props.users_details}
                                      contact={this.state.subscriber}
                                      showCourseCorrect = {this.showCourseCorrect.bind(this)}

                                    />
                                </Dialog>
                                <div className="OverLay" style={{height : (this.state.overlayHeight+"px" )}}></div>

                                </ToggleDisplay>
                            <div className="top-header contact_found top_managerLists_wrappers">
                                      <LoadingMask message={this.state.message} showLoading={this.state.showLoading}/>
                                      <div className="scf_o_right">
                                          <ul className={`top_manager_ul_wraps ${this.state.showActionButtons}`}>
                                            <li data-tip="Add to Sequence">
                                              <ReactTooltip />
                                              <div className="scf_option_icon ripple top_manage_lists" onClick={this.showToWorkFlow.bind(this)}>
                                                <a href="#" style={{textDecoration: 'unset'}}>
                                                  <div className="wrap_scf_o_i">
                                                    <div className="wrap_scf_o_i_md" style={{padding: '3px 0 0'}}>

                                                      <div  className="scf_o_icon scf_o_edit mksicon-act_workflow mks_manageList_wrap"></div>

                                                      </div>
                                                      </div>
                                                  </a>
                                                      </div>
                                                  </li>
                                              <li data-tip="Manage list subscription">
                                                <ReactTooltip />
                                                <div className="scf_option_icon ripple top_manage_lists" onClick={this.manageContactToList.bind(this)}>
                                                  <a href="#" style={{textDecoration: 'unset'}}>
                                                    <div className="wrap_scf_o_i">
                                                      <div className="wrap_scf_o_i_md">
                                                        <div className="scf_o_icon scf_o_edit mksicon-ManageLists mks_manageList_wrap"></div>

                                                        </div>
                                                        </div>
                                                    </a>
                                                        </div>
                                                    </li>
                                                    <li data-tip="Add to list">
                                                      <ReactTooltip />
                                                      <div className="scf_option_icon ripple top_manage_lists" onClick={this.addContactToList.bind(this)}>
                                                              <a href="#" style={{textDecoration: 'unset'}}>
                                                                <div className="wrap_scf_o_i">
                                                                  <div className="wrap_scf_o_i_md">
                                                                    <div className="scf_o_icon scf_o_edit  mksicon-Addlist mks_manageList_wrap"></div>

                                                                    </div>
                                                                    </div>
                                                                </a>
                                                              </div>
                                                          </li>
                                                          <li data-tip="Suppress contact" onClick={this.suppressContact.bind(this)}>
                                                            <ReactTooltip />
                                                            <div className="scf_option_icon ripple top_manage_lists">
                                                              <a href="#" style={{textDecoration: 'unset'}}>
                                                                <div className="wrap_scf_o_i">
                                                                  <div className="wrap_scf_o_i_md" style={{"padding" : "3px 0px 0px"}}>
                                                                    <div className="scf_o_icon scf_o_edit mksicon-User1 mks_manageList_wrap"></div>
                                                                    </div>
                                                                    </div>
                                                                </a>
                                                                    </div>
                                                                </li>
                                                          <li data-tip="Course Correct" className={`mks_cc_li_wrap ${this.state.hideRightBorder}`}onClick={this.showCourseCorrect.bind(this)}>
                                                            <ReactTooltip />
                                                            <div className="scf_option_icon ripple top_manage_lists">
                                                              <a href="#" style={{textDecoration: 'unset'}}>
                                                                <div className="wrap_scf_o_i">
                                                                  <div className="wrap_scf_o_i_md" >
                                                                    <div className="scf_o_icon scf_o_edit mksicon-course_correct mks_manageList_wrap"></div>
                                                                    </div>
                                                                    </div>
                                                                </a>
                                                                    </div>
                                                                </li>
                                                                <li data-tip="Add Notes" onClick={this.openNotes.bind(this)}>
                                                                  <ReactTooltip />
                                                                  <div className="scf_option_icon ripple top_manage_lists">
                                                                    <a href="#" style={{textDecoration: 'unset'}}>
                                                                      <div className="wrap_scf_o_i">
                                                                        <div className="wrap_scf_o_i_md" style={{"padding" : "3px 0px 0px"}}>
                                                                          <div className="scf_o_icon scf_o_edit mksicon-Notepad mks_manageList_wrap"></div>
                                                                          </div>
                                                                          </div>
                                                                      </a>
                                                                          </div>
                                                                      </li>


                                                                            <li data-tip="Add to Salesforce" className={`${this.state.showAddSf} ${this.state.showSfActionBtn} sf_icons mks_hideRightBorder`} onClick={this.showAddToSalesforce.bind(this)}>
                                                                              <ReactTooltip />
                                                                              <div className="scf_option_icon ripple top_manage_lists">
                                                                                <a href="#" style={{textDecoration: 'unset'}}>
                                                                                  <div className="wrap_scf_o_i">
                                                                                    <div className="wrap_scf_o_i_md" style={{padding : "3px 0 0 0"}}>
                                                                                      <div style={{"paddingTop" : "0px"}}  className="scf_o_icon scf_o_edit mksicon-add_to_salesforce mks_manageList_wrap"></div>

                                                                                      </div>
                                                                                      </div>
                                                                                  </a>
                                                                                      </div>
                                                                                  </li>
                                                                      <li data-tip="Jump Salesforce" className={`${this.state.showJumpSF} ${this.state.showSfActionBtn} sf_icons mks_hideRightBorder`} onClick={this.jumpToSalesforce.bind(this)}>
                                                                        <ReactTooltip />
                                                                        <div className="scf_option_icon ripple top_manage_lists">
                                                                          <a href="#" style={{textDecoration: 'unset'}}>
                                                                            <div className="wrap_scf_o_i">
                                                                              <div className="wrap_scf_o_i_md" >
                                                                                <div style={{"paddingTop" : "0px"}} className="scf_o_icon scf_o_edit mksicon-jump_to_salesforce_record mks_manageList_wrap"></div>
                                                                                </div>
                                                                                </div>
                                                                            </a>
                                                                                </div>
                                                                            </li>

                                                </ul>
                                            </div>
                                      </div>
                          <div className="scf_tab_wrap">
                              <div className="scf_tab">
                                  <div className="tab">
                                    <button className={`tablinks ripple ${this.state.contactActive}`} onClick={switchTab => { this.setState({showContacts:true,showActivity:false,activityActive:'',contactActive:'active'})} }>Contact</button>
                                    <button className={`tablinks ripple ${this.state.activityActive}`} onClick={switchTab => { this.setState({showContacts:false,showActivity:true,activityActive:'active',contactActive:''}) } } id="defaultOpen">Activity</button>
                                    <div className={`score ${this.state.showScore}`}>
                                      <i className="icon score"></i>
                                      +
                                      <span className="score-value">{this.state.score}</span>
                                    </div>
                                  </div>

                                  <div className="tab_content_wrap">
                                      <ToggleDisplay show={this.state.showContacts}>
                                        <ContactDetailInfo
                                          contact={this.state.subscriber}
                                          users_details={this.props.users_details}
                                          baseUrl={this.baseUrl}
                                          changeInTagsView={this.changeTagView.bind(this)}
                                          contactnotFound={this.state.contactnotFound}
                                          getSubscriberDetails = {this.getSubscriberDetails.bind(this)}
                                          autoFillTags = {this.state.autoFillTags}
                                          loadingMaskAppear = {this.state.loadingMaskAppear}
                                          ref="ContactDetailInfoView"
                                          />
                                      </ToggleDisplay>
                                    <ToggleDisplay show={this.state.showActivity}>
                                      <ActivityTimeline
                                        contact={this.state.subscriber}
                                        users_details={this.props.users_details}
                                        contactnotFound={this.state.contactnotFound}
                                        baseUrl={this.baseUrl}
                                      />
                                    </ToggleDisplay>
                                  </div>
                              </div>
                            </div>
                        </div>
              );


  }
}

export default ContactInfo;
