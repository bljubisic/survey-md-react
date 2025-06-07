import { type Literal, type Node, type Parent } from "mdast";

const questionType = "question";
const conditionType = "condition";

const mergeHTML = (nodes: [Literal]) => {
  let len = nodes.length;
  let node, html;
  const merged = [];
  for (let i = 0; i < len; i++) {
    node = nodes[i];
    if (node.type === "html" || node.type === "text") {
      if (html) {
        html.value += node.value;
      } else {
        html = node;
        merged.push(node);
      }
    } else {
      html = null;
      merged.push(node);
    }
  }
  return merged;
};

interface QuestionNode extends Literal {
  type: typeof questionType;
}

const find = (
  nodes: Node,
  type: string,
  remove: boolean,
): QuestionNode | null => {
  const node = nodes as Parent;
  if (node.children) {
    for (const child of node.children) {
      const tmpChild = child as Literal;
      if (tmpChild.type === type) {
        if (remove) {
          const index = node.children.indexOf(child, 0);
          if (index > -1) {
            node.children.splice(index, 1);
          }
        }
        return tmpChild as QuestionNode;
      }
    }
  }
  return null;
};

const survey = (tree: Node) => {
  const pagebreakType = "thematicBreak";
  const { children } = tree as Parent;
  let len = children.length;
  let node: any, qst: any, cond: any;
  let page = { type: "page", children: [] };
  const pages = [];
  for (let i = 0; i < len; i++) {
    node = children[i];
    if (!qst) {
      qst = find(node, questionType, false);
      if (qst) {
        node = qst;
      }
    }
    if (!cond) {
      cond = find(node, conditionType, true);
    }
    if (node.type === questionType) {
      qst = node;
    } else if (node.type === conditionType) {
      cond = node;
    } else {
      if (qst) {
        node[questionType] = qst;
        qst = null;
      }
      if (cond) {
        node[conditionType] = cond;
        cond = null;
      }
      if (node.type === pagebreakType) {
        pages.push(page);
        page = { ...node, type: "page", children: [] };
      } else {
        if (node.children) {
          node.children = mergeHTML(node.children);
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        page.children.push(node);
      }
    }
  }
  pages.push(page);
  return pages;
};

export default survey;
