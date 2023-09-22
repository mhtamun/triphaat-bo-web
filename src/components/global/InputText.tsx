import React, { FocusEvent } from 'react';
import { InputText } from 'primereact/inputtext';

const InputTextField = (props: {
    type?: string;
    name: string;
    title: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.FormEvent<HTMLInputElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
    isDisabled?: boolean;
    errorMessage?: string;
}) => {
    const {
        type = null,
        name,
        title,
        placeholder,
        value,
        onChange,
        onBlur,
        isDisabled = false,
        errorMessage = '',
    } = props;

    const handleChange = () => {};
    const handleBlur = () => {};

    return (
        <div className="field p-fluid">
            <label htmlFor={name}>{title}</label>
            <InputText
                id={name}
                type={type ?? 'text'}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange ?? handleChange}
                onBlur={onBlur ?? handleBlur}
                disabled={isDisabled}
                className={!errorMessage ? '' : 'p-invalid'}
                aria-describedby={`${name}-help`}
            />
            {!errorMessage ? null : (
                <small id={`${name}-help`} className="p-error">
                    {errorMessage}
                </small>
            )}
        </div>
    );
};

export default InputTextField;
