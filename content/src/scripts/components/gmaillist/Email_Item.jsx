import React from 'react';

const EmailItem = (props) =>{
  const onEmailSelect = props.onEmailSelect;
  let acronym = '';
  var pattern =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(props.item)
      acronym =props.item.charAt(0);


  return (
    <div className="contact_found ripple" onClick={() =>  onEmailSelect(props.item)}>
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
                                <p>{props.item}</p>
                            </div>
                        </div>
                        <div className="clr"></div>
                    </div>

  );
}

export default EmailItem
