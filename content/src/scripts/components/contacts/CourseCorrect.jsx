import React, {Component}
       from 'react';
import request
       from 'superagent';
import {ErrorAlert,SuccessAlert}
       from '../common/Alerts';
import {encodeHTML,decodeHTML}
       from '../common/Encode_Method';
import Moment
       from 'moment';
import LoadingMask
       from '../common/Loading_Mask';
import ReactTooltip
       from 'react-tooltip';

class CourseCorrect extends Component{
      constructor(props){
        super(props);
        this.baseUrl = this.props.baseUrl;
        const basicFields = {
          "{{EMAIL_ADDR}}" : "Email",
          "{{FIRSTNAME}}"  : "First Name",
          "{{LASTNAME}}"   : "Last Name",
          "{{ADDRESS}}"    : "Address Line 1",
          "{{ADDRESS2}}"   : "Address Line 2",
          "{{CITY}}"       : "City",
          "{{STATE}}"      : "State",
          "{{ZIP}}"        : "Zip",
          "{{COUNTRY}}"    : "Country",
          "{{PHONE}}"      : "Telephone",
          "{{BIRTH_DATE}}" : "Birth Date",
          "{{OCCUPATION}}" : "Occupation",
          "{{INDUSTRY}}"   : "Industry",
          "{{COMPANY}}"    : "Company",
          "{{SOURCE}}"     : "Source",
          "{{SALESREP}}"   : "Sales Rep",
          "{{SALESSTATUS}}": "Sales Status",
          "{{SUBSCRIPTION_DATE}}"   : "Subscribe Date"
        }
        this.state = {
          workflows : null,
          nurtureTracks : null,
          showStepsFlag : '',
          collapseMsg : 'Click to expand',
          collapseExpand : 'expand',
          showLoading  : false,
          showHideSkip : 'show',
          basicMapFields : basicFields
        }

        // preserve the initial state in a new object
        this.baseState = this.state;
      }
      setStateDefault(){
          this.setState(this.baseState);
      }

