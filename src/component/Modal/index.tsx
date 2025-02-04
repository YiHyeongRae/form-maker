import { ReactNode } from "react";

type ModalTypes = {
  id: string;
  className?: string;
  children: ReactNode;
  closeFunc?: Function;
  open?: boolean;
};

function Modal({ id, className, children, closeFunc, open }: ModalTypes) {
  return (
    <dialog
      id={id}
      className="modal"
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.code === "Escape") {
          closeFunc && closeFunc();
        }
      }}
      open={open}
    >
      <div
        className={`rounded-none modal-box ${className}  max-w-screen-lg text-sm max-sm:text-xs `}
      >
        {children}
        <form method="dialog">
          <button
            id={`${id}-close-btn`}
            className="absolute btn btn-sm max-sm:btn-xs btn-circle btn-ghost right-4 top-5"
            onClick={(e) => {
              e.stopPropagation();

              closeFunc && closeFunc();
            }}
          >
            ✕
          </button>
        </form>
      </div>
    </dialog>
  );
}

export { Modal };
