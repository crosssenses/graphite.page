import xml.etree.cElementTree as ET
import json
import os
from pprint import pprint
from urllib.request import urlopen
from bs4 import BeautifulSoup
from datetime import datetime

dir = os.path.abspath(os.path.join(os.path.dirname(__file__),".."))

RUNS = 1

def generate_sitemap(ps):

    # Build sitemap xml
    schema_loc = ("http://www.sitemaps.org/schemas/sitemap/0.9 "
                  "http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd")

    root = ET.Element("urlset")
    root.attrib['xmlns:xsi'] = 'http://www.w3.org/2001/XMLSchema-instance'
    root.attrib['xsi:schemaLocation'] = schema_loc
    root.attrib['xmlns'] = "http://www.sitemaps.org/schemas/sitemap/0.9"

    # Add homepage to sitemap
    _url = "https://graphite.page/"  # <-- Your website domain.
    dt = datetime.now().strftime("%Y-%m-%d")  # <-- Get current date and time.

    doc = ET.SubElement(root, "url")
    ET.SubElement(doc, "loc").text = _url
    ET.SubElement(doc, "lastmod").text = dt
    ET.SubElement(doc, "changefreq").text = 'weekly'
    ET.SubElement(doc, "priority").text = "0.5"

    # Add graphite pages from JSON
    for p in ps:
        doc = ET.SubElement(root, "url")
        ET.SubElement(doc, "loc").text = p['url']
        ET.SubElement(doc, "lastmod").text = p['date']
        ET.SubElement(doc, "changefreq").text = 'monthly'
        ET.SubElement(doc, "priority").text = '0.8'

    # Write sitemap.xml
    tree = ET.ElementTree(root)
    tree.write("sitemap.xml",
        encoding='utf-8', xml_declaration=True)

def generate_json(sd):

    pages = initiate_directory(sd)
    
    add_titles(pages)
    add_urls(pages)
    add_meta(pages)
    add_dates(pages)

    # pprint(pages)

    # Directly from dictionary
    with open('_assets/pages_data.json', 'w') as outfile:
        json.dump(pages, outfile)

    return pages

def run_os_scandir():
    for i in range(RUNS):
        fu = [{'path': f.path, 'name': f.name} for f in os.scandir(dir) if f.is_dir()]
    # print(f"os.scandir\t\tfound dirs: {len(fu)} \n {fu}")
    return fu

def initiate_directory(fo):
    f_ = [e for e in fo if '_' not in e['name']]
    fg = [e for e in f_ if '.git' not in e['path']]
    return [e for e in fg if 'static' not in e['path']]

def get_index_html(p):
    filename="index.html"
    page = open(os.path.join(p,filename))
    return BeautifulSoup(page, 'html.parser').html
    
def add_titles(p):
    
    for pi in p:
        html = get_index_html(pi['path'])

        title = " ".join(str(html.head.title.string).split())
        pi['title'] = title
        # print(f"\t{title}")
        
    # pprint(p)


def add_urls(p):
    
    for pi in p:
        url = "https://graphite.page/" + str(pi['name'])
        pi['url'] = url
        # print(f"\t{url}")
        
    # pprint(p)

def add_dates(p):
    
    for pi in p:
        timestamp = os.path.getmtime(pi['name'])
        date = datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d')
        pi['date'] = date

    # pprint(p)


def add_meta(p):
    
    for pi in p:
        html = get_index_html(pi['path'])

        subtitle = html.find('meta', property="og:description")['content']
        pi['subtitle'] = subtitle
        # print(f"\t{subtitle}")

        image = html.find('meta', property="og:image")['content']
        pi['image'] = image

        authors = html.body.find('p', attrs={'class':'author'})
        # authors = " ".join(str(html.find_all('p', attrib={'class':'author'}).string).split())
        if authors:
            pi['authors'] = authors.string
        
    # pprint(p)

if __name__ == '__main__':
    
    # Scan directory
    f=run_os_scandir()
    
    # Generate JSON
    json = generate_json(f)

    # Generate Sitemap
    generate_sitemap(json)

