import React,{Component} from 'react';
import ToggleDisplay
       from 'react-toggle-display';
import request
       from 'superagent';


class ContactBasicInfo extends Component{
  constructor(props){
    super(props);

    const acronym = '';
    this.baseUrl=this.props.baseUrl;
    this.users_details = this.props.users_details;
    this.state = {
         showContact : true,
         editContact : false,
         acronym : ''
    }


    if(this.props.contactInfo && this.props.contactInfo.firstName && this.props.contactInfo.lastName){
      let str     = this.props.contactInfo.firstName + this.props.contactInfo.lastName;
      let matches = str.match(/\b(\w)/g);
      this.state.acronym =  matches.join('');
    }else{
      this.state.acronym = this.props.contactInfo['email'].charAt(0);
    }



  }

  updateContactRequest(){
    request.post(this.baseUrl+'/io/subscriber/setData/?BMS_REQ_TK='+this.users_details[0].bmsToken+'&type=editProfile')
       .set('Content-Type', 'application/x-www-form-urlencoded')
       .send({
                 subNum: this.props.contact.subNum
                ,firstName:this.state.firstName
                ,lastName: this.state.lastName
                ,company: this.state.company
                ,ukey:this.users_details[0].userKey
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
              editContact : false
            })
            this.props.updateContactHappened();

          }
        });


  }

  render(){

    return (
      <div>
      <ToggleDisplay show={this.state.showContact}>
      <div className="s_contact_found s_contact_height">
        <div className="slide-btns one s-clr2">
                            <strong>
                              <div className="scf_o_gear icon setting" aria-hidden="true" data-icon="&#xe911;"></div>
                            </strong>
                            <div>
                                  <a className="icon edit-camp edit clr1" onClick={switchContact=> { this.setState({ showContact : false,editContact : true,firstName: this.props.contact.firstName,lastName: this.props.contact.lastName,title: this.props.contact.title,company: this.props.contact.company}) } }><span>Edit</span></a>


                             </div>
                      </div>
            <div className="scf_silhouette">
                <div className="scf_silhouette_text">
                    <p>{this.state.acronym}</p>
                </div>
                <div className="scf_silhouette_img hide">
                    <img src="img/scf_silhouette.png" />
                </div>
            </div>
            <div className="scf_email">
                <span>{this.props.contactInfo.firstName} </span>
                <span> {this.props.contactInfo.lastName}</span>
                <div class="clr"></div>
                <span>{this.props.contactInfo.email}</span>
            </div>
            <div className="clr"></div>
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
                   <input placeholder="First Name" value= {this.state.firstName} onChange={event=> { this.setState({firstName: event.target.value }) } } />
                   <input placeholder="Last Name" value={this.state.lastName} onChange={event=> { this.setState({lastName: event.target.value }) } } />
                   <input placeholder="Company" value={this.state.company} onChange={event=> { this.setState({company: event.target.value }) } } />

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
                   <div className="scfe_save_wrap" onClick={this.updateContactRequest.bind(this)}>
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

export default ContactBasicInfo
