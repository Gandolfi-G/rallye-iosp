#!/usr/bin/env python3
from pathlib import Path

PAGE_WIDTH = 595
PAGE_HEIGHT = 842

CARDS = [
  {"slug": "alpha", "name": "ALPHA", "glyph": "a", "code": "K2"},
  {"slug": "beta", "name": "BETA", "glyph": "b", "code": "M4"},
  {"slug": "gamma", "name": "GAMMA", "glyph": "g", "code": "Q7"},
  {"slug": "delta", "name": "DELTA", "glyph": "d", "code": "T1"},
  {"slug": "epsilon", "name": "EPSILON", "glyph": "e", "code": "L8"},
  {"slug": "omega", "name": "OMEGA", "glyph": "w", "code": "R3"},
]


def escape_pdf_text(value: str) -> str:
  return value.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def stream_object(content: bytes) -> bytes:
  return b"<< /Length " + str(len(content)).encode("ascii") + b" >>\nstream\n" + content + b"endstream"


def estimate_text_width(size: int, text: str, avg_width: float = 0.62) -> float:
  return len(text) * size * avg_width


def text_cmd(font: str, size: int, x: float, y: float, text: str) -> str:
  escaped = escape_pdf_text(text)
  return f"BT /{font} {size} Tf 1 0 0 1 {x:.1f} {y:.1f} Tm ({escaped}) Tj ET"


def build_pdf(card: dict) -> bytes:
  name = card["name"]
  code = card["code"]
  glyph = card["glyph"]

  title_size = 28
  glyph_size = 530
  code_size = 250
  body_size = 16

  title_x = (PAGE_WIDTH - estimate_text_width(title_size, name)) / 2
  code_x = (PAGE_WIDTH - estimate_text_width(code_size, code)) / 2
  footer = f"Etape {name} : saisir ce code dans l'application"
  footer_x = (PAGE_WIDTH - estimate_text_width(body_size, footer, 0.5)) / 2

  front_commands = [
    "0 g",
    text_cmd("FTitle", title_size, title_x, 760, name),
    text_cmd("FGreek", glyph_size, 190, 200, glyph),
  ]
  back_commands = [
    "0 g",
    text_cmd("FTitle", title_size, (PAGE_WIDTH - estimate_text_width(title_size, f"CODE {name}")) / 2, 760, f"CODE {name}"),
    text_cmd("FCode", code_size, code_x, 300, code),
    text_cmd("FBody", body_size, footer_x, 120, footer),
  ]

  front_stream = stream_object(("\n".join(front_commands) + "\n").encode("latin-1"))
  back_stream = stream_object(("\n".join(back_commands) + "\n").encode("latin-1"))

  objects = {
    1: b"<< /Type /Catalog /Pages 2 0 R >>",
    2: b"<< /Type /Pages /Kids [9 0 R 10 0 R] /Count 2 >>",
    3: b"<< /Type /Font /Subtype /Type1 /BaseFont /Symbol >>",
    4: b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    5: b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    6: b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    7: front_stream,
    8: back_stream,
    9: b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /FGreek 3 0 R /FTitle 4 0 R /FCode 5 0 R /FBody 6 0 R >> >> /Contents 7 0 R >>",
    10: b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /FGreek 3 0 R /FTitle 4 0 R /FCode 5 0 R /FBody 6 0 R >> >> /Contents 8 0 R >>",
  }

  pdf = b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n"
  offsets = [0]

  for object_id in range(1, len(objects) + 1):
    offsets.append(len(pdf))
    obj_header = f"{object_id} 0 obj\n".encode("ascii")
    obj_footer = b"\nendobj\n"
    pdf += obj_header + objects[object_id] + obj_footer

  xref_offset = len(pdf)
  pdf += f"xref\n0 {len(objects) + 1}\n".encode("ascii")
  pdf += b"0000000000 65535 f \n"
  for offset in offsets[1:]:
    pdf += f"{offset:010d} 00000 n \n".encode("ascii")

  pdf += f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref_offset}\n%%EOF\n".encode(
    "ascii"
  )
  return pdf


def main() -> None:
  output_dir = Path("docs/pdfs-plainpalais")
  output_dir.mkdir(parents=True, exist_ok=True)

  for card in CARDS:
    pdf_bytes = build_pdf(card)
    output_path = output_dir / f"plainpalais-{card['slug']}.pdf"
    output_path.write_bytes(pdf_bytes)
    print(f"generated: {output_path}")


if __name__ == "__main__":
  main()
