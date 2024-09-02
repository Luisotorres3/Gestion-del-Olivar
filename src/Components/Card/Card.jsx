import React from "react";
import styles from "./Card.module.css";

const Card = ({ title, img, content, content_extra, extra }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        <p>{title}</p>
        <img src={img} />
      </div>
      <div className={styles.cardContent}>
        <h4>{content}</h4>
      </div>
      {content_extra && (
        <div className={styles.cardContent}>
          <h4>{content_extra}</h4>
        </div>
      )}
      <div className={styles.extra}>
        <h6>{extra}</h6>
      </div>
    </div>
  );
};

export default Card;
