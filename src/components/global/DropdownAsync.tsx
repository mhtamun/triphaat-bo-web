import React, { useCallback } from 'react';
import { Dropdown, DropdownFilterEvent } from 'primereact/dropdown';
import * as _ from 'lodash';

export interface ISelectOption {
    parentValue?: number | string;
    value?: boolean | number | string;
    label: string;
}

const SelectASyncField = (props: {
    name: string;
    title: string;
    placeholder?: string;
    value?: string;
    options: ISelectOption[];
    loadOptions: (searchKey: string) => void;
    isSearchable?: boolean;
    isClearable?: boolean;
    isDisabled?: boolean;
    setFieldValue: (name: string, value: any) => void;
    errorMessage?: string;
}) => {
    const {
        name,
        title,
        placeholder,
        value,
        options,
        loadOptions,
        isSearchable = false,
        isClearable = false,
        isDisabled = false,
        setFieldValue,
        errorMessage = '',
    } = props;

    const handleSearch = useCallback((event: DropdownFilterEvent) => {
        if (event.filter.length > 2) loadOptions(event.filter);
    }, []);

    return (
        <div className="field p-fluid">
            <label htmlFor={name}>{title}</label>
            <Dropdown
                inputId={name}
                name={name}
                placeholder={placeholder}
                value={value}
                options={
                    _.size(options) === 0
                        ? [
                              {
                                  value: null,
                                  label: 'Enter something to search...',
                              },
                          ]
                        : options
                }
                optionLabel="label"
                optionValue="value"
                filter={isSearchable}
                showClear={isClearable}
                disabled={isDisabled}
                className={!errorMessage ? '' : 'p-invalid'}
                aria-describedby={`${name}-help`}
                onChange={e => {
                    // console.debug({ e });

                    setFieldValue(e.target.name, e.target.value ?? null);
                }}
                onFilter={_.debounce(handleSearch, 500, { trailing: true })}
            />
            {!errorMessage ? null : (
                <small id={`${name}-help`} className="p-error">
                    {errorMessage}
                </small>
            )}
        </div>
    );
};

export default SelectASyncField;
