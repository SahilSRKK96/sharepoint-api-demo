# KTMB2 POC - High Level Architecture

## Scope: Public Access Portal (Bulletins & Articles)

```mermaid
flowchart TB
    subgraph Users["PUBLIC USERS"]
        U[("No Login Required")]
    end

    subgraph Azure["AZURE"]
        FE["Web App (Frontend)<br/>Next.js<br/><br/>• Bulletins Page<br/>• Articles Page"]
        BE["API Layer (Backend)<br/>Express.js"]
    end

    subgraph M365["MICROSOFT 365"]
        SP["SharePoint Online<br/><br/>• Bulletins List<br/>• Articles List"]
    end

    U --> FE
    FE -->|REST API| BE
    BE -->|Microsoft Graph API| SP
```

---

## Summary

| Component | Technology | Purpose |
|-----------|------------|---------|
| Frontend | Next.js on Azure | Public-facing web pages |
| Backend | Express.js | REST API to SharePoint |
| Data | SharePoint Lists | Content storage (Bulletins, Articles) |

---

## What This POC Demonstrates

1. **Azure-hosted frontend** serving public content
2. **SharePoint as data backend** - no separate database needed
3. **Read-only public access** - no authentication required
