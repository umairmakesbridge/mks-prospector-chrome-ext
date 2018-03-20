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
                              }
                            ] }
                            boxType={"customFields"}
                            create={this.createTasks.bind(this)}
                            cancel={this.hideAddCus.bind(this)}
                    />
                    <div className="OverLay" style={{height : (this.state.overlayHeight+"px" )}}></div>
              </ToggleDisplay>
                  <span style={{right : "0px"}} className={`mkb_btn mkb_cf_btn pull-right mkb_greenbtn addCF ${this.state.showLabel}`} onClick={this.showAddTasks.bind(this) }>Add New</span>
                  <p className="not-found">No tasks found.</p>

                  </div>)
    }
    return (
      <div>Tasks Component Here</div>
    )
  }
}

export default Tasks;
