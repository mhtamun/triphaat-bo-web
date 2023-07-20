import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Button } from 'primereact/button';

const EditorField = (props: {
    name: string;
    title: string;
    placeholder?: string;
    value: string;
    setFieldValue: (name: string, value: any) => void;
    setFieldTouched: (name: string, value: boolean) => void;
    isDisabled?: boolean;
    errorMessage?: string;
}) => {
    const {
        name,
        title,
        placeholder,
        value,
        setFieldValue,
        setFieldTouched,
        isDisabled = false,
        errorMessage = '',
    } = props;

    const [isTouched, setTouched] = useState(false);

    const editorRef = useRef(null);

    const handleSaveChanges = useCallback(e => {
        e.preventDefault();

        if (editorRef.current) {
            // console.log(editorRef.current.getContent());

            const wrappedContent = JSON.stringify(editorRef.current.getContent());

            setFieldValue(name, wrappedContent);
            setFieldTouched(name, true);

            setTouched(false);
        }
    }, []);

    // console.debug({ value });

    let wrappedValue: string | null = value;

    try {
        JSON.parse(wrappedValue);
    } catch (error) {
        // console.error(error);

        wrappedValue = null;
    }

    return (
        <div className="field p-fluid">
            {!title ? null : <label htmlFor={name}>{title} (Editor)</label>}
            {!placeholder ? null : (
                <p
                    style={{
                        color: 'grey',
                        margin: 0,
                        padding: 0,
                    }}
                >
                    {placeholder}
                </p>
            )}
            {useMemo(
                () => (
                    <Editor
                        id={name}
                        apiKey="enwgih463zy7tucf51q0rohglyrfuf0j63f3u5e8qupxnjir"
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        initialValue={JSON.parse(wrappedValue)}
                        onEditorChange={editor => {
                            // console.debug({ editor });

                            setTouched(true);
                        }}
                        init={{
                            height: 'auto',
                            menubar: 'insert | edit | table',
                            plugins: [
                                'advlist',
                                'autolink',
                                'autoresize',
                                'help',
                                'image',
                                'insertdatetime',
                                'link',
                                'lists',
                                'media',
                                'searchreplace',
                                'table',
                                'wordcount',
                            ],
                            toolbar:
                                'undo redo | blocks | ' +
                                'bold italic forecolor | alignleft aligncenter alignright alignjustify | ' +
                                'bullist numlist | outdent indent | ' +
                                'image media | insertdatetime | searchreplace | removeformat | help | wordcount',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                        }}
                    />
                ),
                [wrappedValue]
            )}
            {!isTouched ? null : (
                <Button
                    className="btn-block mt-3"
                    icon="pi pi-save"
                    severity={!isTouched ? 'info' : 'danger'}
                    onClick={handleSaveChanges}
                >
                    {!isTouched ? '' : 'Save Your New Changes'}
                </Button>
            )}
            {!title ? null : (
                <label htmlFor={name} className="mt-3">
                    {title} (Preview)
                </label>
            )}
            <div
                style={{
                    padding: '11px',
                    border: '2px solid #eee',
                    borderRadius: '10px',
                    overflow: 'scroll',
                    position: 'relative',
                }}
                dangerouslySetInnerHTML={{ __html: JSON.parse(wrappedValue) }}
            />
            {!errorMessage ? null : (
                <small id={`${name}-help`} className="p-error">
                    {errorMessage}
                </small>
            )}
        </div>
    );
};

export default EditorField;
