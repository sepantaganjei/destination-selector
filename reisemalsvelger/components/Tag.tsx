import { ReactNode } from "react";
import styles from "./Tag.module.css";

type Props = {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
};

const Tag = ({ children, onClick, active }: Props) => {
  return (
    <span
      onClick={onClick}
      className={`${styles.tag} ${active && styles.active}`}
    >
      {children}
    </span>
  );
};

export default Tag;
