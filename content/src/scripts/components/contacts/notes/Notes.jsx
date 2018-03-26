import React,{Component}
       from 'react';
import request
       from 'superagent';
import {encodeHTML,decodeHTML}
       from '../../common/Encode_Method';
import ToggleDisplay
       from 'react-toggle-display';


class Notes extends Component{
           constructor(props){
               super(props);

           }

          generateNotes(){
            return (
              <span>
              <li className="_mks_item">
                <div className="cf_silhouette">
                  <div className="cf_silhouette_text c_txt_s pclr15">
                    <i className="mksicon-Notepad mks-task-icons"></i>
                    </div>
                  </div>
                  <div className="cf_email_wrap">
                    <div className="cf_email">
                      <span class="ckvwicon">This is simple notes content</span>
                          <p><strong>You</strong> made a note at 06:40 AM,23 Feb 2018</p>
                    </div>

                  </div>
              </li>
              <li className="_mks_item">
                <div className="cf_silhouette">
                  <div className="cf_silhouette_text c_txt_s pclr15">
                    <i className="mksicon-Notepad mks-task-icons"></i>
                    </div>
                  </div>
                  <div className="cf_email_wrap">
                    <div className="cf_email">
                      <span class="ckvwicon">umair@makesbridge.com</span>
                        <p><strong>You</strong> made a note at 06:40 AM,23 Feb 2018</p>
                    </div>

                  </div>
              </li>
            </span>
            )
          }
           render(){
             return(
               <div className="_mks_NotesWrap">
                 <textarea
                   placeholder="Add your notes here"
                  />
                  <div className="notes_lists_wrap">
                      <ul>
                        {this.generateNotes()}
                      </ul>
                  </div>
               </div>
             )
           }

       }


export default Notes;
