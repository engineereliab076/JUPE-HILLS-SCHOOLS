export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("assets/docs");

  // Copy only deployable image variants. Raw photography and redundant JPG
  // originals remain available locally without shipping in production.
  eleventyConfig.addPassthroughCopy("assets/img/*-480.{jpg,webp}");
  eleventyConfig.addPassthroughCopy("assets/img/*-960.{jpg,webp}");
  eleventyConfig.addPassthroughCopy("assets/img/*-1600.webp");
  eleventyConfig.addPassthroughCopy("assets/img/jupe-hills-*.jpg");
  eleventyConfig.addPassthroughCopy("assets/img/logo-header.png");
  eleventyConfig.addPassthroughCopy("assets/img/favicon-*.png");
  eleventyConfig.addPassthroughCopy("assets/img/apple-touch-icon.png");

  eleventyConfig.addFilter("json", (value) => JSON.stringify(value));

  // Render phone numbers with non-breaking spaces so they never wrap and pass
  // the html-validate tel-non-breaking rule.
  eleventyConfig.addFilter("nbsp", (value) => String(value).replace(/ /g, " "));

  // Strip trailing whitespace that Nunjucks loops/conditionals leave on
  // generated lines so the output validates cleanly.
  eleventyConfig.addTransform("trim-trailing", (content, outputPath) => {
    if (outputPath && outputPath.endsWith(".html")) {
      return content.replace(/[ \t]+$/gm, "");
    }
    return content;
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
