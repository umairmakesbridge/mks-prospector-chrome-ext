import React,{Component} from 'react';
import {encodeHTML,decodeHTML}
       from './Encode_Method';
class AddBox extends Component{
    constructor(props){
        super(props);
        console.log('Add Box',this.props.addFieldsObj);
        this.state = {
          disabled : false
        };
        var _this = this;
        jQuery.each(this.props.addFieldsObj,function(key,value){
                  _this.state['input'+(key+1)] = "";
        })
        // preserve the initial state in a new object
        this.baseState = this.state
    }
    handleOnSave(){
      console.log('Show Box Save Callback');
      this.setState({disabled : true})
      let els = document.querySelectorAll("div.addBox_wrapper_container input");
      let requestObj = {};
      let isValid = true;
      console.log(els);
      els.forEach((element)=>{
                    if(element.getAttribute('data-required')=='required'){
                        if(!element.value){
                          isValid = false;
                          jQuery(element).addClass('hasError');
                        }
                    }

                  });
                  console.log(isValid);
                  // If valid Generating Object
                  if(isValid){
                    if(this.props.boxType=="customFields"){
                      this.props.create("customFields",[els[0].value,els[1].value]);
                      this.setState(this.baseState);
                    }

                  }
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
    generateInputFields(){

     return this.props.addFieldsObj.map((field,key)=>
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
                          );

                          event => this.setState({tagName : event.target.value})
    }
    render(){
      if(!this.props.addFieldsObj){
        return (<div></div>);
      }
      return (
        <div className="addBox_wrapper_container scfe_field">
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
      );
    }
}


export default AddBox;
