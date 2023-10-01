import React, { useState, useRef, useCallback } from 'react';
import {
    FileUpload,
    FileUploadHeaderTemplateOptions,
    FileUploadSelectEvent,
    ItemTemplateOptions,
} from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import * as _ from 'lodash';

const FileSelectField = ({
    name,
    title,
    value,
    placeholder,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    isDisabled = false,
    acceptType = '*/*',
    maxFileSize = 5242880,
    errorMessage = '',
}: {
    name: string;
    title: string;
    value?: string | File;
    placeholder?: string;
    setFieldValue: (field: string, value: any) => void;
    setFieldTouched: (field: string, touched: boolean) => void;
    setFieldError: (field: string, value: string) => void;
    isDisabled?: boolean;
    acceptType?: 'image/*' | 'video/*' | 'application/*' | '*/*';
    maxFileSize?: number;
    errorMessage?: string;
}) => {
    const [totalSize, setTotalSize] = useState<number>(0);

    const clear = useCallback(() => {
        setTotalSize(0);
        setFieldValue(name, null);
        setFieldTouched(name, true);
        setFieldError(name, '');
    }, []);

    return (
        <div className="field p-fluid">
            <label htmlFor={name}>{title}</label>
            <FileUpload
                id={name}
                name={name}
                accept={acceptType}
                onSelect={(e: FileUploadSelectEvent) => {
                    // console.debug('onSelect');
                    // console.debug({ e });

                    const files = e.files;

                    if (files[0].size > maxFileSize) {
                        setFieldError(name, 'File size exceeds maximum!');

                        return;
                    }

                    setTotalSize(files[0].size);
                    setFieldValue(name, files[0]);
                    setFieldTouched(name, true);
                    setFieldError(name, '');
                }}
                onClear={() => {
                    // console.debug('onClear');

                    clear();
                }}
                onRemove={() => {
                    // console.debug('onRemove');

                    clear();
                }}
                headerTemplate={(options: FileUploadHeaderTemplateOptions) => {
                    const { className, chooseButton, cancelButton } = options;

                    return (
                        <div
                            className={className}
                            style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}
                        >
                            {totalSize > 0 ? null : chooseButton}
                            {totalSize <= 0 ? null : cancelButton}
                            <div className="flex align-items-center gap-3 ml-auto">
                                <span>{(totalSize / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                            {_.isEmpty(value) ? null : value instanceof File ? null : (
                                <div className="p-inputgroup mt-3">
                                    <span className="p-inputgroup-addon">{title}:URL</span>
                                    <InputText value={value} disabled={true} className={'p-inputgroup-addon'} />
                                </div>
                            )}
                        </div>
                    );
                }}
                itemTemplate={(file: any, options: ItemTemplateOptions) => {
                    // console.debug({ file, options });

                    return file.size > maxFileSize ? null : (
                        <div className="flex align-items-center flex-wrap">
                            <div className="flex align-items-center">
                                {!_.includes(file.type, 'image') ? null : (
                                    <img className="mr-3" alt={file.name} src={file.objectURL} width={100} />
                                )}
                                <span className="flex flex-column text-left" style={{ fontWeight: 'bolder' }}>
                                    {file.name}
                                    <small style={{ fontStyle: 'italic', color: 'grey' }}>{options.formatSize}</small>
                                </span>
                            </div>
                            <Button
                                className="p-button-outlined p-button-rounded p-button-danger ml-auto"
                                type="button"
                                icon="pi pi-times"
                                onClick={e => {
                                    options.onRemove(e);
                                }}
                                style={{ width: '30px', height: '30px' }}
                            />
                        </div>
                    );
                }}
                emptyTemplate={() => {
                    return (
                        <div className="flex align-items-center flex-column">
                            <i
                                className="pi pi-image mt-3 p-5"
                                style={{
                                    fontSize: '5em',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--surface-b)',
                                    color: 'var(--surface-d)',
                                }}
                            ></i>
                            <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                                {placeholder}
                            </span>
                        </div>
                    );
                }}
                disabled={isDisabled}
            />
            {!errorMessage ? null : (
                <small id={`${name}-help`} className="p-error">
                    {errorMessage}
                </small>
            )}
        </div>
    );
};

export default FileSelectField;
