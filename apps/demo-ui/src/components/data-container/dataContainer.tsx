import { FC } from "react";
import classes from "./dataContainer.module.scss";

export const DataContainer: FC<{
  name: string;
  text: string;
  date: string;
}> = ({ name, text, date }) => {
  return (
    <div className={classes["item"]}>
      <h3>{name}</h3>
      <hr />
      <p
        style={{ fontSize: "16px", lineHeight: "1.6", whiteSpace: "pre-line" }}
      >
        {text}
      </p>
      <p className={classes["date"]}>{date}</p>
    </div>
  );
};
