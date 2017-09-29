import React from 'react';

const EmailItem = (props) =>{
  const onEmailSelect = props.onEmailSelect;
  let acronym = '';
  if(props.item[0]){
    let str     = props.item[0];
    let matches = str.match(/\b(\w)/g);
    acronym = matches.join('');
  }else{
    acronym =props.item[1].charAt(0);
  }

  return (
    <div className="contact_found ripple" onClick={() =>  onEmailSelect(props.item[1])}>
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
                                <p>{props.item[1]}</p>
                            </div>
                        </div>
                        <div className="clr"></div>
                    </div>

  );
}

export default EmailItem
