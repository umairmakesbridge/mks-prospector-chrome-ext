import React,{Component} from 'react';
import ToggleDisplay
       from 'react-toggle-display';
import request
       from 'superagent';
import {ErrorAlert,SuccessAlert}
       from '../common/Alerts';
import LoadingMask
       from '../common/Loading_Mask';
import AddBox
       from '../common/Add_Box';
import {encodeHTML,decodeHTML}
       from '../common/Encode_Method';

class ContactBasicInfo extends Component{
  constructor(props){
    super(props);
    const acronym = '';
    this.baseUrl=this.props.baseUrl;
    this.users_details = this.props.users_details;
    this.state = {
         showContact : true,
         editContact : false,
         acronym : '',
         disabled: false,
         showStatus:false,
         showAddBox : false,
         setFullHeight : '',
         newCustomFieldsArray : [],
         collapseMsg : 'Click to expand',
         collapseExpand : 'expand',
         showCFTitle : 'hide'
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
    let reqObj = {};
    this.state.newCustomFieldsArray.map((field,key)=>
                            reqObj["frmFld_"+encodeHTML(Object.keys(field)[0])] = field[Object.keys(field)[0]]
                        );
    console.log(reqObj);
            reqObj['email']=this.props.contactInfo.email
            reqObj['ukey']=this.props.users_details[0].userKey
            reqObj['firstName']=this.state.firstName
            reqObj['lastName'] = this.state.lastName
            reqObj['company'] = this.state.company
            reqObj['telephone'] = this.state.telephone
            reqObj['city']= this.state.city
            reqObj['state']= this.state.state
            reqObj['address1']= this.state.address1
            reqObj['jobStatus']= this.state.jobStatus
            reqObj['salesRep']= this.state.salesRep
            reqObj['salesStatus']= this.state.salesStatus
            reqObj['birthDate']= this.state.birthDate
            reqObj['areaCode']= this.state.areaCode
            reqObj['country']= this.state.country
            reqObj['zip']= this.state.zip
            reqObj['address2']= this.state.address2
            reqObj['industry']= this.state.industry
            reqObj['source']= this.state.source
            reqObj['occupation']= this.state.occupation
            reqObj['listNum']  = this.props.users_details[0].listObj['listNum']
            reqObj['isMobileLogin']='Y'
            reqObj['userId']=this.props.users_details[0].userId

    request.post(this.baseUrl+'/io/subscriber/setData/?BMS_REQ_TK='+this.props.users_details[0].bmsToken+'&type=addSubscriber')
       .set('Content-Type', 'application/x-www-form-urlencoded')
       .send(reqObj)
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

    request.post(this.baseUrl+'/io/subscriber/setData/?BMS_REQ_TK='+this.props.users_details[0].bmsToken+'&type=editProfile')
       .set('Content-Type', 'application/x-www-form-urlencoded')
       .send({
                 subNum: this.props.contact.subNum
                ,firstName:this.state.firstName
                ,lastName: this.state.lastName
                ,company: this.props.contact.company
                ,telephone: this.props.contact.telephone
                ,city: this.props.contact.city
                ,state: this.props.contact.state
                ,address1: this.props.contact.address1
                ,jobStatus: this.props.contact.jobStatus
                ,salesRep: this.props.contact.salesRep
                ,salesStatus: this.props.contact.salesStatus
                ,birthDate: this.props.contact.birthDate
                ,areaCode: this.props.contact.areaCode
                ,country: this.props.contact.country
                ,zip: this.props.contact.zip
                ,address2: this.props.contact.address2
                ,industry: this.props.contact.industry
                ,source: this.props.contact.source
                ,occupation: this.props.contact.occupation
                ,ukey:this.props.users_details[0].userKey
                ,listNum  : this.props.users_details[0].listObj['listNum']
                ,isMobileLogin:'Y'
                ,userId:this.props.users_details[0].userId
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
  handleOnEnter (type,event){
    const code = event.keyCode || event.which;
    if(code == 13){
      console.log('Enter Is recieved from Contact Baisc with tyle : '+type);
      if(type=="update"){
        this.updateContactRequest();
      }else{
        this.createContactRequest();
      }
    }
  }
  switchContact(type){
    if(type=="edit"){
      this.setState({ showContact : false,editContact : true,firstName: this.props.contact.firstName,lastName: this.props.contact.lastName,title: this.props.contact.title,company: this.props.contact.company})
    }else{
      this.setState({ showContact : false,editContact : true});
    }


    setTimeout(function(){
        jQuery('#firstName').focus();
    },500)
  }
  addCustomFields(type,arrayObj){
    var obj = {};
    obj[arrayObj[0]] = arrayObj[1];

    this.state.newCustomFieldsArray.push(obj);
    this.hideAddCus();
  }
  hideAddCus(){
    this.setState({showAddBox : false});
  }
  populateCustomFields(){
    if(this.state.newCustomFieldsArray.length > 0){
      if(this.state.showCFTitle == 'hide'){
        this.setState({'showCFTitle' :  'show'});
      }

      return this.state.newCustomFieldsArray.map((field,key)=>

                                <div key={key}>
                                  <span className={`mksph_contact_title`}>{Object.keys(field)[0]} :</span>
                                    <span className={`mksph_contact_value ${this.state.showLabel}`}>{ field[Object.keys(field)[0]]  }</span>
                                      <i onClick={this.removeCustomObj.bind(this,field)}>delete</i>
                                  </div>
                          );

    }
  }

  removeCustomObj(field){
    let newAr = this.state.newCustomFieldsArray;
    var idx = newAr.indexOf(field);
     if (idx !== -1) {
         newAr.splice(idx, 1);
     }
    this.setState({newCustomFieldsArray : newAr});

  }
  toggleHeight(){
      if(this.state.setFullHeight){
        this.setState({setFullHeight : '',collapseMsg: 'Click to expand',collapseExpand:'expand'});
      }else{
        this.setState({setFullHeight : 'heighAuto',collapseMsg: 'Click to collapse',collapseExpand:'collapse'});
      }
  }
  switchShowBox(){
    this.setState({showAddBox : true});
    setTimeout(function(){
        jQuery('.focusThis').focus();
    },500)
  }

  cancelCreate(){
    jQuery('.mksph_back').trigger('click');
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
                            <li className="wrap_scf_o_create_contact" onClick={this.switchContact.bind(this,'create') } >
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
                        <p>{this.state.acronym}  </p>
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
                  <div className={`scfe_field height90 height100 ${this.state.setFullHeight}`}>
                      <input placeholder="First Name" id="firstName" disabled={this.state.disabled} onChange={event=> { this.setState({firstName: event.target.value }) } } onKeyPress = {this.handleOnEnter.bind(this,'create')} />
                      <input placeholder="Last Name"  disabled={this.state.disabled} onChange={event=> { this.setState({lastName: event.target.value }) } } />
                      <input placeholder="Company"    disabled={this.state.disabled} onChange={event=> { this.setState({company: event.target.value }) } } />

                      <input placeholder="Telephone"  disabled={this.state.disabled} onChange={event=> { this.setState({telephone: event.target.value }) } } />
                      <input placeholder="City"    disabled={this.state.disabled} onChange={event=> { this.setState({city: event.target.value }) } } />
                      <input placeholder="State"    disabled={this.state.disabled} onChange={event=> { this.setState({state: event.target.value }) } } />
                      <input placeholder="Address1"    disabled={this.state.disabled} onChange={event=> { this.setState({address1: event.target.value }) } } />
                      <input placeholder="Job Status"    disabled={this.state.disabled} onChange={event=> { this.setState({jobStatus: event.target.value }) } } />
                      <input placeholder="Sales Rep"    disabled={this.state.disabled} onChange={event=> { this.setState({salesRep: event.target.value }) } } />
                      <input placeholder="Sales Status"    disabled={this.state.disabled} onChange={event=> { this.setState({salesStatus: event.target.value }) } } />
                      <input placeholder="Birth Date"    disabled={this.state.disabled} onChange={event=> { this.setState({birthDate: event.target.value }) } } />
                      <input placeholder="Area Code"    disabled={this.state.disabled} onChange={event=> { this.setState({areaCode: event.target.value }) } } />
                      <input placeholder="Country"    disabled={this.state.disabled} onChange={event=> { this.setState({country: event.target.value }) } } />
                      <input placeholder="Zip"    disabled={this.state.disabled} onChange={event=> { this.setState({zip: event.target.value }) } } />
                      <input placeholder="Address 2"    disabled={this.state.disabled} onChange={event=> { this.setState({address2: event.target.value }) } } />
                      <input placeholder="Industry"    disabled={this.state.disabled} onChange={event=> { this.setState({industry: event.target.value }) } } />
                      <input placeholder="Source"    disabled={this.state.disabled} onChange={event=> { this.setState({source: event.target.value }) } } />
                      <input placeholder="Occupation"    disabled={this.state.disabled} onChange={event=> { this.setState({occupation: event.target.value }) } } />

                  </div>

                  <div className={`${this.state.collapseExpand}`} onClick={this.toggleHeight.bind(this)}>
                    <span>{this.state.collapseMsg}</span>
                    <span className="mksicon-ArrowNext"></span>
                  </div>
                  <div className="new_custom_field_wraps">
                      <h4 className={`${this.state.showCFTitle}`}>Custom Fields</h4>
                      {this.populateCustomFields()}
                  </div>
                  <div className="scfe_control_option">
                      <div className="scfe_close_wrap" onClick={ this.cancelCreate.bind(this) }>
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
                      <div className={`scfe_save_wrap disable_${this.state.disabled} cfe_add_customField`} onClick={ this.switchShowBox.bind(this) } >
                          <a className="scfe_ach" href="#">
                              <div className="scfe_save_t">
                                  <span>Add Custom Field</span>
                              </div>
                          </a>
                      </div>
                      <div className="clr"></div>
                  </div>
              </div>
          </div>
          <ToggleDisplay show={this.state.showAddBox}>
              <AddBox
                addFieldsObj={ [{name : "ckey", className:"focusThis", required:'required', id: "ckey",placeholder:"Enter Key*"},
                                {name : "cvlaue", className:"", id: "cvalue",placeholder:"Enter Value"}] } boxType={"customFields"}
                create={this.addCustomFields.bind(this)}
                cancel={this.hideAddCus.bind(this)}
                showTitle={"Add New Custom Field"}
              />
              <div className="OverLay" style={{height : (this.state.overlayHeight+"px" )}}></div>
          </ToggleDisplay>
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
                            <li onClick={this.switchContact.bind(this,'edit') }>
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
                   <input placeholder="First Name" id="firstName" disabled={this.state.disabled}  value= {this.state.firstName} onChange={event=> { this.setState({firstName: event.target.value }) } } onKeyPress = {this.handleOnEnter.bind(this,'update')} />
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
