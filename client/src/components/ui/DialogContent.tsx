import React from 'react';
import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from 'react';

interface DialogContentProps {
  children: ReactNode;
  className?: string;
}

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>((props, ref) => {
  return <Dialog.Content {...props} ref={ref} />;
});
