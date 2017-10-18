import React, {Component}
       from 'react';
import request
       from 'superagent';
import SingleContact
       from './Single_Contact';

class SearchContacts extends Component{
    constructor (props){
      super(props);
      this.users_details = this.props.users_details;
      this.baseUrl = this.props.baseUrl;
      this.state = {
                    searchContact : '',
                    code:'',
                    subscriber : '',
                    vcsubscribers : '',
                    searchstat: '',
                    clicks:0,
                    visits:0,
                    countSet:false,
                    cactive : 'active',
                    tactive : '',
                    placeholder: 'Enter name or email',
                    type:''
                  }
    }

    componentDidUpdate(prevProps, prevState){
      if(this.users_details.length > 0 && !this.state.countSet){
          this.getClickVisitCount();
        }
    }


    handleOnKeyPress(event){
      const code = event.keyCode || event.which;
      if(code == 13){
        if(this.state.searchContact && this.state.cactive){
          this.setState({searchstat:'load'});
          this.generateReqObjec("search");
        }else if(this.state.searchContact && this.state.tactive){
          this.setState({searchstat:'load'});
          this.generateReqObjec("searchTag");
        }

      }
      //this.setState({searchContact : event.target.value})
    }
    handleOnChange(event){
      this.setState({searchContact : event.target.value});
      if(!event.target.value){
        this.setState({subscriber : ''});
      }

    }
    generateReqObjec(type){
      console.log(type);
      //https://mks.bridgemailsystem.com/pms/io/subscriber/getData/?BMS_REQ_TK=GX2Syeq1dZlJn8LNQxG18DgSh3uoNV&type=getSAMSubscriberList&offset=0&filterBy=CK&lastXDays=1
      if(type=="CK" || type=="WV"){
        var searchUrl = this.baseUrl+'/io/subscriber/getData/?BMS_REQ_TK='
                        + this.users_details[0].bmsToken +'&type=getSAMSubscriberList&offset=0&filterBy='+type+'&lastXDays=1&ukey='+this.users_details[0].userKey
                        +'&isMobileLogin=Y&userId='+this.users_details[0].userId
      }else if(type=="search"){
        var searchUrl = this.baseUrl+'/io/subscriber/getData/?BMS_REQ_TK='
                        + this.users_details[0].bmsToken +'&type=getSAMSubscriberList&offset=0&searchValue='
                        +this.state.searchContact+'&orderBy=lastActivityDate&ukey='+this.users_details[0].userKey
                        +'&isMobileLogin=Y&userId='+this.users_details[0].userId
      }else if(type=="searchTag"){
        //https://mks.bridgemailsystem.com/pms/io/subscriber/getData/?BMS_REQ_TK=PpYb22mrbT7MLY9B2SmVQQNSozbnJd&type=getSAMSubscriberList&offset=0&searchTag=mks&orderBy=lastActivityDate
        var searchUrl = this.baseUrl+'/io/subscriber/getData/?BMS_REQ_TK='
                        + this.users_details[0].bmsToken +'&type=getSAMSubscriberList&offset=0&searchTag='
                        +this.state.searchContact+'&orderBy=lastActivityDate&ukey='+this.users_details[0].userKey
                        +'&isMobileLogin=Y&userId='+this.users_details[0].userId
      }
      this.getConactDetails(searchUrl,type);
    }
    getConactDetails(searchUrl,type){

      request
            .get(searchUrl)
             .set('Content-Type', 'application/x-www-form-urlencoded')
             .then((res) => {
                console.log(200, res.status);
                var jsonResponse =  JSON.parse(res.text);
                if(jsonResponse[0] != "err"){
                  if(jsonResponse.totalCount=="0"){
                    this.setState({
                      searchstat:'nofound'
                    })
                  }
                  else {
                    let subscriberEmails = [];
                    jQuery.each(jsonResponse.subscriberList[0],function(key,value){
                        subscriberEmails.push(value[0]);
                    });
                    console.log(subscriberEmails);
                    if(type=="CK" || type=="WV"){
                      this.setState({
                        vcsubscribers : subscriberEmails,
                        searchstat:'',
                        type : (type == "CK") ? "Clicks" : "Visitors"
                      })
                    }else if(type=="search" || type=="searchTag"){
                      this.setState({
                        subscriber : subscriberEmails,
                        searchstat:'',
                        type : "contacts"
                      })
                    }

                  }
                }else{
                  alert(jsonResponse[1]);
                  jQuery('.mksph_logout').trigger('click');
                  this.setState({
                    searchstat: 'err',
                    subscriber : ''
                  })
                }

              });
    }

