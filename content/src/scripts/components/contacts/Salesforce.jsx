import React, {Component}
       from 'react';
import request
       from 'superagent';
import {ErrorAlert,SuccessAlert}
       from '../common/Alerts';
import {Checkbox, Radio,RadioGroup}
       from 'react-icheck';
import {encodeHTML,decodeHTML}
       from '../common/Encode_Method';
import LoadingMask
              from '../common/Loading_Mask';

class Salesforce extends Component{
    constructor(props){
      super(props);
      this.baseUrl = this.props.baseUrl;

      this.state = {
          salesReps : "",
          sfContactCustomFields : [],
          sfLeadCustomFields : [],
          source : [],
          rules : [],
          sourceVal : '',
          addAsVal : 'lead',
          ruleVal  : 0,
          showRule : 'hide',
          showSalesRep : 'hide',
          defaultCompanyChecked : true,
          showCompany : 'show',
          showCSalesRep : 'hide',
          showContactOwner : 'hide',
          showLeadOwner  : 'show',
          defaultCchecked : true,
          defaultLchecked : true,
          ruleIdVal : -1,
          salesRepVal : -1,
          LCustomArrayKey : [],
          showLoadingSF : false
       }

      // preserve the initial state in a new object
      this.baseState = this.state;


    }
    getSalesrep(){
      //https://test.bridgemailsystem.com/pms/io/user/getSalesrepData/
      //?BMS_REQ_TK=aFXNpOaikoZq3bz0a5uNbGRURzxbbF&offset=0&type=allSalesreps&bucket=1000
      let salesRepsArray =[];
      var Url = this.baseUrl
                +'/io/user/getSalesrepData/?BMS_REQ_TK='
                + this.props.users_details[0].bmsToken +'&type=allSalesreps&offset=0&bucket=1000&isMobileLogin=Y&userId='+this.props.users_details[0].userId
      request
            .get(Url)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .then((res) => {
                  if(res.status==200){
                      let jsonResponse =  JSON.parse(res.text);
                      if (jsonResponse[0] == "err"){
                         if(jsonResponse[1] == "SESSION_EXPIRED"){
                                  ErrorAlert({message:jsonResponse[1]});
                                  jQuery('.mksph_logout').trigger('click');
                         }
                         return false;
                      }

                      if(parseInt(jsonResponse.count) > 0){
                        console.log('Sales Reps : ',jsonResponse);
                        $.each(jsonResponse.salesreps[0],function(key,value){
                            salesRepsArray.push(value[0]);
                        });

                        console.log(salesRepsArray);

                        this.setState({
                          salesReps : salesRepsArray
                        })
                      }
                  }
            });
    }
    getSalesforceData(){
        //https://test.bridgemailsystem.com/pms/io/salesforce/getData/?BMS_REQ_TK=nVla24lTtjV9TbuHJ3SMzXDbAE5AvH
        //&type=addToSfData&subNum=zdTyioJp17Il20Fh21Un30Vl33Pm26Jp17Fi20zvfrtg&isMobileLogin=Y&userId=demo&ukey=I54XHXtG
        var Url = this.baseUrl
                  +'/io/salesforce/getData/?BMS_REQ_TK='
                  + this.props.users_details[0].bmsToken +'&type=addToSfData&subNum='+this.props.contact.subNum
                  +'&isMobileLogin=Y&userId='+this.props.users_details[0].userId+'&ukey='+this.props.users_details[0].userKey;
                  request
                        .get(Url)
                        .set('Content-Type', 'application/x-www-form-urlencoded')
                        .then((res) => {
                              if(res.status==200){
                                  let jsonResponse =  JSON.parse(res.text);
                                  if (jsonResponse[0] == "err"){
                                     if(jsonResponse[1] == "SESSION_EXPIRED"){
                                              ErrorAlert({message:jsonResponse[1]});
                                              jQuery('.mksph_logout').trigger('click');
                                     }
                                     return false;
                                  }


                                  if(jsonResponse.sfContactCustomFields.length > 0 || jsonResponse.sfLeadCustomFields.length > 0 || jsonResponse.source.length > 0){
                                      this.getSalesrep();
                                      this.setState({
                                          sfContactCustomFields : (jsonResponse.sfContactCustomFields.length > 0) ? jsonResponse.sfContactCustomFields : [],
                                          sfLeadCustomFields    : (jsonResponse.sfLeadCustomFields.length > 0) ? jsonResponse.sfLeadCustomFields : [],
                                          source                : (jsonResponse.source.length > 0) ? jsonResponse.source : [],
                                          rules                 : (jsonResponse.rules.length > 0) ? jsonResponse.rules : []
                                      });
                                  }
                              }
                        });
    }
    generateSource(){
      const ListItems = this.state.source.map((list,key) =>
                    <option  key={key} value={list}>{list}</option>
        );

      return ListItems;
    }
    generateRules(){
      const ListItems = this.state.rules.map((list,key) =>
                      <option  key={list.value} value={list.value}>{list.name}</option>
        );

      return ListItems;
    }
    generatesalesReps(){
      if(!this.state.salesReps){
        return;
      }
      const ListItems = this.state.salesReps.map((list,key) =>
                    <option  key={key} value={list.name}>{list.name}</option>
        );

      return ListItems;
    }
    generateLeadCustomFields(sfleads,label){
      if(!this.props.contact.cusFldList){
        return;
      }
      let customFieldsArr = [];
      $.each(this.props.contact.cusFldList[0],function(key,value){
          customFieldsArr.push(value[0]);
      });
      const ListItems = customFieldsArr.map((list,key) =>
                    <div className="sf_cf_div_wrap" key={key}>
                      <input type="checkbox" onClick={this.CustomFieldCheckBox.bind(this)} id={label+key}  value={list[Object.keys(list)[0]]}/>
                      <span className="sf_cus_span1">{Object.keys(list)[0]}</span>
                      <span className="sf_cus_span2 hide" id={`SF_`+label+key+`_label`}>Add at Salesforce as</span>
                      <select id={`SF_`+label+key} className="hide" onChange={this.changeCustomFieldSF.bind(this)}>
                          {this.generateSFCustomFields(sfleads)}
                      </select>
                    </div>
        );

      return ListItems;
    }
    generateSFCustomFields(sfleadsArray){

      const ListItems = sfleadsArray.map((list,key) =>
                      <option  key={list.value} value={list.value}>{list.name}</option>
        );

      return ListItems;
    }

