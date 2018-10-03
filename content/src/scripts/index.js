import React, {Component}
       from 'react';
import {render}
       from 'react-dom';
import {Provider}
       from 'react-redux';
import {Store}
       from 'react-chrome-redux';
import request
       from 'superagent';
import ToggleDisplay
       from 'react-toggle-display';


const gmail = new Gmail();
//import App       from './components/app/App';
import LoginForm   from './components/loginform/LoginForm';
import GmailEmail  from './components/gmaillist/Email_List';
import ContactInfo from './components/contacts/Contact_Info';
import SearchContacts from './components/contacts/Search_Contacts';
import Menu from './components/menu/menu';
import LoadingMask from './components/common/Loading_Mask';
import AddNewContact from './components/contacts/add_new_contact';

const anchor = document.createElement('div');
anchor.id = 'rcr-anchor';


document.body.insertBefore(anchor, document.body.childNodes[0]);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users_details    : [],
      gmail_email_list : [],
      showLogin        : true,
      gmailEmails      : false,
      showLoading      : false,
      loadingMessage   : 'Loading....',
      showContacts     : false,
      appPanel         : false,
      selectedEmail    : null,
      chromeExObj      : null,
      islogOut           : 'hide',
      gmail_emails_body: [],
      isLoggedOut      : false,
      isTaskClicked    : false,
      showStatus       : false,
      baseUrl          : 'https://mks.bridgemailsystem.com/pms',
      googleAccessToken: _mks_access_token
    };

    //// preserve the initial state in a new object
    this.baseState = {
                     showLogin:this.state.showLogin,
                     gmailEmails:this.state.gmailEmails,
                     showContacts:this.state.showContacts,
                     islogOut:'hide',
                     selectedEmail:this.state.selectedEmail,
                     gmail_email_list:this.state.gmail_email_list,
                     isLoggedOut   : true,
                     users_details : this.state.users_details
    };

    this.onEmailSelect = this.onEmailSelect.bind(this);
    this.toggleTopMenu = this.toggleTopMenu.bind(this);
    this.hideTopMenu = this.hideTopMenu.bind(this);
    this.goBack = this.goBack.bind(this);
    this.createNewList = this.createNewList.bind(this);
    this.checkSubscriberList = this.checkSubscriberList.bind(this);
    //this.ToggleTaskList = this.toggleTaskList.bind(this);
  }

  componentWillMount() {
    let _this = this;
    console.log('i1. Index component is mounting.');
    gmail.observe.on("load", function() {
      console.log('check position : ', gmail.check.is_inside_email());
      // if email is open
      console.log('Hello,', gmail.get.user_email());
      if (gmail.check.is_inside_email()) {
        var email_id = gmail.get.email_id();
        var emailDetails = gmail.get.email_data(email_id);
        console.log(emailDetails.people_involved)
        //_this.state['gmail_email_list'] = emailDetails.people_involved;



        var email = new gmail.dom.email($('div.adn')); // optionally can pass relevant $('div.adn');
        var body = email.body();
        var id = email.id;
        _this.state.gmail_emails_body.push(_this.extractEmailsFromBody(body));
        _this.setEmailsUniquely(emailDetails.people_involved);
        //console.log(jQuery.unique(  ));
        //return false;

      }



      //on open of email
      gmail.observe.on('view_thread',(obj) =>{
        console.log('view_thread', obj);

        // var email = new gmail.dom.email();
        // var email = new gmail.dom.email(gmail.get.email_id());
        // //console.log(email);
        // var body = $('div.adn[data-message-id="'+email.id+'"]');
        // var id = email.id;
        //
        // console.log(body);
        _this.setState({
          showStatus : true
        });
        setTimeout(function(){
          console.log('Trying to render data');
          //var email = new gmail.dom.email(gmail.get.email_id());
          var email = new gmail.dom.email($('div.adn')); // optionally can pass relevant $('div.adn');

          var body = email.body();
          //var body = $('div.adn')
          var emailDetails = gmail.get.email_data(gmail.get.email_id());
          _this.state.gmail_emails_body = [];
          _this.state.gmail_emails_body.push(_this.extractEmailsFromBody(body));
          _this.setEmailsUniquely(emailDetails.people_involved);
        },300);
      });

      gmail.observe.on('view_email',(obj) =>{
        console.log('view_email', obj);
        var emailDetails = gmail.get.email_data(obj.id);
        console.log(emailDetails);

        var email = new gmail.dom.email($(obj.$el[0]));
        var body = email.body();
        var id = email.id;
        console.log(body);
        _this.state.gmail_emails_body = [];
        _this.state.gmail_emails_body.push(_this.extractEmailsFromBody(body));
        _this.setEmailsUniquely(emailDetails.people_involved);
      });

      /*gmail.observe.on("open_email", (id, url, body, xhr) => {
        console.log("Open Email","id:", id, "url:", url, 'body', body, 'xhr', xhr);
        var emailDetails = gmail.get.email_data(id);
        console.log(emailDetails);
        //_this.state['gmail_email_list'] = emailDetails.people_involved;

        var email = new gmail.dom.email($('div.adn')); // optionally can pass relevant $('div.adn');

        var body = email.body();
        var id = email.id;
        if(body){
            console.log('Body of email is recieved');
          }else{
            console.log('Body is empty');
          }
        _this.state.gmail_emails_body = [];
        _this.state.gmail_emails_body.push(_this.extractEmailsFromBody(body));
        _this.setEmailsUniquely(emailDetails.people_involved);

      });*/

    });

  }

  componentDidMount(){
      console.log('i2. Index componentDidMount is mounting.');
    if(localStorage.getItem('pmks_userpass')){
      let username = localStorage.getItem('pmks_userpass').split("__")[0];
      let password = localStorage.getItem('pmks_userpass').split("__")[1];
      this.refs.loginform.autoLogin(username,password);
      this.state.showLogin = false;
      this.state.showLoading = true;
    }
    console.log("--------in did mout"+ _mks_access_token);
    /*const headers = new Headers({
        'Authorization' : 'Bearer ' + _mks_access_token,
        'Content-Type': 'application/json'
    })

    const queryParams = { headers };

    fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', queryParams)
    .then((response) => response.json())
    .then(function(data) {
        console.log(data);
      })*/
      /*var reqObj = {
            'summary': 'Update Task to new',
            'description': 'A chance to hear more about Google Calender',
            'start': {
              'dateTime': '2018-08-16T04:00:00-07:00'
            },
            'end': {
              'dateTime': '2018-08-16T05:00:00-07:00',
            },
            'attendees': [
              {'email': 'theumairshahid@gmail.com'},
            ],
            'reminders': {
              'useDefault': false
            }
          }
          //request.post("https://www.googleapis.com/calendar/v3/calendars/primary/events")
          request.put("https://www.googleapis.com/calendar/v3/calendars/primary/events/3644a684f98ea8fe223c713b77189a77")
         .set('Content-Type', 'application/json')
         .set('Authorization','Bearer ' + _mks_access_token)
         .send(reqObj)
         .then((res) => {
            console.log(res);

          });*/
                 
         /* request.put("https://www.googleapis.com/calendar/v3/calendars/primary/events/3644a684f98ea8fe223c713b77189a77")
         .set('Content-Type', 'application/json')
         .set('Authorization','Bearer ' + _mks_access_token)         
         .then((res) => {
            console.log(res);

          });*/

  }

  extractEmailsFromBody(text){
      return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
  }
  setEmailsUniquely(gmailApiEmails){
        let gmail_email_list_array = [];
        let uniqueEmails;
        var pattern =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        jQuery.each(gmailApiEmails,function(key,value){
            if(pattern.test(value[0]))
              gmail_email_list_array.push(value[0]);
            else
              gmail_email_list_array.push(value[1]);
        });
        if(this.state.gmail_emails_body[0]){
          uniqueEmails = jQuery.unique(jQuery.merge(gmail_email_list_array,this.state.gmail_emails_body[0]));
        }else{
          uniqueEmails = gmail_email_list_array;
        }

        console.log(uniqueEmails);
        this.setState({
          gmail_email_list : uniqueEmails,
          showStatus : false
        })
  }
  onEmailSelect(selectedEmailC,isTaskClick,shareSearch){
    console.log('Selected email from child : '+selectedEmailC);
    let isTask = (isTaskClick) ? isTaskClick : false;
    let isShareSearch = shareSearch=="Y" ? "Y" : "N" ;
    //this.setState({selectedEmail : selectedEmailC});
     this.setState(() => {
                return { selectedEmail : selectedEmailC,showContacts: true,gmailEmails: false,isTaskClicked: isTask, isShareSearch: isShareSearch};
                });
  }

  createNewList(){
    let userDetails = this.state.users_details[0];
    let userName    =    userDetails.userId.split('@')[0];

    request.post(this.state.baseUrl+'/io/list/saveListData/')
       .set('Content-Type', 'application/x-www-form-urlencoded')
       .send({

                 BMS_REQ_TK: userDetails.bmsToken
                ,type:'create'
                ,listName: 'PROS_'+userName+'_GMAIL'
                ,ukey:userDetails.userKey
                ,isMobileLogin:'Y'
                ,userId:userDetails.userId
              })
       .then((res) => {
          console.log(res.status);

          var jsonResponse =  JSON.parse(res.text);
          console.log(jsonResponse);
          if(res.status==200){
            this.state.users_details[0]['listObj']={listNum:jsonResponse[1],listChecksum:jsonResponse[2]}
            console.log(this.state.users_details);
          }
        });
  }

  checkSubscriberList(){
    let userDetails = this.state.users_details[0];
    let userName    = userDetails.userId.split('@')[0];
    var searchUrl   = this.state.baseUrl
                      +'/io/list/getListData/?BMS_REQ_TK='
                      +userDetails.bmsToken
                      +'&searchText=PROS_'+userName+'_GMAIL&type=batches&orderBy=name&order=asc&ukey='
                      +userDetails.userKey
                      +'&isMobileLogin=Y&userId='+userDetails.userId

                    request.get(searchUrl)
                             .set('Content-Type', 'application/x-www-form-urlencoded')
                             .then((res) => {
                                  if(res.status==200){
                                    let jsonResponse = JSON.parse(res.text);
                                      if(parseInt(jsonResponse.totalCount)==0){

                                        this.createNewList();
                                        this.getUserSFStats();
                                    }else{

                                        console.log(jsonResponse.totalCount)
                                        this.state.users_details[0]['listObj']={
                                                                            listNum:jsonResponse.lists[0].list1[0]['listNumber.encode']
                                                                            ,listChecksum:jsonResponse.lists[0].list1[0]['listNumber.checksum']
                                                                          }
                                        this.getUserSFStats();
                                        console.log(this.state.users_details);
                                    }
                                    if(this.state.isLoggedOut){
                                      this.refs.gmailemail.autoRequestGen('logout');
                                      this.state['isLoggedOut'] = false;
                                    }
                                  }
                              });
    console.log('First to check list by get');
  }
  getUserSFStats(){
    //https://test.bridgemailsystem.com/pms/
    //io/salesforce/getData/?BMS_REQ_TK=nVla24lTtjV9TbuHJ3SMzXDbAE5AvH&type=status
    let userDetails = this.state.users_details[0];
    var searchUrl = this.state.baseUrl
                    +'/io/salesforce/getData/?BMS_REQ_TK='
                    + userDetails.bmsToken +'&type=status&ukey='+userDetails.userKey
                    +'&isMobileLogin=Y&userId='+userDetails.userId
                    request
                           .get(searchUrl)
                           .set('Content-Type', 'application/x-www-form-urlencoded')
                           .then((res) => {
                              if(res.status==200){
                                let jsonResponse = JSON.parse(res.text);
                                let tagsA = [];
                                if (jsonResponse[0] == "err"){
                                    if(jsonResponse[1] == "SESSION_EXPIRED"){
                                      //ErrorAlert({message:jsonResponse[1]});
                                      jQuery('.mksph_logout').trigger('click');
                                    }
                                  return false;
                                }
                                console.log(jsonResponse);

                                if(jsonResponse.isLoggedIn == "Y"){
                                  this.state.users_details[0]['isSalesforceUser'] = jsonResponse.isSalesforceUser;
                                }
                              }
                            });
  }
  toggleTopMenu (event){
    jQuery("#lists_option").animate({width: 'toggle'})

    event.stopPropagation()
  }
  ToggleTaskList(event){
    this.refs.gmailemail.showHideTaskList()
  }
 hideTopMenu (event){
   jQuery("#lists_option").hide();
   event.stopPropagation()
 }
 goBack (){
   this.refs.gmailemail.autoRequestGen();
   this.setState(() => {
      return { selectedEmail : null, showContacts: false,gmailEmails: true };
  });
 }

 logOut(){
   console.log('1. Logout is triggered');
   localStorage.removeItem('pmks_userpass');
   this.setState(this.baseState);
   this.refs.gmailemail.refs.searchcontacts.hideUpTaskList();
   this.refs.gmailemail.refs.searchcontacts.resetSearchSelectBox();
   this.refs.gmailemail.resetGmail();
 }


  render() {
    return (
      <div className="appWrapper">
        <div className="mksiconplugin" onClick={showLogin => this.setState({appPanel:true})}>
          <a href="#" className="closepanel">
            <span className="mks_logo">
            </span>
            </a>
        </div>
    <ToggleDisplay show={this.state.appPanel}>
      <div className="makesbridge_plugin full_s" onClick={this.hideTopMenu}>
          <div className="mkspanel">
            <div className="mkspanelhead">
                    <div className="mksph_row">
                        <div className={this.state.showLogin ? "hidden" : "hidden" } onClick={this.toggleTopMenu} >
                            <a><span className="mksph_icon_menu" aria-hidden="true" data-icon="&#xe90a;"></span></a>
                        </div>
                        <div className="back-container">
                        <ToggleDisplay show={this.state.selectedEmail==null?false:true}>
                          <div
                            className="mksph_back ripple"
                            onClick={this.goBack}
                            >
                          <a href="#"><span className="mksph_icon_back" aria-hidden="true" data-icon="&#xe91b;"></span></a>
                          </div>
                        </ToggleDisplay>
                        </div>
                        <div className="mksph_logo">
                            <div className="logo">
                                <center>
                                    <a href="http://www.makesbridge.com/">
                                    <div className="mks_logo_img"></div>
                                </a>
                                </center>

                            </div>
                        </div>
                        <div className={`${this.state.islogOut} mksph_logout ripple`} onClick={ this.logOut.bind(this) }>
                          <span className="mksicon-logout" title="Logout"></span>logout</div>

                        <div
                          className="mksph_close ripple"
                          onClick={showLogin => this.setState({appPanel:false})}
                          >
                        <a href="#" title="Close"><span className="mksph_icon_close" aria-hidden="true" data-icon="&#xe915;"></span></a>
                        </div>

                        <div className="clr"></div>
                    </div>
                </div>
        <Menu />
        <LoadingMask message={this.state.loadingMessage} showLoading={this.state.showLoading} extraClass="fullHeight"/>
        <ToggleDisplay show={this.state.showLogin}>

        <LoginForm
                users_details={this.state.users_details}
                baseUrl = {this.state.baseUrl}
                toggleShowLogin={showLogin => this.setState({
                                    showLogin: false,
                                    gmailEmails:!this.state.gmailEmails,
                                    showLoading : false,
                                    islogOut : ''
                                  })}
                createNewList={this.createNewList}
                checkSubscriberList={this.checkSubscriberList}
                ref="loginform"
        />
        </ToggleDisplay>

        <ToggleDisplay show={this.state.gmailEmails}>
        <div className="topbtn_wraps_contact_tasks">
        <AddNewContact
          users_details={this.state.users_details}
          baseUrl = {this.state.baseUrl}
          onEmailSelect = {this.onEmailSelect}
          onTaskListBtn = {this.ToggleTaskList.bind(this)}
        />
        </div>
        <GmailEmail
          onEmailSelect = {this.onEmailSelect}
          gmail_email_list={this.state.gmail_email_list}
          users_details={this.state.users_details}
          chromeExObj = {this.state.chromeExObj}
          baseUrl = {this.state.baseUrl}
          ref="gmailemail"
          />

        </ToggleDisplay>
        <ToggleDisplay show={this.state.showContacts}>
        <ContactInfo
          baseUrl = {this.state.baseUrl}
          users_details={this.state.users_details}
          contact_email = {this.state.selectedEmail}
          isTaskClicked = {this.state.isTaskClicked}
          isShareSearch = {this.state.isShareSearch}
        />
        </ToggleDisplay>
        </div>
      </div>
      </ToggleDisplay>
      </div>
    );
  }
}

render(
  <App/>, document.getElementById('rcr-anchor'));
