import React from 'react';
import Moment from 'moment';
import {encodeHTML,decodeHTML} from '../../../common/Encode_Method';


const ScoreCard = (props) => {
      console.log('activity : ',props.mapping);

      let displayicon = (props.mapping.icon) ? props.mapping.icon : 'mksicon-Mail';
      let _date = Moment(decodeHTML(props.activity.logTime), 'M/D/YYYY h:m a');
      let _formatedDate = {date: _date.format("DD MMM YYYY"), time: _date.format("hh:mm A")};
      let _subject = (props.activity.pageType);
      let _subjecLabel = (parseInt(props.activity.score)==0 ) ? "hide"  : "";
      debugger;
      let _score = (parseInt(props.activity.score) > 0) ? "+"+props.activity.score : (parseInt(props.activity.score) == 0) ? props.activity.score : "-"+props.activity.score;
      if(parseInt(props.activity.score) < 0){
        props.mapping['color'] = 'red';
      }


      return (
        <div className={`act_row ${props.mapping.color} ${_subjecLabel}`}>
          <span className={`icon ${displayicon}`}></span>
           <h5><a>{_score}</a></h5>
           <div className="info-p">
                {(!props.activity.botActionType) &&
                  <div>
                  <div className="infotxt">
                      <strong className={_subjecLabel}>Page Type</strong>
                      <a>{decodeHTML(_subject,true)}</a>
                  </div>
                  <div className="infotxt">
                      <strong className={_subjecLabel}>Page URL</strong>
                      <a>{decodeHTML(props.activity.pageURL,true)}</a>
                  </div>
                  </div>
                }
                {(props.activity.botActionType) &&
                  <div className="infotxt">
                      <strong className={_subjecLabel}>Bot Name</strong>
                      <a>{decodeHTML(props.activity.botLabel,true)}</a>
                  </div>

                }
            </div>
            <div className="btm-bar ">
                <div className="datetime">
                      <span className="this-event-type showtooltip" style={{cursor: "pointer"}} data-original-title="Click to view this event type only">
                        {props.mapping.name}
                      </span> at {_formatedDate.time}, {_formatedDate.date}
                </div>

            </div>
          </div>
      )
}

export default ScoreCard;
