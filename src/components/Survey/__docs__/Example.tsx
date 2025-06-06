import React, { FC } from "react";
import SurveyNode, { NodeProps } from "../SurveyNode";
import remarkParse from "remark-parse";
import customPlugin from "../customPlugin";
import survey from "../plugin";
import { unified } from "unified";
import pages from "./pages.json";

type CallProps = {
  text: string;
};

const Example: FC<CallProps> = ({ text }) => {
  // const result = unified()
  //   .use(remarkParse, { sanitize: false })
  //   .use(customPlugin);

  // const modifiedText = await result.run(result.parse(text));
  // const page: any = survey(modifiedText);
  // console.log(JSON.stringify(page));
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      {pages.children.map((child: any, index: number) => {
        return (
          <SurveyNode
            key={index}
            node={child}
            context={{}} // Provide appropriate context object here
            next={() => ({})} // Provide appropriate next function here
          />
        );
      })}
    </div>
  );
};

export default Example;
