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

        this.state = {
          workflows : null,
          nurtureTracks : null,
          showStepsFlag : '',
          collapseMsg : 'Click to expand',
          collapseExpand : 'expand',
          showLoading  : false,
          showHideSkip : 'show'
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
        const ListItems = this.state.nurtureTracks.map((list,key) =>
              <li key={key} className="mngList_li_wrap ">
                  <div className="mks_mnglist_wrap mks_cc_wf_wrap">
                    <span className="mksicon-Nurture_Track icon-cc"></span>
                    <h4 className="cc_title_h4" title={decodeHTML(list.name)} onClick={this.triggerToggleOnh4.bind(this)} >{decodeHTML(list.name)}<span>show</span> </h4>
                      <div className={`${this.state.collapseExpand} collapseable`} onClick={this.showToggle.bind(this)}>
                        <span className="collapseMsg">Click to expand</span>
                        <span className="mksicon-ArrowNext"></span>
                      </div>
                      <div className="mks_cc_steps_wrapper">
                          {this.generateNTMessages(list.messages,list.updationDate)}
                      </div>
                  </div>
              </li>
        );
        return ListItems;
      }
      generateNTMessages(messages,updationDate){

        let items = messages.map((item, i) => {
            return (
              <div key={i} className="cc_steps_break_wraps">
                <div  className='autocomplete__item cc_steps_break autocomplete__item--disabled'>
                  <span className="cc_steps_break_title"> {item.label+" "+ (i+1)} :</span>
                  <span className="cc_steps_break_time"><span style={{"color" : "#fff"}}>Email Sent </span> : {updationDate} Pacific</span>
                </div>
                <div className="mks_cc_action_wraper">
                  <div  className='autocomplete__item cc_steps_break autocomplete__item--disabled'>
                    <span className="cc_steps_break_title cc_steps_actions_title">Perform the following action(s):</span>
                  </div>
                  <div className='single_action_wrap'>

                    <div className="cc_act_extra_details">
                      <span className="act_subj_title"><i className="mksicon-Mail"></i> Subject: </span>
                      <span className="act_subj_title_value">{item.subject}</span>
                      <br/>
                      <span className="act_sent_time">Time of Day: </span>
                      <span className="act_sent_time_value">{(item.timeOfDay == -1) ? 'Instant' : item.timeOfDay+item.timeOfDayHrs+":"+item.timeOfDayMins+item.timeOfDayMins}</span>
                      <ul className={`${(parseInt(item.opens) > 0 || parseInt(item.clicks) > 0 || parseInt(item.pageViews) > 0 ) ? "show" : "hide" }` } >
                        <li><span>Open(s): </span>{item.opens} <span style={{"fontWeight": "100","width": "115px","fontSize": "9px"}}>(last opened on {item.lastOpenOn})</span></li>
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
                    <span className="cc_steps_break_time"><span style={{"color" : "#e0e0e0"}}>Skipped</span> : {item.stepSkipped} Pacific</span>
                  </div>
                  <div className="cc_steps_options_wrap">{this.generateOptions(item.options,{workflowId : wfId,skipped: item.skipped,skippedId:item.stepId,stepSkipped:item.stepSkipped},'skipped')}</div>
              </div>
              )
            } else if(item.stepCompleted && item.label != "DO NOTHING") {
              return (
                <div key={i} className="cc_steps_break_wraps">
                  <div  className='autocomplete__item cc_steps_break autocomplete__item--disabled'>
                    <span className="cc_steps_break_title">Step {(i+1)}:</span>
                    <span className="cc_steps_break_time"><span style={{"color" : "#fff"}}>Completed at</span> : {item.stepCompleted} Pacific</span>
                  </div>
                  <div className="cc_steps_options_wrap">{this.generateOptions(item.options)}</div>
              </div>
              )
            }else if(item.nextAction){
              return (
                  <div key={i} className="cc_steps_break_wraps">
                    <div className='autocomplete__item cc_steps_break autocomplete__item--disabled'>
                      <span className="cc_steps_break_title">Step {(i+1)}:</span>
                      <span className="cc_steps_break_time"><span style={{"color" : "#13a9ff"}}>Next Action</span> : {item.nextAction} Pacific</span>
                    </div>
                      <div className="cc_steps_options_wrap">{this.generateOptions(item.options,{workflowId : wfId,skipped: item.skipped,skippedId:item.stepId,stepSkipped:item.stepSkipped},'nextAction')}</div>
                  </div>
              )
            }else if(item.label == "DO NOTHING"){
              return (
                <div key={i} className="cc_steps_break_wraps">
                  <div  className='autocomplete__item cc_steps_break autocomplete__item--disabled'>
                    <span className="cc_steps_break_title"><span className="mksicon-Prohibition"></span> {item.label.toLowerCase()}</span>
                    <span className="cc_steps_break_time"><span style={{"color" : "#fff"}}>Completed at</span> : {item.stepCompleted} Pacific</span>
                  </div>
                  <div className="cc_steps_options_wrap">{this.generateOptions(item.options)}</div>
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
            ListItems = options.map((list,key) =>
                      <div className="cc_step_options_wrap">
                            <span className="cc_basic_opt_wrap_label">{list.optionLabel ? list.optionLabel : 'Option '+list.optionNumber}
                              {this.checkStateStep(skippedObj.stepSkipped)}
                              <span data-tip="Click to unskip step" onClick={this.skippWF.bind(this,skippedObj,'unskip')} className={`${this.state.showHideSkip} ${(skippedObj.skipped=="false") ? 'cc_disabled' : ""} scf_o_icon scf_o_edit mksicon-CPlay mks_manageList_wrap`}></span>
                              <span data-tip="Click to skip step" onClick={this.skippWF.bind(this,skippedObj,'skip')}   className={`${this.state.showHideSkip} ${(skippedObj.skipped=="true") ? 'cc_disabled' : ""} scf_o_icon scf_o_edit  mksicon-CPlayNext mks_manageList_wrap`}></span>
                              <ReactTooltip />
                          </span>
                            <div className="cc_option_basic_rule_wrap">{this.generateBasicRules(list.basicRules)}</div>
                            <div className="cc_option_action_rule_wrap">{this.generateActionRules(list.actions)}</div>
                      </div>
            );
          }else{
            ListItems = options.map((list,key) =>
                      <div className="cc_step_options_wrap">
                            <span className="cc_basic_opt_wrap_label">{list.optionLabel ? list.optionLabel : 'Option '+list.optionNumber}
                            </span>
                            <div className="cc_option_basic_rule_wrap">{this.generateBasicRules(list.basicRules)}</div>
                            <div className="cc_option_action_rule_wrap">{this.generateActionRules(list.actions)}</div>
                      </div>
            );
          }

          return ListItems;
      }
      generateBasicRules(basicRuleObj){
          //$.each()
          if(basicRuleObj.length > 0){
            let orAll = (basicRuleObj[0].rule == "=" || basicRuleObj[0].rule == "!ct") ? "All" : "One";
            const ListItems = basicRuleObj.map((list,key) =>
                      <div className="cc_basic_rule_wrap">
                          <h4 className="cc_basic_rule_title">{orAll} of the condition(s) below were met</h4>
                          <span className="cc_basic_rule_head">Field:</span>
                          <span className="cc_basic_rule_value">{(list.field == "{{EMAIL_ADDR}}") ? "[Basic] Email" : list.field }</span>
                          <br/>
                          <span className="cc_basic_rule_head">Match Type:</span>
                          <span className="cc_basic_rule_value">{(list.rule == "ct") ? "contains" : (list.rule == "!ct") ? "does not contain" : "equals to" }</span>

                          <br/>
                          <span className="cc_basic_rule_head">Format:</span>
                          <span className="cc_basic_rule_value">{(list.format) ? list.format : "--" }</span>
                          <br/>
                          <span className="cc_basic_rule_head">Match Value(s):</span>
                          <span className="cc_basic_rule_value">{list.matchValue}</span>
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
                        <div  className='autocomplete__item cc_steps_break autocomplete__item--disabled'>
                          <span className="cc_steps_break_title cc_steps_actions_title">Perform the following action(s):</span>
                        </div>
                        <div className='single_action_wrap'>

                          <div className="cc_act_extra_details">
                            <span className="act_subj_title"><i className="mksicon-Mail"></i> Subject: </span>
                            <span className="act_subj_title_value">{item.subject}</span>
                            <br/>
                            <span className={(item.Sent) ? 'act_sent_time' : 'act_sent_time hide'}>Sent: </span>
                            <span className={(item.Sent) ? 'act_sent_time_value' : 'act_sent_time_value hide'}>{item.Sent}</span>
                            <span className={`act_sent_time ${(item.Skipped) ? "show" : "hide"}`}>Skipped at</span>
                            <span className={`act_sent_time_value ${(item.Skipped) ? "show" : "hide"}`}>{item.Skipped + " Pacific"}</span>

                            <ul className={`${(parseInt(item.opens) > 0 || parseInt(item.opens) > 0 || parseInt(item.pageViews) > 0 ) ? "show" : "hide" }` } >
                              <li><span>Open(s): </span>{item.opens} <span style={{"fontWeight": "100","width": "115px","fontSize": "9px"}}>(last opened on {item.lastOpenOn})</span></li>
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
                          <h4 style={{"background": "transparent","width": "100%"}}>
                            <i className="mksicon-act_alert" style={{"marginRight" : "4px"}}></i>View Sales Rep Alert
                          </h4>
                          <span className="act_sent_time" style={{"marginLeft": "0px"}}>Send Alert : </span>
                          <span className="act_sent_time_value">{(item['Send Alert']) ? item['Send Alert'] : item['Sent']} Pacific</span>
                        </div>
                      )
                    }else if(item.type=="score"){
                      return (
                        <div key={i} className='single_action_wrap' style={{"background": "#fff","padding": "10px 15px"}}>
                          <h4 style={{"background": "transparent","width": "100%"}}>
                            <i className="mksicon-act_score" style={{"marginRight" : "4px"}}></i>Score
                          </h4>
                          <span className="act_subj_title">Score Change by : </span>
                          <span className="act_subj_title_value">{item['changeBy']}</span>
                          <br/>
                          <span className="act_sent_time" style={{"marginLeft": "0px"}}>Score Update Due: </span>
                          <span className="act_sent_time_value">{item['Score Update Due']}</span>
                        </div>
                      )
                    }
                  })
                  return items;
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
          var currentDate = new Date();
          if(currentDate > skipdateObj){
            this.state['showHideSkip'] = 'hide';
          }else{
              this.state['showHideSkip'] = 'show';
          }
      }

      /*==================Events=====================*/
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
          console.log(wfId);if($(event.currentTarget).hasClass('cc_disabled')){
            return false;
          }
          var r = confirm("Are you sure you want to " + actiont + " workflow for current subscriber?");
          if (r == true) {
            this.setState({showLoading:true,message: actiont + " workflow for current user."});
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
                    debugger;
                    this.setState({showLoading:false,message:""})
                    SuccessAlert({message:jsonResponse[1]});
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
                    debugger;
                    this.setState({showLoading:false,message:""})
                    SuccessAlert({message:jsonResponse[1]});
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

        return (
          <div className="sl_lists_wrapper">
            <LoadingMask message={this.state.message} extraClass={'loadingMaks-additional'} showLoading={this.state.showLoading}/>
            <div className={`sl_wrap_list`} >
              <h2 style={{textAlign: "center",marginBottom: "0px","background":"transparent","color" : "rgb(100, 148, 175)","padding" : "0 15px"}}>Drip Messages for {(this.props.contact.firstName || this.props.contact.lastName) ? this.props.contact.firstName + " " + this.props.contact.lastName : this.props.contact.email}</h2>
                <ul>
                  <h3 className="cc_title_h3"><span className="mksicon-act_workflow"></span>Workflows</h3>
                  {this.generateWorkflows()}
                  <h3 className="cc_title_h3"><span className="mksicon-Nurture_Track"></span> Nurture Tracks</h3>
                  {this.generateNurturetracks()}
                </ul>

            </div>
        </div>
        )
      }
}
export default CourseCorrect;
