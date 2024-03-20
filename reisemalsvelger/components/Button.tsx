import { ReactNode } from "react";
import styles from "./Button.module.css";

type Props = {
  children: ReactNode;
  important?: boolean;
  danger?: boolean;
  submit?: boolean;
  onClick?: () => void;
  className?: string;
};

const Button = ({
  children,
  important,
  onClick,
  className,
  submit,
  danger,
}: Props) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${important && styles.important} ${danger && styles.danger} ${className}`}
      type={submit ? "submit" : "button"}
    >
      {children}
    </button>
  );
};

export default Button;
