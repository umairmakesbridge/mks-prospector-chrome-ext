import React, {Component}
       from 'react';
import request
       from 'superagent';
import {encodeHTML,decodeHTML}
       from '../common/Encode_Method';
import {ErrorAlert,SuccessAlert}
              from '../common/Alerts';
class CustomFields extends Component{
  constructor(props){
    super(props);
    this.users_details = this.props.users_details;
    this.baseUrl = this.props.baseUrl;

    this.state = {
      CustomField : '',
      showLabel  : 'show',
      showInput : 'hide',
      customFieldKeys : [],
      setFullHeight : '',
      setFullHeight : '',
      collapseMsg: 'Click to expand',
      collapseExpand:'expand'
    }
    if(this.props.custom_fields){
    const Fields = this.props.custom_fields;

    let customFieldsArray = [];
    jQuery.each(Fields[0],(key,value)=>{
                        customFieldsArray.push(value[0])
                      });
      console.log(customFieldsArray);

      // Setting State keys and values
      customFieldsArray.map((field,key)=>
                                this.state[Object.keys(field)[0]] = decodeHTML(field[Object.keys(field)[0]])
                          )
      // Keys into Array
      customFieldsArray.map((field,key)=>
                                this.state.customFieldKeys.push(Object.keys(field)[0])
                          )
    }
  }

  updateCustomFields(){
    this.setState({ showInput : 'hide',showLabel : 'show' });
    let reqObj = {};
    this.state.customFieldKeys.map((field,key)=>
                            reqObj["frmFld_"+encodeHTML(field)] = this.state[field]
                        );
    console.log(reqObj);
    reqObj["subNum"] = this.props.contact.subNum;
    reqObj["firstName"] = this.props.contact.firstName;
    reqObj["lastName"] = this.props.contact.lastName;
    reqObj["company"] = this.props.contactInfoState.company;
    reqObj["telephone"] = this.props.contactInfoState.telephone;
    reqObj["city"] = this.props.contactInfoState.city;
    reqObj["state"] = this.props.contactInfoState.state;
    reqObj["address1"] = this.props.contactInfoState.address1;
    reqObj["jobStatus"] = this.props.contactInfoState.jobStatus;
    reqObj["salesRep"] = this.props.contactInfoState.salesRep;
    reqObj["salesStatus"] = this.props.contactInfoState.salesStatus;
    reqObj["birthDate"] = this.props.contactInfoState.birthDate;
    reqObj["areaCode"] = this.props.contactInfoState.areaCode;
    reqObj["country"] = this.props.contactInfoState.country;
    reqObj["zip"] = this.props.contactInfoState.zip;
    reqObj["address2"] = this.props.contactInfoState.address2;
    reqObj["industry"] = this.props.contactInfoState.industry;
    reqObj["source"] = this.props.contactInfoState.source;
    reqObj["occupation"] = this.props.contactInfoState.occupation;

    reqObj["ukey"] = this.props.users_details[0].userKey;
    reqObj["listNum"] = this.props.users_details[0].listObj['listNum'];
    reqObj["isMobileLogin"] = 'Y';
    reqObj["userId"] = this.props.users_details[0].userId;


    request.post(this.baseUrl+'/io/subscriber/setData/?BMS_REQ_TK='+this.users_details[0].bmsToken+'&type=editProfile')
       .set('Content-Type', 'application/x-www-form-urlencoded')
       .send(reqObj)
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
            this.props.getSubscriberDetails();
          }else{
            ErrorAlert({message : jsonResponse[1]});
          }
        });
  }
  toggleHeight(){
      if(this.state.setFullHeight){
        this.setState({setFullHeight : '',collapseMsg: 'Click to expand',collapseExpand:'expand'});
      }else{
        this.setState({setFullHeight : 'heighAuto',collapseMsg: 'Click to collapse',collapseExpand:'collapse'});
      }
  }
  cancelField(){
    const Fields = this.props.custom_fields;
    let customFieldsArray = [];
    jQuery.each(Fields[0],(key,value)=>{
                        customFieldsArray.push(value[0])
                      });
      customFieldsArray.map((field,key)=>
                            this.state[Object.keys(field)[0]] = decodeHTML(field[Object.keys(field)[0]])
                            )
      this.setState({
        showLabel  : 'show',
        showInput : 'hide',
        setFullHeight : '',
        collapseMsg: 'Click to expand',
        collapseExpand:'expand'
      })
  }
  ChangeHandler(objKey,event){
    this.state[objKey] = event.target.value;
    this.forceUpdate();
  }
  showInputCF(){
    this.setState({ showInput : 'show',showLabel : 'hide', setFullHeight : 'heighAuto', collapseMsg: 'Click to collapse', collapseExpand:'collapse'  });
    setTimeout(function(){
        jQuery('.customFields_ul input').eq(0).focus();
    },500)
  }
  generateCustomFields(customFieldsArray){
    return this.state.customFieldKeys.map((field,key)=>
                              <li key={field} >
                                <div>
                                <span className={`mksph_contact_title`}>{decodeHTML(field)} :</span>
                                  <span className={`mksph_contact_value ${this.state.showLabel}`}>{ decodeHTML(this.state[field])  }</span>
                                  <input className={`${this.state.showInput}`} value={ decodeHTML(this.state[field]) } onChange = { this.ChangeHandler.bind(this,field) } />
                                  </div>
                                  </li>
                        );
  }
  render(){
    if(!this.props.custom_fields){
      return (<div><p className="not-found">No custom fields available.</p></div>)
    }

    return (
      <div className="customField_ul_wraps">
        <span className={`mkb_btn mkb_cf_btn pull-right ${this.state.showLabel}`} onClick={this.showInputCF.bind(this)}>Edit</span>
        <span className={`mkb_btn mkb_cf_btn pull-right ${this.state.showInput}`} onClick={this.cancelField.bind(this)}>Cancel</span>
        <span className={`mkb_btn mkb_cf_btn mkb_greenbtn mkb_done pull-right ${this.state.showInput}`} onClick={ this.updateCustomFields.bind(this) }>Done</span>
      <div className={`csfields-contents scfe_field height90 ${this.state.setFullHeight}`}>

        <ul className="customFields_ul">{this.generateCustomFields()}</ul>

        </div>
        <div className={`${this.state.collapseExpand}`} onClick={this.toggleHeight.bind(this)}>
          <span>{this.state.collapseMsg}</span>
          <span className="mksicon-ArrowNext"></span>
        </div>
      </div>
    )
  }

}



export default CustomFields;
