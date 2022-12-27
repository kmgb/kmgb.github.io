"""Generate HTML pages given template file
This program looks for a folder called pages/ under the current working directory.
It then uses a template file (template.genhtml) to generate HTML files from
the files under pages/ with portions of the template replaced with the
frontmatter specified in each file, as well as the content therein.

The resulting HTML file is then minified and saved to the current working directory.

e.g.
./pages/
    index.html
    coolpage.abcd
    page3.x

Generates

./index.html
./coolpage.html
./page3.html
"""

from pathlib import Path
import frontmatter
import minify_html


def main():
    # Load the template file into a string
    template_str = ""
    with open("template.genhtml", encoding="utf-8") as template_file:
        template_str = template_file.read()

    # Go through each page to be generated, and replace the template
    # items with their specified data.
    # Finally, write the generated page to the root directory.
    p = Path("./pages")
    for file_path in (f for f in p.iterdir() if f.is_file()):
        data = ""
        with open(file_path, encoding="utf-8") as f:
            post = frontmatter.load(f)
            data = template_str.replace("%%TITLE%%", post["title"])
            data = data.replace("%%DESCRIPTION%%", post["description"])
            data = data.replace("%%EXTRA_HEAD_ITEMS%%", post["extra_head_items"])
            data = data.replace("%%CONTENT%%", post.content)

        # Minify the HTML and write it to the root directory
        with open(f"./{file_path.stem}.html", "w", encoding="utf-8") as f:
            data = minify_html.minify(data, minify_css=True, minify_js=True)
            f.write(data)


if __name__ == "__main__":
    main()
