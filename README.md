# What is Survey-md-react

Survey-md-react is an attempt to simplify creating and using surveys through the code. As a starting point, I used [surv.app project](https://surv.app) which provided the same functionality but on server side. I am trying to offer something like this out of necessity to use similar library for dynamically survey generation using markdown coming from BE. md stands for Markdown as I am using markdown language to describe the surveys. All results are stored in context object and you can easily access them using context["question_name"]. There are couple of rules how to do that:

- Pages are delimited by using standard Markdown delimiter, either `***` or `---`
- Questions are marked with question mark as the first character on the line, following with the question variable `?question_name`
- Closed questions are always followed with the list of available items, which is described using normal Markdown syntax
- Opened questions are followed with placeholder text
- If you would like to display answer on the survey, you can do that by enclosing the question_name within curly brackets, `{question_name}`
- Also, in addition to this, you can add dynamic question selection by using regular Javascript expressions enclosed in curly brackets
- You can also specify max number of answers question can provide with using `max=num` and `min=num` after the question_name
- You can specify conditions for displaying elements of the surveys, like submit buttons or even displaying whole pages. Condition is specified using `@` as the first character on the line. It should be followed by conditional javascript expression.
- Lists of the available answers can be shuffled by using `shuffle` after the question_name in the question description
- Numbers can be entered by using selection box, using `min=num max=num` right after the question_name. The question type should be opened question.
- Style can also be overwritten by using `<style>` html tag within your markdown snippet.

# Using Survey-md-react

Using survey-md-react is simple, you should just add the survey-md-react in your package.json. After that all of the necessary tools would be available to you. Most simple way of usage is creating your `api.ts` file. `api.ts` would be used for parsing the markdown and providing the resulting data where it can be used. Sample `api.ts` should be something like this:

```
export const useProcessText = (text: string) => {
  const [page, setPage] = useState([
    {
      type: "page",
      children: [],
    },
  ]);

  useEffect(() => {
    const result = unified()
      .use(remarkParse, { sanitize: false })
      .use(customPlugin);

    result
      .run(result.parse(text))
      .then((modifiedText) => survey(modifiedText))
      .then((pageResult) => {
        console.log(JSON.stringify(pageResult));
        setPage(pageResult);
      });
  }, [text]);
  return page;
};
```

Normally you would use something like this to display the survey to the users:

```
function App() {
  const text =
      '## Hi! Please pick a number.\n  (We shuffle them *every time*)\n\n?mynumber email\n\nsomething\n\n@ mynumber\n[Submit](+)';

  const page = useProcessText(text);

  return (
    <div className="App">
      {Array.isArray(page) && page.map((child: any, index: number) => (
        <SurveyNode
          key={index}
          node={child}
          context={{}} // Provide appropriate context object here
          next={() => ({})} // Provide appropriate next function here
        />
      ))}
    </div>
  );
}

export default App;
```

That should be enough to get you started!
