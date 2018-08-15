import React,{Component}
       from 'react';
import request
       from 'superagent';
import {encodeHTML,decodeHTML}
       from '../../common/Encode_Method';
import ToggleDisplay
       from 'react-toggle-display';
import Moment
       from 'moment';
import {ErrorAlert,SuccessAlert}
       from '../../common/Alerts';
import ReactTooltip
              from 'react-tooltip';
import {CustomScrollBar} from 'react-custom-scrollbar';
import LoadingMask
       from '../../common/Loading_Mask';
class TasksLists extends Component{
    constructor(props){
        super(props);
        this.req=null;
        this.state = {
          assignTask : '',
          completedTask : '',
          totalCount : 0,
          completedCount : 0,
          showCompleted : 'hide',
          collapseExpand : 'expand',
          collapseMsg : 'Click to expand',
          showCollapse : '',
          showExpandCollapse : 'hide',
          cactive : 'active',
          sortTasks : '-1',
          showStatus : false,
          isTodayTask: 1,
          showLoadingMsg : 'false',
          showLoadingButton : 'hide',
          nextOffset : 0,
          taskAssign : [],
          completedTask : []
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
        this.maptooltip = {
          "email" : "Email",
          "lunch" : "Lunch",
          "discovery" : "Discovery",
          "call" : "Phone",
          "breakfast" : "Breakfast",
          "meeting" : "Meeting",
          "proposal" : "Proposal",
          "demo"  : "Demo",
          "first_touch":"First Touch"
        }
    }
    getTaskListofUser(loadMore){
      let nextOffset = (loadMore) ? this.state.nextOffset : 0;

      //https://test.bridgemailsystem.com/pms/io/subscriber/subscriberTasks/?BMS_REQ_TK=teJfgUi3XxStW71TjoC59TptuQRwST&type=getAllTask&subNum=qcWRf30Sd33Ph26Fg17Db20If21Pd30Sd33qDF&fromDate=2018-04-01&toDate=2018-04-13&orderBy=creationTime&order=asc&offset=0&bucket=20
      if(loadMore){
        this.setState({
          showLoadingMsg : true,
          showLoadingButton : 'hide'
        })
      }else{
        this.setState({
            assignTask : '',
            nextOffset : 0
        })
      }


      var reqObj = {
        type: "getAllTask",
        orderBy : 'updationTime',
        order: "desc",
        offset : nextOffset,
        bucket : 20,
        ukey:this.props.users_details[0].userKey,
        isMobileLogin:'Y',
        userId:this.props.users_details[0].userId
      };
      if(this.state.isTodayTask){
        reqObj["fromDate"]=  Moment().format("MM-DD-YYYY");
        reqObj["toDate"]= Moment().format("MM-DD-YYYY"); // Day +1]
      }
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


      this.req = request
      .post(this.props.baseUrl+'/io/subscriber/subscriberTasks/?BMS_REQ_TK='+this.props.users_details[0].bmsToken)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(reqObj)
      this.req.end((err, res) => {
        try {
        console.log(false, 'should not complete the request');
      } catch(e) { console.log(e); }
      console.log('response of api : ', res);
      var jsonResponse =  JSON.parse(res.text);
      console.log(jsonResponse);
      let taskAssign=(loadMore) ? this.state.taskAssign : [];
      let completedTask=(loadMore) ? this.state.completedTask : []


      if(parseInt(jsonResponse.totalCount) > 0){

        $.each(jsonResponse.taskList,(key,value)=>{
          if(value.status=="C"){
            completedTask.push(value);
            this.state['showCompleted'] = 'show'
          }else{
            taskAssign.push(value)
          }
        });
        this.state.completedTask = completedTask;
        this.state.taskAssign = taskAssign;
        if(taskAssign.length > 2) {
          this.state['showExpandCollapse'] = 'show';
        }else{
          this.state['showExpandCollapse'] = 'hide';
        }
        this.setState({
          assignTask : taskAssign,
          totalCount : taskAssign.length,
          completedCount : completedTask.length,
          completeTask : completedTask,
          showLoadingMsg : false,
          showLoadingButton : (jsonResponse.nextOffset == "-1") ? 'hide' : 'show',
          nextOffset :  jsonResponse.nextOffset
        });
          //this.refs.addboxView.setDefaultState();
          //SuccessAlert({message:"Task created successfully."});
        //this.props.contact['company'] = this.state.company;
        //this.props.updateContactHappened();
        //this.props.getSubscriberDetails();
        //this.hideAddCus()
      }else{
        this.setState({
          assignTask : -1,
          totalCount:0
        })
      }
      });
      this.req.on('error', error => {
        done(error);
      });
      this.req.on('abort', (e) => {
        console.log('abort ',e);
      });


    /*request.post(this.props.baseUrl+'/io/subscriber/subscriberTasks/?BMS_REQ_TK='+this.props.users_details[0].bmsToken)
         .set('Content-Type', 'application/x-www-form-urlencoded')
         .send(reqObj)
         .on('progress', function(e) {
           console.log('Percentage done: ', e.percent);
         })
         .then((res) => {
            console.log(res.status);
            var jsonResponse =  JSON.parse(res.text);
            console.log(jsonResponse);
            let taskAssign=(loadMore) ? this.state.taskAssign : [];
            let completedTask=(loadMore) ? this.state.completedTask : []


            if(parseInt(jsonResponse.totalCount) > 0){

              $.each(jsonResponse.taskList,(key,value)=>{
                if(value.status=="C"){
                  completedTask.push(value);
                  this.state['showCompleted'] = 'show'
                }else{
                  taskAssign.push(value)
                }
              });
              this.state.completedTask = completedTask;
              this.state.taskAssign = taskAssign;
              if(taskAssign.length > 2) {
                this.state['showExpandCollapse'] = 'show';
              }else{
                this.state['showExpandCollapse'] = 'hide';
              }
              this.setState({
                assignTask : taskAssign,
                totalCount : taskAssign.length,
                completedCount : completedTask.length,
                completeTask : completedTask,
                showLoadingMsg : false,
                showLoadingButton : (jsonResponse.nextOffset == "-1") ? 'hide' : 'show',
                nextOffset :  jsonResponse.nextOffset
              });
                //this.refs.addboxView.setDefaultState();
                //SuccessAlert({message:"Task created successfully."});
              //this.props.contact['company'] = this.state.company;
              //this.props.updateContactHappened();
              //this.props.getSubscriberDetails();
              //this.hideAddCus()
            }else{
              this.setState({
                assignTask : -1,
                totalCount:0
              })
            }
          });*/

    }
    loadSubscriber(subscriber){

      this.props.hideUpTaskList();
      this.props.onEmailSelect(subscriber.email,true);

    }
    generateDate(dateString){
      var _date = Moment(decodeHTML(dateString),'YYYY-M-D H:m');
      var format = {date: _date.format("DD MMM YYYY"), time: _date.format("hh:mm A")};
      var returnVal = this.state.isTodayTask ? format.time: format.date +" "+ format.time;
      return returnVal;
    }
    markComplete(task,event){
      event.preventDefault();
      console.log('Mark Compelte Click');
      this.updateTasks(task);
      event.stopPropagation();
      return false;
    }
    updateTasks(taskObj,isComplete){
        console.log(taskObj);
        this.setState({
          showStatus : true
        })
        var reqObj = {
          type: "complete",
          subNum: taskObj.subscriberInfo['subscriberNumber.encode'],
          taskId :  taskObj['taskId.encode'],
          tasktype: taskObj.tasktype,
          name: taskObj.input2,
          taskDate: (taskObj.startDate) ? taskObj.startDate.format("MM-DD-YYYY") + " " + Moment(taskObj.times, ["h:mm A"]).format("HH:mm")+":00" : "",
          priority: (taskObj.priority) ? taskObj.priority.toLowerCase() : "",
          notes: taskObj.notes,
          ukey:this.props.users_details[0].userKey,
          isMobileLogin:'Y',
          userId:this.props.users_details[0].userId
        };
        request.post(this.props.baseUrl+'/io/subscriber/subscriberTasks/?BMS_REQ_TK='+this.props.users_details[0].bmsToken)
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
                  showStatus : false
                })
                  if(isComplete){
                    SuccessAlert({message:"Task mark completed successfully."});
                  }else{
                    SuccessAlert({message:"Task updated successfully."});
                  }

