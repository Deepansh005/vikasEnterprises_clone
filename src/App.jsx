import { Fragment, useEffect, useState } from 'react';
import { contact, homeProducts, homeSlides, partners, productLinks, products } from './data';
import { loadItems, loadRecords, saveItems } from './enquiryStorage';
import { api } from './api';
import { EnquiryDetailPage, EnquiryManagementPage } from './EnquiryManagement';

const asset = (name) => `/assets/${name}`;
const productIdFor = (category, index) => `${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`;

function Link({ href, children, className = '', onClick }) {
  return <a className={className} href={href} onClick={onClick}>{children}</a>;
}

function Header({ path, enquiryCount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  useEffect(() => { setMenuOpen(false); setProductsOpen(false); }, [path]);
  return <>
    <div className="utility-bar"><div className="site-width utility-content"><span>âŒ– {contact.address}</span><span>â˜Ž <a href={`tel:${contact.phone}`}>{contact.phone}</a></span><span>âœ‰ <a href={`mailto:${contact.email}`}>{contact.email}</a></span></div></div>
    <header className="site-header"><div className="site-width header-content">
      <Link href="/" className="brand"><img src={asset('new-vikas-enterprises-logo.jpg')} alt="Vikas Enterprises" /></Link>
      <button className="menu-button" type="button" aria-label="Toggle navigation" onClick={() => setMenuOpen((open) => !open)}>â˜°</button>
      <nav className={menuOpen ? 'main-nav open' : 'main-nav'}>
        <Link href="/" className={path === '/' ? 'active' : ''}>HOME</Link>
        <Link href="/about-us/" className={path === '/about-us/' ? 'active' : ''}>ABOUT US</Link>
        <div className="products-nav">
          <button type="button" aria-expanded={productsOpen} className={path in products ? 'active' : ''} onClick={() => setProductsOpen((open) => !open)}>PRODUCTS <span>âŒ„</span></button>
          {productsOpen && <div className="products-menu">{productLinks.map((item) => <Link key={item.path} href={item.path}>{item.label}</Link>)}</div>}
        </div>
        <Link href="/channel-partners/" className={path === '/channel-partners/' ? 'active' : ''}>CHANNEL PARTNERS</Link>
        <Link href="/contact-us/" className={path === '/contact-us/' ? 'active' : ''}>CONTACT US</Link>
        <Link href="/request-a-quote/" className={path === '/request-a-quote/' ? 'quote-link active' : 'quote-link'}>ENQUIRY ({enquiryCount})</Link>
      </nav>
    </div></header>
  </>;
}

function PageBanner({ title }) { return <div className="page-banner"><div className="site-width"><h1>{title}</h1></div></div>; }

function Footer() {
  return <footer className="site-footer"><div className="site-width footer-grid">
    <section><h3>Introduction</h3><p>â€œVikas Enterprisesâ€ led by professionals, specialized in supplying Different Industrial consumable items such as Internationally approved Brands of Cable ties, Cable Glands, Closed-End Connectors, Terminal, Wrapping Bands, Markers, Others Electrical, Electronic, Adhesive, and Abrasive items too.</p></section>
    <section><h3>Our Products</h3>{productLinks.map((item) => <Link key={item.path} href={item.path}>{item.label}</Link>)}</section>
    <section><h3>Contact Details</h3><p>Address:<br />{contact.address}</p><p>Branch Office:<br />{contact.branch}</p><p>Contact No.:<br />{contact.phone}</p><p>E-mail:<br />{contact.email}</p></section>
    <div className="footer-title">Vikas Enterprises</div>
  </div></footer>;
}

function ProductSection({ item, index, category, onAdd, catalogueProducts }) {
  const [title, specs, image] = item;
  const images = Array.isArray(image) ? image : [image];
  const productId = productIdFor(category, index);
  const selectable = !catalogueProducts.length || catalogueProducts.some((product) => product.id === productId && !product.archived);
  return <section className={`product-row ${index % 3 === 2 ? 'blue-row' : ''}`}><div className="site-width product-inner"><div className="product-copy"><h2>{title}</h2>{specs.map((line) => <p key={line}>{line}</p>)}<button className="enquiry-button" type="button" disabled={!selectable} onClick={() => onAdd({ id: productId, productId, name: title, category, path: window.location.pathname, image: images[0], sku: '' })}>{selectable ? 'Add to Enquiry' : 'Unavailable'}</button></div><div className="product-images">{images.map((name) => <img key={name} src={asset(name)} alt={title} onError={(event) => { event.currentTarget.hidden = true; }} />)}</div></div></section>;
}

function ProductPage({ page, category, onAdd, catalogueProducts }) { return <><PageBanner title={page.title} /><main className="product-list">{page.sections.map((item, index) => <ProductSection key={item[0]} item={item} index={index} category={category} onAdd={onAdd} catalogueProducts={catalogueProducts} />)}</main></>; }

function Home() {
  const [slide, setSlide] = useState(0);
  useEffect(() => { const timer = setInterval(() => setSlide((value) => (value + 1) % homeSlides.length), 4500); return () => clearInterval(timer); }, []);
  return <main>
    <section className="feature-strip"><div className="site-width feature-grid">{['Material Quality', 'Range Availability', 'Tensile Strength', 'Colour Availability'].map((label, index) => <div key={label}><span className="feature-icon">{['â—‰', 'â—Œ', 'âŒ', 'â—'][index]}</span><strong>{label}</strong></div>)}</div></section>
    <section className="home-intro site-width"><div><p className="eyebrow">VIKAS ENTERPRISES</p><h1>Vikas Enterprises wholesaler &amp; supplier wiring accessories</h1><p>â€œVikas Enterprisesâ€ led by professionals, specialized in supplying Different Industrial consumable items such as Internationally approved Brands of Cable ties, Cable Glands, Closed-End Connectors, Terminal, Wrapping Bands, Markers, Others Electrical, Electronic, Adhesive, and Abrasive items too.</p><Link href="/about-us/" className="learn-more">learn more</Link></div><div className="hero-slider"><img src={asset(homeSlides[slide])} alt="Industrial wiring accessories" /><div className="slider-dots">{homeSlides.map((_, index) => <button key={index} type="button" className={index === slide ? 'selected' : ''} onClick={() => setSlide(index)} aria-label={`Show slide ${index + 1}`} />)}</div></div></section>
    <section className="home-section"><div className="site-width"><h2 className="section-title">OUR PRODUCTS</h2><div className="home-products">{homeProducts.map((item) => <article key={item.path}><Link href={item.path}><h3>{item.label}</h3><img src={item.image} alt={item.label} /><span>learn more â†’</span></Link></article>)}</div></div></section>
    <section className="home-section partners-preview"><div className="site-width"><h2 className="section-title">OUR CHANNEL PARTNERS</h2><div className="partner-preview-grid">{partners.map((partner) => <article key={partner.name}><img src={asset(partner.image)} alt={partner.name} /><h3>{partner.name}</h3><p>{partner.text.slice(0, 180)}...</p></article>)}</div></div></section>
  </main>;
}

function About() { return <><PageBanner title="About Us" /><main className="text-page site-width"><p>â€œVikas Enterprisesâ€ led by professionals, specialized in supplying Different Industrial consumable items such as Internationally approved Brands of Cable ties, Cable Glands, Closed-End Connectors, Terminal, Wrapping Bands, Markers, Others Electrical, Electronic, Adhesive, and Abrasive items too.</p><p>We are located in Azad Market/ Bhagirath Palace, New Delhi, India and have prestigious clients all over the country. Our strength lies in superior quality products, competitive prices and delivery on time. We source quality products from reputed manufacturers based in India and Abroad. We believe in prolonged existence and seek long term relationships with our customers and accordingly organize a well streamlined procurement and distribution system, so as to grow together.</p><p>We â€œVikas Enterprisesâ€ are one of the leading wholesaler, supplier, manufacture and trader of a wide range of Electrical products, control panel accessories and wiring accessories. These abide by national &amp; international quality standards.</p><p>Our product range includes nylon cable ties, stainless steel cable ties, cable marker/ferrules, tie mount/tie base, spiral winding, PVC sleeves, silicon sleeves, heat shrinkable sleeves, marking/ferrules sleeves, copper tube end cap, cable clip, cable tie tools, fasteners, PG cable glands, copper lugs, glass fuse, rubber band and panel accessories.</p><div className="about-labels"><h2>BUSINESS TYPE</h2><p>â€¢ Trader<br />â€¢ Supplier<br />â€¢ Distributar<br />â€¢ Manufacturer</p><h2>OWNERSHIP &amp; CAPITAL</h2><h2>LEGAL PROFILE</h2><h2>WHY US ?</h2></div></main></>; }

function Partners() { return <><PageBanner title="Channel Partners" /><main className="partner-list">{partners.map((partner, index) => <section className={index % 2 ? 'partner-row blue-row' : 'partner-row'} key={partner.name}><div className="site-width"><h2>{partner.name}</h2><img src={asset(partner.image)} alt={partner.name} /><p>{partner.text}</p></div></section>)}</main></>; }

function QuoteForm({ items, onSubmitted }) {
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [saving, setSaving] = useState(false);
  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const required = ['firstName', 'lastName', 'business', 'phone', 'email', 'message'];
    const missing = required.some((field) => !String(form.get(field) || '').trim());
    const email = String(form.get('email') || '');
    if (missing) { setError('Please complete all required fields.'); return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError('Enter a valid email address.'); return; }
    if (!items.length) { setError('Add at least one product to your enquiry.'); return; }
    setSaving(true);
    try {
      const record = await api.submitEnquiry({ customer: { firstName: form.get('firstName').trim(), lastName: form.get('lastName').trim(), business: form.get('business').trim(), phone: form.get('phone').trim(), email, message: form.get('message').trim() }, items: items.map((item) => ({ productId: item.productId || item.id, name: item.name, quantity: Number(item.quantity) })) });
      onSubmitted(record);
      setError('');
      setConfirmation(record);
      event.currentTarget.reset();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }
  if (confirmation) return <div className="confirmation"><h2>Demo enquiry created</h2><p>Your local demonstration enquiry reference is:</p><strong>{confirmation.reference}</strong><p>No email was sent and no company backend was contacted.</p><Link href="/demo-admin/enquiries/" className="action-link">Open demo dashboard</Link></div>;
  return <form className="quote-form" onSubmit={submit} noValidate><div className="form-two"><label>First name *<input name="firstName" /></label><label>Last name *<input name="lastName" /></label></div><label>Business name *<input name="business" /></label><label>Contact number *<input name="phone" type="tel" /></label><label>Email *<input name="email" type="email" /></label><label>Message or additional requirements *<textarea name="message" rows="5" /></label><button className="primary-action" type="submit" disabled={saving}>{saving ? 'Savingâ€¦' : 'Create Demo Enquiry'}</button>{error && <p className="form-error">{error}</p>}</form>;
}

function QuotePage({ items, onQuantity, onRemove, onClear, onSubmitted }) {
  return <><PageBanner title="Request a Quote" /><main className="quote-page site-width"><div className="demo-note">Local demonstration workflow. Prices are not published by the source website; all products are Contact for Pricing.</div><section className="quote-layout"><div><div className="quote-heading"><h2>Selected Products</h2>{items.length > 0 && <button className="text-action" type="button" onClick={onClear}>Clear enquiry</button>}</div>{items.length === 0 ? <div className="empty-state"><h3>Your enquiry is empty</h3><p>Browse the product categories and add products to build a quotation enquiry.</p><Link href="/cable-ties/" className="action-link">Browse products</Link></div> : <div className="quote-items">{items.map((item) => <article className="quote-item" key={item.id}><img src={asset(item.image)} alt="" /><div><h3>{item.name}</h3><p>{item.category}</p><span>Contact for Pricing</span></div><label>Qty<input type="number" min="1" max="99999" value={item.quantity} onChange={(event) => onQuantity(item.id, event.target.value)} /></label><button className="remove-action" type="button" onClick={() => onRemove(item.id)} aria-label={`Remove ${item.name}`}>Remove</button></article>)}</div>}</div><div><h2>Customer Enquiry</h2><QuoteForm items={items} onSubmitted={onSubmitted} /></div></section></main></>;
}
function ProductAdminPage() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [message, setMessage] = useState('');
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  useEffect(() => { api.products(true).then(setItems).catch((error) => setMessage(error.message)); }, []);
  const visible = items.filter((item) => (showArchived || !item.archived) && `${item.name} ${item.category}`.toLowerCase().includes(query.toLowerCase()));
  async function archive(item) { if (!window.confirm(`Archive ${item.name}?`)) return; const updated = await api.archiveProduct(item.id, !item.archived); setItems((current) => current.map((entry) => entry.id === updated.id ? updated : entry)); }
  async function saveName(item) { if (!editingName.trim()) return; const updated = await api.updateProduct(item.id, { name: editingName.trim() }); setItems((current) => current.map((entry) => entry.id === updated.id ? updated : entry)); setEditingId(null); setMessage('Product updated.'); }
  async function addDemoProduct(event) { event.preventDefault(); if (!newName.trim()) return; const created = await api.createProduct({ name: newName.trim(), category: 'Demonstration Product', categoryPath: '/demo-products/', specifications: [], image: '' }); setItems((current) => [...current, created]); setNewName(''); setMessage('Demonstration product added.'); }
  return <><PageBanner title="Demo Product Management" /><main className="admin-page site-width"><div className="demo-note">Demo interface only. Verified public catalogue records are marked separately from administrator-created demonstration products.</div><div className="admin-toolbar"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" /><label className="checkbox-label"><input type="checkbox" checked={showArchived} onChange={(event) => setShowArchived(event.target.checked)} /> Show archived</label></div><form className="demo-product-form" onSubmit={addDemoProduct}><input value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="New demonstration product name" aria-label="New demonstration product name" /><button className="primary-action" type="submit">Add product</button></form>{message && <p className="form-success">{message}</p>}<div className="admin-table">{visible.map((item) => <div className="admin-row product-admin-row" key={item.id}>{editingId === item.id ? <input value={editingName} onChange={(event) => setEditingName(event.target.value)} aria-label={`Edit ${item.name}`} /> : <strong>{item.name}</strong>}<span>{item.category}</span><span>{item.source}</span><span>{item.archived ? 'Archived' : 'Active'}</span>{editingId === item.id ? <button className="text-action" type="button" onClick={() => saveName(item)}>Save</button> : <button className="text-action" type="button" onClick={() => { setEditingId(item.id); setEditingName(item.name); }}>Edit</button>}<button className="text-action" type="button" onClick={() => archive(item)}>{item.archived ? 'Restore' : 'Archive'}</button></div>)}</div></main></>;
}

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  function submit(event) { event.preventDefault(); const form = new FormData(event.currentTarget); if (!form.get('firstName') || !form.get('lastName') || !form.get('phone') || !form.get('email') || !form.get('message')) { setError('Please complete all required fields.'); setSubmitted(false); return; } setError(''); setSubmitted(true); event.currentTarget.reset(); }
  return <><PageBanner title="Contact Us" /><main className="contact-page site-width"><section><h2>Contact Details</h2><p>Address: {contact.address}</p><p>Branch Office: {contact.branch}</p><p>Contact No.: {contact.phone}</p><p>E-mail: {contact.email}</p></section><section><h2>Contact Form</h2><form onSubmit={submit} noValidate><label>Name <em>*</em></label><div className="name-fields"><input name="firstName" placeholder="First" /><input name="lastName" placeholder="Last" /></div><label>Contact No. <em>*</em></label><input name="phone" type="tel" /><label>Email <em>*</em></label><input name="email" type="email" /><label>Message <em>*</em></label><textarea name="message" rows="4" /><button type="submit">Submit</button>{error && <p className="form-error">{error}</p>}{submitted && <p className="form-success">Demo confirmation: your message was accepted locally. No email was sent.</p>}</form></section></main></>;
}

