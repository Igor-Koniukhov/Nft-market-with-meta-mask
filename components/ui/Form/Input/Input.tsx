import React, {FunctionComponent} from 'react';



type InputProps = {
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

// @ts-ignore
const Input: FunctionComponent<InputProps> = (props) => (
    <div className="input">
        {props.label && <label htmlFor={props.id}>{props.label}</label>}
        {props.control === 'input' && (
            <input
                className={[
                    !props.valid ? 'invalid' : 'valid',
                    props.touched ? 'touched' : 'untouched'
                ].join(' ')}
                type={props.type}
                id={props.id}

                value={props.value}
                placeholder={props.placeholder}
                onChange={e => props.onChange(props.id, e.target.value, e.target.files)}
                onBlur={props.onBlur}
            />
        )}
        {/*{props.control === 'textarea' && (
            <textarea
                className={[
                    !props.valid ? 'invalid' : 'valid',
                    props.touched ? 'touched' : 'untouched'
                ].join(' ')}
                id={props.id}
                rows={props.rows}
                required={props.required}
                value={props.value}
                // @ts-ignore
                onChange={e => props.onChange(props.id, e.target.value)}
                onBlur={props.onBlur}
            />
        )}*/}
    </div>
);

export default Input;
