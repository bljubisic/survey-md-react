import { Component } from "react";
import "./radio.css";

interface RadioProps {
  text: React.ReactNode;
  onChange: (value: string) => void;
  selected: boolean;
  value: string;
}

export class Radio extends Component<RadioProps> {
  state = {};
  render() {
    const { selected, onChange, text, value } = this.props;
    return (
      <div
        className="modern-radio-container"
        onClick={() => {
          onChange(value);
        }}
      >
        <div className={`radio-outer-circle ${!selected && "unselected"}`}>
          <div
            className={`radio-inner-circle ${!selected && "unselected-circle"}`}
          />
        </div>
      </div>
    );
  }
}
