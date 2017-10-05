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



const ActivityCard = (props)=>{
  let showLoadingButton = '';
  const mapping = {
                      "SU": {"name": "Signed Up", "action": "Form", "cssClass": "form"}
                    , "SC": {"name": "Score Changed", "action": "Score", "cssClass": "score"}
                    , "A":  {"name": "Alert", "action": "Autobot", "cssClass": "alert","color":"red"}
                    , "W":  {"name": "Workflow Wait", "action": "Workflow", "cssClass": "wait"}
                    , "CS": {"name": "Sent", "action": "Campaign", "cssClass": "sent","color":"green",'icon':''} // &#xe91e;
                    , "OP": {"name": "Opened", "action": "Campaign", "cssClass": "open","color":"blue",'icon':''} //&#xe907;
                    , "CK": {"name": "Clicked", "action": "Campaign", "cssClass": "click","color":"blue"}
                    , "WV": {"name": "Page Viewed", "action": "Web", "cssClass": "pageview","color":"green",'icon':''}
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
      <div className="timestop now"><span>03:17 AM, 04 Oct 2017</span> </div>
      {activityCard}
      <div className={`LoadMore-wrapper ${showLoadingButton}` }>
        <div  className="LoadMore" onClick={ ()=>props.requestTimeLine(true) }>Show more activities</div>
      </div>
    </div>
  )
}

export default ActivityCard;
