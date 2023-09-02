import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

interface IConfirmModal {
    isOpen: boolean;
    onCancel: () => void;
    title: string;
    subtitle: string;
    cancelCallback: () => void;
    cancelColor?: 'info' | 'danger' | 'secondary' | 'success' | 'warning' | 'help';
    confirmCallback: () => void;
    confirmColor?: 'info' | 'danger' | 'secondary' | 'success' | 'warning' | 'help';
}

const Modal = ({
    isOpen,
    onCancel,
    title,
    subtitle,
    cancelCallback,
    cancelColor = 'info',
    confirmCallback,
    confirmColor = 'danger',
}: IConfirmModal) => {
    const deleteProductDialogFooter = (
        <>
            <Button
                label="No"
                icon="pi pi-times"
                text
                severity={cancelColor}
                onClick={(e) => {
                    e.preventDefault();

                    cancelCallback();
                }}
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                text
                severity={confirmColor}
                onClick={(e) => {
                    e.preventDefault();

                    confirmCallback();
                }}
            />
        </>
    );

    return (
        <Dialog
            visible={isOpen}
            onHide={onCancel}
            style={{ width: '450px' }}
            header="Confirm"
            modal
            footer={deleteProductDialogFooter}
        >
            <div className="flex align-items-center justify-content-center">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />

                <span>
                    <h5>{title}</h5> {subtitle}
                </span>
            </div>
        </Dialog>
    );
};

export default Modal;