    /*===============
        Change Events
    ===============*/
    addAsSF(event){
        console.log('Change in Add as',event.currentTarget.value);
        this.setState({
             addAsVal     : event.currentTarget.value,
             showContactOwner : (event.currentTarget.value == "contact") ? 'show' : 'hide',
             showLeadOwner  : (event.currentTarget.value == "contact") ? 'hide' : 'show',
             defaultCompanyChecked : (event.currentTarget.value == "contact") ? false : true,
             showCompany : (event.currentTarget.value == "contact") ? 'hide' : 'show',
             LCustomArrayKey : []
         });
    }

    changeSource(event){
        console.log('Change in Source as', event.currentTarget.value);
        this.setState({
             sourceVal : event.currentTarget.value
        });
    }
    changeRuleId(event){
      console.log('Change in Rule ID as', event.currentTarget.value);
      this.setState({
        ruleIdVal : event.currentTarget.value,
        salesRepVal : -1
      })
    }
    salesRep(event){
      this.setState({
        salesRepVal : event.currentTarget.value,
        ruleIdVal : -1
      })
    }

    selectleadsOwner(event){
      this.setState({
        defaultLchecked : (parseInt(event.currentTarget.value) == 0) ? true : '',
        ruleVal : parseInt(event.currentTarget.value),
        showRule     : (event.currentTarget.value == 1) ? 'show' : 'hide',
        showSalesRep : (event.currentTarget.value == 2) ? 'show' : 'hide'
      });

    }
    selectContactOwner(event){
      this.setState({
        defaultCchecked : (parseInt(event.currentTarget.value) == 0) ? true : '',
        ruleVal : parseInt(event.currentTarget.value),
        showCSalesRep : (event.currentTarget.value == 2) ? 'show' : 'hide'
      })
    }

