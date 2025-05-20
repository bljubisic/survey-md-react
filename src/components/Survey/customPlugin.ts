import { visit } from "unist-util-visit";
import { Root } from "mdast";

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

const customPlugin = () => {
  return (tree: Root) => {
    visit(tree, "text", (node: any) => {
      if (typeof node.value === "string" && checkQuestion(node.value)) {
        console.log("found it");
        node.type = questionType;
      }
      if (typeof node.value === "string" && checkCondition(node.value)) {
        node.type = conditionType;
      }
      if (typeof node.value === "string" && checkPrint(node.value)) {
        node.type = printType;
      }
    });
    console.log(tree);
  };
};

export default customPlugin;
