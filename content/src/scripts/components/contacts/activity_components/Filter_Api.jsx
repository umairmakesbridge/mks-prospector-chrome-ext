// All Filters Api Will be added here

// API getActivityStats {use and implementation 1hr}
// API getInvolvedInStats {use and implementation 1hr}
// API timeline {implementation managing lazy loading stats and data parsing for React 5hrs}
        // All calls with Future N
import request
       from 'superagent';
import Moment from 'moment';
import {encodeHTML,decodeHTML} from '../../common/Encode_Method';


export const GetTimeline = (props)=>{
  var searchUrl = props.baseUrl
                  + '/io/subscriber/getData/?BMS_REQ_TK='
                  + props.users_details[0].bmsToken +'&type=timeline&isFuture=N&offset='+props.offset+'&subNum='
                  + props.contact.subNum+'&ukey='+props.users_details[0].userKey
                  + '&isMobileLogin=Y&userId='+props.users_details[0].userId
      request
        .get(searchUrl)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((res) => {
          if(res.status==200){
            let jsonResponse =  JSON.parse(res.text);
            if(jsonResponse[0] == "err"){
              if(jsonResponse[1]=="SESSION_EXPIRED"){
                  alert(jsonResponse[1]);
                  jQuery('.mksph_logout').trigger('click');
              }

              return false;
            }
            if(parseInt(jsonResponse.totalCount) > 0){
                    console.log(jsonResponse);
                    let jsonActivityArray ={
                                    batchCount : jsonResponse.batchCount,
                                    nextOffset : jsonResponse.nextOffset,
                                    totalCount : jsonResponse.totalCount,
                                    activities : []
                                  };
                    jQuery.each(jsonResponse.activities[0],function(key,value){
                      jsonActivityArray['activities'].push(value[0]);
                    })
                    props.callback(jsonActivityArray,props.loadMore)
            }else{
                    props.callback(parseInt(jsonResponse.totalCount));
            }

            return false;
          }else{
            alert(res[1])
          }
        });
}


export const GetServerDate = (props) => {
  //https://mks.bridgemailsystem.com/pms/io/getMetaData/?type=time&BMS_REQ_TK=KKEWHpBa8iJHgRHfyzuaJbOQTIgkaW
  var searchUrl = props.baseUrl
                  + '/io/getMetaData/?BMS_REQ_TK='
                  + props.users_details[0].bmsToken +'&type=time&ukey='+props.users_details[0].userKey
                  + '&isMobileLogin=Y&userId='+props.users_details[0].userId
      request
        .get(searchUrl)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((res) => {
          if(res.status==200){
            let _json =  JSON.parse(res.text);
            var _date = Moment(decodeHTML(_json[0]),'YYYY-M-D H:m');
            var format = {date: _date.format("DD MMM YYYY"), time: _date.format("hh:mm A")};
            props.callback(format);
            return false;
          }else{
            alert(res[1])
          }
        });
}
