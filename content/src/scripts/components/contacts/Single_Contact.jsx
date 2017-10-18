import React from 'react';

const SingleContact = (props) => {
  const onEmailSelect = props.onEmailSelect;
  let acronym = '';
  if(props.stat=="load"){
    return(<div> Searching Contact...</div>)
  }
  else if(props.stat=="nofound"){
    return(<div> No Contact Found...</div>)
  }
  else if(!props.contact){
    return <div></div>;
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

    return (
        <div>
          <h2 className="total-count-head"><strong className="badge total-count">{props.contact.length}</strong><span className="total-text">{props.type}</span></h2>
          {contactSubItems}
        </div>
    );
}

export default SingleContact;
