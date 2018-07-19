import React, {Component, PropTypes} from 'react';
import {Row, Col, Card, Tabs, Select, Checkbox, Popconfirm, Button, Icon,Upload, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import $ from 'lib/jquery-3.3.1';
const { MonthPicker, RangePicker } = DatePicker;
//http://119.23.38.100:8080/cma/CapacityVerification
import CapacityVerificationRecord from "./CapacityVerificationRecord";
import {getAllVerificationProcess} from "./CapacityVerificationView";


class CapacityVerificationProject extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data:[
                /*{
                    id:'1',
                    name: "计划1",
                    organizer: "仪器部",
                    state:"0",
                },
                {
                    id:'2',
                    name: "计划1",
                    organizer: "仪器部",
                    state:"1",
                }*/
            ],
            uploading:false,
            visible: false,
            item:this.props.item,
            newData:[],
            msg:null,
            newState:null,
            /*projectId:'0',
            date:'0',
            methodId:'0',
            equipmentName:'0',*/
        };
    }
    showModal =() =>{
        this.setState({visible:true,});
    }

    handleModify = () =>{
        if(this.state.item.state=="已执行")
        {
            this.state.newState=1
        }
        else {
            this.state.newState=0
        }
        const newItem ={
            id: this.state.item.projectId,
            planId:this.state.item.planId,
            name: this.props.form.getFieldValue('name'),
            method: this.props.form.getFieldValue('method'),
            state:this.state.item.newState,
            note: this.props.form.getFieldValue('note'),
        };
        const newItem2 ={
            projectId: this.state.item.projectId,
            planId:this.state.item.planId,
            name: this.props.form.getFieldValue('name'),
            method: this.props.form.getFieldValue('method'),
            state:this.state.item.state,
            note: this.props.form.getFieldValue('note'),
        };
        console.log(newItem.id);
        $.ajax({
            type:"post",
            url:"http://119.23.38.100:8080/cma/CapacityVerification/modifyOneProject",
            data:newItem,
            async:false,
            success:function(d){
                alert("修改成功");
            }
        });

        this.setState({
            visible:false,
            item:newItem2
        });
        getAllVerificationProcess(this.state.item.planId);
        this.props.form.resetFields();
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    showCurRowMessage = () => {
        /*const newId = this.state.item.projectId;
        $.get("http://119.23.38.100:8080/cma/CapacityVerification/getOneProject?id="+newId ,null,(res)=>{
            res.data.state = 0;
            const newItem ={
                id: res.data.projectId,
                planId:res.data.planId,
                name: res.data.name,
                method: res.data.method,
                state:res.data.state,
                note: res.data.note,
            };
            console.log(res.data);
            $.ajax({
                type:"post",
                url:"http://119.23.38.100:8080/cma/CapacityVerification/modifyOneProject",
                data:newItem,
                async:false,
                success:function(d){
                }
            });

        });*/
        $.get("http://119.23.38.100:8080/cma/CapacityVerification//getRecordByProjectId?projectId="+this.state.item.projectId,null,(res)=>{
            console.log(res.data);
             let nima=res.data;
             console.log('nima',nima);
             this.state.newData = nima;
            var props ={
                item:this.state.newData,
            };
            console.log('item',props.item);

            this.props.addTab("能力验证记录-"+this.state.item.projectId, "能力验证记录-"+this.state.item.projectId, CapacityVerificationRecord, props);


        });

        }

    render()
    {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout =
            {
                labelCol: { span:8 },
                wrapperCol: { span:14 },
            };


        const width = '100%';
        return(
            <div>
                <FormItem>
                    <Button type="primary" onClick={this.showModal}>修改项目信息
                    </Button>
                </FormItem>
                <Card key='0' title='项目详情' style={{marginBottom: 20}}>
                    <Row key='0'>
                        <Col span={12}>
                            <FormItem
                                label="项目名称"
                            >
                                {this.state.item.name}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="验证方法"
                            >
                                {this.state.item.method}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='1'>
                        <Col span={12}>
                            <FormItem
                                label="状态"
                            >
                                {this.state.item.state}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="备注"
                            >
                                {this.state.item.note}
                            </FormItem>
                        </Col>
                    </Row>
                </Card>
                <Button
                    type="primary"
                    disabled={ this.state.item.state =="未执行" }
                    onClick={ this.showCurRowMessage }
                >
                    查看对应记录
                </Button>

                <Modal title="修改项目信息" visible={this.state.visible} onOk={this.handleModify} onCancel={this.handleCancel}>
                    <Form layout="horizontal">
                        <FormItem {...formItemLayout} label= "项目名称:" hasFeedback>
                            {getFieldDecorator('name', {
                                rules: [{required: true, message: '请输入名称!'}],
                                initialValue:this.state.item.name
                            })
                            (<Input  style = {{width:100,offset:4}}/>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label= "验证方法" hasFeedback>
                            {
                                getFieldDecorator('method', {rules :[{required: true, message: '请输入方法！'}],
                                    initialValue:this.state.item.method
                                })
                                (<Input  style = {{width:100,offset:4}}/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label= "备注:" hasFeedback>
                            {
                                getFieldDecorator('note', {rules :[{required: true, message: '请输入备注！'}],
                                    initialValue:this.state.item.note
                                })
                                (<Input  style = {{width:200,offset:4}}/>)
                            }
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }


}
CapacityVerificationProject = Form.create({})(CapacityVerificationProject);
export default CapacityVerificationProject