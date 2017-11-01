import React,{Component} from 'react';
import ToggleDisplay
       from 'react-toggle-display';
import request
       from 'superagent';
import {ErrorAlert,SuccessAlert}
       from '../common/Alerts';
import LoadingMask
       from '../common/Loading_Mask';
class ContactBasicInfo extends Component{
  constructor(props){
    super(props);
LoadingMask
    const acronym = '';
    this.baseUrl=this.props.baseUrl;
    this.users_details = this.props.users_details;
    this.state = {
         showContact : true,
         editContact : false,
         acronym : '',
         disabled: false,
         showStatus:false
    }


    if(this.props.contactInfo && this.props.contactInfo.firstName && this.props.contactInfo.lastName){
      let str     = this.props.contactInfo.firstName + this.props.contactInfo.lastName;
      let matches = str.match(/\b(\w)/g);
      this.state.acronym =  matches.join('');
    }else{
      this.state.acronym = this.props.contactInfo['email'].charAt(0);
    }



  }
  createContactRequest(){

    if(this.state.firstName || !this.state.lastName){
      this.setState({
        showContact : true,
        editContact : false,
        showStatus  : true,
        statusMessage : 'Creating contact using email'
      })
    }else{
      this.setState({
        disabled:true
      });
    }
    request.post(this.baseUrl+'/io/subscriber/setData/?BMS_REQ_TK='+this.users_details[0].bmsToken+'&type=addSubscriber')
       .set('Content-Type', 'application/x-www-form-urlencoded')
       .send({
                 email:this.props.contactInfo.email
                ,ukey:this.users_details[0].userKey
                ,firstName:this.state.firstName
                ,lastName : this.state.lastName
                ,company  : this.state.company
                ,listNum  : this.users_details[0].listObj['listNum']
                ,isMobileLogin:'Y'
                ,userId:this.users_details[0].userId
              })
       .then((res) => {
          console.log(res.status);

          var jsonResponse =  JSON.parse(res.text);
          console.log(jsonResponse);
          if(jsonResponse[0]=="success"){
            this.setState({
              showContact : true,
              editContact : false,
              disabled    : false,
              //statusMessage : 'Contact created successfully.'
            })
            SuccessAlert({message:"Contact created successfully."});
            this.props.contactInfo['subNum'] = jsonResponse[1];
            this.props.contactInfo['checkSum'] = jsonResponse[2];

            let _this = this;
            setTimeout(function(){
                _this.state['showStatus']= false;

            },1000)
            this.props.updateContactHappened();

          }else{
            let errormsg = (jsonResponse[0]=="err") ? jsonResponse[1] : "Something went wrong.Please try again later.";
            ErrorAlert({message:errormsg});
            this.setState({showStatus : false});
          }
        });
  }

  updateContactRequest(){

    this.setState({
      disabled:true
    })

    request.post(this.baseUrl+'/io/subscriber/setData/?BMS_REQ_TK='+this.users_details[0].bmsToken+'&type=editProfile')
       .set('Content-Type', 'application/x-www-form-urlencoded')
       .send({
                 subNum: this.props.contact.subNum
                ,firstName:this.state.firstName
                ,lastName: this.state.lastName
                //,company: this.state.company
                ,ukey:this.users_details[0].userKey
                ,listNum  : this.users_details[0].listObj['listNum']
                ,isMobileLogin:'Y'
                ,userId:this.users_details[0].userId
              })
       .then((res) => {
          console.log(res.status);

          var jsonResponse =  JSON.parse(res.text);
          console.log(jsonResponse);
          if(jsonResponse.success){
            this.setState({
              showContact : true,
              editContact : false,
              disabled    : false
            })
            SuccessAlert({message:"Contact updated successfully."});
            this.props.contact['company'] = this.state.company;
            this.props.updateContactHappened();

          }
        });


  }

