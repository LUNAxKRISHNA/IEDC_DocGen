import json
import uuid
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from jinja2 import Environment, FileSystemLoader
from pydantic import BaseModel

app = FastAPI(title="IEDC Document Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).parent
SCHEMAS_DIR = BASE_DIR / "schemas"
TEMPLATES_DIR = BASE_DIR / "templates"
GENERATED_DIR = BASE_DIR / "generated"
GENERATED_DIR.mkdir(exist_ok=True)

jinja_env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)))


class PreviewRequest(BaseModel):
    name: str
    data: dict


class GenerateRequest(BaseModel):
    name: str
    data: dict


def load_schema(name: str) -> dict:
    path = SCHEMAS_DIR / f"{name}.json"
    if not path.exists():
        raise HTTPException(status_code=404, detail=f"Template '{name}' not found")
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def render_template(name: str, data: dict) -> str:
    tpl_path = TEMPLATES_DIR / f"{name}.html"
    if not tpl_path.exists():
        raise HTTPException(status_code=404, detail=f"HTML template '{name}' not found")
    template = jinja_env.get_template(f"{name}.html")
    return template.render(**data)


@app.get("/templates")
def list_templates():
    templates = []
    for schema_file in sorted(SCHEMAS_DIR.glob("*.json")):
        with open(schema_file, encoding="utf-8") as f:
            schema = json.load(f)
        templates.append({
            "id": schema_file.stem,
            "name": schema.get("name", schema_file.stem),
            "description": schema.get("description", ""),
            "icon": schema.get("icon", "📄"),
        })
    return templates


@app.get("/templates/{name}")
def get_template(name: str):
    schema = load_schema(name)
    tpl_path = TEMPLATES_DIR / f"{name}.html"
    template_html = tpl_path.read_text(encoding="utf-8") if tpl_path.exists() else ""
    return {"schema": schema, "template": template_html}


@app.post("/preview")
def preview(req: PreviewRequest):
    html = render_template(req.name, req.data)
    return {"html": html}


@app.post("/generate/pdf")
async def generate_pdf(req: GenerateRequest):
    html = render_template(req.name, req.data)
    out_path = GENERATED_DIR / f"{req.name}_{uuid.uuid4().hex[:8]}.pdf"

    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.set_content(html, wait_until="networkidle")
        await page.pdf(
            path=str(out_path),
            format="A4",
            print_background=True,
            margin={"top": "0", "bottom": "0", "left": "0", "right": "0"},
        )
        await browser.close()

    return FileResponse(
        str(out_path),
        media_type="application/pdf",
        filename=f"{req.name}.pdf",
    )





@app.get("/health")
def health():
    return {"status": "ok"}
