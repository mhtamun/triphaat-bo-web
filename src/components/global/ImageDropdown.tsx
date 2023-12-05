import React from 'react';
import { Dropdown, DropdownProps } from 'primereact/dropdown';
import _ from 'lodash';

export interface IImageSelectOption {
    value: string;
    imageUrl: string;
}

const ImageSelectSyncField = (props: {
    name: string;
    title: string;
    placeholder?: string;
    value?: string;
    options: IImageSelectOption[];
    setFieldValue: (name: string, value: any) => void;
    isSearchable?: boolean;
    isClearable?: boolean;
    isDisabled?: boolean;
    errorMessage?: string;
}) => {
    const {
        name,
        title,
        placeholder,
        value,
        options,
        setFieldValue,
        isSearchable = false,
        isClearable = false,
        isDisabled = false,
        errorMessage = '',
    } = props;
    // console.debug({ name, title, placeholder, value, options });

    const template = (option: IImageSelectOption, props?: DropdownProps) => {
        if (!option && props) {
            return <span>{props.placeholder}</span>;
        }

        return (
            <div className="flex align-items-center">
                <img src={option.imageUrl} alt={''} className="mr-2" style={{ maxWidth: !props ? '200px' : '25px' }} />
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
                options={options}
                optionLabel="imageUrl"
                optionValue="value"
                valueTemplate={template}
                itemTemplate={template}
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

export default ImageSelectSyncField;
