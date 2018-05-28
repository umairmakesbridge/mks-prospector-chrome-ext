import React from 'react';
import Moment from 'moment';
import {encodeHTML,decodeHTML} from '../../../common/Encode_Method';


const CampaignCard = (props) => {

      let displayicon = (props.mapping.icon) ? props.mapping.icon : 'mksicon-Mail';
      let _date = Moment(decodeHTML(props.activity.logTime), 'M/D/YYYY h:m a');
      let _formatedDate = {date: _date.format("DD MMM YYYY"), time: _date.format("hh:mm A")};
      let _hide = (props.activity.pageTitle) ? "hide" : "";
      let isFuture = (props.isFuture) ? "to be "+props.mapping.name.toLowerCase() : "";
      return (
        <div className={`act_row ${props.mapping.color}`}>
          <span className={`icon ${displayicon}`}></span>
           <h5>
             <a>{( (props.activity.campaignName) ? decodeHTML(props.activity.campaignName) : (props.activity.pageTitle) ? decodeHTML(props.activity.pageTitle)  : decodeHTML(props.activity.subject) ) }</a>
           </h5>
           <div className="info-p">
                <div className={`infotxt ${_hide}`}>
                    <strong>Subject</strong>
                    <a>{decodeHTML(props.activity.subject)}</a>
                </div>
                {(props.activity.pageTitle) &&
                  <div className={`infotxt mkb_elipsis mkb_text_break`}>
                      <a style={{"color":"#5c9bb5"}} href={decodeHTML(props.activity.pageURL)} target="_blank">{decodeHTML(props.activity.pageURL)}</a>
                  </div>
                }
            </div>
            <div className="btm-bar ">
                <div className="datetime">
                      <span className="this-event-type showtooltip" style={{cursor: "pointer"}} data-original-title="Click to view this event type only">
                        {(isFuture) ? isFuture : props.mapping.name}
                      </span> at {_formatedDate.time}, {_formatedDate.date}
                </div>
                <div className="camp_type">
                        <span className={`showtooltip all-timelineFilter ${_hide}`} style={{cursor: "pointer"}} data-original-title="Click to view all Campaigns activities">
                        <i className="icon camp"></i>
                        {(props.type) ? props.type : "Campaign"}</span>
                </div>
            </div>
          </div>
      )
}

export default CampaignCard;
