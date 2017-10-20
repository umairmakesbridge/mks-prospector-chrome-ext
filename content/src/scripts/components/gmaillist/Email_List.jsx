import React, {Component} from 'react';
import SearchContacts from '../contacts/Search_Contacts';
import EmailItem from './Email_Item';


// Refactor to Make Class Based Component
const GmailEmailList = (props) => {
    let EmailItems = '';
    const showEmailList = (props.gmail_email_list.length > 0) ? 's_contact_found_wraper plc_marginbottom10' : 's_contact_found_wraper hide';
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

};

export default GmailEmailList;
