import { useEffect, useRef } from "react";

import "./ConfirmDialog.css";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLoading?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLoading = false,
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
      <p>{message}</p>

      <div className="actions">
        <button onClick={onCancel}>Cancel</button>
        <button
          onClick={onConfirm}
          className="primary"
          disabled={confirmLoading}
        >
          {confirmLoading ? "Updating..." : "Confirm"}
        </button>
      </div>
    </dialog>
  );
}
