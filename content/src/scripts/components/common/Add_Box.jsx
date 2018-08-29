import React,{Component} from 'react';
import {encodeHTML,decodeHTML}
       from './Encode_Method';
import DatePicker
       from 'react-datepicker';
import Moment
       from 'moment';
import TimePicker
       from 'react-times';
import ReactTooltip
       from 'react-tooltip';
import {Checkbox}
        from 'react-icheck';
var Datetime = require('react-datetime');


class AddBox extends Component{
    constructor(props){
        super(props);
        console.log('Add Box',this.props.addFieldsObj);
        this.state = {
          disabled : false,
          selectedDay: '',
          startDate : Moment().add('hours', 1).minute(0),
          times : Moment().format("hh:mm A"),
          btnText : "Save",
          extra_btn_class : '',
          saveType : "create",
          showUpdateTitle : '',
          ampm : Moment().format("hh:mm A").split(" ")[1],
          isGoogleSync: false
        };
        var _this = this;
        jQuery.each(this.props.addFieldsObj,function(key,value){
                  if(value.type=="date"){
                    _this.state['date'] = "";
                  }else if(value.type=="li"){
                    _this.state[value.stateType] = (value.defaultValue) ? value.defaultValue : "";
                  }else if(value.type=="textarea"){
                    _this.state[value.id] = "";
                  }
                  else{
                     _this.state['input'+(key+1)] = (value.defaultValue) ? value.defaultValue : "";
                  }

        });
        this.handleChange = this.handleChange.bind(this);
        //this.handleDayClick = this.handleDayClick;
        // preserve the initial state in a new object
        this.baseState = _this.state
    }
    setDisableFalse(){
      this.setState({disabled : false})
    }
    handleOnSave(){
      console.log('Show Box Save Callback');
      let els = document.querySelectorAll(`div.${this.props.boxType} input`);
      let requestObj = {};
      let isValid = true;
      console.log(els);
      els.forEach((element)=>{
                    if(element.getAttribute('data-required')=='required'){
                        if(!element.value){
                          isValid = false;
                          jQuery(element).addClass('hasError');
                          element.focus();
                        }
                    }

                  });
                  console.log(isValid);
                  // If valid Generating Object
                  if(isValid && !this.state.disabled){
                    jQuery("div.addBox_wrapper_container input").removeClass('hasError');
                    this.setState({disabled : true});
                    if(this.props.boxType=="customFields"){
                      this.props.create("customFields",[els[0].value,els[1].value]);
                      setTimeout(function(){this.setState(this.baseState);}.bind(this),2000);
                    }else if(this.props.boxType == "mks_tasksFields" && this.state.saveType=="create"){
                        console.log('Time to tasks');
                        this.props.create(this.state);
                    }else if(this.props.boxType == "mks_tasksFields" && this.state.saveType=="update"){
                      debugger;
                        this.props.update(this.state);
                    }


                  }
    }
    handleChange(date) {
       this.setState({
         startDate: date,
         selectedDay : date.format("YYYY-MM-DD") + " " + this.state.times
       });
     }
    editTaskForm(editObj){
      var _date = Moment(decodeHTML(editObj.taskDate),'YYYY-M-D H:m');
      debugger;
      var format = {date: _date.format("DD MMM YYYY"), time: _date.format("hh:mm")};
      var selFormat = {date: _date.format("YYYY-MM-DD"), time: _date.format("hh:mm A")} //2018-03-13 06:58:00
      this.setState({
         selectedDay : selFormat.date + " " + selFormat.time,
         startDate : _date,
         times : selFormat.time,
         input3 : editObj.taskName,
         notes : editObj.notes,
         btnText : "Update",
         extra_btn_class : "mks__update_btn",
         saveType : 'update',
         showUpdateTitle : 'Update task',
         tasktype : editObj.taskType,
         priority : editObj.priority,
         isGoogleSync: editObj.googleCalendar?true:false
      });
      this.state['taskId'] = editObj['taskId.encode'];
      jQuery('.mks_priorty_wrap li').removeClass('active');
      jQuery('.mks_ecc_wrap li').removeClass('active');
      jQuery('.mks_priotiry_'+editObj.priority.toLowerCase()).addClass('active');
      jQuery('.mks_ecc_'+editObj.taskType.toLowerCase()).addClass('active');
      debugger;
      console.log(this.state);
    }
    defaultAddTaskDialog (){

          $('.mks_priotiry_medium').addClass('active');
          $('.mks_ecc_call').addClass('active');
          this.state['priority'] = 'medium';
    }
    setDefaultState(){
      this.setState(this.baseState);
      $('.mks_priorty_wrap li').removeClass('active');
      $('.mks_ecc_wrap li').removeClass('active');

    }
    handleKeyPress(event){
        const code = event.keyCode || event.which;
        if(code == 13){
          this.handleOnSave();
        }
    }
    handleOnChange(event){
        //this.state['input'+(key+1)] = event.target.value;
        this.setState({
          [event.target.id] : event.target.value
        });
    }
    handleOnCancel(){
      console.log('Show Box Cancel Callback');
      this.setDefaultState();
      this.props.cancel();
    }
    clickedLi(stateLi,value,event){
      var targetLi = event.currentTarget;
      if(stateLi == "tasktype"){
        var o_state_value = $(targetLi).parents('ul').find('li.active').attr('data-tip');
        if(o_state_value && o_state_value.toLowerCase() == this.state.input3.toLowerCase().trim()){
          this.setState({
            //input2 : this.capitalize($(targetLi).attr('data-tip')),
            input3 : this.capitalize($(targetLi).attr('data-tip'))
          })
        }else{
          this.setState({
            //input2 : this.capitalize($(targetLi).attr('data-tip')),
            input3 : this.capitalize($(targetLi).attr('data-tip'))
          })
        }
        $('ul.mks_ecc_wrap').find('li').removeClass('active');
      }else if(stateLi == 'priority'){
        $(targetLi).parents('ul').find('li').removeClass('active');
      }
      $(targetLi).addClass('active');
      this.setState({
        [stateLi] : (value) ? value : $(targetLi).text()
      })
    }

