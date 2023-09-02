import React, { FocusEvent } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';

const TextAreaField = (props: {
    name: string;
    title: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.FormEvent<HTMLTextAreaElement>) => void;
    onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
    isDisabled?: boolean;
    errorMessage?: string;
}) => {
    const { name, title, placeholder, value, onChange, onBlur, isDisabled = false, errorMessage = '' } = props;

    const handleChange = () => {};
    const handleBlur = () => {};

    return (
        <div className="field p-fluid">
            <label htmlFor={name}>{title}</label>
            <InputTextarea
                id={name}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange ?? handleChange}
                onBlur={onBlur ?? handleBlur}
                disabled={isDisabled}
                className={!errorMessage ? '' : 'p-invalid'}
                aria-describedby={`${name}-help`}
                autoResize={false}
            />
            {!errorMessage ? null : (
                <small id={`${name}-help`} className="p-error">
                    {errorMessage}
                </small>
            )}
        </div>
    );
};

export default TextAreaField;
