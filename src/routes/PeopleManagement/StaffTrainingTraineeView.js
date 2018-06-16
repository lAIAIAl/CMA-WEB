import React, { Component, PropTypes } from 'react';
import { Layout, Timeline, Divider, Row, Col, Button, Form, message } from 'antd';

import InspectPersonalTrainsView from './InspectPersonalTrainsView';
import InspectPersonalTrainView from './InspectPersonalTrainView';
import AddTrainingResultView from './AddTrainingResultView';
import ModifyTrainingResultView from './ModifyTrainingResultView';
import DeleteTrainingPeopleResultView from './DeleteTrainingPeopleResultView';

const FormItem = Form.Item;

const StaffTrainingTraineeView = Form.create()(class extends React.Component{

  constructor(props){
    super(props);
    
    this.personalTrainsViewTabName = '人员的全部培训记录';
    this.personalTrainsView = InspectPersonalTrainsView;

    this.personalTrainViewTabName = '人员的单次培训记录';
    this.personalTrainView = InspectPersonalTrainView;

    this.addTrainingResultViewTabName = '添加人员的培训结果';
    this.addTrainingResultView = AddTrainingResultView;

    this.modifyTrainingResultViewTabName = '修改人员的培训结果';
    this.modifyTrainingResultView = ModifyTrainingResultView;

    this.deleteTrainingPeopleResultViewTabName = '删除人员的培训结果';
    this.deleteTrainingPeopleResultView = DeleteTrainingPeopleResultView;
  }

  handlePersonalTrains = () => {
    this.props.addTab(this.personalTrainsViewTabName,this.personalTrainsViewTabName,Form.create()(this.personalTrainsView),null);
  }

  handlePersonalTrain = () => {
    this.props.addTab(this.personalTrainViewTabName,this.personalTrainViewTabName,Form.create()(this.personalTrainView),null);
  }

  handleAddTrainingResult = () => {
    this.props.addTab(this.addTrainingResultViewTabName,this.addTrainingResultViewTabName,Form.create()(this.addTrainingResultView),null);
  }

  handleModifyTrainingResult = () => {
    this.props.addTab(this.modifyTrainingResultViewTabName,this.modifyTrainingResultViewTabName,Form.create()(this.modifyTrainingResultView),null);
  }

  handleDeleteTrainingPeopleResult = () => {
    this.props.addTab(this.deleteTrainingPeopleResultViewTabName,this.deleteTrainingPeopleResultViewTabName,Form.create()(this.deleteTrainingPeopleResultView),null);
  }

  render(){
    const { Header, Footer, Sider, Content } = Layout;
    return(
      <div>
       <Layout>
       <Header/>
       <Content>
        <Timeline>
	  <Timeline.Item>
	    <Button type="primary" onClick={ this.handlePersonalTrains }>
	      单人的全部培训记录
	    </Button>
	  </Timeline.Item>
	  <Timeline.Item>
	    <Button type="primary" onClick={ this.handlePersonalTrain }>
	      单人的单次培训记录
	    </Button>
	  </Timeline.Item>
	  <Timeline.Item>
	    <Button type="primary" onClick={ this.handleAddTrainingResult }>
	      添加单人的培训结果
	    </Button>
	  </Timeline.Item>
	  <Timeline.Item>
	    <Button type="primary" onClick={ this.handleModifyTrainingResult }>
	      修改单人的培训结果
	    </Button>
	  </Timeline.Item>
	  <Timeline.Item>
	    <Button type="primary" onClick={ this.handleDeleteTrainingPeopleResult }>
	      删除单人的培训结果
	    </Button>
	  </Timeline.Item>
	</Timeline>
       </Content>
       <Footer/>
       </Layout>
      </div>
    );
  }

});

export default StaffTrainingTraineeView;
