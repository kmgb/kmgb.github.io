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


class PageMetadata:
    """Data class for a page"""
    title: str
    description: str
    extra_head_items: str
    content: str
    date: str


def main():
    # Load the template file into a string
    template_str = ""
    with open("template.genhtml", encoding="utf-8") as template_file:
        template_str = template_file.read()

    path_pages = Path("./pages")
    path_blogs = Path("./pages/blog")

    # Go through each page to be generated, and replace the template
    # items with their specified data.
    # Finally, write the generated page to the root directory.
    for page_path in (f for f in path_pages.iterdir() if f.is_file()):
        process_page(page_path, template_str)

    blog_metadata: list[PageMetadata] = []
    for page_path in (f for f in path_blogs.iterdir() if f.is_file()):
        blog_metadata.append(process_page(page_path, template_str, is_blog=True))

    # Sort the blog posts by date
    # String date is fine for sorting because it's in YYYY-MM-DD format
    blog_metadata.sort(key=lambda x: x.date, reverse=True)

    # TODO: Generate the blog index page


def process_page(page_path: Path, template_str: str, *, is_blog: bool = False) -> PageMetadata:
    """Process a page template instance file and generate the HTML file in the path"""
    page_text = ""
    page_metadata = PageMetadata()

    with open(page_path, encoding="utf-8") as f:
        post = frontmatter.load(f)

        page_metadata.title = post["title"]
        page_metadata.description = post["description"]
        page_metadata.extra_head_items = post["extra_head_items"]
        page_metadata.date = post["date"] if is_blog else ""

        page_text = template_str.replace("%%TITLE%%", page_metadata.title)
        page_text = page_text.replace("%%DESCRIPTION%%", page_metadata.description)
        page_text = page_text.replace("%%EXTRA_HEAD_ITEMS%%", page_metadata.extra_head_items)
        page_text = page_text.replace("%%CONTENT%%", post.content)

    out_path = f"./{"blog/" if is_blog else ""}{page_path.stem}.html"

    # Minify the HTML and write it to the root directory
    with open(out_path, "w", encoding="utf-8") as f:
        page_text = minify_html.minify(page_text, minify_css=True, minify_js=True)
        f.write(page_text)

    return page_metadata


if __name__ == "__main__":
    main()