    getClickVisitCount (){

        //https://mks.bridgemailsystem.com/pms/io/subscriber/getData/?BMS_REQ_TK=GX2Syeq1dZlJn8LNQxG18DgSh3uoNV&type=getSAMSubscriberStats
        /*var searchUrl = this.baseUrl+'/io/subscriber/getData/?BMS_REQ_TK='
                        + this.users_details[0].bmsToken +'&type=getSAMSubscriberList&offset=0&filterBy=CK&lastXDays=1&ukey='+this.users_details[0].userKey
                        +'&isMobileLogin=Y&userId='+this.users_details[0].userId*/

        var searchUrl = this.baseUrl+'/io/subscriber/getData/?BMS_REQ_TK='
                                      + this.users_details[0].bmsToken +'&type=getSAMSubscriberStats&ukey='+this.users_details[0].userKey
                                      +'&isMobileLogin=Y&userId='+this.users_details[0].userId
        request
              .get(searchUrl)
               .set('Content-Type', 'application/x-www-form-urlencoded')
               .then((res) => {
                                console.log(200, res.status);
                                var jsonResponse =  JSON.parse(res.text);
                                if(jsonResponse[0] != "err"){
                                  console.log(jsonResponse);
                                  this.setState({
                                    clicks : jsonResponse.clickCount,
                                    visits : jsonResponse.visitCount,
                                    countSet : true
                                  });
                                }
                              });
    }


    render(){
        return (
          <div className="s_contact_found_wraper">
            <div className="top-header contact_found">
                <span className="click-label">Last 24 hrs: </span>
                <ul>
                  <li onClick={this.generateReqObjec.bind(this,"CK")}><span className="pclr23 badge">{this.state.clicks}</span> Clickers</li>
                  <li onClick={this.generateReqObjec.bind(this,"WV")}><span className="pclr19 badge">{this.state.visits}</span> Visitors</li>
                </ul>
            </div>
            <div className="container">
                <SingleContact
                  contact={this.state.vcsubscribers}
                  onEmailSelect={this.props.onEmailSelect}
                  type = {this.state.type}
                />
            </div>
              <div className='searchBar'>
                  <p>Open an email or search for a contact on Makesbridge</p>
                  <h2>Search</h2>
                    <div className="contacts-switch">
                        <div className="status_tgl">
                            <a className={`draft toggletags ${this.state.tactive} showtooltip`} onClick={switchActive => this.setState({tactive:'active',searchContact:'',cactive:'',placeholder:'Enter tag'}) }><i className="toggletag-icon"></i>Tags</a>
                            <a className={`published toggletags ${this.state.cactive} showtooltip`} onClick={switchActive => this.setState({tactive:'',searchContact:'',cactive:'active',placeholder:'Enter name or email'}) }><i className="togglecontact-icon"></i>Contacts</a>
                      </div>
                    </div>
                  <input
                    type="text"
                    placeholder = {this.state.placeholder}
                    value = {this.state.searchContact}
                    onKeyPress = {this.handleOnKeyPress.bind(this)}
                    onChange = {this.handleOnChange.bind(this)}
                  />
                <span className="mksph_icon_search" aria-hidden="true" data-icon="&#xe903;"></span>
              </div>
              <div className="container">
                  <SingleContact
                    contact={this.state.subscriber}
                    stat={this.state.searchstat}
                    onEmailSelect={this.props.onEmailSelect}
                    type = {this.state.type}
                  />
              </div>
          </div>
        );

    }
}

export default SearchContacts;
