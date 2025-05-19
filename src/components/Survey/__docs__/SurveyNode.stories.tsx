import type { Meta, StoryObj } from "@storybook/react";
import Example from "./Example";

const meta: Meta<typeof Example> = {
  title: "SurveyNode",
  component: Example,
};

export default meta;
type Story = StoryObj<typeof Example>;

export const Primary: Story = {
  args: {
    text: '## Hi! Please pick a number.\n  (We shuffle them *every time*)\n\n?mynumber matrix="agree, not agree"\n- 1337\n- [42](https://www.google.com/search?q=42)\n- 7±2\n\n@ mynumber\n[Submit](+)',
  },
};
export const Secondary: Story = {
  args: {
    text: '## Hi! Please pick a number.\n  (We shuffle them *every time*)\n\n?mynumber matrix="agree, not agree"\n- 1337\n- [42](https://www.google.com/search?q=42)\n- 7±2\n\n@ mynumber\n[Submit](+)',
  },
};
