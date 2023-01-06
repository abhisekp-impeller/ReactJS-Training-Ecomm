import MDEditor from "@uiw/react-md-editor";
import React, { forwardRef, FunctionComponent, useCallback, useEffect, useRef, useState, } from "react";
import classNames from "classnames";
import rehypeSanitize from "rehype-sanitize";
import katex from "katex";
import "katex/dist/katex.css";
import mermaid from "mermaid";
import { nanoid } from "nanoid";

export interface ProductDescriptionEditorProps {
  markdown?: boolean;

  [key: string]: any;
}

const Code: FunctionComponent = ({
  inline,
  children = [],
  className,
  ...props
}) => {
  // console.log(className)
  const demoid = useRef(`dome${nanoid()}`);
  const code = getCode(children);
  const demo = useRef(null);
  useEffect(() => {
    if (demo.current) {
      try {
        const str = mermaid.render(
          demoid.current,
          code,
          () => null,
          demo.current
        );
        // @ts-ignore
        demo.current.innerHTML = str;
      } catch (error) {
        // @ts-ignore
        demo.current.innerHTML = error;
      }
    }
  }, [code, demo]);

  if (
    typeof className === "string" &&
    /^language-mermaid/.test(className.toLocaleLowerCase())
  ) {
    return (
      <code ref={demo}>
        <code id={demoid.current} style={{ display: "none" }}/>
      </code>
    );
  }

  if (inline) {
    if (/^\$(.*)\$/.test(code)) {
      const html = katex.renderToString(code.replace(/^\$(.*)\$/, "$1"), {
        throwOnError: false,
      });
      return <code dangerouslySetInnerHTML={{ __html: html }}/>;
    }
    return <code>{code}</code>;
  }

  if (
    typeof className === "string" &&
    /^language-katex/.test(className.toLocaleLowerCase())
  ) {
    const html = katex.renderToString(code, {
      throwOnError: false,
    });
    // console.log("props", code, className, props);
    return <code dangerouslySetInnerHTML={{ __html: html }}/>;
  }

  return <code className={String(className)}>{children}</code>;
};

const getCode = (arr = []): string =>
  arr
    .map((dt) => {
      if (typeof dt === "string") {
        return dt;
      }
      if (dt.props && dt.props.children) {
        return getCode(dt.props.children);
      }
      return false;
    })
    .filter(Boolean)
    .join("");

export const ProductDescriptionEditor: FunctionComponent<ProductDescriptionEditorProps> =
  forwardRef<HTMLTextAreaElement, ProductDescriptionEditorProps>(
    ({ markdown = false, onChange, value, defaultValue, ...props }, ref) => {
      const [description, setDescription] = useState(defaultValue || "");

      const handleChange = useCallback(
        (value: string = "") => {
          if (onChange) {
            onChange(value);
          }
          setDescription(value);
        },
        [onChange]
      );

      return (
        <>
          {markdown && (
            <MDEditor
              value={description}
              onChange={handleChange}
              height={200}
              previewOptions={{
                rehypePlugins: [[rehypeSanitize]],
                linkTarget: "_blank",
                components: {
                  code: Code,
                },
              }}
              {...props}
            />
          )}
          <textarea
            hidden={markdown}
            rows={8}
            value={description}
            onChange={(ev) => handleChange(ev.target.value)}
            ref={ref}
            {...props}
            className={classNames("form-control", props.className)}
          />
        </>
      );
    }
  );
