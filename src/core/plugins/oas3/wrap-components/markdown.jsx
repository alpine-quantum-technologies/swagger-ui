import React from "react"
import PropTypes from "prop-types"
import cx from "classnames"
import { Remarkable } from "remarkable"
import rkatex from "remarkable-katex"
import { OAS3ComponentWrapFactory } from "../helpers"
import { sanitizer } from "core/components/providers/markdown"

const parser = new Remarkable("commonmark")
parser.use(rkatex)
parser.block.ruler.enable(["table"])
parser.set({ linkTarget: "_blank" })

export const Markdown = ({ source, className = "", getConfigs }) => {
  if(typeof source !== "string") {
    return null
  }

  if ( source ) {
    const { useUnsafeMarkdown } = getConfigs()
    const html = parser.render(source)
    console.log(html)
    // TODO: figure out how to prevent the sanitizer from
    // filtering out katex spans.
    const sanitized = html
    //const sanitized_to_much = sanitizer(html, { useUnsafeMarkdown })
    const sanitized_not_working = sanitizer(html, {
      USE_PROFILES: {html: true, mathMl: true},
      ADD_ATTR: ["style", "class", "aria-hidden"]
    })
    console.log("Sanitized")
    console.log(sanitized_not_working)

    let trimmed

    if(typeof sanitized === "string") {
      trimmed = sanitized.trim()
    }

    return (
      <div
        dangerouslySetInnerHTML={{
          __html: trimmed
        }}
        className={cx(className, "renderedMarkdown")}
      />
    )
  }
  return null
}
Markdown.propTypes = {
  source: PropTypes.string,
  className: PropTypes.string,
  getConfigs: PropTypes.func,
}

Markdown.defaultProps = {
  getConfigs: () => ({ useUnsafeMarkdown: false }),
}

export default OAS3ComponentWrapFactory(Markdown)