    capitalize(value) {
          return value.charAt(0).toUpperCase() + value.slice(1);
      }
    componentDidMount(){
      console.log(this.state.selectedDay);
    }
    onTimeChange(time) {
      // do something
      let AmPm = this.state.ampm
      console.log(time);
      this.setState({
        times : time + " " + AmPm,
        selectedDay : this.state.startDate + " " + time
      });
    }

    handleCheck(e,checked){
      this.setState({"isGoogleSync":checked});
      console.log("Checkbox checked="+ checked);
    }

    onMeridiemChange(meridiem) {
    //this.setState({ ampm : meridiem });
    this.state['ampm'] = meridiem;
    }
    onFocusChange(focusvalue){
      // console.log('Focus value' , focusvalue);
      if(focusvalue){
        if(this.state.saveType=="create"){
          this.setState({
            times : Moment().format("hh:mm A")
          })
        }

        var selectedHr = this.state.times.split(" ");
        var selectedAP = selectedHr[1];
        var selectMin  = selectedHr[0].split(":");
        var selectedHrs = selectedHr[0]
        //var changeHr = ( parseInt(selectMin[0]) > 9 ) ? selectMin[0].charAt(1) : selectMin[0];
        var changMin = "";
        if(parseInt(selectMin[1]) <= 30 ){
          changMin = (parseInt(selectMin[1]) > 15 ) ? "30" : "00";
        }else if(parseInt(selectMin[1]) >= 30 ){
          changMin = (parseInt(selectMin[1]) > 45 ) ? "00" : "30";
          selectedHrs = (parseInt(selectMin[1]) > 45 ) ? (parseInt(selectedHrs) + 1) : selectedHrs;
        }
        var indexOfTime = ""
        var timeS = parseInt(selectedHrs)+":"+changMin + " " +  selectedAP;
        $('.classic_theme_container .classic_time').removeClass('active');
        $.each($('.classic_theme_container .classic_time'),function(key,val){
          if($(val).text().replace(/\xA0/g,"")==timeS.replace(" ",'')){
            $(val).addClass('active');
            indexOfTime = key;
          }
        });

        $('.classic_theme_container').animate({
          scrollTop: (indexOfTime * 41) - 50
        }, 100);
      }else{
        $('.classic_theme_container').animate({
          scrollTop: 0
        }, 100);
      }
    }

