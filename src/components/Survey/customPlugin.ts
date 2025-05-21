import { visit } from "unist-util-visit";
import { Root, type Node } from "mdast";

export interface Question extends Node {
  name: string;
  type: string;
  params: any;
  value: string;
}

const attrsRx = /((\w+) *= *"([^"]*))|((\w+) *= *([^ ]+))|(\w+)/g;
/**
 * @param {string} str
 */
function parseAttrs(str: string) {
  const attrs = {};
  let m;
  do {
    m = attrsRx.exec(str);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (m) attrs[m[2] || m[5] || m[7]] = m[7] ? true : m[3] || m[6];
  } while (m);
  return attrs;
}

const checkQuestion = (value: string) => {
  const match = /^\? *(\w[\w]*) *(.*)/.exec(value);
  if (match) {
    return match;
  }
  return null;
};

const checkCondition = (value: string) => {
  const match = /^@ *(.*)/.exec(value);
  if (match) {
    return match;
  }
  return null;
};

const checkPrint = (value: string) => {
  const match = /^\{([^}]+)\}/.exec(value);
  if (match) {
    return match;
  }
  return null;
};

const questionType = "question";
const conditionType = "condition";
const printType = "print";

const customPlugin = () => {
  return (tree: Root) => {
    visit(tree, "text", (node: any) => {
      const match = checkQuestion(node.value);
      const condMatch = checkCondition(node.value);
      const printMatch = checkPrint(node.value);

      if (typeof node.value === "string" && match) {
        node.type = questionType;
        node.name = match[1];
        node.params = parseAttrs(match[2]);
      }
      if (typeof node.value === "string" && condMatch) {
        node.type = conditionType;
        node.expr = condMatch[1];
      }
      if (typeof node.value === "string" && printMatch) {
        node.type = printType;
        node.expr = printMatch[1];
      }
    });
  };
};

export default customPlugin;
