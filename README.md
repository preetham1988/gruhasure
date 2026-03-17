# Namma HomeCheck — Bangalore Home Inspection Website

A professional, multi-page marketing website for home inspection services in Bangalore, Karnataka.

## Pages

| File | Description |
|------|-------------|
| `index.html` | Homepage with hero, services preview, testimonials |
| `services.html` | Detailed breakdown of all 6 services |
| `book.html` | Inspection enquiry/booking form |
| `about.html` | About the company, team, areas covered |
| `faq.html` | Accordion FAQ page |
| `contact.html` | Contact form + contact details |

---

## 🚀 Step-by-Step: Git + Hosting Setup

### Step 1 — Install Prerequisites

- [Git](https://git-scm.com/downloads)
- A [GitHub](https://github.com) account (free)

---

### Step 2 — Initialize Git Locally

Open a terminal in the project folder and run:

```bash
git init
git add .
git commit -m "Initial commit: Namma HomeCheck website"
```

---

### Step 3 — Push to GitHub

1. Go to [github.com/new](https://github.com/new)
2. Create a new repository named `namma-homecheck` (keep it public for free hosting)
3. Do NOT initialize with README (you already have one)
4. Copy the commands GitHub shows you, e.g.:

```bash
git remote add origin https://github.com/YOUR_USERNAME/namma-homecheck.git
git branch -M main
git push -u origin main
```

---

### Step 4 — Host for FREE on GitHub Pages

1. On your GitHub repo page, go to **Settings → Pages**
2. Under **Source**, select `Deploy from a branch`
3. Select branch: `main`, folder: `/ (root)`
4. Click **Save**
5. Wait ~2 minutes. Your site will be live at:
   `https://YOUR_USERNAME.github.io/namma-homecheck/`

---

### Step 5 — Custom Domain (Optional but Recommended)

Buy a domain like `nammahomecheck.in` from [GoDaddy](https://godaddy.com) or [Namecheap](https://namecheap.com) (~₹800/year).

**Point domain to GitHub Pages:**
1. In your domain registrar, add these DNS records:

```
Type  Name  Value
A     @     185.199.108.153
A     @     185.199.109.153
A     @     185.199.110.153
A     @     185.199.111.153
CNAME www   YOUR_USERNAME.github.io
```

2. In GitHub repo **Settings → Pages**, enter your custom domain (e.g. `nammahomecheck.in`)
3. Check **Enforce HTTPS**
4. DNS propagation takes 24–48 hours

---

### Step 6 — Connect Real Contact Forms

The forms currently run in demo mode. To make them actually send emails, use **Formspree** (free tier: 50 submissions/month):

1. Go to [formspree.io](https://formspree.io) and create a free account
2. Create a new form → copy your form endpoint URL (looks like `https://formspree.io/f/xabcdefg`)
3. In `js/main.js`, replace the `setTimeout` block with a real fetch:

```javascript
// Replace the setTimeout simulation with this:
fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  body: new FormData(form),
  headers: { 'Accept': 'application/json' }
}).then(response => {
  if (response.ok) {
    form.style.display = 'none';
    if (success) success.style.display = 'block';
  }
}).catch(() => {
  btn.textContent = 'Error. Try again.';
  btn.disabled = false;
});
```

For higher volume, consider **Web3Forms** (free, no account required):
1. Get a free access key at [web3forms.com](https://web3forms.com)
2. Similar fetch-based integration

---

### Step 7 — WhatsApp Click-to-Chat

Update the WhatsApp phone number in all HTML files:

Search for: `wa.me/919876543210`
Replace with: `wa.me/91YOURNUMBER`

Also update `tel:+919876543210` with your actual number.

---

### Step 8 — SEO Basics

Update these in every HTML `<head>`:

```html
<meta name="description" content="Your custom description for each page"/>
```

Also submit your sitemap to [Google Search Console](https://search.google.com/search-console/):
1. Add your property (domain)
2. Submit sitemap URL: `https://yourdomain.in/sitemap.xml`

---

### Step 9 — Google Analytics (Optional)

1. Create a [Google Analytics 4](https://analytics.google.com) property
2. Get your Measurement ID (e.g. `G-XXXXXXXXXX`)
3. Add this before `</head>` in every HTML file:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 📂 Project Structure

```
namma-homecheck/
├── index.html          # Homepage
├── services.html       # All services
├── book.html           # Booking/enquiry form
├── about.html          # About us
├── faq.html            # FAQs
├── contact.html        # Contact form
├── css/
│   └── style.css       # All styles
├── js/
│   └── main.js         # Interactions, forms, animations
└── README.md           # This file
```

---

## 🔧 Customization Checklist

- [ ] Replace `Namma HomeCheck` with your actual business name
- [ ] Update phone number: `+91 98765 43210`
- [ ] Update email: `hello@nammahomecheck.in`
- [ ] Add your actual logo (replace the `⬡` icon + text)
- [ ] Update testimonials with real client stories
- [ ] Add real statistics (inspections done, years, etc.)
- [ ] Connect contact forms to Formspree/Web3Forms
- [ ] Add Google Analytics
- [ ] Set up custom domain

---

## 🆓 100% Free Hosting Stack

| Service | Purpose | Cost |
|---------|---------|------|
| GitHub Pages | Website hosting | Free |
| Formspree | Contact form emails | Free (50/mo) |
| Namecheap / GoDaddy | Domain name | ~₹800/yr |
| Google Analytics | Traffic tracking | Free |
| Cloudflare | DNS + CDN + HTTPS | Free |

Total first-year cost: **~₹800** (just the domain name)
