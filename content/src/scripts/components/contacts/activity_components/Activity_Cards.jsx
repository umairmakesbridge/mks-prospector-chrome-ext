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
import ScoreCard
       from './cards/Score_Card';
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
                    , "SC": {"name": "Score Changed", "action": "Score", "cssClass": "score",'color':'grren','icon':'mksicon-act_score'}
                    , "A":  {"name": "Alert", "action": "Autobot", "cssClass": "alert","color":"red",'icon' : 'mksicon-act_alert'}
                    , "W":  {"name": "Workflow Wait", "action": "Workflow", "cssClass": "wait", "color":"red", 'icon':'mksicon-act_alert'}
                    , "CS": {"name": "Sent", "action": "Campaign", "cssClass": "sent","color":"green",'icon':'mksicon-ActSent'}
                    , "OP": {"name": "Opened", "action": "Campaign", "cssClass": "open","color":"blue",'icon':'mksicon-OpenMail'}
                    , "CK": {"name": "Clicked", "action": "Campaign", "cssClass": "click","color":"blue",'icon' : 'mksicon-act_click'}
                    , "WV": {"name": "Page Viewed", "action": "Web", "cssClass": "pageview","color":"blue",'icon':'mksicon-act_pageview'}
                    , "CT": {"name": "Converted", "action": "Campaign", "cssClass": "conversion","color":"red",'icon':'mksicon-act_conversion'}
                    , "TF": {"name": "Tell a friend", "action": "Campaign", "cssClass": "tellfriend",'color':'blue','icon':'mksicon-act_tellfriend'}
                    , "UN": {"name": "Unsubscribed", "action": "Campaign", "cssClass": "unsubscribe","color":"red",'icon':'mksicon-act_unsubscribe'}
                    , "SP": {"name": "Suppressed", "action": "Campaign", "cssClass": "suppress",'color':'red' ,'icon':'mksicon-act_suppress'}
                    , "CB": {"name": "Bounced", "action": "Email", "cssClass": "bounce",'color':'red','icon':'mksicon-act_bounce'}
                    , "MT": {"name": "Sent", "action": "Email", "cssClass": "sent",'color':'blue','icon':'mksicon-ActSent'}//
                    , "MC": {"name": "Clicked", "action": "Email", "cssClass": "click","color":"blue",'icon':'mksicon-act_click'}
                    , "MO": {"name": "Opened", "action": "Email", "cssClass": "open",'color':'blue','icon':'mksicon-OpenMail'}
                    , "MS": {"name": "Surpressed", "action": "Email", "cssClass": "suppress",'color':'red','icon':'mksicon-act_suppress'}//
                    , "WA": {"name": "Alert", "action": "Workflow", "cssClass": "alert",'color':'red','icon':'mksicon-act_alert'}//
                    , "WM": {"name": "Workflow Trigger Mail", "action": "Workflow", "cssClass": "wtmail",'color':'green','icon':'mksicon-act_workflow'}//
                    , "MM": {"name": "Trigger Mail Sent", "action": "Workflow", "cssClass": "wtmail",'color':'green','icon':'mksicon-act_wtmail'}//
                    , "N": {"name": "Workflow Do Nothing", "action": "Workflow", "cssClass": "alert",'color':'blue','icon':'mksicon-act_alert'}//
                }

                console.log('activity activityBatch : ',props.activityBatch);
  if(props.nextOffset == -1){
      showLoadingButton = 'hide';
      showSignup = 'show';
  }else if(props.showLoadingMsg){
      showLoadingButton = 'hide';
  }
  const activityCard= props.activityBatch.activities.map((activity,key) => {
      if(activity.campaignType == "N"){
        return(
            <CampaignCard mapping={mapping[activity.activityType]} key={key} activity={activity} />
        );
      }else if(activity.campaignType == "T"){
          return(
            <NurturetrackCard mapping={mapping[activity.activityType]} key={key} activity={activity}  />
            );
      }else if(activity.campaignType =="W"){
          return(
            <WorkflowCard mapping={mapping[activity.activityType]} key={key} activity={activity}  />
          );
      }else if (typeof (activity['singleMessageId.encode']) !== "undefined") {
            if(activity.activityType=="MT"){
              mapping[activity.activityType]['color'] =  'green';
            }
            return(
              <CampaignCard type={"Single Message"} mapping={mapping[activity.activityType]} key={key} activity={activity} />
            );
        }

      else if(activity.botActionType == "A"){
        debugger;
          return(
            <AlertCard mapping={mapping[activity.activityType]} key={key} activity={activity} />
          );
      }else if(activity.campaignType == "B" || typeof(activity["botId.encode"])!=="undefined"){
        return(
          <AlertCard mapping={mapping[activity.activityType]} key={key} activity={activity} />
        );
      }else if(activity.activityType == "SC"){
        return(
            <ScoreCard mapping={mapping[activity.activityType]} key={key} activity={activity} />
        );
      }
      else if( activity.activityType == "MM" || activity.activityType == "A"){
        if(typeof(activity["botId.encode"]) !== "undefined"){
                            //triggerType = {name: "Autobot", cssClass: ""};
                            console.log('Need to handle');
                        }
                        else{
                          return(
                            <WorkflowCard mapping={mapping["WA"]} key={key} activity={activity}  />
                          );
                        }
      }
      else if(typeof(activity["botId.encode"])!=="undefined"){
          <AlertCard mapping={mapping[activity.activityType]} key={key} activity={activity} />
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
          Joined on {format.date}, {format.time}
      </div>
    </div>
  )
}

export default ActivityCard;
