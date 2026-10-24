import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, MotionConfig, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Heart, Menu, Minus, Plus, Search, ShoppingBag, X, Check, Coffee, Home, UtensilsCrossed, MapPin, BookOpen } from 'lucide-react';
import './styles.css';

const u = (id, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
const photos = {
  hero: u('photo-1442512595331-e89e73853f31', 1400), latte: u('photo-1534778101976-62847782c213'),
  mocha: u('photo-1509042239860-f550ce710b93'), toastie: u('photo-1528735602780-2552fd46c7af'),
  matcha: u('photo-1515823064-d6e0c04616a7'), cake: u('photo-1578985545062-69928b1d9587'),
  cold: u('photo-1461023058943-07fcbe16d735', 1200), pour: u('photo-1495474472287-4d71bcdd2085', 1200),
  espresso: u('photo-1510707577719-ae7c14805e3a'), croissant: u('photo-1555507036-ab1f4038808a')
};
const products = [
  { id: 1, name: 'Velvet Flat White', type: 'Coffee', desc: 'Double espresso, silky oat milk', price: 4.2, rating: '4.9', tag: 'House favourite', image: photos.latte },
  { id: 7, name: 'Ristretto Doppio', type: 'Coffee', desc: 'Short, dense, caramel finish', price: 3.4, rating: '4.8', tag: 'Single origin', image: photos.espresso },
  { id: 2, name: 'Midnight Mocha', type: 'Coffee', desc: 'Dark chocolate, rich espresso', price: 4.8, rating: '4.8', tag: 'Indulgent', image: photos.mocha },
  { id: 6, name: 'Honey Oat Cold Brew', type: 'Drinks', desc: '18-hour steep, wildflower honey', price: 4.4, rating: '4.9', tag: 'Chilled', image: photos.cold },
  { id: 4, name: 'Cloud Matcha', type: 'Drinks', desc: 'Ceremonial matcha, soft foam', price: 4.6, rating: '4.9', tag: 'Slow morning', image: photos.matcha },
  { id: 8, name: 'Butter Croissant', type: 'Bites', desc: 'Laminated over three days', price: 3.2, rating: '4.9', tag: 'Baked at 6 am', image: photos.croissant },
  { id: 3, name: 'Garden Club Toastie', type: 'Bites', desc: 'Herby greens, aged cheddar', price: 6.5, rating: '4.7', tag: 'Made to order', image: photos.toastie },
  { id: 5, name: 'Sunday Crumb Cake', type: 'Sweet things', desc: 'Brown butter, vanilla bean', price: 3.9, rating: '4.8', tag: 'Baked in-house', image: photos.cake }
];
const categories = ['Everything', 'Coffee', 'Drinks', 'Bites', 'Sweet things'];
const ease = [0.22, 1, 0.36, 1];
const money = (n) => `$${n.toFixed(2)}`;

function Img({ src, alt, className, eager, style }) {
  const [bad, setBad] = useState(false);
  return bad ? <div className={`img-fallback ${className || ''}`} role="img" aria-label={alt} /> :
    <img className={className} style={style} src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setBad(true)} />;
}
function Reveal({ children, className, delay = 0 }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .8, ease, delay }}>{children}</motion.div>;
}
function Unveil({ children, className }) {
  const v = { hidden: { clipPath: 'inset(0 0 100% 0)' }, show: { clipPath: 'inset(0 0 0% 0)', transition: { duration: 1.2, ease } } };
  return <motion.div className={className} initial="hidden" whileInView="show" viewport={{ once: true, amount: .15 }}><motion.div className="unveil" variants={v}>{children}</motion.div></motion.div>;
}
function useLock(on, close) {
  useEffect(() => {
    if (!on) return;
    const k = (e) => e.key === 'Escape' && close();
    document.body.style.overflow = 'hidden'; window.addEventListener('keydown', k);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', k); };
  }, [on, close]);
}

