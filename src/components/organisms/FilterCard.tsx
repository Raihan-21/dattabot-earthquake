import React, { Children, ReactElement } from "react";

const FilterCard = ({ children }: { children: ReactElement }) => {
  return (
    <div className="mb-6 p-4 rounded-md filter__container">{children}</div>
  );
};

export default FilterCard;
