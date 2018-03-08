import React, {Component}
       from 'react';
import request
       from 'superagent';
import {ErrorAlert,SuccessAlert}
       from '../common/Alerts.jsx';
import ToggleDisplay
       from 'react-toggle-display';
import Dialog
       from '../common/dialog';
import ContactBasicInfo
       from './Contact_Basic_Info';
import {encodeHTML,decodeHTML}
       from '../common/Encode_Method';
class AddNewContact extends Component{
  constructor(props) {
      super(props);
      this.state = {
        showSubscriberCreate : false,
        showAddListWrap : 'show',
        loadingMList : 'hide',
        showManageListWrap : 'hide',
        email : '',
        lastName : '',
        firstName : ''
      };

      // preserve the initial state in a new object
      this.baseState = this.state;
  }

  showCreateDialog(event){
      this.setState({showSubscriberCreate: true});
      setTimeout(function(){
          jQuery('.focusThis').focus();
      },500)
  }
  addContactIntoMks(data){
    alert('Save call needs to be hit');
    let isValid = true;
    let els = document.querySelectorAll("div.create_new_contact input");
    els.forEach((element)=>{
                  if(element.getAttribute('data-required')=='required'){
                      if(!element.value){
                        isValid = false;
                        jQuery(element).addClass('hasError');
                        element.focus();
                      }
                  }

                });
    if(isValid){
      jQuery("div.create_new_contact input").removeClass('hasError');
      this.setState({disabled : true});
      let reqObj = {};
      reqObj['email']=this.state.email
      reqObj['ukey']=this.props.users_details[0].userKey
      reqObj['firstName']=encodeHTML(this.state.firstName)
      reqObj['lastName'] = encodeHTML(this.state.lastName)
      reqObj['company'] = ""
      reqObj['telephone'] =""
      reqObj['city']= ""
      reqObj['state']= ""
      reqObj['address1']= ""
      reqObj['jobStatus']= ""
      reqObj['salesRep']= ""
      reqObj['salesStatus']= ""
      reqObj['birthDate']= ""
      reqObj['areaCode']= ""
      reqObj['country']= ""
      reqObj['zip']= ""
      reqObj['address2']= ""
      reqObj['industry']= ""
      reqObj['source']= ""
      reqObj['occupation']= ""
      reqObj['listNum']  = this.props.users_details[0].listObj['listNum']
      reqObj['isMobileLogin']='Y'
      reqObj['userId']=this.props.users_details[0].userId
      request.post(this.props.baseUrl+'/io/subscriber/setData/?BMS_REQ_TK='+this.props.users_details[0].bmsToken+'&type=addSubscriber')
         .set('Content-Type', 'application/x-www-form-urlencoded')
         .send(reqObj)
         .then((res) => {
            console.log(res.status);

            var jsonResponse =  JSON.parse(res.text);
            console.log(jsonResponse);
            if(jsonResponse[0]=="success"){
              debugger;
              this.setState({
                //showContact : true,
                //editContact : false,
                disabled    : false,
                //statusMessage : 'Contact created successfully.'
              })
              SuccessAlert({message:"Contact created successfully."});
              this.props.onEmailSelect(this.state.email);
              this.closeAddContactIntoMks();
              //this.props.contactInfo['subNum'] = jsonResponse[1];
              //this.props.contactInfo['checkSum'] = jsonResponse[2];

              /*let _this = this;
              setTimeout(function(){
                  _this.state['showStatus']= false;
              },1000)*/
              //this.props.updateContactHappened();

            }else{
              let errormsg = (jsonResponse[0]=="err") ? jsonResponse[1] : "Something went wrong.Please try again later.";
              ErrorAlert({message:errormsg});
              this.setState({showStatus : false});
            }
          });
   }
  }
  setStateDefault(){
    this.setState(this.baseState);
  }
  closeAddContactIntoMks(){
      this.setState({showSubscriberCreate: false});
      //this.refs.childSubscriberList.setStateDefault();
  }
  handleOnEnter(event){
    console.log('Time to handle key');
  }
  render(){
    return (
      <div>
      <ToggleDisplay show={this.state.showSubscriberCreate}>

            <Dialog
              saveCallback= {this.addContactIntoMks.bind(this)}
              showTitle={"Add Contact to List"}
              ref="dialogSubscriberList1"
              closeCallback = {this.closeAddContactIntoMks.bind(this)}
            >
            <div className="s_contact_found_edit_wraper create_new_contact">
                <div className="s_contact_found_edit">
                    <div className={`scfe_field height90 height100 ${this.state.setFullHeight}`}>
                        <input placeholder="Email *" className="focusThis" data-required="required"   disabled={this.state.disabled} onChange={event=> { this.setState({email: event.target.value }) } } />
                        <input placeholder="First Name" id="firstName" disabled={this.state.disabled} onChange={event=> { this.setState({firstName: event.target.value }) } } onKeyPress = {this.handleOnEnter.bind(this,'create')} />
                        <input placeholder="Last Name"  disabled={this.state.disabled} onChange={event=> { this.setState({lastName: event.target.value }) } } />


                    </div>
                        <div className="clr"></div>
                    </div>
                </div>

            </Dialog>
            <div className="OverLay" style={{height : (this.state.overlayHeight+"px" )}}></div>
        </ToggleDisplay>
        <div className="btn_wrap ripple" >
            <span className="mksph_login_btn add_new_btn" onClick={this.showCreateDialog.bind(this)}>Create / Add Contact</span>
        </div>
      </div>
    )
  }

}

export default AddNewContact;