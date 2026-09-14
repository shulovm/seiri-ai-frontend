"""Verify current TEI extraction provenance, not historical manuscript authenticity."""
import json
from pathlib import Path
import xml.etree.ElementTree as ET

base = Path(__file__).resolve().parent
full = ET.parse(base / 'evidence/frus1904.official-tei.xml')
checked = []
for path in sorted((base / 'evidence').glob('frus1904-d*.xml')):
    doc = path.stem.split('-')[-1]
    element = full.find(f'.//*[@xml:id="{doc}"]', {'xml': 'http://www.w3.org/XML/1998/namespace'})
    assert element is not None
    assert ET.tostring(element, encoding='unicode') == path.read_text()
    assert ' '.join(''.join(element.itertext()).split()) == path.with_suffix('.txt').read_text()
    ET.parse(path)
    checked.append(doc)
result = dict(checked_document_ids=checked, xml_well_formed=True,
              element_serialization_matches_download=True, normalized_text_matches=True,
              historical_originals_authenticated=False)
(base / 'replay/tei-extraction-validation.json').write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps(result))
