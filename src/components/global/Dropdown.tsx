import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import _ from 'lodash';

export interface ISelectOption {
    value: boolean | number | string;
    label: string;
}

const SelectSyncField = (props: {
    name: string;
    title: string;
    placeholder?: string;
    value?: string;
    options: ISelectOption[];
    setFieldValue: (name: string, value: any) => void;
    isDisabled?: boolean;
    errorMessage?: string;
}) => {
    const { name, title, placeholder, value, options, setFieldValue, isDisabled = false, errorMessage = '' } = props;

    // console.debug({ name, title, placeholder, value, options });

    return (
        <div className="field p-fluid">
            <label htmlFor={name}>{title}</label>
            <Dropdown
                inputId={name}
                name={name}
                placeholder={placeholder}
                value={value}
                options={options}
                optionLabel="label"
                optionValue="value"
                showClear
                filter
                disabled={isDisabled}
                className={!errorMessage ? '' : 'p-invalid'}
                aria-describedby={`${name}-help`}
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

export default SelectSyncField;
