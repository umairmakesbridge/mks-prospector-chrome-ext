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
class TasksLists extends Component{
    constructor(props){
        super(props);

        this.state = {
          assignTask : '',
          completedTask : '',
          totalCount : 0,
          completedCount : 0,
          showCompleted : 'hide',
          collapseExpand : 'expand',
          collapseMsg : 'Click to expand',
          showCollapse : '',
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
    getTaskListofUser(){
      //https://test.bridgemailsystem.com/pms/io/subscriber/subscriberTasks/?BMS_REQ_TK=teJfgUi3XxStW71TjoC59TptuQRwST&type=getAllTask&subNum=qcWRf30Sd33Ph26Fg17Db20If21Pd30Sd33qDF&fromDate=2018-04-01&toDate=2018-04-13&orderBy=creationTime&order=asc&offset=0&bucket=20

      var reqObj = {
        type: "getAllTask",
        fromDate: "04-01-2018",
        toDate:"04-30-2018",
        orderBy : "updationTime",
        order: "desc",
        offset : 0,
        bucket : 20,
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

            let taskAssign=[];
            let completedTask=[]

            if(parseInt(jsonResponse.totalCount) > 0){
              if(jsonResponse.totalCount > 2) {
                this.state['showExpandCollapse'] = 'show';
              }
              $.each(jsonResponse.taskList,(key,value)=>{
                if(value.status=="C"){
                  completedTask.push(value);
                  this.state['showCompleted'] = 'show'
                }else{
                  taskAssign.push(value)
                }
              })
              this.setState({
                assignTask : taskAssign,
                totalCount : taskAssign.length,
                completedCount : completedTask.length,
                completeTask : completedTask
              });
                //this.refs.addboxView.setDefaultState();
                //SuccessAlert({message:"Task created successfully."});
              //this.props.contact['company'] = this.state.company;
              //this.props.updateContactHappened();
              //this.props.getSubscriberDetails();
              //this.hideAddCus()
            }else{
              this.setState({
                assignTask : -1
              })
            }
          });
    }
    loadSubscriber(subscriber){
      this.props.onEmailSelect(subscriber.email)
    }
    generateDate(dateString){
      var _date = Moment(decodeHTML(dateString),'YYYY-M-D H:m');
      var format = {date: _date.format("DD MMM YYYY"), time: _date.format("hh:mm A")};
      return format.time;
    }
    generateTasksList(){
      return this.state.assignTask.map((task,key) => {
            return(
              <div key={key} className={`contact_found _mks_lists_tasks  task_status_${task.status}`} onClick={this.loadSubscriber.bind(this,task.subscriberInfo)} style={{padding : "10px 12px 0"}}>
                <div className="cf_silhouette">
                  <div className="cf_silhouette_text c_txt_s c_txt_s_blue c_txt_s_empty"></div>
              </div>
              <div className="cf_email_wrap">
                <div className="cf_email">
                  <p>{task.taskName}</p>

                    <span className="ckvwicon mks_task_time" style={{"display" : "inline","position": "absolute","top": "22px"}}>
                       {this.generateDate(task.updationTime)}
                    </span>
                  <span className="ckvwicon" style={{"position": "absolute","top": "22px","display": "inherit","left": "63px"}}>
                    {(task.subscriberInfo.firstName) ? task.subscriberInfo.firstName : ""}   {task.subscriberInfo.lastName}
                  </span>

                </div>
                <div className="cf_task_right">
                    <span data-tip={task.priority} className={`mks_priority_icon ${this.priorityIcons[task.priority]["topClass"]}`} >
                          <i className={`${this.priorityIcons[task.priority]["icon"]}`}></i>
                          <ReactTooltip />
                    </span>

                    <div className="cf_silhouette">
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
              <div key={key} className={`contact_found _mks_lists_tasks`} style={{padding : "10px 12px 0"}}>
                <div className="cf_silhouette">
                  <div className="cf_silhouette_text c_txt_s c_txt_s_blue c_txt_s_completed ">
                    <i className="mksicon-Check mks-tasklists-icons"></i>
                  </div>
              </div>
              <div className="cf_email_wrap">
                <div className="cf_email">
                  <p>{task.taskName}</p>

                    <span className="ckvwicon mks_task_time" style={{"display" : "inline","position": "absolute","top": "22px"}}>
                       {this.generateDate(task.updationTime)}
                    </span>
                  <span className="ckvwicon" style={{"position": "absolute","top": "22px","display": "inherit","left": "63px"}}>
                    {task.subscriberInfo.firstName}   {task.subscriberInfo.lastName}
                  </span>

                </div>
                <div className="cf_task_right">
                    <span className={`mks_priority_icon ${this.priorityIcons[task.priority]["topClass"]}`} >
                          <i className={`${this.priorityIcons[task.priority]["icon"]}`}></i>
                    </span>

                    <div className="cf_silhouette">
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
    render(){
      if(this.state.assignTask == -1){
        return(
          <div className="contacts-wrap">
          <div id="NoContact" className={` mksph_cardbox`}>
                  <p className="not-found">No Tasks found</p>
              </div>
                  </div>
        )
      }
      if(!this.state.assignTask){
          return(
            <div className="contacts-wrap">
            <div id="NoContact" className={` mksph_cardbox`}>
                    <p className="not-found">Loading Tasks....</p>
                </div>
                    </div>
          )
      }

      return(
        <div className="D">
          <div className={`content-wrapper height90 height210 ${this.state.setFullHeight}`}>
            <h2 className="total-count-head"><strong className="badge total-count">{this.state.totalCount}</strong><span className="total-text">tasks for today</span></h2>
            {this.generateTasksList()}

          </div>
          <div style={{"background": "#fff","margin": "5px 0","padding": "5px 0"}} className={`${this.state.collapseExpand} ${this.state.showCollapse} ${this.state.showExpandCollapse}`} onClick={this.toggleHeight.bind(this)}>
            <span>{this.state.collapseMsg}</span>
            <span className="mksicon-ArrowNext"></span>
          </div>
          <span className={`${this.state.showCompleted} _mks_completed_tasks`}>
            <h2 className="total-count-head"><strong className="badge total-count">{this.state.completedCount}</strong><span className="total-text">Completed tasks of today</span></h2>
            {this.generateCompletedTasks()}
          </span>
        </div>
      )
    }

}
export default TasksLists;
