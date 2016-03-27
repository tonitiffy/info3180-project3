import requests
import BeautifulSoup
import urlparse

url = "http://www.amazon.com/gp/product/B00THKEKEQ/ref=s9_ri_gw_g421_i1_r?ie=UTF8&fpl=fresh&pf_rd_m=ATVPDKIKX0DER&pf_rd_s=desktop-4&pf_rd_r=1WEK74K6Y8MXQC6BSHDN&pf_rd_t=36701&pf_rd_p=2437869562&pf_rd_i=desktop"
result = requests.get(url)
soup = BeautifulSoup.BeautifulSoup(result.text)
og_image = (soup.find('meta', property='og:image') or soup.find('meta', attrs={'name': 'og:image'}))

if og_image and og_image['content']:
    print og_image['content']

thumbnail_spec = soup.find('link', rel='image_src')
if thumbnail_spec and thumbnail_spec['href']:
    print thumbnail_spec['href']

def image_dem():
    image = """<img src="%s"><br />"""
    for img in soup.findAll("img", src=True):
       if "sprite" not in img["src"]:
           print image % urlparse.urljoin(url, img["src"])

image_dem()
