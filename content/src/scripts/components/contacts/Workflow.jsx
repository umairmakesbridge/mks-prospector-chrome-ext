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
        showDropDown: 'hide'
      };

      // preserve the initial state in a new object
      this.baseState = this.state;
    }
    wfLoadList(){
      let lists = [];
      //https://test.bridgemailsystem.com/pms/io/workflow/getWorkflowData/?BMS_REQ_TK=QLiMU4FG6cvgh4O3GWrDnHA8mSb2qx&type=get&isMobileLogin=Y&userId=umair
      var Url = this.baseUrl
                      +'/io/workflow/getWorkflowData/?BMS_REQ_TK='
                      + this.props.users_details[0].bmsToken +'&type=get&isMobileLogin=Y&userId='+this.props.users_details[0].userId

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
                    debugger;
                  }
                }
              });
    }
    generateFirstDropDown(){
      const ListItems = this.state.wfLists.map((list,key) =>
                    <option data-checksum={list['workflow.checksum']} key={key} value={list.name}>{list.name}</option>
        );

      return ListItems;
    }
    generateSteps(steps){
        const stepsHtmlC = steps.map((list,key) =>
                        <option key={key} value={list.stepOrder}>{list.stepOrder}</option>
          );
          this.setState({
            stepsHtml : stepsHtmlC
          })

    }
    firstChangeDropDown(event){
      console.log(event.target.value);
      if(event.target.value!="-1"){
        let checksumValue = event.target.options[event.target.selectedIndex].getAttribute("data-checksum");
        let obj = this.state.wfLists.find(x => x['workflow.checksum'] === checksumValue);
        this.state['workflowId'] = obj['workflow.encode'];
        this.generateSteps(obj.steps)
        this.setState({showDropDown : 'show'})
      }else{
        this.setState({showDropDown : 'hide'})
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
      //https://test.bridgemailsystem.com/pms/io/workflow/saveWorkflowData/?BMS_REQ_TK=VsihjNdZZgcxRCT6bhKuQIuA6vZGgY&type=addtoworkflow
      request.post(this.baseUrl+'/io/workflow/saveWorkflowData/?BMS_REQ_TK='+this.props.users_details[0].bmsToken+'&type=addtoworkflow')
             .set('Content-Type', 'application/x-www-form-urlencoded')
             .send({
                  "workflowId" : this.state.workflowId,
                  "stepOrder"  : this.state.stepOrder,
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
                      //this.setState(this.baseState);
                      //this.props.manageContactToList();
                      //this.loadLists();
                      //this.props.parentProps.toggleLoadingMask();
                      SuccessAlert({message:"Contact added to Workflow successfully."});
                    }
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
        <div className="Rendering">
            <select onChange={this.firstChangeDropDown.bind(this)}>
              <option value="-1">Select...</option>
              {this.generateFirstDropDown()}
            </select>
            <select onChange={this.stepsChangeDropDown.bind(this)} className={`${this.state.showDropDown}`}>
                <option value="-1">Steps</option>
                {this.state.stepsHtml}
            </select>

            <h4>Override Workflow Rules:</h4>
              <RadioGroup name="radio">
              <Radio
                name="aa"
                radioClass="icheckbox_square-blue"
                increaseArea="20%"
                value="N"
                label="Add at selected step only"
              />
              <br/>
              <Radio
                name="aa"
                radioClass="icheckbox_square-blue"
                increaseArea="20%"
                value="Y"
                label="play workflow to completion without interruption"
              />
              </RadioGroup>
        </div>
      )
    }
}


export default Workflow;