function App() {
  const [path, setPath] = useState(window.location.pathname.endsWith('/') ? window.location.pathname : `${window.location.pathname}/`);
  const [enquiryItems, setEnquiryItems] = useState(loadItems);
  const [records, setRecords] = useState(loadRecords);
  const [catalogueProducts, setCatalogueProducts] = useState([]);
  const [apiError, setApiError] = useState('');
  useEffect(() => { saveItems(enquiryItems); }, [enquiryItems]);
  useEffect(() => { api.enquiries().then((remoteRecords) => { setRecords(remoteRecords); setApiError(''); }).catch((error) => setApiError(error.message)); }, []);
  useEffect(() => { api.products().then(setCatalogueProducts).catch(() => setCatalogueProducts([])); }, []);
  function addToEnquiry(item) { setEnquiryItems((current) => { const existing = current.find((entry) => entry.id === item.id); return existing ? current.map((entry) => entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry) : [...current, { ...item, quantity: 1 }]; }); }
  function updateQuantity(id, value) { const quantity = Math.max(1, Math.min(99999, Number(value) || 1)); setEnquiryItems((current) => current.map((item) => item.id === id ? { ...item, quantity } : item)); }
  function removeItem(id) { setEnquiryItems((current) => current.filter((item) => item.id !== id)); }
  async function updateStatus(id, nextStatus) { try { const updated = await api.updateEnquiryStatus(id, nextStatus); setRecords((current) => current.map((record) => record.id === updated.id ? updated : record)); setApiError(''); } catch (error) { setApiError(error.message); } }
  function clearEnquiry() { setEnquiryItems([]); }
  function submittedEnquiry(record) { setEnquiryItems([]); setRecords((current) => [record, ...current]); }
  function refreshRecords() { api.enquiries().then(setRecords).catch((error) => setApiError(error.message)); }
  const detailMatch = path.match(/^\/admin\/enquiries\/([^/]+)\/?$/);
  let content = path === '/' ? <Home /> : path === '/about-us/' ? <About /> : path === '/channel-partners/' ? <Partners /> : path === '/contact-us/' ? <ContactPage /> : path === '/request-a-quote/' ? <QuotePage items={enquiryItems} onQuantity={updateQuantity} onRemove={removeItem} onClear={clearEnquiry} onSubmitted={submittedEnquiry} /> : detailMatch ? <EnquiryDetailPage enquiryId={decodeURIComponent(detailMatch[1])} onStatus={(updated) => setRecords((current) => current.map((record) => record.id === updated.id ? updated : record))} onRefresh={refreshRecords} /> : path === '/admin/enquiries/' || path === '/demo-admin/enquiries/' ? <EnquiryManagementPage records={records} onStatus={updateStatus} /> : path === '/admin/products/' ? <ProductAdminPage /> : products[path] ? <ProductPage page={products[path]} category={products[path].title} onAdd={addToEnquiry} catalogueProducts={catalogueProducts} /> : <><PageBanner title="Page Not Found" /><main className="text-page site-width"><p>The requested page could not be found.</p></main></>;
  return <><Header path={path} enquiryCount={enquiryItems.length} />{apiError && (path.startsWith('/admin/') || path.startsWith('/demo-admin/')) && <div className="api-error site-width">API unavailable: {apiError}</div>}<Fragment key={path}>{content}</Fragment><Footer /></>;
}

export default App;
