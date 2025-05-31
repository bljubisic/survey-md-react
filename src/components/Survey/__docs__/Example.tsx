import React, { FC } from "react";
import SurveyNode, { NodeProps } from "../SurveyNode";
import remarkParse from "remark-parse";
import customPlugin from "../customPlugin";
import survey from "../plugin";
import { unified } from "unified";

type CallProps = {
  text: string;
};

const Example: FC<CallProps> = async ({ text }) => {
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
      <SurveyNode
        node={modifiedText as any}
        context={{}} // Provide appropriate context object here
        next={() => ({})} // Provide appropriate next function here
      />
    </div>
  );
};

export default Example;
