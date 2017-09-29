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

  if(props.contact && props.contact.firstName && props.contact.lastName){
      let str     = props.contact.firstName + props.contact.lastName;
      let matches = str.match(/\b(\w)/g);
      acronym = matches.join('');
    }else{
      acronym =props.contact['email'].charAt(0);
    }
    return (
      <div className="contact_found ripple" onClick={() =>  onEmailSelect(props.contact.email)}>
                          <div className="cf_silhouette">
                              <div className="cf_silhouette_text c_txt_s">
                                  <p>{acronym}</p>
                              </div>
                              <div className="cf_silhouette_img hide">
                                  <img src="img/scf_silhouette.png"/>
                              </div>
                          </div>
                          <div className="cf_email_wrap">
                              <div className="cf_email">
                                  <p>{props.contact.email}</p>
                              </div>
                          </div>
                          <div className="clr"></div>
                      </div>
    );
}

export default SingleContact;