function Hero({ goTo }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '10%']);
  const rise = { hidden: { y: '110%' }, show: { y: 0, transition: { duration: 1, ease } } };
  const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: .8, ease } } };
  return <section className="hero wrap" ref={ref} id="home">
    <motion.div initial="hidden" animate="show" transition={{ staggerChildren: .14, delayChildren: .1 }}>
      <motion.div className="hero-photo ph" variants={{ hidden: { clipPath: 'inset(100% 0 0 0)' }, show: { clipPath: 'inset(0% 0 0 0)', transition: { duration: 1.3, ease } } }}>
        <motion.div className="hero-photo-inner" style={{ y }}><Img eager src={photos.hero} alt="Barista pouring coffee in a sunlit café" /></motion.div>
        <h1><span className="h1-clip"><motion.span variants={rise}>Coffee,</motion.span></span><span className="h1-clip"><motion.i variants={rise}>poured slowly.</motion.i></span></h1>
      </motion.div>
      <motion.div className="hero-foot" variants={fade}>
        <p>Small-batch roasts, pastry from our own oven, and a corner table with your name on it.</p>
        <div className="cta-row"><button className="btn btn-primary" onClick={() => goTo('menu', 'Menu')}>Explore the Menu <ArrowRight size={16} /></button><button className="btn btn-quiet" onClick={() => goTo('story', 'Story')}>Discover Our Story</button></div>
      </motion.div>
    </motion.div>
  </section>;
}

