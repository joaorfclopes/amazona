import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function LoadingBox() {
  return (
    <div>
      <FontAwesomeIcon icon={faSpinner} spin /> Loading...
    </div>
  );
}
