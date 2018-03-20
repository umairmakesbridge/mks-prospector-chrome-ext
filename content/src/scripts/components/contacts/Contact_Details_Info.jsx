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
import Search
       from '../common/Search';
import Tasks
       from './task/Tasks'

class ContactDetailInfo extends Component{
  constructor(props){
    super(props);
    let tagsHtml = '';
    this.users_details = this.props.users_details;
    this.baseUrl = this.props.baseUrl;
    this.state = {
      showAddBox : false,
      tagBtn     : '',
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
      collapseMsg : 'Click to expand',
      collapseExpand : 'expand',
      showCreateCardBox : 'show',
      conLeadId : '',
      showSfUpdate : 'hide',
      showLoadingSF : false
    }
  };
  updateBasicField(reqtype){
    this.setState({ showInput : 'hide',showLabel : 'show' })
    let updateSFtype = (reqtype == 'SF') ? '&updateAtSF=y' : '';
    request.post(this.baseUrl+'/io/subscriber/setData/?BMS_REQ_TK='+this.users_details[0].bmsToken+'&type=editProfile'+updateSFtype)
       .set('Content-Type', 'application/x-www-form-urlencoded')
       .send({
                 subNum: this.props.contact.subNum
                ,company:encodeHTML(this.state.company)
                ,firstName : encodeHTML(this.state.firstName)
                ,lastName  : encodeHTML(this.state.lastName)
                ,telephone: encodeHTML(this.state.telephone)
                ,city: encodeHTML(this.state.city)
                ,state: encodeHTML(this.state.state)
                ,address1: encodeHTML(this.state.address1)
                ,jobStatus: encodeHTML(this.state.jobStatus)
                ,salesRep: encodeHTML(this.state.salesRep)
                ,salesStatus: encodeHTML(this.state.salesStatus)
                ,birthDate: encodeHTML(this.state.birthDate)
                ,areaCode: encodeHTML(this.state.areaCode)
                ,country: encodeHTML(this.state.country)
                ,zip: encodeHTML(this.state.zip)
                ,address2: encodeHTML(this.state.address2)
                ,industry: encodeHTML(this.state.industry)
                ,source: encodeHTML(this.state.source)
                ,occupation: encodeHTML(this.state.occupation)
                ,conLeadId : encodeHTML(this.props.contact.conLeadId)
                ,owner : encodeHTML(this.props.contact.salesRep)
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
              disabled    : false,
              showLoadingSF : false
            })
            if(reqtype=='SF'){
              SuccessAlert({message:"Contact updated successfully on salesforce."});
            }else{
              SuccessAlert({message:"Contact updated successfully."});
            }

            //this.props.contact['company'] = this.state.company;
            //this.props.updateContactHappened();
            this.props.getSubscriberDetails();
          }else{
            ErrorAlert({message : jsonResponse[1]});
          }
        });


  }

  HiItems(items,selectedItem) {
    this.setState({tagName : selectedItem});
  }
  handleAutoFillEnterTag(requestValue){
    if(requestValue){
      this.state['tagName'] = requestValue;
      this.addNewTag();
    }
  }
  cancelField(){
    this.setState({
      showInput : 'hide'
      ,showLabel : 'show'
      ,setFullHeight : ''
      ,collapseMsg: 'Click to expand'
      ,collapseExpand:'expand'
      ,company:this.props.contact.company
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
      ,conLeadId : this.props.contact.conLeadId

    })
  }
  addNewTag(){
    console.log('Add New Tag hit');

    if(!this.state.tagName || this.state.disabled){
      return;
    }
    this.setState({
      disabled:true,
      loadingMessage : 'Creating Tag...',
      showLoading    : true
    })
    this.refs.autoCompleteSearch.disabledInput();
    setTimeout(function(){
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
              this.props.contact.tags+=","+encodeHTML(this.state.tagName);
              this.setState({
                  tagName:'',
                  showAddBox:false,
                  tagBtn : ''
              })

              setTimeout(function(){this.setState({loadingMessage:'',showLoading:false})}.bind(this),3000)
              this.props.changeInTagsView();

            }
          });
    }.bind(this),3000)

  }
  createConact(event){
    //jQuery('no_contact').hide();
    this.setState({
      showCreateCardBox : 'hide'
    })
    jQuery('.wrap_scf_o_create_contact').trigger('click');
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
                showAddBox:false,
                tagBtn:'',
                showLoading:false
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
              tagBtn : '',
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
  handleOnTagChange(event){
        this.setState({tagName : event.target.value});
      //  this.requestAutoFillTag();
  }
  showAddTagFocus(){
    this.setState({showAddBox : true,tagBtn : 'hide',disabled:false});
    this.refs.autoCompleteSearch.cleanInput();
    setTimeout(function(){
        jQuery('#addTagName').focus();
    },500)
  }
  showInputB(){
    this.setState({ showInput : 'show',showLabel : 'hide', setFullHeight : 'heighAuto', collapseMsg: 'Click to collapse', collapseExpand:'collapse' });

    setTimeout(function(){
        jQuery('.focusThis').focus();
    },500)
  }
  componentWillUpdate(nextProps, nextState){
    console.log('Component Will Update ', nextProps);
    if(nextProps.contact){
      this.state.firstName = nextProps.contact.firstName;
      this.state.lastName = nextProps.contact.lastName;
      this.state.company = nextProps.contact.company;
      this.state.telephone = nextProps.contact.telephone;
      this.state.city = nextProps.contact.city;
      this.state.state = nextProps.contact.state;
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
      if(nextProps.contact.conLeadId){
        this.state['showSfUpdate'] = 'show';
      }
    }
  }
  componentDidUpdate(prevProps, prevState, prevContext){
    console.log(this.props.contact);
    /*if(this.props.contact && (this.props.contact.tags && this.props.contact.tags.split(',').length != prevProps.contact.tags.split(',').length)){
      this.setState({showLoading  : false})
    }*/
  }
  toggleHeight(){
      if(this.state.setFullHeight){
        this.setState({setFullHeight : '',collapseMsg: 'Click to expand',collapseExpand:'expand'});
      }else{
        this.setState({setFullHeight : 'heighAuto',collapseMsg: 'Click to collapse',collapseExpand:'collapse'});
      }
  }
  updateDataSalesforce(){
    console.log('Triggered Salesforce');
    this.setState({
      showLoadingSF : true
    });
    if(this.props.contact.cusFldList){
      console.log('We have Custom Fields and SF will update from CUSTOM Field Component');
      this.refs.CustomFieldsComponent.updateAtSF();
    }else{
      console.log('Only basic field are available so update will be from Basic Component')
      this.updateBasicField('SF')
    }
  }
  hideSFMask(){
    this.setState({
      showLoadingSF : false
    })
  }
  render(){
    let items = this.props.autoFillTags;
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
      <div id="NoContact" className={`tabcontent mksph_cardbox ${this.state.showCreateCardBox}`}>
            <h3>Contact</h3>
              <p className="not-found">Contact not found on Makesbridge</p>
              <button type="button" className="mksph_create_contact ripple" onClick={this.createConact.bind(this)}>Create</button>
          </div>
              </div>);
    }
    return (

      <div className="contacts-wrap">
        <LoadingMask message={'Updating Fields to Salesforce'} showLoading={this.state.showLoadingSF} />
        <div id="Tags" className="tabcontent mksph_cardbox">
              <h3>Tags</h3>
              <a className={`addTag mkb_btn mkb_greenbtn ${this.state.tagBtn}`} onClick={this.showAddTagFocus.bind(this) } >Add Tag</a>
              <ToggleDisplay show={this.state.showAddBox}>
                <Search items={items}
                placeholder='add or apply a tag to this contact...'
                maxSelected={1}
                multiple={false}
                onItemsChanged={this.HiItems.bind(this)}
                addNewTag= {this.handleAutoFillEnterTag.bind(this)}
                ref="autoCompleteSearch"
                />
                <div className="">
                  <input
                    type="text"
                    value={this.state.tagName}
                    onChange={this.handleOnTagChange.bind(this) }
                    onKeyPress={this.handleOnTagInput.bind(this)}
                    disabled={this.state.disabled}
                    className="hide"
                  />


                  <div className="scfe_control_option">
                      <div className="scfe_close_wrap" onClick={showAddTag => { this.setState({showAddBox : false,tagName: '',tagBtn:''}) }}>
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
        <div id="SalesForce" className={`${this.state.showSfUpdate} tabcontent mkb_basicField_wrap mksph_cardbox`}>
          <span style={{display:"none"}} className={`mkb_btn pull-left mkb_basic_edit mkb_sf_btn`}>Update fields to Salesforce</span>
            <div className="scfe_save_wrap disable_false" onClick={this.updateDataSalesforce.bind(this)} style={{float: "none",width: "200px",margin: "0 auto"}}>
              <a className="scfe_ach" href="#">
                <div className="scfe_save_t">
                  <span>Update fields to Salesforce</span>
                  </div>
                  <div className="scfe_save_i_md" >
                    <div className="scfe_save_i mksicon-jump_to_salesforce_record" aria-hidden="true"></div>
                    </div>
                  </a>
              </div>
        </div>
        <div id="Contact" className={`tabcontent mkb_basicField_wrap mksph_cardbox`}>
              <h3 style={{marginBottom: "15px"}}>Basic Fields</h3>
                <span className={`mkb_btn mkb_basic_edit pull-right ${this.state.showLabel}`} onClick={ this.showInputB.bind(this) }>Edit</span>
                <span className={`mkb_btn mkb_basic_cancel pull-right ${this.state.showInput}`} onClick={this.cancelField.bind(this)}>Cancel</span>
                <span className={`mkb_btn mkb_basic_done mkb_done mkb_greenbtn pull-right ${this.state.showInput}`} onClick={ this.updateBasicField.bind(this) }>Done</span>
              <div className={`height90 ${this.state.setFullHeight} scfe_field`}>
                <div className="mksph_contact_data">
                    <span className="mksph_contact_title">First Name : </span>
                    <span className={`mksph_contact_value ${this.state.showLabel}`}> {decodeHTML(this.state.firstName)}</span>
                    <input className={`${this.state.showInput} focusThis`} value={decodeHTML(this.state.firstName)} onChange = {event => this.setState({firstName : event.target.value})}  />
                  </div>
                  <div className="mksph_contact_data">
                      <span className="mksph_contact_title">Last Name : </span>
                      <span className={`mksph_contact_value ${this.state.showLabel}`}> {decodeHTML(this.state.lastName)}</span>
                      <input className={`${this.state.showInput}`} value={decodeHTML(this.state.lastName)} onChange = {event => this.setState({lastName : event.target.value})}  />
                    </div>
              <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Company : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {decodeHTML(this.state.company)}</span>
                  <input className={`${this.state.showInput}`} value={decodeHTML(this.state.company)} onChange = {event => this.setState({company : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Phone : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {decodeHTML(this.state.telephone)}</span>
                    <input className={`${this.state.showInput}`} value={decodeHTML(this.state.telephone)} onChange = {event => this.setState({telephone : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">City : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {decodeHTML(this.state.city)}</span>
                    <input className={`${this.state.showInput}`} value={decodeHTML(this.state.city)} onChange = {event => this.setState({city : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">State : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {decodeHTML(this.state.state)}</span>
                    <input className={`${this.state.showInput}`} value={decodeHTML(this.state.state)} onChange = {event => this.setState({state : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Address 1 : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {decodeHTML(this.state.address1)}</span>
                    <input className={`${this.state.showInput}`} value={decodeHTML(this.state.address1)} onChange = {event => this.setState({address1 : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Job Title : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {decodeHTML(this.state.jobStatus)}</span>
                    <input className={`${this.state.showInput}`} value={decodeHTML(this.state.jobStatus)} onChange = {event => this.setState({jobStatus : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Sales Status : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {decodeHTML(this.state.salesStatus)}</span>
                    <input className={`${this.state.showInput}`} value={decodeHTML(this.state.salesStatus)} onChange = {event => this.setState({salesStatus : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Birthday (YYYY-MM-DD): </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {decodeHTML(this.state.birthDate)}</span>
                    <input className={`${this.state.showInput}`} value={decodeHTML(this.state.birthDate)} onChange = {event => this.setState({birthDate : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Area Code : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {decodeHTML(this.state.areaCode)}</span>
                    <input className={`${this.state.showInput}`} value={decodeHTML(this.state.areaCode)} onChange = {event => this.setState({areaCode : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Country : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {decodeHTML(this.state.country)}</span>
                    <input className={`${this.state.showInput}`} value={decodeHTML(this.state.country)} onChange = {event => this.setState({country : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Address 2 : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {decodeHTML(this.state.address2)}</span>
                    <input className={`${this.state.showInput}`} value={decodeHTML(this.state.address2)} onChange = {event => this.setState({address2 : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Zip : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {decodeHTML(this.state.zip)}</span>
                    <input className={`${this.state.showInput}`} value={decodeHTML(this.state.zip)} onChange = {event => this.setState({zip : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Industry : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {decodeHTML(this.state.industry)}</span>
                    <input className={`${this.state.showInput}`} value={decodeHTML(this.state.industry)} onChange = {event => this.setState({industry : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Occupation : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {decodeHTML(this.state.occupation)}</span>
                    <input className={`${this.state.showInput}`} value={decodeHTML(this.state.occupation)} onChange = {event => this.setState({occupation : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Source : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {decodeHTML(this.state.source)}</span>
                    <input className={`${this.state.showInput}`} value={decodeHTML(this.state.source)} onChange = {event => this.setState({source : event.target.value})}  />
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Sales Rep : </span>
                  <span className={`mksph_contact_value ${this.state.showLabel}`}> {decodeHTML(this.state.salesRep)}</span>
                    <input className={`${this.state.showInput}`} value={decodeHTML(this.state.salesRep)} onChange = {event => this.setState({salesRep : event.target.value})}  />
                </div>


                </div>
                <div className={`${this.state.collapseExpand}`} onClick={this.toggleHeight.bind(this)}>
                  <span>{this.state.collapseMsg}</span>
                  <span className="mksicon-ArrowNext"></span>
                </div>
            </div>

                <div id="custom-fields" className="tabcontent mksph_cardbox">
                      <h3>Custom Fields</h3>

                      <CustomFields
                        ref="CustomFieldsComponent"
                        contactInfoState = {this.state}
                        custom_fields={this.props.contact.cusFldList}
                        contact={this.props.contact}
                        users_details={this.users_details}
                        baseUrl={this.baseUrl}
                        getSubscriberDetails={this.props.getSubscriberDetails}
                        hideLoadingMask = {this.hideSFMask.bind(this)}
                        />
                </div>

                <div id="tasks" className="tabcontent mksph_cardbox">
                      <h3>Task</h3>
                      <Tasks
                        users_details={this.users_details}
                        baseUrl={this.baseUrl}
                      />
                </div>
      </div>
    );

  }


}

export default ContactDetailInfo;
