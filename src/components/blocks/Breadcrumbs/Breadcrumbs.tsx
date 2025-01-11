import { useWindowSize } from "@uidotdev/usehooks";
import cn from "classnames";
import { useLocation, useNavigate } from "react-router";
import { desktopWidth } from "../../../config";
import { ArrowButton } from "../ArrowButton/ArrowButton";
import styles from "./index.module.scss";

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const windowSize = useWindowSize();
  const { width } = windowSize;
  const notOnDesktop = width && width < desktopWidth;

  function isPathActive(path: string) {
    return path !== "" && path !== "product" && !+path;
  }

  const activePathSegments = location.pathname.split("/").filter(isPathActive); // exclude not active paths

  return (
    <div className={styles.breadcrumbs}>
      {notOnDesktop && <ArrowButton usedFor="breadcrumb" type="prev" />}
      <img
        className={styles["breadcrumbs__home-icon"]}
        src="/src/images/icons/home.svg"
        alt="Home"
        onClick={() => navigate("/")}
      />
      <div className={styles.breadcrumbs__path}>
        {activePathSegments.map((part, index) => {
          const link = activePathSegments.slice(0, index + 1).join("/");

          return (
            <a
              key={part}
              className={cn(styles.breadcrumbs__link, {
                [styles["breadcrumbs__link--disabled"]]: part === "cart",
              })}
              onClick={() => navigate(`../../${link}`)}
            >
              / <span className={styles["breadcrumbs__link-text"]}>{part}</span>{" "}
            </a>
          );
        })}
      </div>
    </div>
  );
};
