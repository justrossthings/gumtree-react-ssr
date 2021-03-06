import React, {Component} from 'react';
import {connect} from 'react-redux';
if (process.env.WEBPACK) require('../../assets/bootstrap.css'); //only import this if webpack
if (process.env.WEBPACK) require('../../app.scss'); //only import this if webpack

import {getContent} from '../../actions/index';


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentContentThumb: '',
      currentIndex: 0,
      currentIndexDesc: '',
      nextIndexHeadline: '',
      collapsed: false
    };
  }
  
  componentWillMount() {
    this.props.dispatch(getContent());
  }
  
  //here we update component state with content for the currentIndex
  componentDidUpdate(oldProps, oldState) {
    const {currentIndex, currentIndexDesc} = this.state;
    const {currentContent} = this.props;
    //only update if there is no description text or if currentIndex is updated
    if (currentIndexDesc === '' || oldState.currentIndex !== currentIndex) {
      //get next index
      const nextIndex = (currentIndex + 1) % currentContent.length;
      //replace line breaks with new lines
      const cleanedDesc = currentContent[currentIndex].description.replace(/<br\s*[\/]?>/gi, "\n");
      this.setState({
        currentIndexDesc: cleanedDesc,
        nextIndexHeadline: currentContent[nextIndex].title,
        currentContentThumb: `./assets/${currentContent[0].thumbnail}`
      })
    }
  }
  
  //show next index content
  nextIndex() {
    const {currentIndex} = this.state;
    const {currentContent} = this.props;
    const nextIndex = (currentIndex + 1) % currentContent.length;
    this.setState({
      currentIndex: nextIndex
    })
  }
  
  //show prev index content
  prevIndex() {
    const {currentIndex} = this.state;
    const {currentContent} = this.props;
    const prevIndex = (currentContent.length + currentIndex - 1) % currentContent.length;
    this.setState({
      currentIndex: prevIndex
    })
  }
  
  //toggles collapse
  toggleCollapse() {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }
  
  render() {
    const {currentContentThumb, currentIndexDesc, nextIndexHeadline, collapsed} = this.state;
    const {currentContentTitle, currentContent} = this.props;
    const stateStyle = collapsed ? "hidden" : "show";
    return (
      <div className="home">
        <div className="row">
          <div className="col-xs-12 col-md-8 col-md-offset-2">
            <div className="panel panel-default">
              <div className="panel-heading">
                <div className="row">
                  <div className="col-xs-6 title">
                    {currentContentTitle}
                  </div>
                  <div className="col-xs-6">
                    <a className="pull-right collapse-toggle" onClick={() => this.toggleCollapse()}>
                      {collapsed ? "▼" : "▲"}
                    </a>
                  </div>
                </div>
              </div>
              <div className={`panel-body ${stateStyle}`}>
                <div className="row">
                  <div className="col-xs-12 col-md-4">
                    <img className="img-responsive" src={currentContentThumb}/>
                  </div>
                  <div className="col-xs-12 col-md-8 description">{currentIndexDesc}</div>
                </div>
              </div>
              <div className={`panel-footer ${stateStyle}`}>
                <div className="row">
                  <div className="col-xs-6">
                    <button
                      className="btn btn-default pull-left prev-button"
                      onClick={() => this.prevIndex()}
                    >
                      ◄ Prev
                    </button>
                  </div>
                  <div className="col-xs-6">
                    <button
                      className="btn btn-default pull-right next-button"
                      onClick={() => this.nextIndex()}
                    >
                      <span className="long-text">{nextIndexHeadline} ►</span>
                      <span className="short-text">Next ►</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentContentTitle: state.content.currentContentTitle,
    currentContent: state.content.currentContent
  }
}

export default connect(mapStateToProps, null)(Home);
