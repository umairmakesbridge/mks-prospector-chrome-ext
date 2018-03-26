import React,{Component}
       from 'react';
import request
       from 'superagent';
import {encodeHTML,decodeHTML}
       from '../../common/Encode_Method';
import ToggleDisplay
       from 'react-toggle-display';


class TasksLists extends Component{
    constructor(props){
        super(props);

    }
    generateTasksList(){
      return (
      <div>
        <div className="contact_found _mks_lists_tasks" style={{padding : "10px 12px 0"}}>
          <div className="cf_silhouette">
            <div className="cf_silhouette_text c_txt_s c_txt_s_blue">
              <i className="mksicon-Mail mks-tasklists-icons"></i>
          </div>
        </div>
        <div className="cf_email_wrap">
          <div className="cf_email">
            <p>Urgent call</p>
            <span className="ckvwicon">
              umair@makesbridge.com
            </span>
          </div>
          <div className="cf_task_right">
              <span className="mks_priority_icon mks_priority_high pclr19">
                    <i className="mksicon-Triangle_Up"></i>
              </span>
              <span className="ckvwicon mks_task_time">
                  <i className="mksicon-Clock" style={{"right": "3px"}}></i>
                @ 09:30 AM
              </span>
          </div>
        </div>
        <div className="clr"></div>
      </div>
      <div className="contact_found _mks_lists_tasks" style={{padding : "10px 12px 0"}}>
        <div className="cf_silhouette">
          <div className="cf_silhouette_text c_txt_s c_txt_s_blue">
            <i className="mksicon-Phone mks-tasklists-icons"></i>
        </div>
      </div>
      <div className="cf_email_wrap">
        <div className="cf_email">
          <p>Urgent call</p>
          <span className="ckvwicon">
            umair@makesbridge.com
          </span>
        </div>
        <div className="cf_task_right">
            <span className="mks_priority_icon mks_priority_high pclr19">
                  <i className="mksicon-Triangle_Up"></i>
            </span>
            <span className="ckvwicon mks_task_time">
                <i className="mksicon-Clock" style={{"right": "3px"}}></i>
              @ 09:30 AM
            </span>
        </div>
      </div>
      <div className="clr"></div>
    </div>
  </div>
      )
    }
    render(){
      return(
        <div className="D">
          <h2 className="total-count-head"><strong className="badge total-count">10</strong><span className="total-text">tasks for today</span></h2>
          {this.generateTasksList()}
        </div>
      )
    }

}
export default TasksLists;
