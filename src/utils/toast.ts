import { toast, Zoom, TypeOptions, ToastOptions } from 'react-toastify';

const toastOptions: ToastOptions = {
    position: 'bottom-right',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: 0,
    theme: 'colored',
    transition: Zoom,
};

export const showToast = (message: string, type: TypeOptions, options: ToastOptions) => {
    toast(message, { ...toastOptions, ...options, type });
};

// export const showApiCallLoaderToast = (newPromise, pendingMessage) => {
//     const id = toast.loading(pendingMessage, { ...toastOptions, autoClose: false, hideProgressBar: false });

//     return new Promise((resolve, reject) => {
//         newPromise
//             .then(response => {
//                 toast.dismiss(id.current);

//                 resolve(response);
//             })
//             .catch(error => {
//                 toast.dismiss(id.current);

//                 reject(error);
//             });
//     });
// };
