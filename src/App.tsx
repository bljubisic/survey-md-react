import "./App.css";
import pages from "./components/Survey/pages.json";
import SurveyNode from "./components/Survey/SurveyNode";

const App = () => {
  return (
    <div className="App">
      {pages.children.map((child: any, index: number) => {
        return (
          <SurveyNode
            key={index}
            node={child}
            context={{}} // Provide appropriate context object here
            next={() => ({})} // Provide appropriate next function here
          />
        );
      })}
    </div>
  );
};

export default App;
