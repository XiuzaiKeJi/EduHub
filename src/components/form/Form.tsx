import React, { useState } from 'react';
import { useFormContext, UseFormReturn, FormProvider } from 'react-hook-form';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  form: UseFormReturn<any>;
  children: React.ReactNode | ((props: { isSubmitting: boolean }) => React.ReactNode);
  onSubmit?: (data: any) => Promise<void> | void;
}

export const Form = React.forwardRef<HTMLFormElement, FormProps>(({ form, children, className, onSubmit, ...props }, ref) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSubmit) {
      try {
        setIsSubmitting(true);
        const isValid = await form.trigger();
        if (isValid) {
          const data = form.getValues();
          await onSubmit(data);
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className={className} role="form" ref={ref} {...props}>
        {typeof children === 'function' ? children({ isSubmitting }) : children}
      </form>
    </FormProvider>
  );
});

Form.displayName = 'Form';

interface FormFieldProps<T extends Record<string, any>> {
  name: keyof T;
  children: React.ReactNode;
}

export const FormField = <T extends Record<string, any>>({
  name,
  children,
}: FormFieldProps<T>) => {
  const { register } = useFormContext();
  return <div>{children}</div>;
};

interface FormItemProps {
  children: React.ReactNode;
}

export const FormItem = ({ children }: FormItemProps) => {
  return <div className="mb-4">{children}</div>;
};

interface FormLabelProps {
  children: React.ReactNode;
}

export const FormLabel = ({ children }: FormLabelProps) => {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {children}
    </label>
  );
};

interface FormMessageProps {
  children?: React.ReactNode;
}

export const FormMessage = ({ children }: FormMessageProps) => {
  return children ? (
    <p className="mt-1 text-sm text-red-600">{children}</p>
  ) : null;
}; 