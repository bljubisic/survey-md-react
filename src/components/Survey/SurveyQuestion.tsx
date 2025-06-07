import { useState } from "react";
import { Radio } from "./Radio";
import type { NodeProps } from "./SurveyNode";
import SurveyNode from "./SurveyNode";
import styles from "./survey.module.css";

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
    console.log(i, j, selections);
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
      const key: string = `row${i}_option${j}`;
      setSelections((prev) => ({
        ...prev,
        [i]: { [key]: true },
      }));
    } else {
      checked = { [i]: true };
      setSelections((prev) => ({
        ...prev,
        // eslint-disable-next-line no-useless-computed-key
        [0]: { [i]: true },
      }));
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
  let matrix: [] =
    node.type === "list" && params && params.matrix && params.matrix.split(",");

  console.log(matrix);
  const textValues = node.children.map(flatten);
  let checked: { [key: string]: boolean } = {};
  const [selections, setSelections] = useState<
    Record<number, Record<string, boolean>>
  >({});
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

  const classname = params.class || "";

  const qname = node.question.name;

  return (
    <div>
      {(node.type === "list" &&
        (matrix && matrix.length > 0 ? (
          <ul
            id={qname}
            className={styles.matrix}
            style={{ ["--size" as any]: matrix ? matrix.length + 1 : 0 }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(var(--size), 1fr)",
                gap: "10px",
              }}
            >
              <div className="matrixTxt">
                <p></p>
              </div>
              {matrix.map((matrixLeg: string, index: number) => {
                return (
                  <div className="matrixTxt" key={index}>
                    <p key={index}>{matrixLeg}</p>
                  </div>
                );
              })}
              {node.children.map((child: any, i: number) => {
                return (
                  <>
                    <div className="matrixTxt" key={i}>
                      <SurveyNode
                        key={i}
                        node={{ ...child.children[0], type: "text" }}
                        context={context}
                        next={next}
                      />
                    </div>
                    {matrix.map((nonused: any, j: number) => {
                      const key = `row${i}_option${j}`;
                      const isChecked = selections[i]?.[key] || false;
                      return (
                        <div className="single" key={i + j}>
                          <Radio
                            key={i + j}
                            value={key}
                            selected={isChecked}
                            text={""}
                            onChange={() => check(i, j)}
                          />
                        </div>
                      );
                    })}
                  </>
                );
              })}
            </div>
          </ul>
        ) : (
          <ul id={qname} className={multi ? styles.multi : styles.single}>
            {node.children.map((child: any, i: number) => {
              const isChecked = selections[0] || false;
              return (
                <>
                  <div className="single" key={i}>
                    <Radio
                      key={i}
                      value={`${i}`}
                      selected={isChecked[i] || false}
                      text={""}
                      onChange={() => check(i)}
                    />
                  </div>
                  <SurveyNode
                    key={i}
                    node={{ ...child.children[0], type: "text" }}
                    context={context}
                    next={next}
                  />
                </>
              );
            })}
          </ul>
        ))) ||
        (node.type === "paragraph" && (
          <>
            <p id={qname} className={`input ${classname}`}></p>
            {params.rows ? (
              <textarea
                rows={params.rows}
                placeholder={flatten(node)}
                value={context[node.question.name]}
              />
            ) : !isNaN(params.min) || !isNaN(params.max) ? (
              <input
                type="number"
                min={params.min}
                max={params.max}
                placeholder={flatten(node)}
                value={context[node.question.name]}
              />
            ) : params.email ? (
              <input
                type="email"
                placeholder={flatten(node)}
                value={context[node.question.name]}
              />
            ) : (
              <input
                type="text"
                placeholder={flatten(node)}
                value={context[node.question.name]}
              />
            )}
          </>
        ))}
    </div>
  );
};

export default SurveyQuestion;
