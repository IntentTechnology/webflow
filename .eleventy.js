module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("src/admin");

  return {
    markdownTemplateEngine: "njk",
    templateFormats: ["html", "njk", "md"],
    dir: {
      input: "src",
      output: "_site",
      include: "includes",
    },
  };
};
