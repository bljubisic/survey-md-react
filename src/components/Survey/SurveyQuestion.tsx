import type { NodeProps } from "./SurveyNode";
import SurveyNode from "./SurveyNode";
import styles from "./survey.module.css";

<style></style>;

const SurveyQuestion: React.FC<NodeProps> = ({ node, context, next }) => {
  const shuffleArray = (array: string | any[]) => {
    for (let i = array.length - 1, j; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      // @ts-ignore
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const flatten = (node: { children: any; value: any }) => {
    return (node.children || [])
      .reduce(
        (
          text: string,
          node: {
            children: any;
            value: any;
          },
        ) => text + " " + flatten(node),
        node.value || "",
      )
      .trim();
  };

  const check = (i: string | number, j: number | undefined = undefined) => {
    if (multi) {
      // @ts-ignore
      if (checked[i]) {
        // @ts-ignore
        checked[i] = false;
      } else {
        const { max } = params;
        const count = Object.values(checked).filter(Boolean).length;
        if (max && count + 1 <= max) {
          // @ts-ignore
          checked[i] = true;
        }
      }
    } else if (matrix) {
      if (!checked[i + "." + j]) {
        if (
          Object.keys(checked).filter(
            (key) => key.includes(i + ".") && checked[key] === true,
          ).length === 0
        ) {
          // @ts-ignore
          checked[i + "." + j] = true;
        } else {
          Object.keys(checked)
            .filter((key) => key.includes(i + "."))
            .forEach((key) => {
              checked[key] = false;
            });
          checked[i + "." + j] = true;
        }
      }
    } else {
      checked = { [i]: true };
    }
    // @ts-ignore
    const val = textValues.filter(
      (_v: any, i: string | number) => !!checked[i],
    );
    if (multi) {
      const min = params.min || 0;
      save(val.length >= min ? val : []);
    } else if (matrix) {
      save(val);
    } else {
      save(val[0]);
    }
  };

  const save = (val: any) => {
    context[node.question.name] = val;
  };

  const { params } = node.question;
  if (node.type === "list" && params && params.shuffle) {
    shuffleArray(node.children);
  }

  const multi = node.type === "list" && params && (params.min || params.max);
  let matrix =
    node.type === "list" && params && params.matrix && params.matrix.split(",");
  const textValues = node.children.map(flatten);
  let checked: { [key: string | number]: any } = {};
  const selected = context[node.question.name];

  if (selected === undefined) {
    context[node.question.name] = null;
  }

  if (Array.isArray(selected)) {
    textValues.forEach((v: any, i: string | number) => {
      // @ts-ignore
      checked[i] = selected.includes(v);
    });
  }

  const className = params.class || "";

  const qname = node.question.name;

  return (
    <div>
      {node.type === "list" &&
        (matrix !== undefined && matrix.length > 0 ? (
          <ul
            id={qname}
            className={styles.matrix}
            style={{ ["--size" as any]: matrix ? matrix.length + 1 : 0 }}
          >
            <div className="matrixli">
              <div className="matrixTxt">
                <p></p>
              </div>
              {matrix.forEach((matrixLeg: any) => {
                <div className="matrixTxt">
                  <p>{matrixLeg}</p>
                </div>;
              })}
              {node.children.forEach((child: any, i: number) => {
                <div className={styles.matrixTxt}>
                  <SurveyNode
                    node={{ ...child.children[0], type: "text" }}
                    context={context}
                    next={next}
                  />
                </div>;
                {
                  matrix.forEach((nonused: any, j: number) => {
                    <div className={styles.single}>
                      <li
                        onClick={() => check(i, j)}
                        className={{ ...styles.single, ...styles.checked }}
                        role="checkbox"
                        aria-checked={checked[i + "." + j]}
                      ></li>
                    </div>;
                  });
                }
              })}
            </div>
          </ul>
        ) : (
          <ul id={qname} className={multi ? styles.multi : styles.single}>
            {node.children.forEach((child: any, i: number) => {
              <li
                onClick={() => check(i)}
                className={styles.checked}
                role="checkbox"
                aria-checked={checked[i]}
              >
                <SurveyNode
                  node={{ ...child.children[0], type: "text" }}
                  context={context}
                  next={next}
                />
              </li>;
            })}
          </ul>
        ))}
    </div>
  );
};

export default SurveyQuestion;
