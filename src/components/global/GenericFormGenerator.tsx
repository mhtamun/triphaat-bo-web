import React, { useEffect } from 'react';
import { FormikValues, useFormik } from 'formik';
import _ from 'lodash';
import { Button } from 'primereact/button';
import {
    InputTextField,
    InputDateField,
    SelectSyncField,
    MultiSelectSyncField,
    TextareaField,
    EditorField,
    ChipsField,
    FileSelectField,
} from '../index';

export interface IField {
    type: string;
    name: string;
    title: string;
    placeholder: string;
    initialValue: string | number | boolean | null;
    options?: {
        value?: boolean | number | string;
        label: string;
        items?: { value: boolean | number | string; label: string }[];
    }[];
    isGroupOptions?: boolean; // only for multi select dropdowns
    isRange?: boolean; // only for date picker
    minDate?: Date; // only for date picker
    maxDate?: Date; // only for date picker
    acceptType?: 'image/*' | 'video/*' | 'application/*' | '*/*'; // only for file select
    maxFileSize?: number; // only for file select
    isDisabled?: boolean;
    show?: (values: FormikValues) => boolean;
    validate?: (values: FormikValues) => string | null;
    onChange?: (name: string, value: any, callback: (name: string, value: any) => void) => void;
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
                      const temp: any = result;
                      temp[field.name] =
                          field.initialValue === null || field.initialValue === undefined ? null : field.initialValue;

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

            const hiddenFields: any[] = [];

            // Check false value not to submit in the form
            _.mapKeys(values, (value, key) => {
                if (_.isUndefined(value) || _.isNull(value)) hiddenFields.push(key);
            });

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
            field.type === 'text' ||
            field.type === 'time'
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
                    isRange={field.isRange}
                    minDate={field.minDate}
                    maxDate={field.maxDate}
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
                    setFieldValue={(name: string, value: any) => {
                        formik.setFieldValue(name, value, true);

                        if (field.onChange) field.onChange(name, value, formik.setFieldValue);
                    }}
                    isDisabled={field.isDisabled}
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
                    setFieldValue={formik.setFieldValue}
                    isDisabled={field.isDisabled}
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
