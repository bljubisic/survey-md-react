export type NodeProps = {
  text: string;
};

const SurveyNode: React.FC<NodeProps> = ({ text }) => {
  return <>{text}</>;
};

export default SurveyNode;
