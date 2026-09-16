import React, { useEffect, useRef } from 'react';

const sections = [['entity', 'Entity'], ['worldline', 'Worldline'], ['observations', 'Observations'], ['claims', 'Claims']];

export default function EntityNavigation({ entity, projectId }) {
  const bar = useRef(null);
  useEffect(() => {
    const element = bar.current;
    const main = element.closest('main');
    const measure = () => main.style.setProperty('--hi-context-height', `${element.getBoundingClientRect().height}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    // Async canonical reads may finish after the browser's initial fragment scroll.
    // Only these presentation anchors are handled; fragments never select records.
    const jump = () => {
      const id = window.location.hash.slice(1);
      if (!['top', ...sections.map(([key]) => key)].includes(id)) return;
      const target = main.querySelector(`#${id}`) || (id === 'top' ? main : null);
      if (target) { target.focus({ preventScroll: true }); target.scrollIntoView({ block: 'start' }); }
    };
    const frame = requestAnimationFrame(jump);
    window.addEventListener('hashchange', jump);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('hashchange', jump); };
  }, [entity.id, projectId]);

  return <aside ref={bar} className="hi-retained-context" aria-label="Current Entity and page navigation">
    <div className="hi-retained-identity">
      <a className="hi-retained-label" href="#entity" title={entity.label}>{entity.label}</a>
      <code>{entity.kind}</code>
    </div>
    <nav aria-label="Page sections">
      {sections.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
    </nav>
    <nav className="hi-context-actions" aria-label="Return navigation">
      <a href={`/reality/${encodeURIComponent(projectId)}`}>Project</a>
      <a href="#top">Back to top</a>
    </nav>
  </aside>;
}
