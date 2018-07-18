import React, {Component, PropTypes} from 'react';
import {Row, Col, Card, Tabs, Select, Checkbox, Popconfirm, Button, Icon, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message} from 'antd';
import ReactDOM from 'react-dom';
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
import $ from 'lib/jquery-3.3.1';


class RecordInspectView extends React.Component{

    constructor(props){
        super(props);
        this.state ={
            visible:false,
            item:this.props.item,
        };
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
    handleModify=()=> {
        const newItem ={
            recordId: this.state.item.recordId,
            planId: this.props.form.getFieldValue('planId'),
            object: this.props.form.getFieldValue('object'),
            checkDate: this.props.form.getFieldValue('checkDate').format('YYYY-MM-DD'),
            processRecord: this.props.form.getFieldValue('processRecord'),
            processRecordPerson: this.props.form.getFieldValue('processRecordPerson'),
            processRecordDate: this.props.form.getFieldValue('processRecordDate').format('YYYY-MM-DD'),
            resultRecordPerson: this.props.form.getFieldValue('resultRecordPerson'),
            resultRecordDate: this.props.form.getFieldValue('resultRecordDate').format('YYYY-MM-DD'),
            resultRecord: this.props.form.getFieldValue('resultRecord'),
            note: this.props.form.getFieldValue('note'),
        };
        $.ajax({
            type:"post",
            url:"http://119.23.38.100:8080/cma/IntermediateChecksRecord/modifyOne",
            data:newItem,
            async:false,
            success:function(d){
                alert("修改成功");
            }
        });
        this.setState({item:newItem,
        visible:false,
        });
    }
    deleteRecord =()=>{
        const recordId = this.props.item.recordId;
        const planId = this.props.item.planId;
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
            <Card key='0' title='核查信息' style={{marginBottom: 20}}>
                <Row key='0'>
                    <Col span={12}>
                        <FormItem
                            label="记录编号"
                        >
                            {this.state.item.recordId}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label="计划编号"
                        >
                            {this.state.item.planId}
                        </FormItem>
                    </Col>
                </Row>
                <Row key='1'>
                    <Col span={12}>
                        <FormItem
                            label="核查对象"
                        >
                            {this.state.item.object}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label="核查时间"
                        >
                            {this.state.item.checkDate}
                        </FormItem>
                    </Col>
                </Row>
            </Card>
                <Card key='1' title='核查过程记录' style={{marginBottom: 20}}>
                <Row key='0'>
                    <Col span={12}>
                        <FormItem
                            label="核查过程记录人"
                        >
                            {this.state.item.processRecordPerson}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label="核查过程记录时间"
                        >
                            {this.state.item.processRecordDate}
                        </FormItem>
                    </Col>
                </Row>
                <Row key='1'>
                    <Col span={12}>
                        <FormItem
                            label="核查过程记录"
                        >
                            {this.state.item.processRecord}
                        </FormItem>
                    </Col>
                </Row>
                </Card>
                <Card key='2' title='核查结论记录' style={{marginBottom: 20}}>
                <Row key='0'>
                    <Col span={12}>
                        <FormItem
                            label="核查结果记录人"
                        >
                            {this.state.item.resultRecordPerson}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label="核查结果记录时间"
                        >
                            {this.state.item.resultRecordDate}
                        </FormItem>
                    </Col>
                </Row>
                <Row key='1'>
                    <Col span={12}>
                        <FormItem
                            label="核查结论"
                        >
                            {this.state.item.resultRecord}
                        </FormItem>
                    </Col>
                </Row>
                <Row key='2'>
                    <Col span={12}>
                        <FormItem
                            label="备注"
                        >
                            {this.state.item.note}
                        </FormItem>
                    </Col>
                </Row>
                </Card>
                <FormItem>
                    <Button type="primary" onClick={this.showModal}>修改
                    </Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" onClick={this.deleteRecord}>删除
                    </Button>
                </FormItem>
                <Modal title="期间核查记录" visible={this.state.visible} onOk={this.handleModify} onCancel={this.handleCancel}>
                    <Form layout="horizontal">
                        {/*<FormItem {...formItemLayout} label= "记录编号:" hasFeedback>
                            {
                                getFieldDecorator('recordId', {rules :[{required: true, message: '请输入记录编号！'}],
                                    initialValue:this.state.item.recordId
                                })
                                (<Input  style = {{width:100,offset:4}}/>)
                            }
                        </FormItem>*/}
                        <FormItem {...formItemLayout} label= "计划编号:" hasFeedback>
                            {
                                getFieldDecorator('planId', {rules :[{required: true, message: '请输入计划编号！'}],
                                    initialValue:this.state.item.planId
                                })
                                (<Input  style = {{width:100,offset:4}}/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label= "核查对象:" hasFeedback>
                            {
                                getFieldDecorator('object', {rules :[{required: true, message: '请输入对象名称！'}],
                                    initialValue:this.state.item.object
                                })
                                (<Input  style = {{width:100,offset:4}}/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label= "核查时间:" hasFeedback>
                            {getFieldDecorator('checkDate', {
                                rules: [{required: true, message: '请输入核查时间!'}],
                            })(
                                <DatePicker format="YYYY-MM-DD" />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label= "核查过程记录人:" hasFeedback>
                            {
                                getFieldDecorator('processRecordPerson', {rules :[{required: true, message: '请输入记录人名称！'}],
                                    initialValue:this.state.item.processRecordPerson
                                })
                                (<Input  style = {{width:100,offset:4}}/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label= "核查过程记录时间:" hasFeedback>
                            {getFieldDecorator('processRecordDate', {
                                rules: [{required: true, message: '请输入核查时间!'}],
                            })(
                                <DatePicker format="YYYY-MM-DD" />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label= "核查过程记录:" hasFeedback>
                            {
                                getFieldDecorator('processRecord', {rules :[{required: true, message: '请输入记录！'}],
                                    initialValue:this.state.item.processRecord
                                })
                                (<Input  style = {{width:200,offset:4}}/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label= "核查结论记录人:" hasFeedback>
                            {
                                getFieldDecorator('resultRecordPerson', {rules :[{required: true, message: '请输入记录人！'}],
                                    initialValue:this.state.item.resultRecordPerson
                                })
                                (<Input  style = {{width:100,offset:4}}/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label= "核查结论记录时间:" hasFeedback>
                            {getFieldDecorator('resultRecordDate', {
                                rules: [{required: true, message: '请输入记录时间!'}],
                            })(
                                <DatePicker format="YYYY-MM-DD" />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label= "核查结论记录:" hasFeedback>
                            {
                                getFieldDecorator('resultRecord', {rules :[{required: true, message: '请输入记录！'}],
                                })
                                (<Input  style = {{width:200,offset:4}}/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label= "备注:" hasFeedback>
                            {
                                getFieldDecorator('note', {rules :[{required: false, message: '请输入备注！'}],
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

RecordInspectView = Form.create({})(RecordInspectView);
export default RecordInspectView