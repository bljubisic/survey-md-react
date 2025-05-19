import { remark } from "remark";

import customPlugin from "./customPlugin";
import remarkParse from "remark-parse";

export type NodeProps = {
  text: string;
};

const SurveyNode: React.FC<NodeProps> = async ({ text }) => {
  const result = await remark()
    .use(remarkParse, { sanitize: false })
    .use(customPlugin)
    .process(text);

  console.log(result.toString());
  return <>{text}</>;
};

export default SurveyNode;
