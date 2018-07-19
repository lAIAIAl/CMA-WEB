import React, { Component, PropTypes } from 'react';
import { Form, Card, Icon, Divider, Table, Row, Col, Button, message } from 'antd';

import $ from 'lib/jquery-3.3.1';
import { getAllByStaffService } from "services";

import StaffTrainResultView from './StaffTrainResultView';

const FormItem = Form.item;

const TrainDetailView = Form.create()(class extends React.Component{

    constructor(props){
        super(props);
        this.columns = [
            {
                title: '培训编号',
                dataIndex: 'trainingId',
                key: 'trainingId',
                sorter:(a,b) => a.trainingId-b.trainingId,
    },
        {
            title: '培训名称',
                dataIndex: 'program',
            key: 'program',
        },
        {
            title: '培训日期',
                dataIndex: 'trainingDate',
            key: 'trainingDate',
        },
        {
            title: '操作',
                dataIndex: 'operation',
            key: 'operation',
            render:(text,record)=>{
            var props={
                item: record,//当前培训信息(trainingId+...)
                id: this.props.item.id,//当前用户的id
            };
            return(
                <Row gutter={ 16 }>
                <Col className="gutter-row" span={ 6 }>
                <a href="javascript:void(0);" onClick={ () => { this.showCurTrains(props) } }>详情</a>
            </Col>
            </Row>
        );
        }
        }
    ];
    }

    state = {
        trainData: [],
        loading: false,
    };

    showCurTrains = (props) => {
    this.props.addTab('人员的单次培训', '人员的单次培训', Form.create()(StaffTrainResultView), props);
}

requestTrains = (props) => {
    let curStaff = props.item.id;
    let res = null;
    $.ajax({
        type: "get",
        url: getAllByStaffService,
        data: {id:curStaff},
        async: false,
        success:function(d){
            res = d.data;
        },
        error:function(){
            message.error('获取失败!');
        }
    });
    this.setState({
        trainData: res
    });
}

componentWillMount() {
    this.requestTrains(this.props);
}

render(){
    const { loading, trainData } = this.state;
    const columns = this.columns;
    return(
        <div>
        <Table
    columns={columns}
    dataSource={trainData}
    loading={loading}
    />
    </div>
);
}

});

export default TrainDetailView;
