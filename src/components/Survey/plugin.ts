import { visit } from "unist-util-visit";
import { unified, type Plugin } from "unified";
import { Node, type Literal } from "unist";

const questionType = "question";
const conditionType = "condition";
const printType = "print";

function checkQuestion(value: string) {
  const match = /^\? *(\w[\w]*) *(.*)/.exec(value);
  console.log(match);
  if (match) {
    return true;
  }
  return false;
}

function checkCondition(value: string) {
  const match = /^@ *(.*)/.exec(value);
  if (match) {
    return true;
  }
  return false;
}

function checkPrint(value: string) {
  const match = /^\{([^}]+)\}/.exec(value);
  if (match) {
    return true;
  }
  return false;
}

const survey: Plugin = () => {
  console.log("hello");
  return (tree: Node) => {
    console.log("hello");
    visit(tree, "text", (node: Literal) => {
      console.log(node);
      if (typeof node.value === "string" && checkQuestion(node.value)) {
        node.type = questionType;
      }
    });
  };
};

export default survey;