                //this.props.contact['company'] = this.state.company;
                //this.props.updateContactHappened();
                //this.props.getSubscriberDetails();
                this.getTaskListofUser()

              }else{
                ErrorAlert({message : jsonResponse[1]});
              }
            });
    }
    generateTasksList(){
      return this.state.assignTask.map((task,key) => {
            return(
              <div key={key} className={`contact_found _mks_lists_tasks  task_status_${task.status}`} onClick={this.loadSubscriber.bind(this,task.subscriberInfo)} style={{padding : "10px 12px 0"}}>

              <div className="cf_email_wrap" style={{"paddingLeft":"0","width": "360px"}}>

                <div className="cf_email">
                  <div data-tip="Click to complete" className="cf_silhouette mks_tasks_lists_empty_icon" onClick={this.markComplete.bind(this,task)}>
                    <div className="cf_silhouette_text c_txt_s c_txt_s_blue c_txt_s_empty">
                      <i className="mksicon-Check mks-tasklists-icons" style={{"display" : "none"}}></i>
                    </div>
                  </div>
                    <ReactTooltip />
                  <p title={task.taskName} className="mkb_elipsis mkb_text_break">{task.taskName}</p>

                    <span className="ckvwicon mks_task_time" style={{"display" : "inline","position": "absolute","top": "22px","left":"40px"}}>
                       {this.generateDate(task.taskDate)}
                    </span>
                  <span className="ckvwicon" style={{"position": "absolute","top": "22px","display": "inherit","left": this.state.isTodayTask?'100px':'160px'}}>
                    {(task.subscriberInfo.firstName) ? task.subscriberInfo.firstName : ""}   {task.subscriberInfo.lastName}
                  </span>

                </div>
                <div className="cf_task_right">
                    <span data-tip={task.priority} className={`mks_priority_icon ${this.priorityIcons[task.priority]["topClass"]}`} >
                          <i className={`${this.priorityIcons[task.priority]["icon"]}`}></i>
                          <ReactTooltip />
                    </span>

                    <div className="cf_silhouette">
                        <div data-tip={this.maptooltip[task.taskType]} className="cf_silhouette_text c_txt_s c_txt_s_blue _mks_task-lists_silhouette_text">
                            <i className={`${this.mapicons[task.taskType]} mks-tasklists-icons`} ></i>
                            <ReactTooltip/>
                        </div>
                      </div>
                </div>
              </div>
              <div className="clr"></div>
            </div>
            )
      });
    }
    toggleHeight(){
      if(this.state.setFullHeight){
        this.setState({setFullHeight : '',collapseMsg: 'Click to expand',collapseExpand:'expand'});
      }else{
        this.setState({setFullHeight : 'heighAuto',collapseMsg: 'Click to collapse',collapseExpand:'collapse'});
      }
    }
    generateCompletedTasks(){
      return this.state.completeTask.map((task,key) => {
            return(
              <div key={key} className={`contact_found _mks_lists_tasks _mks_complete_tasks`} onClick={this.loadSubscriber.bind(this,task.subscriberInfo)} style={{padding : "10px 12px 0"}}>

              <div className="cf_email_wrap" style={{"paddingLeft":"0","width": "360px"}}>
                <div className="cf_email">
                  <div className="cf_silhouette mks_tasks_lists_empty_icon" >
                    <div className="cf_silhouette_text c_txt_s c_txt_s_blue c_txt_s_completed ">
                      <i className="mksicon-Check mks-tasklists-icons"></i>
                    </div>
                </div>
                  <p className="mkb_elipsis mkb_text_break">{task.taskName}</p>

                    <span className="ckvwicon mks_task_time" style={{"display" : "inline","position": "absolute","top": "22px","left":"40px"}}>
                       {this.generateDate(task.taskDate)}
                    </span>
                  <span className="ckvwicon" style={{"position": "absolute","top": "22px","display": "inherit","left": this.state.isTodayTask?'100px':'160px'}}>
                    {task.subscriberInfo.firstName}   {task.subscriberInfo.lastName}
                  </span>

                </div>
                <div className="cf_task_right">
                    <span className={`mks_priority_icon ${this.priorityIcons[task.priority]["topClass"]}`} >
                          <i className={`${this.priorityIcons[task.priority]["icon"]}`}></i>
                    </span>

                    <div className="cf_silhouette" >
                        <div className="cf_silhouette_text c_txt_s c_txt_s_blue _mks_task-lists_silhouette_text">
                            <i className={`${this.mapicons[task.taskType]} mks-tasklists-icons`} ></i>
                        </div>
                      </div>
                </div>
              </div>
              <div className="clr"></div>
            </div>
            )
      });
    }
    sortTaskBy(event){
      this.setState({sortTasks: event.target.value},() => {
        this.getTaskListofUser();
      });
    }
    getTodayTasks(event){
      if (!this.state.cactive) {
        if(this.req)
          {
            this.req.abort();
          }
        this.setState({tactive:'',searchContact:'',cactive:'active',subscriber:'',isTodayTask:1},() => {
          this.getTaskListofUser();
        });
      }


    }
    getAllTasks(event){
      if (!this.state.tactive) {
        if(this.req)
          {
            this.req.abort();
          }
        this.state.offset=0;

         this.setState({tactive:'active',searchContact:'',subscriber:'',cactive:'',isTodayTask:0},() => {
           this.getTaskListofUser();
         });
      }else{
        console.log('all tasks already active');
      }


    }
    render(){
      const slider_button = <div className="contacts-switch">
          <div className="status_tgl">
            <a className={`published toggletasks toggletags ${this.state.cactive} showtooltip`} onClick={this.getTodayTasks.bind(this) }>Todays Tasks</a>
              <a className={`draft toggletasks toggletags ${this.state.tactive} showtooltip`} onClick={this.getAllTasks.bind(this) }>All Tasks</a>
        </div>
      </div>
      const taskTodayText = this.state.isTodayTask==1?" for today":"";
      const search_bar = <div className="searchBar">
        <h2 className="total-count-head"><strong className="badge total-count">{this.state.totalCount}</strong><span className="total-text">tasks {taskTodayText}</span></h2>
        <h3>Show</h3>

      <div className="contacts-select-by">
        <select onChange={this.sortTaskBy.bind(this)} value={this.state.sortTasks}>

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
      </div>
      </div>
      if(this.state.assignTask == -1){
        return(
          <div className="contacts-wrap plc_marginbottom20 mks_task_lists_dash_wrapper">
            {slider_button}
            {search_bar}
            <div id="NoContact" className={` mksph_cardbox`} style={{"paddingTop": "8px"}}>
              <p className="not-found">No Tasks found</p>
            </div>
          </div>
        )
      }
      if(!this.state.assignTask){
          return(
            <div className="contacts-wrap plc_marginbottom20 mks_task_lists_dash_wrapper ">
            {slider_button}
            {search_bar}
              <div id="NoContact" className={` mksph_cardbox`} style={{"paddingTop": "8px"}}>
                  <p className="not-found">Loading Tasks....</p>
              </div>
            </div>
          )
      }

      return(
        <div className="D plc_marginbottom20 mks_task_lists_dash_wrapper">
          <LoadingMask message={"Marking task completed..."} showLoading={this.state.showStatus} extraClass={"alignloadingClass mks_add_loading_wrapper"}/>
          <div className={`content-wrapper height90 height245 ${this.state.setFullHeight}`}>
            {slider_button}
            {search_bar}
            {this.generateTasksList()}
            <div className={`LoadMore-wrapper loading_${this.state.showLoadingMsg}`}>
                <div  className={`LoadMore loading_${this.state.showLoadingMsg}`} >Loading more...</div>
            </div>
            <div onClick={ ()=>this.getTaskListofUser(true) } className={`LoadMore-wrapper ${this.state.showLoadingButton}` }>
              <div  className="LoadMore" > <span className="mksicon-Add"></span> Show more tasks</div>

            </div>
          </div>
          <div style={{"background": "#fff","margin": "5px 0","padding": "5px 0"}} className={`${this.state.collapseExpand} ${this.state.showCollapse} ${this.state.showExpandCollapse}`} onClick={this.toggleHeight.bind(this)}>
            <span>{this.state.collapseMsg}</span>
            <span className="mksicon-ArrowNext"></span>
          </div>
          <span className={`${this.state.showCompleted} _mks_completed_tasks`}>
            <h2 className="total-count-head"><strong className="badge total-count">{this.state.completedCount}</strong><span className="total-text">Completed</span></h2>
            <CustomScrollBar
              allowOuterScroll={false}
              heightRelativeToParent={`188`}
              onScroll={() => {console.log('Scrolling')}}
              addScrolledClass={true}
              freezePosition={false}
              handleClass="inner-handle"
              minScrollHandleHeight={38}
          >
            {this.generateCompletedTasks()}
            </CustomScrollBar>
          </span>
        </div>
      )
    }

}
export default TasksLists;
