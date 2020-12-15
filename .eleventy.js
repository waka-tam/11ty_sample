module.exports = {
  dir: {
    input: "src/",
    output: "dist/",
    includes: "/_includes",
    layouts: "/_layouts",
    // グローバルデータファイルのディレクトリ
    // data: "/_data"
  },
  // templateFormats: ["html", "md", "njk"],
  templateFormats: [
    // "html",
    // "liquid",
    // "ejs",
    // "md",
    // "hbs",
    // "mustache",
    // "haml",
    "pug",
    "njk",
    // "11ty.js",
  ],
  // htmlTemplateEngine: "njk",
};
 