    generateInputFields(){
      // <Datetime
      //   key={key}
      //   onChange = {this.changeDate.bind(this)}
      //   inputProps = {{placeholder:'Select Date and Time',className:"mks_task_date_time"}}
      //   defaultValue= {this.state.selectedDay}
      //   />
     return this.props.addFieldsObj.map((field,key)=>{
              if(field.type=="date"){
                return(
                <span className="date_wrapper__mks" key={key}>
                  <DatePicker
                      selected={this.state.startDate}
                      onChange={this.handleChange}
                      className={"react-date-wrapper_mks"}
                  />
                  <TimePicker
                      theme="classic"
                      withoutIcon={true}
                      time={this.state.times}
                      onTimeChange={this.onTimeChange.bind(this)}
                      onMeridiemChange={this.onMeridiemChange.bind(this)}
                      timeMode="12"
                      onFocusChange={this.onFocusChange.bind(this)}
                    />

                </span>
                )
              }else if(field.type=="textarea"){
                  return(
                    <textarea
                      key={key}
                      placeholder = {field.placeholder}
                      id={field.id}
                      onChange={this.handleOnChange.bind(this) }
                      value = {this.state[field.id]}
                    />
                  )
              }
              else if(field.type=="li"){
                return (
                  <ul key={key} className={field.className}>
                    {(field.extraTitle) &&
                      <label>{field.extraTitle}</label>
                    }
                    {this.generateLi(field.value,field.stateType)}
                  </ul>
                )
              }
              if(field.type=="checkbox"){
                return (
                  <div className="googlecalndersync">
                  <Checkbox
                    key={key}
                    name="syncgooglecalender"
                    checkboxClass="iradio_square-blue"
                    checked = {this.state.isGoogleSync}
                    increaseArea="20%"
                    onChange = {this.handleCheck.bind(this)}
                    value="googlecalender"
                    label={`<span class='mks-googlesync-text'>${field.placeholder} </span>`}
                  />
                  </div>
                )
              }
              else{
                return(
                  <input
                    key={key}
                    type="text"
                    name={field.name}
                    value={this.state['input'+(key+1)]}
                    onChange={this.handleOnChange.bind(this) }
                    onKeyPress={this.handleKeyPress.bind(this)}
                    disabled={this.state.disabled}
                    id={'input'+(key+1)}
                    className={field.className}
                    data-required = {field.required}
                    data-fieldkey = {field.fieldType}
                    placeholder = {field.placeholder}
                  />
                )
              }

             });

                          event => this.setState({tagName : event.target.value})
    }
    /*return(
      {(obj.tooltip &&
        <span>
          <li key={key} className={obj.className} data-tip={obj.id} onClick={this.clickedLi.bind(this,stateType,obj.id)} dangerouslySetInnerHTML={{__html: obj.placeholder }} />
          <ReactTooltip />
        </span>
      )}

    )*/
    generateLi(liObj,stateType){
      let items = liObj.map((obj,key)=>{
        return (obj.tooltip) ?
              (<span>
                <li key={key} className={obj.className} data-tip={obj.tipName} onClick={this.clickedLi.bind(this,stateType,obj.value)} dangerouslySetInnerHTML={{__html: obj.placeholder }} />
                <ReactTooltip />
              </span>) :
              (  <li key={key} className={obj.className} onClick={this.clickedLi.bind(this,stateType,obj.value)} dangerouslySetInnerHTML={{__html: obj.placeholder }} />)
      });
      return items;
    }
    render(){
      if(!this.props.addFieldsObj){
        return (<div></div>);
      }
      return (
        <div className={`addBox_wrapper_container scfe_field ${this.props.boxType}`}>
          <h2>{(this.state.showUpdateTitle) ? this.state.showUpdateTitle : this.props.showTitle}</h2>
          <div className="addBox_input_wrappers">
          {this.generateInputFields()}

            <div className="scfe_control_option">
                <div className="scfe_close_wrap" onClick={this.handleOnCancel.bind(this)}>
                    <a className="scfe_c_ach" href="#">
                        <div className="scfe_close_t">
                            <span>Close</span>
                        </div>
                        <div className="scfe_close_i_md">
                            <div className="scfe_close_i" aria-hidden="true" data-icon="&#xe915;"></div>
                        </div>
                    </a>
                </div>
                <div className={`scfe_save_wrap disable_${this.state.disabled} ${this.state.extra_btn_class}`} onClick={this.handleOnSave.bind(this)}>
                    <a className="scfe_ach" href="#">
                        <div className="scfe_save_t">
                            <span>{this.state.btnText}</span>
                        </div>
                        <div className="scfe_save_i_md">
                            <div className="scfe_save_i" aria-hidden="true" data-icon="&#xe905;"></div>
                        </div>
                    </a>
                </div>
                <div className="clr"></div>
              </div>
          </div>
        </div>
      );
    }
}


export default AddBox;
