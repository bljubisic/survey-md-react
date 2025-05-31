import { createFunction } from "./expression";
import type { NodeProps } from "./SurveyNode";

const SurveyPrint: React.FC<NodeProps> = ({ node, context, next }) => {
  const print = createFunction(node.expr);
  let print_value = "";

  try {
    print_value = print(context);
  } catch (e) {
    print_value = "";
  }

  return <div>{print_value}</div>;
};

export default SurveyPrint;