    CustomFieldCheckBox(event){
      console.log(event.currentTarget.checked);
      if(event.currentTarget.checked){
        this.state[event.currentTarget.id] = event.currentTarget.value;
        this.state.LCustomArrayKey.push(event.currentTarget.id);
        this.state['SF_'+event.currentTarget.id] = $('#SF_'+event.currentTarget.id).val();
        $('#SF_'+event.currentTarget.id).removeClass('hide');
        $('#SF_'+event.currentTarget.id+"_label").removeClass('hide');
      }else{
        this.state[event.currentTarget.id] = "";
        var index = this.state.LCustomArrayKey.indexOf(event.currentTarget.id);  // getting the index number
        if(index > -1){
          this.state.LCustomArrayKey.splice(index, 1);
        }
        $('#SF_'+event.currentTarget.id).addClass('hide');
        $('#SF_'+event.currentTarget.id+"_label").addClass('hide');
      }
      console.log(this.state);
    }
    changeCustomFieldSF(event){
      console.log(event.currentTarget.value);
      this.state[event.currentTarget.id] = event.currentTarget.value;
    }
    saveSalesForce(){
      if(this.state.ruleVal == 1 && this.state.ruleIdVal == -1){
          ErrorAlert({message:'Assign rule must be selected'});
          return false;
      }
      if(this.state.ruleVal == 2 && this.state.salesRepVal == -1){
          ErrorAlert({message:'Sales Rep must be selected'});
          return false;
      }

      if(!this.props.contact.lastName){
        ErrorAlert({message:'Please update contact Last name.'});
        return false;
      }
      else if(this.state.addAsVal == "lead" && !this.props.contact.company){
        ErrorAlert({message:'Please update contact Company name.'});
        return false;
      }

      this.setState({
        showLoadingSF : true
      })
      let reqObj = {}
      let basicAr = [];
      $.each(this.state.LCustomArrayKey,function(key,value){
        reqObj[value] = encodeHTML(this.state[value]);
        reqObj['SF_' + value] = encodeHTML(this.state['SF_'+value]);
      }.bind(this));

      reqObj['salesStatus']  = this.state.addAsVal;
      reqObj['source']  = this.state.sourceVal;
      reqObj['rule']  = this.state.ruleVal;
      reqObj['ruleId']  = this.state.ruleIdVal;
      reqObj['salesRep']  = this.state.salesRepVal;

      $.each ($('.sf_basic_div_wrap input'),function(key,val){
          if(val.checked){
            basicAr.push(val.value)
          }
      });

      reqObj['BasicField'] = basicAr;
      reqObj['type'] = 'addToSf';
      reqObj['subNum'] = this.props.contact.subNum;
      reqObj['act'] = 'add';
      reqObj['isMobileLogin'] = 'Y';
      reqObj['userId'] = this.props.users_details[0].userId;
      reqObj['ukey'] = this.props.users_details[0].userKey;


      request.post(this.baseUrl+'/io/salesforce/setData/?BMS_REQ_TK='+this.props.users_details[0].bmsToken)
         .set('Content-Type', 'application/x-www-form-urlencoded')
         .send(reqObj)
         .then((res) => {
            console.log(res.status);

            var jsonResponse =  JSON.parse(res.text);
            console.log(jsonResponse);
            if (jsonResponse[0] == "err"){
                if(jsonResponse[1] == "SESSION_EXPIRED"){
                  ErrorAlert({message:jsonResponse[1]});
                  jQuery('.mksph_logout').trigger('click');
                }else{
                  ErrorAlert({message:jsonResponse[1]});
                }
                this.setState({
                  showLoadingSF : false
                })
              return false;
            }
              this.props.changeSalesforceStatus();
              SuccessAlert({message:jsonResponse[1]});
              this.props.closeSalesforce();
              this.setState(this.baseState);
              //this.props.contact['company'] = this.state.company;
              //this.props.updateContactHappened();

          });
       console.log(reqObj);


    }
    setStateDefault(){
        this.setState(this.baseState);
    }
    render(){
      if(!this.state.sfContactCustomFields.length){
      return(
        <div id="NoContact" className="tabcontent mksph_cardbox">
                <p className="not-found">Loading Salesforce...</p>
            </div>
      )
    }
    return (
      <div className={`Rendering mkssf_wrap_rendering`}>
        <LoadingMask message={'Adding subscriber to Salesforce'} extraClass={'loadingMaks-additional'} showLoading={this.state.showLoadingSF} />
        <h4>Add as </h4>
          <select name="salesStatus" onChange={this.addAsSF.bind(this)} className="twoHunderWidth" id="first_wf_drop_down">
            <option value="lead">Lead</option>
            <option value="contact">Contact</option>
          </select>
          <h4>Source </h4>
          <select disabled={this.state.disabledDD} onChange={this.changeSource.bind(this)} className={`source twoHunderWidth`}>
              <option value="-1">Select Source...</option>
                {this.generateSource()}
          </select>
          <div className={`sf_leads_owner ${this.state.showLeadOwner}`}>
              <h4 className="mskLogog_bluetext">Lead's Owner</h4>

                  <div className="sf_lead_owner_div_wrap" >
                    <input checked={this.state.defaultLchecked} type="radio" name="lowner" onClick={this.selectleadsOwner.bind(this)} value="0"/>
                    <span>Do not Assign</span>
                  </div>
                  <div className="sf_lead_owner_div_wrap" >
                    <input type="radio" name="lowner" value="3" onClick={this.selectleadsOwner.bind(this)} />
                    <span>Use SalesForce Default Assignment Rule</span>

                  </div>
                  <div className="sf_lead_owner_div_wrap">
                    <input type="radio" name="lowner" value="1" onClick={this.selectleadsOwner.bind(this)} />
                    <span>Use SalesForce Assignment Rule</span>
                      <select className={`${this.state.showRule}`} onChange={this.changeRuleId.bind(this)}>
                          <option value="-1">Select Rule</option>
                            {this.generateRules()}
                      </select>
                  </div>
                  <div className="sf_lead_owner_div_wrap">
                    <input type="radio" name="lowner" value="2" onClick={this.selectleadsOwner.bind(this)}/>
                    <span>Assign To</span>
                    <select className={`${this.state.showSalesRep}`} style={{width: "200px"}} onChange={this.salesRep.bind(this)}>
                        <option value="-1">Select Salesrep</option>
                        {this.generatesalesReps()}
                    </select>
                  </div>


          </div>
          <div className={`sf_contacts_owner ${this.state.showContactOwner}`}>
              <h4 className="mskLogog_bluetext">Contact Owner</h4>

                  <div className="sf_cont_owner_div_wrap">
                    <input checked={this.state.defaultCchecked} type="radio" name="cowner" value="0" onClick={this.selectContactOwner.bind(this)}/>
                    <span>Do not Assign</span>
                  </div>
                  <div className="sf_cont_owner_div_wrap">
                    <input type="radio" name="cowner" value="2" onClick={this.selectContactOwner.bind(this)}/>
                    <span>Assign To</span>
                    <select className={`${this.state.showCSalesRep}`} onChange={this.salesRep.bind(this)}>
                        <option value="-1">Select Salesrep</option>
                        {this.generatesalesReps()}
                    </select>
                  </div>


          </div>

          <div className={`sf_basic_fields`}>
            <h4 className="mskLogog_bluetext">Tell Us What Fields To Include </h4>
              <div className="sf_basic_div_wrap">
                <input type="checkbox" name="firstName" value="firstName"/>
                <span>First Name</span>
              </div>
              <div className="sf_basic_div_wrap">
                <input type="checkbox" checked="checked" disabled="disabled" name="lastName" value="lastName"/>
                <span>Last Name</span>
              </div>
              <div className="sf_basic_div_wrap">
                <input type="checkbox" checked="checked" disabled="disabled" name="email" value="email"/>
                <span>Email</span>
              </div>
              <div className={`sf_basic_div_wrap ${this.state.showCompany}`}>
                <input type="checkbox" checked={this.state.defaultCompanyChecked} disabled="disabled" name="company" value="company"/>
                <span>Company</span>
              </div>
              <div className="sf_basic_div_wrap">
                <input type="checkbox" name="title" value="title"/>
                <span>Title</span>
              </div>
              <div className="sf_basic_div_wrap">
                <input type="checkbox" name="telephone" value="telephone"/>
                <span>Telephone</span>
              </div>
              <div className="sf_basic_div_wrap">
                <input type="checkbox" name="address1" value="address1"/>
                <span>Address 1</span>
              </div>
              <div className="sf_basic_div_wrap">
                <input type="checkbox" name="city" value="city"/>
                <span>City</span>
              </div>
              <div className="sf_basic_div_wrap">
                <input type="checkbox" name="state" value="state"/>
                <span>State</span>
              </div>
              <div className="sf_basic_div_wrap">
                <input type="checkbox" name="industry" value="industry"/>
                <span>Industry</span>
              </div>
              <div className="sf_basic_div_wrap">
                <input type="checkbox" name="zip" value="zip"/>
                <span>Zip Code</span>
              </div>
              <div className="sf_basic_div_wrap">
                <input type="checkbox" name="country" value="country"/>
                <span>Country</span>
              </div>
          </div>

          <div className={`sf_lead_custom_fields ${this.state.showLeadOwner}`}>
            <h4 className="mskLogog_bluetext">Custom Field(s)</h4>
              {this.generateLeadCustomFields(this.state.sfLeadCustomFields,'LCust_')}
          </div>
          <div className={`sf_contact_contact_fields ${this.state.showContactOwner}`}>
            <h4 className="mskLogog_bluetext">Custom Field(s)</h4>
              {this.generateLeadCustomFields(this.state.sfContactCustomFields,'CCust_')}
          </div>
      </div>

    )
  }

}

export default Salesforce;
