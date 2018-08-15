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
import ReactTooltip
       from 'react-tooltip';
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
      showExpandCollapse : 'hide',
      sortTasks:'-1',
      showLoadingMsg : 'false',
      showLoadingButton : 'false',
      showHideCollapse : '',
      nextOffset : 0,
      toggleDDandAddBtn: '',
      taskAssign : []
    }
    this.mapicons ={
      "email" : "mksicon-Mail",
      "lunch" : "mksicon-Lunch",
      "discovery" : "mksicon-Discovery",
      "call" : "mksicon-Phone",
      "email" : "mksicon-Mail",
      "breakfast" : "mksicon-Breakfast",
      "meeting" : "mksicon-Meeting",
      "proposal" : "mksicon-Proposal",
      "demo"  : "mksicon-Demo",
      "first_touch":"mksicon-First-Touch",
      "webSeminarInvite" : "mksicon-Web_Seminar_Invite",
      "connect" : "mksicon-Connect",
      "introduction" : "mksicon-Shake_hands",
      "firstMessage" : "mksicon-First_Message",
      "secondMessage" : "mksicon-Second_Message",
      "thirdMessage"  : "mksicon-Third_Message",
      "pdf" : "mksicon-PDF",
      "inviteToGroup" : "mksicon-Invite_to_Group"
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
    this.refs.addboxView.defaultAddTaskDialog();
    setTimeout(function(){
        jQuery('.focusThis').focus();
    },500)
  }
  createTasks(object){

    var reqObj = {
      type: "add",
      subNum: this.props.contact.subNum,
      tasktype: object.tasktype,
      name: object.input3,
      taskDate: object.startDate.format("MM-DD-YYYY") + " " +  Moment(object.times, ["h:mm A"]).format("HH:mm")+":00",
      priority: object.priority.toLowerCase(),
      notes: object.notes,
      ukey:this.props.users_details[0].userKey,
      isMobileLogin:'Y',
      userId:this.props.users_details[0].userId
    };
    //https://test.bridgemailsystem.com/pms/io/subscriber/subscriberTasks/?BMS_REQ_TK=teJfgUi3XxStW71TjoC59TptuQRwST
    request.post(this.baseUrl+'/io/subscriber/subscriberTasks/?BMS_REQ_TK='+this.users_details[0].bmsToken)
       .set('Content-Type', 'application/x-www-form-urlencoded')
       .send(reqObj)
       .then((res) => {
          console.log(res.status);
          var jsonResponse =  JSON.parse(res.text);
          console.log(jsonResponse);
          if(jsonResponse.success){
            this.setState({
              disabled    : false,
              showLoading : false,
              nextOffset  : 0,
              taskAssign  : []
            });
            if(this.state.setFullHeight){
              this.toggleHeight();
            }
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
  toggleTasksContent(){
    if(this.state.toggleTasks){
      this.setState({
        toggleTasks : '',
        showHideCollapse : '',
        toggleDDandAddBtn : ''
      })
    }else{
      this.setState({
        toggleTasks : 'tasks-content-hide',
        showHideCollapse : 'hide',
        toggleDDandAddBtn : 'hide'
      })
    }

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
              this.setState({nextOffset : 0})
              this.getTaskList()
            });
    }
  }
  getTaskList(loadMore){
    if(loadMore){
      this.setState({
        showLoadingMsg : true,
        showLoadingButton : 'hide'
      })
    }
    // https://test.bridgemailsystem.com/pms/io/subscriber/subscriberTasks/?BMS_REQ_TK=teJfgUi3XxStW71TjoC59TptuQRwST&type=getTasks&subNum=qcWRf30Sd33Ph26Fg17Db20If21Pd30Sd33qDF&fromDate=2018-04-01&toDate=2018-04-13&orderBy=creationTime&order=asc&offset=0&bucket=20
    var reqObj = {
      type: "getTasks",
      subNum: this.props.contact.subNum,
      //fromDate: "03-01-2018", //"2018-04-01",
      //toDate: Moment().add('days', 30).format('MM-DD-YYYY'),
      orderBy : "updationTime",
      order: "desc",
      offset : this.state.nextOffset,
      bucket : 20,
      ukey:this.props.users_details[0].userKey,
      isMobileLogin:'Y',
      userId:this.props.users_details[0].userId
    };
    if(this.state.sortTasks!=="-1"){
      if(this.state.sortTasks=='low' || this.state.sortTasks=='medium' || this.state.sortTasks=='high'){
        reqObj["sortType"] = 'priority';
        reqObj["sortBy"] = this.state.sortTasks;
      }
      else{
        reqObj["sortType"] = 'taskTypeSingle';
        reqObj["sortBy"] = this.state.sortTasks;
      }
    }

    request.post(this.baseUrl+'/io/subscriber/subscriberTasks/?BMS_REQ_TK='+this.users_details[0].bmsToken)
       .set('Content-Type', 'application/x-www-form-urlencoded')
       .send(reqObj)
       .then((res) => {
          console.log(res.status);
          var jsonResponse =  JSON.parse(res.text);
          console.log(jsonResponse);

          if(parseInt(jsonResponse.totalCount) > 0){
            let taskAssign=(loadMore) ? this.state.taskAssign : [];
            $.each(jsonResponse.taskList,function(key,value){
              taskAssign.push(value);
            });
            this.setState({
              tasks : taskAssign,
              taskAssign : taskAssign,
              showLoadingButton : (parseInt(jsonResponse.nextOffset) == -1) ? 'hide' : 'show',
              nextOffset :  (parseInt(jsonResponse.nextOffset) == -1) ? 0 : jsonResponse.nextOffset,
              showLoadingMsg : false
            })
              //this.refs.addboxView.setDefaultState();
              //SuccessAlert({message:"Task created successfully."});
            //this.props.contact['company'] = this.state.company;
            //this.props.updateContactHappened();
            //this.props.getSubscriberDetails();
            //this.hideAddCus()
          }else{
            this.setState({
              tasks : -1
            })
            console.log("No Tasks found");
          }
        });
  }
  generateDate(task){
    var _date = Moment(decodeHTML(task.taskDate),'YYYY-M-D H:m');
    var format = {date: _date.format("DD MMM YYYY"), time: _date.format("hh:mm A")};

    return "at "+format.time +", "+format.date ;
  }
  generateUserID(task){
    var taskowner = this.props.users_details[0].userId==task.taskAddedBy ? "You":task.taskAddedBy;
    return taskowner;
  }
  generateTasksList(){
  return this.state.tasks.map((task,key) => {
      if(key > 3){
        this.state['showExpandCollapse'] = 'show';
      }else{
          this.state['showExpandCollapse'] = 'hide';
      }
      return (
      <div key={key} className={`contact_found mks_tasks_lists_user task_status_${task.status}`} style={{padding : "10px 12px"}}>
        <div className="cf_silhouette">
          <div className="cf_silhouette_text c_txt_s c_txt_s_blue">
            <i className={`${this.mapicons[task.taskType]} mks-task-icons`}></i>
        </div>
      </div>
      <div className="cf_email_wrap">
        <div className="cf_email">
          <p className="mkb_elipsis mkb_text_break" style={{"width" : "145px"}} title={decodeHTML(task.taskName)}>{decodeHTML(task.taskName)}</p>
          <span className="ckvwicon ckwicontext">
            {this.generateDate(task)} | created by <strong>{this.generateUserID(task)}</strong>
          </span>
        </div>
        <div className="cf_task_right">
            <span data-tip={task.priority} className={`mks_priority_icon ${this.priorityIcons[task.priority]["topClass"]}`} style={{"top": "-42px","right": "80px"}}>
                  <i className={`${this.priorityIcons[task.priority]["icon"]}`}></i>
                  <ReactTooltip />
            </span>
            <div  onClick={this.updateTasks.bind(this,task,true)}  data-tip="Click to complete" className="cf_silhouette mks_tasks_lists_empty_icon mks_task_complete_icon">
              <div className="cf_silhouette_text c_txt_s c_txt_s_blue c_txt_s_empty">
                <i className="mksicon-Check mks-tasklists-icons" style={{"display": "none","lineHeight" : "16px !important"}}></i>
              </div>
            </div>
            <span className="mkb_btn mkb_cf_btn pull-right mkb_greenbtn addCF show mkb_task_compBtn hide" style={{"top": "6px","right": "0","fontSize":"10px"}}>
              <i className="mksicon-Check"></i>
              Complete</span>
            <div data-tip="Completed"  className="cf_silhouette mks_tasks_lists_empty_icon mks_tasks_completed" style={{float: "right","top": "-47px","width": "16px","height": "16px","right": "52px"}}>
              <div className="cf_silhouette_text c_txt_s c_txt_s_blue c_txt_s_completed " style={{top: "6px",width: "19px",height: "19px"}}>
                <i className="mksicon-Check mks-tasklists-icons" style={{top: "1px","position": "relative",fontSize: "12px"}}></i>
              </div>
                <ReactTooltip />
            </div>


        </div>
      </div>
        <div className="mks_task_edit_delete_wrap" onClick={this.editTask.bind(this,task)}>
            <div className="cf_silhouette">
              <div className="cf_silhouette_text c_txt_s c_txt_s_blue">
                <i className="mksicon-Edit mks-task-icons"></i>
            </div>
          </div>
        </div>
        <div className="mks_task_edit_delete_wrap _mks_task_delete_task" onClick={this.deleteTask.bind(this,task)} style={{"left": "37px","width": "8%","background": "transparent"}}>
            <div className="cf_silhouette">
              <div className="cf_silhouette_text c_txt_s c_txt_s_blue c_txt_s_red">
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
    this.refs.addboxView.editTaskForm(task);
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
        name: taskObj.input3,
        taskDate: (taskObj.startDate) ? taskObj.startDate.format("MM-DD-YYYY") + " " + Moment(taskObj.times, ["h:mm A"]).format("HH:mm")+":00" : "",
        priority: (taskObj.priority) ? taskObj.priority.toLowerCase() : "",
        notes: taskObj.notes,
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
              this.setState({nextOffset : 0})
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
  sortTaskBy(event){
    this.setState({sortTasks: event.target.value},() => {
      this.getTaskList();
    });
  }

  render(){
    if(!this.state.tasks){
      return (  <div style={{position: "relative"}}>
      <span style={{right : "0px"}} className={`mkb_btn mkb_cf_btn pull-right mkb_greenbtn addCF ${this.state.showLabel} ${this.state.toggleDDandAddBtn}`} onClick={this.showAddTasks.bind(this) }>Add New</span>
      <p className="not-found">Loading Tasks...</p>
      </div>)
    }
    const tasks_header1 = <ToggleDisplay show={this.state.showAddBox}>
    <LoadingMask message={'Creating new task...'} showLoading={this.state.showLoading} />
      <AddBox ref="addboxView"
              showTitle={"Create New Task"}
              addFieldsObj={ [
                {
                  type:"li",
                  className:"mks_ecc_wrap",
                  stateType : "tasktype",
                  extraTitle : "Basic Tasks",
                  defaultValue : "call",
                  value :[
                    {name : "ecc", className:"mks_ecc_firsttouch",tipName:"First Touch", id: "first_touch",value:"first_touch",placeholder:"<span class='mksicon-First-Touch'></span>",tooltip : true},
                    {name : "ecc", className:"mks_ecc_demo",tipName:"Demo", id:"Demo",value:"demo",placeholder:"<span class='mksicon-Demo'></span>",tooltip : true},
                    {name : "ecc", className:"mks_ecc_discovery",tipName:"Discovery", id: "Discovery",value:"discovery",placeholder:"<span class='mksicon-Discovery'></span>",tooltip : true},
                    {name : "ecc", className:"mks_ecc_call active",tipName:"Call", id: "call",value:"call",placeholder:"<span class='mksicon-Phone'></span>",tooltip : true},
                    {name : "ecc", className:"mks_ecc_email",tipName:"Email", id: "email",value:"email",placeholder:"<span class='mksicon-Mail'></span>",tooltip : true},
                    {name : "ecc", className:"mks_ecc_lunch",tipName:"Lunch", id: "Lunch",value:"lunch",placeholder:"<span class='mksicon-Lunch'></span>",tooltip : true},
                    {name : "ecc", className:"mks_ecc_breakfast",tipName:"Breakfast", id: "Breakfast",value:"breakfast",placeholder:"<span class='mksicon-Breakfast'></span>",tooltip : true},
                    {name : "ecc", className:"mks_ecc_meeting",tipName:"Meeting", id: "Meeting",value:"meeting",placeholder:"<span class='mksicon-Meeting'></span>",tooltip : true},
                    {name : "ecc", className:"mks_ecc_proposal",tipName:"Proposal", id: "Proposal",value:"proposal",placeholder:"<span class='mksicon-Proposal'></span>",tooltip : true}
                  ]
                },
                {
                  type:"li",
                  className:"mks_ecc_wrap ecc_linkdin",
                  stateType : "tasktype",
                  defaultValue : "call",
                  extraTitle : "LinkedIn Tasks",
                  value :[
                    {name : "ecc", className:"mks_ecc_connect",tipName:"Connect", id: "connect",value:"connect",placeholder:"<span class='mksicon-Connect'></span>",tooltip : true},
                    {name : "ecc", className:"mks_ecc_introduction",tipName:"Introduction", id:"introduction",value:"introduction",placeholder:"<span class='mksicon-Shake_hands'></span>",tooltip : true},
                    {name : "ecc", className:"mks_ecc_firstmessage",tipName:"First Message", id: "firstMessage",value:"firstMessage",placeholder:"<span class='mksicon-First_Message'></span>",tooltip : true},
                    {name : "ecc", className:"mks_ecc_secondmessage",tipName:"Second Message", id: "secondMessage",value:"secondMessage",placeholder:"<span class='mksicon-Second_Message'></span>",tooltip : true},
                    {name : "ecc", className:"mks_ecc_thirdmessage",tipName:"Third Message", id: "thirdMessage",value:"thirdMessage",placeholder:"<span class='mksicon-Third_Message'></span>",tooltip : true},
                    {name : "ecc", className:"mks_ecc_pdf",tipName:"PDF", id: "pdf",value:"pdf",placeholder:"<span class='mksicon-PDF'></span>",tooltip : true},
                    {name : "ecc", className:"mks_ecc_webseminarinvite",tipName:"Web Seminar Invite", id: "webSeminarInvite",value:"webSeminarInvite",placeholder:"<span class='mksicon-Web_Seminar_Invite'></span>",tooltip : true},
                    {name : "ecc", className:"mks_ecc_invitetogroup",tipName:"Invite to Group", id: "inviteToGroup",value:"inviteToGroup",placeholder:"<span class='mksicon-Invite_to_Group'></span>",tooltip : true},
                    //{name : "ecc", className:"mks_ecc_proposal",tipName:"Proposal", id: "Proposal",value:"proposal",placeholder:"<span class='mksicon-Proposal'></span>",tooltip : true}
                  ]
                },
                {name : "ckey", className:"focusThis", required:'required',defaultValue:'Call' , id: "ckey",placeholder:"Enter task name *"},
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
                {type:"textarea", className:"",id:"notes", placeholder:"Add notes about your task here"}

              ] }
              boxType={"mks_tasksFields"}
              create={this.createTasks.bind(this)}
              update={this.updateTasks.bind(this)}
              cancel={this.hideAddCus.bind(this)}
      />

      <div className="OverLay" style={{height : (this.state.overlayHeight+"px" )}}></div>

</ToggleDisplay>
const tasks_header2 = <select className={`${this.state.toggleDDandAddBtn}`} style={{left : "60px","top" : "-36px","position":"absolute"}} onChange={this.sortTaskBy.bind(this)} value={this.state.sortTasks}>

  <option value="-1">All</option>

  <optgroup label="Priority">
    <option value="high">High</option>
    <option value="medium">Medium</option>
    <option value="low">Low</option>
   </optgroup>
   <optgroup label="Tasks Types">
     <option value="first_touch">First Touch</option>
     <option value="demo">Demo</option>
     <option value="discovery">Discovery</option>
     <option value="call">Call</option>
     <option value="email">Email</option>
     <option value="lunch">Lunch</option>
     <option value="breakfast">Breakfast</option>
     <option value="meeting">Meeting</option>
     <option value="proposal">Proposal</option>
  </optgroup>
  <optgroup label="Linkedin Tasks">
    <option value="webSeminarInvite">Web Seminar Invite</option>
    <option value="connect">Connect</option>
    <option value="introduction">Introduction</option>
    <option value="firstMessage">First Message</option>
    <option value="secondMessage">Second Message</option>
    <option value="thirdMessage">Third Message</option>
    <option value="pdf">PDF</option>
    <option value="inviteToGroup">Invite to Group</option>
  </optgroup>
</select>
const tasks_header3 = <span style={{right : "0px","top" : "-38px"}} className={`mkb_btn mkb_cf_btn pull-right mkb_greenbtn addCF ${this.state.showLabel} ${this.state.toggleDDandAddBtn}`} onClick={this.showAddTasks.bind(this) }>Add New</span>
    if(this.state.tasks == -1){
      return (<div style={{position: "relative"}}>

        {tasks_header1}
        {tasks_header2}
        {tasks_header3}
                  <p className="not-found">No tasks found.</p>
                  </div>)
    }

    return (
      <div style={{position: "relative"}}>
        {tasks_header1}
        {tasks_header2}
        {tasks_header3}
    <div style={{"position" : "relative"}} className={`content-tasks-wrapper content-wrapper height90 height230 ${this.state.setFullHeight} ${this.state.toggleTasks}`}  >
          <LoadingMask message={this.state.loadingMessage} showLoading={this.state.showLoading}/>
          {this.generateTasksList()}
          <div className={`LoadMore-wrapper loading_${this.state.showLoadingMsg}`}>
              <div  className={`LoadMore loading_${this.state.showLoadingMsg}`} >Loading more...</div>
          </div>
          <div onClick={ ()=>this.getTaskList(true) } className={`LoadMore-wrapper ${this.state.showLoadingButton}` }>
            <div  className="LoadMore" > <span className="mksicon-Add"></span> Show more tasks</div>

          </div>
    </div>
    <div className={`${this.state.showHideCollapse} ${this.state.collapseExpand} ${this.state.showCollapse} ${this.state.showExpandCollapse}`} onClick={this.toggleHeight.bind(this)}>
      <span>{this.state.collapseMsg}</span>
      <span className="mksicon-ArrowNext"></span>
    </div>


  </div>
    )
  }
}

export default Tasks;
