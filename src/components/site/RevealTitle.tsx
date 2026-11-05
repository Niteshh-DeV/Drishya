import { Fragment, type CSSProperties } from "react";

interface RevealTitleProps {
  text: string;
  as?: "h1" | "h2" | "p";
  className?: string;
  style?: CSSProperties;
}

/**
 * A page title whose words rise one after another out of a mask, the way
 * luxury print titles are revealed. Pure CSS (`.reveal-mask`/`.reveal-word`
 * in globals.css): it plays as soon as the HTML arrives, without waiting for
 * scripts, and never leaves a title hidden. Meant for titles at the top of
 * a page; on the first page of a visit the words wait for the intro curtain.
 *
 * Words stay whole (each is one inline-block), so `displayTitleSize` still
 * keeps the longest on one line, and the text reads normally to screen
 * readers.
 */
export function RevealTitle({ text, as: Tag = "h1", className, style }: RevealTitleProps) {
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <Tag className={className} style={style}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="reveal-mask">
            <span className="reveal-word" style={{ "--i": i } as CSSProperties}>
              {word}
            </span>
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </Tag>
  );
}