      getCourseCorrect(){
        //https://test.bridgemailsystem.com/pms/io/workflow/getWorkflowData/?BMS_REQ_TK=aGPBLIJRLeLiDGxvIqUOz7Fztd79bv&type=getCourseCorrect&subNum=qcWWk30Vg33Kc26Fg17Ki20Gd21Ui30Uf33qDF&isMobileLogin=Y&userId=umair
        var Url = this.baseUrl
                        +'/io/workflow/getWorkflowData/?BMS_REQ_TK='
                        + this.props.users_details[0].bmsToken +'&type=getCourseCorrect&isMobileLogin=Y&subNum='+this.props.contact.subNum+'&userId='+this.props.users_details[0].userId
        var workflowObj = null;
        var nurtureTrackObj = [];

        request
              .get(Url)
               .set('Content-Type', 'application/x-www-form-urlencoded')
               .then((res) => {
                  if(res.status==200){
                    let jsonResponse =  JSON.parse(res.text);
                    this.setState({showLoading:false,message:""})
                    if (jsonResponse[0] == "err"){
                        if(jsonResponse[1] == "SESSION_EXPIRED"){
                          ErrorAlert({message:jsonResponse[1]});
                          jQuery('.mksph_logout').trigger('click');
                        }
                      return false;
                    }
                    if(Object.keys(jsonResponse).length === 0){
                      ErrorAlert({message : 'No Course Correct Found'});
                      return false;
                    }
                    console.log(jsonResponse);
                    if(Object.keys(jsonResponse.Workflows[0]).length !=0){
                        /*$.each(jsonResponse.Workflows[0],function(key,val){
                            workflowObj.push(val[0]);
                        });*/
                      workflowObj = this.generateSingleObjectWF(jsonResponse.Workflows[0]);
                    }else{
                      workflowObj = "empty";
                    }

                    if(Object.keys(jsonResponse.NutureTracks[0]).length !=0){
                        $.each(jsonResponse.NutureTracks[0],function(key,val){
                            let messagesArray = [];
                            $.each(val[0].messages,function(key,value){
                              for(var i=0;i < Object.keys(value).length; i++){
                                messagesArray.push(value["message"+(i+1)][0]);
                              }
                            });

                            val[0]['messages'] = messagesArray;
                            nurtureTrackObj.push(val[0]);

                        });
                    }else{
                      nurtureTrackObj = "empty";
                    }
                    console.log('NT Obj : ', nurtureTrackObj);

                    this.setState({
                      workflows : workflowObj,
                      nurtureTracks : nurtureTrackObj
                    });
                  }
                });
      }
      generateWorkflows(){
        if(!this.state.workflows || this.state.workflows == "empty"){
          return;
        }
        const ListItems = this.state.workflows.map((list,key) =>
              <li key={key} className="mngList_li_wrap">
                  <div className={`${this.state.showStepsFlag} mks_mnglist_wrap mks_cc_wf_wrap `}>
                    <span className="mksicon-act_workflow icon-cc"></span>
                    <h4 className="mks_cc_wf_wrap_top_title" onClick={this.triggerToggleOnh4.bind(this)} title={decodeHTML(list.name)} >{decodeHTML(list.name)}</h4>

                        <div className={`${this.state.collapseExpand} collapseable`} onClick={this.showToggle.bind(this)}>
                          <span className="collapseMsg">Click to expand</span>
                          <span className="mksicon-ArrowNext"></span>
                        </div>

                    <div className="mks_cc_steps_wrapper">
                          <div className={`scf_o_right cc_action_icons_wrap ${(list.workflowStatus=="Completed" && list.isSubscriberManuallyAdded=="N") ? "hide" : ""}`}>
                            <ul className="top_manager_ul_wraps five">
                              <li data-tip={`Subscriber was manually added to this Workflow Step 1 (override all steps) on ${list.subscriberManuallyAddedTime} Pacific`} className={`${(list.isSubscriberManuallyAdded=="N" ) ? "hide" : "" }  ${(list.workflowStatus=="Completed" && list.isSubscriberManuallyAdded=="N") ? "" : "mks_hideRightBorder"}`}>
                                <ReactTooltip />
                                <div className={`scf_option_icon ripple top_manage_lists`}>
                                      <a href="#" style={{textDecoration: 'unset'}} >
                                        <div className="wrap_scf_o_i">
                                          <div className="wrap_scf_o_i_md">
                                            <div className="scf_o_icon scf_o_edit mksicon-Silhouette mks_manageList_wrap"></div>
                                            </div>
                                        </div>
                                      </a>
                                    </div>
                                </li>
                              <li data-tip="Click to play" >
                                <ReactTooltip />
                                <div className={`scf_option_icon ripple top_manage_lists  ${(list.workflowStatus=="Completed") ? "hide" : ""}  ${(list.workflowStatus) ? "" : "cc_disabled"}`} onClick={this.playPauseWorkFlows.bind(this,list['workflow.encode'],'play')}>
                                        <a href="#" style={{textDecoration: 'unset'}}>
                                          <div className="wrap_scf_o_i">
                                            <div className="wrap_scf_o_i_md">
                                              <div className="scf_o_icon scf_o_edit  mksicon-Play mks_manageList_wrap"></div>
                                              </div>
                                          </div>
                                        </a>
                                      </div>
                                    </li>
                              <li data-tip="Click to pause" className="mks_hideRightBorder">
                                <ReactTooltip />
                                        <div className={`scf_option_icon ripple top_manage_lists ${(list.workflowStatus=="Completed") ? "hide" : ""} ${(list.workflowStatus=="paused") ? "cc_disabled" : ""}`} onClick={this.playPauseWorkFlows.bind(this,list['workflow.encode'],'pause')}>
                                              <a href="#" style={{textDecoration: 'unset'}}>
                                                <div className="wrap_scf_o_i">
                                                  <div className="wrap_scf_o_i_md">
                                                    <div className="scf_o_icon scf_o_edit mksicon-Pause mks_manageList_wrap"></div>
                                                    </div>
                                                </div>
                                              </a>
                                            </div>
                                        </li>



                            <li data-tip="Add to list" style={{visibility: "hidden"}}>
                                    <div className="scf_option_icon ripple top_manage_lists">
                                            <a href="#" style={{textDecoration: 'unset'}}>
                                              <div className="wrap_scf_o_i">
                                                <div className="wrap_scf_o_i_md">
                                                  <div className="scf_o_icon scf_o_edit mksicon-Pause mks_manageList_wrap"></div>
                                                  </div>
                                              </div>
                                            </a>
                                          </div>
                                      </li>

                          </ul>
                      </div>
                      {this.generateSteps(list.steps,list['workflow.encode'])}
                    </div>
                  </div>
              </li>
        );
        return ListItems;
      }
      generateNurturetracks(){
        if(!this.state.nurtureTracks || this.state.nurtureTracks == "empty" ){
          return;
        }
        const ListItems = this.state.nurtureTracks.map((list,key) =>
              <li key={key} className="mngList_li_wrap ">
                  <div className="mks_mnglist_wrap mks_cc_wf_wrap">
                    <span className="mksicon-Nurture_Track icon-cc"></span>
                    <h4 className="cc_title_h4" title={decodeHTML(list.name)} onClick={this.triggerToggleOnh4.bind(this)} >{decodeHTML(list.name)}</h4>
                      <div className={`${this.state.collapseExpand} collapseable`} onClick={this.showToggle.bind(this)}>
                        <span className="collapseMsg">Click to expand</span>
                        <span className="mksicon-ArrowNext"></span>
                      </div>
                      <div className="mks_cc_steps_wrapper">
                          {this.generateNTMessages(list.messages,list)}
                      </div>
                  </div>
              </li>
        );
        return ListItems;
      }
      generateNTMessages(messages,ntObj){

        let items = messages.map((item, i) => {
            return (
              <div key={i} className="cc_steps_break_wraps">
                <div  className='autocomplete__item cc_steps_break autocomplete__item--disabled'>
                  <span className="cc_steps_break_title"> {item.label+" "+ (i+1)} :</span>
                  <span className={`${(item.emailSent == "Y" && item.emailSkipped!="Y") ? "show" : "hide"} cc_steps_break_time`}>
                    <span style={{"color" : "#fff"}}>Email Sent </span> :{  this.parseDateToMoment(item.emailSentTime)  } Pacific
                  </span>
                  <span className={`${(item.emailDue == "Y") ? "show" : "hide"} cc_steps_break_time`}>
                    <span style={{"color" : "#fff"}}>Email Due </span> :{  this.parseDateToMoment(item.emailDueTime)  } Pacific
                  </span>
                  <span className={`${(item.emailSkipped == "Y") ? "show" : "hide"} cc_steps_break_time`}>
                    <span style={{"color" : "#fff"}}>Email Skipped </span> :{  this.parseDateToMoment(item.emailSkippedTime)  } Pacific
                  </span>

              </div>
                <div className={`scf_o_right cc_action_icons_wrap ${(ntObj.ntStatus != "Completed") ? "show" : "hide"}`}>
                  <ul className="top_manager_ul_wraps five">

                    <li data-tip="Click to play" >
                      <ReactTooltip />
                      <div className={`scf_option_icon ripple top_manage_lists  ${(ntObj.ntStatus=="Completed") ? "hide" : ""}  ${(ntObj.ntStatus == "play") ? "cc_disabled" : ""}`} onClick={this.playPauseNurtureTrack.bind(this,ntObj['trackId.encode'],'play')}>
                              <a href="#" style={{textDecoration: 'unset'}}>
                                <div className="wrap_scf_o_i">
                                  <div className="wrap_scf_o_i_md">
                                    <div className="scf_o_icon scf_o_edit  mksicon-Play mks_manageList_wrap"></div>
                                    </div>
                                </div>
                              </a>
                            </div>
                          </li>
                    <li data-tip="Click to pause" className="mks_hideRightBorder">
                      <ReactTooltip />
                              <div className={`scf_option_icon ripple top_manage_lists ${(ntObj.ntStatus=="Completed") ? "hide" : ""} ${(ntObj.ntStatus =="paused") ? "cc_disabled" : ""}`} onClick={this.playPauseNurtureTrack.bind(this,ntObj['trackId.encode'],'pause')}>
                                    <a href="#" style={{textDecoration: 'unset'}}>
                                      <div className="wrap_scf_o_i">
                                        <div className="wrap_scf_o_i_md">
                                          <div className="scf_o_icon scf_o_edit mksicon-Pause mks_manageList_wrap"></div>
                                          </div>
                                      </div>
                                    </a>
                                  </div>
                              </li>



                  <li data-tip="Add to list" style={{visibility: "hidden"}}>
                          <div className="scf_option_icon ripple top_manage_lists">
                                  <a href="#" style={{textDecoration: 'unset'}}>
                                    <div className="wrap_scf_o_i">
                                      <div className="wrap_scf_o_i_md">
                                        <div className="scf_o_icon scf_o_edit mksicon-Pause mks_manageList_wrap"></div>
                                        </div>
                                    </div>
                                  </a>
                                </div>
                            </li>

                </ul>
              </div>
                <div className="mks_cc_action_wraper">
                  <div  className='autocomplete__item cc_steps_break autocomplete__item--disabled'>
                    <span className="cc_steps_break_title cc_steps_actions_title">
                      Perform the following action(s):
                      <span className={`${(ntObj.ntStatus=="Completed") ? "hide" : ""} `}>
                      <span style={{"position": "relative","cursor":"pointer","left": "90px","top": "3px"}}  data-tip="Click to unskip step" onClick={this.skippNT.bind(this,{ntid:ntObj['trackId.encode'],msgid:item['messageId.encode']},'unskip')} className={`${this.state.showHideSkip}  ${(item.emailSkipped=="Y") ? '' : "cc_disabled"} scf_o_icon scf_o_edit mksicon-CPlay mks_manageList_wrap`}></span>
                      <span style={{"position": "relative","cursor":"pointer","left": "40px","top": "3px"}}  data-tip="Click to skip step" onClick={this.skippNT.bind(this,{ntid:ntObj['trackId.encode'],msgid:item['messageId.encode']},'skip')}   className={`${this.state.showHideSkip}   ${(item.emailSkipped=="N") ? '' : "cc_disabled"} scf_o_icon scf_o_edit  mksicon-CPlayNext mks_manageList_wrap`}></span>
                      <ReactTooltip />
                      </span>
                    </span>
                  </div>
                  <div className='single_action_wrap'>

                    <div className="cc_act_extra_details">
                      <span className="act_subj_title"><i className="mksicon-Mail"></i> Subject: </span>
                      <span className="act_subj_title_value">{decodeHTML(item.subject)}</span>
                      <br/>
                        {item['dispatchType'] == "D"  &&
                          <span><span className="act_sent_time" style={{"marginLeft": "0px"}}>Dispatch Rule: </span>
                          <span className="act_sent_time_value">delay dispatch for {item.dayLapse} day(s)</span>  <br/></span>

                        }
                        {item['dispatchType'] == "S"  &&
                          <span>
                            <span className="act_sent_time" style={{"marginLeft": "0px"}}>Dispatch Rule: </span>
                          <span className="act_sent_time_value">scheduled for { this.parseDateToMoment(item.scheduleDate)} Pacific</span>
                          <br/>
                      </span>

                        }

                      <span className="act_sent_time">Time of Day: </span>
                      <span className="act_sent_time_value">{(item.timeOfDay == -1) ? 'Instant' : item.timeOfDay+item.timeOfDayHrs+":"+item.timeOfDayMins+item.timeOfDayMins}</span>
                      <ul className={`${(item.emailDue == "Y") ? "hide" : "show"}`} >
                        <li><span>Open(s): </span>{item.opens} <span style={{"position" : "relative","fontWeight": "100","width": "146px","float": "right","top":"2px","fontSize": "9px"}}>(last opened on {this.parseDateToMoment(item.lastOpenOn)})</span></li>
                        <li><span>Click(s): </span>{item.clicks}</li>
                        <li><span>Page View(s): </span>{item.pageViews}</li>
                      </ul>
                    </div>
                  </div>
                </div>
            </div>
          );
        });
        return items;
      }
      generateSteps(steps,wfId){
          //console.log('My Steps : ', steps);
          let items = steps.map((item, i) => {

            if(item.skipped == "true"){
              return (
                <div key={i} className="cc_steps_break_wraps">
                  <div  className='autocomplete__item cc_steps_break autocomplete__item--disabled'>
                    <span className="cc_steps_break_title">Step {(i+1)}:</span>
                    <span className="cc_steps_break_time"><span style={{"color" : "#e0e0e0"}}>Skipped</span> : {this.parseDateToMoment(item.stepSkipped)} Pacific</span>
                  </div>
                  <div className="cc_steps_options_wrap">{this.generateOptions(item.options,{workflowId : wfId,skipped: item.skipped,skippedId:item.stepId,stepSkipped:item.stepSkipped},'skipped')}</div>
              </div>
              )
            } else if(item.stepCompleted && item.label != "DO NOTHING") {
              return (
                <div key={i} className="cc_steps_break_wraps">
                  <div  className='autocomplete__item cc_steps_break autocomplete__item--disabled'>
                    <span className="cc_steps_break_title">Step {(i+1)}:</span>
                    <span className="cc_steps_break_time"><span style={{"color" : "#fff"}}>Completed </span> : {this.parseDateToMoment(item.stepCompleted)} Pacific</span>
                  </div>
                  <div className="cc_steps_options_wrap">{this.generateOptions(item.options)}</div>
              </div>
              )
            }else if(item.nextAction){
              return (
                  <div key={i} className="cc_steps_break_wraps">
                    <div className='autocomplete__item cc_steps_break autocomplete__item--disabled'>
                      <span className="cc_steps_break_title">Step {(i+1)}:</span>
                      <span className="cc_steps_break_time"><span style={{"color" : "#13a9ff"}}>Next Action</span> : {this.parseDateToMoment(item.nextAction)} Pacific</span>
                    </div>
                      <div className="cc_steps_options_wrap">{this.generateOptions(item.options,{workflowId : wfId,skipped: item.skipped,skippedId:item.stepId,stepSkipped:item.nextAction},'nextAction')}</div>
                  </div>
              )
            }else if(item.label == "DO NOTHING"){
              return (
                <div key={i} className="cc_steps_break_wraps">
                  <div  className='autocomplete__item cc_steps_break autocomplete__item--disabled'>
                      <span className="cc_steps_break_title">Step {(i+1)}:</span>

                    <span className="cc_steps_break_time"><span style={{"color" : "#fff"}}>Completed </span> : {this.parseDateToMoment(item.stepCompleted)} Pacific</span>
                  </div>

                  <div className="cc_steps_options_wrap">{this.generateOptions(item.options,'doNothing')}</div>
              </div>
              )
            }else{
              return(
                <div>Rest steps needs to be taken care of</div>
              )
            }
          })
          return items;
      }
      generateOptions(options,skippedObj,actType){
          // let optionArr = [];
          let optionLabel = "";
          let ListItems = "";
          if(actType=='nextAction' || actType=='skipped'){
            ListItems = options.map((list,key) =>{
                      if(key > 0){
                        return;
                      }
                      return(
                        <div key={key} className="cc_step_options_wrap">
                              <span className="cc_basic_opt_wrap_label">{list.optionLabel ? list.optionLabel : 'Option '+list.optionNumber}
                                {this.checkStateStep(skippedObj.stepSkipped)}
                                <span data-tip="Click to unskip step" onClick={this.skippWF.bind(this,skippedObj,'unskip')} className={`${this.state.showHideSkip} ${(skippedObj.skipped=="false") ? 'cc_disabled' : ""} scf_o_icon scf_o_edit mksicon-CPlay mks_manageList_wrap`}></span>
                                <span data-tip="Click to skip step" onClick={this.skippWF.bind(this,skippedObj,'skip')}   className={`${this.state.showHideSkip} ${(skippedObj.skipped=="true") ? 'cc_disabled' : ""} scf_o_icon scf_o_edit  mksicon-CPlayNext mks_manageList_wrap`}></span>
                                <ReactTooltip />
                            </span>
                              <div className="cc_option_basic_rule_wrap">{this.generateBasicRules(list.basicRules)}</div>
                              <div className="cc_option_action_rule_wrap cc_option_adv_rule_wrap">{this.generateAdvanceRules(list.advanceRules,list.advanceRuleDetail[0])}</div>
                              <div className="cc_option_action_rule_wrap">{this.generateActionRules(list.actions)}</div>

                        </div>
                      )
            });
          } else if(skippedObj=='doNothing'){
            ListItems = options.map((list,key) =>{
                      if(key > 0){
                        return;
                      }
                      return(
            <div key={key} className="cc_step_options_wrap">
                  <span className="cc_basic_opt_wrap_label">{list.optionLabel ? list.optionLabel : 'Option '+list.optionNumber}
                    {this.checkStateStep(skippedObj.stepSkipped)}
                    <span data-tip="Click to unskip step" onClick={this.skippWF.bind(this,skippedObj,'unskip')} className={`${this.state.showHideSkip} ${(skippedObj.skipped=="false") ? 'cc_disabled' : ""} scf_o_icon scf_o_edit mksicon-CPlay mks_manageList_wrap`}></span>
                    <span data-tip="Click to skip step" onClick={this.skippWF.bind(this,skippedObj,'skip')}   className={`${this.state.showHideSkip} ${(skippedObj.skipped=="true") ? 'cc_disabled' : ""} scf_o_icon scf_o_edit  mksicon-CPlayNext mks_manageList_wrap`}></span>
                    <ReactTooltip />
                </span>
                  <div className="cc_option_basic_rule_wrap">{this.generateBasicRules(list.basicRules)}</div>

                    <div className="mks_cc_action_wraper">
                      <div  className={`autocomplete__item cc_steps_break autocomplete__item--disabled ${(key > 0) ? 'hide':''}`}>
                        <span className={`cc_steps_break_title cc_steps_actions_title  `}>Perform the following action(s):</span>
                      </div>
                      <div className='single_action_wrap'>

                        <div className="cc_act_extra_details">
                          <div className="cc_option_action_rule_wrap" style={{"padding": "0"}}>
                            <div className="single_action_wrap" style={{"background": "rgb(255, 255, 255)", "padding": "15px","fontSize": "14px","textTransform": "capitalize"}}>
                            <h4 style={{"background": "transparent", "width": "100%","position": "relative","top": "-5px"}}>
                              <i className="mksicon-Prohibition" style={{"marginRight": "4px","color" : "red"}}></i>Do Nothing
                            </h4>

                          </div>
                        </div>
                        </div>
                      </div>
                    </div>
            </div>
              );
            });
          }
          else{
            ListItems = options.map((list,key) =>{
                      if(key > 0){
                        return;
                      }
                      return(
                        <div key={key} className="cc_step_options_wrap">
                              <span className="cc_basic_opt_wrap_label">{list.optionLabel ? list.optionLabel : 'Option '+list.optionNumber}
                              </span>
                              <div className="cc_option_basic_rule_wrap">{this.generateBasicRules(list.basicRules,list.applyRuleCount)}</div>
                              <div className="cc_option_action_rule_wrap">{this.generateAdvanceRules(list.advanceRules,list.advanceRuleDetail[0])}</div>
                              <div className="cc_option_action_rule_wrap">{this.generateActionRules(list.actions)}</div>

                        </div>

                      )
            });
          }

          return ListItems;
      }
      generateBasicRules(basicRuleObj,ruleCount){
          //$.each()
          if(basicRuleObj.length > 0){
            let orAll = (ruleCount == "A") ? "All" : "One";
            const ListItems = basicRuleObj.map((list,key) =>
                      <div key={key} className="cc_basic_rule_wrap">
                          <h4 className={`cc_basic_rule_title ${(key > 0) ? 'hide':''}`}>{orAll} of the condition(s) below were met</h4>
                          <span className="cc_basic_rule_head">Field:</span>
                          <span className="cc_basic_rule_value">{this.grabBasicCustomField(list.field)}</span>
                          <br/>
                          <span className="cc_basic_rule_head">Match Type:</span>
                          <span className="cc_basic_rule_value">{(list.rule == "ct") ? "contains" : (list.rule == "!ct") ? "does not contain" : "equals to" }</span>

                          <br/>
                          <span className="cc_basic_rule_head">Format:</span>
                          <span className="cc_basic_rule_value">{(list.format) ? list.format : "--" }</span>
                          <br/>
                          <span className="cc_basic_rule_head">Match Value(s):</span>
                          <span className="cc_basic_rule_value">{list.matchValue}</span>
                          <br/><br/>
                      </div>
            );
            return ListItems;
          }else{
            return "";
          }

      }

