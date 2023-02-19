import React, {FunctionComponent} from 'react';

import '../form.css';
type FilePicker = {
    id: string;
    label: string;
    control: string;
    valid: boolean;
    touched: boolean;
    type: any;
    value: any;
    placeholder: string;
    onChange: (id:any, value: any, files: any) => void;
    onBlur: () => void;
}

const FilePicker: FunctionComponent<FilePicker> = (props) => (
  <div className="input">
    <label htmlFor={props.id}>{props.label}</label>
    <input
      className={[
        !props.valid ? 'invalid' : 'valid',
        props.touched ? 'touched' : 'untouched'
      ].join(' ')}
      type="file"
      id={props.id}
      onChange={e => props.onChange(props.id, e.target.value, e.target.files)}
      onBlur={props.onBlur}
    />
  </div>
);

export default FilePicker;
