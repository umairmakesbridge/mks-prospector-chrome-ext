
import React, {Component}
       from 'react';
import request
       from 'superagent';
import {encodeHTML,decodeHTML}
       from '../common/Encode_Method';
import {ErrorAlert,SuccessAlert}
       from '../common/Alerts';
import {Checkbox, Radio,RadioGroup}
       from 'react-icheck';
var Highlight = require('react-highlighter');

class SubscriberLists extends Component{
      constructor(props){
        super(props);
        this.baseUrl = this.props.baseUrl;

        this.state = {
          subLists : null,
          orginalLists: null,
          showNotFound : 'hide',
          hideLists    : 'show',
          searchedValue : 'Hello'
        };

        // preserve the initial state in a new object
        this.baseState = this.state;
      }
      setStateDefault(){
        this.setState(this.baseState);
      }
      saveContactIntoList (){

        if(!document.querySelector('.checked input[name=radio]:checked')){
          ErrorAlert({message : "No list selected."});
          return;
        }
        this.props.parentProps.toggleLoadingMask("Updating Contact into List");
        let selectedListNum = document.querySelector('.checked input[name=radio]:checked').value;
        //https://test.bridgemailsystem.com/pms/io/subscriber/setData/?BMS_REQ_TK=c7jJ1hJuurtB3BmDSvlO1XHDinnjMF&type=addByEmailOnly
        //params : emails	umair@makesbridge.com , listNum	qcWRf30Qb33Ph26Ab17Hf20qcW
        request.post(this.baseUrl+'/io/subscriber/setData/?BMS_REQ_TK='+this.props.users_details[0].bmsToken+'&type=addByEmailOnly')
           .set('Content-Type', 'application/x-www-form-urlencoded')
           .send({
                     listNum: selectedListNum
                    ,emails:this.props.contact.email
                    ,ukey:this.props.users_details[0].userKey
                    ,isMobileLogin:'Y'
                    ,userId:this.props.users_details[0].userId
                  })
           .then((res) => {
              console.log(res.status);

              var jsonResponse =  JSON.parse(res.text);
              console.log(jsonResponse);
              if(jsonResponse[0]=="err"){
                ErrorAlert({message : jsonResponse[1]});
              }
              else if(parseInt(jsonResponse.updatedCount) > 0 || parseInt(jsonResponse.addedCount) > 0){


                this.props.parentProps.toggleLoadingMask();
                SuccessAlert({message:"Contact added successfully."});
                this.props.addContactToList();
                this.setState(this.baseState);
              }
            });
      }
      componentDidMount(){
      }

      loadLists(){
          //https://test.bridgemailsystem.com/pms/io/list/getListData/?BMS_REQ_TK=c7jJ1hJuurtB3BmDSvlO1XHDinnjMF&type=all
          let lists = [];
          var Url = this.baseUrl
                          +'/io/list/getListData/?BMS_REQ_TK='
                          + this.props.users_details[0].bmsToken +'&type=all&ukey='+this.props.users_details[0].userKey
                          +'&isMobileLogin=Y&userId='+this.props.users_details[0].userId

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

                        jQuery.each(jsonResponse['lists'][0],function(key,list){
                              if(list[0].isSupressList == "false"){
                                lists.push(list[0]);
                              }
                        });
                        this.setState({
                          subLists : lists,
                          orginalLists : lists
                        });
                      }
                    }
                  });

      }


      hiliter(word, element) {
          debugger;

          var str = element.innerHTML.replace(/<\/?span[^>]*>/g,"");
          var rgxp = new RegExp(word, 'g');
          var repl = '<span class="myClass">' + word + '</span>';
          element.innerHTML = str.replace(rgxp, repl);
      }



      filterSearch(event){
            var value = event.currentTarget.value;


            if(value){
              let returnedArray = this.filter(this.state.subLists,value,'name');

              console.log(returnedArray);
              if(returnedArray.length > 0){
                this.setState({
                  subLists  : returnedArray,
                  hideLists    : 'show',
                  showNotFound : 'hide',
                  searchedValue : value
                }
              );
              }else{
                this.setState({
                  hideLists    : 'hide',
                  showNotFound : 'show'
                })
              }
            }else{
              let orginalLists = this.state.orginalLists;
              this.setState({
                subLists  : orginalLists,
                hideLists    : 'show',
                showNotFound : 'hide'
              })
            }
      }
      /*filterIt(arr, value) {
            return arr.filter(obj => Object.keys(obj).some(key => obj[key].includes(value)));
          }*/
      filter(array, value, key) {
              let a=array;
              return array.filter(key ? function (a) {
                  if(a[key].toLowerCase().indexOf(value.toLowerCase()) > -1){
                    return a[key];
                  }
              } : function (a) {
              return Object.keys(a).some(function (k) {
                  return a[k] === value;
              });

          });

      }
      generateLists(){

        const ListItems = this.state.subLists.map((list,key) =>


                      <Radio
                        key={key}
                        name="aa"
                        radioClass="iradio_square-blue"
                        increaseArea="20%"
                        ref={"enhancedSwitch"+key}
                        value={list['listNumber.encode']}
                        label={`<span class='labels'>${decodeHTML(list.name)} </span>`}
                      />

          );
        this.state['searchedValue'] = 'umair';
        return ListItems;
      }

      render(){
        if(!this.state.subLists){
          return(

            <div id="NoContact" className="tabcontent mksph_cardbox">

                    <p className="not-found">Loading...</p>
                </div>
          )
        }
        return(
          <div className="sl_lists_wrapper">
            <div className={`sl_wrap_list`}>

                <input className="sl_filter_lists" style={{marginBottom: "20px"}} placeholder="Search Lists..." onChange={this.filterSearch.bind(this)}/>
                  <div id="NoContact" className={`tabcontent mksph_cardbox mks_not_found_wrap ${this.state.showNotFound}`}><p className="not-found">No List Found</p></div>
                <span className={`${this.state.hideLists} addc_lists_wrapper`}>
                <Highlight search={this.state.searchedValue}>
                    <RadioGroup name="radio">
                    {this.generateLists()}
                  </RadioGroup>
              </Highlight>
            </span>
            </div>

        </div>
        )

      }


}
export default SubscriberLists;
