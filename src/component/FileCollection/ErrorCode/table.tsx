import * as React from 'react';
import { Form, Input, Select } from 'antd';

const errorForm: any[] = [];
const EditableContext = React.createContext({ form: {} });

const editableRow: any = ({ form, index, ...props }) => {
  errorForm.push(form);
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
  public save = (e) => {
    const { record, handleSave, dataIndex } = this.props;
    const { getFieldValue } = this.form;
    handleSave({ ...record, [dataIndex]: getFieldValue(dataIndex + record.id) });
  }

  public getInput = () => {
    if (this.props.inputtype === 'input') {
      return (
        <Input ref={node => this.input = node} onPressEnter={this.save} onBlur={this.save} placeholder='请输入' />
      )
    } else {
      const { selectoption } = this.props;
      return (
        <Select>
          {
            selectoption.map((item: any) => {
              return (
                <Select.Option value={item.value} key={item.key}>{item.text}</Select.Option>
              )
            })
          }
        </Select>
      )
    }
  }

  public renderCell = () => {
    this.form = this.props.form;
    const { dataIndex, record, rules, inputtype, form } = this.props;
    return (
      <Form.Item style={{ margin: 0 }}>
        {
          form.getFieldDecorator(dataIndex + record.id, {
            validateTrigger: inputtype === 'select' ? ["onChange"] : ["onBlur"],
            rules,
            initialValue: record[dataIndex]
          })(
            this.getInput()
          )
        }
      </Form.Item>
    )
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
      <td {...restProps} style={{ padding: 5 }}>
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
  errorForm
}

