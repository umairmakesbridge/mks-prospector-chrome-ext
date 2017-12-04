import React, {Component} from 'react';
import SearchContacts from '../contacts/Search_Contacts';
import EmailItem from './Email_Item';
import {CustomScrollBar} from 'react-custom-scrollbar';

// Refactor to Make Class Based Component
class GmailEmailList extends Component{
      constructor(props){
        super(props);
        //this.showEmailList = (this.props.gmail_email_list && this.props.gmail_email_list.length ) ? 's_contact_found_wraper plc_marginbottom10' : 's_contact_found_wraper hide';
        this.state={
          EmailItems : '',
          emailCount : (this.props.gmail_email_list) ? this.props.gmail_email_list.length : ""

        }
      }
      autoRequestGen(type){
        this.refs.searchcontacts.getClickVisitCount(type);
      }
      resetGmail(){
        this.refs.searchcontacts.resetSearch();
      }
      generateGmailEmails(){
        if(this.props.gmail_email_list && this.props.gmail_email_list.length > 0){
          return this.props.gmail_email_list.map((item) => {
           return (<EmailItem
                        item = {item}
                        key={item}
                        onEmailSelect = {this.props.onEmailSelect}
                  />);
          });
        }
      }
      render(){
        if(this.props.gmail_email_list && this.props.gmail_email_list.length == 0){
          return (<div>
            <div className="s_contact_found_wraper hide"></div>
                  <SearchContacts
                    baseUrl = {this.props.baseUrl}
                    onEmailSelect={this.props.onEmailSelect}
                    users_details={this.props.users_details}
                    ref="searchcontacts"
                  />
            </div>
          )
        }
        if(this.props.gmail_email_list && this.props.gmail_email_list.length > 0){
          return (
                <div>

                <div className="s_contact_found_wraper plc_marginbottom10" >
                            <h2 className="total-count-head">
                              <strong className="badge total-count">{this.props.gmail_email_list.length}</strong>
                                <span className="total-text">emails found on page</span>
                            </h2>
                            <CustomScrollBar
                              allowOuterScroll={false}
                              heightRelativeToParent={`188`}
                              onScroll={() => {console.log('Scrolling')}}
                              addScrolledClass={true}
                              freezePosition={false}
                              handleClass="inner-handle"
                              minScrollHandleHeight={38}
                          >
                          <div className="list_contact_found_wraper">{this.generateGmailEmails()}</div>
                            </CustomScrollBar>
                        </div>

                <SearchContacts
                  baseUrl = {this.props.baseUrl}
                  onEmailSelect={this.props.onEmailSelect}
                  users_details={this.props.users_details}
                  ref="searchcontacts"
                />
              </div>
                );
        }

      }
}

/*const GmailEmailList = (props) => {
    let EmailItems = '';

    console.log(showEmailList);
    if(props.gmail_email_list && props.gmail_email_list.length > 0){
      EmailItems = props.gmail_email_list.map((item) => {
       return (<EmailItem
                    item = {item}
                    key={item}
                    onEmailSelect = {props.onEmailSelect}
              />);
      });
    }

    return (
      <div>
      <div className={showEmailList} >
                  <h2 className="total-count-head">
                    <strong className="badge total-count">{props.gmail_email_list.length}</strong>
                      <span className="total-text">emails found on page</span>
                  </h2>
                <div className="list_contact_found_wraper list_contact_found_height">{EmailItems}</div>
              </div>
      <SearchContacts
        baseUrl = {props.baseUrl}
        onEmailSelect={props.onEmailSelect}
        users_details={props.users_details}
      />
    </div>
          );

};*/

export default GmailEmailList;
