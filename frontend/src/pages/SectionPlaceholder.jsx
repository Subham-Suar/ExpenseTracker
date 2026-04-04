function SectionPlaceholder({ eyebrow, title, description }) {
  return (
    <section className="content-shell">
      <div className="hero-panel">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p className="hero-copy">{description}</p>
      </div>
    </section>
  );
}

export default SectionPlaceholder;
