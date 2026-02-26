import { useEffect, useRef } from "react";

import "./ConfirmDialog.css";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  onCancel: () => void;
  confirmLoading?: boolean;
  submitFormId?: string;
}

export function ConfirmDialog({
  open,
  title,
  children,
  onConfirm,
  onCancel,
  confirmLoading = false,
  submitFormId,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog ref={dialogRef} onCancel={onCancel} className="confirm-dialog">
      <h3>{title}</h3>
      <div className="dialog-body">{children}</div>

      <div className="actions">
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        {submitFormId ? (
          <button
            type="submit"
            form={submitFormId}
            className="primary"
            disabled={confirmLoading}
          >
            {confirmLoading ? "Creating..." : "Create"}
          </button>
        ) : (
          <button
            onClick={onConfirm}
            className="primary"
            disabled={confirmLoading}
          >
            {confirmLoading ? "Updating..." : "Confirm"}
          </button>
        )}
      </div>
    </dialog>
  );
}
