import { createFunction } from "./expression";

export type NodeProps = {
  context: {
    [x: string]: any;
  };
  next: () => {};
  node: {
    condition: { expr: any };
    type: string;
    value: string;
    question: any;
    depth: number;
    children: any;
    url: string | string[];
    alt: any;
  };
};

const SurveyNode: React.FC<NodeProps> = ({ node, context, next }) => {
  const matchHead = (html: string) => {
    return html.match(/^<head>([\s\S]*)<\/head>$/i);
  };

  let cond = null;
  let condValue = false;
  let head = null;

  if (node.condition) {
    cond = createFunction(node.condition.expr);
  }

  try {
    condValue = cond ? cond(context) : true;
  } catch (error) {
    condValue = false;
  }

  if (node.type === "html") {
    let m = matchHead(node.value);
    if (m) {
      head = m[1];
    }
  }

  return <>
    {head && <div dangerouslySetInnerHTML={{ __html: head }}/>}
    {condValue && 
      
    }
    {node.type}
  </>;
};

export default SurveyNode;
