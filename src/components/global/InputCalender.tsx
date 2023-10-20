import React from 'react';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import moment from 'moment';
import { DATE_FORMAT, convertDateToIsoString, convertIsoStringToDate } from '../../utils/date';

const InputDateField = (props: {
    type?: string;
    name: string;
    title: string;
    placeholder?: string;
    value: string | string[];
    setFieldValue: (field: string, value: any) => void;
    setFieldTouched: (field: string, touched: boolean) => void;
    setFieldError: (field: string, value: string) => void;
    isRange?: boolean;
    isMultiple?: boolean;
    minDate?: Date;
    maxDate?: Date;
    isDisabled?: boolean;
    errorMessage?: string;
}) => {
    const {
        type = null,
        name,
        title,
        placeholder,
        value,
        setFieldValue,
        setFieldTouched,
        setFieldError,
        isRange,
        isMultiple,
        minDate,
        maxDate,
        isDisabled = false,
        errorMessage = '',
    } = props;

    // console.debug({ value });

    let tempValue = null;
    if (!isRange && !isMultiple && typeof value === 'string') {
        tempValue = !value ? '' : moment(value, DATE_FORMAT.DATETIME_SERVER).toDate();
    } else if (Array.isArray(value)) {
        tempValue = value.map((element: string) =>
            !element ? '' : moment(element, DATE_FORMAT.DATETIME_SERVER).toDate()
        );
    }

    // console.debug({ tempValue });

    return (
        <div className="field p-fluid">
            <label htmlFor={name}>{title}</label>
            <Calendar
                id={name}
                name={name}
                placeholder={placeholder}
                value={tempValue as any}
                onChange={(e: CalendarChangeEvent) => {
                    e.preventDefault();

                    // console.debug({ e });

                    if (!isRange && !isMultiple) {
                        // console.debug({ value: e.target.value as Date });
                        const formattedDate: string = moment(e.target.value as Date).format(DATE_FORMAT.YEAR_MM_DD);
                        // console.debug({ formattedDate });

                        setFieldValue(e.target.name, new Date(formattedDate).toISOString());
                    } else {
                        const value: Date[] = e.target.value as Date[];

                        setFieldValue(
                            e.target.name,
                            value.map((element: Date) => {
                                // console.debug({ date });
                                const formattedDate: string = moment(element).format(DATE_FORMAT.YEAR_MM_DD);
                                // console.debug({ formattedDate });

                                if (formattedDate === 'Invalid date') return null;

                                return new Date(formattedDate).toISOString();
                            })
                        );
                    }
                }}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    e.preventDefault();

                    // console.debug({ e });

                    setFieldTouched(name, true);
                }}
                selectionMode={!isRange ? (!isMultiple ? 'single' : 'multiple') : 'range'}
                readOnlyInput={isRange || isMultiple}
                minDate={minDate}
                maxDate={maxDate}
                showIcon
                showButtonBar
                // touchUI
                // inline={isMultiple}
                // numberOfMonths={!isMultiple ? 1 : 2}
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

export default InputDateField;
