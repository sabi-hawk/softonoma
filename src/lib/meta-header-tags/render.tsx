import { parseMetaHeaderTags } from "./parse";

interface MetaHeaderTagsProps {
  html: string;
}

export default function MetaHeaderTags({ html }: MetaHeaderTagsProps) {
  const tags = parseMetaHeaderTags(html);

  return (
    <>
      {tags.map((tag, index) => {
        const key = `${tag.type}-${index}`;

        if (tag.type === "script") {
          const { type, src, async: isAsync, defer: isDefer, ...restProps } = tag.props;
          return (
            <script
              key={key}
              type={type || undefined}
              src={src || undefined}
              async={isAsync === "true" || isAsync === "" || undefined}
              defer={isDefer === "true" || isDefer === "" || undefined}
              {...restProps}
              dangerouslySetInnerHTML={tag.content ? { __html: tag.content } : undefined}
            />
          );
        }

        if (tag.type === "meta") {
          const { name, property, content, httpEquiv, charset, ...restProps } = tag.props;
          return (
            <meta
              key={key}
              name={name || undefined}
              property={property || undefined}
              content={content || undefined}
              httpEquiv={httpEquiv || undefined}
              charSet={charset || undefined}
              {...restProps}
            />
          );
        }

        if (tag.type === "link") {
          const { rel, href, as, type, sizes, crossorigin, ...restProps } = tag.props;
          return (
            <link
              key={key}
              rel={rel || undefined}
              href={href || undefined}
              as={as || undefined}
              type={type || undefined}
              sizes={sizes || undefined}
              crossOrigin={
                crossorigin === "anonymous" || crossorigin === "use-credentials"
                  ? (crossorigin as "anonymous" | "use-credentials")
                  : undefined
              }
              {...restProps}
            />
          );
        }

        if (tag.type === "style") {
          return (
            <style key={key} dangerouslySetInnerHTML={{ __html: tag.content || "" }} />
          );
        }

        if (tag.type === "noscript") {
          return (
            <noscript key={key} dangerouslySetInnerHTML={{ __html: tag.content || "" }} />
          );
        }

        return null;
      })}
    </>
  );
}

