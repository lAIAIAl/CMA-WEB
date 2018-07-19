import React, {Component, PropTypes} from 'react';
import {Row, Col, Card, Tabs, Select, Checkbox, Popconfirm, Button, Icon,Upload, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import $ from 'lib/jquery-3.3.1';
const { MonthPicker, RangePicker } = DatePicker;

class SelfInspectionDocument extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data: [
               /* {
                    key:'0',
                    "fileName":"表格1",
                    "fileId": "3",

                },
                {
                    key:'1',
                    "fileName":"表格2",
                    "fileId": "4",


                }*/
            ],
            fileList: [],
            pagination: {},
            loading: false,
            filtersInfo: null,
            visible: false,
            visible2: false,
            fileId:null,
            item:this.props.item,
            uploading:false,
        };
        this.columns = [{
            title: '文件名称',
            dataIndex: 'fileName',
            width: '30%',
        }, {
            title: '文件编号',
            dataIndex: 'id',
            width: '30%',
        }, {
            title: 'operation',
            dataIndex: 'operation',
            colSpan: 2,
            width: '4%',
            render: (text, record) => (

                <Button type="primary"onClick={() => {
                    this.handleDownload(record.id)
                }} >
                    下载
                </Button>
            ),

        }, {
            title: 'operation',
            dataIndex: 'delete',
            colSpan: 0,
            width: '4%',
            render: (text, record) => (

                <Button type="primary"onClick={() => {
                    this.showModal2(record.id)
                }} >
                    修改
                </Button>

            ),


        },{
            title: 'operation',
            dataIndex: 'modify',
            colSpan: 0,
            width: '4%',
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
        $.get("http://119.23.38.100:8080/cma/SelfInspection/getAllFile?id="+this.state.item.id,null,(res)=>{
            this.setState({data:res.data})
        });
    }

    componentWillMount(){
        this.getAll();
    }

    showModal = () => {
        this.setState({visible: true,});
    }
    showModal2 =(id)=>{
        console.log('a',id);
        this.state.fileId = id;
        this.setState({visible2:true});
        console.log('b',this.state.id);

    }
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
            visible2: false,
        });
    }
    /*handleAdd = () => {
        const {data} = this.state;
        const newData={
            fileName:this.props.form.getFieldValue('fileName'),
            year: "2017",
            date: "2017-12-23",
        };
        this.setState({
            data:[...data,newData],
        })
    }*/
    handleAdd = () => {
        this.props.form.validateFields((err, fieldsValue) => {
            if(err) {
                return ;
            }
        });

        const {fileList} = this.state;

        var id = this.state.item.id;
        var fileName = this.props.form.getFieldValue('fileName');
        var formda = new FormData();
        formda.append("id", id);
        formda.append("fileName", fileName);
        fileList.forEach((file) => {
            formda.append("file", file);
        });

        this.setState({
            visible:false,
            uploading: true,
        });
        //var request = new XMLHttpRequest();
        //request.open("POST", "http://119.23.38.100:8080/cma/StaffQualification/addOne");
        //request.send(formda);

        $.ajax({
            type: "post",
            url: "http://119.23.38.100:8080/cma/SelfInspection/addOneFile",
            data: formda,
            processData: false,
            contentType: false,
            async: false,
            success: () => {
                message.success("新增成功");
                this.setState({
                    fileList: [],
                    uploading: false,
                    visible:false,
                });
            },
            error: () => {
                message.error("新增失败");
                this.setState({
                    uploading: false,
                });
            }
        });
        this.getAll();
        this.props.form.resetFields();
    }

    handleOk = () => {

        this.props.form.validateFields((err, fieldsValue) => {
            if(err) {
                return ;
            }
        });

        const {fileList} = this.state;

        var id = this.state.item.id;
        var fileId = this.state.fileId;
        var fileName = this.props.form.getFieldValue('fileName2');
        var formda = new FormData();
        formda.append("id", id);
        formda.append("fileId", fileId);
        formda.append("fileName", fileName);
        fileList.forEach((file) => {
            formda.append("file", file);
        });

        this.setState({
            uploading: true,
        });

        $.ajax({
            type: "post",
            url: "http://119.23.38.100:8080/cma/SelfInspection/modifyOneFile",
            data: formda,
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
                });
            }
        });
        this.getAll();
        this.props.form.resetFields();


    }

    onDelete = (fileId) => {

        $.ajax({
            type:"post",
            url:"http://119.23.38.100:8080/cma/SelfInspection/deleteOneFile",
            data:{fileId:fileId},
            async:false,
            success:function(d){
                alert("删除成功");
            }
        });

        this.getAll();


    }



    handleDownload = (key) => {
        console.log(key);
        const url = "http://119.23.38.100:8080/cma/SelfInspection/downloadFile?fileId="+key;
        var tempwindow = window.open();
        tempwindow.location = url;
    }


    render() {
        const columns = this.columns;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout =
            {
                labelCol: {span: 5},
                wrapperCol: {span: 12},
            };
        const addprops = {
            action: "http://119.23.38.100:8080/cma/SelfInspection/addOneFile",
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
        return (
            <div>
                <Form>
                    <Button type="primary" onClick={this.showModal}>
                        上传文档
                    </Button>
                    <Modal title="文件上传"
                           visible={this.state.visible}
                           onOk={this.handleAdd}
                           onCancel={this.handleCancel}>
                        <Form layout="vertical">

                            <FormItem label="文件名称:" hasFeedback>
                                {
                                    getFieldDecorator('fileName', {
                                        rules: [{ message: '请输入文件名称！'}],
                                    })
                                    (<Input style={{width: "100%"}}/>)
                                }
                            </FormItem>
                        </Form>
                        <Form id="upfile">
                            <FormItem>
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
                    <Modal title="文件上传" visible={this.state.visible2} onOk={this.handleOk}
                           onCancel={this.handleCancel}>
                        <Form layout="vertical">
                            <FormItem label="文件名称:" hasFeedback>
                                {
                                    getFieldDecorator('fileName2', {
                                        rules: [{message: '请输入文件名称！'}],
                                    })
                                    (<Input style={{width: "100%"}}/>)
                                }
                            </FormItem>
                        </Form>
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
        );
    }

}

SelfInspectionDocument = Form.create({})(SelfInspectionDocument);
export default SelfInspectionDocument