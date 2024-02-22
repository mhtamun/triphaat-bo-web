import React, { useEffect } from 'react';
import { FormikValues, useFormik } from 'formik';
import _, { isArray } from 'lodash';
import { Button } from 'primereact/button';
import {
    InputTextField,
    InputDateField,
    SelectAsyncField,
    SelectSyncField,
    MultiSelectSyncField,
    TextareaField,
    EditorField,
    ChipsField,
    FileSelectField,
} from '../index';
import { ISelectOption } from './Dropdown';
import { IMultiSelectOption } from './MultiSelect';

export interface IField {
    type: string;
    name: string;
    title: string;
    placeholder: string;
    initialValue: string | number | boolean | null;
    options?: ISelectOption[] | IMultiSelectOption[];
    loadOptions?: (searchKey: string) => void; // only for async select
    isGroupOptions?: boolean; // only for multi select dropdowns
    isSearchable?: boolean;
    isClearable?: boolean;
    parentFieldName?: string;
    minDate?: Date; // only for date picker
    maxDate?: Date; // only for date picker
    enabledDates?: Date[]; // only for date picker
    notEnabledDateSelectionErrorMessage?: string;
    disabledDates?: Date[]; // only for date picker
    acceptType?: 'image/*' | 'video/*' | 'application/*' | '*/*'; // only for file select
    maxFileSize?: number; // only for file select
    isDisabled?: boolean;
    show?: (values: FormikValues) => boolean;
    validate?: (values: FormikValues) => string | null;
    onChange?: (name: string, value: any, setFormikFieldValue: (name: string, value: any) => void) => void;
    col?: number;
}

