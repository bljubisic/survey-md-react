import React, { FC } from "react";
import SurveyNode, { NodeProps } from "../SurveyNode";
import remarkParse from "remark-parse";
import customPlugin from "../customPlugin";
import survey from "../plugin";
import { unified } from "unified";

const Example: FC<NodeProps> = async ({ text }) => {
  const result = unified()
    .use(remarkParse, { sanitize: false })
    .use(customPlugin);

  const modifiedText = await result.run(result.parse(text));
  console.log(survey(modifiedText));
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <SurveyNode node={modifiedText} />
    </div>
  );
};

export default Example;
