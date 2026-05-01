# IEDC Document Generator — Quick Start

## First-time Setup

### Backend
```powershell
cd d:\Works\IEDC_DocGen\backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
playwright install chromium
```
```powershell
cd d:\Works\IEDC_DocGen\backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload --port 8000
```
## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/templates` | List all templates |
| GET | `/templates/{name}` | Get schema + HTML |
| POST | `/preview` | `{name, data}` → HTML string |
| POST | `/generate/pdf` | `{name, data}` → PDF download |
| GET | `/health` | Backend health check |

## Adding New Templates

1. Create `backend/schemas/your_template.json` with fields array
2. Create `backend/templates/your_template.html` as Jinja2 template
3. Restart backend — it appears automatically on the dashboard
