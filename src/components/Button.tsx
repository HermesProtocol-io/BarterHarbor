import classNames from 'classnames';
import React from 'react';

export enum ButtonType {
  primary = 'primary',
  secondary = 'secondary',
  cancel = 'cancel',
  highlighted = 'highlighted',
  backgroundNone = 'none',
}
export enum ButtonSize {
  small = 'small',
  smallWide = 'smallWide',
  medium = 'medium',
  mediumShorter = 'mediumShorter',
  square = 'square',
  clear = 'clear',
}

export enum ButtonJustify {
  start = 'start',
  center = 'center',
  end = 'end',
}

const Button: React.FC<{
  onClick?: React.MouseEventHandler;
  children: React.ReactNode;
  dataId?: string;
  type?: ButtonType;
  size?: ButtonSize;
  justify?: ButtonJustify;
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean | undefined;
  loading?: boolean;
  noFlexMobile?: boolean | undefined;
  loadingTxt?: string;
  alt?: string;
  noTransition?: boolean | undefined;
}> = ({
  onClick,
  children,
  type = ButtonType.primary,
  size = ButtonSize.medium,
  justify = ButtonJustify.start,
  fullWidth = false,
  className,
  disabled = false,
  loading = false,
  noFlexMobile,
  loadingTxt = '',
  alt = '',
  noTransition = false,
}) => {
  return (
    <div className='btn-wrapper relative'>
      <button
        title={alt}
        onClick={onClick}
        className={classNames(
          `${noFlexMobile ? ' sm:flex ' : ' flex '} items-center text-center ${
            !noTransition && ' ease-out duration-300 '
          } `,
          {
            'bg-gold text-white text-bold': type === ButtonType.primary,
          },
          {
            'hover:bg-muddywaters-600 focus:bg-muddywaters-60':
              type === ButtonType.primary && !disabled,
          },
          {
            'bg-gray-extralight20 text-black': type === ButtonType.secondary,
          },
          {
            'bg-gray-extralight50 text-black': type === ButtonType.cancel,
          },
          {
            'cursor-not-allowed opacity-60': disabled,
          },
          {
            'hover:bg-gray-extralight80 focus:bg-gray-extralight80':
              type === ButtonType.cancel && !disabled,
          },
          {
            'border border-gold bg-gray-extralight20 text-black':
              type === ButtonType.highlighted,
          },
          {
            'text-black': type === ButtonType.backgroundNone,
          },
          { 'py-3 px-6 rounded-12px': size === ButtonSize.medium },
          { 'py-3 px-3 rounded-12px': size === ButtonSize.mediumShorter },
          { 'py-1 px-3 rounded-10px': size === ButtonSize.small },
          {
            'py-1 px-5 rounded-10px min-w-6r': size === ButtonSize.smallWide,
          },
          { 'py-2 px-2 rounded-8px btn-square': size === ButtonSize.square },
          { '': size === ButtonSize.clear },
          { 'w-full': fullWidth },
          { 'justify-start': justify === ButtonJustify.start },
          { 'justify-center': justify === ButtonJustify.center },
          { 'justify-end': justify === ButtonJustify.end },
          className,
          { 'text-gold': loading && type === ButtonType.primary },
          {
            'hover:shadow-lg focus:shadow-lg':
              !disabled && type !== ButtonType.backgroundNone,
          },
        )}
        disabled={disabled}
      >
        {children}
      </button>

      {loading && (
        <div
          className={classNames(
            'absolute top-0 left-0 right-0 bottom-0 bg-whiteTransparent-30 flex items-center justify-center',
            { 'text-white': type === ButtonType.primary },
          )}
        >
          {loadingTxt}
          <div
            className={classNames(
              'loading-ring',
              { white: type === ButtonType.primary },
              {
                'gray-dark':
                  type === ButtonType.cancel ||
                  type === ButtonType.secondary ||
                  type === ButtonType.highlighted,
              },
            )}
          ></div>
        </div>
      )}
    </div>
  );
};
export default Button;
