import React from "react";
import { ArrowDown } from "./assets/arrow-down";
import { ArrowUp } from "./assets/arrow-up";
import { QuestionMark } from "./assets/question-mark";

export const ICON_NAME = {
  ARROW_DOWN: "arrow-down",
  ARROW_UP: "arrow-up",
  QUESTION_MARK: "question-mark",
} as const;

export type IconName = (typeof ICON_NAME)[keyof typeof ICON_NAME];

export const ICON_MAP = {
  [ICON_NAME.ARROW_DOWN]: ArrowDown,
  [ICON_NAME.ARROW_UP]: ArrowUp,
  [ICON_NAME.QUESTION_MARK]: QuestionMark,
};

type Props = { name: IconName; className?: string };

export const Icon: React.FC<Props> = (props) => {
  const IconComponent = ICON_MAP[props.name];
  return <IconComponent {...props} />;
};