  render(){
    if(!this.props.contact){
      return (
        <div>
      <ToggleDisplay show={this.state.showContact}>
        <div className="scf_option">
          <LoadingMask message={this.state.statusMessage} showLoading={this.state.showStatus} extraClass={"alignloadingClass"}/>

            <div className="scf_option_control one">
                <div className="scf_option_panel">
                    <div className="scf_o_left">
                        <div className="scf_o_gear_w ripple">
                            <a href="#"><div className="scf_o_gear" aria-hidden="true" data-icon="&#xe911;"></div></a>
                        </div>
                    </div>
                    <div className="scf_o_right">

                        <ul>
                            <li className="wrap_scf_o_create_contact" onClick={switchContact=> { this.setState({ showContact : false,editContact : true}) } } >
                                <div className="scf_option_icon ripple">
                                    <a href="#">
                                        <div className="wrap_scf_o_i">
                                            <div className="wrap_scf_o_i_md"  >
                                                <div className="scf_o_icon scf_o_edit" aria-hidden="true" data-icon="&#xe914;"></div>
                                                <p className="scf_o_txt">Create</p>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="s_contact_found">
                <div className="scf_silhouette">
                    <div className="scf_silhouette_text">
                        <p>{this.state.acronym}</p>
                    </div>
                </div>
                <div className="scf_email_wrap">
                    <div className="scf_email">
                      <span>{this.props.contactInfo.firstName} </span>
                      <span> {this.props.contactInfo.lastName}</span>
                      <div className="clr"></div>
                      <span >{this.props.contactInfo.email}</span>
                    </div>
                </div>
                <div className="clr"></div>
            </div>
        </div>
        </ToggleDisplay>
        <ToggleDisplay show={this.state.editContact}>
          <div className="scf_option">

                           <div className="s_contact_found">
                               <div className="scf_silhouette">
                                   <div className="scf_silhouette_text">
                                       <p>{this.state.acronym}</p>
                                   </div>
                               </div>
                               <div className="scf_email_wrap">
                                   <div className="scf_email">
                                       <p>{this.props.contactInfo.email}</p>
                                   </div>
                               </div>
                               <div className="clr"></div>
                           </div>
                       </div>
          <div className="s_contact_found_edit_wraper">
              <div className="s_contact_found_edit">
                  <div className="scfe_field">
                      <input placeholder="First Name" disabled={this.state.disabled} onChange={event=> { this.setState({firstName: event.target.value }) } } />
                      <input placeholder="Last Name"  disabled={this.state.disabled} onChange={event=> { this.setState({lastName: event.target.value }) } } />
                      <input placeholder="Company" className="hide"    disabled={this.state.disabled} onChange={event=> { this.setState({company: event.target.value }) } } />

                  </div>
                  <div className="scfe_control_option">
                      <div className="scfe_close_wrap" onClick={ switchContact=>{ this.setState({editContact:false,showContact:true}) } }>
                          <a className="scfe_c_ach" href="#">
                              <div className="scfe_close_t">
                                  <span>Close</span>
                              </div>
                              <div className="scfe_close_i_md">
                                  <div className="scfe_close_i" aria-hidden="true" data-icon="&#xe915;"></div>
                              </div>
                          </a>
                      </div>
                      <div className={`scfe_save_wrap disable_${this.state.disabled}`} onClick={this.createContactRequest.bind(this)}>
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
        </ToggleDisplay>
      </div>
      );
    }

    if(this.props.contact){
    return (
      <div>
      <ToggleDisplay show={this.state.showContact}>
        <div className="scf_option">
            <div className="scf_option_control one">
                <div className="scf_option_panel">
                    <div className="scf_o_left">
                        <div className="scf_o_gear_w ripple">
                            <a href="#"><div className="scf_o_gear" aria-hidden="true" data-icon="&#xe911;"></div></a>
                        </div>
                    </div>
                    <div className="scf_o_right">
                        <ul>
                            <li onClick={switchContact=> { this.setState({ showContact : false,editContact : true,firstName: this.props.contact.firstName,lastName: this.props.contact.lastName,title: this.props.contact.title,company: this.props.contact.company}) } }>
                                <div className="scf_option_icon ripple">
                                    <a href="#">
                                        <div className="wrap_scf_o_i">
                                            <div className="wrap_scf_o_i_md"  >
                                                <div className="scf_o_icon scf_o_edit" aria-hidden="true" data-icon="&#xe914;"></div>
                                                <p className="scf_o_txt">Edit</p>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="s_contact_found">
                <div className="scf_silhouette">
                    <div className="scf_silhouette_text">
                        <p>{this.state.acronym}</p>
                    </div>
                </div>
                <div className="scf_email_wrap">
                    <div className="scf_email">
                      <span>{this.props.contactInfo.firstName} </span>
                      <span> {this.props.contactInfo.lastName}</span>
                      <div className="clr"></div>
                      <span>{this.props.contactInfo.email}</span>
                    </div>
                </div>
                <div className="clr"></div>
            </div>
        </div>
     </ToggleDisplay>

     <ToggleDisplay show={this.state.editContact}>
       <div className="scf_option">
                        <div className="s_contact_found">
                            <div className="scf_silhouette">
                                <div className="scf_silhouette_text">
                                    <p>{this.state.acronym}</p>
                                </div>
                            </div>
                            <div className="scf_email_wrap">
                                <div className="scf_email">
                                    <p>{this.props.contactInfo.email}</p>
                                </div>
                            </div>
                            <div className="clr"></div>
                        </div>
                    </div>
       <div className="s_contact_found_edit_wraper">
           <div className="s_contact_found_edit">
               <div className="scfe_field">
                   <input placeholder="First Name" disabled={this.state.disabled}  value= {this.state.firstName} onChange={event=> { this.setState({firstName: event.target.value }) } } />
                   <input placeholder="Last Name"  disabled={this.state.disabled}  value={this.state.lastName} onChange={event=> { this.setState({lastName: event.target.value }) } } />
                   <input placeholder="Company" className="hide"    disabled={this.state.disabled}  value={this.state.company} onChange={event=> { this.setState({company: event.target.value }) } } />

               </div>
               <div className="scfe_control_option">
                   <div className="scfe_close_wrap" onClick={ switchContact=>{ this.setState({editContact:false,showContact:true}) } }>
                       <a className="scfe_c_ach" href="#">
                           <div className="scfe_close_t">
                               <span>Close</span>
                           </div>
                           <div className="scfe_close_i_md">
                               <div className="scfe_close_i" aria-hidden="true" data-icon="&#xe915;"></div>
                           </div>
                       </a>
                   </div>
                   <div className={`scfe_save_wrap disable_${this.state.disabled}`} onClick={this.updateContactRequest.bind(this)}>
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
     </ToggleDisplay>

     </div>
      );
    }
  }
}

export default ContactBasicInfo
