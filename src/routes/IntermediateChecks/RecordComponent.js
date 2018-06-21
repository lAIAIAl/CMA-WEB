import React, {Component, PropTypes} from 'react';
import {Row, Col, Card, Tabs, Select, Checkbox, Popconfirm, Button, Icon, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import $ from 'lib/jquery-3.3.1';
const { MonthPicker, RangePicker } = DatePicker;
import RecordInspectView from "./RecordInspectView";

import { getStore } from 'store/globalStore';
import { setItems } from 'common/basic/reducers/ItemReducer';

export const getAllRecord = () => {

    $.get("http://119.23.38.100:8080/cma/IntermediateChecksRecord/getAll",null,(res)=>{
        let checkData = res.data;//后端返回的数组:res.data
        for(var i=checkData.length-1;i>=0;i--){ //为数组元素的key赋唯一值
            checkData[i].key = checkData[i].recordId;
        }
        let store = getStore();
        store.dispatch(setItems(checkData,'Record'));//使用redux
    });

};

class RecordForm extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribe = getStore().subscribe(this.refreshData);
        this.state = {
            data: [
                /*{
                    "recordId": 0,
                    "planId": 1,
                    "object": "路由器",
                    "checkDate": "2008-01-01",
                    "processRecord": "fjwejfklwejrkwejrklwejrwe",
                    "processRecordPerson": "ccc",
                    "processRecordDate": "2008-01-02",
                    "resultRecordPerson": "ccc",
                    "resultRecordDate": "2008-01-02",
                    "resultRecord": "dwqewqeqwewqeqw",
                    "note": "dwjewfjwefjuourwe",
                }*/
            ],
            pagination: {},
            loading: false,
            filtersInfo: null,
            visible: false,
        };
        this.columns = [{
            title: '记录编号',
            dataIndex: 'recordId',
            width: '20%',
        }, {
            title: '计划编号',
            dataIndex: 'planId',
            width: '20%',
        }, {
            title: '核查对象',
            dataIndex: 'object',
            width: '20%',
        }, {
            title: '核查时间',
            dataIndex: 'checkDate',
            width: '20%',
        }, {
            title: 'operation',
            dataIndex: 'operation',
            colSpan: 2,
            width: '7%',
            render: (text, record) => (
                        <a href="javascript:;" onClick={() => {
                            var props = {
                                item: record,
                            }
                            this.showCurRowMessage(props)
                        }}>Detail</a>
            ),

        },{
            title: 'operation',
            dataIndex: 'delete',
            colSpan: 0,
            width: '7%',
            render: (text, record) => (
                    <Popconfirm title="确定删除?" onConfirm={() => this.onDelete(record.recordId,record.planId)}>
                        <a href="javascript:;">Delete</a>
                    </Popconfirm>

            ),

        }
        ];

    }


    showModal = () => {
        this.setState({visible: true,});
    }
    searchByPlanId=()=>{
        const newData ={
            planId:this.props.form.getFieldValue('searchPlanId')
        };
        $.get("http://119.23.38.100:8080/cma/IntermediateChecksRecord/getOneByPlanId?planId="+newData.planId ,null,(res)=>{
            this.setState({
                data:[res.data]
            })
        });

    }
    searchByRecordId=()=>{
        const newData ={
            recordId:this.props.form.getFieldValue('searchRecordId')
        };
        const {data}=this.state;
            $.get("http://119.23.38.100:8080/cma/IntermediateChecksRecord/getOneByRecordId?recordId=" + newData.recordId, null, (res) => {
                this.setState({
                    data: [res.data]
                })
            });


    }

    handleAdd = () =>{
        const newItem ={
            planId: this.props.form.getFieldValue('planId'),
            object: this.props.form.getFieldValue('object'),
            checkDate: this.props.form.getFieldValue('checkDate').format('YYYY-MM-DD'),
            processRecord: this.props.form.getFieldValue('processRecord'),
            processRecordPerson: this.props.form.getFieldValue('processRecordPerson'),
            processRecordDate: this.props.form.getFieldValue('processRecordDate').format('YYYY-MM-DD'),
            resultRecord: this.props.form.getFieldValue('resultRecord'),
            resultRecordPerson: this.props.form.getFieldValue('resultRecordPerson'),
            resultRecordDate: this.props.form.getFieldValue('resultRecordDate').format('YYYY-MM-DD'),
            note: this.props.form.getFieldValue('note'),
        };


        const {data,visible}=this.state;
        $.ajax({
            type:"post",
            url:"http://119.23.38.100:8080/cma/IntermediateChecksRecord/addOne",
            data:newItem,
            async:false,
            success:function (d) {
                alert("新增成功");
                $.get("http://119.23.38.100:8080/cma/IntermediateChecksPlan/getOne?planId="+newItem.planId ,null,(res)=>{
                    res.data.state = 1;
                    $.ajax({
                        type:"post",
                        url:"http://119.23.38.100:8080/cma/IntermediateChecksPlan/modifyOne",
                        data:res.data,
                        async:false,
                        success:function(d){
                        }
                    });

                });


            }
        });
        this.setState({
            visible:false,
        });
        this.getAllRecords();
        this.props.form.resetFields();
    }
    onDelete = (recordId,planId)=>{
        $.ajax({
            type:"post",
            url:"http://119.23.38.100:8080/cma/IntermediateChecksRecord/deleteOne",
            data:{recordId:recordId},
            async:false,
            success:function(d){
                alert("删除成功");
                $.get("http://119.23.38.100:8080/cma/IntermediateChecksPlan/getOne?planId="+planId ,null,(res)=>{
                    res.data.state = 0;
                    $.ajax({
                        type:"post",
                        url:"http://119.23.38.100:8080/cma/IntermediateChecksPlan/modifyOne",
                        data:res.data,
                        async:false,
                        success:function(d){
                        }
                    });

                });

            }
        });

        this.getAllRecords();
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    showCurRowMessage = (props) => {
        this.props.addTab("核查记录信息", "核查记录信息", RecordInspectView, props);
    }
    handleTableChange = (pagination, filters) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
            filtersInfo: filters,
        });

    }
    getAllRecords =()=>{
        $.get("http://119.23.38.100:8080/cma/IntermediateChecksRecord/getAll",null,(res)=>{
            this.setState({data:res.data})
        });
    }

    refresh=()=>{
        this.getAllRecords();
    }

    refreshData=()=>{
        this.setState({
            data: getStore().getState().Record.items
        });

    }

    componentWillMount(){
        this.getAllRecords();
    }

    componentWillUnmount(){
        this.unsubscribe();
    }


    render() {
        const columns = this.columns;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout =
            {
                labelCol: { span:8 },
                wrapperCol: { span:14 },
            };
        return (
            <div>
                <Form>
                <FormItem>
                    <div>
                        <Col span={1}>
                    <Button type="primary" onClick={this.showModal}>新增
                    </Button>
                        </Col>
                    <Button type="primary" onClick={this.refresh}>刷新
                    </Button>
                    </div>
                </FormItem>
                <FormItem label="计划编号:" hasFeedback>
                 {
                   getFieldDecorator('searchPlanId', {
                   })
                   (<Input style={{width: 100}}/>)
                    }
                    <Button type="primary" icon="search" onClick={this.searchByPlanId}>
                        Search
                    </Button>
                 </FormItem>
                    <FormItem label="记录编号:" hasFeedback>
                        {
                            getFieldDecorator('searchRecordId', {
                            })
                            (<Input style={{width: 100}}/>)
                        }
                        <Button type="primary" icon="search" onClick={this.searchByRecordId}>
                            Search
                        </Button>
                    </FormItem>
                <Modal title="期间核查记录" visible={this.state.visible} onOk={this.handleAdd}
                       onCancel={this.handleCancel}>
                    <Form layout="horizontal">
                        <FormItem {...formItemLayout} label="计划编号:" hasFeedback>
                            {
                                getFieldDecorator('planId', {
                                    rules: [{required: true, message: '请输入计划编号！'}],
                                })
                                (<Input style={{width: 100, offset: 4}}/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label="核查对象:" hasFeedback>
                            {
                                getFieldDecorator('object', {
                                    rules: [{required: true, message: '请输入对象名称！'}],
                                })
                                (<Input style={{width: 100, offset: 4}}/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label="核查时间:" hasFeedback>
                            {getFieldDecorator('checkDate', {
                                rules: [{required: true, message: '请输入核查时间!'}],
                            })(
                                <DatePicker format="YYYY-MM-DD"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="核查过程记录人:" hasFeedback>
                            {
                                getFieldDecorator('processRecordPerson', {
                                    rules: [{required: true, message: '请输入记录人名称！'}],
                                })
                                (<Input style={{width: 100, offset: 4}}/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label="核查过程记录时间:" hasFeedback>
                            {getFieldDecorator('processRecordDate', {
                                rules: [{required: true, message: '请输入核查时间!'}],
                            })(
                                <DatePicker format="YYYY-MM-DD"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="核查过程记录:" hasFeedback>
                            {
                                getFieldDecorator('processRecord', {
                                    rules: [{required: true, message: '请输入记录！'}],
                                })
                                (<Input style={{width: 200, offset: 4}}/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label="核查结论记录人:" hasFeedback>
                            {
                                getFieldDecorator('resultRecordPerson', {
                                    rules: [{required: true, message: '请输入记录人！'}],
                                })
                                (<Input style={{width: 100, offset: 4}}/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label="核查结论记录时间:" hasFeedback>
                            {getFieldDecorator('resultRecordDate', {
                                rules: [{required: true, message: '请输入记录时间!'}],
                            })(
                                <DatePicker format="YYYY-MM-DD"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="核查结论记录:" hasFeedback>
                            {
                                getFieldDecorator('resultRecord', {
                                    rules: [{required: true, message: '请输入记录！'}],
                                })
                                (<Input style={{width: 200, offset: 4}}/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label="备注:" hasFeedback>
                            {
                                getFieldDecorator('note', {
                                    rules: [{required: false, message: '请输入备注！'}],
                                })
                                (<Input style={{width: 200, offset: 4}}/>)
                            }
                        </FormItem>
                    </Form>
                </Modal>
                <FormItem>
                    <Table columns={columns}
                           rowKey={record => record.id}
                           dataSource={this.state.data}
                           pagination={this.state.pagination}
                           loading={this.state.loading}
                           onChange={this.handleTableChange}
                    />
                </FormItem>
                </Form>
            </div>
        )
    }
}



class RecordComponent extends React.Component{
    render(){
        return(
            <Form>
                <FormItem>
                    <RecordFormTable addTab={this.props.addTab} />
                </FormItem>
            </Form>
        )
    }
}

const RecordFormTable = Form.create()(RecordForm);

export default RecordComponent;



