import React, {Component, PropTypes} from 'react';
import {Row, Col, Card, Tabs, Select, Checkbox, Popconfirm, Button, Icon,Upload, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import $ from 'lib/jquery-3.3.1';
const { MonthPicker, RangePicker } = DatePicker;
//http://119.23.38.100:8080/cma/CapacityVerification
import CapacityVerificationProject from "./CapacityVerificationProject"
import {getAllVerificationPlan} from "./CapacityVerificationPlan";
import { getStore } from 'store/globalStore';
import { setItems } from 'common/basic/reducers/ItemReducer';

export const getAllVerificationProcess = (id) => {

    $.get("http://119.23.38.100:8080/cma/CapacityVerification//getAllProject?planId="+id,null,(res)=>{
        let checkData = res.data;//后端返回的数组:res.data
        for(var i=checkData.length-1;i>=0;i--){ //为数组元素的key赋唯一值
            checkData[i].key = checkData[i].projectId;
            switch(checkData[i].state){
                case 0:
                    checkData[i].state = "未执行";
                    break;
                case 1:
                    checkData[i].state = "已执行";
                    break;
            }
        }

        let store = getStore();
        store.dispatch(setItems(checkData,'VerificationProcess'));//使用redux
    });

};

class CapacityVerificationView extends React.Component{
    constructor(props) {
        super(props);
        this.unsubscribe = getStore().subscribe(this.refreshData);
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
            data2:[],
            data3:[],
            uploading:false,
            visible: false,
            visible2:false,
            visible3:false,
            visible4:false,
            item:this.props.item,
            id:null,
            data4:[],
            fileList:[],
            file:[],
        };
        this.columns = [
            {
                title: '项目名称',
                dataIndex: 'name',
            },
            {
                title: '试验方法',
                dataIndex: 'method',
            },
            {
                title: '状态',
                dataIndex: 'state',
            },
            {
                title: 'operation',
                dataIndex: 'detail',
                colSpan: 2,
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
                    <Popconfirm title="确定删除?" onConfirm={() => this.onDelete(record.projectId)}>
                        <Button type="danger" >
                            删除
                        </Button>
                    </Popconfirm>

                ),

            },
            {
                title: 'operation',
                dataIndex: 'complete',
                colSpan: 0,
                width: '4%',

                render: (text, record) => (

                    <Button type="primary"
                            disabled={ record.state == "已执行" }
                            onClick={() => {
                        this.showModal2(record.projectId)
                    }}>
                        执行
                    </Button>

                ),
            }
            ]


    }
    refreshData=()=>{
        this.setState({
            data: getStore().getState().VerificationProcess.items
        });

    }

    showModal =() =>{
        this.setState({visible:true,});
    }

    showModal2 =(id) =>{
        this.state.id = id;
        this.setState({visible2:true,});
    }

    showModal3 =() =>{
        this.setState({visible3:true,});
    }

    showModal4 =() =>{
        this.setState({visible4:true,});
    }


    showCurRowMessage = (props) => {
        this.props.addTab(this.state.item.planId+"-项目-"+props.item.projectId, this.state.item.planId+"-项目-"+props.item.projectId, CapacityVerificationProject, props);
    }

    /*getAllProject =()=>{
        $.get("http://119.23.38.100:8080/cma/CapacityVerification//getAllProject?planId="+this.state.item.planId,null,(res)=>{
            this.setState({data:res.data})
        });
    }*/

    getAll =()=>{


        $.get("http://119.23.38.100:8080/cma/StaffManagement/getAll",null,(res)=>{
            this.setState({data2:res.data})
        });

        $.get("http://119.23.38.100:8080/cma/Equipment/getAll",null,(res)=>{
            this.setState({data3:res.data})
        });
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    componentWillMount(){
        this.getAll();
        getAllVerificationProcess(this.state.item.planId);
        getAllVerificationPlan();
    }



    onDelete =(id)=>{
        console.log(id);
        $.ajax({
            type:"post",
            url:"http://119.23.38.100:8080/cma/CapacityVerification/deleteOneProject",
            data:{id:id},
            async:false,
            success:function(d){

                alert(d.msg);
            }
        });

        getAllVerificationProcess(this.state.item.planId);
        getAllVerificationPlan();

    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
            visible2:false,
            visible3:false,
            visible4:false,
        });
    }

    handleAdd = () => {
        const newId = this.props.form.getFieldValue('equipmentId');
        const newDate = this.props.form.getFieldValue('date').format('YYYY-MM-DD');
        const newMethodId = this.props.form.getFieldValue('methodId');
        const newExperimenter = this.props.form.getFieldValue('experimenter');
        const newResult = this.props.form.getFieldValue('result');
        const newResultDeal = this.props.form.getFieldValue('resultDeal');
        const newNote = this.props.form.getFieldValue('note3');
        $.get("http://119.23.38.100:8080/cma/Equipment/getOne?id="+newId,null,(res)=>{
            this.setState({
                data4:res.data
            })
            const newItem ={
                projectId:this.state.id,
                date:newDate,
                methodId:newMethodId,
                equipmentName:this.state.data4.name,
                equipmentId:this.state.data4.equipmentNumber,
                experimenter:newExperimenter,
                result:newResult,
                resultDeal:newResultDeal,
                note:newNote,
            };
            console.log('number',newItem);
            const {data,visible}=this.state;
            $.ajax({
                type: "post",
                url: "http://119.23.38.100:8080/cma/CapacityVerification/addOneRecord",
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
                                getAllVerificationProcess(newItem.planId);
                                /*getAllVerificationPlan();*/
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
            this.getAll();

        });

        getAllVerificationProcess(this.state.item.planId);
        this.setState({
            visible2:false,
        });
        this.props.form.resetFields();

    };
    handleChange=(value)=>{
        console.log(`selected ${value}`);

    }

    handleModify = () =>{
        const newItem ={
            id: this.state.item.planId,
            name: this.props.form.getFieldValue('name'),
            organizer: this.props.form.getFieldValue('organizer'),
            year: this.props.form.getFieldValue('year').format('YYYY'),
            state:this.state.item.state,
            note: this.props.form.getFieldValue('note'),
        };
        const newItem2 ={
            planId: this.state.item.planId,
            name: this.props.form.getFieldValue('name'),
            organizer: this.props.form.getFieldValue('organizer'),
            year: this.props.form.getFieldValue('year').format('YYYY'),
            state:this.state.item.state,
            note: this.props.form.getFieldValue('note'),
        };
        console.log(newItem.id);
        $.ajax({
            type:"post",
            url:"http://119.23.38.100:8080/cma/CapacityVerification/modifyOne",
            data:newItem,
            async:false,
            success:function(d){
                alert("修改成功");
            }
        });

        this.setState({
            visible:false,
            item:newItem2,
        });
        this.props.form.resetFields();
        getAllVerificationPlan();
    }

    handleOk =()=>{
        const newItem ={
            planId: this.state.item.planId,
            name: this.props.form.getFieldValue('name2'),
            method: this.props.form.getFieldValue('method'),
            note: this.props.form.getFieldValue('note2'),
        };
        $.ajax({
            type:"post",
            url:"http://119.23.38.100:8080/cma/CapacityVerification/addOneProject",
            data:newItem,
            async:false,
            success:function(d){
                alert("新增成功");
            }
        });
        this.setState({
            visible3:false,
        });
        this.props.form.resetFields();

        getAllVerificationProcess(this.state.item.planId);
        getAllVerificationPlan();
    }

    downLoad =()=>{

        const key = this.state.item.planId;
        $.get("http://119.23.38.100:8080/cma/CapacityVerification/getOne?id="+key ,null,(res)=>{

            if(res.data.analysis == null)
            {
                alert("没有可下载的文件！");
            }
            else {
                console.log(key);
                const url = "http://119.23.38.100:8080/cma/CapacityVerification/downloadAnalysis?id=" + key;
                var tempwindow = window.open();
                tempwindow.location = url;
            }
        });

    }

    upLoad =()=>{
        this.props.form.validateFields((err, fieldsValue) => {
            if(err) {
                return ;
            }
        });

        const {fileList} = this.state;
        var id =this.state.item.planId;
        var formda = new FormData();
        formda.append("id", id);
        fileList.forEach((file) => {
            formda.append("analysis", file);
        });

        this.setState({
            visible4:false,
            uploading: true,
        });
        $.ajax({
            type: "post",
            url: "http://119.23.38.100:8080/cma/CapacityVerification/uploadAnalysis",
            data: formda,
            processData: false,
            contentType: false,
            async: false,
            success: () => {
                message.success("上传成功");
                this.setState({
                    fileList: [],
                    uploading: false,
                    visible:false,
                });
            },
            error: () => {
                message.error("上传失败");
                this.setState({
                    uploading: false,
                });
            }
        });
    }


    render()
    {


        const addprops = {
            action: "http://119.23.38.100:8080/cma/CapacityVerification/uploadAnalysis",
            onRemove: (analysis) => {
                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(analysis);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (analysis) => {
                this.setState(({ fileList }) => ({
                    fileList: [...fileList, analysis],
                }));
                return false;
            },
            fileList: this.state.fileList,
        }

        const { getFieldDecorator } = this.props.form;
        const formItemLayout =
            {
                labelCol: { span:8 },
                wrapperCol: { span:14 },
            };

        const width = '100%';
        const columns = this.columns;
        const options1 = this.state.data2.map(data => <Option key={data.name}>{data.name}</Option>);
        const options2 = this.state.data3.map(data => <Option key={data.id}>{data.name}</Option>);
        return(
            <div>
                <FormItem>
                    <Col span={2}>
                        <Button type="primary" onClick={this.showModal4}>
                            上传分析报告
                        </Button>
                    </Col>
                    <Button type="primary" onClick={this.downLoad}>
                        下载分析报告
                    </Button>
                </FormItem>
                <Card key='0' title='能力验证计划' style={{marginBottom: 20}}>
                    <Row key='0'>
                        <Col span={12}>
                            <FormItem
                                label="计划名称"
                            >
                                {this.state.item.name}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="组织方"
                            >
                                {this.state.item.organizer}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='1'>
                        <Col span={12}>
                            <FormItem
                                label="参加年度"
                            >
                                {this.state.item.year}
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
                <FormItem>
                    <Button type="primary" onClick={this.showModal}>
                        修改计划
                    </Button>
                </FormItem>

                <Modal title="能力验证计划"
                       visible={this.state.visible}
                       onOk={this.handleModify}
                       onCancel={this.handleCancel}>
                    <Form layout="horizontal">
                        <FormItem {...formItemLayout} label= "计划名称:" hasFeedback>
                            {
                                getFieldDecorator('name', {rules :[{required: true, message: '请输入计划名称！'}],
                                    initialValue:this.state.item.name
                                })
                                (<Input  style = {{width:100,offset:4}}/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label= "组织方:" hasFeedback>
                            {
                                getFieldDecorator('organizer', {rules :[{required: true, message: '请输入组织方！'}],
                                    initialValue:this.state.item.organizer
                                })
                                (<Input  style = {{width:100,offset:4}}/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label= "参加年度:" hasFeedback>
                            {
                                getFieldDecorator('year', {rules :[{required: true, message: '请输入年度！'}],

                                })
                                (<DatePicker format="YYYY-MM-DD" />)
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

                <Modal title="执行计划"
                       visible={this.state.visible2}
                       onOk={this.handleAdd}
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
                                })
                                (<Input  style = {{width:100,offset:4}}/>)
                            }
                        </FormItem>

                        <FormItem {...formItemLayout} label = "仪器设备名称">
                            {getFieldDecorator('equipmentId',{
                                rules: [{required: true, message: '请选择！'}],
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
                                })
                                (<Input  style = {{width:100,offset:4}}/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label= "结果处理:" hasFeedback>
                            {
                                getFieldDecorator('resultDeal', {rules :[{required: true, message: '请输入处理！'}],
                                })
                                (<Input  style = {{width:200,offset:4}}/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label= "备注:" hasFeedback>
                            {
                                getFieldDecorator('note3', {rules :[{required: true, message: '请输入备注！'}],
                                })
                                (<Input  style = {{width:200,offset:4}}/>)
                            }
                        </FormItem>
                    </Form>
                </Modal>
                <Modal title="新增项目"
                       visible={this.state.visible3}
                       onOk={this.handleOk}
                       onCancel={this.handleCancel}>
                    <Form layout="horizontal">
                        <FormItem {...formItemLayout} label= "项目名称:" hasFeedback>
                            {getFieldDecorator('name2', {
                                rules: [{required: true, message: '请输入名称!'}],
                            })
                            (
                                (<Input  style = {{width:100,offset:4}}/>)
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout}
                                  label= "验证方法:"
                                  hasFeedback>
                            {
                                getFieldDecorator('method', {rules :[{required: true, message: '请输入方法！'}],
                                })
                                (<Input  style = {{width:100,offset:4}}/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label= "备注:" hasFeedback>
                            {
                                getFieldDecorator('note2', {rules :[{required: true, message: '请输入备注！'}],
                                })
                                (<Input  style = {{width:100,offset:4}}/>)
                            }
                        </FormItem>
                    </Form>
                </Modal>
                <Modal title="分析报告上传" visible={this.state.visible4} onOk={this.upLoad}
                       onCancel={this.handleCancel}>
                    <Form id="upfile">
                        <FormItem {...formItemLayout}>
                            文件
                        </FormItem>
                        <Upload {...addprops}>
                            <Button>
                                <Icon type="upload" />
                                添加文件
                            </Button>
                        </Upload>
                    </Form>
                </Modal>
                <Table columns={columns}
                       rowKey={record => record.id}
                       dataSource={this.state.data}
                       pagination={this.state.pagination}
                       loading={this.state.loading}
                       onChange={this.handleTableChange}
                />
                <FormItem>
                    <Button type="primary" onClick={this.showModal3}>新增项目
                    </Button>
                </FormItem>
            </div>
        );

    }
}


CapacityVerificationView = Form.create({})(CapacityVerificationView);
export default CapacityVerificationView