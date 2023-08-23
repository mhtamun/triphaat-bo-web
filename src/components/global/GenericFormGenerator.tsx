import React from 'react';
import { FormikValues, useFormik } from 'formik';
import _ from 'lodash';
import { Button } from 'primereact/button';
import { InputField, SelectSyncField, MultiSelectSyncField, TextareaField, EditorField, ChipsField } from '../index';

export interface IField {
    type: string;
    name: string;
    title: string;
    placeholder: string;
    initialValue: string | number | boolean | null;
    options?: {
        value: boolean | number | string;
        label: string;
        items?: { value: boolean | number | string; label: string }[];
    }[];
    isGroupOptions?: boolean; // only for multi select dropdowns
    isDisabled?: boolean;
    show?: (values: FormikValues) => boolean;
    col?: number;
    validate?: (values: FormikValues) => string | null;
}

export default function GenericFormGenerator({
    datum = null,
    fields,
    nonEdibleFields = [],
    // method = null,
    // uri = null,
    callback,
    onValueModify,
    // onShowSubmitButton = null,
    submitButtonText,
    resetButtonShow = true,
    resetButtonText,
    enableReinitialize = false,
}: {
    datum?: any;
    fields: IField[];
    nonEdibleFields?: string[];
    callback: (values: any, resetForm: () => void) => void;
    onValueModify?: (value: any) => void;
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
                    const result =
                        _.isUndefined(field.validate) || _.isNull(field.validate) ? null : field.validate(values);

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

        onSubmit: (values, { setSubmitting }) => {
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

            callback(filteredValues, () => {
                formik.resetForm();
            });
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
            field.type === 'date' ||
            field.type === 'email' ||
            field.type === 'hidden' ||
            field.type === 'number' ||
            field.type === 'password' ||
            field.type === 'tel' ||
            field.type === 'text'
        )
            return (
                <InputField
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
                    setFieldValue={formik.setFieldValue}
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
    }

    let count = 0;
    const formFields = [];
    while (count < _.size(fields)) {
        const isNotShow =
            _.isUndefined(fields[count].show) || _.isNull(fields[count].show)
                ? false
                : fields[count].show(formik.values) === false
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
                    <div key={'inside-' + (i + 1) + '-column'} className={`field col`}>
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

    const submitButton = <Button type="submit" label={!submitButtonText ? 'Submit' : submitButtonText}></Button>;
    const resetButton = !resetButtonShow ? null : (
        <Button
            type="reset"
            label={!resetButtonText ? 'Reset' : resetButtonText}
            onClick={formik.handleReset}
            className="ml-3"
        ></Button>
    );

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
