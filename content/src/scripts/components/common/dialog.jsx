import React, {Component} from 'react';
import LoadingMask
       from './Loading_Mask';

class Dialog extends Component{
  constructor(props){
    super(props);
    // common state will be defined here
    this.state = {
      loadingMessage : '',
      showLoading : false
    };

    // preserve the initial state in a new object
    this.baseState = this.state;
  }
 toggleLoadingMask(Message){

   this.setState({
     showLoading : !this.state.showLoading,
     loadingMessage : Message
   })
 }
 handleSave (){
   this.props.saveCallback()
 }
 handleCancel(){
   this.props.closeCallback();
 }
 render(){
    return(
      <div className={`addBox_wrapper_container scfe_field`}>

        <h2>{this.props.showTitle}</h2>
        <div className="addBox_input_wrappers">
          <div className="cc_wraps_mks">
            <LoadingMask message={this.state.loadingMessage} showLoading={this.state.showLoading}  extraClass={"dialog_loading_class_wrap"}/>
            {this.props.children}
          </div>
          <div className="scfe_control_option">
              <div className="scfe_close_wrap" onClick={this.handleCancel.bind(this)}>
                  <a className="scfe_c_ach" href="#">
                      <div className="scfe_close_t">
                          <span>Close</span>
                      </div>
                      <div className="scfe_close_i_md">
                          <div className="scfe_close_i" aria-hidden="true" data-icon="&#xe915;"></div>
                      </div>
                  </a>
              </div>
              <div className={`scfe_save_wrap disable_${this.state.disabled}`} onClick={this.handleSave.bind(this)}>
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

export default Dialog;
