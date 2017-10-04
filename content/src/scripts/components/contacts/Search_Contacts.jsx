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
      this.state = {searchContact : '',code:'',subscriber : '', searchstat: ''}
    }

    handleOnKeyPress(event){
      const code = event.keyCode || event.which;
      if(code == 13){
        if(this.state.searchContact){
          this.setState({searchstat:'load'});
          this.getConactDetails();
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
    getConactDetails(contact){
      var searchUrl = this.baseUrl+'/io/subscriber/getData/?BMS_REQ_TK='
                      + this.users_details[0].bmsToken +'&type=getSAMSubscriberList&offset=0&searchValue='
                      +this.state.searchContact+'&orderBy=lastActivityDate&ukey='+this.users_details[0].userKey
                      +'&isMobileLogin=Y&userId='+this.users_details[0].userId


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
                    this.setState({
                      subscriber : subscriberEmails,
                      searchstat:''
                    })
                  }
                }else{
                  alert(res[1]);
                  this.setState({
                    searchstat: 'err'
                  })
                }

              });
    }
    render(){
        return (
          <div className="s_contact_found_wraper">
              <div className='searchBar'>
                  <p>Search of contacts will perform from bridgemailsystem</p>
                  <h2>Search for contact</h2>
                  <input
                    type="text"
                    placeholder = "Search Name or Email"
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
                  />
              </div>
          </div>
        );

    }
}

export default SearchContacts;
