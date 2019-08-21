import * as React from 'react';
import {Form} from 'antd';
import {FormComponentProps} from 'antd/lib/form';

interface IFildsProps {
  fieldList: any[]
}

interface IFildsProps extends FormComponentProps{

}

class Filds extends React.Component<IFildsProps> {
  public render() {
    return (
      <div>
        2131313
      </div>
    );
  }
}

export default Form.create({
  name: 'FieldsTable',
  mapPropsToFields: (props:IFildsProps ) {
    return {
      nameCn: {
        props.fieldList
      }
    }
  }
})(Filds)
