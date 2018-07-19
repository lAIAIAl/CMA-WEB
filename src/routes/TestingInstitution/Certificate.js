import React, {Component, PropTypes} from 'react';
import {Row, Col, Card, Tabs, Select, Checkbox, Popconfirm, Button, Icon,Upload, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message} from 'antd';
import ReactDOM from 'react-dom';
import moment from 'moment';
import {baseAddress} from 'services';
import $ from 'lib/jquery-3.3.1';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const AutoCompleteOption = AutoComplete.Option;
const { TextArea } = Input;


class CertificateForm extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            visible:false,
            visible2:false,
            fileId:null,
            certificate:[],
            fileList:[],
            uploading:false,
            modifyId:0,
        }
        this.columns=[
        {
            title:'文件名',
            dataIndex:'fileName',
            key:'fileName',

        },
        {
            title:'操作',
            colSpan:3,
            dataIndex:'download',
            key:'download',
            width: '10%',
            render:(text,record)=>(
                    <Button type="primary"onClick={() => { this.handleDownload(record.fileId) }} > 下载 </Button>
            )
        },
        {
            title:'操作',
            colSpan:0,
            dataIndex:'modify',
            width: '10%',
            key:'modify',
            render:(text,record)=>(
                <Button type="primary"onClick={() => { this.showModal2(record.fileId)  }} > 修改 </Button>
            )
        },
        {
            title:'操作',
            colSpan:0,
            dataIndex:'delete',
            width:'10%',
            key:'delete',
            render:(text,record)=>(
                <Popconfirm title="确定删除?" onConfirm={() => this.onDelete(record.fileId)}>
                    <Button type="danger" >  删除  </Button>
                </Popconfirm>
            )
        }
        ];
    }
    showModal = () => {
        this.setState({
        visible: true,
        })
    }
    showModal2=(key)=>{
        this.setState({
            visible2:true,
            modifyId:key,
        })
    }
    handleOk = () => {
        this.setState({
        visible: false,
        visible2:false,
        })
    }
    handleCancel = () =>{
        this.setState({
            visible2:false,
            visible:false,
        })
    }
    handleSelectChange = () =>{
    }
    getAll = () => {
        $.get(baseAddress+"/cma/Certificate/getAll",null,(res)=>{
            let temp = res.data;
            for(var i = temp.length-1; i >= 0; i--) {
                temp[i].key = temp[i].fileId;
            }
            this.setState({
                certificate: temp
            })
        })
    }
    componentWillMount() {
      this.getAll();
    }

    handleDownload = (key) => {
        const url = baseAddress+"/cma/Certificate/downloadOne?fileId="+key;
        var tempWindow = window.open();
        tempWindow.location = url;
    }
    handleAdd = () => {
        const {fileList} = this.state;
        const FData = new FormData();
   //     var fileName = this.props.form.getFieldValue('fileName');
   //     console.log(fileName);
   //     FData.append("fileName", fileName);
        fileList.forEach((file) => {
        FData.append("file", file)
        });
        console.log(FData);
        this.setState({
        visible: false,
        uploading: true,
        })
        $.ajax({
        type: "post",
        url: "http://119.23.38.100:8080/cma/Certificate/addOne",
        processData: false,
        contentType: false,
        data: FData,
        async: false,
        success: () => {
            message.success("新增成功");
            this.setState({
            fileList: [],
            })
        },
        error: () => {
            message.error("新增失败");
        }
        });
        this.setState({
        uploading: false,
        })
        this.getAll();
        this.props.form.resetFields();
    }
    onDelete = (key) => {
        $.ajax({
            type: "post",
            url: baseAddress+"/cma/Certificate/deleteOne",
            data: {fileId: key},
            async: false,
            success:function(d) {
            message.success("删除成功");
            }
        });
      this.getAll();
    }
    handleModify=()=>{
        const {fileList} = this.state;
//        var fileName = this.props.form.getFieldValue('fileName2');
        var fileId = this.state.modifyId;
  //      console.log(fileName);
        console.log(fileId);
        var FormD = new FormData();
        FormD.append("fileId", fileId);
 //       FormD.append("fileName", fileName);
        fileList.forEach((file) => {
            FormD.append("file", file);
        });
        this.setState({
            uploading: true,
        });
        $.ajax({
            type: "post",
            url: "http://119.23.38.100:8080/cma/Certificate/modifyOne",
            data: FormD,
            processData: false,
            contentType: false,
            async: false,
            success: () => {
                message.success("修改成功");
                this.setState({
                    fileList: [],
                    uploading: false,
                    visible2:false,
                });
            },
            error: () => {
                message.error("修改失败");
                this.setState({
                    uploading: false,
                    visible2:false,
                });
            }
        });
        this.getAll();
        this.props.form.resetFields();
    }
    render(){
        const columns = this.columns;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout =
            {
                labelCol: {span: 5},
                wrapperCol: {span: 12},
            };
        const addprops = {
            action: "http://119.23.38.100:8080/cma/Certificate/addOne",
            onRemove: (file) => {
                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileList }) => ({
                    fileList: [...fileList, file],
                }));
                return false;
            },
            fileList: this.state.fileList,
        }
        return(
            <div>
                <Form>
                    <Button type="primary" onClick={this.showModal}>
                        上传文档
                    </Button>
                    <Modal title="文件上传" visible={this.state.visible} onOk={this.handleAdd} onCancel={this.handleCancel}>

                        <Form id="upfile">
                            <FormItem>
                                文件
                            </FormItem>
                            <Upload {...addprops}>
                                <Button> <Icon type="upload" />  添加文件 </Button>
                            </Upload>
                        </Form>
                    </Modal>
                    <Modal title="修改文件" visible={this.state.visible2} onOk={this.handleModify} onCancel={this.handleCancel}>

                        <Form id="upfile">
                            <FormItem {...formItemLayout}>
                                文件
                            </FormItem>
                            <Upload {...addprops}>
                                <Button> <Icon type="upload" /> 添加文件 </Button>
                            </Upload>
                        </Form>
                    </Modal>
                    <FormItem>
                        <Table columns={columns}   dataSource={this.state.certificate} loading={this.state.loading}  />
                    </FormItem>
                </Form>
            </div>
        );
    }
}

const Certificate = Form.create()(CertificateForm);
export default Certificate;