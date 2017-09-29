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
      this.state = {searchContact : '',code:'',subscriber : '', searchstat: ''}
    }

    handleOnChange(event){
      const code = event.keyCode || event.which;
      if(code == 13){
        this.setState({searchstat:'load'});
        this.getConactDetails();
      }
      //this.setState({searchContact : event.target.value})
    }
    getConactDetails(contact){
      var searchUrl = 'https://test.bridgemailsystem.com/pms/io/subscriber/getData/?BMS_REQ_TK='
                      + this.users_details[0].bmsToken +'&type=getSAMSubscriberList&offset=0&searchValue='
                      +this.state.searchContact+'&orderBy=lastActivityDate&ukey='+this.users_details[0].userKey
                      +'&isMobileLogin=Y&userId='+this.users_details[0].userId


      request
            .get(searchUrl)
             .set('Content-Type', 'application/x-www-form-urlencoded')
             .then((res) => {
                console.log(200, res.status);
                var jsonResponse =  JSON.parse(res.text);
                if(jsonResponse.totalCount=="0"){
                  this.setState({
                    searchstat:'nofound'
                  })
                }
                else {
                  this.setState({
                    subscriber : jsonResponse.subscriberList[0].subscriber1[0],
                    searchstat:''
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
                    onKeyPress = {this.handleOnChange.bind(this)}
                    onChange = {event => this.setState({searchContact : event.target.value})}
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
