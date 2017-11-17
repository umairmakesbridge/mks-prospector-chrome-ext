
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



class ManageSubscriberLists extends Component{
      constructor(props){
        super(props);
        this.baseUrl = this.props.baseUrl;

        this.state = {
          mangLists : null,
          showAddListWrap : 'show',
          loadingMList : 'hide',
          showManageListWrap : 'hide',
        };

        // preserve the initial state in a new object
        this.baseState = this.state;
      }
      componentDidMount(){
      }
      manageLoadList(){


        //https://test.bridgemailsystem.com/pms/io/subscriber/getData/?BMS_REQ_TK=c7jJ1hJuurtB3BmDSvlO1XHDinnjMF&subNum=xhDfZt33St26Eo17El20Ek21Vs30Zt33Mn26xqwE&type=getListInfo
        let lists = [];
        var Url = this.baseUrl
                        +'/io/subscriber/getData/?BMS_REQ_TK='
                        + this.props.users_details[0].bmsToken +'&type=getListInfo&subNum='+this.props.contact.subNum+'&ukey='+this.props.users_details[0].userKey
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
                          debugger;
                          console.log(jsonResponse);
                          jQuery.each(jsonResponse['listInfo'][0],function(key,list){
                            lists.push(list[0]);
                          });
                          this.setState({
                            mangLists    : lists
                          })
                        }
                      }
                    });

      }
      generateForManageList(){
          // console.log(this.state.mangLists);

          const ListItems = this.state.mangLists.map((list,key) =>
                <li key={key}>
                    <div className="mks_mnglist_wrap">
                      <h4>{list.listName}</h4>
                          <select data-listNum={list.listNumber} className="list-action" defaultValue={list.status}>
                            <option value="S">Subscribe</option>
                            <option value="U">Unsubscribe</option>
                            <option value="R">Remove</option>
                          </select>
                    </div>
                </li>
          );
          return ListItems;
      }
      updateContactIntoLists(){
        this.props.parentProps.toggleLoadingMask("Updating Contact");
        var post_data = {};
                jQuery('select.list-action').each(function(key,val){
                    post_data["listNum"+key] = $(val).attr("data-listNum");
                    post_data["status"+key] = $(val).val();
                });
                post_data['ukey'] = this.props.users_details[0].userKey;
                post_data['isMobileLogin'] = 'Y';
                post_data['userId'] = this.props.users_details[0].userId;
        request.post(this.baseUrl+'/io/subscriber/setData/?BMS_REQ_TK='+this.props.users_details[0].bmsToken+'&subNum='+this.props.contact.subNum+'&type=editListInfo')
               .set('Content-Type', 'application/x-www-form-urlencoded')
               .send(post_data)
                   .then((res) => {
                      console.log(res.status);
                      var jsonResponse =  JSON.parse(res.text);
                      console.log(jsonResponse);
                      if(jsonResponse[0]=="err"){
                        ErrorAlert({message : jsonResponse[1]});
                      }
                      else{
                        //this.setState(this.baseState);
                        this.props.manageContactToList();
                        //this.loadLists();
                        this.props.parentProps.toggleLoadingMask();
                        SuccessAlert({message:"Contact updated successfully."});
                      }
                    });
      }
      render(){
        if(!this.state.mangLists){
          return(

            <div id="NoContact" className="tabcontent mksph_cardbox">

                    <p className="not-found">Loading...</p>
                </div>
          )
        }
        return(
          <div className="sl_lists_wrapper">

            <div className={`sl_wrap_list`} >

                  <ul>
                    {this.generateForManageList()}
                  </ul>

            </div>
        </div>
        )

      }


}
export default ManageSubscriberLists;
