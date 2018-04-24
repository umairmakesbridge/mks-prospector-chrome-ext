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
import LoadingMask
      from '../../common/Loading_Mask';
import {ErrorAlert,SuccessAlert}
      from '../../common/Alerts';
import Moment
       from 'moment';

class Tasks extends Component{
  constructor(props){
    super(props);
    this.users_details = this.props.users_details;
    this.baseUrl = this.props.baseUrl;
    this.state = {
      showLabel : true,
      showAddBox : false,
      showLoading : false,
      showEditAddBox : false,
       collapseExpand : 'expand',
        collapseMsg : 'Click to expand',
        showCollapse : '',
      tasks : "",
      loadingMessage : "",
      showLoading : false,
      showExpandCollapse : 'hide'
    }
    this.mapicons ={
      "email" : "mksicon-Mail",
      "Lunch" : "mksicon-Lunch",
      "Discovery" : "mksicon-Discovery",
      "call" : "mksicon-Phone",
      "email" : "mksicon-Mail",
      "Breakfast" : "mksicon-Breakfast",
      "Meeting" : "mksicon-Meeting",
      "Proposal" : "mksicon-Proposal",
      "Demo"  : "mksicon-Demo"
    }
    this.priorityIcons = {
      "low" : {"topClass":"mks_priority_low pclr9","icon" : "mksicon-Triangle_Down"},
      "high" : {"topClass":"mks_priority_high pclr12","icon" : "mksicon-Triangle_Up"},
      "medium" : {"topClass":"mks_priority_medium pclr19","icon" : "mksicon-More"}
    }
  }
  showAddTasks(){
    let height = jQuery('.makesbridge_plugin').height();
    this.setState({showAddBox : true,overlayHeight:height});
    setTimeout(function(){
        jQuery('.focusThis').focus();
    },500)
  }
  createTasks(object){
    var reqObj = {
      type: "add",
      subNum: this.props.contact.subNum,
      tasktype: object.tasktype,
      name: object.input2,
      taskDate: object.startDate.format("MM-DD-YYYY") + " " + object.times+":00",
      priority: object.priority.toLowerCase(),
      notes: object.tasktype,
      ukey:this.props.users_details[0].userKey,
      isMobileLogin:'Y',
      userId:this.props.users_details[0].userId
    };

      debugger;
    //https://test.bridgemailsystem.com/pms/io/subscriber/subscriberTasks/?BMS_REQ_TK=teJfgUi3XxStW71TjoC59TptuQRwST
    request.post(this.baseUrl+'/io/subscriber/subscriberTasks/?BMS_REQ_TK='+this.users_details[0].bmsToken)
       .set('Content-Type', 'application/x-www-form-urlencoded')
       .send(reqObj)
       .then((res) => {
          console.log(res.status);
          var jsonResponse =  JSON.parse(res.text);
          console.log(jsonResponse);
          debugger;
          if(jsonResponse.success){
            this.setState({
              disabled    : false,
              showLoading : false
            })
              this.refs.addboxView.setDefaultState();
              SuccessAlert({message:"Task created successfully."});
            //this.props.contact['company'] = this.state.company;
            //this.props.updateContactHappened();
            //this.props.getSubscriberDetails();
            this.getTaskList()
            this.hideAddCus()
          }else{
            this.refs.addboxView.setDisableFalse()
            ErrorAlert({message : jsonResponse[1]});
          }
        });
  }
  componentWillMount(){
    this.getTaskList();
  }
  hideAddCus(){
      this.setState({showAddBox : false});
  }
  deleteTask(obj){
    var r = confirm('Are you sure you want to delete this task?');
    if(r){
      /*https://test.bridgemailsystem.com/pms/io/subscriber/subscriberTasks/?BMS_REQ_TK=teJfgUi3XxStW71TjoC59TptuQRwST

        Request Params
        subNum: “jbGs21Ru30Yy33Jq26Cs17Ly20Jv21jd"
        type: “delete”
        taskId : "encodedtaskid1,encodedtaskid2, encodedtaskid3"
        */
        debugger;
        this.setState({
          showLoading : true,
          loadingMessage : 'Deleting Task...'
        });
        var reqObj = {
          type: "delete",
          subNum: this.props.contact.subNum,
          taskId : obj['taskId.encode'],
          ukey:this.props.users_details[0].userKey,
          isMobileLogin:'Y',
          userId:this.props.users_details[0].userId
        }
        request.post(this.baseUrl+'/io/subscriber/subscriberTasks/?BMS_REQ_TK='+this.users_details[0].bmsToken)
           .set('Content-Type', 'application/x-www-form-urlencoded')
           .send(reqObj)
           .then((res) => {
              console.log(res.status);
              var jsonResponse =  JSON.parse(res.text);
              console.log(jsonResponse);
              this.setState({
                showLoading : false
              });
              if(jsonResponse[0] == "err"){
                if(jsonResponse[1]=="SESSION_EXPIRED"){
                    ErrorAlert({message:jsonResponse[1]});
                    jQuery('.mksph_logout').trigger('click');

                }else{
                    ErrorAlert({message:jsonResponse[1]});
                }

                return false;
              }
              SuccessAlert({message:"Task deleted successfully."});
            });
    }
  }
  getTaskList(){
    // https://test.bridgemailsystem.com/pms/io/subscriber/subscriberTasks/?BMS_REQ_TK=teJfgUi3XxStW71TjoC59TptuQRwST&type=getTasks&subNum=qcWRf30Sd33Ph26Fg17Db20If21Pd30Sd33qDF&fromDate=2018-04-01&toDate=2018-04-13&orderBy=creationTime&order=asc&offset=0&bucket=20
    var reqObj = {
      type: "getTasks",
      subNum: this.props.contact.subNum,
      fromDate: Moment().format("MM-DD-YYYY"), //"2018-04-01",
      toDate:"04-30-2018",
      orderBy : "updationTime",
      order: "desc",
      offset : 0,
      bucket : 20,
      ukey:this.props.users_details[0].userKey,
      isMobileLogin:'Y',
      userId:this.props.users_details[0].userId
    };

    request.post(this.baseUrl+'/io/subscriber/subscriberTasks/?BMS_REQ_TK='+this.users_details[0].bmsToken)
       .set('Content-Type', 'application/x-www-form-urlencoded')
       .send(reqObj)
       .then((res) => {
          console.log(res.status);
          var jsonResponse =  JSON.parse(res.text);
          console.log(jsonResponse);

          if(parseInt(jsonResponse.totalCount) > 0){
            this.setState({
              tasks : jsonResponse.taskList

            })
              //this.refs.addboxView.setDefaultState();
              //SuccessAlert({message:"Task created successfully."});
            //this.props.contact['company'] = this.state.company;
            //this.props.updateContactHappened();
            //this.props.getSubscriberDetails();
            //this.hideAddCus()
          }else{
            console.log("No Tasks found");
          }
        });
  }
  generateDate(dateString){
    var _date = Moment(decodeHTML(dateString),'YYYY-M-D H:m');
    var format = {date: _date.format("DD MMM YYYY"), time: _date.format("hh:mm A")};
    return format.date +" "+ format.time;
  }
  generateTasksList(){
  return this.state.tasks.map((task,key) => {
      if(key == 3){
        this.state['showExpandCollapse'] = 'show';
      }
      return (
      <div key={key} className={`contact_found mks_tasks_lists_user task_status_${task.status}`} style={{padding : "10px 12px 0"}}>
        <div className="cf_silhouette">
          <div className="cf_silhouette_text c_txt_s c_txt_s_blue">
            <i className={`${this.mapicons[task.taskType]} mks-task-icons`}></i>
        </div>
      </div>
      <div className="cf_email_wrap">
        <div className="cf_email">
          <p>{task.taskName}</p>
          <span className="ckvwicon">
            {this.generateDate(task.taskDate)}
          </span>
        </div>
        <div className="cf_task_right">
            <span className={`mks_priority_icon ${this.priorityIcons[task.priority]["topClass"]}`}>
                  <i className={`${this.priorityIcons[task.priority]["icon"]}`}></i>
            </span>
            <span className="mkb_btn mkb_cf_btn pull-right mkb_greenbtn addCF show mkb_task_compBtn" onClick={this.updateTasks.bind(this,task,true)} style={{"top": "13px","right": "0"}}>
              <i className="mksicon-Check"></i>
              Complete</span>

            <span className="mkb_tast_completed_btn mkb_btn mkb_cf_btn pull-right mkb_greenbtn addCF mkb_task_compBtn" style={{"top": "13px","right": "0"}}>
                Completed</span>

        </div>
      </div>
      <div className="clr"></div>
        <div className="mks_task_edit_delete_wrap" onClick={this.editTask.bind(this,task)}>
            <div className="cf_silhouette">
              <div className="cf_silhouette_text c_txt_s c_txt_s_blue">
                <i className="mksicon-Edit mks-task-icons"></i>
            </div>
          </div>
        </div>
        <div className="mks_task_edit_delete_wrap" onClick={this.deleteTask.bind(this,task)} style={{"left": "37px","width": "8%","background": "transparent"}}>
            <div className="cf_silhouette">
              <div className="cf_silhouette_text c_txt_s c_txt_s_blue">
                <i className="mksicon-Delete mks-task-icons"></i>
            </div>
          </div>
        </div>
    </div>)
    });
  }
  editTask (task){
    this.setState({
      showAddBox : true
    });
    this.refs.addboxView.editTaskForm(task)
    debugger;
  }
  updateTasks(taskObj,isComplete){
      console.log(taskObj);
      if(isComplete){
        this.setState({
          showLoading : true
        })
      }
      var reqObj = {
        type: (isComplete) ? "complete" : "update",
        subNum: this.props.contact.subNum,
        taskId :  (taskObj.taskId) ? taskObj.taskId : taskObj['taskId.encode'],
        tasktype: taskObj.tasktype,
        name: taskObj.input2,
        taskDate: taskObj.selectedDay,
        priority: taskObj.priority,
        notes: taskObj.tasktype,
        ukey:this.props.users_details[0].userKey,
        isMobileLogin:'Y',
        userId:this.props.users_details[0].userId
      };
      request.post(this.baseUrl+'/io/subscriber/subscriberTasks/?BMS_REQ_TK='+this.users_details[0].bmsToken)
         .set('Content-Type', 'application/x-www-form-urlencoded')
         .send(reqObj)
         .then((res) => {
            console.log(res.status);
            var jsonResponse =  JSON.parse(res.text);
            console.log(jsonResponse);
            debugger;
            if(jsonResponse.success){
              this.setState({
                disabled    : false,
                showLoading : false
              })
                if(isComplete){
                  SuccessAlert({message:"Task mark completed successfully."});
                }else{
                  this.refs.addboxView.setDefaultState();
                  SuccessAlert({message:"Task updated successfully."});
                  this.hideAddCus()
                }

              //this.props.contact['company'] = this.state.company;
              //this.props.updateContactHappened();
              //this.props.getSubscriberDetails();
              this.getTaskList()

            }else{
              this.refs.addboxView.setDisableFalse()
              ErrorAlert({message : jsonResponse[1]});
            }
          });
  }
  toggleHeight(){
    if(this.state.setFullHeight){
      this.setState({setFullHeight : '',collapseMsg: 'Click to expand',collapseExpand:'expand'});
    }else{
      this.setState({setFullHeight : 'heighAuto',collapseMsg: 'Click to collapse',collapseExpand:'collapse'});
    }
  }

