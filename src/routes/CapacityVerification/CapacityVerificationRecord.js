import React, {Component, PropTypes} from 'react';
import {Row, Col, Card, Tabs, Select, Checkbox, Popconfirm, Button, Icon,Upload, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import $ from 'lib/jquery-3.3.1';
import {getAllVerificationProcess} from "./CapacityVerificationView";
import {getAllVerificationPlan} from "./CapacityVerificationPlan";
const { MonthPicker, RangePicker } = DatePicker;
//http://119.23.38.100:8080/cma/CapacityVerification
class CapacityVerificationRecord extends React.Component{
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
            id:null,
            data2:[],
            data3:[],
            newEquipmentName:null,
        };

    }

    getAll =()=>{


        $.get("http://119.23.38.100:8080/cma/StaffManagement/getAll",null,(res)=>{
            this.setState({data2:res.data})
        });

        $.get("http://119.23.38.100:8080/cma/Equipment/getAll",null,(res)=>{
            this.setState({data3:res.data})
        });
    }

    componentWillMount(){
        this.getAll();
    }

    showModal =() =>{
        this.setState({visible:true,});
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleModify =()=>{
        const newId = this.props.form.getFieldValue('equipmentId');
        const newDate = this.props.form.getFieldValue('date').format('YYYY-MM-DD');
        const newMethodId = this.props.form.getFieldValue('methodId');
        const newExperimenter = this.props.form.getFieldValue('experimenter');
        const newResult = this.props.form.getFieldValue('result');
        const newResultDeal = this.props.form.getFieldValue('resultDeal');
        const newNote = this.props.form.getFieldValue('note');
        const myItem = this.state.item;
        $.get("http://119.23.38.100:8080/cma/Equipment/getOne?id="+newId,null,(res)=>{
            this.setState({
                data4:res.data,
                newEquipmentName:res.data.name,
            })
            const newItem ={
                id:this.state.item.recordId,
                projectId:this.state.item.projectId,
                date:newDate,
                methodId:newMethodId,
                equipmentName:res.data.name,
                equipmentId:res.data.equipmentNumber,
                experimenter:newExperimenter,
                result:newResult,
                resultDeal:newResultDeal,
                note:newNote,
            };
            const {data,visible}=this.state;
            $.ajax({
                type: "post",
                url: "http://119.23.38.100:8080/cma/CapacityVerification/modifyOneRecord",
                data: newItem,
                async: false,
                success: function (d) {
                    message.success("执行成功");
                    $.get("http://119.23.38.100:8080/cma/CapacityVerification/getOneProject?id="+newItem.projectId ,null,(res)=>{
                        res.data.state = 1;
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

                    });

                },
                error: () => {
                    message.error("执行失败");
                    this.setState({
                        uploading: false,
                    });
                }

            })
            this.refresh();
        });

    }

    refresh =()=>{
        $.get("http://119.23.38.100:8080/cma/CapacityVerification//getOneRecord?id="+this.state.item.recordId,null,(res)=>{
            console.log(res.data);
            this.setState({
                item:res.data,
                visible:false
            })
        });
    }

    onDelete =()=>{
        const newId = this.state.item.projectId;
        $.ajax({
            type:"post",
            url:"http://119.23.38.100:8080/cma/CapacityVerification/deleteOneRecord",
            data:{id:this.state.item.recordId},
            async:false,
            success:function(d){
                message.success("删除成功");
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
                            getAllVerificationProcess(newItem.planId);
                            getAllVerificationPlan();
                        }
                    });

                });
            }
        });
        this.getAll();

    }



    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout =
            {
                labelCol: {span: 8},
                wrapperCol: {span: 14},
            };

        const width = '100%';
        const options1 = this.state.data2.map(data => <Option key={data.name}>{data.name}</Option>);
        const options2 = this.state.data3.map(data => <Option key={data.id}>{data.name}</Option>);

        return (
            <div>
                <FormItem>
                    <Col span = {2}>
                    <Button type="primary" onClick={this.showModal}>
                        修改记录
                    </Button>
                    </Col>
                    <Button type="danger"onClick={this.onDelete} >
                        删除记录
                    </Button>
                </FormItem>
                <Modal title="修改记录信息"
                       visible={this.state.visible}
                       onOk={this.handleModify}
                       onCancel={this.handleCancel}>
                    <Form layout="horizontal">
                        <FormItem {...formItemLayout} label= "执行时间:" hasFeedback>
                            {getFieldDecorator('date', {
                                rules: [{required: true, message: '请输入时间!'}],
                            })
                            (
                                <DatePicker/>
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label= "验证方法依据编号:" hasFeedback>
                            {
                                getFieldDecorator('methodId', {rules :[{required: true, message: '请输入编号！'}],
                                    initialValue:this.state.item.methodId
                                })
                                (<Input  style = {{width:100,offset:4}}/>)
                            }
                        </FormItem>

                        <FormItem {...formItemLayout} label = "仪器设备名称">
                            {getFieldDecorator('equipmentId',{
                                rules: [{required: true, message: '请选择！'}],
                                initialValue:this.state.item.equipmentId
                            })(<Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="Select a person"
                                optionFilterProp="equipmentId"
                                onChange={this.handleChange}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                                filterOption={(input, option) => option.props.equipmentId.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {options2}
                            </Select>)}
                        </FormItem>

                        <FormItem {...formItemLayout} label = "试验人员">
                            {getFieldDecorator('experimenter',{
                                rules: [{required: true, message: '请选择！'}],
                                initialValue:this.state.item.experimenter
                            })(<Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="Select a person"
                                optionFilterProp="experimenter"
                                onChange={this.handleChange}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                                filterOption={(input, option) => option.props.experimenter.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {options1}
                            </Select>)}
                        </FormItem>

                        <FormItem {...formItemLayout} label= "结果:" hasFeedback>
                            {
                                getFieldDecorator('result', {rules :[{required: true, message: '请输入结果！'}],
                                    initialValue:this.state.item.result
                                })
                                (<Input  style = {{width:100,offset:4}}/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label= "结果处理:" hasFeedback>
                            {
                                getFieldDecorator('resultDeal', {rules :[{required: true, message: '请输入处理！'}],
                                    initialValue:this.state.item.resultDeal
                                })
                                (<Input  style = {{width:200,offset:4}}/>)
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
                <Card key='0' title='记录详情' style={{marginBottom: 20}}>
                    <Row key='0'>
                        <Col span={12}>
                            <FormItem
                                label="执行时间"
                            >
                                {this.state.item.date}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="方法依据标准编号"
                            >
                                {this.state.item.methodId}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='1'>
                        <Col span={12}>
                            <FormItem
                                label="仪器设备名称"
                            >
                                {this.state.item.equipmentName}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="仪器设备编号"
                            >
                                {this.state.item.equipmentId}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='2'>
                        <Col span={12}>
                            <FormItem
                                label="试验人员"
                            >
                                {this.state.item.experimenter}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="结果"
                            >
                                {this.state.item.result}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='3'>
                        <Col span={12}>
                            <FormItem
                                label="结果处理"
                            >
                                {this.state.item.resultDeal}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='4'>
                        <Col span={12}>
                            <FormItem
                                label="备注"
                            >
                                {this.state.item.note}
                            </FormItem>
                        </Col>
                    </Row>

                </Card>
            </div>
        );
    }

}

CapacityVerificationRecord = Form.create({})(CapacityVerificationRecord);
export default CapacityVerificationRecord