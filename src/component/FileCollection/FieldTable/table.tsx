import * as React from 'react';
import { Form, Input, Select } from 'antd';

const portForm: any[] = [];
const EditableContext = React.createContext({ form: {} });

const editableRow: any = ({ form, index, ...props }) => {
  portForm.push(form);
  return (
    <EditableContext.Provider value={form}>
      <tr {...props} />
    </EditableContext.Provider>
  )
}

const EditableFormRow = Form.create()(editableRow);

class EditableCell extends React.Component<any, any>{
  public input;
  public form;
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
    }
  }

  public toggleEdit = () => {
    /* const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    }) */

    this.input.focus();
  }

  public save = (e) => {
    const { record, handleSave, dataIndex } = this.props;
    const { getFieldValue } = this.form;
    /* this.form.validateFields((error, value) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...value });
    }) */
    console.log({
      [dataIndex]: getFieldValue(dataIndex)
    });

    handleSave({ ...record, [dataIndex]: getFieldValue(dataIndex) });
  }

  public getInput = () => {
    if (this.props.inputtype === 'input') {
      return (
        <Input ref={node => this.input = node} onPressEnter={this.save} onBlur={this.save} placeholder='请输入' />
      )
    } else {
      return (
        <Select>
          <Select.Option value={1}>Bigint</Select.Option>
          <Select.Option value={2}>Varchar</Select.Option>
          <Select.Option value={3}>Double</Select.Option>
          <Select.Option value={4}>Datetime</Select.Option>
          <Select.Option value={41}>time</Select.Option>
          <Select.Option value={43}>date</Select.Option>
        </Select>
      )
    }
  }

  public renderCell = (form) => {
    this.form = form;
    const { dataIndex, record, rules } = this.props;
    return (
      <Form.Item style={{ margin: 0 }}>
        {
          form.getFieldDecorator(dataIndex, {
            validateTrigger: ["onChange"],
            rules,
            initialValue: record[dataIndex]
          })(
            this.getInput()
          )
        }
      </Form.Item>
    )
    /* if (editing) {
      
    } else {
      return (
        <div
          className="editable-cell-value-wrap"
          onClick={this.toggleEdit}
        >
          {children !== '' ? children : '无数据'}
        </div>
      )
    } */
  }

  public render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps} style={{ padding: 5 }} onClick={this.toggleEdit}>
        {
          editable ? (
            <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
          ) : (
              children
            )
        }
      </td>
    )

  }
}

export {
  EditableFormRow,
  EditableCell,
  portForm
}

