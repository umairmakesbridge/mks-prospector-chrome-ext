import React,{Component}
       from 'react';
import request
       from 'superagent';
import {encodeHTML,decodeHTML}
       from '../../common/Encode_Method';
import ToggleDisplay
       from 'react-toggle-display';
import AddBox
       from '../../common/Add_Box';


class Tasks extends Component{
  constructor(props){
    super(props);
    this.users_details = this.props.users_details;
    this.baseUrl = this.props.baseUrl;
    this.state = {
      showLabel : true,
      showAddBox : false
    }
  }
  showAddTasks(){
    let height = jQuery('.makesbridge_plugin').height();
    this.setState({showAddBox : true,overlayHeight:height});
    setTimeout(function(){
        jQuery('.focusThis').focus();
    },500)
  }
  createTasks(){
    alert('Create Callback of Tasks');
  }
  hideAddCus(){
this.setState({showAddBox : false});
  }

  render(){
    if(!this.props.tasks){
      return (<div style={{position: "relative"}}>
                <ToggleDisplay show={this.state.showAddBox}>
                    <AddBox ref="addboxView"
                            showTitle={"Add New Custom Field"}
                            addFieldsObj={ [
                              {
                                type:"li",
                                className:"mks_ecc_wrap",
                                stateType : "tasktype",
                                value : [
                                  {name : "ecc", className:"mks_ecc_email", id: "email",placeholder:"Email"},
                                  {name : "ecc", className:"mks_ecc_call active", id: "call",placeholder:"Call"},
                                  {name : "ecc", className:"mks_ecc_custom", id: "custom",placeholder:"Custom"}
                                ]
                              },
                              {name : "ckey", className:"focusThis", required:'required', id: "ckey",placeholder:"Enter task subject *"},
                              {type:"date",name : "cvlaue", className:"", id: "cvalue",placeholder:"Select date"},
                              {
                                type:"li",
                                className:"mks_priorty_wrap",
                                stateType : "priority",
                                value : [
                                  {name : "priority", className:"mks_priotiry_low", id: "low",placeholder:"Low"},
                                  {name : "priority", className:"mks_priotiry_normal active", id: "normal",placeholder:"Normal"},
                                  {name : "priority", className:"mks_priotiry_high", id: "high",placeholder:"High"}
                                ]
                              },
                              {type:"textarea", className:"",id:"notes" , placeholder:"Add notes about your task here"}

                            ] }
                            boxType={"customFields"}
                            create={this.createTasks.bind(this)}
                            cancel={this.hideAddCus.bind(this)}
                    />

                    <div className="OverLay" style={{height : (this.state.overlayHeight+"px" )}}></div>

              </ToggleDisplay>
                  <span style={{right : "0px"}} className={`mkb_btn mkb_cf_btn pull-right mkb_greenbtn addCF ${this.state.showLabel}`} onClick={this.showAddTasks.bind(this) }>Add New</span>
                  <p className="not-found">No tasks found.</p>
                  <div className="content-wrapper" >
                      <div className="contact_found mks_tasks_lists_user" style={{padding : "10px 12px 0"}}>
                        <div className="cf_silhouette">
                          <div className="cf_silhouette_text c_txt_s c_txt_s_blue">
                            <i className="mksicon-Mail mks-task-icons"></i>
                        </div>
                      </div>
                      <div className="cf_email_wrap">
                        <div className="cf_email">
                          <p>Urgent call</p>
                          <span className="ckvwicon">
                            09:30 AM
                          </span>
                        </div>
                        <div className="cf_task_right">
                            <span className="mks_priority_icon mks_priority_high pclr19">
                                  <i className="mksicon-More"></i>
                            </span>
                            <span className="mkb_btn mkb_cf_btn pull-right mkb_greenbtn addCF show mkb_task_compBtn" style={{"top": "13px","right": "0"}}>
                              <i className="mksicon-Check"></i>
                              Complete</span>
                        </div>
                      </div>
                      <div className="clr"></div>
                        <div className="mks_task_edit_delete_wrap">
                            <div className="cf_silhouette">
                              <div className="cf_silhouette_text c_txt_s c_txt_s_blue">
                                <i className="mksicon-Edit mks-task-icons"></i>
                            </div>
                          </div>
                        </div>
                    </div>
              </div>
                  </div>)
    }
    return (
      <div>Tasks Component Here</div>
    )
  }
}

export default Tasks;
