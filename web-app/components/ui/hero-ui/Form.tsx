"use client";
import * as React from "react";
import {
  Form as HForm,
  type FormProps as HFormProps,
} from "@heroui/react";

// Root (ok avec ref)
export const Form = React.forwardRef<HTMLFormElement, HFormProps>(
  ({ children, ...rest }, ref) => (
    <HForm
      ref={ref}
      {...rest}
    >
      {children}
    </HForm>
  )
);
Form.displayName = "Form";
