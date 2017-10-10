// Implementation card inloop with static data
// Add all the relevant data in to each card {12hr}
import React from 'react';
import CampaignCard
       from './cards/Campaign_Card';
import NurturetrackCard
       from './cards/Nurtretrack_Card';
import WorkflowCard
       from './cards/Workflow_Card';
import AlertCard
       from './cards/Alert_Card';
import Moment
       from 'moment';
import {encodeHTML,decodeHTML} from '../../common/Encode_Method';

const ActivityCard = (props)=>{
  let showLoadingButton = '';
  let showSignup        = 'hide';
  let signupDate =  props.contact.creationDate;
  var _date = Moment(decodeHTML(signupDate),'YYYY-M-D H:m');
  console.log(_date);
  var format = {date: _date.format("DD MMM YYYY"), time: _date.format("hh:mm A")};
  const mapping = {
                      "SU": {"name": "Signed Up", "action": "Form", "cssClass": "form"}
                    , "SC": {"name": "Score Changed", "action": "Score", "cssClass": "score"}
                    , "A":  {"name": "Alert", "action": "Autobot", "cssClass": "alert","color":"red",'icon' : 'mksicon-act_alert'}
                    , "W":  {"name": "Workflow Wait", "action": "Workflow", "cssClass": "wait"}
                    , "CS": {"name": "Sent", "action": "Campaign", "cssClass": "sent","color":"green",'icon':'mksicon-ActSent'}
                    , "OP": {"name": "Opened", "action": "Campaign", "cssClass": "open","color":"blue",'icon':'mksicon-OpenMail'}
                    , "CK": {"name": "Clicked", "action": "Campaign", "cssClass": "click","color":"blue",'icon' : 'mksicon-act_click'}
                    , "WV": {"name": "Page Viewed", "action": "Web", "cssClass": "pageview","color":"blue",'icon':'mksicon-act_pageview'}
                    , "CT": {"name": "Converted", "action": "Campaign", "cssClass": "conversion"}
                    , "TF": {"name": "Tell a friend", "action": "Campaign", "cssClass": "tellfriend"}
                    , "UN": {"name": "Unsubscribed", "action": "Campaign", "cssClass": "unsubscribe","color":"red"}
                    , "SP": {"name": "Suppressed", "action": "Campaign", "cssClass": "suppress"}
                    , "CB": {"name": "Bounced", "action": "Email", "cssClass": "bounce"}
                    , "MT": {"name": "Sent", "action": "Email", "cssClass": "sent"}
                    , "MC": {"name": "Clicked", "action": "Email", "cssClass": "click","color":"blue"}
                    , "MO": {"name": "Opened", "action": "Email", "cssClass": "open"}
                    , "MS": {"name": "Surpressed", "action": "Email", "cssClass": "suppress"}
                    , "WA": {"name": "Alert", "action": "Workflow", "cssClass": "alert"}
                    , "WM": {"name": "Workflow Trigger Mail", "action": "Workflow", "cssClass": "wtmail"}
                    , "MM": {"name": "Trigger Mail Sent", "action": "Workflow", "cssClass": "wtmail"}
                    , "N": {"name": "Workflow Do Nothing", "action": "Workflow", "cssClass": "alert"}
                }

                console.log('activity activityBatch : ',props.activityBatch);
  if(props.nextOffset == -1){
      showLoadingButton = 'hide';
      showSignup = 'show';
  }else if(props.showLoadingMsg){
      showLoadingButton = 'hide';
  }
  const activityCard= props.activityBatch.activities.map((activity) => {
      if(activity.campaignType == "N"){
        return(
            <CampaignCard mapping={mapping[activity.activityType]} activity={activity} />
        );
      }else if(activity.campaignType == "T"){
          return(
            <NurturetrackCard mapping={mapping[activity.activityType]} activity={activity}  />
            );
      }else if(activity.campaignType =="W"){
          return(
            <WorkflowCard mapping={mapping[activity.activityType]} activity={activity}  />
          );
      }else if(activity.botActionType == "A"){
          return(
            <AlertCard mapping={mapping[activity.activityType]} activity={activity} />
          );
      }

  });
  return (
    <div className="act_row_wrapper">
      <div className="timestop now"><span>{props.serverDate.date} ,{props.serverDate.time}  </span> </div>
      {activityCard}

      <div className={`LoadMore-wrapper loading_${props.showLoadingMsg}`}>

            <div  className={`LoadMore loading_${props.showLoadingMsg}`} >Loading more...</div>
      </div>
      <div className={`LoadMore-wrapper ${showLoadingButton}` }>
        <div  className="LoadMore" onClick={ ()=>props.requestTimeLine(true) }> <span className="mksicon-Add"></span> Show more activities</div>

      </div>

      <div className={`act_row magenda show_signup ${showSignup}`}>
          <span className="icon mksicon-startflag"></span>
          {format.date}, {format.time}
      </div>
    </div>
  )
}

export default ActivityCard;
