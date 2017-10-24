import React, {Component}
       from 'react';
import ToggleDisplay
       from 'react-toggle-display';
import request
       from 'superagent';
import ContactTags
       from './Tags';
import CustomFields
       from './Custom_Fields';
import LoadingMask
       from '../common/Loading_Mask';
import {encodeHTML,decodeHTML}
       from '../common/Encode_Method';
import {ErrorAlert,SuccessAlert}
       from '../common/Alerts';


class ContactDetailInfo extends Component{
  constructor(props){
    super(props);
    let tagsHtml = '';
    this.users_details = this.props.users_details;
    this.baseUrl = this.props.baseUrl;
    this.state = {
      showAddBox : false,
      tagName    : '',
      tagCode    : '',
      disabled: false,
      loadingMessage : '',
      showLoading : false,
      company     : "",
      showLabel  : 'show',
      showInput : 'hide',
      showEdit  : 'show',
      showDone  : 'hide',
      setFullHeight : '',
      telephone : '',
      city: '',
      state: '',
      address1: '',
      jobStatus: '',
      salesRep: '',
      salesStatus: '',
      birthDate: '',
      areaCode: '',
      country: '',
      zip: '',
      address2: '',
      industry: '',
      source: '',
      occupation: '',
      collapseMsg : 'Click to expand'
    }
  };
  updateBasicField(){
    this.setState({ showInput : 'hide',showLabel : 'show' })
    request.post(this.baseUrl+'/io/subscriber/setData/?BMS_REQ_TK='+this.users_details[0].bmsToken+'&type=editProfile')
       .set('Content-Type', 'application/x-www-form-urlencoded')
       .send({
                 subNum: this.props.contact.subNum
                ,company:this.state.company
                ,telephone: this.state.telephone
                ,city: this.state.city
                ,state: this.state.state
                ,address1: this.state.address1
                ,jobStatus: this.state.jobStatus
                ,salesRep: this.state.salesRep
                ,salesStatus: this.state.salesStatus
                ,birthDate: this.state.birthDate
                ,areaCode: this.state.areaCode
                ,country: this.state.country
                ,zip: this.state.zip
                ,address2: this.state.address2
                ,industry: this.state.industry
                ,source: this.state.source
                ,occupation: this.state.occupation
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

          }else{
            ErrorAlert({message : jsonResponse[1]});
          }
        });


  }
  addNewTag(){
    console.log('Add New Tag hit');

    if(!this.state.tagName || this.state.disabled){
      return;
    }
    this.setState({
      disabled:true
    })
    request.post(this.baseUrl+'/io/subscriber/setData/?BMS_REQ_TK='+this.users_details[0].bmsToken)
       .set('Content-Type', 'application/x-www-form-urlencoded')
       .send({
                 type: 'addTag'
                ,tags:''
                ,subNum: this.props.contact.subNum
                ,tag: encodeHTML(this.state.tagName)
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
                tagName:'',
                showAddBox:false,
                disabled:false
            })
            this.props.changeInTagsView();

          }
        });
  }
  deleteTagName(tagName){
    this.setState({
      loadingMessage : 'Deleting '+tagName+' Tag',
      showLoading    : true
    })
    request.post(this.baseUrl+'/io/subscriber/setData/?BMS_REQ_TK='+this.users_details[0].bmsToken)
       .set('Content-Type', 'application/x-www-form-urlencoded')
       .send({
                 type: 'deleteTag'
                ,subNum: this.props.contact.subNum
                ,tag: tagName
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
                tagName:'',
                showAddBox:false
            })
            let _this = this;
            setTimeout(function(){
              _this.setState({loadingMessage: ''});
            },1000);
            this.props.changeInTagsView();

          }else{
            this.setState({
              tagName:'',
              showAddBox:false,
              loadingMessage: ''
            })
          }
        });
  }
  handleOnTagInput (event){
    const code = event.keyCode || event.which;
    if(code == 13){
      this.addNewTag();
    }
  }

  componentWillUpdate(nextProps, nextState){
    console.log('Component Will Update ', nextProps);
    if(nextProps.contact){
      this.state.company = nextProps.contact.company;
      this.state.telephone = nextProps.contact.telephone;
      this.state.city = nextProps.contact.city;
      this.state.state = nextProps.contact.company;
      this.state.address1 = nextProps.contact.address1;
      this.state.jobStatus = nextProps.contact.jobStatus;
      this.state.salesRep = nextProps.contact.salesRep;
      this.state.salesStatus = nextProps.contact.salesStatus;
      this.state.birthDate = nextProps.contact.birthDate;
      this.state.areaCode = nextProps.contact.areaCode;
      this.state.country = nextProps.contact.country;
      this.state.zip = nextProps.contact.zip;
      this.state.address2 = nextProps.contact.address2;
      this.state.industry = nextProps.contact.industry;
      this.state.source = nextProps.contact.source;
      this.state.occupation = nextProps.contact.occupation;

    }
  }
  toggleHeight(){
      if(this.state.setFullHeight){
        this.setState({setFullHeight : ''});
      }else{
        this.setState({setFullHeight : 'heighAuto'});
      }
  }
  render(){
    console.log('Rendering Contact Details');
    if(!this.props.contact && !this.props.contactnotFound){
      return (<div className="contacts-wrap">
      <div id="NoContact" className="tabcontent mksph_cardbox">
            <h3>Contact</h3>
              <p className="not-found">Loading...</p>
          </div>
              </div>);
    }
    if(this.props.contactnotFound){
      return (<div className="contacts-wrap">
      <div id="NoContact" className="tabcontent mksph_cardbox">
            <h3>Contact</h3>
              <p className="not-found">No Contact Found</p>
          </div>
              </div>);
    }
    return (
      <div className="contacts-wrap">
        <div id="Contact" className={`tabcontent mksph_cardbox`}>
              <h3>Contact Info</h3>
                <span className={`mkb_btn pull-right ${this.state.showLabel}`} onClick={showInput => {this.setState({ showInput : 'show',showLabel : 'hide' }) } }>Edit</span>
                <span className={`mkb_btn mkb_done pull-right ${this.state.showInput}`} onClick={ this.updateBasicField.bind(this) }>Done</span>
              <div className={`height90 ${this.state.setFullHeight}`}>
              <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Company : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {this.state.company}</span>
                  <input className={`${this.state.showInput}`} value={this.state.company} onChange = {event => this.setState({company : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Phone : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {this.state.telephone}</span>
                    <input className={`${this.state.showInput}`} value={this.state.telephone} onChange = {event => this.setState({telephone : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">City : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {this.state.city}</span>
                    <input className={`${this.state.showInput}`} value={this.state.city} onChange = {event => this.setState({city : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">State : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {this.state.state}</span>
                    <input className={`${this.state.showInput}`} value={this.state.state} onChange = {event => this.setState({state : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Address 1 : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {this.state.address1}</span>
                    <input className={`${this.state.showInput}`} value={this.state.address1} onChange = {event => this.setState({address1 : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Job Title : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {this.state.jobStatus}</span>
                    <input className={`${this.state.showInput}`} value={this.state.jobStatus} onChange = {event => this.setState({jobStatus : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Sales Status : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {this.state.salesStatus}</span>
                    <input className={`${this.state.showInput}`} value={this.state.salesStatus} onChange = {event => this.setState({salesStatus : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Birthday (YYYY-MM-DD): </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {this.state.birthDate}</span>
                    <input className={`${this.state.showInput}`} value={this.state.birthDate} onChange = {event => this.setState({birthDate : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Area Code : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {this.state.areaCode}</span>
                    <input className={`${this.state.showInput}`} value={this.state.areaCode} onChange = {event => this.setState({areaCode : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Country : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {this.state.country}</span>
                    <input className={`${this.state.showInput}`} value={this.state.country} onChange = {event => this.setState({country : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Address 2 : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {this.state.address2}</span>
                    <input className={`${this.state.showInput}`} value={this.state.address2} onChange = {event => this.setState({address2 : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Zip : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {this.state.zip}</span>
                    <input className={`${this.state.showInput}`} value={this.state.zip} onChange = {event => this.setState({zip : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Industry : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {this.state.industry}</span>
                    <input className={`${this.state.showInput}`} value={this.state.industry} onChange = {event => this.setState({industry : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Occupation : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {this.state.occupation}</span>
                    <input className={`${this.state.showInput}`} value={this.state.occupation} onChange = {event => this.setState({occupation : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Source : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {this.state.source}</span>
                    <input className={`${this.state.showInput}`} value={this.state.source} onChange = {event => this.setState({source : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Sales Rep : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {this.state.salesRep}</span>
                    <input className={`${this.state.showInput}`} value={this.state.salesRep} onChange = {event => this.setState({salesRep : event.target.value})}  />
                </div>
                </div>
                <div className={`collapse`} onClick={this.toggleHeight.bind(this)}>
                  <span>{this.state.collapseMsg}</span>
                  <span className="mksicon-ArrowNext rotate-down"></span>
                </div>
            </div>
            <div id="Tags" className="tabcontent mksph_cardbox">
                  <h3>Tags</h3>
                  <a className="addTag" onClick={showAddTag => { this.setState({showAddBox : true}) } } >Add Tag</a>
                  <ToggleDisplay show={this.state.showAddBox}>
                    <div className="">
                      <input
                        type="text"
                        value={this.state.tagName}
                        onChange={event => this.setState({tagName : event.target.value}) }
                        onKeyPress={this.handleOnTagInput.bind(this)}
                        disabled={this.state.disabled}
                      />


                      <div className="scfe_control_option">
                          <div className="scfe_close_wrap" onClick={showAddTag => { this.setState({showAddBox : false,tagName: ''}) }}>
                              <a className="scfe_c_ach" href="#">
                                  <div className="scfe_close_t">
                                      <span>Close</span>
                                  </div>
                                  <div className="scfe_close_i_md">
                                      <div className="scfe_close_i" aria-hidden="true" data-icon="&#xe915;"></div>
                                  </div>
                              </a>
                          </div>
                          <div className={`scfe_save_wrap disable_${this.state.disabled}`} onClick={ this.addNewTag.bind(this) } >
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
                  </ToggleDisplay>
                  <div className="tags-contents">
                    <LoadingMask message={this.state.loadingMessage} showLoading={this.state.showLoading} />
                    <ContactTags tags={this.props.contact.tags} deleteTag={this.deleteTagName.bind(this)} />
                  </div>
                </div>
                <div id="custom-fields" className="tabcontent mksph_cardbox">
                      <h3>Custom Fields</h3>
                      <CustomFields custom_fields={this.props.contact.cusFldList}/>
                </div>
      </div>
    );

  }


}

export default ContactDetailInfo;
