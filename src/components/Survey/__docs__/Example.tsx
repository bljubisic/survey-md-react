import React, { FC } from "react";
import SurveyNode, { NodeProps } from "../SurveyNode";

const Example: FC<NodeProps> = ({
  text = '## Hi! Please pick a number.\n  (We shuffle them *every time*)\n\n?mynumber matrix="agree, not agree"\n- 1337\n- [42](https://www.google.com/search?q=42)\n- 7±2\n\n@ mynumber\n[Submit](+)',
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <SurveyNode text={text} />
    </div>
  );
};

export default Example;
