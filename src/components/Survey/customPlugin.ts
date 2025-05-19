import { visit } from "unist-util-visit";
import { Root } from "mdast";
import type { Literal } from "unist";

function checkQuestion(value: string) {
  const match = /^\? *(\w[\w]*) *(.*)/.exec(value);
  console.log(match);
  if (match) {
    return true;
  }
  return false;
}

const questionType = "question";

export default function customPlugin() {
  return (tree: Root) => {
    visit(tree, "text", (node: Literal) => {
      if (typeof node.value === "string" && checkQuestion(node.value)) {
        node.type = questionType;
      }
    });
  };
}
