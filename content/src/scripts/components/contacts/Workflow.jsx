import React, {Component}
       from 'react';
import request
       from 'superagent';
import {ErrorAlert,SuccessAlert}
       from '../common/Alerts';
import {Checkbox, Radio,RadioGroup}
        from 'react-icheck';

class Workflow extends Component{
    constructor(props){
      super(props);
      this.baseUrl = this.props.baseUrl;

      this.state = {
        wfLists : null,
        stepsHtml : "",
        disabledDD: true,
        workflowId : '-1',
        stepOrder : '-1',
        showNoEligible: 'hide',
        showWorkflow  : 'hide',
        showTemploading : 'show'
      };

      // preserve the initial state in a new object
      this.baseState = this.state;
    }
    wfLoadList(){
      let lists = [];
      //https://test.bridgemailsystem.com/pms/io/workflow/getWorkflowData/?BMS_REQ_TK=VsihjNdZZgcxRCT6bhKuQIuA6vZGgY&type=get&isManualAdditio
      //https://test.bridgemailsystem.com/pms/io/workflow/getWorkflowData/?BMS_REQ_TK=VsihjNdZZgcxRCT6bhKuQIuA6vZGgY&type=get&isManualAddition=Y
      var Url = this.baseUrl
                      +'/io/workflow/getWorkflowData/?BMS_REQ_TK='
                      + this.props.users_details[0].bmsToken +'&type=get&isManualAddition=Y&isMobileLogin=Y&userId='+this.props.users_details[0].userId

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

                  if(parseInt(jsonResponse.totalCount) > 0){
                    console.log('Workflow list : ',jsonResponse);
                    this.setState({
                      wfLists : jsonResponse.workflows
                    });
                    this.wfAddedList();
                  }
                }
              });
    }
    setStateDefault(){
      this.setState(this.baseState);
      jQuery('.workflow_wrap_rendering').parents('.addBox_wrapper_container').find('.scfe_save_wrap').removeClass('mkbtemphide hide');
    }
    wfAddedList(){
      //https://test.bridgemailsystem.com/pms/io/workflow/getWorkflowData/?BMS_REQ_TK=VsihjNdZZgcxRCT6bhKuQIuA6vZGgY&type=getManualAdditionWF&subscriberNumber=kzaqwSj26Jj17He20Fb21Ob30Qa33Ja26Bb17kvgGu
      let self = this;
      var Url = this.baseUrl
                      +'/io/workflow/getWorkflowData/?BMS_REQ_TK='
                      + this.props.users_details[0].bmsToken +'&type=getManualAdditionWF&isMobileLogin=Y&userId='+this.props.users_details[0].userId+'&subscriberNumber='+ this.props.contact.subNum

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

                  if(parseInt(jsonResponse.totalCount) > 0){
                    console.log('Workflow Added list : ',jsonResponse);
                    let workflows = jsonResponse.workflows;
                    console.log(this.state.wfLists);
                    if(this.state.wfLists.length === workflows.length){
                      jQuery('.workflow_wrap_rendering').parents('.addBox_wrapper_container').find('.scfe_save_wrap').addClass('mkbtemphide hide');
                      this.setState({
                        showNoEligible : 'show',
                        showWorkflow   : 'hide',
                        showTemploading : 'hide'
                      })
                    }else{
                      workflows.forEach((item) => {
                        console.log(item);
                        jQuery('#first_wf_drop_down option[data-checksum='+item["workflow.checksum"]+']').addClass('hide');
                      });
                      this.setState({
                        showWorkflow : 'show',
                        showTemploading : 'hide'
                      })
                    }

                  }else{
                    this.setState({
                      showWorkflow : 'show',
                      showTemploading : 'hide'
                    })
                  }
                }
              });
    }
    generateFirstDropDown(){
      const ListItems = this.state.wfLists.map((list,key) =>
                    <option data-checksum={list['workflow.checksum']} key={key} value={list.name}>{list.name}</option>
        );
      setTimeout(function(){
        jQuery('.workflow_wrap_rendering .icheckbox_square-blue').eq(0).trigger('click');
      },100);
      return ListItems;
    }
    generateSteps(steps){

      /*
        const stepsHtmlC = steps.map((list,key) =>
                        <option key={key} value={list.stepOrder}>{list.stepOrder}</option>
          );
          */
          const stepsHtmlC = steps.map((list,key) =>
          {
            if(list.label){
              return (<option key={key} value={list.stepOrder}>{list.label}</option>)
            }else{
              return (<option key={key} value={list.stepOrder}>{"Step "+list.stepOrder}</option>)
            }
          });
            this.setState({
              stepsHtml : stepsHtmlC
            })
    }
    firstChangeDropDown(event){
      console.log(event.target.value);
      if(event.target.value!="-1"){
        let checksumValue = event.target.options[event.target.selectedIndex].getAttribute("data-checksum");
        let obj = this.state.wfLists.find(x => x['workflow.checksum'] === checksumValue); //  finding object in wfList
        this.state['workflowId'] = obj['workflow.encode'];

        this.generateSteps(obj.steps);
        this.setState({disabledDD : false})
      }else{
        this.setState({disabledDD : true})
      }

    }
    stepsChangeDropDown(event){
      console.log(event.target.value);
      if(event.target.value != "-1"){
        this.state['stepOrder'] = event.target.value;
      }else{
        alert('No Step Selected');
      }
    }
    saveWorkFlow(){
      if(jQuery('.workflow_wrap_rendering .icheckbox_square-blue.checked').length == 0){
          ErrorAlert({message : "Atleast one checkbox must be selected"});
          return;
      }
      this.props.parentProps.toggleLoadingMask("Saving Workflow");
      //https://test.bridgemailsystem.com/pms/io/workflow/saveWorkflowData/?BMS_REQ_TK=VsihjNdZZgcxRCT6bhKuQIuA6vZGgY&type=addtoworkflow
      request.post(this.baseUrl+'/io/workflow/saveWorkflowData/?BMS_REQ_TK='+this.props.users_details[0].bmsToken+'&type=addtoworkflow')
             .set('Content-Type', 'application/x-www-form-urlencoded')
             .send({
                  "workflowId" : this.state.workflowId,
                  "stepOrder"  : "1",
                  "overrideRules"  : document.querySelector('.checked input[name=radio]:checked').value,
                  "subscriberId" : this.props.contact.subNum,
                  "isMobileLogin" : "Y",
                  "userId" : this.props.users_details[0].userId

                  })
                 .then((res) => {
                    console.log(res.status);
                    var jsonResponse =  JSON.parse(res.text);
                    console.log(jsonResponse);
                    if(jsonResponse[0]=="err"){
                      ErrorAlert({message : jsonResponse[1]});
                    }
                    else{
                      this.setState(this.baseState);
                      //this.loadLists();
                      //this.props.parentProps.toggleLoadingMask();
                      this.props.showToWorkFlow();
                      SuccessAlert({message:"Contact added to sequence successfully."});
                    }
                    this.props.parentProps.toggleLoadingMask();
                  });
    }
    render(){
      if(!this.state.wfLists){
        return(

          <div id="NoContact" className="tabcontent mksph_cardbox">

                  <p className="not-found">Loading...</p>
              </div>
        )
      }
      return(
        <div>
        <div id="NoContact" className={`tabcontent mksph_cardbox ${this.state.showNoEligible}`}>

                  <p className="not-found" style={{color:"#016efd"}}>No eligible sequence found</p>
        </div>

        <div id="NoContact" className={`tabcontent mksph_cardbox ${this.state.showTemploading}`}>

                <p className="not-found">Loading...</p>
            </div>
        <div className={`Rendering workflow_wrap_rendering ${this.state.showWorkflow}`}>
          <h4>Choose sequence to manually add subscriber </h4>
            <select id="first_wf_drop_down" onChange={this.firstChangeDropDown.bind(this)}>
              <option value="-1">Select Sequence...</option>
              {this.generateFirstDropDown()}
            </select>
            <h4 className="hide">Choose Steps </h4>
            <select onChange={this.stepsChangeDropDown.bind(this)} disabled={this.state.disabledDD} className={`hide`}>
                <option value="-1">Select Steps...</option>

            </select>

            <h4>Override Sequence Rules:</h4>
              <RadioGroup name="radio">
              <Radio
                name="aa"
                radioClass="icheckbox_square-blue"
                increaseArea="20%"
                value="N"
                label="Allow rules to take over after this step"
                defaultChecked="checked"
                ref={"enhancedSwitch"}
              />
              <br/>
              <Radio
                name="aa"
                radioClass="icheckbox_square-blue"
                increaseArea="20%"
                value="Y"
                label="Play sequence to completion with interruption"
                ref={"enhancedSwitch"}
              />
              </RadioGroup>
        </div>
      </div>
      )
    }
}


export default Workflow;
