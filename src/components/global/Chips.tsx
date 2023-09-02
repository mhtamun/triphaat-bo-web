import React from 'react';
import { Chips } from 'primereact/chips';
import _ from 'lodash';

const ChipsField = (props: {
    name: string;
    title: string;
    placeholder?: string;
    value?: string[];
    setFieldValue: (name: string, value: any) => void;
    isDisabled?: boolean;
    errorMessage?: string;
}) => {
    const { name, title, placeholder, value, setFieldValue, isDisabled = false, errorMessage = '' } = props;

    return (
        <div className="field p-fluid">
            <label htmlFor={name}>{title}</label>
            <Chips
                name={name}
                placeholder={placeholder}
                value={value}
                separator=","
                disabled={isDisabled}
                className={!errorMessage ? '' : 'p-invalid'}
                onChange={e => {
                    // console.debug({ e });

                    setFieldValue(e.target.name, e.target.value ?? null);
                }}
            />
            {!errorMessage ? null : (
                <small id={`${name}-help`} className="p-error">
                    {errorMessage}
                </small>
            )}
        </div>
    );
};

export default ChipsField;