function Card({ p, feature, saved, onSave, onAdd }) {
  return <motion.article layout className={`card ${feature ? 'card-feature' : ''}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} exit={{ opacity: 0 }} transition={{ duration: .7, ease }}>
    <div className="card-photo ph">
      <Img src={p.image} alt={p.name} />
      <button className={`fav ${saved ? 'on' : ''}`} aria-pressed={saved} aria-label={saved ? `Remove ${p.name} from favourites` : `Save ${p.name} to favourites`} onClick={() => onSave(p.id)}><Heart size={17} fill={saved ? 'currentColor' : 'none'} /></button>
    </div>
    <div className="card-body">
      <p className="card-kind">{p.type}, {p.tag.toLowerCase()}</p>
      <h3>{p.name}</h3>
      <p className="card-desc">{p.desc}</p>
      <div className="card-foot"><b className="price">{money(p.price)}</b><motion.button whileTap={{ scale: .94 }} className="add" aria-label={`Add ${p.name} to bag`} onClick={() => onAdd(p.id)}><Plus size={16} />Add</motion.button></div>
    </div>
  </motion.article>;
}

function App() {
  const [category, setCategory] = useState('Everything');
  const [cart, setCart] = useState({});
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [saved, setSaved] = useState([]);
  const [notice, setNotice] = useState('');
  const [tab, setTab] = useState('Home');
  const timer = useRef();
  const count = Object.values(cart).reduce((s, n) => s + n, 0);
  const total = products.reduce((s, p) => s + p.price * (cart[p.id] || 0), 0);
  const filtered = useMemo(() => products.filter(p => (category === 'Everything' || p.type === category) && (p.name + p.desc + p.type).toLowerCase().includes(search.trim().toLowerCase())), [category, search]);
  const say = (m) => { setNotice(m); clearTimeout(timer.current); timer.current = setTimeout(() => setNotice(''), 2000); };
  const add = (id) => { setCart(o => ({ ...o, [id]: (o[id] || 0) + 1 })); say('Added to your bag'); };
  const qty = (id, d) => setCart(o => { const n = { ...o, [id]: Math.max(0, (o[id] || 0) + d) }; if (!n[id]) delete n[id]; return n; });
  const save = (id) => setSaved(o => o.includes(id) ? o.filter(x => x !== id) : [...o, id]);
  const goTo = (id, t) => { setTab(t); setMenuOpen(false); setCartOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const closeMenu = () => setMenuOpen(false), closeCart = () => setCartOpen(false);
  useLock(menuOpen, closeMenu); useLock(cartOpen, closeCart);
  const lead = !search.trim() && category === 'Everything' ? filtered[0] : null;
  const rest = lead ? filtered.slice(1) : filtered;
  const reset = () => { setCategory('Everything'); setSearch(''); };

  return <MotionConfig reducedMotion="user"><div className="shell">
    <header className="top"><div className="wrap top-in">
      <button className="icon-btn menu-btn" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu size={20} /></button>
      <a className="logo" href="#home" aria-label="VYRA Coffee House, home">Vyra<span className="logo-dot" /></a>
      <nav className="nav" aria-label="Primary"><button onClick={() => goTo('menu', 'Menu')}>Menu</button><button onClick={() => goTo('story', 'Story')}>Our story</button><button onClick={() => goTo('visit', 'Visit')}>Visit</button></nav>
      <button className="bag" onClick={() => setCartOpen(true)} aria-label={`Open bag, ${count} items`}><ShoppingBag size={18} /><span className="bag-text">Bag</span><motion.span key={count} className="bag-count" initial={{ scale: 1.35 }} animate={{ scale: 1 }} transition={{ duration: .35, ease }}>{count}</motion.span></button>
    </div></header>

    <main>
      <Hero goTo={goTo} />

      <section className="menu wrap" id="menu" aria-labelledby="menu-h">
        <Reveal className="menu-head"><h2 id="menu-h">Today at the counter</h2><p>Pulled, poured and baked this morning. Prices in dollars, demo only.</p></Reveal>
        <div className="tools">
          <label className="search"><Search size={18} aria-hidden="true" /><span className="sr">Search the menu</span><input type="search" placeholder="Search flat white, croissant…" value={search} onChange={e => setSearch(e.target.value)} />{search && <button type="button" aria-label="Clear search" onClick={() => setSearch('')}><X size={16} /></button>}</label>
          <div className="chips" role="group" aria-label="Filter by category">{categories.map(c => <button key={c} aria-pressed={category === c} className={`chip ${category === c ? 'on' : ''}`} onClick={() => setCategory(c)}>{category === c && <motion.span layoutId="chip" className="chip-bg" transition={{ duration: .4, ease }} />}<span className="chip-t">{c}</span></button>)}</div>
        </div>
        <p className="count" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'item' : 'items'}{saved.length > 0 && <> · {saved.length} saved</>}</p>
        {lead && <Card feature p={lead} saved={saved.includes(lead.id)} onSave={save} onAdd={add} />}
        <motion.div layout className="grid"><AnimatePresence mode="popLayout">{rest.map(p => <Card key={p.id} p={p} saved={saved.includes(p.id)} onSave={save} onAdd={add} />)}</AnimatePresence></motion.div>
        {filtered.length === 0 && <div className="empty"><p>Nothing matches “{search}”.</p><button className="btn btn-quiet" onClick={reset}>Show everything</button></div>}
      </section>

      <section className="story wrap" id="story">
        <Unveil className="story-photo ph"><Img src={photos.pour} alt="Coffee being poured over freshly roasted beans" /></Unveil>
        <Reveal className="story-copy"><h2>We roast on Mondays, bake before sunrise, <i>and never rush your table.</i></h2><p>VYRA began as one grinder and a long counter. Today it is still the same idea: fewer things, made well, handed over warm. Stay for one cup or for the whole afternoon.</p><button className="btn btn-quiet" onClick={() => goTo('visit', 'Visit')}>Find the café <ArrowRight size={16} /></button></Reveal>
      </section>

      <section className="offer" aria-labelledby="offer-h"><div className="wrap offer-in">
        <Reveal className="offer-copy"><h2 id="offer-h">Eighteen hours for one glass.</h2><p>Our cold brew steeps overnight, then meets wildflower honey and oat milk. Best at 3 pm, over ice.</p><button className="btn btn-light" onClick={() => { setCategory('Drinks'); goTo('menu', 'Menu'); }}>See the cold drinks <ArrowRight size={16} /></button></Reveal>
        <Unveil className="offer-photo ph"><Img src={photos.cold} alt="Iced coffee in a glass" /></Unveil>
      </div></section>

      <section className="visit" id="visit" aria-labelledby="visit-h"><div className="wrap">
        <Reveal><h2 id="visit-h">Come as <i>you are.</i></h2></Reveal>
        <div className="visit-grid">
          <Reveal className="vcol"><h3>14 Willow Lane</h3><p>Between your usual route and your favourite detour.</p><button className="btn btn-light" onClick={() => say('Demo address: 14 Willow Lane')}>Get directions <ArrowRight size={16} /></button></Reveal>
          <Reveal className="vcol" delay={.08}><h3>Every day, 8 am to 8 pm</h3><p>Early birds and late lingerers get the same warm welcome.</p><button className="btn btn-ghost" onClick={() => say('Open daily, 8 am to 8 pm')}>Plan your visit</button></Reveal>
        </div></div>
      </section>
    </main>

    <footer className="footer"><div className="wrap foot-in">
      <a className="logo logo-lg" href="#home">Vyra<span className="logo-dot" /></a>
      <div className="foot-col"><b>Explore</b><button onClick={() => goTo('menu', 'Menu')}>Menu</button><button onClick={() => goTo('story', 'Story')}>Our story</button><button onClick={() => goTo('visit', 'Visit')}>Visit</button></div>
      <div className="foot-col"><b>Say hello</b><span>hello@vyra.coffee</span><span>14 Willow Lane</span></div>
      <div className="foot-base"><span>© 2025 VYRA Coffee House. Portfolio concept, no real orders.</span><button onClick={() => goTo('home', 'Home')}>Back to top</button></div>
    </div></footer>

    <nav className="dock" aria-label="Mobile">{[['Home', 'home', Home], ['Menu', 'menu', UtensilsCrossed], ['Story', 'story', BookOpen], ['Visit', 'visit', MapPin]].map(([l, id, I]) => <button key={l} className={tab === l ? 'on' : ''} aria-current={tab === l ? 'page' : undefined} onClick={() => goTo(id, l)}><I size={20} /><span>{l}</span></button>)}
      <button onClick={() => setCartOpen(true)} aria-label={`Bag, ${count} items`}><span className="dock-bag"><ShoppingBag size={20} />{count > 0 && <i>{count}</i>}</span><span>Bag</span></button></nav>

    <AnimatePresence>{menuOpen && <><motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeMenu} />
      <motion.aside className="drawer drawer-l" role="dialog" aria-modal="true" aria-label="Menu" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ duration: .5, ease }}>
        <div className="drawer-head"><span className="logo">Vyra<span className="logo-dot" /></span><button className="icon-btn" aria-label="Close menu" onClick={closeMenu}><X size={20} /></button></div>
        {[['The menu', 'menu', 'Menu'], ['Our story', 'story', 'Story'], ['Visit', 'visit', 'Visit']].map(([l, id, t]) => <button className="drawer-link" key={l} onClick={() => goTo(id, t)}>{l}</button>)}
      </motion.aside></>}</AnimatePresence>

    <AnimatePresence>{cartOpen && <><motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeCart} />
      <motion.aside className="drawer drawer-r" role="dialog" aria-modal="true" aria-label="Your bag" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: .5, ease }}>
        <div className="drawer-head"><h2>Your bag <span>({count})</span></h2><button className="icon-btn" aria-label="Close bag" onClick={closeCart}><X size={20} /></button></div>
        {count === 0 ? <div className="cart-empty"><Coffee size={28} /><h3>Your bag is empty.</h3><p>Add a drink or something baked to get started.</p><button className="btn btn-primary" onClick={() => goTo('menu', 'Menu')}>Browse the menu</button></div> : <>
          <ul className="lines"><AnimatePresence initial={false}>{products.filter(p => cart[p.id]).map(p => <motion.li layout key={p.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: .35, ease }}>
            <div className="line"><Img src={p.image} alt="" className="line-img" /><div className="line-mid"><h3>{p.name}</h3><span>{money(p.price)}</span>
              <div className="qty"><button aria-label={`Decrease ${p.name}`} onClick={() => qty(p.id, -1)}><Minus size={14} /></button><motion.span key={cart[p.id]} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} aria-live="polite">{cart[p.id]}</motion.span><button aria-label={`Increase ${p.name}`} onClick={() => qty(p.id, 1)}><Plus size={14} /></button></div></div>
              <b>{money(p.price * cart[p.id])}</b></div></motion.li>)}</AnimatePresence></ul>
          <div className="checkout"><div className="sub"><span>Subtotal</span><b>{money(total)}</b></div><p>Frontend demo: checkout and payment are not connected.</p><button className="btn btn-primary wide" onClick={() => say('Demo only. No order was placed.')}>Continue to checkout</button></div></>}
      </motion.aside></>}</AnimatePresence>

    <AnimatePresence>{notice && <motion.div className="toast" role="status" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}><Check size={16} />{notice}</motion.div>}</AnimatePresence>
  </div></MotionConfig>;
}
createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
