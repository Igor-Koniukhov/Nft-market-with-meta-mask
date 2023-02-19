import React, {FunctionComponent} from 'react';

//import "../form.css";

type InputProps = {
    id: string;
    label: string;
    valid: boolean;
    touched: boolean;
    type: any;
    value: any;
    placeholder: string;
    onChange: (id:any, value: any, files: any) => void;
    onBlur: () => void;
}

// @ts-ignore
const Input: FunctionComponent<InputProps> = (props) => {

    return (
        <div className="input">
            {props.label && <label htmlFor={props.id}>{props.label}</label>}

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

        </div>
    )

};

export default Input;
