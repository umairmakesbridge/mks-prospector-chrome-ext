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
class CourseCorrect extends Component{
      constructor(props){
        super(props);
        this.baseUrl = this.props.baseUrl;

        this.state = {
          workflows : null,
          nurtureTracks : null,
          showStepsFlag : '',
          collapseMsg : 'Click to expand',
          collapseExpand : 'expand'
        }

        // preserve the initial state in a new object
        this.baseState = this.state;
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
                    <h4 className="mks_cc_wf_wrap_top_title" title={decodeHTML(list.name)} >{decodeHTML(list.name)}</h4>

                        <div className={`${this.state.collapseExpand}`} onClick={this.showToggle.bind(this)}>
                          <span className="collapseMsg">Click to expand</span>
                          <span className="mksicon-ArrowNext"></span>
                        </div>

                    <div className="mks_cc_steps_wrapper">
                      <div  className='autocomplete__item cc_steps_break cc_steps_actions_wrap autocomplete__item--disabled'>
                          <div className='cc_action_wraps'>
                            <span className="mksicon-Play mks_cc_action mks_cc_action_gray"></span>
                            <span className="mksicon-Pause mks_cc_action mks_cc_action_pink"></span>
                            <span className="mksicon-Delete mks_cc_action mks_cc_action_red"></span>
                          </div>
                      </div>
                      {this.generateSteps(list.steps)}
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
                    <h4 title={decodeHTML(list.name)} >{decodeHTML(list.name)}<span>show</span> </h4>
                      <div className={`${this.state.collapseExpand}`} onClick={this.showToggle.bind(this)}>
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
                  <span className="cc_steps_break_time"><span style={{"color" : "#fff"}}>Email Sent </span> : {updationDate}</span>
                </div>
                <div className="mks_cc_action_wraper">
                  <div  className='autocomplete__item cc_steps_break autocomplete__item--disabled'>
                    <span className="cc_steps_break_title">Perform the following action(s):</span>
                  </div>
                  <div className='single_action_wrap'>
                    <span className="act_subj_title"><i className="mksicon-Mail"></i> Subject: </span>
                    <span className="act_subj_title_value">{item.subject}</span>
                    <span className="act_sent_time">Time of Day: </span>
                    <span className="act_sent_time_value">{(item.timeOfDay == -1) ? 'Instant' : item.timeOfDay+item.timeOfDayHrs+":"+item.timeOfDayMins+item.timeOfDayMins}</span>
                    <div className="cc_act_extra_details">
                      <ul>
                        <li><span>Open(s): </span>{item.opens}</li>
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
      generateSteps(steps){
          //console.log('My Steps : ', steps);
          let items = steps.map((item, i) => {
            if(item.skipped == "true"){
              return (
                <div key={i} className="cc_steps_break_wraps">
                  <div  className='autocomplete__item cc_steps_break autocomplete__item--disabled'>
                    <span className="cc_steps_break_title">Step {(i+1)}:</span>
                    <span className="cc_steps_break_time"><span style={{"color" : "#7996a8"}}>Skipped</span> : {item.stepSkipped}</span>
                  </div>
                  <div className="cc_steps_options_wrap">{this.generateOptions(item.options)}</div>
              </div>
              )
            } else if(item.stepCompleted) {
              return (
                <div key={i} className="cc_steps_break_wraps">
                  <div  className='autocomplete__item cc_steps_break autocomplete__item--disabled'>
                    <span className="cc_steps_break_title">Step {(i+1)}:</span>
                    <span className="cc_steps_break_time"><span style={{"color" : "rgb(35, 206, 140)"}}>Completed at</span> : {item.stepCompleted}</span>
                  </div>
                  <div className="cc_steps_options_wrap">{this.generateOptions(item.options)}</div>
              </div>
              )
            }else if(item.nextAction){
              return (
                  <div key={i} className="cc_steps_break_wraps">
                    <div className='autocomplete__item cc_steps_break autocomplete__item--disabled'>
                      <span className="cc_steps_break_title">Step {(i+1)}:</span>
                      <span className="cc_steps_break_time"><span style={{"color" : "#F21A05"}}>Next Action</span> : {item.nextAction}</span>
                    </div>
                      <div className="cc_steps_options_wrap">{this.generateOptions(item.options)}</div>
                  </div>
              )
            }else{
              return (
                <div>Rest Steps needs to be taken care of</div>
              )
            }
          })
          return items;
      }
      generateOptions(options){
          // let optionArr = [];
          let optionLabel = "";
          const ListItems = options.map((list,key) =>
                    <div className="cc_step_options_wrap">
                          <span className="cc_basic_opt_wrap_label">{list.optionLabel ? list.optionLabel : 'Option '+list.optionNumber}</span>
                          <div className="cc_option_basic_rule_wrap">{this.generateBasicRules(list.basicRules)}</div>
                          <div className="cc_option_action_rule_wrap">{this.generateActionRules(list.actions)}</div>
                    </div>
          );
          return ListItems;
      }
      generateBasicRules(basicRuleObj){
          //$.each()
          if(basicRuleObj.length > 0){
            let orAll = (basicRuleObj[0].rule == "=") ? "All" : "One";
            const ListItems = basicRuleObj.map((list,key) =>
                      <div className="cc_basic_rule_wrap">
                          <h4 className="cc_basic_rule_title">{orAll} of the condition(s) below were met</h4>
                          <span className="cc_basic_rule_head">Field:</span>
                          <span className="cc_basic_rule_value">{list.field}</span>
                          <br/>
                          <span className="cc_basic_rule_head">Match Type:</span>
                          <span className="cc_basic_rule_value">{(list.rule == "ct") ? "contains" : "equals to" }</span>
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
                          <span className="cc_steps_break_title">Perform the following action(s):</span>
                        </div>
                        <div className='single_action_wrap'>
                          <span className="act_subj_title"><i className="mksicon-Mail"></i> Subject: </span>
                          <span className="act_subj_title_value">{item.subject}</span>
                          <span className="act_sent_time">Sent: </span>
                          <span className="act_sent_time_value">{item.Sent}</span>
                          <div className="cc_act_extra_details">
                            <ul>
                              <li><span>Open(s): </span>{item.opens}</li>
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
                          <span className="act_sent_time_value">{item['Send Alert']}</span>
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



      /*==================Events=====================*/
      showToggle(event){
        //let stepFlag = this.state.showStepsFlag;
        $('div.mks_cc_wf_wrap').removeClass('cc_show_details');

        //let collapseExpand = this.state.collapseExpand;
        if($(event.currentTarget).attr('class') == 'collapse'){
          $(event.currentTarget).attr('class','');
          $(event.currentTarget).attr('class','expand');
          $(event.currentTarget).find('.collapseMsg').text('Click to expand')
        }else{
          $(event.currentTarget).attr('class','');
          $(event.currentTarget).attr('class','collapse');
          $(event.currentTarget).find('.collapseMsg').text('Click to collapse')
          $(event.currentTarget).parents('div.mks_cc_wf_wrap').toggleClass('cc_show_details');
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

            <div className={`sl_wrap_list`} >
                <ul>
                  <h3 className="cc_title_h3">Workflows</h3>
                  {this.generateWorkflows()}
                  <h3 className="cc_title_h3">Nurture Tracks</h3>
                  {this.generateNurturetracks()}
                </ul>

            </div>
        </div>
        )
      }
}
export default CourseCorrect;
