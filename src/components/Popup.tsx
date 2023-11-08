import classNames from "classnames";
import React, { Dispatch, SetStateAction } from "react";

export enum PopupSize {
  smallxs = "small-xs",
  small = "small",
  medium = "medium",
  large = "large",
  largeXL = "largeXL",
}

const PopUp: React.FC<{
  children: React.ReactNode;
  closeModal?: Dispatch<SetStateAction<any>>;
  size?: PopupSize;
  backDrop?: boolean;
}> = ({ children, size = PopupSize.medium, closeModal, backDrop = true }) => {
  return (
    <>
      <div className="z-50 w-full h-full flex items-center fixed inset-0 py-3">
        <div
          className="fixed inset-0 bg-black-transparentLight h-full w-full z-50"
          onClick={closeModal}
        ></div>
        <div
          className={classNames(
            "popup-inside bg-gray-extralight15 mx-auto h-auto max-h-full rounded-xl shadow-lg py-6 flex flex-col justify-evenly items-center z-50",
            {
              "max-w-xl px-6": size === PopupSize.large,
              "max-w-3xl w-full px-6": size === PopupSize.largeXL,
              "max-w-lg px-6": size === PopupSize.medium,
              "max-w-sm": size === PopupSize.small,
              "max-w-xs px-3": size === PopupSize.smallxs,
            }
          )}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default PopUp;
