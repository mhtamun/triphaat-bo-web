import React from 'react';
import { Calendar, CalendarChangeEvent, CalendarDateTemplateEvent, CalendarSelectEvent } from 'primereact/calendar';
import moment from 'moment';
import { DATE_FORMAT } from '../../utils/date';

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
    enabledDates?: Date[];
    notEnabledDateSelectionErrorMessage?: string;
    disabledDates?: Date[];
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
        enabledDates,
        notEnabledDateSelectionErrorMessage,
        disabledDates,
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

    const dateTemplate = (date: CalendarDateTemplateEvent) => {
        if (!enabledDates) return date.day;

        if (
            enabledDates.some(
                disabledDate =>
                    disabledDate.getDate() === date.day &&
                    disabledDate.getMonth() === date.month &&
                    disabledDate.getFullYear() === date.year
            )
        ) {
            return (
                <strong
                    style={{
                        color: 'white',
                        backgroundColor: 'green',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                    }}
                >
                    {date.day}
                </strong>
            );
        }

        return (
            <strong
                style={{
                    color: 'white',
                    backgroundColor: 'red',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'not-allowed',
                }}
            >
                {date.day}
            </strong>
        );
    };

    return (
        <div className="field p-fluid">
            <label htmlFor={name}>{title}</label>
            <Calendar
                id={name}
                name={name}
                placeholder={placeholder}
                value={tempValue as any}
                onChange={(e: CalendarChangeEvent) => {
                    // console.debug({ e });

                    e.preventDefault();

                    if (e.target.value === null) {
                        setFieldValue(e.target.name, null);

                        return;
                    }

                    if (!isRange && !isMultiple) {
                        const value = e.target.value as Date;

                        if (
                            enabledDates &&
                            value &&
                            !enabledDates.some(
                                enabledDate =>
                                    enabledDate.getDate() === value.getDate() &&
                                    enabledDate.getMonth() === value.getMonth() &&
                                    enabledDate.getFullYear() === value.getFullYear()
                            )
                        ) {
                            // setFieldValue(e.target.name, null);

                            setFieldError(
                                e.target.name,
                                !notEnabledDateSelectionErrorMessage
                                    ? 'This date is not available for selection or is not within the allowed dates.'
                                    : notEnabledDateSelectionErrorMessage
                            );

                            return;
                        }

                        setFieldValue(
                            e.target.name,
                            new Date(moment(value).format(DATE_FORMAT.YEAR_MM_DD)).toISOString()
                        );
                    } else {
                        const value: Date[] = e.target.value as Date[];

                        if (
                            enabledDates &&
                            value &&
                            !enabledDates.some(
                                enabledDate =>
                                    enabledDate.getDate() === value[0].getDate() &&
                                    enabledDate.getMonth() === value[0].getMonth() &&
                                    enabledDate.getFullYear() === value[0].getFullYear()
                            )
                        ) {
                            // setFieldValue(e.target.name, null);

                            setFieldError(
                                e.target.name,
                                !notEnabledDateSelectionErrorMessage
                                    ? 'This date is not available for selection or is not within the allowed dates.'
                                    : notEnabledDateSelectionErrorMessage
                            );

                            return;
                        }

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
                disabledDates={!enabledDates ? disabledDates : undefined}
                hideOnDateTimeSelect
                showIcon
                showButtonBar
                dateTemplate={dateTemplate}
                // formatDateTime={(date: Date) => date.toISOString()}
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
