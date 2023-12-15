"""Generate HTML pages given template file
This program looks for a folder called pages/ under the current working directory.
It then uses template files (*.html_template) to generate HTML files from the files under pages/ and pages/blog/ with
portions of the template replaced with the frontmatter specified in each file, as well as the content therein.

The resulting HTML file is then minified and saved to the current working directory or ./blog as appropriate.

e.g.
./pages/
    index.html
    coolpage.abcd
    page3.x
    blog/blogpage.html

Generates

./index.html
./coolpage.html
./page3.html
./blog/blogpage.html
"""

from pathlib import Path
import frontmatter
import minify_html

PAGE_TEMPLATE_PATH = Path("./meta/page.html_template")
BLOG_INDEX_TEMPLATE_PATH = Path("./meta/blog_index.yhtml_template")
BLOG_ITEM_SNIPPET_PATH = Path("./meta/blog_snippet.html_snippet")
PAGE_DIRECTORY_PATH = Path("./pages")
BLOG_DIRECTORY_PATH = Path("./pages/blog")

# Load the template file into a string
PAGE_TEMPLATE_STR = ""
with open(PAGE_TEMPLATE_PATH, encoding="utf-8") as template_file:
    PAGE_TEMPLATE_STR = template_file.read()


class PageMetadata:
    """Data class for a page"""
    title: str
    url_title: str
    description: str
    extra_head_items: str
    content: str
    date: str


def main():
    path_pages = Path(PAGE_DIRECTORY_PATH)
    path_blogs = Path(BLOG_DIRECTORY_PATH)

    # Go through each page to be generated, and replace the template
    # items with their specified data.
    # Finally, write the generated page to the root directory.
    for page_path in (f for f in path_pages.iterdir() if f.is_file()):
        create_page(page_path)

    blog_metadata: list[PageMetadata] = []
    for page_path in (f for f in path_blogs.iterdir() if f.is_file()):
        blog_metadata.append(create_page(page_path, is_blog=True))

    # Sort the blog posts by date
    # String date is fine for sorting because it's in YYYY-MM-DD format
    blog_metadata.sort(key=lambda x: x.date, reverse=True)

    generate_blog_index(blog_metadata)


def create_page(page_path: Path, *, is_blog: bool = False) -> PageMetadata:
    """Process a page template instance file and generate the HTML file in the path"""
    page_text, page_metadata = process_page_data(page_path)

    out_path = Path(f"./{"blog/" if is_blog else ""}{page_path.stem}.html")

    write_page(out_path, page_text)

    return page_metadata


def write_page(out_path: Path, page_text: str):
    """Write the page to the disk"""
    # Minify the HTML and write it to the root directory
    with open(out_path, "w", encoding="utf-8") as f:
        page_text = minify_html.minify(page_text, minify_css=True, minify_js=True)
        f.write(page_text)


def process_page_data(page_path: Path) -> tuple[str, PageMetadata]:
    """Process a page template instance file and return the resulting content and metadata"""
    page_metadata = PageMetadata()

    page_metadata.url_title = page_path.stem

    with open(page_path, encoding="utf-8") as f:
        post = frontmatter.load(f)

        page_metadata.title = post["title"]
        page_metadata.description = post["description"]
        page_metadata.extra_head_items = post.get("extra_head_items", "")
        page_metadata.date = post.get("date", "")

        page_text = PAGE_TEMPLATE_STR.replace("%%TITLE%%", page_metadata.title)
        page_text = page_text.replace("%%DESCRIPTION%%", page_metadata.description)
        page_text = page_text.replace("%%EXTRA_HEAD_ITEMS%%", page_metadata.extra_head_items)
        page_text = page_text.replace("%%CONTENT%%", post.content)

    return page_text, page_metadata


def generate_blog_index(blog_metadata: list[PageMetadata]):
    """Generate the blog index page"""
    BLOG_ITEM_STR = ""
    with open(BLOG_ITEM_SNIPPET_PATH, encoding="utf-8") as template_file:
        BLOG_ITEM_STR = template_file.read()

    page_text, _ = process_page_data(BLOG_INDEX_TEMPLATE_PATH)
    blog_items_str = ""

    for metadata in blog_metadata:
        better_title = metadata.title.removesuffix(" - Kevin Brennan")
        blog_item = BLOG_ITEM_STR.replace("%%TITLE%%", better_title)
        blog_item = blog_item.replace("%%DESCRIPTION%%", metadata.description)
        blog_item = blog_item.replace("%%DATE%%", metadata.date)
        blog_item = blog_item.replace("%%PATH%%", f"/blog/{metadata.url_title}")

        blog_items_str += blog_item

    page_text = page_text.replace("%%BLOG_ITEMS%%", blog_items_str)

    write_page(Path("./blog/index.html"), page_text)


if __name__ == "__main__":
    main()
