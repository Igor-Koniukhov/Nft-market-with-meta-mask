import React, {FunctionComponent} from 'react';

//import '../form.css';

type TextAreaProps = {
  id: string;
  rows: number;
  required: boolean;
  valid: boolean;
  touched: boolean;
  value: any;
  onChange: (id:any, value: any) => void;
  onBlur: () => void;
}

const TextArea : FunctionComponent<TextAreaProps> = (props) => (
  <div className="input">
      <textarea
        className={[
          !props.valid ? 'invalid' : 'valid',
          props.touched ? 'touched' : 'untouched'
        ].join(' ')}
        id={props.id}
        rows={props.rows}
        required={props.required}
        value={props.value}
        onChange={e => props.onChange(props.id, e.target.value)}
        onBlur={props.onBlur}
      />
  </div>
);

export default TextArea;
