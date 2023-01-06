import { ProductDescriptionEditor } from "./ProductDescriptionEditor";
import { FunctionComponent, useState } from "react";
import { FormLabel } from "react-bootstrap";
import MDEditor from "@uiw/react-md-editor";

export interface ProductDescriptionInputProps {
  markdown?: boolean;
  error?: Error;
  mode?: "edit" | "view" | "add";

  [key: string]: any;
}

export const ProductDescriptionInput: FunctionComponent<
  ProductDescriptionInputProps
> = ({ markdown = false, error, mode = "view", ...props }) => {
  const [markdownEnabled, setMarkdownEnabled] = useState(markdown);

  return (
    <div data-color-mode="light">
      <label htmlFor="description">
        Description{" "}
        {mode !== "view" && (
          <>
            (&nbsp;
            <input
              key="1"
              type="checkbox"
              id="markdown"
              checked={markdownEnabled}
              onChange={() => setMarkdownEnabled(!markdownEnabled)}
            />
            <FormLabel htmlFor="markdown" key={2}>
              &nbsp;Markdown )
            </FormLabel>
          </>
        )}
      </label>
      {mode === "view" ? (
        <MDEditor.Markdown
          className="form-control"
          source={props.defaultValue || "N/A"}
        />
      ) : (
        <ProductDescriptionEditor markdown={markdownEnabled} {...props} />
      )}
      {["add", "edit"].includes(mode) && error && (
        <div className="alert alert-danger">{error?.message}</div>
      )}
    </div>
  );
};
