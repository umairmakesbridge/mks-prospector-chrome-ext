import React
       from 'react';
import Moment
       from 'moment';
import {encodeHTML,decodeHTML} from '../common/Encode_Method';


const SingleContact = (props) => {
  const onEmailSelect = props.onEmailSelect;
  let acronym = '';
  let cvmessage = '';
  let message = '';
  let activityDate = '';
  if(props.type=="CK"){
    var clicks = (props.contact.length == 1) ? "Click" : "Clicks";
        cvmessage = `${clicks} in Last 24 Hours `;
        //activityDate = props.getActivityDate(props.lastActivityDate);
  }else if(props.type=="WV"){
    var clicks = (props.contact.length == 1) ? "Web Visit" : "Web Visits";
        cvmessage = `${clicks} in Last 24 Hours `;
          //activityDate = props.getActivityDate(props.lastActivityDate);
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
    return(<div className="plc_marginbottom30 mksph_cardbox"> <p className="not-found">Loading Contact...</p></div>)
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
                              <p>{contactItem.email} </p>
                              <span className="ckvwicon" dangerouslySetInnerHTML = {{__html : lastOpenActivityDate(props.serverDate,contactItem.lastActivityDate,props.type)}} />
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

const lastOpenActivityDate = (serverDate,activityDate,type) => {
      if(type=="CK" || type=="WV"){
        var icon  = (type == "CK") ? "mksicon-act_click ck" : (type == "WV") ? "mksicon-act_pageview wv" : "";
        var text  = (type == "CK") ? "Email Click" : (type == "WV") ? "Web Visit" : "";
        //(a !== -1 && b!== -1) ? "hai" : (c !== -1 && d!== -1) ? "hello" : "hurray";
        var date2 = Moment(decodeHTML(activityDate), 'YYYY-M-D H:m');
        var date1 = serverDate;
        var diffMin = date1.diff(date2, 'minutes');
        var diffHour = date1.diff(date2, 'hours');
        var diffDays = date1.diff(date2, 'days');
        var diffMonths = date1.diff(date2, 'months');
        var diffYear = date1.diff(date2, 'years');

        if (diffMin < 60)
        {
          var mins = parseInt(diffMin) <= "1" ? "min" : "mins";
          return "<span class="+icon+"></span>"+text+" - " + diffMin + " " + mins + " ago";
        }
        else if (diffHour < 24)
        {
          var hrs = parseInt(diffHour) <= "1" ? "hr" : "hrs";
          return ("<span class="+icon+"></span>"+text+" - " + diffHour + " " + hrs + " ago");
        }
        else if (diffDays < 32)
        {
          var day = parseInt(diffDays) <= "1" ? "day" : "days";
          return "<span class="+icon+"></span> "+text+" - " + diffDays + " " + day + " ago";
        }
        else if (diffMonths < 12)
        {
          var month = parseInt(diffMonths) <= "1" ? "month" : "months";
          return "<span class="+icon+"></span>"+text+" - " + diffMonths + " " + month + " ago";
        }
        else if (diffMonths >= 12)
        {
          var year = parseInt(diffMonths) <= "1" ? "year" : "years";
          return "<span class="+icon+"></span>"+text+" - " + diffYear + " " + year + " ago";
        }
        console.log('Activity Date : ' + activityDate, 'Server Date : '+ serverDate );
      }else{
        return "";
      }

}

export default SingleContact;
