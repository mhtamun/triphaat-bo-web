import React from 'react';
import { MultiSelect } from 'primereact/multiselect';
import _ from 'lodash';
import { ISelectOption } from './Dropdown';

export interface IMultiSelectOption extends ISelectOption {
    items?: { value: boolean | number | string; label: string }[];
}

const MultiSelectSyncField = (props: {
    name: string;
    title: string;
    placeholder?: string;
    value?: string;
    options: IMultiSelectOption[];
    isGroupOptions?: boolean;
    setFieldValue: (name: string, value: any) => void;
    isDisabled?: boolean;
    errorMessage?: string;
}) => {
    const {
        name,
        title,
        placeholder,
        value,
        options,
        isGroupOptions,
        setFieldValue,
        isDisabled = false,
        errorMessage = '',
    } = props;

    // console.debug({ name, title, placeholder, value, options });

    const groupedItemTemplate = (option: IMultiSelectOption) => {
        return (
            <div className="flex align-items-center">
                <div>{option.label}</div>
            </div>
        );
    };

    return (
        <div className="field p-fluid">
            <label htmlFor={name}>{title}</label>
            <MultiSelect
                name={name}
                placeholder={placeholder}
                value={value}
                options={options}
                optionLabel="label"
                optionValue="value"
                optionGroupLabel={!isGroupOptions ? undefined : 'label'}
                optionGroupChildren={!isGroupOptions ? undefined : 'items'}
                // optionGroupTemplate={groupedItemTemplate}
                display="chip"
                maxSelectedLabels={5}
                filter
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

export default MultiSelectSyncField;
