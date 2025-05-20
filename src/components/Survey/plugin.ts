import { Root, type Literal, type Node } from "mdast";

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

const survey = (tree: Root) => {
  const pagebreakType = "thematicBreak";
  const { children } = tree;
  let len = children.length;
  let node: any, qst: any, cond: any;
  let page = { type: "page", children: [] };
  const pages = [];
  for (let i = 0; i < len; i++) {
    node = children[i];
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
