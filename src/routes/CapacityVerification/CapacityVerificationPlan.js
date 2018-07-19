import React, {Component, PropTypes} from 'react';
import {Row, Col, Card, Tabs, Select, Checkbox, Popconfirm, Button, Icon,Upload, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import $ from 'lib/jquery-3.3.1';
const { MonthPicker, RangePicker } = DatePicker;
import CapacityVerificationView from "./CapacityVerificationView"
import { getStore } from 'store/globalStore';
import { setItems } from 'common/basic/reducers/ItemReducer';

export const getAllVerificationPlan = () => {

    $.get("http://119.23.38.100:8080/cma/CapacityVerification//getAll",null,(res)=>{
        let checkData = res.data;//后端返回的数组:res.data
        for(var i=checkData.length-1;i>=0;i--){ //为数组元素的key赋唯一值
            checkData[i].key = checkData[i].planId;
        }
        let store = getStore();
        store.dispatch(setItems(checkData,'VerificationPlan'));//使用redux
    });

};

class CapacityVerificationPlan extends React.Component{
    constructor(props){
        super(props);
        this.unsubscribe = getStore().subscribe(this.refreshData);
        this.state = {
            visible: false,
            uploading:false,
            data: [
                /*{
                    id:'1',
                    name: "计划1",
                    organizer: "仪器部",
                    year:"2018",
                },
                {
                    id:'2',
                    name: "计划1",
                    organizer: "仪器部",
                    year:"2018",
                }*/
            ],
        };
        this.columns = [
            {
                title:"计划编号",
                dataIndex:'planId',
            },
            {
                title: '计划名称',
                dataIndex: 'name',
            },
            {
                title: '项目组织方',
                dataIndex: 'organizer',
            },
            {
                title: '参加年度',
                dataIndex: 'year',
            },
            {
                title: 'operation',
                dataIndex: 'detail',
                colSpan: 1,
                width: '4%',
                render: (text, record) => (

                    <Button type="primary" onClick={() => {
                        var props = {
                            item: record,
                        }
                        this.showCurRowMessage(props)
                    }}>
                        查看
                    </Button>
                ),
            },
            {
                title: 'operation',
                dataIndex: 'delete',
                colSpan: 0,
                width: '4%',
                render: (text, record) => (
                    <Popconfirm title="确定删除?" onConfirm={() => this.onDelete(record.planId)}>
                        <Button type="danger" >
                            删除
                        </Button>
                    </Popconfirm>

                ),

            },

        ]
    };

    showModal = () => {
        this.setState({visible: true,});
    }

    showCurRowMessage = (props) => {
        this.props.addTab("能力验证计划-"+props.item.planId, "能力验证计划-"+props.item.planId, CapacityVerificationView, props);
    }

    refreshData=()=>{
        this.setState({
            data: getStore().getState().VerificationPlan.items
        });

    }

    getAll =()=>{
        $.get("http://119.23.38.100:8080/cma/CapacityVerification//getAll",null,(res)=>{
            this.setState({data:res.data})
        });
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    componentWillMount(){
        this.getAll();
    }

    onDelete =(id) =>{
        $.ajax({
            type:"post",
            url:"http://119.23.38.100:8080/cma/CapacityVerification/deleteOne",
            data:{id:id},
            async:false,
            success:function(d){
                alert(d.msg);

            }
        });

        this.getAll();


    }


    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleAdd = () => {
        const newItem ={
            name:this.props.form.getFieldValue('name'),
            organizer:this.props.form.getFieldValue('organizer'),
            year:this.props.form.getFieldValue('year').format('YYYY'),
            note:this.props.form.getFieldValue('note'),
        };
        const {data,visible}=this.state;
        $.ajax({
            type: "post",
            url: "http://119.23.38.100:8080/cma/CapacityVerification/addOne",
            data: newItem,
            async: false,
            success: function (d) {
                message.success("新增成功");
            },
            error: () => {
                message.error("新增失败");
                this.setState({
                    uploading: false,
                });
            }
        })
        this.setState({
            visible:false,
        });
        this.getAll();

    };

    searchById=()=>{
        const newData ={
            id:this.props.form.getFieldValue('searchPlanId')
        };
        $.get("http://119.23.38.100:8080/cma/CapacityVerification/getOne?id="+newData.id ,null,(res)=>{
            this.setState({
                data:[res.data]
            })
        });

    }
    render()
    {
        const columns = this.columns;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout =
            {
                labelCol: {span: 8},
                wrapperCol: {span: 14},
            };

        return(
            <div>
                <FormItem>
                    <Col span ={2}>
                    <Button type="primary" onClick={this.showModal}>
                        新增
                    </Button>
                    </Col>
                    <Button type="primary" onClick={this.getAll}>
                        刷新
                    </Button>
                </FormItem>
                    <FormItem label="计划编号:" hasFeedback>
                        {
                            getFieldDecorator('searchPlanId', {
                            })
                            (<Input style={{width: 100}}/>)
                        }
                        <Button type="primary" icon="search" onClick={this.searchById}>
                            Search
                        </Button>
                    </FormItem>
                <FormItem>
                    <Table columns={columns}
                           rowKey={record => record.id}
                           dataSource={this.state.data}
                           pagination={this.state.pagination}
                           loading={this.state.loading}
                           onChange={this.handleTableChange}
                     />
                 </FormItem>
                 <Modal title="新增能力验证计划" visible={this.state.visible} onOk={this.handleAdd}
                       onCancel={this.handleCancel}>
                    <Form layout="horizontal">
                        <FormItem {...formItemLayout} label="计划名称:" hasFeedback>
                            {
                                getFieldDecorator('name', {
                                    rules: [{required: true, message: '请输入名称！'}],
                                })
                                (<Input style={{width: 100, offset: 4}}/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label= "组织方:" hasFeedback>
                            {getFieldDecorator('organizer', {
                                rules: [{required: true, message: '请输入组织方!'}],
                            })
                            (
                                <Input style={{width: 100, offset: 4}}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label= "参加年度:" hasFeedback>
                            {getFieldDecorator('year', {
                                rules: [{required: true, message: '请选择年度！!'}],
                            })
                            (
                                <DatePicker  format="YYYY-MM-DD" />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label= "备注:" hasFeedback>
                            {getFieldDecorator('note', {
                                rules: [{required: true, message: '请输入备注!'}],
                            })
                            (
                                <Input style={{width: 200, offset: 4}}/>
                            )}
                        </FormItem>

                    </Form>
                </Modal>
            </div>
        );

    }




}

CapacityVerificationPlan = Form.create({})(CapacityVerificationPlan);
export default CapacityVerificationPlan