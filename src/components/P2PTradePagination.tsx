import { Dispatch, SetStateAction } from "react";

// import { useTranslation } from "react-i18next";

export interface paginationProps {
  amount: number;
  step: number;
  setNftShow: Dispatch<SetStateAction<any>>;
}
export const TradePagination: React.FC<{ props: paginationProps }> = () => {
  // const { t } = useTranslation(["common"]);
  return (
    <>
      <div>
        {/* <FontAwesomeIcon
          icon={angleLeft}
          size="lg"
          className="cursor-pointer"
        /> */}
        <span>
          <span>Page</span> 1
        </span>
        /<span>3 </span>
        {/* <FontAwesomeIcon
          icon={angleRight}
          size="lg"
          className="cursor-pointer"
        /> */}
      </div>
    </>
  );
};
