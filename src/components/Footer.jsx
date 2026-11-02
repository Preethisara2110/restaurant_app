export default function Footer() {
  return <footer className="footer"><div className="container footer-inner">
    <span className="footer-brand">table<span>ease</span></span>
    <span>Find a table. Make it memorable.</span>
    <span>© {new Date().getFullYear()} TableEase</span>
  </div></footer>;
}
