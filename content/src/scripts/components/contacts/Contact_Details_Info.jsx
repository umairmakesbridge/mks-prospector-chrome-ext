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
      disabled: false
    }
  };

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
                ,tag: this.state.tagName
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
            this.props.changeInTagsView();

          }
        });
  }
  handleOnTagInput (event){
    const code = event.keyCode || event.which;
    if(code == 13){
      this.addNewTag();
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
        <div id="Contact" className="tabcontent mksph_cardbox">
              <h3>Contact Info</h3>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Company : </span>
                  <span className="mksph_contact_value"> {this.props.contact.company}</span>
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Phone : </span>
                  <span className="mksph_contact_value"> {this.props.contact.telephone}</span>
                </div>
                <div className="mksph_contact_data">
                  <span className="mksph_contact_title">Job Title : </span>
                  <span className="mksph_contact_value"> {this.props.contact.jobStatus}</span>
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
