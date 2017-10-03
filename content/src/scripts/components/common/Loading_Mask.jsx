import React,{Component} from 'react';

class LoadingMask extends Component{
    constructor(props){
        super(props)
    }

    render(){
      if(!this.props.message){
        return (<div></div>);
      }
      return (<div className="loader-mask">
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
                <p>{this.props.message}</p>
              </div>);
    }
}


export default LoadingMask;