      generateActionRules(actions){
                  let items = actions.map((item, i) => {
                    if(item.type == "email"){
                      return (
                      <div key={i} className="mks_cc_action_wraper">
                        <div  className={`autocomplete__item cc_steps_break autocomplete__item--disabled ${(i > 0) ? 'hide':''}`}>
                          <span className={`cc_steps_break_title cc_steps_actions_title `}>Perform the following action(s):</span>
                        </div>
                        <div className='single_action_wrap'>

                          <div className="cc_act_extra_details">
                            <h4 style={{"background": "transparent","width": "100%"}}>
                              <i className="mksicon-Mail" style={{"marginRight" : "4px"}}></i>Email
                            </h4>
                            <span className="act_subj_title"><i className="mksicon-Mail"></i> Subject: </span>
                            <span className="act_subj_title_value">{item.subject}</span>
                            <br/>
                            <span className={(item.Sent) ? 'act_sent_time' : 'act_sent_time hide'}>Sent: </span>
                            <span className={(item.Sent) ? 'act_sent_time_value' : 'act_sent_time_value hide'}>{this.parseDateToMoment(item.Sent)}</span>

                            <span className={(item['Send Email']) ? 'act_sent_time' : 'act_sent_time hide'}>Due Date: </span>
                            <span className={(item['Send Email']) ? 'act_sent_time_value' : 'act_sent_time_value hide'}>{this.parseDateToMoment(item['Send Email'])} Pacific</span>

                            <span className={`act_sent_time ${(item.Skipped) ? "show" : "hide"}`}>Skipped at</span>
                            <span className={`act_sent_time_value ${(item.Skipped) ? "show" : "hide"}`}>{this.parseDateToMoment(item.Skipped)} Pacific}</span>

                            <ul className={`${(parseInt(item.opens) > 0 || parseInt(item.opens) > 0 || parseInt(item.pageViews) > 0 ) ? "show" : "hide" }` } >
                              <li><span>Open(s): </span>{item.opens} <span style={{"fontWeight": "100","width": "115px","fontSize": "9px","display":"none"}}>(last opened on {this.parseDateToMoment(item.lastOpenOn)} )</span></li>
                              <li><span>Click(s): </span>{item.clicks}</li>
                              <li><span>Page View(s): </span>{item.pageViews}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      )
                    } else if(item.type=="alert") {
                      return (
                        <div key={i} className='single_action_wrap' style={{"background": "#fff","padding": "10px 15px"}}>
                          <div  className={`autocomplete__item cc_steps_break autocomplete__item--disabled ${(i > 0) ? 'hide':''}`}>
                            <span className={`cc_steps_break_title cc_steps_actions_title`}>Perform the following action(s):</span>
                          </div>
                          <h4 style={{"background": "transparent","width": "100%"}}>
                            <i className="mksicon-act_alert" style={{"marginRight" : "4px"}}></i>View Sales Rep Alert
                          </h4>
                          <span className="act_sent_time" style={{"marginLeft": "0px"}}>Send Alert : </span>
                          <span className="act_sent_time_value">{(item['Send Alert']) ? this.parseDateToMoment(item['Send Alert']) : this.parseDateToMoment(item['Sent'])} Pacific</span>
                        </div>
                      )
                    }else if(item.type=="score"){
                      return (
                        <div key={i} className='single_action_wrap' style={{"background": "#fff","padding": "10px 15px"}}>
                          <div  className={`autocomplete__item cc_steps_break autocomplete__item--disabled ${(i > 0) ? 'hide':''}`}>
                            <span className={`cc_steps_break_title cc_steps_actions_title `}>Perform the following action(s):</span>
                          </div>
                          <h4 style={{"background": "transparent","width": "100%"}}>
                            <i className="mksicon-act_score" style={{"marginRight" : "4px"}}></i>Score
                          </h4>
                          <span className="act_subj_title">Score Change by : </span>
                          <span className="act_subj_title_value">{item['changeBy']}</span>
                          <br/>

                            {item['Score Update Due'] &&
                              <span><span className="act_sent_time" style={{"marginLeft": "0px"}}>Score Update Due: </span>
                              <span className="act_sent_time_value">{this.parseDateToMoment(item['Score Update Due'])}</span></span>
                            }
                            {item['Score Updated On'] &&
                              <span>
                                <span className="act_sent_time" style={{"marginLeft": "0px"}}>Score Update On: </span>
                              <span className="act_sent_time_value">{this.parseDateToMoment(item['Score Updated On'])}</span>
                            </span>
                            }
                        </div>
                      )
                    }
                  })
                  return items;
      }
      generateAdvanceRules(advRules,baseDetails){
            let orAll = "";
            if(!jQuery.isEmptyObject(baseDetails)){
              orAll = (baseDetails.applyRuleCount == "1") ? "One" : "All";
            }
            let items = advRules.map((item, i) => {
              if(item.type=="E"){
                return (
                <div key={i} className="mks_cc_action_wraper">

                    <span style={{"textTransform": "none","fontSize": "12px","color": "rgb(2, 175, 239)"}} className={`cc_steps_break_title cc_steps_actions_title ${(i > 0) ? 'hide':''}`}>{orAll} of the advanced filters below were met:</span>

                  <div className='single_action_wrap'>

                    <div className="cc_act_extra_details cc_act_adv_details">

                      <span className="act_subj_title">Email Filter: </span>
                      <span className="act_subj_title_value">{item.campaignName}</span>

                        {(item['filterBy']== "OP")&&
                          <span><span className="act_sent_time" style={{"marginLeft": "0px"}}>opened: </span>
                          <span className="act_sent_time_value">{item['frequency']} or more times in last {item['timeSpanInDays']} day(s)</span></span>
                        }
                        {(item['filterBy']== "CK")&&
                          <span><span className="act_sent_time" style={{"marginLeft": "0px"}}>clicked on: </span>
                          <span className="act_sent_time_value">{item['frequency']} or more times in last {item['timeSpanInDays']} day(s)</span></span>
                        }
                        {(item['filterBy']== "NC")&&
                          <span><span className="act_sent_time" style={{"marginLeft": "0px"}}>non-clickers: </span>
                          <span className="act_sent_time_value">{item['frequency']} or more times in last {item['timeSpanInDays']} day(s)</span></span>
                        }
                    </div>
                  </div>
                  </div>
                )
              }
              if(item.type=="S"){
                return (
                <div key={i} className="mks_cc_action_wraper">
                  <span style={{"textTransform": "none","fontSize": "12px","color": "rgb(2, 175, 239)"}} className={`cc_steps_break_title cc_steps_actions_title ${(i > 0) ? 'hide':''}`}>{orAll} of the advanced filters below were met:</span>
                  <div className='single_action_wrap'>

                    <div className="cc_act_extra_details cc_act_adv_details">

                      <span className="act_subj_title">Score {(item.rule=="eq") ? "equals" : (item.rule=="less") ? "less than" : "greater than"}: </span>
                      <span className="act_subj_title_value">{item.score}</span>

                    </div>
                  </div>
                  </div>
                )
              }
              if(item.type=="W"){
                return (
                <div key={i} className="mks_cc_action_wraper">
                  <span style={{"textTransform": "none","fontSize": "12px","color": "rgb(2, 175, 239)"}} className={`cc_steps_break_title cc_steps_actions_title ${(i > 0) ? 'hide':''}`}>{orAll} of the advanced filters below were met:</span>

                  <div className='single_action_wrap'>

                    <div className="cc_act_extra_details cc_act_adv_details">
                      <h4 style={{"background": "transparent","width": "100%"}}>
                        Web visits performed against
                      </h4>
                      <span className="act_subj_title"> {(item.filterBy=="PU") ? "Page URL" : ""}: </span>
                      <span className="act_subj_title_value mkb_elipsis" style={{"width": "245px","display": "block","wordWrap": "break-word"}}><a href={decodeHTML(item.pageURL)} target="_blank">{decodeHTML(item.pageURL)} </a><br/> {item['frequency']} or more times in last {item['timeSpanInDays']}  day(s)</span>

                    </div>
                  </div>
                  </div>
                )
              }
              if(item.type=="F"){
                return (
                  <div key={i} className="mks_cc_action_wraper">
                    <span style={{"textTransform": "none","fontSize": "12px","color": "rgb(2, 175, 239)"}} className={`cc_steps_break_title cc_steps_actions_title ${(i > 0) ? 'hide':''}`}>{orAll} of the advanced filters below were met:</span>

                    <div className='single_action_wrap'>

                      <div className="cc_act_extra_details cc_act_adv_details">
                        <h4 style={{"background": "transparent","width": "100%"}}>
                          Sign Up Form
                        </h4>
                        <span className="act_subj_title"> {item.formName} </span>
                        <span className="act_subj_title_value">	in last {item.timeSpanInDays} day(s).</span>

                      </div>
                    </div>
                    </div>
                )
              }
              if(item.type=="L"){
                return (
                <div key={i} className="mks_cc_action_wraper">
                  <span style={{"textTransform": "none","fontSize": "12px","color": "rgb(2, 175, 239)"}} className={`cc_steps_break_title cc_steps_actions_title ${(i > 0) ? 'hide':''}`}>{orAll} of the advanced filters below were met:</span>

                  <div className='single_action_wrap'>

                    <div className="cc_act_extra_details cc_act_adv_details">
                      <h4 style={{"background": "transparent","width": "100%"}}>
                        List Filter:
                      </h4>
                      {(item['matchAll']!="false") &&
                      <span className="act_subj_title" style={{"width": "100%"}} >Subscriber is Member of all of the following list(s):</span>
                      }
                      {(item['matchAll']=="false") &&
                      <span className="act_subj_title" style={{"width": "100%"}} >Subscriber is Non Member of any of the following list(s):</span>
                      }

                      <span className="act_subj_title_value">
                        <select style={{"float": "none","top" : "4px","marginBottom": "5px","width": "96%"}}>
                        {this.generateListNames(item.listNames)}
                        </select>
                      </span>

                    </div>
                  </div>
                  </div>
                )
              }


            });

              return items;
      }
      generateListNames(lists){
        var listName = lists.split(',');
        const ListItems = listName.map((list,key) =>
              <option key={key} className="mngList_li_wrap ">
                  {list}
              </option>
        );
        return ListItems;

      }
      generateSingleObjectWF(serverJsonWF){
          let newObject = []

          // 1. generate WF
          $.each(serverJsonWF,function(key,val){
              let stepArray = [];
                //2. generate StepsWF
              $.each(val[0].steps[0],function(key,val){

                let optionArr = [];
                // 3. Generate Options array
                $.each(val[0].options[0],function(key,value){
                  // 4. Generate Basic Rules
                  let basicRuleArr = [];
                  $.each(value[0].basicRules[0],function(key,value){
                    basicRuleArr.push(value[0]);
                  });
                  // 5. Generate actions rules
                  let actionsArr = [];
                  $.each(value[0].actions[0],function(key,value){
                    actionsArr.push(value[0])
                  });
                  // 6. Generate advanceRules
                  let advanceRulesArr = [];
                  $.each(value[0].advanceRules[0],function(key,value){
                    advanceRulesArr.push(value[0]);
                  })
                  value[0].basicRules = basicRuleArr;
                  value[0].actions = actionsArr;
                  value[0].advanceRules = advanceRulesArr;

                  optionArr.push(value[0]);
                })
                val[0].options = optionArr;
                stepArray.push(val[0]);

              });
              val[0].steps = stepArray;
              newObject.push(val[0]);
          });
          return newObject;
      }

      checkStateStep(skipTime){
          console.log(skipTime);

          if(!skipTime){
            return;
          }
          var skipdate = skipTime.split(" ")[0];
          var skipdateObj = new Date(skipdate);
          var NewSkippedObj = skipdateObj.getTime();
          var currentDate = new Date();
          var newCurrentDate = currentDate.getTime();

          if(newCurrentDate > NewSkippedObj){
            this.state['showHideSkip'] = 'hide';
          }else{
            this.state['showHideSkip'] = 'show';
          }
      }

      /*==================Events=====================*/
      grabBasicCustomField(myval){
        if(this.state.basicMapFields[myval]){
            return "[Basic] "+this.state.basicMapFields[myval];
          }else{
            return "[Custom] "+myval.split('_')[1].substring(0, myval.split('_')[1].length - 2)
          }
      }

      checkFutureDate(scheduleDate){
        if(!scheduleDate){
          return;
        }
        var skipdate = scheduleDate.split(" ")[0];
        var skipdateObj = new Date(skipdate);
        var currentDate = new Date();
        if(currentDate < skipdateObj){
          return 'hide';
        }
      }
      parseDateToMoment(serverDate){
        if(serverDate){
          let _date = Moment(serverDate, 'YYYY/M/D h:m');
          let _formatedDate = {date: _date.format("DD MMM YYYY"), time: _date.format("hh:mm")};
          let _formatedDateN = _formatedDate.date+","+_formatedDate.time;
          console.log(_formatedDate)
          return _formatedDateN;
        }

      }
      showToggle(event){
        //let stepFlag = this.state.showStepsFlag;
        $('div.mks_cc_wf_wrap').removeClass('cc_show_details');

        //let collapseExpand = this.state.collapseExpand;
        if($(event.currentTarget).hasClass('collapse')){
          $(event.currentTarget).removeClass('collapse');
          $(event.currentTarget).addClass('expand');
          $(event.currentTarget).find('.collapseMsg').text('Click to expand')
        }
        else{
          $('div.collapseable').removeClass('collapse');
          $('div.collapseable').addClass('expand');
          $('div.collapseable').find('.collapseMsg').text('Click to expand')
          $(event.currentTarget).removeClass('expand');
          $(event.currentTarget).addClass('collapse');
          $(event.currentTarget).find('.collapseMsg').text('Click to collapse')
          $(event.currentTarget).parents('div.mks_cc_wf_wrap').toggleClass('cc_show_details');
        }
      }
      triggerToggleOnh4(event){
        $('div.mks_cc_wf_wrap').removeClass('cc_show_details');
        if($(event.currentTarget).parents('div.mks_cc_wf_wrap').find('.collapseable').hasClass('collapse')){
          $(event.currentTarget).parents('div.mks_cc_wf_wrap').find('.collapseable').removeClass('collapse');
          $(event.currentTarget).parents('div.mks_cc_wf_wrap').find('.collapseable').addClass('expand');
          $(event.currentTarget).parents('div.mks_cc_wf_wrap').find('.collapseable').find('.collapseMsg').text('Click to expand')
        }else{
          $('div.collapseable').removeClass('collapse');
          $('div.collapseable').addClass('expand');
          $('div.collapseable').find('.collapseMsg').text('Click to expand')

          $(event.currentTarget).parents('div.mks_cc_wf_wrap').find('.collapseable').removeClass('expand');
          $(event.currentTarget).parents('div.mks_cc_wf_wrap').find('.collapseable').addClass('collapse');
          $(event.currentTarget).parents('div.mks_cc_wf_wrap').find('.collapseable').find('.collapseMsg').text('Click to collapse');
          $(event.currentTarget).parents('div.mks_cc_wf_wrap').toggleClass('cc_show_details');
        }
      }

      playPauseWorkFlows(wfId,actiont,event){
          console.log(wfId);
          if($(event.currentTarget).hasClass('cc_disabled')){
            return false;
          }
          var r = confirm("Are you sure you want to " + actiont + " workflow for current subscriber?");
          if (r == true) {
            this.setState({showLoading:true,message: actiont + " workflow for current user."});
            debugger;
            //https://test.bridgemailsystem.com/pms/io/workflow/saveWorkflowData/?BMS_REQ_TK=HM4r0TmFm6Hx0L0yyAlCQqJBPpBVH2&type=setCourseCorrectForSub
            request.post(this.baseUrl+'/io/workflow/saveWorkflowData/?BMS_REQ_TK='+this.props.users_details[0].bmsToken+'&type=setCourseCorrectForSub')
               .set('Content-Type', 'application/x-www-form-urlencoded')
               .send({
                        type:'setCourseCorrectForSub'
                        ,subNum: this.props.contact.subNum
                        ,workflowId: wfId
                        ,action : actiont
                        ,ukey:this.props.users_details[0].userKey
                        ,isMobileLogin:'Y'
                        ,userId:this.props.users_details[0].userId
                      })
               .then((res) => {
                  console.log(res);

                  var jsonResponse =  JSON.parse(res.text);
                  console.log(jsonResponse);
                  if(res.status==200){
                    this.setState({showLoading:false,message:""})
                    SuccessAlert({message:jsonResponse[1]});
                    this.setState({showLoading:true,message:"Updating course correct."});
                    this.getCourseCorrect();
                    //_this.getSubscriberDetails();
                  }else{
                    if(jsonResponse[1] == "SESSION_EXPIRED"){
                      ErrorAlert({message:jsonResponse[1]});
                      jQuery('.mksph_logout').trigger('click');
                    }else{
                      ErrorAlert({message:jsonResponse[1]});
                    }
                  }
                });
          } else {
              return false;
          }

      }
      playPauseNurtureTrack(ntId,actiont,event){
        console.log('Time to play n pause nt');
        if($(event.currentTarget).hasClass('cc_disabled')){
          return false;
        }
        var r = confirm("Are you sure you want to " + actiont + " nurture track for current subscriber?");
        if (r == true) {
          this.setState({showLoading:true,message: actiont + " nurture track for current user."});

          request.post(this.baseUrl+'/io/trigger/saveNurtureData/?BMS_REQ_TK='+this.props.users_details[0].bmsToken+'&type=setCourseCorrectForSub')
             .set('Content-Type', 'application/x-www-form-urlencoded')
             .send({
                      type:'setCourseCorrectForSub'
                      ,subNum: this.props.contact.subNum
                      ,trackId: ntId
                      ,action : actiont
                      ,ukey:this.props.users_details[0].userKey
                      ,isMobileLogin:'Y'
                      ,userId:this.props.users_details[0].userId
                    })
             .then((res) => {
                console.log(res);

                var jsonResponse =  JSON.parse(res.text);
                console.log(jsonResponse);
                if(res.status==200 && jsonResponse[0]!="err"){
                  this.setState({showLoading:false,message:""})
                  SuccessAlert({message:jsonResponse[1]});
                  this.setState({showLoading:true,message:"Updating course correct."});
                  this.getCourseCorrect();
                  //_this.getSubscriberDetails();
                }else{
                  this.setState({showLoading:false,message:""})
                  if(jsonResponse[1] == "SESSION_EXPIRED"){
                    ErrorAlert({message:jsonResponse[1]});
                    jQuery('.mksph_logout').trigger('click');
                  }else{
                    ErrorAlert({message:jsonResponse[1]});
                  }
                }
              });

        } else {
            return false;
        }
      }
      skippWF(skippedObj,actionT,event){
        console.log(skippedObj);
        if($(event.currentTarget).hasClass('cc_disabled')){
          return false;
        }
        var r = confirm("Are you sure you want to " + actionT + " workflow for current subscriber?" );
          if (r == true) {
            this.setState({showLoading:true,message: actionT + " workflow for current user."});
            request.post(this.baseUrl+'/io/workflow/saveWorkflowData/?BMS_REQ_TK='+this.props.users_details[0].bmsToken+'&type=setCourseCorrectForSub')
               .set('Content-Type', 'application/x-www-form-urlencoded')
               .send({
                        type:'setCourseCorrectForSub'
                        ,subNum: this.props.contact.subNum
                        ,workflowId: skippedObj.workflowId
                        ,stepId : skippedObj.skippedId
                        ,ukey:this.props.users_details[0].userKey
                        ,isMobileLogin:'Y'
                        ,userId:this.props.users_details[0].userId
                        ,action : actionT
                      })
               .then((res) => {
                  console.log(res);

                  var jsonResponse =  JSON.parse(res.text);
                  console.log(jsonResponse);
                  if(res.status==200 && jsonResponse[0]=="success"){
                    this.setState({showLoading:false,message:""})
                    SuccessAlert({message:jsonResponse[1]});
                    this.setState({showLoading:true,message:"Updating course correct."});
                    this.getCourseCorrect();
                    //_this.getSubscriberDetails();
                  }else{
                    this.setState({showLoading:false,message:""})
                    if(jsonResponse[1] == "SESSION_EXPIRED"){
                      ErrorAlert({message:jsonResponse[1]});
                      jQuery('.mksph_logout').trigger('click');
                    }else{
                      ErrorAlert({message:jsonResponse[1]});
                    }
                  }
                });
          } else {
            return false;
          }

        }
        skippNT(skippedObj,actionT,event){
          console.log(skippedObj);
          if($(event.currentTarget).hasClass('cc_disabled')){
            return false;
          }
          var r = confirm("Are you sure you want to " + actionT + " nurture track for current subscriber?" );
            if (r == true) {
              this.setState({showLoading:true,message: actionT + "  nurture track for current user."});
              request.post(this.baseUrl+'/io/trigger/saveNurtureData/?BMS_REQ_TK='+this.props.users_details[0].bmsToken+'&type=setCourseCorrectForSub')
                 .set('Content-Type', 'application/x-www-form-urlencoded')
                 .send({
                          type:'setCourseCorrectForSub'
                          ,subNum: this.props.contact.subNum
                          ,trackId: skippedObj.ntid
                          ,action : actionT
                          ,messageId : skippedObj.msgid
                          ,ukey:this.props.users_details[0].userKey
                          ,isMobileLogin:'Y'
                          ,userId:this.props.users_details[0].userId
                        })
                 .then((res) => {
                    console.log(res);

                    var jsonResponse =  JSON.parse(res.text);
                    console.log(jsonResponse);
                    if(res.status==200 && jsonResponse[0]=="success"){
                      this.setState({showLoading:false,message:""})
                      SuccessAlert({message:jsonResponse[1]});
                        this.setState({showLoading:true,message:"Updating course correct."});
                      this.getCourseCorrect();
                      //_this.getSubscriberDetails();
                    }else{
                      this.setState({showLoading:false,message:""})
                      if(jsonResponse[1] == "SESSION_EXPIRED"){
                        ErrorAlert({message:jsonResponse[1]});
                        jQuery('.mksph_logout').trigger('click');
                      }else{
                        ErrorAlert({message:jsonResponse[1]});
                      }
                    }
                  });
            } else {
              return false;
            }

          }
      /*==============================================*/
      render(){
        if(!this.state.workflows && !this.state.nurtureTracks){
        return(
          <div id="NoContact" className="tabcontent mksph_cardbox">
                  <p className="not-found">Loading Course Correct...</p>
              </div>
        )
      }
      if(this.state.workflows == "empty" && this.state.nurtureTracks == "empty"){
        return (<div id="NoContact" className="tabcontent mksph_cardbox">
                <p className="not-found" style={{"color" : "#6393af"}}>No Drips found for {(this.props.contact.firstName || this.props.contact.lastName) ? this.props.contact.firstName + " " + this.props.contact.lastName : this.props.contact.email}</p>
            </div>)
      }
      if(this.state.workflows || this.state.nurtureTracks){
        return (
          <div className="sl_lists_wrapper">
            <LoadingMask message={this.state.message} extraClass={'loadingMaks-additional'} showLoading={this.state.showLoading}/>
            <div className={`sl_wrap_list`} >
              <h2 style={{textAlign: "center",marginBottom: "0px","background":"transparent","color" : "rgb(100, 148, 175)","padding" : "0 15px"}}>Drip Messages for {(this.props.contact.firstName || this.props.contact.lastName) ? this.props.contact.firstName + " " + this.props.contact.lastName : this.props.contact.email}</h2>
                <ul>
                  <h3 className={`cc_title_h3 ${(!this.state.workflows || this.state.workflows=="empty") ? 'hide' : '' }`}><span className="mksicon-act_workflow"></span>Workflows</h3>
                  {this.generateWorkflows()}
                  <h3 className={` cc_title_h3 ${(!this.state.nurtureTracks || this.state.nurtureTracks=="empty") ? 'hide' : '' }`}><span className="mksicon-Nurture_Track"></span>Nurture Tracks</h3>
                  {this.generateNurturetracks()}
                </ul>

            </div>
        </div>
        )
      }
    }
}
export default CourseCorrect;
