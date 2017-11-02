import React,{Component} from 'react';

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
    }
    handleOnSave(){
      console.log('Show Box Save Callback');
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
    }
    generateInputFields(){

     return this.props.addFieldsObj.map((field,key)=>
                              <input
                                type="text"
                                name={field.name}
                                value={this.state['input'+(key+1)]}
                                onChange={this.handleOnChange.bind(this) }
                                onKeyPress={this.handleKeyPress.bind(this)}
                                disabled={this.state.disabled}
                                id={'input'+(key+1)}
                                className={field.className}
                              />
                          );

                          event => this.setState({tagName : event.target.value})
    }
    render(){
      if(!this.props.addFieldsObj){
        return (<div></div>);
      }
      return (
        <div className="">
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