export default function GenericFormGenerator({
    datum = null,
    fields,
    nonEdibleFields = [],
    callback,
    onValueModify,
    submitButtonShow = true,
    submitButtonText,
    resetButtonShow = false,
    resetButtonText,
    enableReinitialize = false,
}: {
    datum?: any;
    fields: IField[];
    nonEdibleFields?: string[];
    callback?: (values: any, resetForm?: () => void) => void;
    onValueModify?: (values: FormikValues) => void;
    submitButtonShow?: boolean;
    submitButtonText?: string;
    resetButtonShow?: boolean;
    resetButtonText?: string;
    enableReinitialize?: boolean;
}) {
    // console.debug({ datum });
    // console.debug({ fields });

    const formik = useFormik({
        enableReinitialize,

        initialValues: !datum
            ? _.reduce(
                  fields,
                  (result, field, index) => {
                      //   console.debug({ result, field, index });

                      const temp: any = result;
                      temp[field.name] =
                          field.initialValue === undefined || field.initialValue === null ? null : field.initialValue;

                      return temp;
                  },
                  {}
              )
            : _.pick(
                  datum,
                  _.map(fields, field => field.name)
              ),

        validate: values => {
            return _.reduce(
                fields,
                (errors, field) => {
                    let result = null;

                    if (!_.isUndefined(field.validate) && !_.isNull(field.validate)) {
                        result = field.validate(values);
                    }

                    if (field.show && !field.show(values)) {
                        result = null;
                    }

                    if (!_.isNull(result))
                        return {
                            ...errors,
                            [field.name]: result,
                        };

                    return { ...errors };
                },
                {}
            );
        },

        onSubmit: (values: FormikValues, { setSubmitting }) => {
            // console.debug({ values });

            setSubmitting(true);

            const hiddenFields: string[] = [];

            // Check false value not to submit in the form
            values = _.mapValues(values, (value: any, key: string) => {
                // console.debug({ value, key });
                console.debug({ datum });

                if (_.isUndefined(value) || _.isNull(value) || _.isNaN(value)) {
                    if (_.isNull(datum) || _.isEmpty(datum)) hiddenFields.push(key); // This executes when create

                    return null;
                }

                if (
                    (_.isString(value) && _.isEqual(value, '')) ||
                    (_.isString(value) && _.isEqual(value, '0')) ||
                    (_.isNumber(value) && _.isEqual(value, 0)) ||
                    (_.isArray(value) && _.size(value) === 0)
                ) {
                    const field = _.find(fields, field => field.name === key);
                    // console.debug({ value, key, field });

                    if (!field) return null;

                    // if (
                    //     field.type === 'hidden' ||
                    //     field.type === 'date' ||
                    //     field.type === 'date' ||
                    //     field.type === 'date-multiple' ||
                    //     field.type === 'date-range' ||
                    //     field.type === 'richtext' ||
                    //     field.type === 'select-async' ||
                    //     field.type === 'select-sync' ||
                    //     field.type === 'file-select'
                    // ) {
                    //     return null;
                    // }

                    // if (
                    //     field.type === 'email' ||
                    //     field.type === 'password' ||
                    //     field.type === 'tel' ||
                    //     field.type === 'text' ||
                    //     field.type === 'textarea'
                    // ) {
                    //     return '';
                    // }

                    if (field.type === 'number') {
                        return 0;
                    }

                    if (field.type === 'multi-select-sync' || field.type === 'chips') {
                        return [];
                    }

                    return null;
                }

                return value;
            });
            // console.debug({ values });

            // Check information type value or not showing value not to submit in the form
            _.map(
                _.filter(
                    fields,
                    field => field.type === 'information' || (field.show && field.show(values) === false)
                ) as IField[],
                field => {
                    hiddenFields.push(field.name);
                }
            );
            // console.debug({ hiddenFields });

            const filteredValues = _.omit(values, [...hiddenFields, ...nonEdibleFields]);
            // console.debug({ filteredValues });

            setSubmitting(false);

            if (submitButtonShow && callback) {
                callback(filteredValues, () => {
                    formik.resetForm();
                });
            }
        },

        onReset: (values: FormikValues) => {
            // console.debug({ values });
            // if (submitButtonShow && callback) {
            //     callback(null);
            // }
            // toto: Fix
        },
    });

    // function onKeyDown(keyEvent) {
    //     if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
    //         keyEvent.preventDefault();
    //     }
    // }

    function getField(field: IField) {
        // console.debug({
        //     field,
        // });

        const errorMessage: string =
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            !formik.touched[field.name] && !formik.errors[field.name] ? '' : formik.errors[field.name];

        if (
            field.type === 'hidden' ||
            field.type === 'email' ||
            field.type === 'number' ||
            field.type === 'password' ||
            field.type === 'tel' ||
            field.type === 'text'
        )
            return (
                <InputTextField
                    key={field.name}
                    type={field.type}
                    name={field.name}
                    title={field.title}
                    placeholder={field.placeholder}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    value={formik.values[field.name] ?? ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isDisabled={field.isDisabled}
                    errorMessage={errorMessage}
                />
            );

        if (field.type === 'textarea')
            return (
                <TextareaField
                    key={field.name}
                    name={field.name}
                    title={field.title}
                    placeholder={field.placeholder}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    value={formik.values[field.name] ?? ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isDisabled={field.isDisabled}
                    errorMessage={errorMessage}
                />
            );

        if (field.type === 'date')
            return (
                <InputDateField
                    key={field.name}
                    name={field.name}
                    title={field.title}
                    placeholder={field.placeholder}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    value={formik.values[field.name] ?? ''}
                    setFieldValue={formik.setFieldValue}
                    setFieldTouched={formik.setFieldTouched}
                    setFieldError={formik.setFieldError}
                    minDate={field.minDate}
                    maxDate={field.maxDate}
                    enabledDates={field.enabledDates}
                    notEnabledDateSelectionErrorMessage={field.notEnabledDateSelectionErrorMessage}
                    disabledDates={field.disabledDates}
                    isDisabled={field.isDisabled}
                    errorMessage={errorMessage}
                />
            );

        if (field.type === 'date-multiple')
            return (
                <InputDateField
                    key={field.name}
                    name={field.name}
                    title={field.title}
                    placeholder={field.placeholder}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    value={formik.values[field.name] ?? ''}
                    setFieldValue={formik.setFieldValue}
                    setFieldTouched={formik.setFieldTouched}
                    setFieldError={formik.setFieldError}
                    isRange={false}
                    isMultiple={true}
                    minDate={field.minDate}
                    maxDate={field.maxDate}
                    enabledDates={field.enabledDates}
                    notEnabledDateSelectionErrorMessage={field.notEnabledDateSelectionErrorMessage}
                    disabledDates={field.disabledDates}
                    isDisabled={field.isDisabled}
                    errorMessage={errorMessage}
                />
            );

        if (field.type === 'date-range')
            return (
                <InputDateField
                    key={field.name}
                    name={field.name}
                    title={field.title}
                    placeholder={field.placeholder}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    value={formik.values[field.name] ?? ''}
                    setFieldValue={formik.setFieldValue}
                    setFieldTouched={formik.setFieldTouched}
                    setFieldError={formik.setFieldError}
                    isRange={true}
                    isMultiple={false}
                    minDate={field.minDate}
                    maxDate={field.maxDate}
                    enabledDates={field.enabledDates}
                    notEnabledDateSelectionErrorMessage={field.notEnabledDateSelectionErrorMessage}
                    disabledDates={field.disabledDates}
                    isDisabled={field.isDisabled}
                    errorMessage={errorMessage}
                />
            );

        if (field.type === 'richtext')
            return (
                <EditorField
                    key={field.name}
                    name={field.name}
                    placeholder={field.placeholder}
                    title={field.title}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    value={formik.values[field.name]}
                    setFieldValue={formik.setFieldValue}
                    setFieldTouched={formik.setFieldTouched}
                    errorMessage={errorMessage}
                />
            );

        if (field.type === 'select-async' && field.loadOptions)
            return (
                <SelectAsyncField
                    key={field.name}
                    name={field.name}
                    title={field.title}
                    placeholder={field.placeholder}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    value={formik.values[field.name] ?? ''}
                    options={field.options ?? []}
                    loadOptions={field.loadOptions}
                    isSearchable={field.isSearchable}
                    isClearable={field.isClearable}
                    isDisabled={field.isDisabled}
                    setFieldValue={(name: string, value: any) => {
                        formik.setFieldValue(name, value, true);

                        if (field.onChange) field.onChange(name, value, formik.setFieldValue);
                    }}
                    errorMessage={errorMessage}
                />
            );

        if (field.type === 'select-sync')
            return (
                <SelectSyncField
                    key={field.name}
                    name={field.name}
                    title={field.title}
                    placeholder={field.placeholder}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    value={formik.values[field.name] ?? ''}
                    options={field.options ?? []}
                    isGroupOptions={field.isGroupOptions}
                    isSearchable={field.isSearchable}
                    isClearable={field.isClearable}
                    isDisabled={field.isDisabled}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    parentValue={formik.values[field.parentFieldName]}
                    setFieldValue={(name: string, value: any) => {
                        formik.setFieldValue(name, value, true);

                        if (field.onChange) field.onChange(name, value, formik.setFieldValue);
                    }}
                    errorMessage={errorMessage}
                />
            );

        if (field.type === 'multi-select-sync')
            return (
                <MultiSelectSyncField
                    key={field.name}
                    name={field.name}
                    title={field.title}
                    placeholder={field.placeholder}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    value={formik.values[field.name] ?? ''}
                    options={field.options ?? []}
                    isGroupOptions={field.isGroupOptions}
                    isDisabled={field.isDisabled}
                    setFieldValue={formik.setFieldValue}
                    errorMessage={errorMessage}
                />
            );

        if (field.type === 'chips')
            return (
                <ChipsField
                    key={field.name}
                    name={field.name}
                    title={field.title}
                    placeholder={field.placeholder}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    value={formik.values[field.name] ?? ''}
                    setFieldValue={formik.setFieldValue}
                    isDisabled={field.isDisabled}
                    errorMessage={errorMessage}
                />
            );

        if (field.type === 'file-select')
            return (
                <FileSelectField
                    key={field.name}
                    name={field.name}
                    title={field.title}
                    placeholder={field.placeholder}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    value={formik.values[field.name] ?? ''}
                    setFieldValue={formik.setFieldValue}
                    setFieldTouched={formik.setFieldTouched}
                    setFieldError={formik.setFieldError}
                    isDisabled={field.isDisabled}
                    acceptType={field.acceptType}
                    maxFileSize={field.maxFileSize}
                    errorMessage={errorMessage}
                />
            );
    }

    let count = 0;
    const formFields = [];
    while (count < _.size(fields)) {
        const isNotShow =
            _.isUndefined(fields[count].show) || _.isNull(fields[count].show)
                ? false
                : fields[count].show?.(formik.values) === false
                ? true
                : false;

        const isHidden = fields[count].type === 'hidden';

        if (isNotShow || isHidden) {
            count++;

            continue;
        }

        const numberOfColumn = fields[count].col ?? 1;

        if (numberOfColumn > 1) {
            const insideItems = [];

            /* Hidden field count check */
            let numberOfHiddenColumns = 0;
            let tempCount = count;
            for (let i = 0; i < numberOfColumn; i++) {
                if (fields[tempCount].type === 'hidden') numberOfHiddenColumns++;

                tempCount++;
            }
            /* Hidden field count check */

            for (let i = 0; i < numberOfColumn; i++) {
                insideItems.push(
                    <div
                        key={'inside-' + (i + 1) + '-column'}
                        className={`field sm:col-12 md:col-${12 / numberOfColumn} xl:col-${12 / numberOfColumn}`}
                    >
                        {getField(fields[count])}
                    </div>
                );

                // console.debug({ count, field: fields[count].name });
                count++;
            }

            formFields.push(
                <div key={'outside-' + (count + 1) + '-row-group'} className="formgrid grid">
                    {_.map(insideItems, insideItem => insideItem)}
                </div>
            );
        } else {
            formFields.push(
                <div key={'outside-' + (count + 1) + '-row'} className="field">
                    {getField(fields[count])}
                </div>
            );

            // console.debug({ count, field: fields[count].name });
            count++;
        }
    }

    const submitButton = !submitButtonShow ? null : (
        <Button
            type="button"
            label={!submitButtonText ? 'Submit' : submitButtonText}
            onClick={e => {
                formik.submitForm();
            }}
        ></Button>
    );

    const resetButton = !resetButtonShow ? null : (
        <Button
            type="button"
            label={!resetButtonText ? 'Reset' : resetButtonText}
            onClick={e => {
                formik.resetForm();
            }}
            className="ml-3"
        ></Button>
    );

    // Handle data change instantly
    useEffect(() => {
        if (onValueModify !== undefined && onValueModify !== null && typeof onValueModify === 'function') {
            onValueModify(formik.values);
        }
    }, [formik.values]);

    return (
        <form onSubmit={formik.handleSubmit}>
            {_.map(formFields, formFieldElement => {
                return formFieldElement;
            })}
            {submitButton}
            {resetButton}
        </form>
    );
}
