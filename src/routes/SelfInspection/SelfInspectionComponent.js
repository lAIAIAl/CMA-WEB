import React, {Component, PropTypes} from 'react';
import {Row, Col, Card, Tabs, Select, Checkbox, Popconfirm, Button, Icon, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import $ from 'lib/jquery-3.3.1';
const { MonthPicker, RangePicker } = DatePicker;
import SelfInspectionDocument from "./SelfInspectionDocument"
class SelfInspectionList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                /*{
                    key:'0',
                    "id": "1",
                    "name":"第一次自查",
                    "date": "2017-12-23",
                },
                {
                    key:'1',
                    "id": "2",
                    "name":"第二次自查",
                    "date": "2018-12-23",

                }*/
            ],
            pagination: {},
            loading: false,
            filtersInfo: null,
            visible: false,

        };
        this.columns = [{
            title: '自查编号',
            dataIndex: 'id',
            sorter: (a, b) => a.year - b.year,
        }, {
            title: '自查名称',
            dataIndex: 'name',
        }, {
            title: '自查日期',
            dataIndex: 'date',
        },{
            title: 'operation',
            dataIndex: 'detail',
            colSpan: 1,
            width: '7%',
            render: (text, record) => (

                <Button type="primary" onClick={() =>{
                    var props = {
                        item: record,
                    }
                    this.showCurRowMessage(props)
                }}>
                    查看
                </Button>
            ),

        }, {
            title: 'operation',
            dataIndex: 'delete',
            colSpan: 0,
            width: '7%',
            render: (text, record) => (
                <Popconfirm title="确定删除?" onConfirm={() => this.onDelete(record.id)}>
                    <Button type="danger" >
                        删除
                    </Button>
                </Popconfirm>

            ),

        }
        ];

    }
    getAll =()=>{
        $.get("http://119.23.38.100:8080/cma/SelfInspection/getAll",null,(res)=>{
            this.setState({data:res.data})
        });
    }

    showCurRowMessage = (props) => {
        this.props.addTab("自查文档-"+props.item.id, "自查文档-"+props.item.id, SelfInspectionDocument, props);
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    onDelete = (id) => {

        $.ajax({
            type:"post",
            url:"http://119.23.38.100:8080/cma/SelfInspection/deleteOne",
            data:{id:id},
            async:false,
            success:function(d){
                alert("删除成功");
            }
        });

        this.getAll();


    }

    componentWillMount(){
        this.getAll();
    }

    handleAdd =() =>{
        /*const {data} = this.state;
        const newData={
            year:this.props.form.getFieldValue('year'),
            date: this.props.form.getFieldValue('date').format('YYYY-MM-DD'),
        };
        this.setState({
            data:[...data,newData],
        })*/
        const newItem ={
            name: this.props.form.getFieldValue('name'),
            date: this.props.form.getFieldValue('date').format('YYYY-MM-DD'),
        };
        $.ajax({
            type:"post",
            url:"http://119.23.38.100:8080/cma/SelfInspection/addOne",
            data:newItem,
            async:false,
            success:function (d) {
                alert("新增成功");
            }
        });
        this.setState({
            visible:false,
        });
        this.getAll();
        this.props.form.resetFields();
    }
    showModal = () => {
        this.setState({visible: true,});
    }
    downLoad =() =>{
        const url = "http://119.23.38.100:8080/cma/SelfInspection/getExample";
        var tempwindow = window.open();
        tempwindow.location = url;
    }

    render() {
        const columns = this.columns;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout =
            {
                labelCol: {span: 8},
                wrapperCol: {span: 14},
            };
        return (
            <div>
                <FormItem>
                    <div>
                        <Button type="primary" 
                            style={{margin:'0px 10px 0px 0px'}}
                            onClick={this.showModal}>
                                新增
                        </Button>
                        <Button type="primary" onClick={this.downLoad}>
                            下载模版
                        </Button>
                    </div>
                    <Table columns={columns}
                           rowKey={record => record.id}
                           dataSource={this.state.data}
                           pagination={this.state.pagination}
                           loading={this.state.loading}
                           onChange={this.handleTableChange}
                    />
                </FormItem>
                <Modal title="新增自查" visible={this.state.visible} onOk={this.handleAdd}
                       onCancel={this.handleCancel}>
                    <Form layout="horizontal">
                        {/*<FormItem {...formItemLayout} label="内审年份:" hasFeedback>
                            {
                                getFieldDecorator('year', {
                                    rules: [{required: true, message: '请输入年份！'}],
                                })
                                (<Input style={{width: 100, offset: 4}}/>)
                            }
                        </FormItem>*/}
                        <FormItem {...formItemLayout} label="自查名称:" hasFeedback>
                            {
                                getFieldDecorator('name', {
                                    rules: [{required: true, message: '请输入名称！'}],
                                })
                                (<Input style={{width: 100, offset: 4}}/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label= "自查时间:" hasFeedback>
                            {getFieldDecorator('date', {
                                rules: [{required: true, message: '请输入自查时间!'}],
                            })
                            (
                                <DatePicker format="YYYY-MM-DD" />
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>

        );
    }
}
SelfInspectionList = Form.create({})(SelfInspectionList);
class SelfInspectionComponent extends React.Component{
    render(){
        return(
            <Form>
                <FormItem>
                    <SelfInspectionList addTab={this.props.addTab} />
                </FormItem>
            </Form>
        )
    }
}

export default SelfInspectionComponent;
