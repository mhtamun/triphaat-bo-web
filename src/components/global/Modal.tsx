import React, { ReactNode } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const Modal = (props: {
    visible: boolean;
    header: string;
    children: ReactNode;
    button?: {
        label?: string;
        onClick: () => void;
        icon?: string;
        color?: 'info' | 'secondary' | 'success' | 'warning' | 'danger' | 'help';
    };
    onHide: () => void;
}) => {
    const { visible, header, children: body, button, onHide } = props;

    const basicDialogFooter = !button ? null : (
        <Button
            type="button"
            label={button.label ?? 'OK'}
            onClick={button.onClick}
            icon={button.icon ?? 'pi pi-check'}
            severity={button.color ?? 'info'}
        />
    );

    return (
        <>
            <Dialog
                modal={true}
                visible={visible}
                maximizable={true}
                draggable={false}
                resizable={false}
                header={header}
                footer={basicDialogFooter}
                onHide={onHide}
                style={{ width: '50vw' }}
            >
                {body}
            </Dialog>
        </>
    );
};

export default Modal;
