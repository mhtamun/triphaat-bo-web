import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { faDotCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as _ from 'lodash';

export interface ISelectOption {
    parentValue?: number | string;
    value?: boolean | number | string;
    label: string;
}

const SelectSyncField = (props: {
    name: string;
    title: string;
    placeholder?: string;
    value?: string;
    options: ISelectOption[];
    isGroupOptions?: boolean;
    isSearchable?: boolean;
    isClearable?: boolean;
    isDisabled?: boolean;
    parentValue?: string;
    setFieldValue: (name: string, value: any) => void;
    errorMessage?: string;
}) => {
    const {
        name,
        title,
        placeholder,
        value,
        options,
        isGroupOptions,
        isSearchable = false,
        isClearable = false,
        isDisabled = false,
        parentValue,
        setFieldValue,
        errorMessage = '',
    } = props;

    // console.debug({title, placeholder, value, parentValue });

    // console.debug({ name, options });

    let tempOptions = [...options];
    if (parentValue != undefined && parentValue != null) {
        tempOptions = _.filter(options, (option: ISelectOption) => option.parentValue === parentValue);
    }

    const groupedItemTemplate = (option: ISelectOption) => {
        return (
            <div className="flex align-items-center">
                <FontAwesomeIcon icon={faDotCircle} className="mr-2" />
                <div>{option.label}</div>
            </div>
        );
    };

    return (
        <div className="field p-fluid">
            <label htmlFor={name}>{title}</label>
            <Dropdown
                inputId={name}
                name={name}
                placeholder={placeholder}
                value={value}
                options={tempOptions}
                optionLabel="label"
                optionValue="value"
                optionGroupLabel={!isGroupOptions ? undefined : 'label'}
                optionGroupChildren={!isGroupOptions ? undefined : 'items'}
                optionGroupTemplate={groupedItemTemplate}
                filter={isSearchable}
                showClear={isClearable}
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
