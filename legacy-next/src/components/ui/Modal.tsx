import type { ReactNode } from "react";

export type ModalProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ isOpen, title, onClose, children }: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="ui-modal-overlay" onClick={onClose}>
      <div className="ui-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <div className="ui-modal__header">
          <h3>{title}</h3>
          <button type="button" className="ui-modal__close" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>
        <div className="ui-modal__body">{children}</div>
      </div>
    </div>
  );
}
