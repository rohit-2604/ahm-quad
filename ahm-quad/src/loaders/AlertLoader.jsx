import Skeleton from "react-loading-skeleton";
import React from "react";
import "react-loading-skeleton/dist/skeleton.css";

function AlertLoader() {
  return (
    <div>
      <Skeleton height={55} width={422}></Skeleton>
      <Skeleton height={55} width={422}></Skeleton>
      <Skeleton height={55} width={422}></Skeleton>
      <Skeleton height={55} width={422}></Skeleton>
      <Skeleton height={55} width={422}></Skeleton>
    </div>
  );
}

export default AlertLoader;
