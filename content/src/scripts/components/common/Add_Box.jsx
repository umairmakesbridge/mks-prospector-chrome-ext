import React,{Component} from 'react';
import {encodeHTML,decodeHTML}
       from './Encode_Method';
var Datetime = require('react-datetime');

class AddBox extends Component{
    constructor(props){
        super(props);
        console.log('Add Box',this.props.addFieldsObj);
        this.state = {
          disabled : false,
          selectedDay: undefined
        };
        var _this = this;
        jQuery.each(this.props.addFieldsObj,function(key,value){
                  if(value.type=="date"){
                    _this.state['date'] = "";
                  }else if(value.type=="li"){
                    _this.state[value.stateType] = "";
                  }else if(value.type=="textarea"){
                    _this.state[value.id] = "";
                  }
                  else{
                    _this.state['input'+(key+1)] = "";
                  }

        });
        //this.handleDayClick = this.handleDayClick;
        // preserve the initial state in a new object
        this.baseState = this.state
    }
    handleOnSave(){
      console.log('Show Box Save Callback');

      let els = document.querySelectorAll("div.addBox_wrapper_container input");
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
                  if(isValid){
                    debugger;
                    /*jQuery("div.addBox_wrapper_container input").removeClass('hasError');
                    this.setState({disabled : true});
                    if(this.props.boxType=="customFields"){
                      this.props.create("customFields",[els[0].value,els[1].value]);
                      //setTimeout(function(){this.setState(this.baseState);}.bind(this),2000);
                    }*/

                  }
    }
    setDefaultState(){
      this.setState(this.baseState);
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
      this.props.cancel();
    }
    clickedLi(stateLi,event){
      var targetLi = event.currentTarget;
      $(targetLi).parent().find('li').removeClass('active');
      $(targetLi).addClass('active');
      this.setState({
        [stateLi] : $(targetLi).text()
      })
    }
    changeDate(momentDate){
      console.log(momentDate.format('YYYY-MM-DD h:mm:ss'));
      this.setState({
        selectedDay : momentDate.format('YYYY-MM-DD h:mm:ss')
      });
    }
    generateInputFields(){

     return this.props.addFieldsObj.map((field,key)=>{
              if(field.type=="date"){
                return(
                  <Datetime
                    key={key}
                    onChange = {this.changeDate.bind(this)}
                    inputProps = {{placeholder:'Select Date and Time',className:"mks_task_date_time"}}
                    />
                )
              }else if(field.type=="textarea"){
                  return(
                    <textarea
                      key={key}
                      placeholder = {field.placeholder}
                      id={field.id}
                      onChange={this.handleOnChange.bind(this) }
                    />
                  )
              }
              else if(field.type=="li"){
                return (
                  <ul key={key} className={field.className}>
                    {this.generateLi(field.value,field.stateType)}
                  </ul>
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
    generateLi(liObj,stateType){
      let items = liObj.map((obj,key)=>{
        return(
          <li key={key} className={obj.className} onClick={this.clickedLi.bind(this,stateType)}>{obj.placeholder}</li>
        )
      });
      return items;
    }
    render(){
      if(!this.props.addFieldsObj){
        return (<div></div>);
      }
      return (
        <div className={`addBox_wrapper_container scfe_field`}>
          <h2>{this.props.showTitle}</h2>
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
                <div className={`scfe_save_wrap disable_${this.state.disabled}`} onClick={this.handleOnSave.bind(this)}>
                    <a className="scfe_ach" href="#">
                        <div className="scfe_save_t">
                            <span>Save</span>
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
