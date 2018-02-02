import React from 'react';
import Moment from 'moment';
import {encodeHTML,decodeHTML} from '../../../common/Encode_Method';


const SignupCard = (props) => {
      console.log('activity : ',props.mapping);

      let displayicon = (props.mapping.icon) ? props.mapping.icon : 'mksicon-Mail';
      let _date = Moment(decodeHTML(props.activity.logTime), 'M/D/YYYY h:m a');
      let _formatedDate = {date: _date.format("DD MMM YYYY"), time: _date.format("hh:mm A")};
      let _subject = (props.activity.formName);
      let _subjecLabel = "";



      return (
        <div className={`act_row ${props.mapping.color} ${_subjecLabel}`}>
          <span className={`icon ${displayicon}`}></span>
           <h5><a>{decodeHTML(props.activity.formName)}</a></h5>
           <div className="info-p">

                  <div className="infotxt mkb_elipsis mkb_text_break" >
                      <a style={{"color":"#5c9bb5"}} href={decodeHTML(props.activity.formPreviewURL,true)} target="_blank">{decodeHTML(props.activity.formPreviewURL,true)}</a>
                  </div>
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

export default SignupCard;
