import React, {Component}
       from 'react';
import request
       from 'superagent';
import {ErrorAlert}
       from '../common/Alerts.jsx';

class LoginForm extends Component {
  constructor(props){
      super(props);
      this.createNewList   = props.createNewList;
      this.checkSubscriberList   = props.checkSubscriberList;
      this.users_details   = props.users_details;
      this.toggleShowLogin = props.toggleShowLogin;
      this.baseUrl         = props.baseUrl;
      this.state = {username : '', password: '',disabled:''};
  }

  render() {
    return (
            <div className="mksph_wrapper">
              <h2>Log In</h2>
              <div className="mksph_cardbox" >
                <form>
                    <input name="username" type="text" disabled={this.state.disabled} placeholder="Enter your username" value={this.state.username} onChange = {event => this.setState({username : event.target.value})}  onKeyPress={this.handleKeyPress.bind(this)} />
                    <input name="password" type="password" disabled={this.state.disabled} placeholder="Enter your password" value={this.state.password} onChange = {event => this.setState({password : event.target.value})} onKeyPress={this.handleKeyPress.bind(this)} />
                    <button name="submit" type="button" disabled={this.state.disabled} className="mksph_login_btn mksph-pull-right ripple" onClick = {this.onClickOfButton.bind(this)} id="submitForm">Login</button>
                </form>
            </div>
          </div>
          );
    }

    handleKeyPress(event) {
        if(event.charCode==13){
            this.onClickOfButton();
        }
    }
    autoLogin(autoUsername,autoPassword){
      //alert('Triggered auto Login');
      this.state.username = autoUsername;
      this.state.password = autoPassword;
      this.onClickOfButton();
    }
    onClickOfButton() {
      //if(this.users_details && this.users_details.length > 0 && this.state.disabled !="disabled"){
      //Check if username or password is empty and button is not disabled.
      if(!this.state.username || !this.state.password || this.state.disabled =="disabled"){
        return;
      }
      this.setState({
          disabled:'disabled'
      });
      var _this = this;
      request.post(this.baseUrl+'/mobile/mobileService/mobileLogin')
         .set('Content-Type', 'application/x-www-form-urlencoded')
         .send({ userId  : this.state.username, password: this.state.password })
         .end((err, res) => {
              if(parseInt(res.body.errorCode) != 2){
                localStorage.setItem('pmks_userpass', this.state.username+'__'+this.state.password);
                console.log(res.body);
                _this.users_details.splice(0,1);
                _this.users_details.push(res.body);
                _this.setState({
                    disabled:''
                })
                _this.toggleShowLogin();
                let userDetails= res.body;


                _this.checkSubscriberList()
                return false;
                //io/list/getListData/?BMS_REQ_TK=2gdvB8OodJGEKIcqnMDVPEh6l8b6uV&offset=0&searchText=abdullah&type=batches&orderBy=name&order=asc




                //console.log(_this.users_details);
              }else{
                _this.setState({
                    disabled:''
                });
                localStorage.removeItem('pmks_userpass');
                ErrorAlert({message:res.body.errorDetail});
              }
         });
    }
};


export default LoginForm;
