import { visit } from "unist-util-visit";
import { Root } from "mdast";
import type { Literal } from "unist";

const checkQuestion = (value: string) => {
  const match = /^\? *(\w[\w]*) *(.*)/.exec(value);
  console.log(match);
  if (match) {
    return true;
  }
  return false;
};

const checkCondition = (value: string) => {
  const match = /^@ *(.*)/.exec(value);
  if (match) {
    return true;
  }
  return false;
};

const checkPrint = (value: string) => {
  const match = /^\{([^}]+)\}/.exec(value);
  if (match) {
    return true;
  }
  return false;
};

const questionType = "question";
const conditionType = "condition";
const printType = "print";

export default function customPlugin() {
  return (tree: Root) => {
    visit(tree, "text", (node: any) => {
      if (typeof node.value === "string" && checkQuestion(node.value)) {
        node.type = questionType;
      }
      if (typeof node.value === "string" && checkCondition(node.value)) {
        node.type = conditionType;
      }
      if (typeof node.value === "string" && checkPrint(node.value)) {
        node.type = printType;
      }
    });
  };
}
