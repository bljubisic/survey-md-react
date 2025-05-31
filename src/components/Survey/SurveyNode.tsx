import { createFunction } from "./expression";
import SurveyPrint from "./SurveyPrint";
import SurveyQuestion from "./SurveyQuestion";

export type NodeProps = {
  context: {
    [x: string]: any;
  };
  next: (arg: string | null) => {};
  node: {
    condition: { expr: any };
    type: string;
    value: string;
    question: any;
    depth: number;
    children: any;
    url: string | string[];
    alt: any;
    expr: any;
  };
};

const SurveyNode: React.FC<NodeProps> = ({ node, context, next }) => {
  const matchHead = (html: string) => {
    return html.match(/^<head>([\s\S]*)<\/head>$/i);
  };

  const inlinePrints = (str: string, ctx: { [x: string]: any }) => {
    return str.replace(/\{ *([^ }]+) *\}/g, (_, key) =>
      key in ctx && ctx[key] !== null ? ctx[key] : "",
    );
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

  return (
    <div>
      {head && <div dangerouslySetInnerHTML={{ __html: head }} />}
      {condValue && (
        <div>
          {node.question && (
            <SurveyQuestion node={node} context={context} next={next} />
          )}
          {node.type === "print" && (
            <SurveyPrint node={node} context={context} next={next} />
          )}
          {node.type === "heading" && (
            <div>
              {node.depth === 1 ? (
                <h1>
                  {node.children.map((child: any) => {
                    return (
                      <SurveyNode node={child} context={context} next={next} />
                    );
                  })}
                </h1>
              ) : node.depth === 2 ? (
                <h2>
                  {node.children.map((child: any) => {
                    return (
                      <SurveyNode node={child} context={context} next={next} />
                    );
                  })}
                </h2>
              ) : (
                <h3>
                  {node.children.map((child: any) => {
                    return (
                      <SurveyNode node={child} context={context} next={next} />
                    );
                  })}
                </h3>
              )}
            </div>
          )}
          {node.type === "paragraph" && (
            <p>
              {node.children.map((child: any) => {
                return (
                  <SurveyNode node={child} context={context} next={next} />
                );
              })}
            </p>
          )}
          {node.type === "list" && (
            <ul>
              {node.children.map((child: any) => {
                return (
                  <li>
                    <SurveyNode node={child} context={context} next={next} />
                  </li>
                );
              })}
            </ul>
          )}
          {node.type === "link" &&
            (node.url === "+" || node.url === "-" ? (
              <a
                href="javascript:"
                className={node.url === "+" ? "next" : "back"}
                onClick={() =>
                  next(Array.isArray(node.url) ? node.url.join("") : node.url)
                }
              >
                {node.children.map((child: any) => {
                  return (
                    <SurveyNode node={child} context={context} next={next} />
                  );
                })}
              </a>
            ) : (
              <a
                href={inlinePrints(
                  Array.isArray(node.url) ? node.url.join("") : node.url,
                  context,
                )}
                target={
                  (Array.isArray(node.url)
                    ? node.url.join("")
                    : node.url
                  ).includes("//")
                    ? "_blank"
                    : "_self"
                }
                rel={
                  (Array.isArray(node.url)
                    ? node.url.join("")
                    : node.url
                  ).includes("//")
                    ? "nofollow noopener"
                    : ""
                }
              >
                {node.children.map((child: any) => {
                  return (
                    <SurveyNode node={child} context={context} next={next} />
                  );
                })}
              </a>
            ))}
          {node.type === "imagew" && (
            <img
              src={inlinePrints(
                Array.isArray(node.url) ? node.url.join("") : node.url,
                context,
              )}
              alt={node.alt}
            />
          )}
          {node.type === "strong" && (
            <b>
              {node.children.map((child: any) => {
                return (
                  <SurveyNode node={child} context={context} next={next} />
                );
              })}
            </b>
          )}
          {node.type === "emphasis" && (
            <i>
              {node.children.map((child: any) => {
                return (
                  <SurveyNode node={child} context={context} next={next} />
                );
              })}
            </i>
          )}
          {node.type === "inlineCode" && <code>{node.value}</code>}
          {node.type === "break" && <br />}
          {node.value && (
            <div dangerouslySetInnerHTML={{ __html: node.value }} />
          )}
          {node.children &&
            node.children.map((child: any) => {
              return <SurveyNode node={child} context={context} next={next} />;
            })}
        </div>
      )}
      {node.type}
    </div>
  );
};

export default SurveyNode;
