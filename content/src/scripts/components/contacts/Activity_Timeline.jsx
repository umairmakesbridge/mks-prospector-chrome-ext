import React, {Component}
       from 'react';


class ActivityTimeline extends Component{
  constructor(props){
    super(props);


  };

  render(){
    return (
      <div id="Activity" className="tabcontent active">
          <div className="act_head">
              <div className="total_act">
                  <div className="act_total_count">
                      <p>5</p>
                  </div>
                  <div className="atc_headline">
                      <p>Total Activities</p>
                  </div>
                  <div className="clr"></div>
              </div>
              <div className="act_filter">
                  <p><a href="#">show all</a>  |  <a href="#">advance filter</a></p>
              </div>
              <div className="clr"></div>
          </div>
          <div className="activity_content">
              <div className="act_list">
                  <div className="" aria-hidden="true" data-icon="&#xe907;">
              </div>
              <div className="act_list">
                  <div className="" aria-hidden="true" data-icon="&#xe91e;">
              </div>
              <span className="mksicon-OpenMail"></span>
          </div>
          <div className="act_foot">
              <div className="" aria-hidden="true" data-icon="&#xe91d;">
          </div>
      </div>
      </div>
  </div>
</div>
    );

  }


}

export default ActivityTimeline;
