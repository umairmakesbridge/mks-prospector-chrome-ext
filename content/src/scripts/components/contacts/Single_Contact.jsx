import React from 'react';

const SingleContact = (props) => {
  const onEmailSelect = props.onEmailSelect;
  let acronym = '';
  let cvmessage = '';
  let message = '';
  if(props.type=="CK"){
    var clicks = (props.contact.length == 1) ? "Click" : "Clicks";
        cvmessage = `${clicks} in Last 24 Hours `;
  }else if(props.type=="WV"){
    var clicks = (props.contact.length == 1) ? "Web Visit" : "Web Visits";
        cvmessage = `${clicks} in Last 24 Hours `;
  }
  if(props.searchtype=="searchTag"){
      var tags = (props.contact.length == 1) ? "Contact" : "Contacts";
      message = `${tags} found containing tag  '${props.searchContact}'`;
  }else if(props.searchtype=="search"){
      var tags = (props.contact.length == 1) ? "Contact" : "Contacts";
      message = `${tags} found containing text '${props.searchContact}'`;
  }

  if(props.stat=="load"){
    return(<div> Searching Contact...</div>)
  }
  else if(props.stat=="nofound"){
    return(<div> No Contact Found...</div>)
  }
  else if(props.cvstate=="load"){
    return(<div className="plc_marginbottom30"> Loading Contact...</div>)
  }
  else if(!props.contact){
    return <div className="plc_marginbottom30"></div>;
  }

  const contactSubItems = props.contact.map((contactItem) =>
                <div className="contact_found ripple" key={contactItem.email} onClick={() =>  onEmailSelect(contactItem.email)}>
                      <div className="cf_silhouette">
                          <div className="cf_silhouette_text c_txt_s">
                              <p>{contactItem.email.substring(0, 2)}</p>
                          </div>
                          <div className="cf_silhouette_img hide">
                              <img src="img/scf_silhouette.png"/>
                          </div>
                      </div>
                      <div className="cf_email_wrap">
                          <div className="cf_email">
                              <p>{contactItem.email}</p>
                          </div>
                      </div>
                      <div className="clr"></div>
                  </div>
    );
    if(props.type=="CK" || props.type=="WV"){
      return (
          <div>
            <h2 className="total-count-head"><strong className="badge total-count">{props.contact.length}</strong><span className="total-text">{cvmessage}</span></h2>
            <div className="list_contact_found_height plc_marginbottom30">{contactSubItems}</div>
          </div>
      );
    }
    if(props.searchtype=="searchTag" || props.searchtype=="search"){
      return (
          <div>
            <h2 className="total-count-head"><strong className="badge total-count">{props.contact.length}</strong><span className="total-text">{message}</span></h2>
            <div className="list_contact_found_height plc_marginbottom30">{contactSubItems}</div>
          </div>
      );
    }

}

export default SingleContact;
