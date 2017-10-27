import React,{Component} from 'react';

class LoadingMask extends Component{
    constructor(props){
        super(props);
        console.log(this.props.extraClass);
    }

    render(){
      if(!this.props.showLoading){
        return (<div></div>);
      }
      return (<div className={`loader-mask ${this.props.extraClass}`}>
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
