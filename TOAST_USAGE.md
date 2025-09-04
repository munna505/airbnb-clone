# Toast Notification System

This application now includes a comprehensive toast notification system for displaying error messages, success messages, warnings, and informational messages.

## Features

- **Four toast types**: success, error, warning, info
- **Auto-dismiss**: Toasts automatically disappear after 5 seconds (configurable)
- **Manual dismiss**: Users can close toasts manually with the X button
- **Smooth animations**: Slide-in and slide-out animations
- **Accessible**: Proper ARIA labels and keyboard navigation
- **Responsive**: Works on all screen sizes

## Usage

### Basic Usage

```tsx
import { useToast } from '@/contexts/ToastContext';

function MyComponent() {
  const { addToast } = useToast();

  const handleError = () => {
    addToast({
      type: 'error',
      title: 'Error Title',
      message: 'Error message details',
    });
  };

  const handleSuccess = () => {
    addToast({
      type: 'success',
      title: 'Success!',
      message: 'Operation completed successfully',
    });
  };

  return (
    <div>
      <button onClick={handleError}>Show Error</button>
      <button onClick={handleSuccess}>Show Success</button>
    </div>
  );
}
```

### Toast Types

1. **Success** - Green styling, checkmark icon
2. **Error** - Red styling, alert circle icon  
3. **Warning** - Yellow styling, alert triangle icon
4. **Info** - Blue styling, info icon

### Configuration Options

```tsx
addToast({
  type: 'error',
  title: 'Required field',
  message: 'Optional detailed message',
  duration: 3000, // Custom duration in milliseconds (default: 5000)
});
```

### Advanced Usage

```tsx
const { addToast, removeToast, clearAllToasts } = useToast();

// Remove specific toast
removeToast(toastId);

// Clear all toasts
clearAllToasts();
```

## Implementation Details

The toast system consists of:

1. **ToastContext** (`src/contexts/ToastContext.tsx`) - Global state management
2. **Toast Component** (`src/components/Toast.tsx`) - Individual toast UI
3. **ToastContainer** - Container for all toasts
4. **useToast Hook** - Easy access to toast functions

## Integration

The toast system is automatically available throughout the app via the `Providers` component in `src/components/Providers.tsx`. No additional setup is required.

## Examples in the App

- **Login/Register pages**: Form validation errors and success messages
- **Contact form**: Submission success/error feedback
- **Payment form**: Payment processing errors and confirmations
- **API calls**: Network errors and success responses

## Styling

Toasts use Tailwind CSS classes and can be customized by modifying the `toastStyles` and `iconStyles` objects in `src/components/Toast.tsx`.
