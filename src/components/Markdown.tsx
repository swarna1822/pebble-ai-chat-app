import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Box, Button } from "@mui/material";
import "highlight.js/styles/github-dark.css";

function toText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toText).join("");
  if (React.isValidElement(node)) return toText((node.props as { children?: React.ReactNode }).children);
  return "";
}

function CodeBlock({ children }: { children?: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const child = React.Children.toArray(children)[0];
  const props = React.isValidElement(child)
    ? (child.props as { className?: string; children?: React.ReactNode })
    : {};
  const lang = /language-([\w-]+)/.exec(props.className ?? "")?.[1] ?? "code";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(toText(props.children));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <Box sx={{ my: 1.5, borderRadius: 2, overflow: "hidden", bgcolor: "#0d1117", color: "#e6edf3" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pl: 1.5, pr: 0.5, py: 0.25, bgcolor: "rgba(255,255,255,0.06)", fontSize: 13 }}>
        <span>{lang}</span>
        <Button size="small" color="inherit" onClick={copy} sx={{ textTransform: "none" }}>
          {copied ? "Copied" : "Copy"}
        </Button>
      </Box>
      <Box component="pre" sx={{ m: 0, p: 1.5, overflowX: "auto", fontSize: 13.5, lineHeight: 1.5 }}>
        <code className={props.className}>{props.children}</code>
      </Box>
    </Box>
  );
}

export default function Markdown({ text }: { text: string }) {
  return (
    <Box
      sx={{
        overflowWrap: "anywhere",
        "& > :first-of-type": { mt: 0 },
        "& > :last-child": { mb: 0 },
        "& p, & ul, & ol": { mt: 0, mb: 1.5 },
        "& ul, & ol": { pl: 3 },
        "& a": { color: "primary.main" },
        "& :not(pre) > code": { px: 0.75, borderRadius: 1, bgcolor: "action.hover", fontSize: "0.9em" },
        "& table": { borderCollapse: "collapse", mb: 1.5 },
        "& th, & td": { border: 1, borderColor: "divider", px: 1, py: 0.5 }
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          )
        }}
      >
        {text}
      </ReactMarkdown>
    </Box>
  );
}
