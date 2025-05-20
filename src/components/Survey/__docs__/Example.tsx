import React, { FC } from "react";
import SurveyNode, { NodeProps } from "../SurveyNode";
import { remark } from "remark";
import remarkParse from "remark-parse";
import customPlugin from "../customPlugin";

const Example: FC<NodeProps> = async ({ text }) => {
  const result = await remark()
    .use(remarkParse, { sanitize: false })
    .use(customPlugin);

  console.log(result.parse(text));
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