  render(){
    if(!this.state.tasks){
      return (<div style={{position: "relative"}}>

                <ToggleDisplay show={this.state.showAddBox}>
                  <LoadingMask message={'Creating new task...'} showLoading={this.state.showLoading} />
                    <AddBox ref="addboxView"
                            showTitle={"Add New Custom Field"}
                            addFieldsObj={ [
                              {
                                type:"li",
                                className:"mks_ecc_wrap",
                                stateType : "tasktype",
                                defaultValue : "call",
                                value : [
                                  {name : "ecc", className:"mks_ecc_firsttouch", id: "FirstTouch",value:"first_touch",placeholder:"<span class='mksicon-First-Touch'></span>",tooltip : true},
                                  {name : "ecc", className:"mks_ecc_demo", id:"Demo",value:"demo",placeholder:"<span class='mksicon-Demo'></span>",tooltip : true},
                                  {name : "ecc", className:"mks_ecc_discovery", id: "Discovery",value:"discovery",placeholder:"<span class='mksicon-Discovery'></span>",tooltip : true},
                                  {name : "ecc", className:"mks_ecc_call active", id: "call",value:"call",placeholder:"<span class='mksicon-Phone'></span>",tooltip : true},
                                  {name : "ecc", className:"mks_ecc_email", id: "email",value:"email",placeholder:"<span class='mksicon-Mail'></span>",tooltip : true},
                                  {name : "ecc", className:"mks_ecc_lunch", id: "Lunch",value:"lunch",placeholder:"<span class='mksicon-Lunch'></span>",tooltip : true},
                                  {name : "ecc", className:"mks_ecc_breakfast", id: "Breakfast",value:"breakfast",placeholder:"<span class='mksicon-Breakfast'></span>",tooltip : true},
                                  {name : "ecc", className:"mks_ecc_meeting", id: "Meeting",value:"meeting",placeholder:"<span class='mksicon-Meeting'></span>",tooltip : true},
                                  {name : "ecc", className:"mks_ecc_proposal", id: "Proposal",value:"proposal",placeholder:"<span class='mksicon-Proposal'></span>",tooltip : true}
                                ]
                              },
                              {name : "ckey", className:"focusThis", required:'required', id: "ckey",placeholder:"Enter task subject *"},
                              {type:"date",name : "cvlaue", className:"", id: "cvalue",placeholder:"Select date"},
                              {
                                type:"li",
                                className:"mks_priorty_wrap",
                                stateType : "priority",
                                defaultValue : "medium",
                                value : [
                                  {name : "priority", className:"mks_priotiry_low", id: "low",placeholder:"Low"},
                                  {name : "priority", className:"mks_priotiry_medium active", id: "medium",placeholder:"Medium"},
                                  {name : "priority", className:"mks_priotiry_high", id: "high",placeholder:"High"}
                                ]
                              },
                              {type:"textarea", className:"",id:"notes" , placeholder:"Add notes about your task here"}

                            ] }
                            boxType={"mks_tasksFields"}
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
      <div style={{position: "relative"}}>
        <ToggleDisplay show={this.state.showAddBox}>
        <LoadingMask message={'Creating new task...'} showLoading={this.state.showLoading} />
          <AddBox ref="addboxView"
                  showTitle={"Create New Task"}
                  addFieldsObj={ [
                    {
                      type:"li",
                      className:"mks_ecc_wrap",
                      stateType : "tasktype",
                      defaultValue : "call",
                      value : [
                        {name : "ecc", className:"mks_ecc_firsttouch", id: "FirstTouch",value:"first_touch",placeholder:"<span class='mksicon-First-Touch'></span>",tooltip : true},
                        {name : "ecc", className:"mks_ecc_demo", id:"Demo",value:"demo",placeholder:"<span class='mksicon-Demo'></span>",tooltip : true},
                        {name : "ecc", className:"mks_ecc_discovery", id: "Discovery",value:"discovery",placeholder:"<span class='mksicon-Discovery'></span>",tooltip : true},
                        {name : "ecc", className:"mks_ecc_call active", id: "call",value:"call",placeholder:"<span class='mksicon-Phone'></span>",tooltip : true},
                        {name : "ecc", className:"mks_ecc_email", id: "email",value:"email",placeholder:"<span class='mksicon-Mail'></span>",tooltip : true},
                        {name : "ecc", className:"mks_ecc_lunch", id: "Lunch",value:"lunch",placeholder:"<span class='mksicon-Lunch'></span>",tooltip : true},
                        {name : "ecc", className:"mks_ecc_breakfast", id: "Breakfast",value:"breakfast",placeholder:"<span class='mksicon-Breakfast'></span>",tooltip : true},
                        {name : "ecc", className:"mks_ecc_meeting", id: "Meeting",value:"meeting",placeholder:"<span class='mksicon-Meeting'></span>",tooltip : true},
                        {name : "ecc", className:"mks_ecc_proposal", id: "Proposal",value:"proposal",placeholder:"<span class='mksicon-Proposal'></span>",tooltip : true}
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
                        {name : "priority", className:"mks_priotiry_medium active", id: "medium",placeholder:"Medium"},
                        {name : "priority", className:"mks_priotiry_high", id: "high",placeholder:"High"}
                      ]
                    },
                    {type:"textarea", className:"",id:"notes" , placeholder:"Add notes about your task here"}

                  ] }
                  boxType={"mks_tasksFields"}
                  create={this.createTasks.bind(this)}
                  update={this.updateTasks.bind(this)}
                  cancel={this.hideAddCus.bind(this)}
          />

          <div className="OverLay" style={{height : (this.state.overlayHeight+"px" )}}></div>

    </ToggleDisplay>
    <span style={{right : "0px","top" : "-38px"}} className={`mkb_btn mkb_cf_btn pull-right mkb_greenbtn addCF ${this.state.showLabel}`} onClick={this.showAddTasks.bind(this) }>Add New</span>
    <div style={{"position" : "relative"}} className={`content-wrapper height90 height210 ${this.state.setFullHeight}`} >
          <LoadingMask message={this.state.loadingMessage} showLoading={this.state.showLoading}/>
          {this.generateTasksList()}
    </div>
    <div className={`${this.state.collapseExpand} ${this.state.showCollapse} ${this.state.showExpandCollapse}`} onClick={this.toggleHeight.bind(this)}>
      <span>{this.state.collapseMsg}</span>
      <span className="mksicon-ArrowNext"></span>
    </div>


  </div>
    )
  }
}

export default Tasks;
