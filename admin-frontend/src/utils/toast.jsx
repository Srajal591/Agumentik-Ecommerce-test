import toast from 'react-hot-toast';

// Success toast
export const showSuccess = (message) => {
  toast.success(message);
};

// Error toast
export const showError = (message) => {
  toast.error(message);
};

// Loading toast
export const showLoading = (message = 'Loading...') => {
  return toast.loading(message);
};

// Dismiss specific toast
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

// Promise toast (for async operations)
export const showPromise = (promise, messages) => {
  return toast.promise(promise, {
    loading: messages.loading || 'Loading...',
    success: messages.success || 'Success!',
    error: messages.error || 'Error occurred',
  });
};

// Confirmation toast (Yes/No)
export const showConfirmation = (message, onConfirm, onCancel) => {
  toast((t) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <span style={{ fontWeight: '500' }}>{message}</span>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button
          onClick={() => {
            toast.dismiss(t.id);
            if (onCancel) onCancel();
          }}
          style={{
            padding: '6px 16px',
            backgroundColor: '#e5e7eb',
            color: '#374151',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => {
            toast.dismiss(t.id);
            if (onConfirm) onConfirm();
          }}
          style={{
            padding: '6px 16px',
            backgroundColor: '#396f4cff',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  ), {
    duration: Infinity,
    style: {
      maxWidth: '400px',
    },
  });
};

export default {
  success: showSuccess,
  error: showError,
  loading: showLoading,
  dismiss: dismissToast,
  promise: showPromise,
  confirm: showConfirmation,
};
